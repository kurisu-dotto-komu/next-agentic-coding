"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLeaderboard, usePlayerRank } from "@/hooks/useGame";
import { usePlayer } from "@/hooks/usePlayer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { GameType } from "@/lib/game/constants";
import { Id } from "@/convex/_generated/dataModel";

export default function LeaderboardPage() {
  const router = useRouter();
  const [selectedGameType, setSelectedGameType] = useState<
    GameType | undefined
  >();
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "all">("all");

  const { topPlayers, isLoading } = useLeaderboard(selectedGameType, timeframe);

  const currentPlayerId =
    typeof window !== "undefined" ? localStorage.getItem("playerId") : null;
  const { player } = usePlayer(
    currentPlayerId ? (currentPlayerId as Id<"players">) : undefined,
  );
  const { playerRank } = usePlayerRank(
    currentPlayerId ? (currentPlayerId as Id<"players">) : undefined,
    selectedGameType,
  );

  const gameTypes: { value: GameType | undefined; label: string }[] = [
    { value: undefined, label: "All Games" },
    { value: "brewing", label: "Brewing" },
    { value: "latte_art", label: "Latte Art" },
    { value: "speed_prep", label: "Speed Prep" },
  ];

  const timeframes: { value: typeof timeframe; label: string }[] = [
    { value: "daily", label: "Today" },
    { value: "weekly", label: "This Week" },
    { value: "all", label: "All Time" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-100">
            ☕ Global Leaderboard
          </h1>
          <Button onClick={() => router.push("/game")} variant="secondary">
            Back to Game
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2">
            {gameTypes.map((type) => (
              <Button
                key={type.label}
                onClick={() => setSelectedGameType(type.value)}
                variant={
                  selectedGameType === type.value ? "primary" : "secondary"
                }
                className="text-sm"
              >
                {type.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            {timeframes.map((tf) => (
              <Button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                variant={timeframe === tf.value ? "primary" : "secondary"}
                className="text-sm"
              >
                {tf.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Player's Rank */}
        {player && playerRank && (
          <Card
            variant="elevated"
            className="mb-6 bg-amber-100 dark:bg-amber-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar seed={player.avatarSeed} size={60} />
                <div>
                  <h3 className="font-bold text-lg">{player.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Your Rank: #{playerRank.rank || "Unranked"} of{" "}
                    {playerRank.totalPlayers}
                  </p>
                </div>
              </div>
              {playerRank.playerStats && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-amber-600">
                    {playerRank.playerStats.totalScore}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Total Points
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Leaderboard */}
        <Card variant="flat" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-200 dark:bg-amber-800">
                <tr>
                  <th className="text-left p-4">Rank</th>
                  <th className="text-left p-4">Player</th>
                  <th className="text-center p-4">Level</th>
                  <th className="text-center p-4">Games</th>
                  <th className="text-center p-4">Avg Score</th>
                  <th className="text-right p-4">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {topPlayers?.map((player, index) => (
                  <tr
                    key={player.playerId}
                    className="border-b border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950"
                  >
                    <td className="p-4">
                      <span className="text-2xl font-bold text-amber-600">
                        {index === 0 && "🥇"}
                        {index === 1 && "🥈"}
                        {index === 2 && "🥉"}
                        {index > 2 && `#${index + 1}`}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar seed={player.avatarSeed} size={40} />
                        <span className="font-semibold">
                          {player.playerName}
                        </span>
                      </div>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-amber-600 font-semibold">
                        Lv. {player.level}
                      </span>
                    </td>
                    <td className="text-center p-4">{player.gamesPlayed}</td>
                    <td className="text-center p-4">{player.averageScore}</td>
                    <td className="text-right p-4">
                      <span className="text-xl font-bold text-amber-600">
                        {player.totalScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!topPlayers || topPlayers.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No scores yet. Be the first to play!
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
