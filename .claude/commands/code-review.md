# Code Review Command

Usage: `/code-review` (optional `-r` or `--reset` to start a new review, deleting the old review. Otherwise, continue from last run based on the checklist, or start a new review if no checklist exists, if `-r` is not passed but the checklist exists not complete, then exit with an error).

Analyze this project's codebase. Output findings to `./reports/AI_CODE_REVIEW.md`.

Importantly, you should methodically check all relevant project files one by one.

- Fisrt, build a list of files to check and add to the checklist at the bottom of the file
- Then run `npm run quickfix` and `npm run test:build` to identify issues
- Then, as an expert senior developer, check the files one by one for issues, and update the checklist as you go.

The result of the test and quickfix should by no means be the end of the story. You should continue to check the files one by one, and update the checklist as you go. Your job is identify issues with the code based on the categories below. Only output actionable items. No explanations needed - just location, the problem and suggested fix. See below for output examples.

Do not limit yourself to the categories or exmaples given below, they are just examples. Think hard and use your creativity and expert judgement to identify all kinds of issues that might be worth fixing or improving.

## Code Review Categories

### Security Issues

- Hardcoded API Keys
- Weak Input Validation

### Potential Bugs

- Null references
- Async race conditions
- Promise rejections
- Memory leaks
- Performance issues

### Code Smell / Quality Issues

- Components >200 lines
- Duplicate logic
- Hard-coded values
- `any` types
- Circular dependencies
- Deep import paths

### Dead Code

- Unused functions, variables, components, types, imports, exports
- Orphaned files
- Commented-out code
- Unused assets

### Comments

- Obvious/useless comments
- Outdated comments
- Old TODO/FIXME items

### Other Issues

- Missing dependencies
- Missing types
- Missing tests
- Missing documentation
- Missing comments

## Output Format

Below is an example of the output format. It is very minimal. The output should be a list of actionable items.

We have included a few examples for format only.

```
# Report

## Security Issues

### Hardcoded API Keys

- Environment variables exposed in client-side code
- `const API_KEY = "sk-1234567890abcdef"` in src/utils/api.ts:12
- Move to environment variables and use server-side proxy

### Weak Input Validation

- User input not sanitized before database queries
- `query = "SELECT * FROM users WHERE email = '" + email + "'"` in src/lib/database.ts:34
- Use parameterized queries with prepared statements

## Potential Bugs

- [ ] Fix potential null reference in src/components/UserProfile.tsx:67 - `user.profile?.avatar` without null check
- [ ] Handle async race condition in src/hooks/useAuth.ts:45 - setState called after component unmount
- [ ] Add error boundary for promise rejection in src/pages/api/users.ts:28

## Code Quality Issues

- [ ] Replace `any` type with proper interface in src/types/api.ts:15 - `response: any`
- [ ] Extract magic numbers to constants in src/utils/validation.ts:23 - `password.length > 8`
- [ ] Split large component src/components/Dashboard.tsx (287 lines) into smaller components
- [ ] Add return type annotations to functions in src/services/userService.ts:34-56

## Duplicate Code

- [ ] Consolidate duplicate email validation logic in src/utils/auth.ts:45 and src/components/LoginForm.tsx:78
- [ ] Extract common loading spinner component from src/components/UserList.tsx:34 and src/components/PostList.tsx:67
- [ ] Merge similar error handling in src/api/users.ts:12 and src/api/posts.ts:18

## Dead Code

- [ ] Remove unused interface `LegacyUser` in src/types/user.ts:89
- [ ] Delete orphaned utility function `formatOldDate` in src/utils/date.ts:156
- [ ] Remove commented-out code block in src/components/Header.tsx:23-35
- [ ] Delete unused import `import { debounce } from 'lodash'` in src/hooks/useSearch.ts:3

## Comments

- [ ] Remove obvious comment "// Set loading to true" in src/components/LoadingButton.tsx:45
- [ ] Update outdated comment about React 16 in src/hooks/useEffect.ts:12
- [ ] Address TODO from 2023: "TODO: Implement proper error handling" in src/utils/api.ts:89
- [ ] Remove FIXME comment with no context in src/components/Modal.tsx:67

## Other Issues

- [ ] Add proper TypeScript generics to API response handler in src/utils/api.ts:78
- [ ] Implement proper error boundaries for async components in src/pages/
- [ ] Add missing dependency array to useEffect in src/hooks/useLocalStorage.ts:34
- [ ] Replace deep object spread with proper state management in src/components/Settings.tsx:123

# Operation Checklist

- [x] Run `npm run quickfix`
- [x] Run `npm run test:build`
- [x] Populate File Checklist

# File Checklist

- [x] src/utils/api.ts
- [x] src/lib/database.ts
- [x] src/components/UserProfile.tsx
- [ ] src/hooks/useAuth.ts
- [ ] src/pages/api/users.ts
- [ ] src/types/api.ts
- [ ] src/utils/validation.ts
- [ ] src/components/Dashboard.tsx
- [ ] src/services/userService.ts
- [ ] src/components/LoginForm.tsx
- [ ] src/components/UserList.tsx
- [ ] src/components/PostList.tsx
- [ ] src/api/posts.ts
- [ ] src/types/user.ts
- [ ] src/utils/date.ts
- [ ] src/components/Header.tsx
- [ ] src/hooks/useSearch.ts
- [ ] src/components/LoadingButton.tsx
- [ ] src/hooks/useEffect.ts
- [ ] src/components/Modal.tsx
- [ ] src/hooks/useLocalStorage.ts
- [ ] src/components/Settings.tsx
```
