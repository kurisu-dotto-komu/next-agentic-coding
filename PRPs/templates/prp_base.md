name: "Base PRP Template v2 - Context-Rich with Validation Loops"
description: |

## Purpose

Template optimized for AI agents to implement features with sufficient context and self-validation capabilities to achieve working code through iterative refinement.

## Core Principles

1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Be sure to follow all rules in CLAUDE.md

---

## Goal

[What needs to be built - be specific about the end state and desires]

## Why

- [Business value and user impact]
- [Integration with existing features]
- [Problems this solves and for whom]

## What

[User-visible behavior and technical requirements]

### Success Criteria

- [ ] [Specific measurable outcomes]

## All Needed Context

### Documentation & References (list all context needed to implement the feature)

```yaml
# MUST READ - Use Context7 MCP tool for library documentation
- context7: [library-name]
  topic: [Specific sections/methods you'll need]
  why: [Key patterns and APIs needed]

- file: [path/to/component.tsx]
  why: [Pattern to follow, gotchas to avoid]

- context7: [library-name]
  topic: [Specific topic about common pitfalls]
  critical: [Key insight that prevents common errors]

- docfile: [PRPs/ai_docs/file.md]
  why: [docs that the user has pasted in to the project]
```

### Current Codebase tree (run `tree` in the root of the project) to get an overview of the codebase

```bash

```

### Desired Codebase tree with files to be added and responsibility of file

```bash

```

### Known Gotchas of our codebase & Library Quirks

```typescript
// CRITICAL: [Library name] requires [specific setup]
// Example: Next.js requires 'use client' for interactive components
// Example: Convex mutations have 16KB argument size limit
// Example: Server Components can't use hooks or browser APIs
// Example: Keep components under 120 lines - split if larger
```

## Implementation Blueprint

### Data models and structure

Create the core data models, we ensure type safety and consistency.

```typescript
Examples:
 - TypeScript interfaces/types
 - Convex schema definitions
 - Zod validation schemas
 - API route types

```

### list of tasks to be completed to fullfill the PRP in the order they should be completed

```yaml
Task 1:
MODIFY app/existing-component.tsx:
  - FIND pattern: "export default function OldComponent"
  - INJECT after line containing "const [state, setState]"
  - PRESERVE existing JSX structure

CREATE components/ui/NewComponent.tsx:
  - MIRROR pattern from: components/ui/SimilarComponent.tsx
  - MODIFY component name and core logic
  - KEEP TypeScript prop interface pattern
  - USE export default function pattern

...(...)

Task N:
...

```

### Per task pseudocode as needed added to each task

```typescript

// Task 1
// Pseudocode with CRITICAL details dont write entire code
export default function NewFeature({ param }: { param: string }) {
  // PATTERN: Always validate props with TypeScript (see components/ui/*)
  const validated = validateInput(param);  // throws Error

  // GOTCHA: Server Components can't use useState
  // If interactivity needed, add 'use client' directive

  // PATTERN: Use Convex hooks for real-time data
  const data = useQuery(api.queries.items.list, {
    filter: validated
  });

  // CRITICAL: Handle loading states
  if (data === undefined) {
    return <LoadingSpinner />;  // see components/ui/LoadingSpinner.tsx
  }

  // PATTERN: Error boundaries for robustness
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <div className="space-y-4">
        {data.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </ErrorBoundary>
  );
}
```

### Integration Points

```yaml
ENVIRONMENT:
  - add to: .env.local
  - pattern: "NEXT_PUBLIC_FEATURE_FLAG=true"

CONVEX:
  - schema: "Add new table 'features' with fields"
  - index: "Add index by_user on features table"

ROUTES:
  - add to: app/(routes)/feature/page.tsx
  - pattern: "Server Component with preloaded Convex query"
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
// CREATE tests/e2e/new-feature.spec.ts with these test cases:
import { test, expect } from "@playwright/test";

test("happy path functionality", async ({ page }) => {
  await page.goto("/feature");
  await expect(page.getByTestId("feature-content")).toBeVisible();
});

test("handles errors gracefully", async ({ page }) => {
  // Simulate error condition
  await page.route("**/api/**", (route) => route.abort());
  await page.goto("/feature");

  await expect(page.getByText("Error loading")).toBeVisible();
});

test("real-time updates work", async ({ page }) => {
  await page.goto("/feature");

  // Trigger update in another tab
  const page2 = await page.context().newPage();
  await page2.goto("/feature");
  await page2.getByTestId("update-button").click();

  // Verify update appears in first tab
  await expect(page.getByText("Updated content")).toBeVisible();
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
npm run test tests/e2e/new-feature.spec.ts

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
