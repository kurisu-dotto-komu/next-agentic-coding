name: "Real-time Voting App with Mii-style Avatars"
description: |

## Purpose

Build a real-time audience engagement app where users vote with unique avatars on mobile devices while desktop displays show aggregated results. This PRP provides comprehensive context for one-pass implementation success.

## Core Principles

1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Be sure to follow all rules in CLAUDE.md

---

## Goal

Create a real-time voting application with:

- Mobile view: Unique avatars for each user with O/X (Maru/Batsu) voting buttons
- Desktop view: Live display of all users and their votes with animated proportions bar
- Persistent user sessions and real-time updates via Convex
- QR code for easy mobile access

## Why

- **Business value**: Enable real-time audience engagement and feedback
- **User impact**: Simple, intuitive voting interface accessible from any device
- **Problems solved**: Traditional voting systems lack real-time feedback and engaging visuals

## What

### Mobile View:

- Randomly generated unique avatar per user (persists across refreshes)
- Two voting buttons: O (Maru) and X (Batsu)
- Avatar raises whiteboard with vote symbol while button is held
- Vote clears shortly after button release

### Desktop View:

- Display all connected users with their avatars
- Show current vote status for each user
- Animated proportions bar showing O vs X vs No Vote percentages
- Real-time updates as users join/leave/vote
- QR code in top-right for mobile access
- Auto-shuffle and resize avatars to fit screen

### Success Criteria

- [ ] Mobile users get unique persistent avatars
- [ ] Voting updates appear instantly on all screens
- [ ] Desktop view shows accurate vote proportions
- [ ] QR code successfully links to mobile view
- [ ] App handles 50+ concurrent users smoothly

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Use Context7 MCP tool for library documentation
- context7: /context7/nextjs
  topic: viewport generateViewport responsive design
  why: Need to detect and handle mobile vs desktop viewports

- context7: /context7/convex_dev
  topic: useQuery useMutation real-time subscriptions
  why: Core real-time functionality for votes and presence

- web_resource: https://www.dicebear.com/
  topic: DiceBear avatar generation
  why: Generate unique Mii-style avatars from user IDs

- web_resource: https://www.npmjs.com/package/@dicebear/core
  topic: DiceBear core and avatar styles
  why: Generate unique Mii-style avatars with deterministic seeds

- web_resource: https://www.npmjs.com/package/react-qr-code
  topic: react-qr-code library
  why: Generate QR codes for mobile access

- file: app/page.tsx
  why: Current landing page to be replaced

- file: tests/landing.spec.ts
  why: Test pattern to follow for E2E tests

- docfile: CLAUDE.md
  why: Project conventions and rules to follow
```

### Current Codebase tree

```bash
/workspaces/next-agentic-coding/
├── app/
│   ├── favicon.ico
│   ├── fonts/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── tests/
│   ├── landing.spec.ts
│   ├── screenshots.spec.ts
│   └── test-helpers.ts
├── .env.local
├── .eslintrc.json
├── .gitignore
├── next.config.ts
├── package.json
├── playwright.config.ts
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

### Desired Codebase tree with files to be added

