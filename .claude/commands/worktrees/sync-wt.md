Reset the current branch to match the main branch exactly. This command only works when you are NOT on the main branch.

## Usage

/wt-sync [branch-name]

Optional parameter:

- `branch-name`: If provided, rename the current branch to this name after reset

## Safety Checks

1. This command will FAIL if you ARE on the main branch. You cannot reset main to itself - this command is for syncing feature branches with main.
2. If there are uncommitted changes, prompt the user to confirm before proceeding with the reset.

## What I'll do

1. First, I'll check the current branch using `git branch --show-current`
2. **FAIL if on main branch** - This command only works when you're on a feature branch
3. Check for uncommitted changes using `git status --porcelain`
4. **If uncommitted changes exist** - Prompt user to confirm: "You have uncommitted changes. This will discard them. Continue? (y/N)"
5. Verify the main branch exists locally with `git show-ref`
6. Reset the current branch to main using `git reset --hard main`
7. If a branch name parameter was provided, rename the branch using `git branch -m <new-name>`

This will:

- Keep your current branch name (unless you specify a new one)
- Move your current branch to point to the same commit as main
- Update your working directory to match main exactly
- **WARNING**: This will discard any uncommitted changes and any commits on your current branch that aren't in main

Important: NEVER TRY TO FETCH FROM ORIGIN!

This command only works with LOCAL branches and should never try to pull from remote.
