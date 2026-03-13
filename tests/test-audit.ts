/**
 * Test: Full Audit Trail Integration
 */

import { AgentAuditTrail } from '../src/core/audit-trail';
import * as fs from 'fs';

async function testAuditTrail() {
  console.log('Testing Agent Audit Trail Integration...\n');

  const testPath = './test-audit-data';

  // Cleanup
  if (fs.existsSync(testPath)) {
    fs.rmSync(testPath, { recursive: true });
  }

  const trail = new AgentAuditTrail({
    agentId: 'integration-test-agent',
    agentVersion: '1.0.0',
    storagePath: testPath,
    autoVerify: true,
  });

  // Test 1: Initialize
  console.log('Test 1: Initialize');
  await trail.initialize();
  console.log('  ✓ Initialized\n');

  // Test 2: Record simple decision
  console.log('Test 2: Record simple decision');
  const entry1 = await trail.recordSimple(
    'What is 2+2?',
    '4',
    'Basic arithmetic',
    50
  );
  console.log(`  ✓ Recorded: ${entry1.id}\n`);

  // Test 3: Record complex decision
  console.log('Test 3: Record complex decision');
  const entry2 = await trail.recordDecision(
    {
      prompt: 'Approve transaction #123',
      context: { amount: 100, userId: 'user456' },
    },
    {
      steps: [
        {
          step: 1,
          action: 'verify',
          thought: 'Check user balance',
          observation: 'Balance: $500',
          timestamp: Date.now(),
        },
        {
          step: 2,
          action: 'decide',
          thought: 'Sufficient balance, approve',
          timestamp: Date.now() + 50,
        },
      ],
      model: 'approval-model-v1',
    },
    {
      decision: 'approved',
      confidence: 0.95,
      alternatives: [
        { decision: 'manual_review', confidence: 0.05, reasoning: 'Edge case' },
      ],
    },
    150,
    {
      inputTokens: 100,
      outputTokens: 50,
      totalCost: 0.002,
    }
  );
  console.log(`  ✓ Complex decision recorded: ${entry2.id}\n`);

  // Test 4: Record multiple decisions
  console.log('Test 4: Record multiple decisions');
  for (let i = 1; i <= 5; i++) {
    await trail.recordSimple(
      `Question ${i}`,
      `Answer ${i}`,
      `Reasoning ${i}`,
      Math.random() * 100
    );
  }
  console.log('  ✓ Recorded 5 additional decisions\n');

  // Test 5: Query decisions
  console.log('Test 5: Query decisions');
  const all = await trail.query();
  console.log(`  ✓ Total decisions: ${all.length}`);

  const limited = await trail.query({ limit: 3 });
  console.log(`  ✓ Limited query: ${limited.length} entries\n`);

  // Test 6: Get specific entry
  console.log('Test 6: Get specific entry');
  const retrieved = await trail.getEntry(entry1.id);
  console.log(`  ✓ Retrieved entry: ${retrieved?.id}`);
  console.log(`  Decision: ${retrieved?.output.decision}\n`);

  // Test 7: Verify chain
  console.log('Test 7: Verify chain integrity');
  const verification = trail.verify();
  console.log(`  Valid: ${verification.valid}`);
  console.log(`  Verified: ${verification.verifiedEntries}/${verification.totalEntries}`);
  console.log(`  Errors: ${verification.errors.length}\n`);

  if (!verification.valid) {
    console.error('  ✗ Verification failed!');
    console.error('  Errors:', verification.errors);
    process.exit(1);
  }

  // Test 8: Get metadata
  console.log('Test 8: Get metadata');
  const metadata = trail.getMetadata();
  console.log(`  Chain ID: ${metadata.chainId}`);
  console.log(`  Agent ID: ${metadata.agentId}`);
  console.log(`  Total entries: ${metadata.totalEntries}`);
  console.log(`  Genesis hash: ${metadata.genesisHash.substring(0, 16)}...\n`);

  // Test 9: Export JSON
  console.log('Test 9: Export as JSON');
  const jsonExport = await trail.export({
    format: 'json',
    includeMetadata: true,
    includeReasoning: true,
  });
  console.log(`  ✓ JSON export size: ${jsonExport.length} bytes\n`);

  // Test 10: Export CSV
  console.log('Test 10: Export as CSV');
  const csvExport = await trail.export({
    format: 'csv',
    includeMetadata: false,
    includeReasoning: false,
  });
  const csvLines = csvExport.split('\n').length;
  console.log(`  ✓ CSV export: ${csvLines} lines\n`);

  // Test 11: Export HTML
  console.log('Test 11: Export as HTML');
  const htmlExport = await trail.export({
    format: 'html',
    includeMetadata: true,
    includeReasoning: true,
  });
  console.log(`  ✓ HTML export size: ${htmlExport.length} bytes\n`);

  // Test 12: Export Markdown
  console.log('Test 12: Export as Markdown');
  const mdExport = await trail.export({
    format: 'markdown',
    includeMetadata: true,
    includeReasoning: true,
  });
  console.log(`  ✓ Markdown export size: ${mdExport.length} bytes\n`);

  // Cleanup
  await trail.close();
  console.log('Cleanup...');
  fs.rmSync(testPath, { recursive: true });
  console.log('  ✓ Test data removed\n');

  console.log('All integration tests passed! ✓✓✓');
}

testAuditTrail().catch(console.error);
