"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import CoffeeShop from "@/components/game/CoffeeShop";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { usePlayer } from "@/hooks/usePlayer";

export default function GamePage() {
  const router = useRouter();
  const [playerId, setPlayerId] = useState<Id<"players"> | null>(null);
  const { player, isLoading } = usePlayer(playerId || undefined);

  useEffect(() => {
    const storedPlayerId = localStorage.getItem("playerId");
    if (!storedPlayerId) {
      router.push("/character");
      return;
    }
    setPlayerId(storedPlayerId as Id<"players">);
  }, [router]);

  if (!playerId || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (!player) {
    router.push("/character");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
            Coffee Quest
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              Level {player.level} | {player.experience} XP
            </span>
            <span className="font-semibold">{player.name}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <CoffeeShop playerId={playerId} />
      </main>
    </div>
  );
}
