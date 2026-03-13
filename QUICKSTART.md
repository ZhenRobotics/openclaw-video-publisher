# Quick Start Guide - Agent Audit Trail

**Get started with AI decision tracking in 5 minutes**

---

## Installation

### Option 1: Clone Repository

```bash
git clone https://github.com/ZhenRobotics/openclaw-audit-trail.git
cd openclaw-audit-trail
npm install
npm link  # Make CLI globally available
```

### Option 2: NPM (Coming Soon)

```bash
npm install -g openclaw-audit-trail
```

---

## First Steps

### 1. Initialize Your Audit Trail

```bash
# Create audit trail for your agent
audit-trail init --agent-id my-first-agent --version 1.0.0

# Output:
# ✓ Audit trail initialized successfully!
# Configuration:
#   Agent ID: my-first-agent
#   Version: 1.0.0
#   Storage: ./audit-data
```

This creates:
- `./audit-data/` directory
- `./audit-data/chains/` for decision chains
- `./audit-data/metadata.json` for chain metadata

### 2. Record Your First Decision

```bash
audit-trail record \
  --prompt "What is the capital of France?" \
  --decision "Paris" \
  --reasoning "Based on geographic knowledge"

# Output:
# ✓ Decision recorded!
# Entry Details:
#   ID: entry_1234567890_abc
#   Hash: fedcba098765...
#   Timestamp: 2024-03-10T10:00:00Z
```

### 3. Verify Integrity

```bash
audit-trail verify

# Output:
# ✓ Audit trail verified successfully!
# ✓ Chain integrity intact
#   Total entries: 1
#   Verified: 1
```

### 4. List Decisions

```bash
audit-trail list

# Output:
# Audit Trail Entries (1):
#
# 1. Entry entry_1234567890_abc
#    Timestamp: 2024-03-10T10:00:00Z
#    Input: What is the capital of France?
#    Decision: Paris
#    Hash: fedcba098765...
```

---

## Common Workflows

### Simple Q&A Agent

```bash
# Record multiple decisions
audit-trail record --prompt "2+2?" --decision "4" --reasoning "Math"
audit-trail record --prompt "Sky color?" --decision "blue" --reasoning "Visual"
audit-trail record --prompt "Water temp?" --decision "cold" --reasoning "Sensory"

# List all decisions
audit-trail list --limit 10
```

### Financial Decision Agent

```bash
# Record with context
audit-trail record \
  --agent-id finance-bot \
  --prompt "Approve loan #12345" \
  --decision "approved" \
  --reasoning "Credit score 750, income verified, debt ratio 0.3"

# Verify chain
audit-trail verify --agent-id finance-bot
```

### Content Moderation Agent

```bash
# Initialize separate agent
audit-trail init --agent-id content-moderator --version 1.0.0

# Record moderation decisions
audit-trail record \
  --agent-id content-moderator \
  --prompt "Review comment: 'Great product!'" \
  --decision "approved" \
  --reasoning "No policy violations detected"

# Export for reporting
audit-trail export \
  --agent-id content-moderator \
  --output moderation-report.html \
  --format html
```

---

## Programmatic Usage

### Basic Example

Create `example.ts`:

```typescript
import { AgentAuditTrail } from './src/core/audit-trail';

async function main() {
  // Initialize
  const trail = new AgentAuditTrail({
    agentId: 'my-agent',
    agentVersion: '1.0.0',
    storagePath: './audit-data'
  });

  await trail.initialize();

  // Record a decision
  const entry = await trail.recordSimple(
    'Should I send notification?',
    'yes',
    'User preference is enabled and event is important',
    150
  );

  console.log('Recorded:', entry.id);

  // Verify
  const verification = trail.verify();
  console.log('Valid:', verification.valid);

  await trail.close();
}

main();
```

Run it:

```bash
npx tsx example.ts
```

### Advanced Example

```typescript
import { AgentAuditTrail } from './src/core/audit-trail';

async function main() {
  const trail = new AgentAuditTrail({
    agentId: 'advanced-agent',
    agentVersion: '2.0.0'
  });

  await trail.initialize();

  // Record detailed decision
  const entry = await trail.recordDecision(
    // Input
    {
      prompt: 'Classify image #789',
      context: { imageUrl: 'https://...', userId: 'user123' },
      parameters: { confidence_threshold: 0.8 }
    },
    // Reasoning
    {
      steps: [
        {
          step: 1,
          action: 'preprocess',
          thought: 'Resize image to 224x224',
          timestamp: Date.now()
        },
        {
          step: 2,
          action: 'inference',
          thought: 'Run through CNN model',
          observation: 'Detected: cat (95%), dog (3%), bird (2%)',
          timestamp: Date.now()
        },
        {
          step: 3,
          action: 'decide',
          thought: 'Confidence above threshold, selecting cat',
          timestamp: Date.now()
        }
      ],
      model: 'resnet50',
      temperature: 0.0
    },
    // Output
    {
      decision: 'cat',
      confidence: 0.95,
      alternatives: [
        { decision: 'dog', confidence: 0.03, reasoning: 'Low confidence' },
        { decision: 'bird', confidence: 0.02, reasoning: 'Very low confidence' }
      ],
      metadata: { processingTime: '120ms', imageSize: '1024x768' }
    },
    // Execution time
    120,
    // Cost
    {
      inputTokens: 0,
      outputTokens: 0,
      totalCost: 0.001
    }
  );

  console.log('Decision recorded:', entry.id);
  console.log('Hash:', entry.hash.substring(0, 16) + '...');

  // Query recent decisions
  const recent = await trail.query({
    limit: 5,
    startTime: Date.now() - 3600000 // Last hour
  });

  console.log(`Found ${recent.length} recent decisions`);

  // Export as JSON
  const jsonExport = await trail.export({
    format: 'json',
    includeMetadata: true,
    includeReasoning: true
  });

  console.log('Export ready');

  await trail.close();
}

main();
```

