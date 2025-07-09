import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    sessionId: v.string(),
    avatarSeed: v.string(),
    lastSeen: v.number(),
  }).index("by_session", ["sessionId"]),

  votes: defineTable({
    userId: v.id("users"),
    vote: v.union(v.literal("O"), v.literal("X"), v.null()),
    timestamp: v.number(),
  }).index("by_user", ["userId"]),
});
