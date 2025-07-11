/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as coffeeShops from "../coffeeShops.js";
import type * as games from "../games.js";
import type * as leaderboard from "../leaderboard.js";
import type * as players from "../players.js";
import type * as recipes from "../recipes.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  coffeeShops: typeof coffeeShops;
  games: typeof games;
  leaderboard: typeof leaderboard;
  players: typeof players;
  recipes: typeof recipes;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
