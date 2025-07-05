Merge the specified local branch into the current branch. This command only works when you are ON the main branch.

## Usage

/wt-merge [branch-name]

## Safety Check

This command will FAIL if you are NOT on the main branch. You must be on main to merge other branches into it.
This command will FAIL if the branch-name does not exist locally.
If no branch-name is passed, run the command for each local workspace branches that is ahead of main.

## What I'll do

1. First, I'll check the current branch using `git branch --show-current`
2. **FAIL if not on main branch** - This command only works when you're on main
3. Verify the target branch exists locally with `git show-ref`
4. Get a summary of commits being merged using `git log main..<branch-name> --oneline`
5. Generate a descriptive commit message based on the commit summary
6. Attempt to merge the branch using `git merge <branch-name> --no-ff -m "<generated-message>"`
7. If conflicts occur:
   - Get the list of conflicted files with `git diff --name-only --diff-filter=U`
   - For each conflicted file, remove conflict markers and keep both changes
   - Stage the resolved files with `git add`
   - Complete the merge with a commit using the generated message

## Commit Message Generation

The commit message will be generated based on:

- A summary of the individual commits in the branch
- The overall scope and purpose of the changes
- The features and functionality being added

**Important: Do NOT include the branch name in the commit message - focus only on the features and changes.**

Format: `<summary-of-features-and-changes>`

Important: NEVER TRY TO FETCH FROM ORIGIN!

This command only works with LOCAL branches and should never try to pull from remote.