```bash
/workspaces/next-agentic-coding/
├── app/
│   ├── (routes)/              # New: Route organization
│   │   └── vote/              # New: Voting feature route
│   │       └── page.tsx       # New: Vote page (mobile/desktop views)
│   ├── api/                   # New: API routes if needed
│   ├── layout.tsx             # Modified: Add viewport detection
│   └── page.tsx               # Modified: Landing redirects to /vote
├── components/                # New: Component directory
│   ├── Avatar.tsx             # New: Avatar component
│   ├── VoteButton.tsx         # New: Vote button component
│   ├── VoteBar.tsx            # New: Proportions bar component
│   ├── QRCode.tsx             # New: QR code component
│   ├── UserGrid.tsx           # New: Desktop user grid
│   └── MobileVoteView.tsx     # New: Mobile voting interface
├── convex/                    # New: Convex backend
│   ├── _generated/            # Auto-generated by Convex
│   ├── schema.ts              # New: Database schema
│   ├── users.ts               # New: User queries/mutations
│   └── votes.ts               # New: Vote queries/mutations
├── lib/                       # New: Utility functions
│   ├── avatars.ts             # New: Avatar generation logic
│   └── viewport.ts            # New: Viewport detection helpers
├── types/                     # New: TypeScript types
│   └── vote.ts                # New: Vote-related types
├── tests/
│   └── e2e/
│       ├── vote-mobile.spec.ts  # New: Mobile voting tests
│       └── vote-desktop.spec.ts # New: Desktop view tests
└── .env.local                   # Modified: Add Convex URL
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Next.js 15 requires 'use client' for interactive components
// Example: VoteButton needs 'use client' for onClick handlers

// CRITICAL: Convex setup requires running `npx convex dev` in separate terminal
// Must have CONVEX_URL in .env.local after setup

// GOTCHA: DiceBear avatars need deterministic seeds for persistence
// Use user's Convex document ID as seed
// Import from @dicebear/core and @dicebear/collection, not the old API

// GOTCHA: Viewport detection in Next.js App Router
// Use middleware or client-side detection, not server components

// GOTCHA: react-qr-code needs explicit width/height for proper display
// Default size may be too small on desktop

// CRITICAL: Keep components under 120 lines - split if larger
// VoteView should be split into MobileVoteView and DesktopVoteView

// GOTCHA: Convex real-time subscriptions require ConvexProvider wrapper
// Must wrap app in ConvexProvider in layout.tsx
```

## Implementation Blueprint

### Data models and structure

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// types/vote.ts
export interface User {
  _id: string;
  sessionId: string;
  avatarSeed: string;
  createdAt: number;
  lastSeen: number;
}

export interface Vote {
  _id: string;
  userId: string;
  vote: "O" | "X" | null;
  timestamp: number;
}

export default defineSchema({
  users: defineTable({
    sessionId: v.string(),
    avatarSeed: v.string(),
    lastSeen: v.number(),
  }).index("by_session", ["sessionId"]),

  votes: defineTable({
    userId: v.id("users"),
    vote: v.union(v.literal("O"), v.literal("X"), v.null()),
    timestamp: v.number(),
  }).index("by_user", ["userId"]),
});
```

### List of tasks to be completed in order

```yaml
Task 1: Install and configure Convex
INSTALL packages:
  - npm install convex
  - npx convex dev (keep running in separate terminal)

MODIFY .env.local:
  - Add NEXT_PUBLIC_CONVEX_URL from convex dev output

CREATE convex/schema.ts:
  - Define users and votes tables with indexes

MODIFY app/layout.tsx:
  - Wrap children in ConvexProvider
  - Import ConvexClientProvider from new file

Task 2: Create ConvexClientProvider component
CREATE components/ConvexClientProvider.tsx:
  - 'use client' directive required
  - Initialize ConvexReactClient
  - Wrap children in ConvexProvider
  - Use NEXT_PUBLIC_CONVEX_URL

Task 3: Install avatar and QR libraries
INSTALL packages:
  - npm install @dicebear/core @dicebear/collection react-qr-code
  - npm install --save-dev @types/react

Task 4: Create failing tests first (TDD approach)
CREATE tests/e2e/vote-mobile.spec.ts:
  - Write failing tests for avatar generation
  - Write failing tests for voting interaction
  - Write failing tests for vote persistence
  - Expected: All tests fail initially

CREATE tests/e2e/vote-desktop.spec.ts:
  - Write failing tests for user grid display
  - Write failing tests for real-time updates
  - Write failing tests for QR code generation
  - Expected: All tests fail initially

Task 5: Create avatar generation utility
CREATE lib/avatars.ts:
  - DiceBear avatar generation with deterministic seeds
  - Export generateAvatar function
  - Expected: Avatar tests start passing

Task 6: Create user session management
CREATE convex/users.ts:
  - getOrCreateUser mutation
  - listActiveUsers query
  - updateLastSeen mutation

CREATE lib/session.ts:
  - generateSessionId function using crypto
  - getSessionId from localStorage
  - Client-side only with 'use client'

