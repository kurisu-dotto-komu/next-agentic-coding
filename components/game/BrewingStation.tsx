"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { INGREDIENTS, GAME_CONSTANTS } from "@/lib/game/constants";

interface BrewingStationProps {
  playerId: Id<"players">;
  shopId: Id<"coffeeShops">;
  onClose: () => void;
}

interface GameState {
  targetRecipe?: {
    name: string;
    ingredients: string[];
    difficulty: number;
  };
  startTime?: number;
  temperature: number;
  isBrewComplete: boolean;
  score?: number;
}

export default function BrewingStation({
  playerId,
  shopId,
  onClose,
}: BrewingStationProps) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    temperature: 90,
    isBrewComplete: false,
  });
  const [timeElapsed, setTimeElapsed] = useState(0);

  const startGame = useMutation(api.games.startBrewingGame);
  const submitResult = useMutation(api.games.submitBrewingResult);

  useEffect(() => {
    // Start the game when component mounts
    startGame({ playerId, shopId }).then((result) => {
      setGameState((prev) => ({
        ...prev,
        targetRecipe: {
          ...result.targetRecipe,
          ingredients: [...result.targetRecipe.ingredients],
        },
        startTime: result.startTime,
      }));
    });
  }, [playerId, shopId, startGame]);

  useEffect(() => {
    // Timer
    if (gameState.startTime && !gameState.isBrewComplete) {
      const interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - gameState.startTime!) / 1000));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [gameState.startTime, gameState.isBrewComplete]);

  const addIngredient = (ingredient: string) => {
    if (ingredients.length < GAME_CONSTANTS.BREWING.MAX_INGREDIENTS) {
      setIngredients([...ingredients, ingredient]);
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const adjustTemperature = (delta: number) => {
    setGameState((prev) => ({
      ...prev,
      temperature: Math.max(70, Math.min(100, prev.temperature + delta)),
    }));
  };

  const completeBrewing = async () => {
    if (!gameState.targetRecipe || ingredients.length === 0) return;

    setGameState((prev) => ({ ...prev, isBrewComplete: true }));

    const result = await submitResult({
      playerId,
      ingredients,
      brewTime: timeElapsed,
      temperature: gameState.temperature,
      targetRecipeName: gameState.targetRecipe.name,
    });

    setGameState((prev) => ({ ...prev, score: result.score }));
  };

  if (gameState.score) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card variant="elevated" className="w-full max-w-lg">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-100">
              Brew Complete!
            </h2>
            <div className="text-6xl font-bold text-amber-600">
              {gameState.score}
            </div>
            <p className="text-lg">Points earned!</p>
            <Button onClick={onClose} variant="primary" className="w-full">
              Continue
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card variant="elevated" className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
            Brewing Station
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {gameState.targetRecipe && (
          <div className="mb-4 p-3 bg-amber-100 dark:bg-amber-900 rounded">
            <h3 className="font-semibold">
              Target Recipe: {gameState.targetRecipe.name}
            </h3>
            <p className="text-sm">
              Difficulty: {"☕".repeat(gameState.targetRecipe.difficulty)}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Time: {timeElapsed}s</h3>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Temp: {gameState.temperature}°C</h3>
              <Button
                onClick={() => adjustTemperature(-5)}
                variant="secondary"
                className="px-2"
              >
                -
              </Button>
              <Button
                onClick={() => adjustTemperature(5)}
                variant="secondary"
                className="px-2"
              >
                +
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Select Ingredients:</h3>
            <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
              {INGREDIENTS.map((ingredient) => (
                <Button
                  key={ingredient}
                  onClick={() => addIngredient(ingredient)}
                  variant="secondary"
                  disabled={
                    ingredients.length >= GAME_CONSTANTS.BREWING.MAX_INGREDIENTS
                  }
                  className="text-sm"
                >
                  {ingredient}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Your Recipe:</h3>
            <div className="min-h-[60px] bg-amber-50 dark:bg-amber-950 rounded p-2">
              {ingredients.length === 0 ? (
                <p className="text-gray-500 text-sm">No ingredients selected</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="bg-amber-600 text-white px-2 py-1 rounded text-sm cursor-pointer"
                      onClick={() => removeIngredient(index)}
                    >
                      {ingredient} ×
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={completeBrewing}
            variant="primary"
            loading={gameState.isBrewComplete}
            disabled={ingredients.length === 0 || !gameState.targetRecipe}
            className="w-full"
          >
            {gameState.isBrewComplete
              ? "Calculating Score..."
              : "Complete Brew"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
