#!/bin/bash

# 批量发布脚本

set -e

if [ -z "$1" ]; then
  echo "用法: ./batch-publish.sh <config.json>"
  exit 1
fi

CONFIG_FILE="$1"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "❌ 配置文件不存在: $CONFIG_FILE"
  exit 1
fi

echo "📦 批量发布任务开始..."
echo "📄 配置文件: $CONFIG_FILE"
echo ""

# TODO: 实现批量发布逻辑
# 当前可以通过循环调用 publish.sh 实现

npx tsx -e "
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('$CONFIG_FILE', 'utf-8'));
console.log('视频数量:', config.videos.length);
"

echo "✨ 批量发布完成"
