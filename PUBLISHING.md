# 发布指南

OpenClaw Video Publisher - 发布到 npm、GitHub 和 ClawHub 的完整流程

---

## 📦 **发布清单**

### 准备工作
- [x] 项目代码完成
- [x] 测试通过
- [x] 文档完整
- [x] 命名确认
- [ ] npm 账号准备
- [ ] GitHub 仓库创建
- [ ] ClawHub 账号准备

---

## 1️⃣ **npm 发布**

### 前置条件
```bash
# 检查 npm 版本
npm --version  # >= 8.0.0

# 登录 npm（如果未登录）
npm login
# 输入用户名、密码、邮箱
```

### 发布步骤

#### Step 1: 验证包配置
```bash
# 查看将要发布的文件
npm pack --dry-run

# 预期输出应该包含:
# - src/
# - config/
# - examples/
# - publish.sh
# - README.md
# - LICENSE
# 等文件
```

#### Step 2: 测试包
```bash
# 本地测试安装
npm pack
npm install -g openclaw-video-publisher-1.0.0.tgz

# 测试命令
video-publish --version
video-publish platforms

# 卸载测试包
npm uninstall -g openclaw-video-publisher
rm openclaw-video-publisher-1.0.0.tgz
```

#### Step 3: 发布到 npm
```bash
# 发布
npm publish

# 预期输出:
# + openclaw-video-publisher@1.0.0
```

#### Step 4: 验证发布
```bash
# 查看包信息
npm view openclaw-video-publisher

# 安装验证
npm install -g openclaw-video-publisher
video-publish --version
```

### 发布后
- [ ] 在 README.md 添加 npm badge
- [ ] 更新文档链接
- [ ] 通知用户

---

## 2️⃣ **GitHub 发布**

### 前置条件
```bash
# 检查 git 配置
git config --global user.name
git config --global user.email

# 生成 SSH key（如果没有）
ssh-keygen -t ed25519 -C "your_email@example.com"
# 添加到 GitHub: Settings > SSH and GPG keys
```

### 发布步骤

#### Step 1: 创建 GitHub 仓库
1. 访问 https://github.com/new
2. 仓库名: `openclaw-video-publisher`
3. 所有者: `ZhenRobotics`
4. 描述: `Multi-platform video publishing tool`
5. 可见性: Public
6. **不要** 初始化 README（我们已有）
7. 点击 "Create repository"

#### Step 2: 推送代码
```bash
# 初始化 git（如果尚未初始化）
git init
git add .
git commit -m "Initial release v1.0.0"

# 添加远程仓库
git remote add origin git@github.com:ZhenRobotics/openclaw-video-publisher.git

# 推送代码
git branch -M main
git push -u origin main
```

#### Step 3: 创建 Release
1. 访问 https://github.com/ZhenRobotics/openclaw-video-publisher/releases/new
2. 标签: `v1.0.0`
3. Release 标题: `v1.0.0 - Initial Release`
4. 描述: 复制 CHANGELOG.md 中的内容
5. 点击 "Publish release"

#### Step 4: 配置仓库设置
1. **Topics**: 添加标签
   ```
   video-publisher, openclaw, douyin, kuaishou, 
   video-automation, multi-platform, typescript, nodejs, cli-tool
   ```

2. **About**: 编辑仓库描述
   ```
   Multi-platform video publishing tool - Upload videos to 
   Douyin, Kuaishou, WeChat Channels, Bilibili, YouTube, TikTok
   ```

3. **Website**: 添加 npm 链接
   ```
   https://www.npmjs.com/package/openclaw-video-publisher
   ```

### 发布后
- [ ] 添加 GitHub badge 到 README
- [ ] 配置 GitHub Actions（可选）
- [ ] 启用 Issues 和 Discussions

---

## 3️⃣ **ClawHub 发布**

### 前置条件
- ClawHub 账号
- GitHub 仓库已创建
- SKILL.md 文件完整

### 发布步骤

#### Step 1: 准备 Skill 文件
```bash
# 确保 SKILL.md 存在且完整
cat SKILL.md

# 确保 ClawHub 配置存在
cat .clawhub/skill.json
```

#### Step 2: 在 ClawHub 创建 Skill
1. 访问 https://clawhub.ai/create
2. 点击 "New Skill"
3. 填写信息:
   - **Name**: `video-publisher`
   - **Display Name**: `OpenClaw Video Publisher`
   - **Author**: `ZhenStaff`
   - **Category**: `Automation`
   - **Repository**: `https://github.com/ZhenRobotics/openclaw-video-publisher`

