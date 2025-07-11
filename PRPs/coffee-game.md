name: "Coffee Collaborative Game - Real-time Multiplayer Experience"
description: |

## Purpose

Build a collaborative real-time coffee drinking game with social interaction, engaging gameplay mechanics, character progression, and beautiful modern UI leveraging Convex's real-time capabilities.

## Core Principles

1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Be sure to follow all rules in CLAUDE.md

---

## Goal

Build a collaborative real-time coffee drinking game that combines social interaction with engaging gameplay mechanics. Players will create unique coffee-loving characters using a character generation library, then join shared virtual coffee shops where they can participate in coffee-themed mini-games, challenges, and collaborative brewing sessions. The game will feature a progression system where players unlock new coffee recipes, brewing techniques, and customization options for their characters and personal coffee shops. Real-time features will include synchronized coffee brewing ceremonies, daily coffee challenges that require team coordination, and a global leaderboard showcasing the most dedicated coffee enthusiasts and successful collaborations.

## Why

- **Business value**: Creates an engaging social experience around coffee culture
- **User impact**: Provides a relaxing, collaborative gaming experience
- **Integration**: Showcases Convex real-time capabilities with modern web technologies
- **Problems solved**: Brings coffee enthusiasts together in a fun, interactive environment

## What

The game will leverage Convex's real-time capabilities to create seamless multiplayer experiences where players can see each other's actions instantly - from stirring coffee to decorating their virtual spaces. Core gameplay will include coffee recipe discovery through collaborative experimentation, where teams of players must work together to unlock rare brewing combinations, timed coffee preparation challenges that require precise coordination, and a unique "coffee mood" system that affects character abilities and unlocks special social interactions.

### Success Criteria

- [ ] Character creation with customizable avatars
- [ ] Real-time multiplayer coffee shops
- [ ] At least 3 mini-games (brewing, latte art, recipe discovery)
- [ ] Progression system with unlockables
- [ ] Beautiful, responsive UI with animations
- [ ] Seamless real-time synchronization
- [ ] Clean up existing Next.js boilerplate

## All Needed Context

### Documentation & References (list all context needed to implement the feature)

```yaml
# MUST READ - Use Context7 MCP tool for library documentation
- context7: /context7/convex_dev
  topic: real-time updates, queries, mutations, subscriptions, multiplayer
  why: Core real-time functionality for multiplayer features

- context7: /context7/convex_dev
  topic: schema, data modeling, indexes
  why: Database design for game entities

- context7: next.js
  topic: App Router, Server Components, Client Components
  why: Understanding when to use 'use client' for interactive game components

- file: app/page.tsx
  why: Landing page that needs cleanup and game integration

- file: app/layout.tsx
  why: Root layout structure to understand

- file: tests/landing.spec.ts
  why: Test pattern to follow for E2E tests

- web: https://www.npmjs.com/package/@dicebear/core
  why: Character avatar generation library

- web: https://www.npmjs.com/package/@dicebear/collection
  why: Avatar style collections for DiceBear

- context7: framer-motion
  topic: animations, transitions, gestures
  why: Smooth animations for game interactions
```

### Current Codebase tree (run `tree` in the root of the project) to get an overview of the codebase

```bash
/workspaces/next-agentic-coding/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── convex/
│   └── _generated/
├── tests/
│   ├── landing.spec.ts
│   ├── screenshots.spec.ts
│   └── test-helpers.ts
├── public/
│   └── [various svg files]
├── package.json
├── tsconfig.json
└── [config files]
```

### Desired Codebase tree with files to be added and responsibility of file

