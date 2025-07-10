Create multiple git worktrees for local development workflows.

## Usage

/wt-setup [number]

## What I'll do

I'll create the specified number of git worktrees (default 2) in the `.worktrees` directory. Each worktree will have its own branch named after common developer names.

Steps:

1. Create the `.worktrees` directory if it doesn't exist
2. For each worktree:
   - Check if a branch with that name already exists
   - Create the worktree with `git worktree add .worktrees/<name> -b <name>` (or without `-b` if branch exists)
3. Create VS Code workspace configuration in `.worktrees/agents.code-workspace` based on the template below
4. Add a `worktrees/` entry to `./.gitignore` if not already present
5. List all created worktrees when complete

Notes:

The project root aka `${workspaceFolder}` is the current working dir `.`. Worktrees will be in `./.worktrees/alice`, etc.
This command shold not remove existing worktrees - it will only create new ones. If worktrees already exist, make sure the total equals the requested number (but never delete them).

## Agent Configuration

| Name    | Icon    | Color                    |
| ------- | ------- | ------------------------ |
| alice   | robot   | terminal.ansiBlue        |
| bob     | gear    | terminal.ansiGreen       |
| charlie | tools   | terminal.ansiYellow      |
| david   | wrench  | terminal.ansiMagenta     |
| eve     | circuit | terminal.ansiRed         |
| frank   | cpu     | terminal.ansiBrightBlack |

## Workspace Template

The generated `./.worktrees/agents.code-workspace` will have this structure. Customize it based on the agents.

```json
{
  "folders": [
    {
      "path": ".." // project root, relative to the code-workspace file
    },
    {
      "path": "." // agents worktree dirs, siblings to this file
    }
  ],
  "settings": {},
  "tasks": {
    "version": "2.0.0",
    "tasks": [
      {
        "label": "Main",
        "type": "shell",
        "icon": {
          "id": "home",
          "color": "terminal.ansiWhite"
        },
        "isBackground": true,
        "options": {
          "cwd": "${workspaceFolder}"
        },
        "runOptions": {
          "runOn": "folderOpen"
        },
        "command": "/usr/bin/bash",
        "presentation": {
          "echo": false,
          "focus": true,
          "panel": "dedicated",
          "group": "agents"
        }
      },
      {
        "label": "Alice",
        "type": "shell",
        "icon": {
          "id": "robot",
          "color": "terminal.ansiBlue"
        },
        "isBackground": true,
        "options": {
          "cwd": "${workspaceFolder}/.worktrees/alice"
        },
        "runOptions": {
          "runOn": "folderOpen"
        },
        "command": "/usr/bin/bash",
        "presentation": {
          "echo": false,
          "focus": false,
          "panel": "dedicated",
          "group": "agents"
        }
      },
      {
        "label": "Bob",
        "type": "shell",
        "icon": {
          "id": "gear",
          "color": "terminal.ansiGreen"
        },
        "isBackground": true,
        "options": {
          "cwd": "${workspaceFolder}/.worktrees/bob"
        },
        "runOptions": {
          "runOn": "folderOpen"
        },
        "command": "/usr/bin/bash",
        "presentation": {
          "echo": false,
          "focus": false,
          "panel": "dedicated",
          "group": "agents"
        }
      },
      {
        "label": "Main Server",
        "type": "shell",
        "icon": {
          "id": "home",
          "color": "terminal.ansiWhite"
        },
        "isBackground": true,
        "options": {
          "cwd": "${workspaceFolder}"
        },
        "runOptions": {
          "runOn": "folderOpen"
        },
        "command": "/usr/bin/bash",
        "presentation": {
          "echo": false,
          "focus": true,
          "panel": "dedicated",
          "group": "servers"
        }
      },
      {
        "label": "Alice Server",
        "type": "shell",
        "icon": {
          "id": "robot",
          "color": "terminal.ansiBlue"
        },
        "isBackground": true,
        "options": {
          "cwd": "${workspaceFolder}/.worktrees/alice"
        },
        "runOptions": {
          "runOn": "folderOpen"
        },
        "command": "/usr/bin/bash",
        "presentation": {
          "echo": false,
          "focus": false,
          "panel": "dedicated",
          "group": "servers"
        }
      },
      {
        "label": "Bob Server",
        "type": "shell",
        "icon": {
          "id": "gear",
          "color": "terminal.ansiGreen"
        },
        "isBackground": true,
        "options": {
          "cwd": "${workspaceFolder}/.worktrees/bob"
        },
        "runOptions": {
          "runOn": "folderOpen"
        },
        "command": "/usr/bin/bash",
        "presentation": {
          "echo": false,
          "focus": false,
          "panel": "dedicated",
          "group": "servers"
        }
      },
      {
        "label": "Main Console",
        "type": "shell",
        "icon": {
          "id": "home",
          "color": "terminal.ansiWhite"
        },
        "isBackground": true,
        "options": {
          "cwd": "${workspaceFolder}"
        },
        "runOptions": {
          "runOn": "folderOpen"
        },
        "command": "/usr/bin/bash",
        "presentation": {
          "echo": false,
          "focus": true,
          "panel": "dedicated",
          "group": "consoles"
        }
      },
      {
        "label": "Alice Console",
        "type": "shell",
        "icon": {
          "id": "robot",
          "color": "terminal.ansiBlue"
        },
        "isBackground": true,
        "options": {
          "cwd": "${workspaceFolder}/.worktrees/alice"
        },
        "runOptions": {
          "runOn": "folderOpen"
        },
        "command": "/usr/bin/bash",
        "presentation": {
          "echo": false,
          "focus": false,
          "panel": "dedicated",
          "group": "consoles"
        }
      },
      {
        "label": "Bob Console",
        "type": "shell",
        "icon": {
          "id": "gear",
          "color": "terminal.ansiGreen"
        },
        "isBackground": true,
        "options": {
          "cwd": "${workspaceFolder}/.worktrees/bob"
        },
        "runOptions": {
          "runOn": "folderOpen"
        },
        "command": "/usr/bin/bash",
        "presentation": {
          "echo": false,
          "focus": false,
          "panel": "dedicated",
          "group": "consoles"
        }
      },
      {
        "label": "Open Agents Terminals",
        "dependsOn": [
          "Main",
          "Alice",
          "Bob",
          "Main Server",
          "Alice Server",
          "Bob Server",
          "Main Console",
          "Alice Console",
          "Bob Console"
        ],
        "runOptions": {
          "runOn": "folderOpen"
        },
        "problemMatcher": []
      }
    ]
  }
}
```
