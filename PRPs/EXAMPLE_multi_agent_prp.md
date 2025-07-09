name: "Next.js Real-Time Application with Convex Integration"
description: |

## Purpose

Build a Next.js application with real-time features using Convex for the backend, TypeScript throughout, and comprehensive Playwright E2E testing. This demonstrates modern Next.js patterns with server components, real-time data synchronization, and type-safe API integration.

## Core Principles

1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance

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
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/          # Shared components
├── lib/                # Utility functions
├── public/             # Static assets
├── tests/              # Playwright tests
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
│   │   └── api/
│   │       └── webhooks/        # API webhooks if needed
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                      # UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   └── features/                # Feature-specific components
│       ├── Dashboard.tsx
│       └── RealtimeList.tsx
├── convex/
│   ├── schema.ts               # Database schema
│   ├── _generated/             # Auto-generated Convex files
│   ├── queries/                # Query functions
│   │   └── items.ts
│   └── mutations/              # Mutation functions
│       └── items.ts
├── lib/
│   ├── utils.ts               # Utility functions
│   └── types.ts               # Shared TypeScript types
├── tests/
│   ├── e2e/
│   │   ├── dashboard.spec.ts  # Dashboard tests
│   │   └── realtime.spec.ts   # Real-time feature tests
│   └── screenshots/           # Screenshot tests
│       └── dashboard.spec.ts
├── .env.example              # Updated with Convex URL
└── README.md                 # Comprehensive documentation
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Always use TypeScript, never JavaScript
// CRITICAL: Components must use export default function pattern
// CRITICAL: Keep files under 120 lines - split larger ones
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
Task 1: Setup Convex Integration
UPDATE .env.example:
  - Add NEXT_PUBLIC_CONVEX_URL placeholder
  - Add instructions for getting Convex deployment URL

SETUP convex/:
  - Initialize Convex with npx convex dev --once
  - Create schema.ts with type-safe definitions
  - Ensure _generated/ is in .gitignore

Task 2: Create UI Components
CREATE components/ui/:
  - PATTERN: export default function ComponentName
  - Keep under 120 lines each
  - Use TypeScript interfaces for props
  - Follow existing component patterns

Task 3: Implement Dashboard Route
CREATE app/(routes)/dashboard/page.tsx:
  - PATTERN: Server Component fetching initial data
  - Use Convex preloaded queries
  - Client components for interactive parts
  - Real-time subscriptions with useQuery

Task 4: Create Convex Queries/Mutations
CREATE convex/queries/items.ts:
  - PATTERN: Type-safe query functions
  - Use indexes for performance
  - Return structured data

CREATE convex/mutations/items.ts:
  - PATTERN: Type-safe mutation functions
  - Validate inputs with Convex validators
  - Handle errors gracefully

Task 5: Add Real-time Features
CREATE components/features/RealtimeList.tsx:
  - PATTERN: 'use client' directive
  - useQuery for real-time updates
  - useMutation for optimistic updates
  - Error boundaries for robustness

Task 6: Implement E2E Tests
CREATE tests/e2e/dashboard.spec.ts:
  - PATTERN: Playwright test structure
  - Test real-time updates
  - Test error scenarios
  - Use data-testid attributes

Task 7: Add Screenshot Tests
CREATE tests/screenshots/dashboard.spec.ts:
  - PATTERN: Visual regression tests
  - Capture key UI states
  - Store baseline screenshots
  - Compare on CI

Task 8: Create Documentation
UPDATE README.md:
  - Setup instructions
  - Convex deployment steps
  - Environment variables
  - Architecture overview
```

### Per task pseudocode

```typescript
// Task 3: Dashboard Route
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

// Task 5: Real-time Client Component
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

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
npm run quickfix              # ESLint, TypeScript, Prettier

# Expected: No errors. If errors, READ and fix.
```

### Level 2: Component Tests

```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from "@playwright/test";

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
```

```bash
# Run tests iteratively until passing:
npm run test

# If failing: Debug specific test, fix code, re-run
```

### Level 3: Build Verification

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
- [ ] Build succeeds: `npm run test:build`
- [ ] Real-time updates work without refresh
- [ ] TypeScript types are comprehensive
- [ ] Components stay under 120 lines
- [ ] Screenshot tests capture UI correctly
- [ ] Error states handled gracefully
- [ ] README includes clear setup instructions
- [ ] .env.example has Convex URL placeholder

---

## Anti-Patterns to Avoid

- ❌ Don't use JavaScript - always TypeScript
- ❌ Don't use named exports for components
- ❌ Don't create files over 120 lines
- ❌ Don't use relative imports with ../
- ❌ Don't call npx directly - use npm run
- ❌ Don't forget 'use client' for interactive components
- ❌ Don't put secrets in code - use .env.local
- ❌ Don't skip the quickfix validation

## Confidence Score: 9/10

High confidence due to:

- Clear Next.js App Router patterns
- Well-documented Convex integration
- Existing project conventions in CLAUDE.md
- Comprehensive validation with quickfix
- Established Playwright testing patterns

Minor uncertainty on specific Convex schema requirements, but documentation provides clear guidance.
