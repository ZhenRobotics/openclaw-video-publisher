# Git 提交指南

## 📍 Git 仓库地址

根据 package.json 配置，项目的 Git 仓库地址是：

### GitHub 仓库信息

**完整路径**: `ZhenRobotics/openclaw-video-publisher`

**Git 地址**:
- **HTTPS**: `https://github.com/ZhenRobotics/openclaw-video-publisher.git`
- **SSH**: `git@github.com:ZhenRobotics/openclaw-video-publisher.git`

---

## 🚀 完整的 Git 提交步骤

### 前提条件

⚠️ **重要**: 在推送代码前，需要先在 GitHub 上创建仓库！

---

## 步骤 1: 在 GitHub 创建仓库

### 方式 A: 通过 GitHub 网站（推荐）

1. 访问 https://github.com/new
2. 填写信息：
   - **Owner**: `ZhenRobotics`
   - **Repository name**: `openclaw-video-publisher`
   - **Description**: `Multi-platform video publishing tool`
   - **Visibility**: `Public` ✅
   - **不要勾选** "Initialize this repository with..."（我们已有代码）
3. 点击 "Create repository"

### 方式 B: 通过 GitHub CLI

```bash
# 如果安装了 gh cli
gh repo create ZhenRobotics/openclaw-video-publisher --public \
  --description "Multi-platform video publishing tool" \
  --source=. --remote=origin
```

---

## 步骤 2: 初始化本地 Git 仓库

```bash
# 进入项目目录
cd /home/justin/openclaw-video-publisher

# 初始化 Git 仓库
git init

# 查看状态
git status
```

---

## 步骤 3: 配置 Git 用户信息（如果没配置）

```bash
# 设置用户名
git config --global user.name "justin"

# 设置邮箱（使用你的 GitHub 邮箱）
git config --global user.email "your-email@example.com"

# 验证配置
git config --list | grep user
```

---

## 步骤 4: 添加所有文件到 Git

```bash
# 添加所有文件
git add .

# 查看将要提交的文件
git status
```

预期输出：
```
On branch main
Changes to be committed:
  new file:   .clawhub/skill.json
  new file:   .env.example
  new file:   .gitignore
  new file:   CHANGELOG.md
  new file:   LICENSE
  new file:   README.md
  ... (约 30+ 文件)
```

---

## 步骤 5: 创建第一个 Commit

```bash
# 创建初始提交
git commit -m "Initial release v1.0.0

Features:
- Multi-platform video publishing (Douyin, Kuaishou)
- CLI tool with TypeScript
- Complete documentation system
- Platform adapters architecture
- Auto-retry mechanism
- Publish history tracking

Platforms:
- npm: openclaw-video-publisher
- GitHub: ZhenRobotics/openclaw-video-publisher
- ClawHub: ZhenStaff/video-publisher"
```

---

## 步骤 6: 添加远程仓库

### 使用 SSH（推荐，需要配置 SSH key）

```bash
# 添加远程仓库
git remote add origin git@github.com:ZhenRobotics/openclaw-video-publisher.git

# 验证
git remote -v
```

### 使用 HTTPS（简单，但每次需要输入密码）

```bash
# 添加远程仓库
git remote add origin https://github.com/ZhenRobotics/openclaw-video-publisher.git

# 验证
git remote -v
```

**输出应该是**:
```
origin  git@github.com:ZhenRobotics/openclaw-video-publisher.git (fetch)
origin  git@github.com:ZhenRobotics/openclaw-video-publisher.git (push)
```

---

## 步骤 7: 推送到 GitHub

```bash
# 设置默认分支为 main
git branch -M main

# 推送到远程仓库
git push -u origin main
```

如果使用 SSH 且首次推送，可能会提示：
```
The authenticity of host 'github.com' can't be established.
Are you sure you want to continue connecting (yes/no)?
```
输入 `yes` 并回车。

---

## 步骤 8: 验证推送成功

