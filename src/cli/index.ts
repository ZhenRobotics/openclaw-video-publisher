#!/usr/bin/env node

/**
 * Agent Audit Trail - CLI Interface
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import chalk from 'chalk';
import ora from 'ora';
import { AgentAuditTrail } from '../core/audit-trail';
import { AuditConfig } from '../core/types';

// Load environment variables
dotenv.config();

const program = new Command();

program
  .name('audit-trail')
  .description('Agent Audit Trail - The Immutable Black Box for AI Decisions')
  .version('1.0.0');

/**
 * Initialize command - Create new audit trail
 */
program
  .command('init')
  .description('Initialize a new audit trail')
  .option('-a, --agent-id <id>', 'Agent identifier', process.env.AGENT_ID || 'my-agent')
  .option('-v, --version <version>', 'Agent version', process.env.AGENT_VERSION || '1.0.0')
  .option('-s, --storage <path>', 'Storage path', process.env.STORAGE_PATH || './audit-data')
  .action(async (options) => {
    const spinner = ora('Initializing audit trail...').start();

    try {
      const config: Partial<AuditConfig> = {
        agentId: options.agentId,
        agentVersion: options.version,
        storagePath: options.storage,
        storageType: 'json',
      };

      const trail = new AgentAuditTrail(config);
      await trail.initialize();

      spinner.succeed(chalk.green('Audit trail initialized successfully!'));
      console.log(chalk.gray('\nConfiguration:'));
      console.log(chalk.gray(`  Agent ID: ${config.agentId}`));
      console.log(chalk.gray(`  Version: ${config.agentVersion}`));
      console.log(chalk.gray(`  Storage: ${config.storagePath}`));
    } catch (error: any) {
      spinner.fail(chalk.red('Failed to initialize'));
      console.error(chalk.red(`\nError: ${error.message}`));
      process.exit(1);
    }
  });

/**
 * Record command - Record a decision
 */
program
  .command('record')
  .description('Record a new decision')
  .requiredOption('-p, --prompt <text>', 'Input prompt')
  .requiredOption('-d, --decision <text>', 'Decision made')
  .option('-r, --reasoning <text>', 'Reasoning behind decision')
  .option('-a, --agent-id <id>', 'Agent ID', process.env.AGENT_ID || 'my-agent')
  .option('-s, --storage <path>', 'Storage path', process.env.STORAGE_PATH || './audit-data')
  .action(async (options) => {
    const spinner = ora('Recording decision...').start();

    try {
      const trail = new AgentAuditTrail({
        agentId: options.agentId,
        storagePath: options.storage,
      });
      await trail.initialize();

      const startTime = Date.now();
      const entry = await trail.recordSimple(
        options.prompt,
        options.decision,
        options.reasoning || 'No reasoning provided',
        Date.now() - startTime
      );

      spinner.succeed(chalk.green('Decision recorded!'));
      console.log(chalk.gray('\nEntry Details:'));
      console.log(chalk.gray(`  ID: ${entry.id}`));
      console.log(chalk.gray(`  Hash: ${entry.hash.substring(0, 16)}...`));
      console.log(chalk.gray(`  Timestamp: ${new Date(entry.timestamp).toISOString()}`));

      await trail.close();
    } catch (error: any) {
      spinner.fail(chalk.red('Failed to record decision'));
      console.error(chalk.red(`\nError: ${error.message}`));
      process.exit(1);
    }
  });

/**
 * Verify command - Verify chain integrity
 */
program
  .command('verify')
  .description('Verify audit trail integrity')
  .option('-a, --agent-id <id>', 'Agent ID', process.env.AGENT_ID || 'my-agent')
  .option('-s, --storage <path>', 'Storage path', process.env.STORAGE_PATH || './audit-data')
  .action(async (options) => {
    const spinner = ora('Verifying audit trail...').start();

    try {
      const trail = new AgentAuditTrail({
        agentId: options.agentId,
        storagePath: options.storage,
      });
      await trail.initialize();

      const result = trail.verify();

      if (result.valid) {
        spinner.succeed(chalk.green('Audit trail verified successfully!'));
        console.log(chalk.green('\n✓ Chain integrity intact'));
        console.log(chalk.gray(`  Total entries: ${result.totalEntries}`));
        console.log(chalk.gray(`  Verified: ${result.verifiedEntries}`));
      } else {
        spinner.fail(chalk.red('Verification failed!'));
        console.log(chalk.red('\n✗ Chain integrity compromised'));
        console.log(chalk.red(`  Total entries: ${result.totalEntries}`));
        console.log(chalk.red(`  Broken links: ${result.brokenLinks.length}`));
        console.log(chalk.red('\nErrors:'));
        result.errors.forEach((err) => console.log(chalk.red(`  - ${err}`)));
      }

      await trail.close();
      process.exit(result.valid ? 0 : 1);
    } catch (error: any) {
      spinner.fail(chalk.red('Verification error'));
      console.error(chalk.red(`\nError: ${error.message}`));
      process.exit(1);
    }
  });

