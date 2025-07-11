"use client";

import { useEffect, useState } from "react";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import InteractionButtons from "@/app/components/InteractionButtons";
import SpawnForm from "@/app/components/SpawnForm";
import TamagochiCanvas from "@/app/components/TamagochiCanvas";
import TamagochiStats from "@/app/components/TamagochiStats";

export default function TamagochiPage() {
  const [userId, setUserId] = useState("");
  const tamagochis = useQuery(api.tamagochis.list);
  const userTamagochi = useQuery(api.tamagochis.getUserTamagochi, userId ? { userId } : "skip");

  // Get user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("tamagochi-user-id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  return (
    <div className="container mx-auto max-w-7xl p-4">
      <h1 className="mb-8 text-center text-4xl font-bold">Multiplayer Tamagochi</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TamagochiCanvas />

          {/* Instructions */}
          <div className="mt-4 rounded-lg bg-gray-100 p-4">
            <h3 className="mb-2 font-semibold">How to Play:</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Spawn your own tamagochi and give it a name</li>
              <li>• Watch it move around the game world with other players&apos; pets</li>
              <li>• Keep it alive by feeding, petting, and healing it</li>
              <li>• Click on any tamagochi to pet it</li>
              <li>• Stats decay over time - don&apos;t let them reach zero!</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <SpawnForm />

          {userTamagochi && (
            <>
              <TamagochiStats tamagochi={userTamagochi} />
              <InteractionButtons tamagochiId={userTamagochi._id} stats={userTamagochi.stats} />
            </>
          )}

          {/* Other players' tamagochis */}
          {tamagochis && tamagochis.length > 0 && (
            <div className="rounded-lg bg-white p-4 shadow-md">
              <h3 className="mb-3 text-lg font-bold">Active Tamagochis ({tamagochis.length})</h3>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {tamagochis.map((pet) => (
                  <div
                    key={pet._id}
                    className={`rounded p-2 text-sm ${
                      pet.userId === userId ? "bg-blue-50 font-medium" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{pet.name}</span>
                      <div className="flex gap-4 text-xs">
                        <span className={pet.stats.hunger < 30 ? "text-red-500" : ""}>
                          H: {Math.round(pet.stats.hunger)}
                        </span>
                        <span className={pet.stats.happiness < 30 ? "text-red-500" : ""}>
                          J: {Math.round(pet.stats.happiness)}
                        </span>
                        <span className={pet.stats.health < 30 ? "text-red-500" : ""}>
                          L: {Math.round(pet.stats.health)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
