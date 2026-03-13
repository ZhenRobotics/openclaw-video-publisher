# Agent Audit Trail

**The Immutable Black Box for AI Decisions**

Track, audit, and verify AI agent decisions with cryptographic guarantees. An open-source solution for AI transparency, accountability, and compliance.

---

## Why Agent Audit Trail?

As AI agents become more autonomous and make critical decisions, we need a way to:

- **Track every decision** an AI agent makes
- **Verify integrity** with cryptographic proof
- **Ensure compliance** with regulatory requirements
- **Debug failures** by replaying decision chains
- **Build trust** through transparency

Agent Audit Trail provides an immutable, tamper-proof record of AI decision-making processes.

---

## Core Features

### Immutability
- **Cryptographic chain**: Each decision entry is cryptographically linked to the previous one
- **Tamper detection**: Any modification to historical records is immediately detectable
- **Hash-based verification**: SHA-256 hashing ensures data integrity

### Comprehensive Tracking
- **Input capture**: Record prompts, context, and parameters
- **Reasoning steps**: Track the agent's decision-making process
- **Output recording**: Store decisions, confidence levels, and alternatives
- **Cost tracking**: Monitor token usage and API costs

### Flexibility
- **Multiple storage backends**: JSON files, SQLite, PostgreSQL (coming soon)
- **Export formats**: JSON, CSV, HTML, Markdown
- **Query API**: Filter and search historical decisions
- **CLI and programmatic access**: Use via command line or integrate into your code

### Verification
- **Chain integrity checks**: Verify the entire decision chain hasn't been tampered with
- **Automatic verification**: Optional auto-verify on each write
- **Audit reports**: Generate compliance-ready audit reports

---

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/ZhenRobotics/openclaw-audit-trail.git
cd openclaw-audit-trail

# Install dependencies
npm install

# Make CLI accessible
npm link
```

### Initialize Audit Trail

```bash
# Initialize for your agent
audit-trail init --agent-id my-ai-agent --version 1.0.0

# Or use short alias
aat init --agent-id my-ai-agent
```

### Record Decisions

```bash
# Record a simple decision
audit-trail record \
  --prompt "Should I approve this transaction?" \
  --decision "Approved" \
  --reasoning "Transaction amount is within limits and user is verified"

# Record with more details
audit-trail record \
  --prompt "Classify this image" \
  --decision "cat" \
  --reasoning "Detected feline features with 95% confidence" \
  --agent-id vision-classifier
```

### Verify Integrity

```bash
# Verify the audit chain
audit-trail verify

# Expected output:
# ✓ Chain integrity intact
#   Total entries: 42
#   Verified: 42
```

### List Decisions

```bash
# List recent decisions
audit-trail list --limit 10

# List with time filter
audit-trail list --start 1700000000 --end 1700100000
```

### Export Audit Trail

```bash
# Export as JSON
audit-trail export --output audit-report.json --format json

# Export as HTML report
audit-trail export --output audit-report.html --format html --include-reasoning

# Export as CSV
audit-trail export --output audit-data.csv --format csv
```

### View Information

```bash
# Show audit trail info
audit-trail info

# Output:
# Chain Metadata:
#   Chain ID: chain_my-ai-agent_1234567890_abc
#   Total Entries: 42
#   Created: 2024-03-10T10:00:00Z
#   Last Updated: 2024-03-10T15:30:00Z
```

---

## Programmatic Usage

### TypeScript/JavaScript

```typescript
import { AgentAuditTrail } from 'openclaw-audit-trail';

// Initialize
const trail = new AgentAuditTrail({
  agentId: 'my-ai-agent',
  agentVersion: '1.0.0',
  storagePath: './audit-data'
});

await trail.initialize();

