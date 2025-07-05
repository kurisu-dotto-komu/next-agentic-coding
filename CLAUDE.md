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

- NEVER make git commands like commits unless I explicitly instruct you to
- NEVER proactively create documentation files (\*.md) unless explicitly requested
- NEVER call `npx playwright` or `npx eslint` directly, only use `npm run` for testing, linting, etc.
- NEVER use `--headed` or `--debug` for playwright tests, always use the default headless options, doing otherwise will cause problems
- use `npm run fix` frequently to spot issues early, and fix them as you go
- use `npm run test` to make sure everything's working during development, but only do this sparingly as it's quite expensive
- use `npm run test:build` at the end of a really big job to check the build is working
- use `npm run screenshots` to generate screenshots that can be analysed visually
- create and run specific scenarios in `screenshots.spec.ts` to visually check your work, or use the playwright mcp server
- if you are having problems implementing something using a library you're not familiar with, try using the `context7` mcp tool
- we are running a dev server in the background so you don't need to run it yourself

# Project Specific

- You can find the main routes in the `./app/(routes)` folder (included here for easier organization).
