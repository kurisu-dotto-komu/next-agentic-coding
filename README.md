# Next Agentic Coding Boilerplate

Basic `create-next-app` boilerplate with some additional Agentic Engineering features.

It is recommended to run this project within it's [Devcontainer](./.devcontainer/devcontainer.json).

## Key Technologies

- **Next.js 15.3.3** with Turbopack
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
- Add Claude Slash Commands
  - [Worktree Flow](./.claude/commands/worktrees)
  - [Cursor Rules Sync](./.claude/commands/cursor-rules-sync.md) (ran once)
  - [Code Review](./.claude/commands/code-review.md)
  - [Update README](./.claude/commands/update-readme.md)
