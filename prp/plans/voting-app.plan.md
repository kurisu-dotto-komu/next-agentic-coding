# Voting App Feature Implementation Plan

## Goal

Build a real-time audience engagement voting app inspired by Nintendo Wii Mii characters, where users vote by holding down buttons on their phones (O/X) and see aggregated results on a desktop display with all participants represented as avatars.

## Why

- **Business value**: Enables real-time audience engagement for presentations, events, or decision-making
- **User impact**: Provides instant visual feedback of collective opinions with fun character avatars
- **Problems solved**: Makes voting interactive, visual, and engaging rather than static polls

## What

A responsive web app with:

- **Mobile view**: Personal avatar + two voting buttons (O/X) with whiteboard animation
- **Desktop view**: Live crowd display with real-time vote proportions bar + QR code
- **Real-time sync**: All votes and presence updated instantly via Convex

### Success Criteria

- [ ] Users get persistent avatars that survive page refreshes
- [ ] Mobile users can vote by holding O or X buttons with visual feedback
- [ ] Desktop shows all connected users and their current votes in real-time
- [ ] Vote proportion bar updates smoothly as votes change
- [ ] QR code allows easy mobile access from desktop view

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Use Context7 MCP tool for library documentation
- context7: /context7/convex_dev
  topic: Real-time subscriptions, mutations, schema design
  why: Core backend functionality for real-time voting sync

- context7: /vercel/next.js
  topic: App Router, use client, responsive design
  why: Building responsive views with client interactivity

- doc: https://www.dicebear.com/how-to-use/js-library/
  topic: Avatar generation with @dicebear/core and @dicebear/collection
  why: Generating unique persistent user avatars

- file: /workspaces/next-agentic-coding/app/(routes)/todo/page.tsx
  why: Pattern for Convex integration and client components

- file: /workspaces/next-agentic-coding/convex/todos.ts
  why: Pattern for Convex queries and mutations

- context7: /vercel/next.js
  topic: CSS-in-JS, Tailwind responsive utilities
  critical: Use viewport-based responsive design for mobile/desktop views
```

### Current Codebase Tree

```bash
app/
├── (routes)/
│   ├── page.tsx          # Landing page with hello message
│   └── todo/
│       └── page.tsx      # Todo list (to be replaced)
├── components/
│   ├── Providers.tsx     # Convex provider wrapper
│   └── TodoItem.tsx      # Todo item component
├── globals.css           # Global styles with Tailwind
└── layout.tsx            # Root layout with providers

convex/
├── _generated/           # Auto-generated Convex files
├── schema.ts             # Database schema (only todos table)
└── todos.ts              # Todo CRUD operations
```

### Desired Codebase Tree

```bash
app/
├── (routes)/
│   └── page.tsx          # Voting app (replaces landing page)
├── components/
│   ├── Providers.tsx     # Existing Convex provider
│   ├── VotingMobile.tsx  # Mobile voting interface
│   ├── VotingDesktop.tsx # Desktop crowd display
│   ├── UserAvatar.tsx    # Avatar display component
│   ├── VoteButton.tsx    # O/X voting button with animation
│   ├── VoteBar.tsx       # Proportion bar visualization
│   └── QRCode.tsx        # QR code generator
└── utils/
    └── viewport.ts       # Viewport detection utilities

convex/
├── schema.ts             # Updated with users and votes tables
├── users.ts              # User session management
└── votes.ts              # Voting operations and subscriptions
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: dicebear requires specific import pattern
// Example: import { createAvatar } from '@dicebear/core';
// Example: import { lorelei } from '@dicebear/collection';

// CRITICAL: Convex subscriptions require 'use client'
// Server Components can't use useQuery/useMutation hooks

// CRITICAL: Touch events need preventDefault to avoid scrolling
// Use onTouchStart/onTouchEnd for mobile button holds

// CRITICAL: QR codes need absolute URLs, not relative paths
// Use process.env.NEXT_PUBLIC_APP_URL or window.location.origin

