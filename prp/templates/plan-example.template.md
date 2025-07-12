name: "Next.js Real-Time Application with Convex Integration"
description: |

## Purpose

Build a Next.js application with real-time features using Convex for the backend, TypeScript throughout, and comprehensive Playwright E2E testing. This demonstrates modern Next.js patterns with server components, real-time data synchronization, and type-safe API integration.

## Core Principles

1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Be sure to follow all rules in CLAUDE.md

---

## Goal

Create a production-ready Next.js application with real-time collaborative features, using Convex for backend operations, TypeScript for type safety, and Playwright for comprehensive testing. The system should follow Next.js App Router patterns and maintain high code quality.

## Why

- **Business value**: Enables real-time collaborative features with excellent DX
- **Integration**: Demonstrates modern Next.js patterns with Convex backend
- **Problems solved**: Reduces complexity of real-time data synchronization

## What

A Next.js application where:

- Users interact with real-time collaborative features
- Convex handles all backend operations with type-safe queries/mutations
- React Server Components optimize performance
- Playwright tests ensure reliability

### Success Criteria

- [ ] Real-time data updates work seamlessly
- [ ] TypeScript provides full type safety
- [ ] All Playwright tests pass
- [ ] Code passes `npm run quickfix` (ESLint, TypeScript, Prettier)
- [ ] Application builds successfully with `npm run test:build`

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Use Context7 MCP tool for library documentation
- context7: next.js
  topic: App Router patterns and conventions
  why: Modern Next.js patterns with server components

- context7: convex
  topic: Setup, queries, mutations, real-time sync
  why: Backend operations and real-time data

- context7: playwright
  topic: E2E testing patterns
  why: Comprehensive testing approach

- file: CLAUDE.md
  why: Project-specific conventions and rules

- file: app/(routes)/
  why: Existing route structure to follow

- file: package.json
  why: Available dependencies and scripts

- docfile: planning/ideas/realtime-app/docs.md
  why: User-provided documentation and requirements

- context7: convex
  topic: Query functions and data fetching
  why: Real-time data synchronization patterns

- context7: convex
  topic: Mutation functions and data updates
  why: Type-safe data modifications
```

### Current Codebase tree

```bash
.
├── app/
│   ├── (routes)/        # Main application routes
│   │   └── todos/       # Existing todos route (to be removed)
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/          # Shared components
├── lib/                # Utility functions
├── public/             # Static assets
├── tests/              # Playwright tests
│   └── e2e/
│       └── todos.spec.ts # Existing todos tests (to be removed)
├── convex/             # Convex backend (if exists)
├── package.json
├── tsconfig.json
├── CLAUDE.md
└── .env.example
```

### Desired Codebase tree with files to be added

```bash
.
├── app/
│   ├── (routes)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx         # Real-time dashboard
│   │   │   └── layout.tsx       # Dashboard layout
│   ├── layout.tsx
│   ├── globals.css
│   ├── api/
│   │   └── webhooks/            # API webhooks if needed
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Dashboard.tsx
│   │   └── RealtimeList.tsx
│   └── lib/
│       ├── utils.ts             # Utility functions
│       └── types.ts             # Shared TypeScript types
├── convex/
│   ├── schema.ts               # Database schema
│   ├── _generated/             # Auto-generated Convex files
│   ├── queries/                # Query functions
│   │   └── items.ts
│   └── mutations/              # Mutation functions
│       └── items.ts
├── tests/
│   ├── e2e/
│   │   ├── dashboard.spec.ts  # Dashboard tests
│   │   └── realtime.spec.ts   # Real-time feature tests
│   └── screenshots.spec.ts
└── .env.example              # Updated with Convex URL
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Always use TypeScript, never JavaScript
// CRITICAL: Components must use export default function pattern
// CRITICAL: Keep files under 150 lines - split larger ones
// CRITICAL: Use @/ imports, avoid ../
// CRITICAL: Dev server already running on port 3000
// CRITICAL: Use npm run commands, not npx directly
// CRITICAL: Convex requires NEXT_PUBLIC_CONVEX_URL in .env
// CRITICAL: Server Components can't use hooks or browser APIs
// CRITICAL: Client Components need 'use client' directive
```

## Implementation Blueprint

### Data models and structure

```typescript
// convex/schema.ts - Database schema
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  items: defineTable({
    title: v.string(),
    description: v.string(),
    completed: v.boolean(),
    userId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_created", ["createdAt"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    avatar: v.optional(v.string()),
  }).index("by_email", ["email"]),
});

