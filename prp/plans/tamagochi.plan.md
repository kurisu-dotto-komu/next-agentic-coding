# Tamagochi Feature Implementation Plan

## Feature Overview

Implement a multiplayer tamagochi game that replaces the existing TODO functionality. The tamagochi is a virtual pet that lives in a 100x100 pixel matrix (scaled to 1024px max), has hunger/happiness/health stats, moves randomly, and requires player interaction to survive. All players interact with the same shared tamagochi in real-time.

## Research Summary

### Existing Codebase Structure

- **Main TODO route**: `/app/(routes)/todo/page.tsx` - needs to be replaced
- **Convex schema**: Currently only has `todos` table - need to create `tamagochis` table
- **Real-time patterns**: Using `useQuery` and `useMutation` hooks from Convex
- **Component patterns**: Client components with `"use client"` directive, default exports
- **Test patterns**: Playwright E2E tests with serial mode, screenshot tests

### Key Technologies

- **Convex**: Real-time backend with subscriptions (`context7: /context7/convex_dev`)
- **Next.js App Router**: Client components for interactivity (`context7: /vercel/next.js topic: use client`)
- **Canvas API**: For pixel art rendering and game display
- **TypeScript**: Strict typing throughout

## Implementation Blueprint

### 1. Update Convex Schema

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  tamagochis: defineTable({
    userId: v.string(),
    name: v.string(),
    pixelData: v.string(), // Base64 encoded pixel art
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    velocity: v.object({
      x: v.number(),
      y: v.number(),
    }),
    stats: v.object({
      hunger: v.number(), // 0-100
      happiness: v.number(), // 0-100
      health: v.number(), // 0-100
    }),
    alive: v.boolean(),
    birthTime: v.number(),
    lastUpdated: v.number(),
    animations: v.object({
      current: v.string(), // "idle", "eating", "playing", etc.
      startTime: v.number(),
    }),
  })
    .index("by_user", ["userId"])
    .index("by_alive", ["alive"]),
});
```

### 2. Pixel Art Generation System

```typescript
// app/utils/pixelArt.ts
interface PixelData {
  width: number;
  height: number;
  data: Uint8Array; // RGBA values
}

export function generateTamagochiSprite(seed: string): string {
  // Use seed for deterministic generation
  const rng = seedRandom(seed);
  const size = 16; // 16x16 sprite
  const pixels = new Uint8Array(size * size * 4);

  // Generate symmetrical creature pattern
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size / 2; x++) {
      const shouldFill = rng() > 0.5;
      if (shouldFill) {
        // Mirror horizontally for symmetry
        setPixel(pixels, x, y, ...generateColor(rng));
        setPixel(pixels, size - 1 - x, y, ...generateColor(rng));
      }
    }
  }

  // Convert to base64
  return pixelsToBase64(pixels, size, size);
}
```

### 3. Game Canvas Component

```typescript
// app/components/TamagochiCanvas.tsx
'use client'

import { useRef, useEffect } from 'react'
import { api } from '@/convex/_generated/api'
import { useQuery, useMutation } from 'convex/react'

export default function TamagochiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tamagochis = useQuery(api.tamagochis.list)
  const interact = useMutation(api.tamagochis.interact)

  useEffect(() => {
    if (!canvasRef.current || !tamagochis) return

    const ctx = canvasRef.current.getContext('2d')
    ctx.imageSmoothingEnabled = false // Crisp pixels

    // Clear and draw game state
    ctx.clearRect(0, 0, 1024, 1024)

    // Draw each tamagochi
    tamagochis.forEach(pet => {
      drawTamagochi(ctx, pet)
    })
  }, [tamagochis])

  const handleClick = (e: React.MouseEvent) => {
    // Convert click to game coordinates
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / 10.24)
    const y = Math.floor((e.clientY - rect.top) / 10.24)

    // Find clicked tamagochi
    const clicked = findTamagochiAt(tamagochis, x, y)
    if (clicked) {
      interact({ id: clicked._id, action: 'pet' })
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={1024}
      height={1024}
      className="w-full max-w-[1024px] h-auto bg-gray-100"
      style={{ imageRendering: 'pixelated' }}
      onClick={handleClick}
    />
  )
}
```

### 4. Convex Backend Functions

```typescript
// convex/tamagochis.ts
import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("tamagochis")
      .filter((q) => q.eq(q.field("alive"), true))
      .collect();
  },
});

export const spawn = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Generate unique pixel art
    const pixelData = generateTamagochiSprite(args.userId + Date.now());

    return await ctx.db.insert("tamagochis", {
      userId: args.userId,
      name: args.name,
      pixelData,
      position: { x: Math.random() * 100, y: Math.random() * 100 },
      velocity: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
      stats: { hunger: 100, happiness: 100, health: 100 },
      alive: true,
      birthTime: Date.now(),
      lastUpdated: Date.now(),
      animations: { current: "idle", startTime: Date.now() },
    });
  },
});

export const interact = mutation({
  args: {
    id: v.id("tamagochis"),
    action: v.union(v.literal("feed"), v.literal("pet"), v.literal("heal")),
  },
  handler: async (ctx, args) => {
    const pet = await ctx.db.get(args.id);
    if (!pet || !pet.alive) return;

    const updates: Partial<typeof pet.stats> = {};

    switch (args.action) {
      case "feed":
        updates.hunger = Math.min(100, pet.stats.hunger + 30);
        break;
      case "pet":
        updates.happiness = Math.min(100, pet.stats.happiness + 20);
        break;
      case "heal":
        updates.health = Math.min(100, pet.stats.health + 25);
        break;
    }

    await ctx.db.patch(args.id, {
      stats: { ...pet.stats, ...updates },
      animations: { current: args.action, startTime: Date.now() },
      lastUpdated: Date.now(),
    });
  },
});

