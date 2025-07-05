# Next Agentic Coding Boilerplate

Basic `create-next-app` boilerplate with some additional Agentic Engineering features.

It is recommended to run this project within it's [Devcontainer](./.devcontainer/devcontainer.json).

## Testing and Feedback

These deterministic scripts help your Agents to stay on the right track.

- Playwright [Installation](./.devcontainer/Dockerfile)
- Playwright [config](./playwright.config.ts) & [tests](./tests)
- Include a [sample e2e test](./tests/landing.spec.ts)
- Include a [sample test screenshot](./tests/screenshots.spec.ts)
- Add Typechecks, Linting, Formatting [NPM scripts](./package.json)

## Claude

Claude is the main Agentic Engine. It is configured to use the following tools and commands:

- [Install](./.devcontainer/devcontainer.json) Claude Code CLI on devcontainer startup
- [Playwright & Context7 MCPs](./.mcp.json)
- [CLAUDE.md Rules](./.claude/CLAUDE.md)
- `npm run yolo` for `claude --dangerously-skip-permissions`
- Add Claude Slash Commands
  - [Worktree Flow](./.claude/commands/worktrees)
  - [Cursor Rules Sync](./.claude/commands/cursor-rules-sync.md) (ran once)
  - [Code Review](./.claude/commands/code-review.md)
