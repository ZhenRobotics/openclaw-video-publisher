# Agent Audit Trail Skill

**AI决策的不可篡改黑匣子 - AI Agent 使用指南**
**The Immutable Black Box for AI Decisions - AI Agent Usage Guide**

---

## 🎯 Skill 简介 / Introduction

这是一个为AI决策提供密码学保证的审计追踪工具，可以记录、验证和审计AI Agent的每一个决策过程。

This is an audit trail tool that provides cryptographic guarantees for AI decisions, enabling recording, verification, and auditing of every AI Agent decision process.

### 核心功能 / Core Features
- 🔗 **密码学链条** - SHA-256哈希链确保不可篡改 / Cryptographic chain with SHA-256 hashing ensures immutability
- 📝 **完整记录** - 捕获输入、推理、输出全过程 / Complete recording of input, reasoning, and output
- ✅ **完整性验证** - 自动检测任何篡改行为 / Integrity verification detects any tampering
- 📊 **多格式导出** - JSON、CSV、HTML、Markdown / Multiple export formats
- ⚡ **CLI和API** - 命令行和编程接口双重支持 / Both CLI and programmatic interfaces

---

## 📋 依赖和要求 / Dependencies and Requirements

### 系统要求 / System Requirements
- **Node.js**: >= 18.0.0
- **操作系统 / OS**: Linux, macOS, Windows
- **磁盘空间 / Disk Space**: >= 50MB

### 外部依赖 / External Dependencies
本工具**不依赖**任何外部API或服务，所有数据存储在本地。
This tool does **NOT** depend on any external APIs or services. All data is stored locally.

### npm 依赖包 / NPM Dependencies
```json
{
  "dependencies": {
    "chalk": "^4.1.2",
    "commander": "^11.1.0",
    "dotenv": "^16.6.1",
    "ora": "^5.4.1"
  }
}
```

---

## 🚀 快速开始 / Quick Start

### 安装 / Installation

#### 通过 NPM (推荐 / Recommended)
```bash
# 全局安装 / Install globally
npm install -g openclaw-agent-audit-trail

# 或项目依赖 / Or as project dependency
npm install openclaw-agent-audit-trail
```

#### 通过 ClawHub
```bash
# ClawHub安装 / Install via ClawHub
clawhub install agent-audit-trail
```

#### 从源码 / From Source
```bash
git clone https://github.com/ZhenRobotics/openclaw-agent-audit-trail.git
cd openclaw-agent-audit-trail
npm install
npm link
```

### 初始化 / Initialization

```bash
# 初始化审计追踪 / Initialize audit trail
audit-trail init --agent-id my-ai-agent --version 1.0.0

# 或使用别名 / Or use alias
aat init --agent-id my-agent
```

### 记录决策 / Record Decisions

```bash
# 简单记录 / Simple recording
audit-trail record \
  --prompt "Should I approve this loan?" \
  --decision "Approved" \
  --reasoning "Credit score 750, income verified, debt ratio acceptable"

# 带更多细节 / With more details
audit-trail record \
  --prompt "Classify this image" \
  --decision "cat" \
  --reasoning "Detected feline features with 95% confidence" \
  --agent-id vision-classifier
```

### 验证完整性 / Verify Integrity

```bash
# 验证审计链 / Verify audit chain
audit-trail verify

# 预期输出 / Expected output:
# ✓ Chain integrity intact
#   Total entries: 42
#   Verified: 42/42
```

---

## 🤖 AI Agent 使用指南 / AI Agent Usage Guide

### 推荐使用场景 / Recommended Use Cases

#### 1. **AI安全与合规 / AI Safety & Compliance**
```
场景: 金融机构使用AI进行贷款审批
Scenario: Financial institution using AI for loan approvals

User: "记录这次贷款决策的完整过程"
Agent: 使用 audit-trail 记录输入、推理步骤、最终决策
```

