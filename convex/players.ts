import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createPlayer = mutation({
  args: {
    name: v.string(),
    avatarSeed: v.string(),
    coffeePreferences: v.object({
      strength: v.number(),
      sweetness: v.number(),
      milk: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    // Check if name already exists
    const existingPlayer = await ctx.db
      .query("players")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existingPlayer) {
      throw new Error("Player name already taken");
    }

    // Create new player
    const playerId = await ctx.db.insert("players", {
      name: args.name,
      avatarSeed: args.avatarSeed,
      level: 1,
      experience: 0,
      unlockedRecipes: [],
      coffeePreferences: args.coffeePreferences,
    });

    return playerId;
  },
});

export const getPlayer = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.playerId);
  },
});

export const getPlayerByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("players")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
  },
});

export const updatePreferences = mutation({
  args: {
    playerId: v.id("players"),
    coffeePreferences: v.object({
      strength: v.number(),
      sweetness: v.number(),
      milk: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.playerId, {
      coffeePreferences: args.coffeePreferences,
    });
  },
});

export const updatePlayerShop = mutation({
  args: {
    playerId: v.id("players"),
    shopId: v.optional(v.id("coffeeShops")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.playerId, {
      currentShopId: args.shopId,
    });
  },
});

export const addExperience = mutation({
  args: {
    playerId: v.id("players"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.playerId);
    if (!player) throw new Error("Player not found");

    const newExperience = player.experience + args.amount;
    const newLevel = Math.floor(newExperience / 100) + 1;

    await ctx.db.patch(args.playerId, {
      experience: newExperience,
      level: newLevel,
    });

    return { newExperience, newLevel };
  },
});
