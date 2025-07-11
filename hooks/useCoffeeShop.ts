"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useCoffeeShop(shopId?: Id<"coffeeShops">) {
  const shopWithPlayers = useQuery(
    api.coffeeShops.getShopWithPlayers,
    shopId ? { shopId } : "skip",
  );

  const defaultShop = useQuery(api.coffeeShops.getDefaultShop);

  const createShop = useMutation(api.coffeeShops.createShop);
  const joinShop = useMutation(api.coffeeShops.joinShop);
  const leaveShop = useMutation(api.coffeeShops.leaveShop);
  const getOrCreateDefaultShop = useMutation(
    api.coffeeShops.getOrCreateDefaultShop,
  );

  return {
    shopWithPlayers,
    defaultShop,
    isLoading: shopId
      ? shopWithPlayers === undefined
      : defaultShop === undefined,
    createShop,
    joinShop,
    leaveShop,
    getOrCreateDefaultShop,
  };
}
