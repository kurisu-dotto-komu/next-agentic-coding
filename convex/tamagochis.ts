import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

function generateTamagochiSprite(seed: string): string {
  const colors = ["#FF9664", "#64A0FF", "#64FF64", "#C864FF", "#FF96C8", "#FFC864"];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash = hash & hash;
  }
  const color = colors[Math.abs(hash) % colors.length];
  const svg = `<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="12" height="12" fill="${color}" rx="2"/><circle cx="6" cy="6" r="1" fill="black"/><circle cx="10" cy="6" r="1" fill="black"/><path d="M 5 10 Q 8 12 11 10" stroke="black" fill="none"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("tamagochis")
      .filter((q) => q.eq(q.field("alive"), true))
      .collect();
  },
});

export const spawn = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    pixelData: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already has an alive tamagochi
    const existing = await ctx.db
      .query("tamagochis")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("alive"), true))
      .first();

    if (existing) {
      throw new Error("You already have an alive tamagochi!");
    }

    // Use provided pixel data or generate on server
    const pixelData = args.pixelData || generateTamagochiSprite(args.userId + Date.now());

    return await ctx.db.insert("tamagochis", {
      userId: args.userId,
      name: args.name,
      pixelData,
      position: { x: Math.random() * 84, y: Math.random() * 84 }, // Keep away from edges
      velocity: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
      stats: { hunger: 100, happiness: 100, health: 100 },
      alive: true,
      birthTime: Date.now(),
      lastUpdated: Date.now(),
      animations: { current: "idle", startTime: Date.now() },
    });
  },
});

export const interact = mutation({
  args: {
    id: v.id("tamagochis"),
    action: v.union(v.literal("feed"), v.literal("pet"), v.literal("heal")),
  },
  handler: async (ctx, args) => {
    const pet = await ctx.db.get(args.id);
    if (!pet || !pet.alive) return;

    const updates: Partial<typeof pet.stats> = {};
    let animationOverride: string = args.action;

    // Easter egg: Rapid interactions trigger special animations
    const timeSinceLastInteraction = Date.now() - pet.lastUpdated;
    if (timeSinceLastInteraction < 500) {
      // Rapid interaction detected!
      animationOverride = "dance";
    }

    // Easter egg: Max stats trigger celebration
    if (pet.stats.hunger >= 90 && pet.stats.happiness >= 90 && pet.stats.health >= 90) {
      animationOverride = "celebrate";
    }

    switch (args.action) {
      case "feed":
        updates.hunger = Math.min(100, pet.stats.hunger + 30);
        break;
      case "pet":
        updates.happiness = Math.min(100, pet.stats.happiness + 20);
        break;
      case "heal":
        updates.health = Math.min(100, pet.stats.health + 25);
        break;
    }

    await ctx.db.patch(args.id, {
      stats: { ...pet.stats, ...updates },
      animations: { current: animationOverride, startTime: Date.now() },
      lastUpdated: Date.now(),
    });
  },
});

// Background job to update physics and stats
export const updateGameState = mutation({
  handler: async (ctx) => {
    const pets = await ctx.db
      .query("tamagochis")
      .filter((q) => q.eq(q.field("alive"), true))
      .collect();

    for (const pet of pets) {
      const deltaTime = Math.min((Date.now() - pet.lastUpdated) / 1000, 5); // Cap at 5 seconds

      // Update position
      let newX = pet.position.x + pet.velocity.x * deltaTime;
      let newY = pet.position.y + pet.velocity.y * deltaTime;

      // Bounce off walls
      let newVelX = pet.velocity.x;
      let newVelY = pet.velocity.y;

      if (newX < 0 || newX > 84) {
        newVelX *= -1;
        newX = Math.max(0, Math.min(84, newX));
      }
      if (newY < 0 || newY > 84) {
        newVelY *= -1;
        newY = Math.max(0, Math.min(84, newY));
      }

      // Randomly change direction sometimes
      if (Math.random() < 0.01) {
        newVelX = (Math.random() - 0.5) * 2;
        newVelY = (Math.random() - 0.5) * 2;
      }

      // Decay stats
      const statDecay = deltaTime * 0.5; // Slower decay
      const newStats = {
        hunger: Math.max(0, pet.stats.hunger - statDecay),
        happiness: Math.max(0, pet.stats.happiness - statDecay * 0.8),
        health: Math.max(0, pet.stats.health - statDecay * 0.5),
      };

      // Check death conditions
      const alive = newStats.hunger > 0 && newStats.happiness > 0 && newStats.health > 0;

      // Reset animation to idle if it's been more than 2 seconds
      let currentAnimation = pet.animations.current;
      if (Date.now() - pet.animations.startTime > 2000 && currentAnimation !== "idle") {
        currentAnimation = "idle";
      }

      await ctx.db.patch(pet._id, {
        position: { x: newX, y: newY },
        velocity: { x: newVelX, y: newVelY },
        stats: newStats,
        alive,
        lastUpdated: Date.now(),
        animations:
          currentAnimation !== pet.animations.current
            ? { current: currentAnimation, startTime: Date.now() }
            : pet.animations,
      });
    }
  },
});

export const getUserTamagochi = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tamagochis")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("alive"), true))
      .first();
  },
});