// Record a decision
const entry = await trail.recordDecision(
  // Input
  {
    prompt: 'Should I send this email?',
    context: { urgency: 'high', recipient: 'user@example.com' }
  },
  // Reasoning
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
  // Output
  {
    decision: 'send',
    confidence: 0.95,
    alternatives: [
      { decision: 'delay', confidence: 0.05, reasoning: 'Wait for manual review' }
    ]
  },
  // Execution time
  1250,
  // Cost (optional)
  {
    inputTokens: 150,
    outputTokens: 50,
    totalCost: 0.003
  }
);

console.log(`Decision recorded: ${entry.id}`);

// Query decisions
const decisions = await trail.query({
  startTime: Date.now() - 86400000, // Last 24 hours
  limit: 100
});

// Verify integrity
const verification = trail.verify();
if (!verification.valid) {
  console.error('Chain compromised!', verification.errors);
}

// Export
const htmlReport = await trail.export({
  format: 'html',
  includeMetadata: true,
  includeReasoning: true
});

await trail.close();
```

### Simple Helper

```typescript
// For simple use cases
const entry = await trail.recordSimple(
  'What is 2+2?',
  '4',
  'Basic arithmetic calculation',
  50 // execution time in ms
);
```

---

## Use Cases

### 1. AI Safety & Compliance

**Scenario**: Financial institution using AI for loan approvals

```typescript
await trail.recordDecision(
  {
    prompt: 'Approve loan application #12345',
    context: { creditScore: 720, income: 80000, debtRatio: 0.3 }
  },
  {
    steps: [
      { step: 1, action: 'evaluate', thought: 'Checking credit score threshold', timestamp: Date.now() },
      { step: 2, action: 'analyze', thought: 'Debt-to-income ratio acceptable', timestamp: Date.now() },
      { step: 3, action: 'decide', thought: 'All criteria met for approval', timestamp: Date.now() }
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

**Benefits**: Full audit trail for regulatory compliance, ability to explain decisions to customers

### 2. Autonomous Systems

**Scenario**: Self-driving car decision logging

```typescript
await trail.recordDecision(
  {
    prompt: 'Pedestrian detected crossing street',
    context: { speed: 35, distance: 50, weather: 'clear' }
  },
  {
    steps: [
      { step: 1, action: 'detect', thought: 'Pedestrian at 50m ahead', timestamp: Date.now() },
      { step: 2, action: 'calculate', thought: 'Stopping distance: 35m', timestamp: Date.now() },
      { step: 3, action: 'decide', thought: 'Initiate emergency brake', timestamp: Date.now() }
    ]
  },
  {
    decision: 'emergency_brake',
    confidence: 1.0
  },
  120
);
```

**Benefits**: Black box recording for accident investigation, safety analysis

### 3. Content Moderation

**Scenario**: AI moderating user-generated content

```typescript
await trail.recordDecision(
  {
    prompt: 'Moderate comment: "..."',
    context: { userId: 'user123', platform: 'forum' }
  },
  {
    steps: [
      { step: 1, action: 'scan', thought: 'Checking for hate speech patterns', timestamp: Date.now() },
      { step: 2, action: 'analyze', thought: 'Detected potential violation', timestamp: Date.now() },
      { step: 3, action: 'decide', thought: 'Flagging for human review', timestamp: Date.now() }
    ]
  },
  {
    decision: 'flag_for_review',
    confidence: 0.75,
    metadata: { violationType: 'potential_hate_speech' }
  },
  850
);
```

**Benefits**: Transparency for users, evidence for policy enforcement

### 4. Research & Development

**Scenario**: Debugging AI agent behavior

```bash
# Find all failed decisions
audit-trail list --limit 100 | grep "failed"

# Export last week's decisions for analysis
audit-trail export --output weekly-decisions.json \
  --start $(date -d '7 days ago' +%s) \
  --format json --include-reasoning

# Verify no tampering occurred
audit-trail verify
```

**Benefits**: Reproducible experiments, decision pattern analysis

---

## Architecture

```
┌─────────────────────────────────────────┐
│           CLI / API Layer               │
│   (User Interface & Integration)        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      AgentAuditTrail (Main API)         │
│  - Record decisions                     │
│  - Query & export                       │
│  - Verification                         │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼──────────┐  ┌──────▼─────────┐
│ AuditChain   │  │ Storage Layer  │
│              │  │                │
│ - Hash chain │  │ - JSON files   │
│ - Integrity  │  │ - SQLite       │
│ - Verify     │  │ - PostgreSQL   │
└──────────────┘  └────────────────┘
```

### Key Components

#### 1. AuditTrailChain
- Manages cryptographic chain
- Creates and links entries
- Verifies integrity

#### 2. Storage Backends
- **JSONStorage**: File-based storage (default)
- **SQLiteStorage**: Coming soon
- **PostgresStorage**: Coming soon

#### 3. CLI
- Command-line interface
- Easy integration with scripts and automation

---

## Configuration

### Environment Variables

Create a `.env` file:

```bash
# Agent configuration
AGENT_ID=my-ai-agent
AGENT_VERSION=1.0.0

# Storage
STORAGE_PATH=./audit-data
STORAGE_TYPE=json

# Options
AUTO_VERIFY=true
ENABLE_SIGNATURES=false
ENABLE_COMPRESSION=false
```

### Programmatic Configuration

```typescript
const trail = new AgentAuditTrail({
  agentId: 'my-agent',
  agentVersion: '2.0.0',
  storageType: 'json',
  storagePath: './custom-path',
  enableSignatures: false,
  enableCompression: false,
  autoVerify: true
});
```

---

## Data Format

### Decision Entry Structure

```json
{
  "id": "entry_1234567890_abc",
  "timestamp": 1234567890000,
  "agentId": "my-ai-agent",
  "agentVersion": "1.0.0",
  "input": {
    "prompt": "Should I approve this?",
    "context": { "user": "john", "amount": 100 },
    "parameters": { "threshold": 0.8 }
  },
  "reasoning": {
    "steps": [
      {
        "step": 1,
        "action": "analyze",
        "thought": "Checking approval criteria",
        "timestamp": 1234567890100
      }
    ],
    "model": "gpt-4",
    "temperature": 0.7
  },
  "output": {
    "decision": "approved",
    "confidence": 0.95,
    "alternatives": [
      {
        "decision": "reject",
        "confidence": 0.05,
        "reasoning": "Amount slightly high"
      }
    ]
  },
  "executionTime": 1250,
  "cost": {
    "inputTokens": 150,
    "outputTokens": 50,
    "totalCost": 0.003
  },
  "previousHash": "abcdef1234567890...",
  "hash": "fedcba0987654321..."
}
```

---

## Security

### Cryptographic Guarantees

- **SHA-256 hashing**: Industry-standard cryptographic hash
- **Chain linking**: Each entry references previous entry's hash
- **Tamper detection**: Any modification breaks the chain
- **Genesis hash**: Unique chain identifier

### Best Practices

1. **Backup regularly**: Export and store audit trails securely
2. **Verify periodically**: Run verification checks on schedule
3. **Secure storage**: Protect audit data with appropriate permissions
4. **Monitor integrity**: Set up alerts for verification failures

---

## Roadmap

### v1.1 (Coming Soon)
- [ ] SQLite storage backend
- [ ] PostgreSQL storage backend
- [ ] Digital signatures for entries
- [ ] Compression support
- [ ] Web dashboard

### v1.2 (Future)
- [ ] Blockchain integration (Ethereum, Hyperledger)
- [ ] Real-time streaming API
- [ ] Advanced analytics
- [ ] Multi-agent support
- [ ] Distributed audit trails

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Support

- **GitHub Issues**: https://github.com/ZhenRobotics/openclaw-audit-trail/issues
- **Documentation**: https://github.com/ZhenRobotics/openclaw-audit-trail/wiki
- **Email**: support@zhenrobotics.com

---

**Built with transparency in mind. Make AI decisions auditable and trustworthy.**
