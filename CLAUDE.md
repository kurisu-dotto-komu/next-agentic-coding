### 🔄 Project Awareness & Context

- **Use consistent naming conventions, file structure, and architecture patterns**
- **We are running Next.js dev server on port 3000** - never start your own next.js dev server.
- **We are running a Convex dev server, which will automatically generate generated convex api files** - never start your own convex dev server.

### 🧱 Code Structure & Modularity

- **Never create a file longer than 150 lines of code.** If a file approaches this limit, refactor by splitting it into modules or helper files.
- **Organize code into clearly separated modules**, grouped by feature or responsibility.
  For Next.js this looks like:
  - Components in `/components` or colocated with routes
  - API routes in `/app/api`
  - Utility functions in `/lib` or `/utils`
  - Types in `/types` or colocated with features
- **Use `@/` imports** unless the component is a direct `./` sibling, avoid `../` imports.
- **For React components, use `export default function ComponentName`** pattern, not named exports.
- **Main routes are in `./app/(routes)`** folder for better organization.

### 🧪 Testing & Reliability

- **Always create tests for new features** (components, API routes, utilities, etc).
- **Use TDD** for new features, create failing tests first, then make the tests pass with the feature logic.
- **After updating any logic**, check whether existing tests need to be updated. If so, do it.
- **Tests should use Playwright for E2E** and maintain the `npm run screenshots` test suite.
  - Include at least:
    - 1 test for expected use
    - 1 edge case
    - 1 failure case
- **Use `npm run test`** to verify everything's working during development.
- **Use `npm run quickfix`** frequently (runs `eslint`, `tsc`, and `prettier`).
- **Use `npm run test:build`** at the end of big tasks to check the build.

### 📎 Style & Conventions

- **Always use TypeScript**, never JavaScript.
- **Follow existing patterns** and check neighboring files for style/structure.
- **Never use `any`, `// eslint-disable-next-line`**, or similar type shortcuts.
- **Use Convex** for backend/database operations when applicable.
- **Follow the DRY principle** and keep comments minimal.
- **Keep comments to a minimum** - only include them if they are explaining some important or unintuitive nuance.

### 📚 Documentation & Explainability

- **Update `README.md`** when new features are added, dependencies change, or setup steps are modified.
- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer.
- When writing complex logic, **add an inline `// Reason:` comment** explaining the why, not just the what.

### 🧠 AI Behavior Rules

- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate libraries or functions in the codebase** – only use known, verified packages from package.json.
- **Always confirm file paths and module names** exist before referencing them in code or tests.
- **Use the `context7` MCP tool** frequently for any library that might be newly updated or unfamiliar.
- **Use the `playwright` MCP tool** for DOM inspection and visual debugging.
- **Don't make git commits** unless explicitly instructed.
- **Never proactively create documentation files** (\*.md) unless specifically requested.
- **Prefer editing existing files** over creating new ones.
- **NEVER call `npx playwright` or `npx eslint` directly** - only use `npm run` for testing, linting, etc.
- **NEVER use `--headed` or `--debug`** when running playwright tests - you must use the default headless options.