#### 2. **自主系统 / Autonomous Systems**
```
场景: 自动驾驶汽车决策日志
Scenario: Self-driving car decision logging

User: "记录紧急刹车决策"
Agent: 记录传感器输入、决策推理、执行动作
```

#### 3. **内容审核 / Content Moderation**
```
场景: AI审核用户生成内容
Scenario: AI moderating user-generated content

User: "记录内容审核决策以备申诉"
Agent: 记录审核输入、分析过程、审核结果
```

### Agent 调用示例 / Agent Code Examples

#### TypeScript Agent 示例 / TypeScript Example

```typescript
import { AgentAuditTrail } from 'openclaw-agent-audit-trail';

// 初始化 / Initialize
const trail = new AgentAuditTrail({
  agentId: 'my-ai-agent',
  agentVersion: '1.0.0',
  storagePath: './audit-data'
});

await trail.initialize();

// 记录决策 / Record decision
const entry = await trail.recordDecision(
  // 输入 / Input
  {
    prompt: 'Should I send this email?',
    context: { urgency: 'high', recipient: 'user@example.com' }
  },
  // 推理 / Reasoning
  {
    steps: [
      {
        step: 1,
        action: 'analyze',
        thought: 'Checking email content for sensitive information',
        timestamp: Date.now()
      },
      {
        step: 2,
        action: 'decide',
        thought: 'No sensitive data detected, urgency is high',
        timestamp: Date.now()
      }
    ],
    model: 'gpt-4',
    temperature: 0.7
  },
  // 输出 / Output
  {
    decision: 'send',
    confidence: 0.95,
    alternatives: [
      { decision: 'delay', confidence: 0.05, reasoning: 'Wait for manual review' }
    ]
  },
  // 执行时间 / Execution time
  1250
);

console.log(`决策已记录 / Decision recorded: ${entry.id}`);

// 验证完整性 / Verify integrity
const verification = trail.verify();
if (!verification.valid) {
  console.error('链条已被篡改! / Chain compromised!', verification.errors);
}
```

#### 简化版本 / Simplified Version

```typescript
// 用于简单用例 / For simple use cases
const entry = await trail.recordSimple(
  'What is 2+2?',
  '4',
  'Basic arithmetic calculation',
  50 // execution time in ms
);
```

#### Shell Script Agent 示例 / Shell Script Example

```bash
#!/bin/bash
# AI Agent 批量决策记录 / Batch decision recording

AGENT_ID="financial-advisor"

# 初始化 / Initialize
audit-trail init --agent-id "$AGENT_ID"

# 记录多个决策 / Record multiple decisions
while read -r transaction; do
  audit-trail record \
    --prompt "Evaluate transaction: $transaction" \
    --decision "$(analyze_transaction "$transaction")" \
    --reasoning "Risk score: $(risk_score "$transaction")" \
    --agent-id "$AGENT_ID"
done < transactions.txt

# 生成审计报告 / Generate audit report
audit-trail export \
  --output "daily-report-$(date +%Y%m%d).html" \
  --format html \
  --include-reasoning

# 验证完整性 / Verify integrity
audit-trail verify
```

---

## 🔐 安全性说明 / Security Notes

### 密码学保证 / Cryptographic Guarantees
- ✅ **SHA-256哈希** - 工业标准加密哈希 / Industry-standard cryptographic hash
- ✅ **链式关联** - 每个条目引用前一个哈希 / Each entry references previous hash
- ✅ **篡改检测** - 任何修改立即可检测 / Any modification is immediately detectable
- ✅ **创世哈希** - 唯一链标识符 / Unique chain identifier

### 数据隐私 / Data Privacy
- ✅ **本地存储** - 所有数据存储在本地文件系统 / All data stored locally
- ✅ **无外部传输** - 不连接任何外部服务器 / No external server connections
- ✅ **用户控制** - 完全由用户控制数据 / User has full control of data
- ✅ **可删除** - 用户可随时删除审计数据 / Users can delete audit data anytime

