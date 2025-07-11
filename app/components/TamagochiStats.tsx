"use client";

import { Id } from "@/convex/_generated/dataModel";

interface TamagochiStatsProps {
  tamagochi: {
    _id: Id<"tamagochis">;
    name: string;
    stats: {
      hunger: number;
      happiness: number;
      health: number;
    };
    alive: boolean;
    birthTime: number;
  };
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="mb-2">
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{Math.round(value)}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function TamagochiStats({ tamagochi }: TamagochiStatsProps) {
  const age = Math.floor((Date.now() - tamagochi.birthTime) / 1000 / 60); // Age in minutes

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h3 className="mb-3 text-lg font-bold">{tamagochi.name}</h3>

      <div className="mb-3">
        <p className="text-sm text-gray-600">
          Age: {age < 60 ? `${age} minutes` : `${Math.floor(age / 60)} hours`}
        </p>
        <p className="text-sm text-gray-600">
          Status:{" "}
          <span className={tamagochi.alive ? "text-green-600" : "text-red-600"}>
            {tamagochi.alive ? "Alive" : "Dead"}
          </span>
        </p>
      </div>

      <StatBar
        label="Hunger"
        value={tamagochi.stats.hunger}
        color={tamagochi.stats.hunger > 30 ? "bg-green-500" : "bg-red-500"}
      />

      <StatBar
        label="Happiness"
        value={tamagochi.stats.happiness}
        color={tamagochi.stats.happiness > 30 ? "bg-blue-500" : "bg-red-500"}
      />

      <StatBar
        label="Health"
        value={tamagochi.stats.health}
        color={tamagochi.stats.health > 30 ? "bg-purple-500" : "bg-red-500"}
      />
    </div>
  );
}
