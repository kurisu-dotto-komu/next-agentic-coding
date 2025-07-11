"use client";

import { useEffect, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useCoffeeShop } from "@/hooks/useCoffeeShop";
import { usePlayer } from "@/hooks/usePlayer";
import Character from "./Character";
import BrewingStation from "./BrewingStation";
import LatteArtCanvas from "./LatteArtCanvas";
import RecipeBook from "./RecipeBook";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Card from "@/components/ui/Card";
import { calculatePlayerPosition } from "@/lib/game/utils";

interface CoffeeShopProps {
  playerId: Id<"players">;
}

export default function CoffeeShop({ playerId }: CoffeeShopProps) {
  const { player } = usePlayer(playerId);
  const [currentShopId, setCurrentShopId] = useState<Id<"coffeeShops"> | null>(
    null,
  );
  const { shopWithPlayers, isLoading, joinShop, getOrCreateDefaultShop } =
    useCoffeeShop(currentShopId || undefined);

  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  useEffect(() => {
    async function setupShop() {
      if (player?.currentShopId) {
        setCurrentShopId(player.currentShopId);
      } else {
        // Join default shop
        const defaultShopId = await getOrCreateDefaultShop();
        await joinShop({ shopId: defaultShopId, playerId });
        setCurrentShopId(defaultShopId);
      }
    }

    setupShop();
  }, [player, playerId, joinShop, getOrCreateDefaultShop]);

  if (isLoading || !shopWithPlayers) {
    return <LoadingSpinner />;
  }

  const handleStationClick = (station: string) => {
    setSelectedStation(station);
  };

  const closeStation = () => {
    setSelectedStation(null);
  };

  return (
    <div className="relative w-full h-[600px] mx-auto">
      <Card variant="flat" className="h-full overflow-hidden">
        <div className="relative w-full h-full bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800">
          {/* Coffee Shop Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-32 h-24 bg-amber-700 rounded-lg"></div>
            <div className="absolute top-20 right-20 w-32 h-24 bg-amber-700 rounded-lg"></div>
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-40 h-32 bg-amber-800 rounded-lg"></div>
          </div>

          {/* Game Stations */}
          <div
            className="absolute top-20 left-20 w-32 h-24 bg-amber-600 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow flex items-center justify-center"
            onClick={() => handleStationClick("brewing")}
            data-testid="brewing-station"
          >
            <span className="text-white font-bold">Brewing</span>
          </div>

          <div
            className="absolute top-20 right-20 w-32 h-24 bg-amber-600 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow flex items-center justify-center"
            onClick={() => handleStationClick("latte-art")}
          >
            <span className="text-white font-bold">Latte Art</span>
          </div>

          <div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-40 h-32 bg-amber-700 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow flex items-center justify-center"
            onClick={() => handleStationClick("recipes")}
          >
            <span className="text-white font-bold">Recipe Book</span>
          </div>

          {/* Players */}
          {shopWithPlayers.players.map((p, index) => {
            if (!p) return null;
            const position = calculatePlayerPosition(
              index,
              shopWithPlayers.players.length,
            );
            return (
              <Character
                key={p._id}
                player={p}
                position={position}
                isCurrentPlayer={p._id === playerId}
              />
            );
          })}

          {/* Shop Info */}
          <div className="absolute top-4 left-4 text-sm">
            <h3 className="font-bold text-amber-900 dark:text-amber-100">
              {shopWithPlayers.name}
            </h3>
            <p className="text-amber-700 dark:text-amber-300">
              {shopWithPlayers.players.length} / {shopWithPlayers.capacity}{" "}
              players
            </p>
          </div>
        </div>
      </Card>

      {/* Mini-game Modals */}
      {selectedStation === "brewing" && currentShopId && (
        <BrewingStation
          playerId={playerId}
          shopId={currentShopId}
          onClose={closeStation}
        />
      )}

      {selectedStation === "latte-art" && (
        <LatteArtCanvas playerId={playerId} onClose={closeStation} />
      )}

      {selectedStation === "recipes" && (
        <RecipeBook playerId={playerId} onClose={closeStation} />
      )}
    </div>
  );
}