#### Step 3: 链接 GitHub
1. 授权 ClawHub 访问 GitHub
2. 选择 `ZhenRobotics/openclaw-video-publisher` 仓库
3. 确认导入

#### Step 4: 配置 Skill
1. 编辑 Skill 详情
2. 上传封面图（可选）
3. 添加使用示例
4. 设置分类和标签

#### Step 5: 发布
1. 预览 Skill 页面
2. 提交审核（如果需要）
3. 发布到 ClawHub marketplace

### 发布后
- [ ] 测试安装: `clawhub install video-publisher`
- [ ] 添加 ClawHub badge 到 README
- [ ] 在社区分享

---

## 📊 **发布后检查清单**

### npm
- [ ] 包已发布: https://www.npmjs.com/package/openclaw-video-publisher
- [ ] 可正常安装: `npm install -g openclaw-video-publisher`
- [ ] 命令可用: `video-publish --version`
- [ ] 下载统计正常

### GitHub
- [ ] 仓库可访问: https://github.com/ZhenRobotics/openclaw-video-publisher
- [ ] Release 已创建: v1.0.0
- [ ] Topics 已添加
- [ ] README 显示正常
- [ ] Issues 已启用

### ClawHub
- [ ] Skill 已发布: https://clawhub.ai/ZhenStaff/video-publisher
- [ ] 可正常安装: `clawhub install video-publisher`
- [ ] 文档显示正常
- [ ] 示例可运行

---

## 🎨 **添加 Badges**

在 README.md 顶部添加：

```markdown
# OpenClaw Video Publisher

[![npm version](https://img.shields.io/npm/v/openclaw-video-publisher.svg)](https://www.npmjs.com/package/openclaw-video-publisher)
[![npm downloads](https://img.shields.io/npm/dm/openclaw-video-publisher.svg)](https://www.npmjs.com/package/openclaw-video-publisher)
[![GitHub stars](https://img.shields.io/github/stars/ZhenRobotics/openclaw-video-publisher.svg)](https://github.com/ZhenRobotics/openclaw-video-publisher)
[![GitHub license](https://img.shields.io/github/license/ZhenRobotics/openclaw-video-publisher.svg)](https://github.com/ZhenRobotics/openclaw-video-publisher/blob/main/LICENSE)
[![ClawHub](https://img.shields.io/badge/ClawHub-video--publisher-blue)](https://clawhub.ai/ZhenStaff/video-publisher)

**一键发布短视频到多个平台** - 自动化视频发布工具
```

---

## 🔄 **后续更新流程**

### 发布新版本

1. **更新版本号**
```bash
# 更新 package.json version
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

2. **更新 CHANGELOG.md**
```markdown
## [1.0.1] - 2024-03-11
### Fixed
- Bug fixes...
```

3. **提交并推送**
```bash
git add .
git commit -m "Release v1.0.1"
git push origin main
git tag v1.0.1
git push origin v1.0.1
```

4. **发布到 npm**
```bash
npm publish
```

5. **创建 GitHub Release**
- 使用新标签创建 Release
- 复制 CHANGELOG 内容

6. **更新 ClawHub**
- ClawHub 会自动同步 GitHub 更新
- 或手动触发同步

---

## 📞 **发布支持**

### 遇到问题？

**npm 发布问题**:
- 检查 npm 登录状态: `npm whoami`
- 检查包名是否可用: `npm view openclaw-video-publisher`
- 查看详细错误: `npm publish --verbose`

**GitHub 推送问题**:
- 检查 SSH key: `ssh -T git@github.com`
- 检查远程仓库: `git remote -v`
- 查看详细错误: `git push -v`

**ClawHub 同步问题**:
- 检查 SKILL.md 格式
- 确认 GitHub 仓库可访问
- 联系 ClawHub 支持

---

## ✅ **完整发布命令**

```bash
# 1. npm 发布
npm login
npm publish

# 2. GitHub 发布
git remote add origin git@github.com:ZhenRobotics/openclaw-video-publisher.git
git push -u origin main
git tag v1.0.0
git push origin v1.0.0

# 3. ClawHub 发布
# 在网站上操作

# 4. 验证
npm view openclaw-video-publisher
curl -I https://github.com/ZhenRobotics/openclaw-video-publisher
clawhub search video-publisher
```

---

**准备发布你的项目了吗？按照这个指南一步步来！** 🚀

---

*更新时间: 2024-03-10*
*版本: 1.0.0*
