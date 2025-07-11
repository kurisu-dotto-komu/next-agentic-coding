"use client";

import { Id } from "@/convex/_generated/dataModel";
import Card from "@/components/ui/Card";

interface RecipeBookProps {
  playerId: Id<"players">; // TODO: Use for loading player's unlocked recipes
  onClose: () => void;
}

export default function RecipeBook({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  playerId, // TODO: Use for loading player's unlocked recipes
  onClose,
}: RecipeBookProps) {
  // TODO: Load recipes from Convex
  const recipes = [
    {
      name: "Espresso",
      ingredients: ["Coffee Beans"],
      difficulty: 1,
      unlocked: true,
    },
    {
      name: "Cappuccino",
      ingredients: ["Espresso", "Steamed Milk", "Milk Foam"],
      difficulty: 2,
      unlocked: true,
    },
    {
      name: "Caramel Macchiato",
      ingredients: ["Espresso", "Vanilla", "Steamed Milk", "Caramel"],
      difficulty: 3,
      unlocked: false,
    },
    {
      name: "Mocha",
      ingredients: ["Espresso", "Chocolate", "Steamed Milk", "Whipped Cream"],
      difficulty: 3,
      unlocked: false,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card
        variant="elevated"
        className="w-full max-w-2xl max-h-[80vh] overflow-auto"
      >
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-gray-800 pb-4">
          <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
            Recipe Book
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipes.map((recipe, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                recipe.unlocked
                  ? "border-amber-600 bg-amber-50 dark:bg-amber-950"
                  : "border-gray-300 bg-gray-100 dark:bg-gray-900 opacity-60"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{recipe.name}</h3>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < recipe.difficulty
                          ? "text-amber-600"
                          : "text-gray-300"
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold">Ingredients:</p>
                {recipe.unlocked ? (
                  <ul className="text-sm text-gray-600 dark:text-gray-400">
                    {recipe.ingredients.map((ingredient, i) => (
                      <li key={i}>• {ingredient}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Recipe not yet discovered
                  </p>
                )}
              </div>

              {recipe.unlocked && (
                <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                  ✓ Unlocked
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
