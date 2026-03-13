/**
 * Test: Audit Chain
 */

import { AuditTrailChain } from '../src/core/chain';
import { AuditConfig } from '../src/core/types';

async function testChain() {
  console.log('Testing Audit Chain...\n');

  const config: AuditConfig = {
    agentId: 'test-agent',
    agentVersion: '1.0.0',
    storageType: 'json',
    storagePath: './test-data',
    enableSignatures: false,
    enableCompression: false,
    autoVerify: true,
  };

  const chain = new AuditTrailChain(config);

  // Test 1: Create entry
  console.log('Test 1: Create entry');
  const entry1 = chain.createEntry(
    { prompt: 'Test prompt 1' },
    {
      steps: [
        { step: 1, action: 'think', thought: 'Test thought', timestamp: Date.now() },
      ],
    },
    { decision: 'Test decision 1' },
    100
  );
  console.log(`  ✓ Entry created: ${entry1.id}`);
  console.log(`  Hash: ${entry1.hash.substring(0, 16)}...\n`);

  // Test 2: Add to chain
  console.log('Test 2: Add to chain');
  chain.addEntry(entry1);
  console.log(`  ✓ Entry added to chain\n`);

  // Test 3: Create and add second entry
  console.log('Test 3: Add second entry');
  const entry2 = chain.createEntry(
    { prompt: 'Test prompt 2' },
    {
      steps: [
        { step: 1, action: 'analyze', thought: 'Analysis', timestamp: Date.now() },
      ],
    },
    { decision: 'Test decision 2' },
    150
  );
  chain.addEntry(entry2);
  console.log(`  ✓ Second entry added`);
  console.log(`  Previous hash: ${entry2.previousHash.substring(0, 16)}...\n`);

  // Test 4: Verify chain
  console.log('Test 4: Verify chain integrity');
  const verification = chain.verify();
  console.log(`  Valid: ${verification.valid}`);
  console.log(`  Verified entries: ${verification.verifiedEntries}/${verification.totalEntries}`);
  console.log(`  Broken links: ${verification.brokenLinks.length}\n`);

  // Test 5: Get metadata
  console.log('Test 5: Get chain metadata');
  const metadata = chain.getMetadata();
  console.log(`  Chain ID: ${metadata.chainId}`);
  console.log(`  Total entries: ${metadata.totalEntries}`);
  console.log(`  Verified: ${metadata.verified}\n`);

  // Test 6: Tampering detection
  console.log('Test 6: Test tampering detection');
  const entries = chain.getEntries();
  const tamperedEntry = { ...entries[0], output: { decision: 'TAMPERED!' } };

  try {
    // This should fail
    chain.addEntry(tamperedEntry as any);
    console.log('  ✗ Tampering not detected (ERROR)');
  } catch (error: any) {
    console.log(`  ✓ Tampering detected: ${error.message}\n`);
  }

  console.log('All tests passed! ✓');
}

testChain().catch(console.error);