// lib/types.ts - Shared TypeScript types
export interface Item {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}
```

### List of tasks to be completed

```yaml
Task 1: Write Failing Tests First (TDD)
CREATE tests/e2e/dashboard.spec.ts:
  - Write comprehensive test suite for dashboard functionality
  - Include happy path, error cases, and real-time sync tests
  - Tests should fail initially (no implementation yet)
  - Use data-testid attributes that components will implement

CREATE tests/e2e/realtime.spec.ts:
  - Write tests for real-time collaboration features
  - Test multiple client synchronization
  - Test optimistic updates and conflict resolution
  - All tests should fail initially

Task 2: Clean Up Existing Todos Route
REMOVE existing todos references:
  - DELETE app/(routes)/todos/* - remove entire todos route
  - DELETE tests/e2e/todos.spec.ts - remove todos tests
  - DELETE tests/screenshots.spec.ts sections referencing todos
  - SEARCH for "todos" references in:
    * Components that might import todos functionality
    * Navigation/menu components linking to /todos
    * Any shared utilities used by todos
  - UPDATE navigation to remove todos links
  - ENSURE no orphaned imports or dead code remains

Task 3: Setup Convex Integration
UPDATE .env.example:
  - Add NEXT_PUBLIC_CONVEX_URL placeholder
  - Add instructions for getting Convex deployment URL

SETUP convex/:
  - Initialize Convex with npx convex dev --once
  - Create schema.ts with type-safe definitions
  - Ensure _generated/ is in .gitignore

Task 4: Create UI Components
CREATE components/ui/:
  - PATTERN: export default function ComponentName
  - Keep under 150 lines each
  - Use TypeScript interfaces for props
  - Follow existing component patterns

Task 5: Implement Dashboard Route
CREATE app/(routes)/dashboard/page.tsx:
  - PATTERN: Server Component fetching initial data
  - Use Convex preloaded queries
  - Client components for interactive parts
  - Real-time subscriptions with useQuery

Task 6: Create Convex Queries/Mutations
CREATE convex/queries/items.ts:
  - PATTERN: Type-safe query functions
  - Use indexes for performance
  - Return structured data

CREATE convex/mutations/items.ts:
  - PATTERN: Type-safe mutation functions
  - Validate inputs with Convex validators
  - Handle errors gracefully

Task 7: Add Real-time Features
CREATE components/features/RealtimeList.tsx:
  - PATTERN: 'use client' directive
  - useQuery for real-time updates
  - useMutation for optimistic updates
  - Error boundaries for robustness

Task 8: Run Tests and Fix Implementation
RUN tests/e2e/dashboard.spec.ts:
  - Execute the failing tests written in Task 1
  - Identify specific failures
  - Fix implementation to make tests pass
  - Iterate until all tests are green
CREATE tests/e2e/dashboard.spec.ts:
  - PATTERN: Playwright test structure
  - Test real-time updates
  - Test error scenarios
  - Use data-testid attributes

Task 9: First Screenshot Analysis Iteration
CREATE tests/screenshots/dashboard.spec.ts:
  - Add comprehensive screenshot tests for all UI states
  - Include empty, loading, error, and populated states
  - Test modal/dropdown open states

RUN npm run screenshots -- Dashboard:
  - Generate initial screenshots
  - Use multi-modal vision to analyze screenshots
  - Check for:
    * Spacing and alignment issues
    * Text overflow or truncation
    * Color contrast problems
    * Responsive layout issues
    * Loading state visibility
    * Error message clarity
  - Document all visual issues found

FIX visual issues:
  - Update CSS for spacing/alignment
  - Fix overflow issues
  - Adjust colors for better contrast
  - Improve responsive breakpoints

Task 10: Second Screenshot Analysis Iteration
RUN npm run screenshots -- Dashboard (again):
  - Generate updated screenshots after fixes
  - Use multi-modal vision to verify fixes
  - Check for:
    * All previous issues resolved
    * No new issues introduced
    * Consistent design system usage
    * Proper hover/focus states
    * Animation smoothness
    * Typography hierarchy
  - Document any remaining issues

FIX remaining visual issues:
  - Fine-tune any remaining problems
  - Ensure pixel-perfect implementation
  - Verify accessibility concerns
CREATE tests/screenshots/dashboard.spec.ts:
  - PATTERN: Visual regression tests
  - Capture key UI states
  - Store baseline screenshots
  - Compare on CI

Task 11: Final Integration Testing
RUN npm run test:build:
  - Ensure all tests pass in production build
  - Verify no build errors
  - Check bundle size optimization

RUN full E2E suite:
  - Execute all tests together
  - Verify no test interference
  - Ensure consistent pass rate

Task 12: Create Documentation
UPDATE README.md:
  - Setup instructions
  - Convex deployment steps
  - Environment variables
  - Architecture overview
```

### Per task pseudocode

```typescript
// Task 1: TDD - Write failing tests first
// tests/e2e/dashboard.spec.ts
import { expect, test } from "@playwright/test";

test.describe("Dashboard functionality", () => {
  test("loads and displays items", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByTestId("dashboard-title")).toHaveText("Dashboard");
    await expect(page.getByTestId("item-list")).toBeVisible();
  });

  test("adds new item with real-time update", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByTestId("add-item-button").click();
    await page.getByTestId("item-title-input").fill("New Task");
    await page.getByTestId("item-description-input").fill("Task description");
    await page.getByTestId("submit-button").click();

    // Should appear immediately without refresh
    await expect(page.getByText("New Task")).toBeVisible();
  });

  test("shows error state on network failure", async ({ page }) => {
    await page.route("**/api/**", route => route.abort());
    await page.goto("/dashboard");
    await expect(page.getByTestId("error-message")).toBeVisible();
  });
});

// Task 5: Dashboard Route
// app/(routes)/dashboard/page.tsx
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // PATTERN: Server Component with preloaded data
  const preloadedItems = await preloadQuery(api.queries.items.list);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {/* CRITICAL: Pass preloaded to Client Component */}
      <DashboardClient preloadedItems={preloadedItems} />
    </div>
  );
}

