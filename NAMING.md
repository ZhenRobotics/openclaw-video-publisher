# 项目命名规范

**OpenClaw Video Publisher** - 多平台统一命名方案

---

## 🎯 **正式名称**

### 项目全称
**OpenClaw Video Publisher**

### 中文名称
**OpenClaw 视频发布工具**

---

## 📦 **各平台包名**

### 1. npm (Node Package Manager)

**包名**: `openclaw-video-publisher`

- ✅ **可用性**: 已验证，npm 上未被占用
- **安装命令**: `npm install -g openclaw-video-publisher`
- **链接**: https://www.npmjs.com/package/openclaw-video-publisher

**配置文件** (package.json):
```json
{
  "name": "openclaw-video-publisher",
  "version": "1.0.0",
  "description": "Multi-platform video publishing tool - Upload videos to Douyin, Kuaishou, WeChat Channels, Bilibili, YouTube, TikTok and more"
}
```

---

### 2. GitHub

**仓库名**: `openclaw-video-publisher`

- **完整路径**: `ZhenRobotics/openclaw-video-publisher`
- **URL**: https://github.com/ZhenRobotics/openclaw-video-publisher
- **Clone 地址**: `git@github.com:ZhenRobotics/openclaw-video-publisher.git`

**仓库配置**:
- **所有者**: ZhenRobotics
- **仓库名**: openclaw-video-publisher
- **可见性**: Public
- **主分支**: main
- **许可证**: MIT

---

### 3. ClawHub

**Skill 名称**: `video-publisher`

- **完整路径**: `ZhenStaff/video-publisher`
- **URL**: https://clawhub.ai/ZhenStaff/video-publisher
- **安装命令**: `clawhub install video-publisher`

**Skill 配置**:
```json
{
  "name": "video-publisher",
  "display_name": "OpenClaw Video Publisher",
  "description": "Multi-platform video publishing tool",
  "author": "ZhenStaff",
  "version": "1.0.0",
  "repository": "https://github.com/ZhenRobotics/openclaw-video-publisher"
}
```

---

## 🔗 **命名关系图**

```
OpenClaw Video Publisher (正式名称)
    ├── npm: openclaw-video-publisher
    ├── GitHub: ZhenRobotics/openclaw-video-publisher
    └── ClawHub: ZhenStaff/video-publisher
```

---

## 📝 **命令行工具名**

### 主命令
- `video-publish` (主命令)
- `vp` (简写别名)

### 使用示例
```bash
# 完整命令
video-publish upload --video test.mp4

# 简写
vp upload --video test.mp4
```

---

## 🌐 **URL 汇总**

| 平台 | URL | 状态 |
|------|-----|------|
| npm | https://www.npmjs.com/package/openclaw-video-publisher | ⏳ 待发布 |
| GitHub | https://github.com/ZhenRobotics/openclaw-video-publisher | ⏳ 待创建 |
| ClawHub | https://clawhub.ai/ZhenStaff/video-publisher | ⏳ 待发布 |

---

## 📋 **关键词标签**

### npm keywords
```json
[
  "video-publisher",
  "openclaw",
  "douyin",
  "kuaishou",
  "wechat-channels",
  "bilibili",
  "youtube",
  "tiktok",
  "xiaohongshu",
  "video-upload",
  "multi-platform",
  "automation"
]
```

### GitHub topics
```
video-publisher, openclaw, douyin, kuaishou, video-automation,
multi-platform, typescript, nodejs, cli-tool
```

---

## 🎨 **品牌标识**

### Logo 建议
- 图标: 📤 (上传箭头) + 🎥 (视频)
- 配色:
  - 主色: #00F5FF (青色，科技感)
  - 辅色: #0A0A0F (深色背景)

### Slogan
- **英文**: "Publish videos everywhere, effortlessly"
- **中文**: "一键发布，触达全网"

---

## 📦 **发布清单**

### npm 发布
- [x] 包名: `openclaw-video-publisher`
- [x] 版本: 1.0.0
- [ ] 发布到 npm registry
- [ ] 添加 npm badge 到 README

```bash
npm publish
```

### GitHub 发布
- [ ] 创建仓库: `ZhenRobotics/openclaw-video-publisher`
- [ ] 推送代码
- [ ] 创建 Release v1.0.0
- [ ] 添加 Topics 标签

```bash
git remote add origin git@github.com:ZhenRobotics/openclaw-video-publisher.git
git push -u origin main
```

### ClawHub 发布
- [ ] 创建 Skill: `ZhenStaff/video-publisher`
- [ ] 链接到 GitHub 仓库
- [ ] 添加使用说明
- [ ] 发布到 ClawHub marketplace

---

## 🔍 **SEO 优化**

### 描述文本（统一用于所有平台）

**英文**:
```
OpenClaw Video Publisher - A powerful multi-platform video publishing tool.
Upload videos to Douyin, Kuaishou, WeChat Channels, Bilibili, YouTube,
TikTok and more with a single command. Support batch upload, auto-retry,
and publish history tracking.
```

**中文**:
```
OpenClaw 视频发布工具 - 强大的多平台视频发布工具。
一键上传视频到抖音、快手、视频号、B站、YouTube、TikTok等平台。
支持批量上传、自动重试、发布历史追踪。
```

---

## ⚠️ **命名注意事项**

### 1. 一致性
- ✅ npm、GitHub 使用完整名称: `openclaw-video-publisher`
- ✅ ClawHub 使用简短名称: `video-publisher`
- ✅ CLI 命令使用友好名称: `video-publish`

### 2. 可用性
- ✅ npm 包名已验证可用
- ⏳ GitHub 仓库需创建
- ⏳ ClawHub skill 需注册

### 3. 商标
- ⚠️ 确保 "OpenClaw" 品牌名称没有商标冲突
- ✅ "video-publisher" 为通用描述性名称

---

## 🚀 **发布命令参考**

### npm 发布流程
```bash
# 1. 登录 npm
npm login

# 2. 检查包配置
npm pack --dry-run

# 3. 发布
npm publish

# 4. 验证
npm view openclaw-video-publisher
```

### GitHub 发布流程
```bash
# 1. 创建仓库（在 GitHub 网站上）

# 2. 添加远程仓库
git remote add origin git@github.com:ZhenRobotics/openclaw-video-publisher.git

# 3. 推送代码
git add .
git commit -m "Initial release v1.0.0"
git push -u origin main

# 4. 创建 Release
# 在 GitHub 网站上创建 Release，标签为 v1.0.0
```

### ClawHub 发布流程
```bash
# 1. 创建 Skill（在 ClawHub 网站上）
# 2. 链接 GitHub 仓库
# 3. 配置 SKILL.md
# 4. 提交审核
```

---

## 📞 **联系信息**

- **作者**: justin
- **组织**: ZhenRobotics / ZhenStaff
- **邮箱**: [待补充]
- **许可证**: MIT

---

## ✅ **最终确认**

| 平台 | 名称 | 状态 | 链接 |
|------|------|------|------|
| **npm** | `openclaw-video-publisher` | ✅ 可用 | https://npmjs.com/package/openclaw-video-publisher |
| **GitHub** | `ZhenRobotics/openclaw-video-publisher` | ⏳ 待创建 | https://github.com/ZhenRobotics/openclaw-video-publisher |
| **ClawHub** | `ZhenStaff/video-publisher` | ⏳ 待注册 | https://clawhub.ai/ZhenStaff/video-publisher |
| **CLI** | `video-publish` / `vp` | ✅ 已配置 | - |

---

**命名规范制定完成！** ✅

*创建时间: 2024-03-10*
*版本: 1.0.0*
