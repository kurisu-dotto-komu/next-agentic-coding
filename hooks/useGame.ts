import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GameType } from "@/lib/game/constants";

export function useGame(playerId: Id<"players">) {
  const playerScores = useQuery(api.games.getPlayerScores, { playerId });
  const recentHighScores = useQuery(api.leaderboard.getRecentHighScores, {
    limit: 5,
  });
  const gameStats = useQuery(api.leaderboard.getGameTypeStats);

  return {
    playerScores,
    recentHighScores,
    gameStats,
    isLoading: playerScores === undefined || recentHighScores === undefined,
  };
}

export function useLeaderboard(gameType?: GameType, timeframe?: string) {
  const topPlayers = useQuery(api.leaderboard.getTopPlayers, {
    gameType,
    timeframe,
    limit: 10,
  });

  return {
    topPlayers,
    isLoading: topPlayers === undefined,
  };
}

export function usePlayerRank(
  playerId: Id<"players"> | undefined | null,
  gameType?: GameType,
) {
  const playerRank = useQuery(
    api.leaderboard.getPlayerRank,
    playerId ? { playerId, gameType } : "skip",
  );

  return {
    playerRank,
    isLoading:
      playerRank === undefined && playerId !== undefined && playerId !== null,
  };
}
