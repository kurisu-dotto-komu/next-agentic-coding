import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { BASE_RECIPES, GAME_CONSTANTS } from "../lib/game/constants";

export const initializeRecipes = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if recipes already exist
    const existingRecipes = await ctx.db.query("recipes").take(1);
    if (existingRecipes.length > 0) return;

    // Insert base recipes
    for (const recipe of BASE_RECIPES) {
      await ctx.db.insert("recipes", {
        name: recipe.name,
        ingredients: [...recipe.ingredients],
        difficulty: recipe.difficulty,
        discoveredBy: undefined,
        timesBrewn: 0,
      });
    }
  },
});

export const discoverRecipe = mutation({
  args: {
    playerId: v.id("players"),
    ingredients: v.array(v.string()),
  },
  handler: async (ctx, { playerId, ingredients }) => {
    const player = await ctx.db.get(playerId);
    if (!player) throw new Error("Player not found");

    // Check if this combination matches any undiscovered recipes
    const allRecipes = await ctx.db.query("recipes").collect();

    for (const recipe of allRecipes) {
      if (recipe.discoveredBy) continue; // Already discovered

      // Check if ingredients match (order doesn't matter)
      const recipeSet = new Set(recipe.ingredients);
      const submittedSet = new Set(ingredients);

      if (
        recipeSet.size === submittedSet.size &&
        [...recipeSet].every((ing) => submittedSet.has(ing))
      ) {
        // Recipe discovered!
        await ctx.db.patch(recipe._id, {
          discoveredBy: playerId,
        });

        // Add to player's unlocked recipes
        const updatedRecipes = [...player.unlockedRecipes, recipe._id];
        await ctx.db.patch(playerId, {
          unlockedRecipes: updatedRecipes,
        });

        // Bonus experience for discovery
        const bonusExp = recipe.difficulty * 100;
        await ctx.db.patch(playerId, {
          experience: player.experience + bonusExp,
        });

        return {
          discovered: true,
          recipeName: recipe.name,
          bonusExperience: bonusExp,
        };
      }
    }

    return { discovered: false };
  },
});

export const getPlayerRecipes = query({
  args: {
    playerId: v.id("players"),
  },
  handler: async (ctx, { playerId }) => {
    const player = await ctx.db.get(playerId);
    if (!player) return [];

    const recipes = await Promise.all(
      player.unlockedRecipes.map((id) => ctx.db.get(id)),
    );

    return recipes.filter((r) => r !== null);
  },
});

export const getAllRecipes = query({
  args: {
    showLocked: v.optional(v.boolean()),
  },
  handler: async (ctx, { showLocked = false }) => {
    const recipes = await ctx.db.query("recipes").collect();

    if (showLocked) {
      return recipes.map((recipe) => ({
        ...recipe,
        isLocked: !recipe.discoveredBy,
      }));
    }

    return recipes.filter((r) => r.discoveredBy);
  },
});

export const brewRecipe = mutation({
  args: {
    playerId: v.id("players"),
    recipeId: v.id("recipes"),
  },
  handler: async (ctx, { playerId, recipeId }) => {
    const player = await ctx.db.get(playerId);
    const recipe = await ctx.db.get(recipeId);

    if (!player || !recipe) throw new Error("Invalid player or recipe");

    // Check if player has unlocked this recipe
    if (!player.unlockedRecipes.includes(recipeId)) {
      throw new Error("Recipe not unlocked");
    }

    // Increment brew count
    await ctx.db.patch(recipeId, {
      timesBrewn: recipe.timesBrewn + 1,
    });

    // Give experience based on recipe difficulty
    const experience = recipe.difficulty * 10;
    await ctx.db.patch(playerId, {
      experience: player.experience + experience,
    });

    return { experience };
  },
});

export const getRecipeHints = query({
  args: {
    playerId: v.id("players"),
  },
  handler: async (ctx, { playerId }) => {
    const player = await ctx.db.get(playerId);
    if (!player) return [];

    const allRecipes = await ctx.db.query("recipes").collect();
    const unlockedIds = new Set(
      player.unlockedRecipes.map((id) => id.toString()),
    );

    // Get locked recipes and provide hints
    const hints = allRecipes
      .filter((recipe) => !unlockedIds.has(recipe._id.toString()))
      .map((recipe) => ({
        difficulty: recipe.difficulty,
        ingredientCount: recipe.ingredients.length,
        hint: generateHint(recipe.ingredients),
      }));

    return hints;
  },
});

function generateHint(ingredients: string[]): string {
  const hints = [
    `Contains ${ingredients.length} ingredients`,
    `Includes ${ingredients.filter((i) => i.includes("Milk")).length > 0 ? "milk" : "no milk"}`,
    `${ingredients.some((i) => i.includes("Espresso")) ? "Espresso-based" : "Not espresso-based"}`,
  ];

  return hints[Math.floor(Math.random() * hints.length)];
}
