# NPM 手动发布指南 / NPM Manual Publication Guide

**项目**: openclaw-audit-trail
**版本**: 1.0.0
**状态**: 需要手动发布 (频率限制)

---

## ⚠️ 当前情况 / Current Situation

### 问题 / Issue
```
npm error 429 Too Many Requests
Could not publish, as user undefined: rate limited exceeded
```

### 原因 / Cause
- npm registry 有严格的发布频率限制
- 短时间内多次发布尝试触发了频率限制
- 需要等待一段时间才能重试

### 认证状态 / Authentication Status
```
✓ npm user: zhenstaff (已认证)
✓ npm token: 已配置且有效
✓ package.json: 配置正确
```

---

## ✅ 已完成的准备工作 / Preparation Completed

### 包信息 / Package Info
```
Package Name: openclaw-audit-trail
Version: 1.0.0
Size: 18.5 KB (unpacked: 72.3 kB)
Files: 14
Registry: https://registry.npmjs.org/
```

### 包内容 / Package Contents
```
✓ .clawhub/skill.json
✓ LICENSE
✓ QUICKSTART.md
✓ README.md
✓ bin/audit-trail.sh
✓ examples/ (simple + advanced)
✓ package.json
✓ src/ (完整源代码)
```

### 配置验证 / Configuration Verified
```
✓ package.json name: openclaw-audit-trail
✓ package.json version: 1.0.0
✓ bin commands: audit-trail, aat
✓ files: 正确配置
✓ dependencies: 全部有效
```

---

## 🔄 手动发布步骤 / Manual Publication Steps

### 等待时间建议 / Recommended Wait Time

**选项 1: 短期等待** (15-30分钟)
```bash
# 等待15-30分钟后执行
npm publish --registry=https://registry.npmjs.org/
```

**选项 2: 长期等待** (1-2小时)
```bash
# 等待1-2小时后执行
npm publish --registry=https://registry.npmjs.org/
```

**选项 3: 次日发布** (24小时后)
```bash
# 第二天执行
npm publish --registry=https://registry.npmjs.org/
```

### 发布命令 / Publication Command

```bash
# 切换到项目目录
cd /home/justin/openclaw-agent-audit-trail

# 确认当前用户
npm whoami
# 应显示: zhenstaff

# 执行发布
npm publish --registry=https://registry.npmjs.org/

# 或使用详细输出
npm publish --registry=https://registry.npmjs.org/ --verbose
```

---

## ✅ 发布后验证 / Post-Publication Verification

### 1. 检查包是否可用
```bash
npm view openclaw-audit-trail
```

**预期输出**:
```
openclaw-audit-trail@1.0.0 | MIT | deps: 4 | versions: 1
The Immutable Black Box for AI Decisions
https://github.com/ZhenRobotics/openclaw-audit-trail
```

### 2. 检查版本
```bash
npm view openclaw-audit-trail version
```

**预期输出**:
```
1.0.0
```

### 3. 检查包信息
```bash
npm info openclaw-audit-trail
```

### 4. 测试安装
```bash
# 全局安装测试
npm install -g openclaw-audit-trail

# 验证CLI
audit-trail --version
aat --version
```

### 5. 测试导入
```bash
# 创建测试文件
cat > test-import.js << 'EOF'
const { AgentAuditTrail } = require('openclaw-audit-trail');
console.log('Import successful:', typeof AgentAuditTrail);
EOF

# 运行测试
node test-import.js

# 清理
rm test-import.js
```

---

## 🐛 故障排查 / Troubleshooting

### 问题 1: 仍然遇到 429 错误

**解决方案**:
```bash
# 等待更长时间 (建议至少30分钟)
sleep 1800  # 30分钟
npm publish --registry=https://registry.npmjs.org/
```

### 问题 2: 认证失败

**解决方案**:
```bash
# 重新验证登录状态
npm whoami

# 如果失败，重新配置token
npm config set //registry.npmjs.org/:_authToken npm_YOUR_NPM_TOKEN_HERE
```

### 问题 3: 包名已存在

**检查**:
```bash
npm view openclaw-audit-trail

# 如果显示404，说明包名可用
# 如果显示包信息，说明已发布成功
```

### 问题 4: package.json 错误

**修复**:
```bash
# npm 自动修复
npm pkg fix

# 重新尝试发布
npm publish
```

---

## 📊 当前发布状态 / Current Publication Status

### ✅ 已完成 / Completed
- ✅ GitHub 发布 (v1.0.0)
- ✅ GitHub Release 已创建
- ✅ Git 标签已推送
- ✅ 包已正确打包
- ✅ 认证已配置

### ⏳ 待完成 / Pending
- ⏳ NPM 发布 (频率限制，需手动执行)
- 📋 ClawHub 上传 (待手动操作)

---

## 🔗 相关链接 / Related Links

### 已发布 / Published
- **GitHub Release**: https://github.com/ZhenRobotics/openclaw-video-publisher/releases/tag/v1.0.0
- **GitHub Repo**: https://github.com/ZhenRobotics/openclaw-video-publisher

### 待发布 / To Be Published
- **NPM Package**: https://www.npmjs.com/package/openclaw-audit-trail (发布后可用)

---

## 💡 建议 / Recommendations

### 推荐方案 / Recommended Approach

1. **等待30分钟到1小时**
2. **执行手动发布命令**
3. **验证发布成功**
4. **继续 ClawHub 上传**

### 时间规划 / Time Planning

```
现在        +30分钟      +2小时      +24小时
 |            |            |            |
 v            v            v            v
准备完成  ━━━▶ 尝试发布 ━━━▶ 再次尝试 ━━━▶ 最后尝试
             (推荐)      (备选)      (保底)
```

---

## 📋 快速执行清单 / Quick Checklist

### 发布前 / Before Publishing
- [ ] 等待至少30分钟
- [ ] 确认 npm 认证: `npm whoami`
- [ ] 确认在正确目录: `pwd` 应显示项目路径

### 发布时 / During Publishing
- [ ] 执行: `npm publish --registry=https://registry.npmjs.org/`
- [ ] 观察输出，无错误信息
- [ ] 看到 "Published" 成功消息

### 发布后 / After Publishing
- [ ] 验证: `npm view openclaw-audit-trail`
- [ ] 测试安装: `npm install -g openclaw-audit-trail`
- [ ] 验证CLI: `audit-trail --version`
- [ ] 更新 PUBLICATION_SUMMARY.md 状态

---

## 📞 需要帮助？ / Need Help?

如果持续遇到问题:
- 检查 npm 状态页: https://status.npmjs.org/
- 查看 npm 文档: https://docs.npmjs.com/cli/publish
- GitHub Issues: https://github.com/ZhenRobotics/openclaw-audit-trail/issues

---

**创建时间 / Created**: 2026-03-13
**状态 / Status**: 待手动执行 / Awaiting Manual Execution
**建议等待时间 / Recommended Wait**: 30-60 分钟

---

**下一步**: 等待30分钟后执行上述手动发布命令
**Next Step**: Wait 30 minutes and execute the manual publish command above