// Task 7: Real-time Client Component
// app/(routes)/dashboard/DashboardClient.tsx
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Preloaded } from "convex/nextjs";

interface Props {
  preloadedItems: Preloaded<typeof api.queries.items.list>;
}

export default function DashboardClient({ preloadedItems }: Props) {
  // PATTERN: Real-time subscription
  const items = useQuery(api.queries.items.list, undefined, {
    initialData: preloadedItems,
  });

  const createItem = useMutation(api.mutations.items.create);

  // CRITICAL: Handle loading/error states
  if (items === undefined) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} />
      ))}
    </div>
  );
}
```

### Integration Points

```yaml
ENVIRONMENT:
  - add to: .env.local
  - vars: |
      # Convex deployment URL
      NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

CONFIG:
  - Convex Provider: Wrap app in ConvexProvider
  - Authentication: Optional - integrate with Clerk/Auth0

SCRIPTS:
  - npm run quickfix: Runs ESLint, TypeScript, Prettier
  - npm run test: Runs Playwright tests
  - npm run screenshots: Updates screenshot baselines
  - npm run test:build: Verifies production build
```

## Validation Loop

### Level 0: TDD Unit Tests each new feature/file/function, use existing test patterns

```typescript
// Tests will fail before code is written; no need to actually run the tests yet, but they will guide development
// CREATE tests/e2e/dashboard.spec.ts with these test cases:
import { expect, test } from "@playwright/test";

test("dashboard loads with real-time data", async ({ page }) => {
  await page.goto("/dashboard");

  // Wait for initial data
  await expect(page.getByTestId("item-list")).toBeVisible();

  // Test real-time update
  await page.getByTestId("add-item-button").click();
  await page.getByTestId("item-title").fill("Test Item");
  await page.getByTestId("submit-button").click();

  // Verify item appears without refresh
  await expect(page.getByText("Test Item")).toBeVisible();
});

