#!/bin/bash

# Check if help command is requested or no arguments provided
if [ "$1" = "--help" ] || [ "$1" = "-h" ] || [ $# -eq 0 ]; then
    echo "🌳 Git Worktrees Setup Script"
    echo "=============================="
    echo ""
    echo "This script automates the creation of git worktrees with their corresponding"
    echo "devcontainer configurations for VS Code development environments."
    echo ""
    echo "📋 USAGE:"
    echo "  $0 <number_of_worktrees|reset|--help>"
    echo ""
    echo "🎯 COMMANDS:"
    echo "  <1-10>              Create N worktrees (uses predefined names)"
    echo "  reset               Remove all worktrees and configurations"
    echo "  --help, -h          Show this help message"
    echo ""
    echo "📁 WHAT GETS CREATED:"
    echo "  • .worktrees/[name]/                    Git worktree directories"
    echo "  • .devcontainer/worktrees-overview/     Overview devcontainer"
    echo "  • .devcontainer/worktree-[name]/        Individual worktree devcontainers"
    echo ""
    echo "👥 SUPPORTED WORKTREE NAMES (in order):"
    echo "  1. alice    (port 3100)    6. fiona    (port 3600)"
    echo "  2. bob      (port 3200)    7. george   (port 3700)"
    echo "  3. charlie  (port 3300)    8. helen    (port 3800)"
    echo "  4. diana    (port 3400)    9. ivan     (port 3900)"
    echo "  5. eric     (port 3500)    10. julia   (port 4000)"
    echo ""
    echo "💡 EXAMPLES:"
    echo "  $0 3                # Create 3 worktrees (alice, bob, charlie)"
    echo "  $0 5                # Create 5 worktrees (alice through eric)"
    echo "  $0 10               # Create all 10 worktrees"
    echo "  $0 reset            # Remove all worktrees and configs"
    echo ""
    echo "🚀 TYPICAL WORKFLOW:"
    echo "  1. $0 5             # Setup 5 worktrees"
    echo "  2. Open VS Code in .devcontainer/worktree-alice/"
    echo "  3. Work on different features in parallel"
    echo "  4. $0 reset         # Clean up when done"
    echo ""
    echo "📖 MORE INFO:"
    echo "  • Each worktree is a separate git branch"
    echo "  • Each devcontainer has isolated environment"
    echo "  • Overview devcontainer shows all worktrees"
    echo "  • All configurations inherit base extensions"
    echo ""
    exit 0
fi

# Check if reset command is requested
if [ "$1" = "reset" ]; then
    echo "🔄 Resetting all worktrees and configurations..."
    
    # Remove all worktrees (except the main repository)
    echo "Removing all git worktrees..."
    git worktree list | grep -v "$(pwd)$" | while read -r worktree_path commit branch; do
        if [ -n "$worktree_path" ]; then
            echo "  → Removing worktree: $worktree_path"
            git worktree remove "$worktree_path" --force 2>/dev/null || true
        fi
    done
    
    # Clean up any remaining stale references
    git worktree prune
    
    # Remove .worktrees directory
    if [ -d ".worktrees" ]; then
        echo "Removing .worktrees directory..."
        rm -rf .worktrees
        echo "  ✓ Removed .worktrees directory"
    fi
    
    # Remove worktrees-overview devcontainer
    if [ -d ".devcontainer/worktrees-overview" ]; then
        echo "Removing .devcontainer/worktrees-overview directory..."
        rm -rf .devcontainer/worktrees-overview
        echo "  ✓ Removed .devcontainer/worktrees-overview directory"
    fi
    
    # Remove individual worktree devcontainers
    echo "Removing individual worktree devcontainers..."
    for worktree_dir in .devcontainer/worktree-*; do
        if [ -d "$worktree_dir" ]; then
            echo "  → Removing $worktree_dir"
            rm -rf "$worktree_dir"
        fi
    done
    echo "  ✓ Removed individual worktree devcontainers"
        
    echo "✅ Reset complete! All worktrees and configurations have been removed."
    exit 0
fi

# Get number of worktrees to create (no default, must be explicit)
NUM_WORKTREES=$1

# Validate the number
if ! [[ "$NUM_WORKTREES" =~ ^[0-9]+$ ]] || [ "$NUM_WORKTREES" -lt 1 ] || [ "$NUM_WORKTREES" -gt 10 ]; then
    echo "Error: Please provide a number between 1 and 10, 'reset' to clean up, or '--help' for usage info"
    echo "Usage: $0 <number_of_worktrees|reset|--help>"
    echo "Examples:"
    echo "  $0 3      # Creates 3 worktrees"
    echo "  $0 5      # Creates 5 worktrees"
    echo "  $0 reset  # Removes all worktrees and configurations"
    echo "  $0 --help # Shows detailed help"
    exit 1
fi

# Array of worktree names (up to 10)
ALL_WORKTREES=("alice" "bob" "charlie" "diana" "eric" "fiona" "george" "helen" "ivan" "julia")

# Use only the first N names based on the parameter
WORKTREES=("${ALL_WORKTREES[@]:0:$NUM_WORKTREES}")

echo "Setting up $NUM_WORKTREES worktrees: ${WORKTREES[*]}"

# Ensure .worktrees exists
mkdir -p .worktrees

# Clean up any stale worktree references
echo "Cleaning up stale worktree references..."
git worktree prune
echo "  ✓ Cleaned up stale worktree references"

# Create Worktrees Overview devcontainer
echo "Creating Worktrees Overview devcontainer..."
mkdir -p .devcontainer/worktrees-overview

# Copy base devcontainer.json and update specific fields for overview
# Remove comments before processing with jq
sed 's://.*::g' .devcontainer/devcontainer.json | \
  jq '.name = "Worktrees Overview" | .workspaceFolder = "/workspaces/${localWorkspaceFolderBasename}/.worktrees" | .build.dockerfile = "../Dockerfile"' \
  > .devcontainer/worktrees-overview/devcontainer.json
echo "  ✓ Created Worktrees Overview devcontainer config"

# Create/update worktrees and their devcontainer configs
for i in "${!WORKTREES[@]}"; do
    WORKTREE_NAME="${WORKTREES[$i]}"
    PORT=$((3100 + i * 100))
    
    echo "Setting up worktree: $WORKTREE_NAME"
    
    # Check if worktree directory exists, if not but git thinks it does, remove the reference
    if [ ! -d ".worktrees/$WORKTREE_NAME" ] && git worktree list | grep -q ".worktrees/$WORKTREE_NAME"; then
        echo "  → Removing stale worktree reference for $WORKTREE_NAME"
        git worktree remove ".worktrees/$WORKTREE_NAME" 2>/dev/null || true
    fi
    
    # Create git worktree
    if [ ! -d ".worktrees/$WORKTREE_NAME" ]; then
        # Check if branch exists
        if git show-ref --verify --quiet refs/heads/$WORKTREE_NAME; then
            echo "  → Using existing branch $WORKTREE_NAME"
            git worktree add .worktrees/$WORKTREE_NAME $WORKTREE_NAME
        else
            echo "  → Creating new branch $WORKTREE_NAME"
            git worktree add .worktrees/$WORKTREE_NAME -b $WORKTREE_NAME
        fi
        echo "  ✓ Created git worktree for $WORKTREE_NAME"
    else
        echo "  → Worktree $WORKTREE_NAME already exists"
    fi
    
    # Create devcontainer directory
    mkdir -p .devcontainer/worktree-$WORKTREE_NAME
    
    # Generate devcontainer.json for this worktree by copying base and updating specific fields
    CAPITALIZED_NAME=$(echo $WORKTREE_NAME | sed 's/./\U&/')
    # Remove comments before processing with jq
    sed 's://.*::g' .devcontainer/devcontainer.json | \
      jq --arg name "$CAPITALIZED_NAME Worktree" \
         --arg workspaceFolder "/workspaces/\${localWorkspaceFolderBasename}/.worktrees/$WORKTREE_NAME" \
         --arg port "$PORT" \
         '.name = $name | .workspaceFolder = $workspaceFolder | .remoteEnv.APP_PORT = $port | .build.dockerfile = "../Dockerfile"' \
         > .devcontainer/worktree-$WORKTREE_NAME/devcontainer.json
    
    echo "  ✓ Created devcontainer config for $WORKTREE_NAME (port: $PORT)"
done

echo "All $NUM_WORKTREES worktrees and devcontainer configurations have been set up!"