// CRITICAL: Keep components under 150 lines - split if larger
```

## Implementation Blueprint

### Data Models and Structure

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Remove todos table after migration
  users: defineTable({
    sessionId: v.string(), // Unique browser session ID
    avatarSeed: v.string(), // For consistent avatar generation
    createdAt: v.number(), // Timestamp
    lastSeen: v.number(), // For presence tracking
  })
    .index("by_session", ["sessionId"])
    .index("by_last_seen", ["lastSeen"]),

  votes: defineTable({
    userId: v.id("users"), // Reference to user
    vote: v.union(
      // Current vote state
      v.literal("O"),
      v.literal("X"),
      v.null(), // Not voting
    ),
    updatedAt: v.number(), // Timestamp of last vote change
  })
    .index("by_user", ["userId"])
    .index("by_updated", ["updatedAt"]),
});

// TypeScript interfaces
interface UserWithVote {
  _id: Id<"users">;
  sessionId: string;
  avatarSeed: string;
  currentVote: "O" | "X" | null;
}

interface VoteStats {
  total: number;
  votingO: number;
  votingX: number;
  notVoting: number;
}
```

### List of Tasks

```yaml
Task 1: Clean up existing app and add dependencies
MODIFY package.json:
  - ADD dependencies: "@dicebear/core", "@dicebear/collection", "qrcode"
  - RUN: npm install

DELETE app/(routes)/todo/page.tsx
DELETE app/components/TodoItem.tsx
DELETE convex/todos.ts

MODIFY convex/schema.ts:
  - REMOVE todos table
  - ADD users and votes tables as specified above

Task 2: Create viewport detection and user session utilities
CREATE app/utils/viewport.ts:
  - IMPLEMENT useViewport hook for mobile/desktop detection
  - USE window.matchMedia for responsive breakpoint
  - HANDLE SSR with useEffect

CREATE app/utils/session.ts:
  - IMPLEMENT getOrCreateSessionId using localStorage
  - GENERATE unique session IDs with crypto.randomUUID
  - HANDLE SSR edge cases

Task 3: Create Convex backend functions
CREATE convex/users.ts:
  - IMPLEMENT getOrCreateUser mutation
  - IMPLEMENT updateLastSeen mutation
  - IMPLEMENT listActiveUsers query with presence (last 5 min)

CREATE convex/votes.ts:
  - IMPLEMENT setVote mutation (userId, vote type)
  - IMPLEMENT clearVote mutation
  - IMPLEMENT getCurrentVotes query (joins users + votes)
  - IMPLEMENT getVoteStats query (aggregated counts)

Task 4: Create shared components
CREATE app/components/UserAvatar.tsx:
  - USE @dicebear/core with lorelei style
  - ACCEPT avatarSeed prop for consistent generation
  - RENDER as img with base64 data URI
  - KEEP under 50 lines

CREATE app/components/VoteButton.tsx:
  - IMPLEMENT touch/mouse event handlers
  - TRIGGER vote on press, clear on release
  - SHOW whiteboard animation while pressed
  - USE Tailwind transitions for smooth animations

Task 5: Create mobile voting view
CREATE app/components/VotingMobile.tsx:
  - USE useQuery to get current user
  - DISPLAY UserAvatar centered
  - RENDER two VoteButtons (O and X)
  - HANDLE vote state with useMutation
  - STYLE for mobile viewport

Task 6: Create desktop components
CREATE app/components/VoteBar.tsx:
  - DISPLAY proportional bar (O/X/none)
  - USE Tailwind flex for proportions
  - ANIMATE width changes smoothly
  - SHOW percentages or counts

CREATE app/components/QRCode.tsx:
  - GENERATE QR code for current URL
  - USE qrcode library
  - POSITION in top-right corner

CREATE app/components/VotingDesktop.tsx:
  - USE useQuery for all active users
  - DISPLAY UserAvatars in grid
  - SHOW vote indicators on avatars
  - RENDER VoteBar at top
  - ADD QRCode component
  - AUTO-ARRANGE avatars based on count

Task 7: Create main voting page
MODIFY app/(routes)/page.tsx:
  - DETECT viewport with useViewport
  - RENDER VotingMobile or VotingDesktop
  - ENSURE user creation on mount
  - UPDATE presence periodically

Task 8: Add tests and screenshots
CREATE tests/e2e/voting-app.spec.ts:
  - TEST mobile voting interaction
  - TEST desktop real-time updates
  - TEST multi-user scenarios
  - USE loadSeed helper pattern

MODIFY tests/screenshots.spec.ts:
  - ADD voting mobile view screenshot
  - ADD voting desktop view screenshot
  - ADD voting with active votes screenshot
```

