# Create PRP

## Feature file: $ARGUMENTS

Generate a complete PRP for general feature implementation with thorough research. Ensure context is passed to the AI agent to enable self-validation and iterative refinement. Read the feature file first to understand what needs to be created, how the examples provided help, and any other considerations.

The AI agent only gets the context you are appending to the PRP and training data. Assume the AI agent has access to the codebase and the same knowledge cutoff as you, so it's important that your research findings are included or referenced in the PRP. The Agent has WebSearch capabilities, so pass urls to documentation and examples.

## Research Process

1. **Codebase Analysis**
   - Search for similar components/patterns in the codebase
   - Identify files to reference in PRP (especially in app/(routes)/ and components/)
   - Note existing conventions to follow from CLAUDE.md
   - Check Playwright test patterns for validation approach

2. **Library Documentation Research**
   - If new libraries are needed, search online for relevant libraries to acheive features, favoring modern, well-known and popular libraries
   - Use Context7 MCP tool for exiting library documentation (Next.js, Convex, Playwright)
   - Search for implementation examples in the Context7 documentation
   - Find best practices and common pitfalls in the library docs
   - Fallback to web search for library documentation if Context7 doesn't have it
   - Note: The AI agent will have access to Context7, so reference it in the PRP

3. **User Clarification** (if needed)
   - Specific patterns to mirror and where to find them?
   - Integration requirements and where to find them?

## PRP Generation

Using PRPs/templates/prp_base.md as template:

### Critical Context to Include and pass to the AI agent as part of the PRP

- **Documentation**: Context7 or URL references with specific topics (e.g., `context7: next.js topic: App Router` or `https://nextjs.org/docs/app/building-your-application/routing/app-router`)
- **Code Examples**: Real snippets from codebase showing TypeScript patterns
- **Gotchas**: Library quirks, Server Component limitations, 'use client' requirements
- **Patterns**: Existing approaches to follow (export default function, @/ imports)

### Implementation Blueprint

- Start with pseudocode showing TypeScript/React approach
- Reference real files for patterns
- Include error handling strategy
- List tasks to be completed to fulfill the PRP in the order they should be completed

### Validation Gates (Must be Executable) eg for Next.js

```bash
# Syntax/Style
npm run quickfix

# E2E Tests
npm run test

# Screenshot Iteration
# iterate until no visual issues are found
npm run screenshots -- Feature

# Build Verification
npm run test:build
```

**_ CRITICAL AFTER YOU ARE DONE RESEARCHING AND EXPLORING THE CODEBASE BEFORE YOU START WRITING THE PRP _**

**_ ULTRATHINK ABOUT THE PRP AND PLAN YOUR APPROACH THEN START WRITING THE PRP _**

## Output

Save as: `planning/prps/{feature-name}.prp.md`

## Quality Checklist

- [ ] All necessary context included
- [ ] Validation gates are executable by AI (npm run commands)
- [ ] References existing patterns from app/(routes)/ and components/
- [ ] Clear implementation path with TypeScript
- [ ] Error handling documented
- [ ] Follows all CLAUDE.md conventions
- [ ] Component size limits considered (150 lines max)
- [ ] Real-time features considered if using Convex

Score the PRP on a scale of 1-10 (confidence level to succeed in one-pass implementation using claude codes)

Remember: The goal is one-pass implementation success through comprehensive context.
