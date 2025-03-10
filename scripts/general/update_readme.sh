#!/bin/bash

# Script Name: Update README
#
# Description: Generates a comprehensive README for the scripts directory
# with proper categorization and descriptions.

# Get the real path of the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Go up one level to get to the scripts directory
SCRIPTS_ROOT="$(dirname "$SCRIPT_DIR")"
README_PATH="${SCRIPTS_ROOT}/README.md"

echo "Using scripts directory: $SCRIPTS_ROOT"
echo "README will be generated at: $README_PATH"

# Function to convert string to lowercase (compatible with older shells)
to_lowercase() {
  echo "$1" | tr '[:upper:]' '[:lower:]'
}

# Function to capitalize first letter of each word (macOS compatible)
capitalize_words() {
  echo "$1" | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1'
}

# Process a single script file to extract description and generate markdown
process_script() {
  local script=$1
  local name=$(basename "$script")
  local description=""
  
  # Try to extract description from file header
  if [[ -f "$script" ]]; then
    # For Python and JS files - skip shebang line and look for comments
    if [[ "$script" == *.py || "$script" == *.js ]]; then
      # Skip first line if it's a shebang, then look for comments
      description=$(tail -n +2 "$script" | grep -E "^#|^\/\/|^\*\*|^ \*" | head -n 1 | sed 's/^#//;s/^\/\///;s/^\*\*//;s/^ \*//;s/^ *//')
      
      # If no description found, try looking for a block comment
      if [[ -z "$description" ]]; then
        description=$(grep -A 1 "\/\*\*" "$script" | tail -n 1 | sed 's/^ \*//;s/^ *//')
      fi
    # For shell scripts - skip shebang line
    elif [[ "$script" == *.sh ]]; then
      description=$(tail -n +2 "$script" | grep -E "^#" | head -n 1 | sed 's/^#//;s/^ *//')
    fi
  fi
  
  # Use filename as fallback description
  if [[ -z "$description" ]]; then
    # Convert filename to words by replacing underscores and hyphens with spaces
    local words=$(echo "$name" | sed 's/[_-]/ /g;s/\.[^.]*$//')
    # Capitalize first letter of each word
    description="$(capitalize_words "$words") script"
  fi
  
  echo "| \`$name\` | $description |"
}

# Function to list scripts in a directory
list_scripts() {
  local dir=$1
  local category=$2
  local category_lower=$(to_lowercase "$category")
  
  echo "### ${category} Scripts"
  echo ""
  echo "Scripts related to ${category_lower} functionality."
  echo ""
  echo "| Script | Description |"
  echo "|--------|-------------|"
  
  # Find all script files in the directory - BSD find compatible version
  # First find Python files
  for script in "$dir"/*.py; do
    if [ -f "$script" ]; then
      process_script "$script"
    fi
  done
  
  # Then find JavaScript files
  for script in "$dir"/*.js; do
    if [ -f "$script" ]; then
      process_script "$script"
    fi
  done
  
  # Then find Shell script files
  for script in "$dir"/*.sh; do
    if [ -f "$script" ]; then
      process_script "$script"
    fi
  done
  
  echo ""
}

# Generate README content
generate_readme() {
  cat << EOF
# Tata AI Scripts

This directory contains various scripts for the Tata AI project, organized by purpose and functionality.

## Directory Structure

\`\`\`
scripts/
├── backend/              # Backend-related scripts
├── frontend/             # Frontend-related scripts
├── general/              # General utility scripts
├── docker/               # Docker-related scripts and reports
│   └── reports/          # Docker container reports
├── deployment/           # Deployment and CI/CD scripts
├── setup/                # Environment and project setup scripts
├── testing/              # Testing scripts
└── model/                # AI model management scripts
\`\`\`

## Script Categories

EOF

  # List scripts for each category
  if [ -d "${SCRIPTS_ROOT}/frontend" ]; then
    list_scripts "${SCRIPTS_ROOT}/frontend" "Frontend"
  fi
  
  if [ -d "${SCRIPTS_ROOT}/backend" ]; then
    list_scripts "${SCRIPTS_ROOT}/backend" "Backend"
  fi
  
  if [ -d "${SCRIPTS_ROOT}/docker" ]; then
    list_scripts "${SCRIPTS_ROOT}/docker" "Docker"
  fi
  
  if [ -d "${SCRIPTS_ROOT}/deployment" ]; then
    list_scripts "${SCRIPTS_ROOT}/deployment" "Deployment"
  fi
  
  if [ -d "${SCRIPTS_ROOT}/setup" ]; then
    list_scripts "${SCRIPTS_ROOT}/setup" "Setup"
  fi
  
  if [ -d "${SCRIPTS_ROOT}/testing" ]; then
    list_scripts "${SCRIPTS_ROOT}/testing" "Testing"
  fi
  
  if [ -d "${SCRIPTS_ROOT}/model" ]; then
    list_scripts "${SCRIPTS_ROOT}/model" "Model"
  fi
  
  if [ -d "${SCRIPTS_ROOT}/general" ]; then
    list_scripts "${SCRIPTS_ROOT}/general" "General"
  fi

  cat << EOF
## Script Organization

The scripts in this directory are organized according to their functionality. When adding new scripts:

1. Place the script in the appropriate subdirectory
2. Make sure the script has a clear, descriptive name
3. Add execution permissions if needed: \`chmod +x script-name.sh\`
4. Update this README with information about the script

## Running Scripts

Most scripts can be run directly from the command line:

\`\`\`bash
# Running a Python script
python scripts/category/script-name.py

# Running a Node.js script
node scripts/category/script-name.js

# Running a shell script
bash scripts/category/script-name.sh
# or if executable:
./scripts/category/script-name.sh
\`\`\`

## Maintenance

This README was automatically generated on $(date) by the \`update_readme.sh\` script.
Run \`./scripts/general/update_readme.sh\` to update this file.
EOF
}

# Main execution
echo "Generating README for scripts directory..."
generate_readme > "$README_PATH"
echo "README generated at $README_PATH"
