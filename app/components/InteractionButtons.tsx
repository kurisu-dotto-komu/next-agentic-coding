"use client";

import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface InteractionButtonsProps {
  tamagochiId: Id<"tamagochis">;
  stats: {
    hunger: number;
    happiness: number;
    health: number;
  };
}

export default function InteractionButtons({ tamagochiId, stats }: InteractionButtonsProps) {
  const interact = useMutation(api.tamagochis.interact);

  const handleInteraction = async (action: "feed" | "pet" | "heal") => {
    await interact({ id: tamagochiId, action });
  };

  const buttons = [
    {
      action: "feed" as const,
      label: "Feed",
      icon: "🍎",
      color: "bg-green-500 hover:bg-green-600",
      statValue: stats.hunger,
      description: "+30 Hunger",
    },
    {
      action: "pet" as const,
      label: "Pet",
      icon: "🤗",
      color: "bg-blue-500 hover:bg-blue-600",
      statValue: stats.happiness,
      description: "+20 Happiness",
    },
    {
      action: "heal" as const,
      label: "Heal",
      icon: "💊",
      color: "bg-purple-500 hover:bg-purple-600",
      statValue: stats.health,
      description: "+25 Health",
    },
  ];

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h3 className="mb-3 text-lg font-bold">Interact</h3>
      <div className="space-y-2">
        {buttons.map(({ action, label, icon, color, statValue, description }) => (
          <button
            key={action}
            onClick={() => handleInteraction(action)}
            disabled={statValue >= 100}
            className={`w-full ${color} flex items-center justify-between rounded-lg px-4 py-3 text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-300`}
          >
            <div className="flex items-center">
              <span className="mr-2 text-xl">{icon}</span>
              <span className="font-medium">{label}</span>
            </div>
            <span className="text-sm opacity-90">{statValue >= 100 ? "Max" : description}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        Click on a tamagochi in the game to pet it!
      </div>
    </div>
  );
}