```bash
/workspaces/next-agentic-coding/
├── app/
│   ├── (routes)/
│   │   ├── game/
│   │   │   ├── page.tsx          # Main game page with coffee shop view
│   │   │   └── layout.tsx        # Game layout with Convex provider
│   │   ├── character/
│   │   │   └── page.tsx          # Character creation/customization
│   │   └── leaderboard/
│   │       └── page.tsx          # Global leaderboard
│   ├── globals.css               # Updated with game styles
│   ├── layout.tsx                # Root layout with Convex
│   └── page.tsx                  # Landing page (cleaned up)
├── components/
│   ├── game/
│   │   ├── CoffeeShop.tsx       # Main coffee shop room component
│   │   ├── Character.tsx         # Character display component
│   │   ├── BrewingStation.tsx   # Brewing mini-game component
│   │   ├── LatteArtCanvas.tsx   # Latte art mini-game component
│   │   └── RecipeBook.tsx       # Recipe discovery component
│   ├── ui/
│   │   ├── Avatar.tsx           # DiceBear avatar wrapper
│   │   ├── Button.tsx           # Game button component
│   │   ├── Card.tsx             # Card component for UI
│   │   └── LoadingSpinner.tsx  # Loading states
│   └── character/
│       └── CharacterCreator.tsx # Character creation form
├── convex/
│   ├── schema.ts                # Database schema definitions
│   ├── players.ts               # Player-related functions
│   ├── coffeeShops.ts          # Coffee shop functions
│   ├── games.ts                # Mini-game logic
│   ├── recipes.ts              # Recipe system functions
│   └── leaderboard.ts          # Leaderboard functions
├── lib/
│   ├── game/
│   │   ├── constants.ts        # Game constants
│   │   ├── types.ts            # TypeScript types
│   │   └── utils.ts            # Game utilities
│   └── avatar.ts               # Avatar generation helpers
├── hooks/
│   ├── usePlayer.ts            # Player state hook
│   ├── useCoffeeShop.ts       # Coffee shop state hook
│   └── useGame.ts             # Game state hook
└── tests/
    ├── e2e/
    │   ├── character.spec.ts   # Character creation tests
    │   ├── game.spec.ts        # Game functionality tests
    │   └── multiplayer.spec.ts # Real-time multiplayer tests
    └── [existing tests]
```

### Known Gotchas of our codebase & Library Quirks

```typescript
// CRITICAL: Next.js App Router requires 'use client' for interactive components
// Example: Game components with state, event handlers, or animations need 'use client'

// CRITICAL: Convex mutations have 16KB argument size limit
// Example: Don't send large images through mutations, use file storage

// CRITICAL: Server Components can't use hooks or browser APIs
// Example: Character creation with DiceBear needs to be in a Client Component

// CRITICAL: Keep components under 120 lines - split if larger
// Example: Split CoffeeShop into smaller sub-components

// CRITICAL: DiceBear avatars are generated client-side as SVGs
// Example: Generate avatar once and store the seed in Convex

// CRITICAL: Convex real-time subscriptions need proper cleanup
// Example: Always handle loading states when data === undefined

// CRITICAL: Framer Motion requires 'use client' directive
// Example: All animated components must be Client Components
```

## Implementation Blueprint

### Data models and structure

Create the core data models, we ensure type safety and consistency.

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  players: defineTable({
    name: v.string(),
    avatarSeed: v.string(),
    level: v.number(),
    experience: v.number(),
    currentShopId: v.optional(v.id("coffeeShops")),
    unlockedRecipes: v.array(v.id("recipes")),
    coffeePreferences: v.object({
      strength: v.number(), // 1-5
      sweetness: v.number(), // 1-5
      milk: v.string(), // "none", "dairy", "oat", "soy"
    }),
  }).index("by_name", ["name"]),

  coffeeShops: defineTable({
    name: v.string(),
    ownerId: v.id("players"),
    capacity: v.number(),
    style: v.string(), // "modern", "vintage", "cozy"
    activePlayers: v.array(v.id("players")),
    decorations: v.array(v.string()),
  }).index("by_owner", ["ownerId"]),

  recipes: defineTable({
    name: v.string(),
    ingredients: v.array(v.string()),
    difficulty: v.number(), // 1-5
    discoveredBy: v.optional(v.id("players")),
    timesBrewn: v.number(),
  }),

  gameScores: defineTable({
    playerId: v.id("players"),
    gameType: v.string(), // "brewing", "latte_art", "speed_prep"
    score: v.number(),
    timestamp: v.number(),
  })
    .index("by_player", ["playerId"])
    .index("by_game_type", ["gameType", "score"]),
});

// lib/game/types.ts
export interface Player {
  _id: string;
  name: string;
  avatarSeed: string;
  level: number;
  experience: number;
  // ... rest of schema
}

export interface CoffeeShop {
  _id: string;
  name: string;
  // ... rest of schema
}