```bash
# 查看远程分支
git branch -a

# 访问 GitHub 查看
# https://github.com/ZhenRobotics/openclaw-video-publisher
```

---

## 🎯 一键执行脚本（所有步骤）

创建快捷脚本：

```bash
#!/bin/bash
# git-first-commit.sh

set -e

echo "🚀 开始 Git 初始化和提交..."

# 1. 初始化
if [ ! -d .git ]; then
  echo "📦 初始化 Git 仓库..."
  git init
else
  echo "✅ Git 仓库已存在"
fi

# 2. 添加文件
echo "📝 添加所有文件..."
git add .

# 3. 创建 commit
echo "💾 创建初始提交..."
git commit -m "Initial release v1.0.0

Features:
- Multi-platform video publishing (Douyin, Kuaishou)
- CLI tool with TypeScript
- Complete documentation system
- Platform adapters architecture
- Auto-retry mechanism
- Publish history tracking" || echo "已有提交"

# 4. 添加远程仓库（如果尚未添加）
if ! git remote | grep -q origin; then
  echo "🔗 添加远程仓库..."
  git remote add origin git@github.com:ZhenRobotics/openclaw-video-publisher.git
else
  echo "✅ 远程仓库已配置"
fi

# 5. 设置主分支
echo "🌿 设置主分支为 main..."
git branch -M main

# 6. 推送
echo "⬆️  推送到 GitHub..."
git push -u origin main

echo ""
echo "✅ 完成！"
echo "🔗 查看仓库: https://github.com/ZhenRobotics/openclaw-video-publisher"
```

使用方法：
```bash
chmod +x git-first-commit.sh
./git-first-commit.sh
```

---

## 🔑 SSH Key 配置（推荐）

如果选择 SSH 方式，需要先配置 SSH key：

### 1. 生成 SSH key

```bash
# 生成新的 SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# 按提示操作（默认路径即可）
# 可以设置密码，也可以留空
```

### 2. 添加到 ssh-agent

```bash
# 启动 ssh-agent
eval "$(ssh-agent -s)"

# 添加私钥
ssh-add ~/.ssh/id_ed25519
```

### 3. 复制公钥

```bash
# 显示公钥
cat ~/.ssh/id_ed25519.pub
```

### 4. 添加到 GitHub

1. 访问 https://github.com/settings/keys
2. 点击 "New SSH key"
3. 标题: 随意（如 "My Laptop"）
4. 粘贴公钥内容
5. 点击 "Add SSH key"

### 5. 测试连接

```bash
ssh -T git@github.com
```

成功输出：
```
Hi ZhenRobotics! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## 📋 常见问题

### Q1: 仓库还不存在怎么办？

**A**: 必须先在 GitHub 创建仓库！
- 访问 https://github.com/new
- 或使用 `gh repo create`

### Q2: 推送时提示权限错误？

**A**: 检查以下几点：
1. 仓库是否已在 GitHub 创建
2. 是否有推送权限
3. SSH key 是否配置正确
4. 使用 HTTPS 时账号密码是否正确

### Q3: 想修改远程地址？

```bash
# 查看当前远程地址
git remote -v

# 修改远程地址
git remote set-url origin NEW_URL

# 或删除后重新添加
git remote remove origin
git remote add origin NEW_URL
```

---

## ✅ 检查清单

提交前确认：

- [ ] GitHub 仓库已创建
- [ ] Git 已初始化 (`git init`)
- [ ] 用户信息已配置 (`git config`)
- [ ] 文件已添加 (`git add .`)
- [ ] Commit 已创建 (`git commit`)
- [ ] 远程仓库已添加 (`git remote add`)
- [ ] 已推送到 GitHub (`git push`)

---

## 🔗 相关链接

- **GitHub 仓库**: https://github.com/ZhenRobotics/openclaw-video-publisher
- **创建新仓库**: https://github.com/new
- **SSH Key 管理**: https://github.com/settings/keys
- **GitHub CLI**: https://cli.github.com/

---

**准备好提交了吗？按照上述步骤操作即可！** 🚀
