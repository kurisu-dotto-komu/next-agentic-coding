import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOrCreateUser = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    // Check if user exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (existing) {
      // Update last seen
      await ctx.db.patch(existing._id, { lastSeen: Date.now() });
      return existing._id;
    }

    // Create new user
    return await ctx.db.insert("users", {
      sessionId: args.sessionId,
      avatarSeed: crypto.randomUUID(),
      lastSeen: Date.now(),
    });
  },
});

export const listActiveUsers = query({
  args: {},
  handler: async (ctx) => {
    const oneMinuteAgo = Date.now() - 60 * 1000; // Changed from 5 minutes to 1 minute
    const users = await ctx.db
      .query("users")
      .filter((q) => q.gte(q.field("lastSeen"), oneMinuteAgo))
      .collect();

    return users;
  },
});

export const updateLastSeen = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { lastSeen: Date.now() });
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});