test("handles errors gracefully", async ({ page }) => {
  // Simulate network error
  await page.route("**/api/**", (route) => route.abort());
  await page.goto("/dashboard");

  await expect(page.getByText("Error loading data")).toBeVisible();
});

test("real-time updates across multiple clients", async ({ page }) => {
  await page.goto("/dashboard");

  // Open second client
  const page2 = await page.context().newPage();
  await page2.goto("/dashboard");

  // Add item in second client
  await page2.getByTestId("add-item-button").click();
  await page2.getByTestId("item-title").fill("Cross-client update");
  await page2.getByTestId("submit-button").click();

  // Verify update appears in first client
  await expect(page.getByText("Cross-client update")).toBeVisible();
});
// Write code only after creating tests
```

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
npm run quickfix              # ESLint, TypeScript, Prettier

# Expected: No errors. If errors, READ and fix.
```

### Level 2: Unit Tests

```bash
# After implementing code, run and iterate until passing:
npm run test
# If failing: Read error, understand root cause, fix code, re-run
```

### Level 3: Visual Feedback Loop

```typescript
// After implementing a large feature, each of its views should be added to the screenshots.spec.ts
// Ensure screenshots are taken so all possible states and views are covered
test.describe("Screenshots: Dashboard", () => {
  test("Dashboard Page", async ({ page }) => {
    await takeScreenshot(page, "/dashboard");
    // Add item modal
    await page.getByTestId("add-item-button").click();
    await takeScreenshot(page, "/dashboard", "add-item-modal");
    // With items
    await page.getByTestId("modal-close").click();
    await takeScreenshot(page, "/dashboard", "with-items");
  });

  test("Dashboard States", async ({ page }) => {
    // Empty state
    await page.goto("/dashboard?empty=true");
    await takeScreenshot(page, "/dashboard", "empty-state");
    // Loading state
    await page.goto("/dashboard?loading=true");
    await takeScreenshot(page, "/dashboard", "loading-state");
    // Error state
    await page.goto("/dashboard?error=true");
    await takeScreenshot(page, "/dashboard", "error-state");
  });
});
```

```bash
# Then take screenshots of the feature,
npm run screenshots -- Dashboard
# check the output for the filenames,
# then LOOK AT the screenshots with multi-modal vision,
# and gather feedback to check for visual design issues and improvements
# Check screenshots for proper spacing/alignment, text overflow, visual glitches, responsive layout issues, and component rendering problems
# Verify colors, contrast, typography, hover states, loading indicators, and overall visual consistency with design system
# update the code to fix the visual issues, then run the screenshots again
npm run screenshots -- Dashboard
# repeat until no visual issues are found
```

### Level 4: Integration Test

```bash
# Test production build
npm run test:build

# Expected output:
# ✓ Compiled successfully
# ✓ Linting and type checking
# ✓ Collecting page data
# ✓ Generating static pages
```

## Final Validation Checklist

- [ ] All tests pass: `npm run test`
- [ ] No linting errors: `npm run quickfix`
- [ ] No visual issues for any screenshot files: `npm run screenshots`
- [ ] Build succeeds: `npm run test:build`
- [ ] TypeScript types are comprehensive; no `any` or `unknown`
- [ ] Components stay under 150 lines; split if larger
- [ ] Real-time features work without refresh
- [ ] Error cases handled gracefully
- [ ] Follows all CLAUDE.md conventions

---

## Anti-Patterns to Avoid

- ❌ Don't use JavaScript - always TypeScript
- ❌ Don't use named exports for components
- ❌ Don't create files over 150 lines
- ❌ Don't use relative imports with ../
- ❌ Don't call npx directly - use npm run
- ❌ Don't forget 'use client' for interactive components
- ❌ Don't skip validation - run quickfix frequently
- ❌ Don't ignore failing tests - fix them
- ❌ Don't hardcode values that should be env vars
- ❌ Don't use `any` or `unknown` types

## Confidence Score: 9/10

High confidence due to:

- Clear Next.js App Router patterns
- Well-documented Convex integration
- Existing project conventions in CLAUDE.md
- Comprehensive validation with quickfix
- Established Playwright testing patterns

Minor uncertainty on specific Convex schema requirements, but documentation provides clear guidance.
