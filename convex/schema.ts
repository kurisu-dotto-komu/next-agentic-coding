import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  tamagochis: defineTable({
    userId: v.string(),
    name: v.string(),
    pixelData: v.string(), // Base64 encoded pixel art
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    velocity: v.object({
      x: v.number(),
      y: v.number(),
    }),
    stats: v.object({
      hunger: v.number(), // 0-100
      happiness: v.number(), // 0-100
      health: v.number(), // 0-100
    }),
    alive: v.boolean(),
    birthTime: v.number(),
    lastUpdated: v.number(),
    animations: v.object({
      current: v.string(), // "idle", "eating", "playing", etc.
      startTime: v.number(),
    }),
  })
    .index("by_user", ["userId"])
    .index("by_alive", ["alive"]),
});
