import { v } from "convex/values";
import { query } from "./_generated/server";
import { GameType } from "../lib/game/constants";

export const getTopPlayers = query({
  args: {
    gameType: v.optional(v.string()),
    timeframe: v.optional(v.string()), // "daily", "weekly", "all"
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { gameType, timeframe = "all", limit = 10 }) => {
    let startTime = 0;
    const now = Date.now();

    switch (timeframe) {
      case "daily":
        startTime = now - 24 * 60 * 60 * 1000;
        break;
      case "weekly":
        startTime = now - 7 * 24 * 60 * 60 * 1000;
        break;
      default:
        startTime = 0;
    }

    // Get scores based on filters
    // Get scores based on filters
    const scoresQuery = gameType
      ? ctx.db
          .query("gameScores")
          .withIndex("by_game_type", (q) =>
            q.eq("gameType", gameType as GameType),
          )
      : ctx.db.query("gameScores");

    const scores = await scoresQuery
      .filter((q) => q.gte(q.field("timestamp"), startTime))
      .collect();

    // Aggregate scores by player
    const playerScores = new Map<
      string,
      { total: number; count: number; playerId: string }
    >();

    for (const score of scores) {
      const key = score.playerId;
      const existing = playerScores.get(key) || {
        total: 0,
        count: 0,
        playerId: score.playerId,
      };
      existing.total += score.score;
      existing.count += 1;
      playerScores.set(key, existing);
    }

    // Sort by total score and get top players
    const sortedPlayers = Array.from(playerScores.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);

    // Get player details
    const topPlayers = await Promise.all(
      sortedPlayers.map(async ({ playerId, total, count }) => {
        const player = await ctx.db.get(playerId as any);
        if (!player) return null;

        return {
          playerId,
          playerName: (player as any).name,
          avatarSeed: (player as any).avatarSeed,
          level: (player as any).level,
          totalScore: total,
          gamesPlayed: count,
          averageScore: Math.round(total / count),
        };
      }),
    );

    return topPlayers.filter((p) => p !== null);
  },
});

export const getPlayerRank = query({
  args: {
    playerId: v.id("players"),
    gameType: v.optional(v.string()),
    timeframe: v.optional(v.string()),
  },
  handler: async (ctx, { playerId, gameType, timeframe = "all" }) => {
    // Re-implement the logic from getTopPlayers to avoid using _handler
    let startTime = 0;
    const now = Date.now();

    switch (timeframe) {
      case "daily":
        startTime = now - 24 * 60 * 60 * 1000;
        break;
      case "weekly":
        startTime = now - 7 * 24 * 60 * 60 * 1000;
        break;
      default:
        startTime = 0;
    }

    const scoresQuery = gameType
      ? ctx.db
          .query("gameScores")
          .withIndex("by_game_type", (q) =>
            q.eq("gameType", gameType as GameType),
          )
      : ctx.db.query("gameScores");

    const scores = await scoresQuery
      .filter((q) => q.gte(q.field("timestamp"), startTime))
      .collect();

    // Aggregate scores by player
    const playerScores = new Map<
      string,
      { total: number; count: number; playerId: string }
    >();

    for (const score of scores) {
      const key = score.playerId;
      const existing = playerScores.get(key) || {
        total: 0,
        count: 0,
        playerId: score.playerId,
      };
      existing.total += score.score;
      existing.count += 1;
      playerScores.set(key, existing);
    }

    // Sort by total score and get all players
    const sortedPlayers = Array.from(playerScores.values()).sort(
      (a, b) => b.total - a.total,
    );

    // Get player details
    const allPlayers = await Promise.all(
      sortedPlayers.map(async ({ playerId: pid, total, count }) => {
        const player = await ctx.db.get(pid as any);
        if (!player) return null;

        return {
          playerId: pid,
          playerName: (player as any).name,
          avatarSeed: (player as any).avatarSeed,
          level: (player as any).level,
          totalScore: total,
          gamesPlayed: count,
          averageScore: Math.round(total / count),
        };
      }),
    );

    const filteredPlayers = allPlayers.filter(
      (p): p is NonNullable<typeof p> => p !== null,
    );
    const playerIndex = filteredPlayers.findIndex(
      (p) => p.playerId === playerId,
    );

    if (playerIndex === -1) {
      return {
        rank: null,
        totalPlayers: filteredPlayers.length,
      };
    }

    return {
      rank: playerIndex + 1,
      totalPlayers: filteredPlayers.length,
      playerStats: filteredPlayers[playerIndex],
    };
  },
});

export const getGameTypeStats = query({
  args: {},
  handler: async (ctx) => {
    const gameTypes: GameType[] = ["brewing", "latte_art", "speed_prep"];

    const stats = await Promise.all(
      gameTypes.map(async (gameType) => {
        const scores = await ctx.db
          .query("gameScores")
          .withIndex("by_game_type", (q) => q.eq("gameType", gameType))
          .collect();

        const totalGames = scores.length;
        const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
        const avgScore =
          totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
        const highScore = Math.max(...scores.map((s) => s.score), 0);

        return {
          gameType,
          totalGames,
          averageScore: avgScore,
          highScore,
        };
      }),
    );

    return stats;
  },
});

export const getRecentHighScores = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 5 }) => {
    const recentScores = await ctx.db
      .query("gameScores")
      .order("desc")
      .take(limit);

    const scoresWithPlayers = await Promise.all(
      recentScores.map(async (score) => {
        const player = await ctx.db.get(score.playerId);
        if (!player) return null;

        return {
          ...score,
          playerName: player.name,
          avatarSeed: player.avatarSeed,
        };
      }),
    );

    return scoresWithPlayers.filter((s) => s !== null);
  },
});