### 最佳实践 / Best Practices
1. **定期备份** - 定期导出并安全存储审计追踪 / Regularly export and securely store audit trails
2. **定期验证** - 按计划运行验证检查 / Run verification checks on schedule
3. **安全存储** - 使用适当权限保护审计数据 / Protect audit data with appropriate permissions
4. **监控完整性** - 设置验证失败告警 / Set up alerts for verification failures

---

## 📊 CLI 命令参考 / CLI Command Reference

### `init` - 初始化 / Initialize
```bash
audit-trail init --agent-id <id> [--version <ver>] [--storage-path <path>]
```

### `record` - 记录决策 / Record Decision
```bash
audit-trail record \
  --prompt <text> \
  --decision <text> \
  --reasoning <text> \
  [--agent-id <id>]
```

### `verify` - 验证完整性 / Verify Integrity
```bash
audit-trail verify [--agent-id <id>]
```

### `list` - 列出决策 / List Decisions
```bash
audit-trail list [--limit <n>] [--start <timestamp>] [--end <timestamp>]
```

### `export` - 导出数据 / Export Data
```bash
audit-trail export \
  --output <file> \
  --format <json|csv|html|markdown> \
  [--include-reasoning]
```

### `info` - 显示信息 / Show Information
```bash
audit-trail info [--agent-id <id>]
```

---

## 🎯 使用场景详解 / Detailed Use Cases

### 场景 1: 金融服务 / Financial Services
```typescript
// 贷款审批追踪 / Loan approval tracking
await trail.recordDecision(
  {
    prompt: 'Approve loan application #12345',
    context: { creditScore: 720, income: 80000, debtRatio: 0.3 }
  },
  {
    steps: [
      { step: 1, action: 'evaluate', thought: 'Checking credit score threshold' },
      { step: 2, action: 'analyze', thought: 'Debt-to-income ratio acceptable' },
      { step: 3, action: 'decide', thought: 'All criteria met for approval' }
    ]
  },
  {
    decision: 'approved',
    confidence: 0.92,
    metadata: { loanAmount: 50000, interestRate: 0.045 }
  },
  2300
);
```

### 场景 2: 自主系统 / Autonomous Systems
```typescript
// 自动驾驶决策 / Self-driving decision
await trail.recordDecision(
  {
    prompt: 'Pedestrian detected crossing street',
    context: { speed: 35, distance: 50, weather: 'clear' }
  },
  {
    steps: [
      { step: 1, action: 'detect', thought: 'Pedestrian at 50m ahead' },
      { step: 2, action: 'calculate', thought: 'Stopping distance: 35m' },
      { step: 3, action: 'decide', thought: 'Initiate emergency brake' }
    ]
  },
  {
    decision: 'emergency_brake',
    confidence: 1.0
  },
  120
);
```

### 场景 3: 研究与开发 / Research & Development
```bash
# 调试AI行为 / Debug AI behavior
audit-trail list --limit 100 | grep "failed"

# 导出分析数据 / Export analysis data
audit-trail export \
  --output weekly-decisions.json \
  --start $(date -d '7 days ago' +%s) \
  --format json --include-reasoning
```

---

## 🐛 常见问题 / FAQ

### Q1: 如何确保审计数据不被篡改？
**How to ensure audit data cannot be tampered with?**

**A**: 使用密码学哈希链。每个条目包含前一条目的SHA-256哈希，任何修改都会破坏链条。定期运行 `audit-trail verify` 检测篡改。

**A**: Use cryptographic hash chain. Each entry contains the SHA-256 hash of the previous entry. Any modification breaks the chain. Run `audit-trail verify` regularly to detect tampering.

### Q2: 审计数据存储在哪里？
**Where is audit data stored?**

**A**: 默认存储在 `./audit-data` 目录。可通过 `--storage-path` 参数或环境变量 `STORAGE_PATH` 自定义。