// Background job to update physics and stats
export const updateGameState = mutation({
  handler: async (ctx) => {
    const pets = await ctx.db
      .query("tamagochis")
      .filter((q) => q.eq(q.field("alive"), true))
      .collect();

    for (const pet of pets) {
      const deltaTime = (Date.now() - pet.lastUpdated) / 1000;

      // Update position
      let newX = pet.position.x + pet.velocity.x * deltaTime;
      let newY = pet.position.y + pet.velocity.y * deltaTime;

      // Bounce off walls
      if (newX < 0 || newX > 100) pet.velocity.x *= -1;
      if (newY < 0 || newY > 100) pet.velocity.y *= -1;

      // Decay stats
      const statDecay = deltaTime * 0.1;
      const newStats = {
        hunger: Math.max(0, pet.stats.hunger - statDecay),
        happiness: Math.max(0, pet.stats.happiness - statDecay * 0.8),
        health: Math.max(0, pet.stats.health - statDecay * 0.5),
      };

      // Check death conditions
      const alive = newStats.hunger > 0 && newStats.happiness > 0 && newStats.health > 0;

      await ctx.db.patch(pet._id, {
        position: { x: Math.max(0, Math.min(100, newX)), y: Math.max(0, Math.min(100, newY)) },
        velocity: pet.velocity,
        stats: newStats,
        alive,
        lastUpdated: Date.now(),
      });
    }
  },
});
```

### 5. Main Game Page

```typescript
// app/(routes)/todo/page.tsx -> rename to tamagochi
'use client'

import TamagochiCanvas from '@/components/TamagochiCanvas'
import TamagochiStats from '@/components/TamagochiStats'
import SpawnForm from '@/components/SpawnForm'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function TamagochiPage() {
  const tamagochis = useQuery(api.tamagochis.list)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Multiplayer Tamagochi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TamagochiCanvas />
        </div>

        <div className="space-y-4">
          <SpawnForm />
          {tamagochis?.map(pet => (
            <TamagochiStats key={pet._id} tamagochi={pet} />
          ))}
        </div>
      </div>
    </div>
  )
}
```

## Implementation Tasks

1. **Update Convex Schema** (15 min)
   - Add `tamagochis` table to `convex/schema.ts`
   - Keep `todos` table for now (will be removed later)
   - Deploy schema changes

2. **Remove TODO Logic** (30 min)
   - Delete `app/components/TodoItem.tsx`
   - Delete `convex/todos.ts`
   - Clear out `app/(routes)/todo/page.tsx` content

3. **Create Pixel Art Generator** (1 hour)
   - Implement `app/utils/pixelArt.ts` with sprite generation
   - Add color palettes and patterns
   - Create base64 encoding utilities

4. **Build Game Canvas** (2 hours)
   - Create `app/components/TamagochiCanvas.tsx`
   - Implement pixel-perfect rendering
   - Add click detection and interaction

5. **Implement Convex Backend** (2 hours)
   - Create `convex/tamagochis.ts` with CRUD operations
   - Add physics simulation
   - Implement stat decay and death logic
   - Set up cron job for game updates

6. **Create UI Components** (1.5 hours)
   - `TamagochiStats.tsx` - Display health bars
   - `SpawnForm.tsx` - Create new pets
   - `InteractionButtons.tsx` - Feed/Pet/Heal actions

7. **Add Easter Eggs** (1 hour)
   - Special animations for certain interactions
   - Rare color variations
   - Secret interaction combinations

8. **Update Tests** (1 hour)
   - Update E2E tests for new functionality
   - Add screenshot tests for game states
   - Test real-time synchronization

## Validation Gates

```bash
# 1. Syntax and Style Check
npm run quickfix

# 2. Run E2E Tests
npm run test

# 3. Screenshot Tests
npm run screenshots -- tamagochi

# 4. Build Verification
npm run test:build
```

## Gotchas and Considerations

1. **Canvas Performance**: Use `requestAnimationFrame` for smooth animations
2. **Real-time Sync**: Convex subscriptions auto-update, no polling needed
3. **Pixel Scaling**: Set `imageRendering: 'pixelated'` CSS for crisp pixels
4. **State Management**: All game state in Convex, UI is purely reactive
5. **Death Handling**: Soft delete (mark as dead) rather than hard delete
6. **User Identity**: Use anonymous sessions (localStorage UUID) since no login

## Documentation References

- Convex Real-time: `context7: /context7/convex_dev topic: real-time subscriptions mutations`
- Next.js Client Components: `context7: /vercel/next.js topic: use client`
- Canvas Pixel Art: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
- Image Rendering: https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look

## Existing Patterns to Follow

- Component structure: See `app/components/TodoItem.tsx` for style
- Convex queries: Follow pattern in `convex/todos.ts`
- Route structure: Mirror `app/(routes)/todo/page.tsx`
- Test patterns: Check `tests/todo.spec.ts` for E2E examples

## Success Criteria

- [ ] Tamagochi renders as pixel art on 100x100 grid
- [ ] Multiple users see same pets in real-time
- [ ] Pets move randomly and bounce off walls
- [ ] Stats decay over time and pets can die
- [ ] Click interactions work (feed/pet/heal)
- [ ] All tests pass including screenshots
- [ ] Build succeeds without errors

## Confidence Score: 8.5/10

This plan provides comprehensive context for one-pass implementation. The schema needs to be created from scratch (slight reduction from original score), but all patterns and implementation details are clearly defined. The only minor uncertainties are around specific easter egg implementations.
