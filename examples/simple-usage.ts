/**
 * Simple Usage Example - Agent Audit Trail
 */

import { AgentAuditTrail } from '../src/core/audit-trail';

async function main() {
  console.log('Agent Audit Trail - Simple Example\n');

  // Initialize audit trail
  const trail = new AgentAuditTrail({
    agentId: 'example-agent',
    agentVersion: '1.0.0',
    storagePath: './examples/data'
  });

  await trail.initialize();
  console.log('✓ Audit trail initialized\n');

  // Record a simple decision
  console.log('Recording decision 1...');
  const entry1 = await trail.recordSimple(
    'What is 2 + 2?',
    '4',
    'Basic arithmetic calculation',
    50
  );
  console.log(`  ✓ Recorded: ${entry1.id}\n`);

  // Record another decision
  console.log('Recording decision 2...');
  const entry2 = await trail.recordSimple(
    'Is the sky blue?',
    'Yes',
    'Based on typical weather conditions and atmospheric scattering',
    75
  );
  console.log(`  ✓ Recorded: ${entry2.id}\n`);

  // Record a third decision
  console.log('Recording decision 3...');
  const entry3 = await trail.recordSimple(
    'Should I approve this request?',
    'Approved',
    'All criteria met: valid user, within limits, no red flags',
    120
  );
  console.log(`  ✓ Recorded: ${entry3.id}\n`);

  // Query all decisions
  console.log('Querying all decisions...');
  const allDecisions = await trail.query();
  console.log(`  Found ${allDecisions.length} decisions\n`);

  // Display decisions
  allDecisions.forEach((entry, index) => {
    console.log(`  ${index + 1}. ${entry.input.prompt} → ${entry.output.decision}`);
  });
  console.log('');

  // Verify chain integrity
  console.log('Verifying chain integrity...');
  const verification = trail.verify();
  if (verification.valid) {
    console.log(`  ✓ Chain verified: ${verification.verifiedEntries}/${verification.totalEntries} entries valid\n`);
  } else {
    console.log(`  ✗ Verification failed: ${verification.errors.join(', ')}\n`);
  }

  // Show metadata
  const metadata = trail.getMetadata();
  console.log('Chain Metadata:');
  console.log(`  Chain ID: ${metadata.chainId}`);
  console.log(`  Total Entries: ${metadata.totalEntries}`);
  console.log(`  Genesis Hash: ${metadata.genesisHash.substring(0, 16)}...`);
  console.log(`  Latest Hash: ${metadata.latestHash.substring(0, 16)}...`);

  await trail.close();
  console.log('\n✓ Example completed successfully!');
}

main().catch(console.error);