**A**: Stored in `./audit-data` directory by default. Customizable via `--storage-path` parameter or `STORAGE_PATH` environment variable.

### Q3: 支持分布式审计吗？
**Does it support distributed auditing?**

**A**: 当前版本(v1.0.0)支持本地文件存储。未来版本将支持SQLite、PostgreSQL和区块链集成。

**A**: Current version (v1.0.0) supports local file storage. Future versions will support SQLite, PostgreSQL, and blockchain integration.

### Q4: 如何处理大量决策记录？
**How to handle large volumes of decision records?**

**A**: 使用查询功能按时间范围过滤，定期导出和归档旧数据，未来版本将支持数据库存储以提高性能。

**A**: Use query functionality to filter by time range, regularly export and archive old data. Future versions will support database storage for better performance.

---

## 📁 项目结构 / Project Structure

```
openclaw-agent-audit-trail/
├── bin/
│   └── audit-trail.sh         # CLI 入口 / CLI entry point
├── src/
│   ├── core/
│   │   ├── types.ts           # 类型定义 / Type definitions
│   │   ├── chain.ts           # 密码学链 / Cryptographic chain
│   │   └── audit-trail.ts     # 主API / Main API
│   ├── storage/
│   │   └── json-storage.ts    # JSON存储 / JSON storage
│   ├── cli/
│   │   └── index.ts           # CLI实现 / CLI implementation
│   └── index.ts               # 导出 / Exports
├── examples/
│   ├── simple-usage.ts        # 简单示例 / Simple example
│   └── advanced-usage.ts      # 高级示例 / Advanced example
├── tests/
│   ├── test-chain.ts          # 链测试 / Chain tests
│   ├── test-storage.ts        # 存储测试 / Storage tests
│   └── test-audit.ts          # 集成测试 / Integration tests
├── .clawhub/
│   └── skill.json             # ClawHub配置 / ClawHub config
├── README.md                  # 完整文档 / Full documentation
└── QUICKSTART.md              # 快速开始 / Quick start guide
```

---

## 🔗 相关资源 / Related Resources

- **GitHub仓库 / Repository**: https://github.com/ZhenRobotics/openclaw-agent-audit-trail
- **npm包 / Package**: https://www.npmjs.com/package/openclaw-agent-audit-trail
- **问题反馈 / Issues**: https://github.com/ZhenRobotics/openclaw-agent-audit-trail/issues
- **完整文档 / Documentation**: [README.md](https://github.com/ZhenRobotics/openclaw-agent-audit-trail#readme)
- **快速开始 / Quick Start**: [QUICKSTART.md](https://github.com/ZhenRobotics/openclaw-agent-audit-trail/blob/main/QUICKSTART.md)

---

## 📝 验证信息 / Verification Information

- **Skill版本 / Version**: 1.0.0
- **最后更新 / Last Updated**: 2026-03-13
- **作者 / Author**: ZhenStaff
- **许可证 / License**: MIT
- **验证仓库 / Repository**: https://github.com/ZhenRobotics/openclaw-agent-audit-trail
- **测试状态 / Test Status**: ✅ 25/25 tests passing

---

## 🚀 路线图 / Roadmap

### v1.1 (即将推出 / Coming Soon)
- [ ] SQLite 存储后端 / SQLite storage backend
- [ ] PostgreSQL 存储后端 / PostgreSQL storage backend
- [ ] 数字签名支持 / Digital signature support
- [ ] 压缩支持 / Compression support
- [ ] Web 仪表板 / Web dashboard

### v1.2 (未来 / Future)
- [ ] 区块链集成 / Blockchain integration
- [ ] 实时流API / Real-time streaming API
- [ ] 高级分析 / Advanced analytics
- [ ] 多Agent支持 / Multi-agent support

---

**让AI决策可审计、可信任！**
**Make AI decisions auditable and trustworthy!**

✨ Built with transparency in mind. 🚀
