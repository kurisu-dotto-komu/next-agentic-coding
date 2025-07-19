import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    sessionId: v.string(),
    avatarSeed: v.string(),
    createdAt: v.number(),
    lastSeen: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_last_seen", ["lastSeen"]),

  votes: defineTable({
    userId: v.id("users"),
    vote: v.union(v.literal("O"), v.literal("X"), v.null()),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_updated", ["updatedAt"]),
});
