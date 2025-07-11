"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function usePlayer(playerId?: Id<"players">) {
  const player = useQuery(
    api.players.getPlayer,
    playerId ? { playerId } : "skip",
  );

  const createPlayer = useMutation(api.players.createPlayer);
  const updatePreferences = useMutation(api.players.updatePreferences);
  const updatePlayerShop = useMutation(api.players.updatePlayerShop);
  const addExperience = useMutation(api.players.addExperience);

  return {
    player,
    isLoading: player === undefined && playerId !== undefined,
    createPlayer,
    updatePreferences,
    updatePlayerShop,
    addExperience,
  };
}
