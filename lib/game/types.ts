import { Id } from "@/convex/_generated/dataModel";

export interface Player {
  _id: Id<"players">;
  name: string;
  avatarSeed: string;
  level: number;
  experience: number;
  currentShopId?: Id<"coffeeShops">;
  unlockedRecipes: Id<"recipes">[];
  coffeePreferences: {
    strength: number;
    sweetness: number;
    milk: string;
  };
}

export interface CoffeeShop {
  _id: Id<"coffeeShops">;
  name: string;
  ownerId: Id<"players">;
  capacity: number;
  style: string;
  activePlayers: Id<"players">[];
  decorations: string[];
}

export type GameType = "brewing" | "latte_art" | "speed_prep";

export interface Position {
  x: number;
  y: number;
}
