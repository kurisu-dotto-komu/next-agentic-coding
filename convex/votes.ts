import { v } from "convex/values";

import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const setVote = mutation({
  args: {
    userId: v.id("users"),
    vote: v.union(v.literal("O"), v.literal("X")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("votes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        vote: args.vote,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("votes", {
        userId: args.userId,
        vote: args.vote,
        updatedAt: Date.now(),
      });
    }
  },
});

export const clearVote = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("votes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        vote: null,
        updatedAt: Date.now(),
      });
    }
  },
});

export const getCurrentVotes = query({
  args: {},
  handler: async (ctx) => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const activeUsers = await ctx.db
      .query("users")
      .withIndex("by_last_seen")
      .filter((q) => q.gt(q.field("lastSeen"), fiveMinutesAgo))
      .collect();

    const userIds = activeUsers.map((user) => user._id);
    const votes = await ctx.db.query("votes").collect();

    const voteMap = new Map<string, Doc<"votes">>();
    for (const vote of votes) {
      if (userIds.includes(vote.userId)) {
        voteMap.set(vote.userId, vote);
      }
    }

    return activeUsers.map((user) => {
      const vote = voteMap.get(user._id);
      return {
        _id: user._id,
        sessionId: user.sessionId,
        avatarSeed: user.avatarSeed,
        currentVote: vote?.vote ?? null,
      };
    });
  },
});

export const getVoteStats = query({
  args: {},
  handler: async (ctx) => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const activeUsers = await ctx.db
      .query("users")
      .withIndex("by_last_seen")
      .filter((q) => q.gt(q.field("lastSeen"), fiveMinutesAgo))
      .collect();

    const userIds = activeUsers.map((user) => user._id);
    const votes = await ctx.db.query("votes").collect();

    let votingO = 0;
    let votingX = 0;

    for (const vote of votes) {
      if (userIds.includes(vote.userId)) {
        if (vote.vote === "O") votingO++;
        else if (vote.vote === "X") votingX++;
      }
    }

    return {
      total: activeUsers.length,
      votingO,
      votingX,
      notVoting: activeUsers.length - votingO - votingX,
    };
  },
});
