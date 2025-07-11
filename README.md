# Next Agentic Coding Boilerplate

Basic `create-next-app` boilerplate with some additional Agentic Engineering features.

It is recommended to run this project within it's [Devcontainer](./.devcontainer/devcontainer.json).

## Useful Scripts

- `npm run yolo` for `claude --dangerously-skip-permissions`
- `npx claude` for regular claude
- `npm run quickfix` runs validation scripts (formatting, linting, typechecking, and unused dependency checking)
- `npm run test` runs E2E tests
- `npm run test:build` runs E2E tests in build mode
- `npm run screenshots` runs screenshot tests
- `./worktrees-setup.sh` for worktree management
- Claude Slash Commands
  - [PRP Generate](./.claude/commands/prps/generate-prp.md)
  - [PRP Execute](./.claude/commands/prps/execute-prp.md)
  - [Cursor Rules Sync](./.claude/commands/cursor-rules-sync.md)
  - [Code Review](./.claude/commands/code-review.md)
  - [Update README](./.claude/commands/update-readme.md)

## Using the PRP System

The PRP (Plan, Review, Proceed) system helps you manage development tasks efficiently:

1. **Add your IDEA** to `prp/ideas/foo.idea.md`
2. **Generate a PLAN** in yolo mode with `/generate-plan foo.idea.md`
3. **Review and modify** the generated PLAN in `prp/plans/foo.plan.md`
4. **Execute the PLAN** with `/execute-plan foo.plan.md`

## Key Technologies

- **Next.js 15** with Turbopack
- **React 19**
- **Convex** for backend/database operations
- **Playwright** for E2E testing
- **TypeScript** with strict configuration

## Testing and Feedback

These deterministic scripts help your Agents to stay on the right track.

- Playwright [Installation](./.devcontainer/Dockerfile)
- Playwright [config](./playwright.config.ts) & [tests](./tests)
- Include a [sample e2e test](./tests/landing.spec.ts)
- Include a [sample test screenshot](./tests/screenshots.spec.ts)
- Add Typechecks, Linting, Formatting [NPM scripts](./package.json)
- [Eslint configuration](./eslint.config.ts) with Next.js and TypeScript rules
- [Prettier configuration](./.prettierrc) with import sorting
- [Knip configuration](./knip.config.ts) for finding unused dependencies

## Claude

Claude is the main Agentic Engine. It is configured to use the following tools and commands:

- [Install](./.devcontainer/devcontainer.json) Claude Code CLI on devcontainer startup
- [Playwright & Context7 MCPs](./.mcp.json)
- [Convex MCP](./.mcp.json) for backend/database operations
- [CLAUDE.md Rules](./.claude/CLAUDE.md)
- `npm run yolo` for `claude --dangerously-skip-permissions`
