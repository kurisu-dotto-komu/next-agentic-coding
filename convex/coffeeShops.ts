import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createShop = mutation({
  args: {
    name: v.string(),
    ownerId: v.id("players"),
    style: v.string(),
    capacity: v.number(),
  },
  handler: async (ctx, args) => {
    const shopId = await ctx.db.insert("coffeeShops", {
      name: args.name,
      ownerId: args.ownerId,
      capacity: args.capacity,
      style: args.style,
      activePlayers: [args.ownerId],
      decorations: [],
    });

    // Update player's current shop
    await ctx.db.patch(args.ownerId, {
      currentShopId: shopId,
    });

    return shopId;
  },
});

export const joinShop = mutation({
  args: {
    shopId: v.id("coffeeShops"),
    playerId: v.id("players"),
  },
  handler: async (ctx, args) => {
    const shop = await ctx.db.get(args.shopId);
    if (!shop) throw new Error("Shop not found");

    if (shop.activePlayers.length >= shop.capacity) {
      throw new Error("Coffee shop is full");
    }

    if (!shop.activePlayers.includes(args.playerId)) {
      await ctx.db.patch(args.shopId, {
        activePlayers: [...shop.activePlayers, args.playerId],
      });
    }

    // Update player's current shop
    await ctx.db.patch(args.playerId, {
      currentShopId: args.shopId,
    });
  },
});

export const leaveShop = mutation({
  args: {
    shopId: v.id("coffeeShops"),
    playerId: v.id("players"),
  },
  handler: async (ctx, args) => {
    const shop = await ctx.db.get(args.shopId);
    if (!shop) throw new Error("Shop not found");

    await ctx.db.patch(args.shopId, {
      activePlayers: shop.activePlayers.filter((id) => id !== args.playerId),
    });

    // Clear player's current shop
    await ctx.db.patch(args.playerId, {
      currentShopId: undefined,
    });
  },
});

export const getShopWithPlayers = query({
  args: { shopId: v.id("coffeeShops") },
  handler: async (ctx, args) => {
    const shop = await ctx.db.get(args.shopId);
    if (!shop) return null;

    const players = await Promise.all(
      shop.activePlayers.map((playerId) => ctx.db.get(playerId)),
    );

    return {
      ...shop,
      players: players.filter((p) => p !== null),
    };
  },
});

export const getDefaultShop = query({
  args: {},
  handler: async (ctx) => {
    // Get or create default coffee shop
    let defaultShop = await ctx.db
      .query("coffeeShops")
      .filter((q) => q.eq(q.field("name"), "Central Perk"))
      .first();

    if (!defaultShop) {
      // Create default shop if it doesn't exist
      // This would normally be done in a migration or setup script
      return null;
    }

    return defaultShop;
  },
});

export const getOrCreateDefaultShop = mutation({
  args: {},
  handler: async (ctx) => {
    let defaultShop = await ctx.db
      .query("coffeeShops")
      .filter((q) => q.eq(q.field("name"), "Central Perk"))
      .first();

    if (!defaultShop) {
      // Create a system player for the default shop
      const systemPlayerId = await ctx.db.insert("players", {
        name: "System",
        avatarSeed: "system",
        level: 1,
        experience: 0,
        unlockedRecipes: [],
        coffeePreferences: {
          strength: 3,
          sweetness: 3,
          milk: "dairy",
        },
      });

      const shopId = await ctx.db.insert("coffeeShops", {
        name: "Central Perk",
        ownerId: systemPlayerId,
        capacity: 20,
        style: "cozy",
        activePlayers: [],
        decorations: ["comfy-sofas", "vintage-posters", "warm-lighting"],
      });

      return shopId;
    }

    return defaultShop._id;
  },
});