### Per Task Pseudocode

```typescript
// Task 2 - Viewport detection
// app/utils/viewport.ts
export function useViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return { isMobile };
}

// Task 3 - User management
// convex/users.ts
export const getOrCreateUser = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    // Check existing user
    const existing = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (existing) {
      // Update last seen
      await ctx.db.patch(existing._id, { lastSeen: Date.now() });
      return existing._id;
    }

    // Create new user with random avatar seed
    const avatarSeed = crypto.randomUUID();
    return await ctx.db.insert("users", {
      sessionId: args.sessionId,
      avatarSeed,
      createdAt: Date.now(),
      lastSeen: Date.now(),
    });
  },
});

// Task 4 - Vote button with animation
// app/components/VoteButton.tsx
export default function VoteButton({
  type,
  onVote
}: {
  type: "O" | "X";
  onVote: (voting: boolean) => void;
}) {
  const [isPressed, setIsPressed] = useState(false);

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault(); // Prevent scrolling on mobile
    setIsPressed(true);
    onVote(true);
  };

  const handleEnd = () => {
    setIsPressed(false);
    onVote(false);
  };

  return (
    <button
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      className={`relative transition-transform ${
        isPressed ? 'scale-95' : 'scale-100'
      }`}
    >
      {/* Button visual */}
      <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center">
        <span className="text-4xl text-white">{type}</span>
      </div>

      {/* Whiteboard animation */}
      {isPressed && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2
                      bg-white border-2 border-gray-800 rounded p-2
                      animate-bounce">
          <span className="text-2xl">{type}</span>
        </div>
      )}
    </button>
  );
}
```

### Integration Points

```yaml
ENVIRONMENT:
  - add to: .env.local
  - pattern: "NEXT_PUBLIC_APP_URL=http://localhost:3000"

CONVEX:
  - cleanup: Remove todos table and imports
  - schema: Add users and votes tables with indexes
  - functions: Create user and vote management

ROUTES:
  - modify: app/(routes)/page.tsx becomes main voting app
  - remove: app/(routes)/todo/* completely
```

## Validation Loop

### Level 0: TDD Unit Tests

```typescript
// CREATE tests/e2e/voting-app.spec.ts
import { expect, test } from "@playwright/test";

test.describe("Voting App", () => {
  test("mobile users can vote by holding buttons", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Should see avatar and buttons
    await expect(page.getByTestId("user-avatar")).toBeVisible();
    await expect(page.getByTestId("vote-button-O")).toBeVisible();
    await expect(page.getByTestId("vote-button-X")).toBeVisible();

    // Hold O button
    const oButton = page.getByTestId("vote-button-O");
    await oButton.dispatchEvent("mousedown");

    // Should show whiteboard
    await expect(page.getByTestId("vote-indicator-O")).toBeVisible();

    // Release button
    await oButton.dispatchEvent("mouseup");
    await expect(page.getByTestId("vote-indicator-O")).not.toBeVisible();
  });

  test("desktop shows all users and real-time votes", async ({ page, context }) => {
    // Desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    // Should see QR code and vote bar
    await expect(page.getByTestId("qr-code")).toBeVisible();
    await expect(page.getByTestId("vote-bar")).toBeVisible();

    // Open mobile view in new page
    const mobilePage = await context.newPage();
    await mobilePage.setViewportSize({ width: 375, height: 667 });
    await mobilePage.goto("/");

    // Vote on mobile
    const xButton = mobilePage.getByTestId("vote-button-X");
    await xButton.dispatchEvent("mousedown");

    // Desktop should update
    await expect(page.getByTestId("user-vote-X").first()).toBeVisible();

    // Release vote
    await xButton.dispatchEvent("mouseup");
    await expect(page.getByTestId("user-vote-X")).not.toBeVisible();
  });

  test("users persist across refreshes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Get avatar src
    const avatarSrc1 = await page.getByTestId("user-avatar").getAttribute("src");

    // Refresh page
    await page.reload();

    // Avatar should be same
    const avatarSrc2 = await page.getByTestId("user-avatar").getAttribute("src");
    expect(avatarSrc1).toBe(avatarSrc2);
  });
});
```

