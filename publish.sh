#!/bin/bash

# OpenClaw Video Publisher - 主入口脚本

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 加载环境变量
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# 检查依赖
if ! command -v node &> /dev/null; then
  echo "❌ Node.js 未安装"
  exit 1
fi

# 运行 CLI
npx tsx src/cli/index.ts "$@"