/**
 * List command - List all decisions
 */
program
  .command('list')
  .description('List all recorded decisions')
  .option('-a, --agent-id <id>', 'Agent ID', process.env.AGENT_ID || 'my-agent')
  .option('-s, --storage <path>', 'Storage path', process.env.STORAGE_PATH || './audit-data')
  .option('-l, --limit <number>', 'Limit results', '10')
  .option('--start <timestamp>', 'Start time (Unix timestamp)')
  .option('--end <timestamp>', 'End time (Unix timestamp)')
  .action(async (options) => {
    try {
      const trail = new AgentAuditTrail({
        agentId: options.agentId,
        storagePath: options.storage,
      });
      await trail.initialize();

      const entries = await trail.query({
        limit: parseInt(options.limit),
        startTime: options.start ? parseInt(options.start) : undefined,
        endTime: options.end ? parseInt(options.end) : undefined,
      });

      console.log(chalk.blue(`\nAudit Trail Entries (${entries.length}):\n`));

      if (entries.length === 0) {
        console.log(chalk.gray('No entries found.'));
      } else {
        entries.forEach((entry, index) => {
          console.log(chalk.white(`${index + 1}. Entry ${entry.id}`));
          console.log(chalk.gray(`   Timestamp: ${new Date(entry.timestamp).toISOString()}`));
          console.log(chalk.gray(`   Input: ${entry.input.prompt || 'N/A'}`));
          console.log(chalk.gray(`   Decision: ${entry.output.decision}`));
          console.log(chalk.gray(`   Hash: ${entry.hash.substring(0, 16)}...`));
          console.log('');
        });
      }

      await trail.close();
    } catch (error: any) {
      console.error(chalk.red(`\nError: ${error.message}`));
      process.exit(1);
    }
  });

/**
 * Export command - Export audit trail
 */
program
  .command('export')
  .description('Export audit trail to file')
  .requiredOption('-o, --output <file>', 'Output file path')
  .option('-f, --format <format>', 'Export format (json|csv|html|markdown)', 'json')
  .option('-a, --agent-id <id>', 'Agent ID', process.env.AGENT_ID || 'my-agent')
  .option('-s, --storage <path>', 'Storage path', process.env.STORAGE_PATH || './audit-data')
  .option('--include-reasoning', 'Include reasoning steps', false)
  .action(async (options) => {
    const spinner = ora('Exporting audit trail...').start();

    try {
      const trail = new AgentAuditTrail({
        agentId: options.agentId,
        storagePath: options.storage,
      });
      await trail.initialize();

      const exportData = await trail.export({
        format: options.format,
        includeMetadata: true,
        includeReasoning: options.includeReasoning,
      });

      // Write to file
      fs.writeFileSync(options.output, exportData);

      spinner.succeed(chalk.green('Export completed!'));
      console.log(chalk.gray(`\nExported to: ${options.output}`));
      console.log(chalk.gray(`Format: ${options.format}`));

      await trail.close();
    } catch (error: any) {
      spinner.fail(chalk.red('Export failed'));
      console.error(chalk.red(`\nError: ${error.message}`));
      process.exit(1);
    }
  });

/**
 * Info command - Show audit trail information
 */
program
  .command('info')
  .description('Show audit trail information')
  .option('-a, --agent-id <id>', 'Agent ID', process.env.AGENT_ID || 'my-agent')
  .option('-s, --storage <path>', 'Storage path', process.env.STORAGE_PATH || './audit-data')
  .action(async (options) => {
    try {
      const trail = new AgentAuditTrail({
        agentId: options.agentId,
        storagePath: options.storage,
      });
      await trail.initialize();

      const metadata = trail.getMetadata();
      const verification = trail.verify();

      console.log(chalk.blue('\nAudit Trail Information:\n'));
      console.log(chalk.white('Chain Metadata:'));
      console.log(chalk.gray(`  Chain ID: ${metadata.chainId}`));
      console.log(chalk.gray(`  Agent ID: ${metadata.agentId}`));
      console.log(chalk.gray(`  Total Entries: ${metadata.totalEntries}`));
      console.log(chalk.gray(`  Created: ${new Date(metadata.createdAt).toISOString()}`));
      console.log(chalk.gray(`  Last Updated: ${new Date(metadata.lastUpdatedAt).toISOString()}`));
      console.log(chalk.gray(`  Genesis Hash: ${metadata.genesisHash.substring(0, 16)}...`));
      console.log(chalk.gray(`  Latest Hash: ${metadata.latestHash.substring(0, 16)}...`));

      console.log(chalk.white('\nVerification:'));
      if (verification.valid) {
        console.log(chalk.green(`  ✓ Valid (${verification.verifiedEntries}/${verification.totalEntries} entries)`));
      } else {
        console.log(chalk.red(`  ✗ Invalid (${verification.brokenLinks.length} broken links)`));
      }

      await trail.close();
    } catch (error: any) {
      console.error(chalk.red(`\nError: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();