export type GameType = "brewing" | "latte_art" | "speed_prep";
```

### list of tasks to be completed to fullfill the PRP in the order they should be completed

```yaml
Task 1: Clean up boilerplate and setup Convex
MODIFY app/page.tsx:
  - Remove all Next.js boilerplate content
  - Create simple landing page with game title and "Play" button
  - Add hero section with coffee-themed styling

CREATE app/providers.tsx:
  - Set up ConvexProvider wrapper component
  - Use 'use client' directive
  - PATTERN: Follow Convex React setup docs

MODIFY app/layout.tsx:
  - Import and wrap children with ConvexProvider
  - Update metadata for coffee game
  - Add custom fonts if needed

CREATE convex/schema.ts:
  - Copy schema from blueprint above
  - Ensure all tables and indexes are defined

Task 2: Create UI components library
CREATE components/ui/Button.tsx:
  - PATTERN: export default function pattern
  - Include hover states and loading state
  - Use Tailwind classes for styling

CREATE components/ui/Card.tsx:
  - Reusable card component for game UI
  - Support different variants (elevated, flat)

CREATE components/ui/LoadingSpinner.tsx:
  - Simple coffee cup spinning animation
  - Use CSS animations

CREATE components/ui/Avatar.tsx:
  - Wrapper for DiceBear avatar generation
  - Accept seed prop and size prop
  - Use @dicebear/core and @dicebear/collection

Task 3: Implement character creation
CREATE app/(routes)/character/page.tsx:
  - Character creation form
  - Name input with validation
  - Avatar preview with randomize button
  - Coffee preferences selection
  - CRITICAL: Use 'use client' for interactivity

CREATE components/character/CharacterCreator.tsx:
  - Form component with avatar generation
  - Use DiceBear for avatar creation
  - Preview avatar in real-time
  - PATTERN: Keep under 120 lines

CREATE convex/players.ts:
  - createPlayer mutation
  - getPlayer query
  - updatePreferences mutation
  - PATTERN: Use ctx.auth for user identity

CREATE hooks/usePlayer.ts:
  - Custom hook for player state
  - Use useQuery and useMutation
  - Handle loading states

Task 4: Build coffee shop system
CREATE app/(routes)/game/page.tsx:
  - Main game view
  - Load current coffee shop
  - Display active players
  - CRITICAL: Use 'use client' for real-time

CREATE components/game/CoffeeShop.tsx:
  - Main coffee shop room display
  - Show other players with avatars
  - Interactive stations for mini-games
  - PATTERN: Split into sub-components

CREATE components/game/Character.tsx:
  - Display character with avatar
  - Show name and level
  - Animate position changes
  - Use Framer Motion for animations

CREATE convex/coffeeShops.ts:
  - createShop mutation
  - joinShop mutation
  - leaveShop mutation
  - getShopPlayers query with real-time updates

CREATE hooks/useCoffeeShop.ts:
  - Hook for coffee shop state
  - Handle player join/leave
  - Real-time player positions

Task 5: Implement mini-games
CREATE components/game/BrewingStation.tsx:
  - Brewing mini-game UI
  - Timer and ingredient selection
  - Progress indicators
  - CRITICAL: Keep under 120 lines

CREATE components/game/LatteArtCanvas.tsx:
  - Canvas-based latte art game
  - Mouse/touch drawing
  - Pattern matching scoring
  - Use HTML5 Canvas API

CREATE components/game/RecipeBook.tsx:
  - Recipe discovery interface
  - Show unlocked/locked recipes
  - Ingredient combinations
  - Progress tracking

CREATE convex/games.ts:
  - startBrewingGame mutation
  - submitBrewingResult mutation
  - calculateScore action
  - updateLeaderboard mutation

CREATE lib/game/constants.ts:
  - Game timing constants
  - Score multipliers
  - Recipe definitions
  - Difficulty settings

Task 6: Add progression system
CREATE convex/recipes.ts:
  - discoverRecipe mutation
  - getPlayerRecipes query
  - getRecipeHints query

CREATE app/(routes)/leaderboard/page.tsx:
  - Global leaderboard view
  - Filter by game type
  - Show top players
  - Weekly/all-time views

CREATE convex/leaderboard.ts:
  - getTopPlayers query
  - getPlayerRank query
  - Real-time leaderboard updates

Task 7: Add animations and polish
MODIFY components/game/Character.tsx:
  - Add Framer Motion animations
  - Smooth position transitions
  - Idle animations