Task 7: Create vote management
CREATE convex/votes.ts:
  - castVote mutation
  - getCurrentVotes query
  - getVoteStats query (returns percentages)

Task 8: Create viewport detection
CREATE lib/viewport.ts:
  - useViewport hook (client-side)
  - Returns 'mobile' | 'desktop' based on width
  - Use 768px breakpoint

Task 9: Create Avatar component
CREATE components/Avatar.tsx:
  - Use DiceBear library with @dicebear/core and @dicebear/collection
  - Props: seed, size, showVote, vote
  - Show whiteboard overlay when vote active
  - Animate whiteboard appearance
  - Use 'adventurer' or 'avataaars' style for Mii-like appearance

Task 10: Create VoteButton component
CREATE components/VoteButton.tsx:
  - 'use client' directive
  - Props: type ('O' | 'X'), onVote
  - Handle touch/mouse down and up
  - Visual feedback on press

Task 11: Create VoteBar component
CREATE components/VoteBar.tsx:
  - Show O, X, and no-vote percentages
  - Animated transitions using CSS
  - Color-coded sections

Task 12: Create UserGrid component
CREATE components/UserGrid.tsx:
  - Grid layout that auto-adjusts
  - Show all active users with avatars
  - Display current votes
  - CSS Grid with auto-fill

Task 13: Create MobileVoteView component
CREATE components/MobileVoteView.tsx:
  - 'use client' directive
  - Large centered avatar
  - Two vote buttons below
  - Handle vote state

Task 14: Create DesktopVoteView component
CREATE components/DesktopVoteView.tsx:
  - VoteBar at top
  - UserGrid below
  - QRCode in top-right corner

Task 15: Create main vote page
CREATE app/(routes)/vote/page.tsx:
  - Detect viewport (client-side)
  - Render appropriate view
  - Handle user session creation

Task 16: Update landing page
MODIFY app/page.tsx:
  - Remove default Next.js content
  - Add redirect to /vote
  - Or simple landing with "Enter" button

Task 17: Verify all tests pass
VERIFY tests/e2e/vote-mobile.spec.ts:
  - All avatar tests now pass
  - All voting interaction tests pass
  - All vote persistence tests pass

VERIFY tests/e2e/vote-desktop.spec.ts:
  - All user grid display tests pass
  - All real-time update tests pass
  - All QR code generation tests pass

UPDATE tests/test-helpers.ts:
  - Add vote route to ROUTES

EXPECTED: All tests that were failing in Task 4 now pass
```

### Per task pseudocode

```typescript
// Task 2: ConvexClientProvider
'use client';
export default function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}

// Task 4: User session management
// convex/users.ts
export const getOrCreateUser = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    // Check if user exists
    const existing = await ctx.db.query("users")
      .withIndex("by_session", q => q.eq("sessionId", args.sessionId))
      .first();

    if (existing) {
      // Update last seen
      await ctx.db.patch(existing._id, { lastSeen: Date.now() });
      return existing._id;
    }

    // Create new user
    return await ctx.db.insert("users", {
      sessionId: args.sessionId,
      avatarSeed: crypto.randomUUID(),
      lastSeen: Date.now(),
    });
  },
});

// Task 5: Avatar generation utility
// lib/avatars.ts
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';

export function generateAvatar(seed: string, size = 96) {
  return createAvatar(adventurer, {
    seed,
    size,
    backgroundColor: ['b6e3f4','c0aede','d1d4f9'],
    // Mii-like styling options
  }).toString();
}

// Task 10: VoteButton component
'use client';
export default function VoteButton({ type, onVote }: VoteButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(true);
    onVote(type);
  };

  const handleRelease = () => {
    setIsPressed(false);
    onVote(null);
  };

  return (
    <button
      className={cn(
        "w-32 h-32 rounded-full text-6xl font-bold transition-all",
        type === 'O' ? "bg-green-500" : "bg-red-500",
        isPressed && "scale-95 brightness-90"
      )}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
    >
      {type}
    </button>
  );
}
```

### Integration Points

```yaml
ENVIRONMENT:
  - add to: .env.local
  - pattern: "NEXT_PUBLIC_CONVEX_URL=https://..."

