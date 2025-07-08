# General Code

- always use typescript, never javascript
- follow existing patterns and check neighboring files for style/structure
- use `@/` imports unless the component is a direct `./` sibling, avoid `../` imports
- for React components, use the `export default function ComponentName` pattern, not named exports
- never try to "shortcut" the type system by using `// eslint-disable-next-line`, `any`, or similar
- if a component or other module file is more than 120 lines, split it into smaller modules
- otherwise, prefer editing existing files over creating new ones
- keep comments to a minimum; only include them if they are explaining some important or unintuitive nuance
- follow the DRY principle

# Development

- we are running a dev server on port 3000 in the background so you don't need to run it yourself
- NEVER make git commands like commits unless I _explicitly_ instruct you to, and only do so once unles I say otherwise
- NEVER proactively create documentation files (\*.md) unless explicitly requested
- NEVER call `npx playwright` or `npx eslint` directly, only use `npm run` for testing, linting, etc.
- NEVER use `--headed` or `--debug` when running playwright tests - you must use the default headless options
- use the `playwright` mcp tool if you need to check the DOM or make temporary screenshots for visual debugging
- use the `context7` mcp tool frequently for any library that might be newly updated or unfamiliar
- use `npm run quickfix` frequently to spot issues early, and fix them as you go (this runs `eslint`, `tsc`, and `prettier`)
- use and maintain `npm run test` to make sure everything's working during development
- use and maintain the `npm run screenshots` test suite to ensure that the UI is working as expected after implementing a new feature
- use `npm run test:build` at the end of a really big job to check the build is working

# Project Specific

- You can find the main routes in the `./app/(routes)` folder (included here for easier organization).