MODIFY all game components:
  - Add loading states
  - Error boundaries
  - Smooth transitions
  - Coffee-themed animations

UPDATE app/globals.css:
  - Coffee color palette
  - Custom animations
  - Game-specific styles

Task 8: Write comprehensive tests
CREATE tests/e2e/character.spec.ts:
  - Test character creation flow
  - Avatar generation
  - Preference selection

CREATE tests/e2e/game.spec.ts:
  - Test joining coffee shop
  - Mini-game functionality
  - Score submission

CREATE tests/e2e/multiplayer.spec.ts:
  - Test real-time updates
  - Multiple players interaction
  - Synchronization
```

### Per task pseudocode as needed added to each task

```typescript
// Task 1 - Convex Provider Setup
// app/providers.tsx
'use client';
export default function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  // PATTERN: Standard Convex setup from docs
  const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}

// Task 3 - Character Creation
// components/character/CharacterCreator.tsx
'use client';
export default function CharacterCreator() {
  const createPlayer = useMutation(api.players.createPlayer);
  const [avatarSeed, setAvatarSeed] = useState(generateRandomSeed());

  // GOTCHA: DiceBear runs client-side only
  const avatarUrl = useMemo(() => {
    const avatar = createAvatar(style, {
      seed: avatarSeed,
      // avatar options
    });
    return avatar.toDataUriSync();
  }, [avatarSeed]);

  // CRITICAL: Validate name uniqueness
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createPlayer({
        name: playerName,
        avatarSeed,
        coffeePreferences,
      });
      router.push('/game');
    } catch (error) {
      // Handle duplicate name error
    }
  };
}

// Task 4 - Real-time Coffee Shop
// components/game/CoffeeShop.tsx
'use client';
export default function CoffeeShop({ shopId }: { shopId: string }) {
  // PATTERN: Real-time subscription to shop data
  const shopData = useQuery(api.coffeeShops.getShopWithPlayers, { shopId });

  // CRITICAL: Handle loading state for Convex
  if (shopData === undefined) {
    return <LoadingSpinner />;
  }

  // PATTERN: Map players to positioned avatars
  return (
    <div className="relative coffee-shop-bg">
      {shopData.players.map((player) => (
        <Character
          key={player._id}
          player={player}
          position={calculatePosition(player.position)}
        />
      ))}
      <BrewingStation onInteract={handleBrewingGame} />
      <LatteArtStation onInteract={handleLatteArt} />
    </div>
  );
}

// Task 5 - Brewing Game Logic
// convex/games.ts
export const submitBrewingResult = mutation({
  args: {
    playerId: v.id("players"),
    recipe: v.object({
      ingredients: v.array(v.string()),
      brewTime: v.number(),
      temperature: v.number(),
    }),
    timeElapsed: v.number(),
  },
  handler: async (ctx, { playerId, recipe, timeElapsed }) => {
    // PATTERN: Calculate score based on accuracy
    const targetRecipe = await ctx.db.get(recipe.targetId);
    const accuracy = calculateAccuracy(recipe, targetRecipe);
    const speedBonus = Math.max(0, 60 - timeElapsed) * 10;
    const finalScore = accuracy * 100 + speedBonus;

    // CRITICAL: Atomic database updates
    await ctx.db.insert("gameScores", {
      playerId,
      gameType: "brewing",
      score: finalScore,
      timestamp: Date.now(),
    });

    // Update player experience
    const player = await ctx.db.get(playerId);
    await ctx.db.patch(playerId, {
      experience: player.experience + Math.floor(finalScore / 10),
    });

    return { score: finalScore, newExperience: player.experience };
  },
});
```

### Integration Points

```yaml
ENVIRONMENT:
  - add to: .env.local
  - pattern: "NEXT_PUBLIC_CONVEX_URL=https://..."
  - pattern: "NEXT_PUBLIC_DICEBEAR_LICENSE=free"

CONVEX:
  - Deploy with: npx convex dev
  - Schema will auto-generate types
  - Functions will be available in _generated/api

ROUTES:
  - Landing: / (cleaned up page.tsx)
  - Character: /character (creation flow)
  - Game: /game (main gameplay)
  - Leaderboard: /leaderboard (scores)

