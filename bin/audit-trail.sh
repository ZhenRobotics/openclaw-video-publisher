#!/bin/bash

# Agent Audit Trail - Main entry script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Check dependencies
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is not installed"
  exit 1
fi

# Run CLI
npx tsx src/cli/index.ts "$@"
