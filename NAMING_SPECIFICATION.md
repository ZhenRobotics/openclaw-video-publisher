# 项目命名规范 - Agent Audit Trail

**最后更新**: 2026-03-13

---

## 📋 正式项目名称

### 显示名称（Display Name）
```
Agent Audit Trail
```
- **用途**: 文档、营销材料、UI展示
- **大小写**: 每个单词首字母大写
- **使用场景**: README标题、网站、ClawHub展示名

### 标语（Tagline）
```
The Immutable Black Box for AI Decisions
```

---

## 📦 NPM 包名规范

### 方案 A：标准包名（推荐）✅

```json
{
  "name": "agent-audit-trail"
}
```

**特点**：
- ✅ 简洁明了
- ✅ 在 npm 上**可用**（已验证）
- ✅ 易于记忆和输入
- ✅ 符合 npm 命名规范（小写、连字符）

**安装命令**：
```bash
npm install agent-audit-trail
# 或
npm install -g agent-audit-trail
```

**导入方式**：
```typescript
import { AgentAuditTrail } from 'agent-audit-trail';
```

---

### 方案 B：作用域包名（备选）

```json
{
  "name": "@zhenrobotics/agent-audit-trail"
}
```

**特点**：
- ✅ 明确组织归属
- ✅ 避免命名冲突
- ⚠️ 需要 npm 组织账号
- ⚠️ 稍长的包名

**安装命令**：
```bash
npm install @zhenrobotics/agent-audit-trail
```

**导入方式**：
```typescript
import { AgentAuditTrail } from '@zhenrobotics/agent-audit-trail';
```

---

### 方案 C：简短别名（不推荐）

```json
{
  "name": "aat"
}
```

**特点**：
- ❌ 太短，不够描述性
- ❌ 可能已被占用
- ❌ 不利于 SEO 和发现
- ✅ 作为 CLI 命令别名保留

---

## 🎯 推荐方案：方案 A

**NPM 包名**: `agent-audit-trail`

**理由**：
1. 简洁且具有描述性
2. 在 npm 上可用（已验证 404）
3. 符合社区命名习惯
4. 易于记忆和传播
5. 与 GitHub 仓库名一致

---

## 🐙 GitHub 仓库命名

### 仓库名称
```
agent-audit-trail
```

### 完整 URL
```
https://github.com/ZhenRobotics/openclaw-agent-audit-trail
```

**特点**：
- ✅ 与 npm 包名一致
- ✅ 清晰的命名空间（ZhenRobotics 组织）
- ✅ 符合 GitHub 命名规范

### 仓库描述
```
The Immutable Black Box for AI Decisions - Track, audit, and verify AI agent decisions with cryptographic guarantees
```

### 主题标签（Topics）
```
ai-audit
agent-tracking
decision-trail
immutable-log
ai-transparency
audit-trail
cryptographic-verification
ai-governance
typescript
nodejs
```

---

## 🦅 ClawHub Skill 命名

### Skill Name（技术名称）
```
agent-audit-trail
```
- 必须与 npm 包名一致（如果发布到 npm）
- 小写、连字符分隔

### Display Name（显示名称）
```
Agent Audit Trail
```

### Skill ID（完整标识）
```
ZhenStaff/agent-audit-trail
```

### ClawHub URL
```
https://clawhub.ai/ZhenStaff/agent-audit-trail
```

### 安装命令
```bash
clawhub install agent-audit-trail
# 或
clawhub install ZhenStaff/agent-audit-trail
```

---

## 💻 CLI 命令命名

### 主命令
```bash
audit-trail
```

**示例**：
```bash
audit-trail init
audit-trail record
audit-trail verify
```

### 简短别名
```bash
aat
```

**示例**：
```bash
aat init
aat record
aat verify
```

### 配置（package.json）
```json
{
  "bin": {
    "audit-trail": "./bin/audit-trail.sh",
    "aat": "./bin/audit-trail.sh"
  }
}
```

---

## 📁 文件系统命名

### 项目目录名
```
agent-audit-trail/
```
或
```
openclaw-agent-audit-trail/
```
（当前使用，含组织前缀）

### 可执行脚本
```
bin/audit-trail.sh
```

### 数据存储默认路径
```
./audit-data/
```

---

## 🔤 代码中的命名

### TypeScript 类名
```typescript
export class AgentAuditTrail { }      // 主 API 类
export class AuditTrailChain { }      // 链管理类
export class JSONStorage { }          // 存储类
```

### 接口和类型
```typescript
export interface DecisionEntry { }
export interface AuditChain { }
export interface VerificationResult { }
```