DEPENDENCIES TO ADD:
  - npm install @dicebear/core @dicebear/collection
  - npm install framer-motion
  - Already have: convex, next, react
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
npm run quickfix              # Runs ESLint, TypeScript, Prettier

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests each new feature/file/function use existing test patterns

```typescript
// CREATE tests/e2e/character.spec.ts with these test cases:
import { test, expect } from "@playwright/test";
import { ROUTES } from "../test-helpers";

test("character creation flow", async ({ page }) => {
  await page.goto(ROUTES.home);
  await page.getByRole("button", { name: "Play" }).click();

  // Should redirect to character creation
  await expect(page).toHaveURL(/\/character/);

  // Fill character form
  await page.getByLabel("Character Name").fill("TestBarista");
  await page.getByRole("button", { name: "Randomize Avatar" }).click();

  // Select preferences
  await page.getByLabel("Coffee Strength").selectOption("3");
  await page.getByRole("button", { name: "Create Character" }).click();

  // Should enter game
  await expect(page).toHaveURL(/\/game/);
  await expect(page.getByText("TestBarista")).toBeVisible();
});

test("real-time multiplayer sync", async ({ page, context }) => {
  // Create first player
  await page.goto("/game");

  // Create second player in new tab
  const page2 = await context.newPage();
  await page2.goto("/game");

  // Player 2 performs action
  await page2.getByTestId("brewing-station").click();

  // Player 1 should see the update
  await expect(page.getByText("Player at brewing station")).toBeVisible();
});

test("mini-game scoring", async ({ page }) => {
  await page.goto("/game");
  await page.getByTestId("brewing-station").click();

  // Complete brewing game
  await page.getByRole("button", { name: "Add Espresso" }).click();
  await page.getByRole("button", { name: "Add Milk" }).click();
  await page.getByRole("button", { name: "Brew" }).click();

  // Check score appears
  await expect(page.getByText(/Score: \d+/)).toBeVisible();
});
```

```bash
# Run and iterate until passing:
npm run test
# If failing: Read error, understand root cause, fix code, re-run
```

### Level 3: Integration Test

```bash
# Test the build
npm run test:build

# Run specific E2E test
npm run test tests/e2e/character.spec.ts
npm run test tests/e2e/game.spec.ts
npm run test tests/e2e/multiplayer.spec.ts

# Update screenshots if UI changed
npm run screenshots

# Expected: All tests pass, build succeeds
# If error: Check console output for specific failures
```

## Final validation Checklist

- [ ] All tests pass: `npm run test`
- [ ] No linting errors: `npm run quickfix`
- [ ] Build succeeds: `npm run test:build`
- [ ] TypeScript types are comprehensive
- [ ] Components stay under 120 lines
- [ ] Real-time features work without refresh
- [ ] Error cases handled gracefully
- [ ] Follows all CLAUDE.md conventions
- [ ] Character creation works smoothly
- [ ] Multiplayer sync is seamless
- [ ] Mini-games are playable
- [ ] Progression system tracks properly
- [ ] UI animations are smooth
- [ ] Mobile responsive design

---

## Anti-Patterns to Avoid

- ❌ Don't use JavaScript - always TypeScript
- ❌ Don't use named exports for components
- ❌ Don't create files over 120 lines
- ❌ Don't use relative imports with ../
- ❌ Don't call npx directly - use npm run
- ❌ Don't forget 'use client' for interactive components
- ❌ Don't skip validation - run quickfix frequently
- ❌ Don't ignore failing tests - fix them
- ❌ Don't hardcode values that should be env vars
- ❌ Don't send large data through Convex mutations
- ❌ Don't forget to handle Convex loading states
- ❌ Don't trust client-side game scores - validate server-side
- ❌ Don't create memory leaks with subscriptions

## Additional Resources

- Convex Docs: https://docs.convex.dev
- DiceBear Docs: https://www.dicebear.com/introduction
- Framer Motion: https://www.framer.com/motion/
- Next.js App Router: https://nextjs.org/docs/app

**Confidence Level: 8/10**

This PRP provides comprehensive context for implementing a real-time collaborative coffee game. The architecture is well-structured with clear separation of concerns, proper real-time patterns, and extensive test coverage. The slight uncertainty comes from the complexity of coordinating multiple mini-games and ensuring smooth multiplayer synchronization, but the validation loops should catch any issues.