CONVEX:
  - Run: npx convex dev (keep running)
  - Schema: users and votes tables with indexes
  - Functions: user management, vote casting, stats

ROUTES:
  - add to: app/(routes)/vote/page.tsx
  - pattern: "Client Component with viewport detection"

LAYOUT:
  - modify: app/layout.tsx
  - wrap in: ConvexClientProvider
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
npm run quickfix              # Runs ESLint, TypeScript, Prettier

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests (TDD Approach)

**CRITICAL: Tests should already exist from Task 4 and should now be passing**

```typescript
// VERIFY tests/e2e/vote-mobile.spec.ts (created in Task 4)
import { expect, test } from "@playwright/test";

import { ROUTES } from "../test-helpers";

test("mobile user gets unique avatar", async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(ROUTES.vote);

  // Check avatar is visible
  await expect(page.getByTestId("user-avatar")).toBeVisible();

  // Refresh and verify avatar persists
  await page.reload();
  await expect(page.getByTestId("user-avatar")).toBeVisible();
});

test("voting updates avatar display", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(ROUTES.vote);

  // Press O button
  const oButton = page.getByTestId("vote-button-O");
  await oButton.press("Enter");

  // Check whiteboard appears
  await expect(page.getByTestId("vote-whiteboard")).toBeVisible();

  // Release and check it disappears
  await page.keyboard.up("Enter");
  await expect(page.getByTestId("vote-whiteboard")).not.toBeVisible();
});

// CREATE tests/e2e/vote-desktop.spec.ts
test("desktop shows all users", async ({ page }) => {
  await page.goto(ROUTES.vote);

  // Open second tab to create another user
  const page2 = await page.context().newPage();
  await page2.goto(ROUTES.vote);

  // Check both users appear on desktop
  const userAvatars = page.getByTestId("user-grid").locator('[data-testid="grid-avatar"]');
  await expect(userAvatars).toHaveCount(2);
});

test("real-time vote updates", async ({ page }) => {
  await page.goto(ROUTES.vote);

  // Mobile user in second tab
  const mobile = await page.context().newPage();
  await mobile.setViewportSize({ width: 375, height: 667 });
  await mobile.goto(ROUTES.vote);

  // Vote on mobile
  await mobile.getByTestId("vote-button-O").click();

  // Check desktop updates
  await expect(page.getByTestId("vote-bar-O")).toContainText("50%");
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

# Run specific E2E tests
npm run test tests/e2e/vote-mobile.spec.ts
npm run test tests/e2e/vote-desktop.spec.ts

# Update screenshots if UI changed
npm run screenshots

# Expected: All tests pass, build succeeds
```

## Final validation Checklist

- [ ] All tests pass: `npm run test` (TDD approach followed)
- [ ] No linting errors: `npm run quickfix`
- [ ] Build succeeds: `npm run test:build`
- [ ] TypeScript types are comprehensive
- [ ] Components stay under 120 lines
- [ ] Real-time features work without refresh
- [ ] Error cases handled gracefully
- [ ] Follows all CLAUDE.md conventions
- [ ] Convex dev server running during development
- [ ] Mobile and desktop views work correctly
- [ ] DiceBear avatars generate consistently with same seeds
- [ ] Tests written before implementation (Task 4 completed first)

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
- ❌ Don't hardcode Convex URL - use env var
- ❌ Don't forget to handle loading states with useQuery
- ❌ Don't skip TDD - write failing tests first in Task 4
- ❌ Don't implement features before tests exist and fail

---

## Confidence Score: 9/10

This PRP provides comprehensive context for implementing the voting app with:

- Clear documentation references for all libraries
- Specific implementation steps in correct order
- Known gotchas and solutions identified
- Executable validation tests
- TypeScript patterns from the codebase

The only uncertainty is the exact avatar styling to achieve "Mii-like" appearance, but the libraries provide sufficient customization options.
