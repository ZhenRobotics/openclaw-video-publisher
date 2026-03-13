/**
 * Run All Tests
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runTest(name: string, file: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Running: ${name}`);
  console.log('='.repeat(60));

  try {
    const { stdout, stderr } = await execAsync(`npx tsx ${file}`);
    console.log(stdout);
    if (stderr) {
      console.error(stderr);
    }
    return true;
  } catch (error: any) {
    console.error(`Test failed: ${name}`);
    console.error(error.message);
    return false;
  }
}

async function main() {
  console.log('Agent Audit Trail - Test Suite\n');

  const tests = [
    { name: 'Chain Tests', file: 'tests/test-chain.ts' },
    { name: 'Storage Tests', file: 'tests/test-storage.ts' },
    { name: 'Integration Tests', file: 'tests/test-audit.ts' },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await runTest(test.name, test.file);
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('Test Summary');
  console.log('='.repeat(60));
  console.log(`Total: ${tests.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed === 0) {
    console.log('\n✓✓✓ All tests passed! ✓✓✓\n');
    process.exit(0);
  } else {
    console.log('\n✗✗✗ Some tests failed ✗✗✗\n');
    process.exit(1);
  }
}

main().catch(console.error);