---

## Configuration

### Environment Variables

Create `.env`:

```bash
# Agent settings
AGENT_ID=my-agent
AGENT_VERSION=1.0.0

# Storage
STORAGE_PATH=./audit-data
STORAGE_TYPE=json

# Features
AUTO_VERIFY=true
```

Then use:

```bash
audit-trail record --prompt "Test" --decision "OK" --reasoning "Using env config"
```

### Multiple Agents

Track different agents separately:

```bash
# Agent 1: Financial decisions
audit-trail init --agent-id finance-bot --storage ./data/finance

# Agent 2: Content moderation
audit-trail init --agent-id moderator --storage ./data/moderation

# Agent 3: Image classification
audit-trail init --agent-id vision --storage ./data/vision

# Record to specific agent
audit-trail record \
  --agent-id finance-bot \
  --storage ./data/finance \
  --prompt "Approve?" \
  --decision "yes"
```

---

## Export & Reporting

### JSON Export

```bash
audit-trail export --output report.json --format json
```

Output structure:
```json
{
  "metadata": {
    "chainId": "chain_my-agent_1234567890_abc",
    "agentId": "my-agent",
    "totalEntries": 42
  },
  "verification": {
    "valid": true,
    "verifiedEntries": 42
  },
  "entries": [...]
}
```

### HTML Report

```bash
audit-trail export \
  --output report.html \
  --format html \
  --include-reasoning
```

Creates a formatted HTML page with:
- Chain metadata
- Verification status
- All decision entries
- Reasoning details (if enabled)

### CSV Export

```bash
audit-trail export --output data.csv --format csv
```

Columns: ID, Timestamp, Agent ID, Input, Decision, Confidence, Execution Time, Hash

### Markdown Export

```bash
audit-trail export --output report.md --format markdown
```

Creates a markdown document suitable for documentation or GitHub.

---

## Verification

### Manual Verification

```bash
audit-trail verify
```

### Scheduled Verification

Use cron or system scheduler:

```bash
# Check integrity every hour
0 * * * * /usr/local/bin/audit-trail verify --agent-id my-agent
```

### Programmatic Verification

```typescript
const verification = trail.verify();

if (!verification.valid) {
  console.error('ALERT: Chain integrity compromised!');
  console.error('Broken links:', verification.brokenLinks);
  console.error('Errors:', verification.errors);

  // Send alert, log to monitoring system, etc.
}
```

---

## Tips & Best Practices

### 1. Use Descriptive Agent IDs

```bash
# Good
audit-trail init --agent-id loan-approval-prod-v2

# Avoid
audit-trail init --agent-id agent1
```

### 2. Include Context in Reasoning

```bash
# Good
--reasoning "Approved based on credit score 750, income $80k, DTI 0.3"

# Less useful
--reasoning "Looks good"
```

### 3. Regular Exports

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y-%m-%d)
audit-trail export --output "backups/audit-$DATE.json" --format json
```

### 4. Monitor Integrity

```bash
# Add to monitoring
if ! audit-trail verify; then
  echo "ALERT: Audit trail integrity check failed!"
  # Send notification
fi
```

---

## Troubleshooting

### Issue: "Audit trail not initialized"

**Solution**: Run `audit-trail init` first

```bash
audit-trail init --agent-id my-agent
```

### Issue: Storage path doesn't exist

**Solution**: Specify or create storage path

```bash
mkdir -p ./custom-path
audit-trail init --storage ./custom-path
```

### Issue: Verification fails

**Cause**: Chain may be corrupted or tampered with

**Solution**: Check errors

```bash
audit-trail verify --agent-id my-agent
# Review error messages
```

### Issue: Cannot find audit-trail command

**Solution**: Link the package

```bash
cd openclaw-audit-trail
npm link
```

---

## Next Steps

1. **Integrate into your app**: Use programmatic API
2. **Set up monitoring**: Verify chain integrity regularly
3. **Create dashboards**: Export and visualize decisions
4. **Ensure compliance**: Use audit trails for regulatory requirements
5. **Experiment**: Try different export formats and queries

---

**Ready to build transparent AI? Start tracking decisions now!**
