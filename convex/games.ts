import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { GAME_CONSTANTS, BASE_RECIPES } from "../lib/game/constants";

export const startBrewingGame = mutation({
  args: {
    playerId: v.id("players"),
    shopId: v.id("coffeeShops"),
  },
  handler: async (ctx, { playerId, shopId }) => {
    const player = await ctx.db.get(playerId);
    if (!player) throw new Error("Player not found");

    const targetRecipe =
      BASE_RECIPES[Math.floor(Math.random() * BASE_RECIPES.length)];

    return {
      targetRecipe: {
        name: targetRecipe.name,
        ingredients: targetRecipe.ingredients,
        difficulty: targetRecipe.difficulty,
      },
      startTime: Date.now(),
    };
  },
});

export const submitBrewingResult = mutation({
  args: {
    playerId: v.id("players"),
    ingredients: v.array(v.string()),
    brewTime: v.number(),
    temperature: v.number(),
    targetRecipeName: v.string(),
  },
  handler: async (
    ctx,
    { playerId, ingredients, brewTime, temperature, targetRecipeName },
  ) => {
    const player = await ctx.db.get(playerId);
    if (!player) throw new Error("Player not found");

    const targetRecipe = BASE_RECIPES.find((r) => r.name === targetRecipeName);
    if (!targetRecipe) throw new Error("Recipe not found");

    // Calculate accuracy
    const ingredientMatch = calculateIngredientMatch(ingredients, [
      ...targetRecipe.ingredients,
    ]);
    const tempAccuracy = calculateTemperatureAccuracy(temperature);
    const totalAccuracy = (ingredientMatch + tempAccuracy) / 2;

    // Calculate time bonus
    const timeBonus =
      Math.max(0, GAME_CONSTANTS.BREWING.TIME_BONUS_THRESHOLD - brewTime) *
      GAME_CONSTANTS.BREWING.SPEED_BONUS_MULTIPLIER;

    // Final score
    const baseScore = targetRecipe.baseScore * totalAccuracy;
    const finalScore = Math.round(baseScore + timeBonus);

    // Save score
    await ctx.db.insert("gameScores", {
      playerId,
      gameType: "brewing",
      score: finalScore,
      timestamp: Date.now(),
    });

    // Update player experience
    const experienceGained = Math.floor(
      finalScore / GAME_CONSTANTS.SCORING.EXPERIENCE_DIVISOR,
    );
    const newExperience = player.experience + experienceGained;
    const newLevel =
      Math.floor(newExperience / GAME_CONSTANTS.SCORING.LEVEL_UP_THRESHOLD) + 1;

    await ctx.db.patch(playerId, {
      experience: newExperience,
      level: newLevel,
    });

    return {
      score: finalScore,
      accuracy: totalAccuracy,
      experienceGained,
      newLevel,
      leveledUp: newLevel > player.level,
    };
  },
});

export const submitLatteArtScore = mutation({
  args: {
    playerId: v.id("players"),
    pattern: v.string(),
    similarity: v.number(),
    timeElapsed: v.number(),
  },
  handler: async (ctx, { playerId, pattern, similarity, timeElapsed }) => {
    const player = await ctx.db.get(playerId);
    if (!player) throw new Error("Player not found");

    // Calculate score based on similarity and time
    const baseScore = similarity * GAME_CONSTANTS.SCORING.PERFECT_SCORE;
    const timeBonus =
      Math.max(0, GAME_CONSTANTS.LATTE_ART.DRAWING_TIME - timeElapsed) * 5;
    const finalScore = Math.round(baseScore + timeBonus);

    // Save score
    await ctx.db.insert("gameScores", {
      playerId,
      gameType: "latte_art",
      score: finalScore,
      timestamp: Date.now(),
    });

    // Update experience
    const experienceGained = Math.floor(
      finalScore / GAME_CONSTANTS.SCORING.EXPERIENCE_DIVISOR,
    );
    await ctx.db.patch(playerId, {
      experience: player.experience + experienceGained,
    });

    return {
      score: finalScore,
      experienceGained,
    };
  },
});

export const getPlayerScores = query({
  args: {
    playerId: v.id("players"),
    gameType: v.optional(v.string()),
  },
  handler: async (ctx, { playerId, gameType }) => {
    const query = gameType
      ? ctx.db
          .query("gameScores")
          .withIndex("by_player", (q) => q.eq("playerId", playerId))
          .filter((q) => q.eq(q.field("gameType"), gameType))
      : ctx.db
          .query("gameScores")
          .withIndex("by_player", (q) => q.eq("playerId", playerId));

    return await query.order("desc").take(10);
  },
});

// Helper functions
function calculateIngredientMatch(
  submitted: string[],
  target: string[],
): number {
  const targetSet = new Set(target);
  const submittedSet = new Set(submitted);

  let matches = 0;
  for (const ingredient of targetSet) {
    if (submittedSet.has(ingredient)) matches++;
  }

  // Penalize for extra or missing ingredients
  const extraPenalty = Math.max(0, submitted.length - target.length) * 0.1;
  const missingPenalty = Math.max(0, target.length - matches) * 0.2;

  return Math.max(
    0,
    Math.min(1, matches / target.length - extraPenalty - missingPenalty),
  );
}

function calculateTemperatureAccuracy(temperature: number): number {
  const diff = Math.abs(
    temperature - GAME_CONSTANTS.BREWING.PERFECT_TEMPERATURE,
  );
  if (diff <= GAME_CONSTANTS.BREWING.TEMPERATURE_TOLERANCE) return 1;

  // Gradual decrease in accuracy
  return Math.max(0, 1 - diff / 20);
}
