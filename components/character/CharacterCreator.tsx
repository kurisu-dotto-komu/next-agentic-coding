"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { generateRandomSeed } from "@/lib/avatar";
import { usePlayer } from "@/hooks/usePlayer";

export default function CharacterCreator() {
  const router = useRouter();
  const { createPlayer } = usePlayer();
  const [playerName, setPlayerName] = useState("");
  const [avatarSeed, setAvatarSeed] = useState(generateRandomSeed());
  const [coffeePreferences, setCoffeePreferences] = useState({
    strength: 3,
    sweetness: 3,
    milk: "dairy",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const playerId = await createPlayer({
        name: playerName,
        avatarSeed,
        coffeePreferences,
      });

      // Store player ID in localStorage for now
      localStorage.setItem("playerId", playerId);

      router.push("/game");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create character. Please try again.",
      );
      setLoading(false);
    }
  };

  const randomizeAvatar = () => {
    setAvatarSeed(generateRandomSeed());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <Avatar seed={avatarSeed} size={120} className="mx-auto mb-4" />
        <Button type="button" variant="secondary" onClick={randomizeAvatar}>
          Randomize Avatar
        </Button>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Character Name
        </label>
        <input
          id="name"
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          required
          minLength={3}
          maxLength={20}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder="Enter your barista name"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Coffee Preferences</h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="strength"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Coffee Strength: {coffeePreferences.strength}
            </label>
            <input
              id="strength"
              type="range"
              min="1"
              max="5"
              value={coffeePreferences.strength}
              onChange={(e) =>
                setCoffeePreferences((prev) => ({
                  ...prev,
                  strength: parseInt(e.target.value),
                }))
              }
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="sweetness"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Sweetness Level: {coffeePreferences.sweetness}
            </label>
            <input
              id="sweetness"
              type="range"
              min="1"
              max="5"
              value={coffeePreferences.sweetness}
              onChange={(e) =>
                setCoffeePreferences((prev) => ({
                  ...prev,
                  sweetness: parseInt(e.target.value),
                }))
              }
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="milk"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Milk Preference
            </label>
            <select
              id="milk"
              value={coffeePreferences.milk}
              onChange={(e) =>
                setCoffeePreferences((prev) => ({
                  ...prev,
                  milk: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="none">No Milk</option>
              <option value="dairy">Dairy Milk</option>
              <option value="oat">Oat Milk</option>
              <option value="soy">Soy Milk</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="text-red-600 text-sm text-center">{error}</div>}

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        disabled={!playerName.trim()}
        className="w-full"
      >
        Create Character
      </Button>
    </form>
  );
}
