export const GAME_CONSTANTS = {
  BREWING: {
    MAX_INGREDIENTS: 5,
    MIN_INGREDIENTS: 2,
    BASE_BREW_TIME: 30, // seconds
    PERFECT_TEMPERATURE: 93, // celsius
    TEMPERATURE_TOLERANCE: 3,
    TIME_BONUS_THRESHOLD: 20, // seconds
    ACCURACY_MULTIPLIER: 100,
    SPEED_BONUS_MULTIPLIER: 10,
  },
  LATTE_ART: {
    CANVAS_WIDTH: 300,
    CANVAS_HEIGHT: 300,
    DRAWING_TIME: 45, // seconds
    MIN_SIMILARITY_SCORE: 0.7,
    PATTERN_TYPES: ["heart", "rosetta", "tulip", "swan"],
  },
  RECIPES: {
    DISCOVERY_THRESHOLD: 0.8, // 80% accuracy needed
    COLLABORATION_BONUS: 1.5,
    RARE_RECIPE_CHANCE: 0.1,
  },
  SCORING: {
    PERFECT_SCORE: 1000,
    EXPERIENCE_DIVISOR: 10,
    LEVEL_UP_THRESHOLD: 1000,
  },
  COFFEE_MOODS: {
    ENERGIZED: { duration: 300, speedBonus: 1.2 },
    RELAXED: { duration: 300, accuracyBonus: 1.2 },
    FOCUSED: { duration: 300, experienceBonus: 1.3 },
    SOCIAL: { duration: 300, collaborationBonus: 1.5 },
  },
} as const;

export const INGREDIENTS = [
  "Espresso",
  "Milk",
  "Sugar",
  "Vanilla",
  "Caramel",
  "Chocolate",
  "Hazelnut",
  "Cinnamon",
  "Whipped Cream",
  "Oat Milk",
  "Soy Milk",
  "Almond Milk",
  "Honey",
  "Maple Syrup",
  "Irish Cream",
] as const;

export const BASE_RECIPES = [
  {
    name: "Classic Latte",
    ingredients: ["Espresso", "Milk"],
    difficulty: 1,
    baseScore: 100,
  },
  {
    name: "Cappuccino",
    ingredients: ["Espresso", "Milk", "Milk Foam"],
    difficulty: 2,
    baseScore: 150,
  },
  {
    name: "Caramel Macchiato",
    ingredients: ["Espresso", "Milk", "Vanilla", "Caramel"],
    difficulty: 3,
    baseScore: 250,
  },
  {
    name: "Mocha",
    ingredients: ["Espresso", "Milk", "Chocolate", "Whipped Cream"],
    difficulty: 3,
    baseScore: 300,
  },
  {
    name: "Flat White",
    ingredients: ["Espresso", "Milk"],
    difficulty: 2,
    baseScore: 200,
  },
] as const;

export type GameType = "brewing" | "latte_art" | "speed_prep";
export type CoffeeMood = keyof typeof GAME_CONSTANTS.COFFEE_MOODS;
