import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const castVote = mutation({
  args: {
    userId: v.id("users"),
    vote: v.union(v.literal("O"), v.literal("X"), v.null()),
  },
  handler: async (ctx, args) => {
    // Check if user already has a vote
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existingVote) {
      // Update existing vote
      await ctx.db.patch(existingVote._id, {
        vote: args.vote,
        timestamp: Date.now(),
      });
      return existingVote._id;
    }

    // Create new vote
    return await ctx.db.insert("votes", {
      userId: args.userId,
      vote: args.vote,
      timestamp: Date.now(),
    });
  },
});

export const getCurrentVotes = query({
  args: {},
  handler: async (ctx) => {
    const votes = await ctx.db.query("votes").collect();
    const votesWithUsers = await Promise.all(
      votes.map(async (vote) => {
        const user = await ctx.db.get(vote.userId);
        return {
          ...vote,
          user,
        };
      }),
    );

    // Filter out votes from inactive users
    const oneMinuteAgo = Date.now() - 60 * 1000; // Changed from 5 minutes to 1 minute
    return votesWithUsers.filter(
      (vote) => vote.user && vote.user.lastSeen >= oneMinuteAgo,
    );
  },
});

export const getVoteStats = query({
  args: {},
  handler: async (ctx) => {
    // Get all active users
    const oneMinuteAgo = Date.now() - 60 * 1000; // Changed from 5 minutes to 1 minute
    const activeUsers = await ctx.db
      .query("users")
      .filter((q) => q.gte(q.field("lastSeen"), oneMinuteAgo))
      .collect();

    if (activeUsers.length === 0) {
      return {
        total: 0,
        O: 0,
        X: 0,
        none: 0,
        percentages: {
          O: 0,
          X: 0,
          none: 100,
        },
      };
    }

    // Get votes for active users
    const votes = await Promise.all(
      activeUsers.map(async (user) => {
        const vote = await ctx.db
          .query("votes")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .first();
        return vote?.vote || null;
      }),
    );

    // Count votes
    const counts = {
      O: votes.filter((v) => v === "O").length,
      X: votes.filter((v) => v === "X").length,
      none: votes.filter((v) => v === null).length,
    };

    const total = activeUsers.length;

    return {
      total,
      ...counts,
      percentages: {
        O: Math.round((counts.O / total) * 100),
        X: Math.round((counts.X / total) * 100),
        none: Math.round((counts.none / total) * 100),
      },
    };
  },
});

export const getUserVote = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const vote = await ctx.db
      .query("votes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    return vote?.vote || null;
  },
});
