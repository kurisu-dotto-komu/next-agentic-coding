import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  players: defineTable({
    name: v.string(),
    avatarSeed: v.string(),
    level: v.number(),
    experience: v.number(),
    currentShopId: v.optional(v.id("coffeeShops")),
    unlockedRecipes: v.array(v.id("recipes")),
    coffeePreferences: v.object({
      strength: v.number(), // 1-5
      sweetness: v.number(), // 1-5
      milk: v.string(), // "none", "dairy", "oat", "soy"
    }),
  }).index("by_name", ["name"]),

  coffeeShops: defineTable({
    name: v.string(),
    ownerId: v.id("players"),
    capacity: v.number(),
    style: v.string(), // "modern", "vintage", "cozy"
    activePlayers: v.array(v.id("players")),
    decorations: v.array(v.string()),
  }).index("by_owner", ["ownerId"]),

  recipes: defineTable({
    name: v.string(),
    ingredients: v.array(v.string()),
    difficulty: v.number(), // 1-5
    discoveredBy: v.optional(v.id("players")),
    timesBrewn: v.number(),
  }),

  gameScores: defineTable({
    playerId: v.id("players"),
    gameType: v.string(), // "brewing", "latte_art", "speed_prep"
    score: v.number(),
    timestamp: v.number(),
  })
    .index("by_player", ["playerId"])
    .index("by_game_type", ["gameType", "score"]),
});