### 常量和配置
```typescript
const DEFAULT_STORAGE_PATH = './audit-data';
const CHAIN_VERSION = '1.0.0';
```

---

## 🌐 域名建议（可选）

如果未来需要独立网站：

### 主域名选项
1. `agent-audit-trail.com` ⭐（推荐）
2. `agentaudittrail.com`
3. `audit-trail.ai`
4. `aat.dev`

### 文档站点
```
docs.agent-audit-trail.com
```

---

## 📊 命名一致性矩阵

| 平台 | 名称 | 格式 | 状态 |
|------|------|------|------|
| **NPM** | `agent-audit-trail` | 小写-连字符 | ✅ 可用 |
| **GitHub** | `agent-audit-trail` | 小写-连字符 | ✅ 已用 |
| **ClawHub** | `agent-audit-trail` | 小写-连字符 | ✅ 已配置 |
| **CLI 主命令** | `audit-trail` | 小写-连字符 | ✅ 已配置 |
| **CLI 别名** | `aat` | 小写缩写 | ✅ 已配置 |
| **显示名称** | `Agent Audit Trail` | 标题大写 | ✅ 统一 |
| **TypeScript 类** | `AgentAuditTrail` | PascalCase | ✅ 已实现 |

---

## ✅ 最终确认的命名方案

### NPM 发布
```json
{
  "name": "agent-audit-trail",
  "version": "1.0.0",
  "description": "The Immutable Black Box for AI Decisions"
}
```

**发布命令**：
```bash
npm publish
```

### GitHub 仓库
- **组织**: `ZhenRobotics`
- **仓库**: `agent-audit-trail`
- **URL**: `https://github.com/ZhenRobotics/openclaw-agent-audit-trail`

### ClawHub Skill
- **Skill Name**: `agent-audit-trail`
- **Author**: `ZhenStaff`
- **Full ID**: `ZhenStaff/agent-audit-trail`

### 安装方式汇总
```bash
# NPM 全局安装
npm install -g agent-audit-trail

# NPM 项目依赖
npm install agent-audit-trail

# ClawHub 安装
clawhub install agent-audit-trail

# 从源码安装
git clone https://github.com/ZhenRobotics/openclaw-agent-audit-trail.git
cd openclaw-agent-audit-trail
npm install
npm link
```

---

## 🔍 命名冲突检查

### ✅ NPM 检查
```bash
npm view agent-audit-trail
# 结果: 404 Not Found（可用）
```

### ✅ GitHub 检查
- 组织内仓库已创建
- 无冲突

### ✅ 商标检查
- 建议: 发布前进行商标搜索
- 工具: https://www.uspto.gov/trademarks

---

## 📝 SEO 和发现性

### 关键词优化
主要关键词：
- agent audit trail
- ai decision tracking
- immutable audit log
- ai accountability
- decision chain verification

### 搜索友好性
- ✅ 包含核心功能关键词（agent, audit, trail）
- ✅ 易于拼写和记忆
- ✅ 语义清晰，无歧义

---

## 🎯 品牌一致性指南

### 书写规则

**正确** ✅：
- `Agent Audit Trail`（标题/显示）
- `agent-audit-trail`（包名/技术）
- `AgentAuditTrail`（代码类名）
- `audit-trail`（CLI 命令）

**错误** ❌：
- `agent_audit_trail`（下划线）
- `AgentAuditTrail`（包名不用 PascalCase）
- `agent audit trail`（包名不用空格）
- `AGENT-AUDIT-TRAIL`（不用全大写）

### 缩写使用

**AAT**（简称）：
- 仅作为 CLI 别名
- 口头交流时可用
- 不用于正式文档标题

---

## 📌 总结

### 最终确定的统一命名
```
正式名称: Agent Audit Trail
NPM 包名: agent-audit-trail
GitHub:   ZhenRobotics/agent-audit-trail
ClawHub:  ZhenStaff/agent-audit-trail
CLI 命令: audit-trail (主), aat (别名)
```

### 命名优势
✅ 所有平台一致性强
✅ 易于记忆和传播
✅ 符合各平台规范
✅ SEO 友好
✅ 无命名冲突

---

## 🚀 发布检查清单

发布前确认：

- [ ] package.json 中 `name` 正确
- [ ] README.md 中所有命名一致
- [ ] CLI 命令测试通过
- [ ] GitHub 仓库名匹配
- [ ] ClawHub skill.json 配置正确
- [ ] 文档中无命名错误
- [ ] npm 包名可用性已确认

---

**状态**: ✅ 命名方案已确定并实施
**版本**: 1.0.0
**最后审核**: 2026-03-13
