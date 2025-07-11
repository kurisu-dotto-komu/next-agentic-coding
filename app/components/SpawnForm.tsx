"use client";

import { useEffect, useState } from "react";

import { useMutation, useQuery } from "convex/react";

import { generateTamagochiSprite } from "@/app/utils/pixelArt";
import { api } from "@/convex/_generated/api";

export default function SpawnForm() {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const spawn = useMutation(api.tamagochis.spawn);
  const userTamagochi = useQuery(api.tamagochis.getUserTamagochi, userId ? { userId } : "skip");

  // Generate or retrieve user ID
  useEffect(() => {
    let storedUserId = localStorage.getItem("tamagochi-user-id");
    if (!storedUserId) {
      storedUserId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("tamagochi-user-id", storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter a name for your tamagochi");
      return;
    }

    if (userTamagochi) {
      setError("You already have an alive tamagochi!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate pixel art on client side
      const pixelData = generateTamagochiSprite(userId + Date.now());
      await spawn({ userId, name: name.trim(), pixelData });
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to spawn tamagochi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h3 className="mb-3 text-lg font-bold">Spawn a Tamagochi</h3>

      {userTamagochi ? (
        <div className="py-4 text-center">
          <p className="mb-2 text-gray-600">You already have a tamagochi!</p>
          <p className="text-sm text-gray-500">Take care of {userTamagochi.name}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name..."
            className="mb-3 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            maxLength={20}
            disabled={isSubmitting}
          />

          {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-gray-300"
          >
            {isSubmitting ? "Spawning..." : "Spawn Tamagochi"}
          </button>
        </form>
      )}
    </div>
  );
}