### Level 1: Syntax & Style

```bash
# Run after each implementation step
npm run quickfix

# Expected: No errors. If errors, READ and fix.
```

### Level 2: Unit Tests

```bash
# Run voting app tests
npm run test -- tests/e2e/voting-app.spec.ts

# If failing: Debug with headed mode
npm run test -- --headed tests/e2e/voting-app.spec.ts
```

### Level 3: Visual Feedback Loop

```typescript
// ADD to tests/screenshots.spec.ts
test.describe("Screenshots: Voting", () => {
  test("Voting Mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loadSeed("empty");
    await takeScreenshot(page, "/", "voting-mobile");

    // With active vote
    const oButton = page.getByTestId("vote-button-O");
    await oButton.dispatchEvent("mousedown");
    await takeScreenshot(page, "/", "voting-mobile-active");
    await oButton.dispatchEvent("mouseup");
  });

  test("Voting Desktop", async ({ page, context }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loadSeed("empty");
    await takeScreenshot(page, "/", "voting-desktop-empty");

    // Add some mobile voters
    for (let i = 0; i < 5; i++) {
      const mobile = await context.newPage();
      await mobile.setViewportSize({ width: 375, height: 667 });
      await mobile.goto("/");

      // Random votes
      if (Math.random() > 0.5) {
        const btn = mobile.getByTestId(`vote-button-${Math.random() > 0.5 ? "O" : "X"}`);
        await btn.dispatchEvent("mousedown");
      }
    }

    await page.waitForTimeout(1000); // Let updates propagate
    await takeScreenshot(page, "/", "voting-desktop-active");
  });
});
```

```bash
# Take screenshots and review
npm run screenshots -- Voting

# Check for:
# - Avatar generation quality
# - Button press animations
# - Vote bar proportions
# - QR code visibility
# - Responsive layouts
# - User arrangement on desktop

# Fix issues and re-run until perfect
```

### Level 4: Integration Test

```bash
# Full build test
npm run test:build

# Specific voting tests
npm run test:build -- tests/e2e/voting-app.spec.ts
```

## Final Validation Checklist

- [ ] All tests pass: `npm run test`
- [ ] No linting errors: `npm run quickfix`
- [ ] No visual issues in screenshots: `npm run screenshots -- Voting`
- [ ] Build succeeds: `npm run test:build`
- [ ] TypeScript types are comprehensive; no `any` or `unknown`
- [ ] Components stay under 150 lines; split if larger
- [ ] Real-time voting updates without refresh
- [ ] Mobile touch events work smoothly
- [ ] Desktop shows accurate vote proportions
- [ ] Avatars persist across page refreshes
- [ ] QR code links to correct URL
- [ ] Error cases handled gracefully
- [ ] Follows all CLAUDE.md conventions

## Anti-Patterns to Avoid

- ❌ Don't use JavaScript - always TypeScript
- ❌ Don't use named exports for components
- ❌ Don't create files over 150 lines
- ❌ Don't use relative imports with ../
- ❌ Don't forget 'use client' for interactive components
- ❌ Don't skip touch event preventDefault on mobile
- ❌ Don't hardcode URLs for QR codes
- ❌ Don't forget to clean up old todo code
- ❌ Don't create memory leaks with event listeners
- ❌ Don't assume viewport size - detect dynamically

---

**Confidence Score: 9/10**

This plan provides comprehensive context for implementing the voting app with clear patterns from the existing codebase, detailed implementation steps, and robust validation loops. The only minor uncertainty is around the exact dicebear API usage, but the documentation reference should resolve that during implementation.
