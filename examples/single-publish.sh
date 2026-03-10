#!/bin/bash

# 单个视频发布示例

# 基本用法
../publish.sh upload \
  --video my-video.mp4 \
  --title "我的视频标题" \
  --description "这是视频描述" \
  --tags "AI,技术,教程" \
  --platforms "douyin,kuaishou"

# 带封面和重试
# ../publish.sh upload \
#   --video my-video.mp4 \
#   --title "我的视频标题" \
#   --cover cover.jpg \
#   --platforms "douyin,kuaishou,bilibili" \
#   --retry \
#   --max-retries 3

# 仅发布到抖音
# ../publish.sh upload \
#   --video my-video.mp4 \
#   --title "抖音专属内容" \
#   --platforms "douyin"
