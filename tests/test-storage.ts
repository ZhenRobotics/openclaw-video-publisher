/**
 * Test: JSON Storage
 */

import { JSONStorage } from '../src/storage/json-storage';
import { DecisionEntry } from '../src/core/types';
import * as fs from 'fs';
import * as path from 'path';

async function testStorage() {
  console.log('Testing JSON Storage...\n');

  const testPath = './test-storage-data';

  // Cleanup if exists
  if (fs.existsSync(testPath)) {
    fs.rmSync(testPath, { recursive: true });
  }

  const storage = new JSONStorage(testPath);

  // Test 1: Initialize
  console.log('Test 1: Initialize storage');
  await storage.initialize();
  console.log(`  ✓ Storage initialized at ${testPath}\n`);

  // Test 2: Save entry
  console.log('Test 2: Save entry');
  const testEntry: DecisionEntry = {
    id: 'test-entry-1',
    timestamp: Date.now(),
    agentId: 'test-agent',
    agentVersion: '1.0.0',
    input: { prompt: 'Test prompt' },
    reasoning: {
      steps: [
        { step: 1, action: 'test', thought: 'Test thought', timestamp: Date.now() },
      ],
    },
    output: { decision: 'Test decision' },
    executionTime: 100,
    previousHash: 'genesis-hash',
    hash: 'test-hash-123',
  };

  await storage.saveEntry(testEntry);
  console.log(`  ✓ Entry saved: ${testEntry.id}\n`);

  // Test 3: Get entry
  console.log('Test 3: Retrieve entry');
  const retrieved = await storage.getEntry(testEntry.id);
  console.log(`  ✓ Entry retrieved: ${retrieved?.id}`);
  console.log(`  Decision: ${retrieved?.output.decision}\n`);

  // Test 4: Get chain
  console.log('Test 4: Get chain');
  const chain = await storage.getChain('test-agent');
  console.log(`  ✓ Chain retrieved: ${chain.length} entries\n`);

  // Test 5: Save multiple entries
  console.log('Test 5: Save multiple entries');
  for (let i = 2; i <= 5; i++) {
    const entry: DecisionEntry = {
      ...testEntry,
      id: `test-entry-${i}`,
      timestamp: Date.now() + i,
      hash: `test-hash-${i}`,
      previousHash: `test-hash-${i - 1}`,
    };
    await storage.saveEntry(entry);
  }
  console.log(`  ✓ Saved 4 additional entries\n`);

  // Test 6: Query entries
  console.log('Test 6: Query entries');
  const all = await storage.queryEntries({ agentId: 'test-agent' });
  console.log(`  ✓ Total entries: ${all.length}`);

  const limited = await storage.queryEntries({ agentId: 'test-agent', limit: 3 });
  console.log(`  ✓ Limited query: ${limited.length} entries\n`);

  // Test 7: Get metadata
  console.log('Test 7: Get chain metadata');
  const metadata = await storage.getChainMetadata('test-agent');
  console.log(`  ✓ Metadata retrieved`);
  console.log(`  Chain ID: ${metadata?.chainId}`);
  console.log(`  Total entries: ${metadata?.totalEntries}\n`);

  // Cleanup
  await storage.close();
  console.log('Test cleanup...');
  fs.rmSync(testPath, { recursive: true });
  console.log('  ✓ Test data removed\n');

  console.log('All storage tests passed! ✓');
}

testStorage().catch(console.error);
