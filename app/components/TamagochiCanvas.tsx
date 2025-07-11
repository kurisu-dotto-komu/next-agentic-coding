"use client";

import { useCallback, useEffect, useRef } from "react";

import { useMutation, useQuery } from "convex/react";

import {
  CANVAS_SIZE,
  GAME_SIZE,
  SCALE,
  SPRITE_SIZE,
  type Tamagochi,
  drawGrid,
  drawTamagochi,
} from "@/app/utils/canvasHelpers";
import { api } from "@/convex/_generated/api";

export default function TamagochiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const spritesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  const tamagochis = useQuery(api.tamagochis.list);
  const interact = useMutation(api.tamagochis.interact);

  // Preload sprites
  useEffect(() => {
    if (!tamagochis) return;

    tamagochis.forEach((pet) => {
      if (!spritesRef.current.has(pet._id) && pet.pixelData) {
        const img = new Image();
        img.onload = () => {
          spritesRef.current.set(pet._id, img);
        };
        img.src = pet.pixelData;
      }
    });
  }, [tamagochis]);

  const animate = useCallback(() => {
    if (!canvasRef.current || !tamagochis) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid
    drawGrid(ctx);

    // Draw each tamagochi
    tamagochis.forEach((pet) => {
      if (pet.alive) {
        const sprite = spritesRef.current.get(pet._id);
        drawTamagochi(ctx, pet as Tamagochi, sprite);
      }
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [tamagochis]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate]);

  const handleClick = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !tamagochis) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * GAME_SIZE;
    const y = ((e.clientY - rect.top) / rect.height) * GAME_SIZE;

    // Find clicked tamagochi
    for (const pet of tamagochis) {
      if (!pet.alive) continue;

      const distance = Math.sqrt(
        Math.pow(x - (pet.position.x + SPRITE_SIZE / 2 / SCALE), 2) +
          Math.pow(y - (pet.position.y + SPRITE_SIZE / 2 / SCALE), 2),
      );

      if (distance < SPRITE_SIZE / SCALE) {
        await interact({ id: pet._id, action: "pet" });
        break;
      }
    }
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="h-auto w-full max-w-[1024px] cursor-pointer rounded-lg bg-gray-100 shadow-lg"
        style={{ imageRendering: "pixelated" }}
        onClick={handleClick}
      />
      {!tamagochis || tamagochis.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-lg text-gray-500">No tamagochis yet! Spawn one to get started.</p>
        </div>
      ) : null}
    </div>
  );
}
