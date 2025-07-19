import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getOrCreateUser = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { lastSeen: Date.now() });
      return existing._id;
    }

    const avatarSeed = crypto.randomUUID();
    return await ctx.db.insert("users", {
      sessionId: args.sessionId,
      avatarSeed,
      createdAt: Date.now(),
      lastSeen: Date.now(),
    });
  },
});

export const updateLastSeen = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { lastSeen: Date.now() });
  },
});

export const listActiveUsers = query({
  args: {},
  handler: async (ctx) => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    return await ctx.db
      .query("users")
      .withIndex("by_last_seen")
      .filter((q) => q.gt(q.field("lastSeen"), fiveMinutesAgo))
      .collect();
  },
});

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});
