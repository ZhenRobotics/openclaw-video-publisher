/**
 * Agent Audit Trail - Main API
 */

import { AuditTrailChain } from './chain';
import { JSONStorage } from '../storage/json-storage';
import {
  AuditConfig,
  DecisionEntry,
  ReasoningStep,
  QueryOptions,
  VerificationResult,
  ExportOptions,
  ExportFormat,
  StorageBackend,
} from './types';

export class AgentAuditTrail {
  private config: AuditConfig;
  private chain: AuditTrailChain;
  private storage: StorageBackend;
  private initialized: boolean = false;

  constructor(config: Partial<AuditConfig>) {
    // Default configuration
    this.config = {
      agentId: config.agentId || 'default-agent',
      agentVersion: config.agentVersion || '1.0.0',
      storageType: config.storageType || 'json',
      storagePath: config.storagePath || './audit-data',
      enableSignatures: config.enableSignatures || false,
      enableCompression: config.enableCompression || false,
      autoVerify: config.autoVerify || true,
    };

    this.chain = new AuditTrailChain(this.config);

    // Initialize storage backend
    this.storage = this.createStorageBackend();
  }

  /**
   * Create storage backend based on config
   */
  private createStorageBackend(): StorageBackend {
    switch (this.config.storageType) {
      case 'json':
        return new JSONStorage(this.config.storagePath);
      case 'sqlite':
        // TODO: Implement SQLite storage
        throw new Error('SQLite storage not yet implemented');
      case 'postgres':
        // TODO: Implement PostgreSQL storage
        throw new Error('PostgreSQL storage not yet implemented');
      default:
        throw new Error(`Unknown storage type: ${this.config.storageType}`);
    }
  }

  /**
   * Initialize audit trail
   */
  async initialize(): Promise<void> {
    await this.storage.initialize();

    // Load existing chain if available
    const entries = await this.storage.getChain(this.config.agentId);
    if (entries.length > 0) {
      this.chain.loadEntries(entries);
    }

    this.initialized = true;
  }

  /**
   * Record a decision
   */
  async recordDecision(
    input: DecisionEntry['input'],
    reasoning: DecisionEntry['reasoning'],
    output: DecisionEntry['output'],
    executionTime: number,
    cost?: DecisionEntry['cost']
  ): Promise<DecisionEntry> {
    if (!this.initialized) {
      throw new Error('Audit trail not initialized. Call initialize() first.');
    }

    // Create entry
    const entry = this.chain.createEntry(
      input,
      reasoning,
      output,
      executionTime,
      cost
    );

    // Add to chain
    this.chain.addEntry(entry);

    // Save to storage
    await this.storage.saveEntry(entry);

    // Auto-verify if enabled
    if (this.config.autoVerify) {
      const verification = this.chain.verify();
      if (!verification.valid) {
        console.warn('Chain verification failed:', verification.errors);
      }
    }

    return entry;
  }

  /**
   * Helper: Record a simple decision
   */
  async recordSimple(
    prompt: string,
    decision: string,
    reasoning: string,
    executionTime: number
  ): Promise<DecisionEntry> {
    return this.recordDecision(
      { prompt },
      {
        steps: [
          {
            step: 1,
            action: 'decide',
            thought: reasoning,
            timestamp: Date.now(),
          },
        ],
      },
      { decision },
      executionTime
    );
  }

  /**
   * Query entries
   */
  async query(options: QueryOptions = {}): Promise<DecisionEntry[]> {
    if (!this.initialized) {
      throw new Error('Audit trail not initialized');
    }

    return this.storage.queryEntries({
      agentId: this.config.agentId,
      ...options,
    });
  }

  /**
   * Get entry by ID
   */
  async getEntry(id: string): Promise<DecisionEntry | null> {
    if (!this.initialized) {
      throw new Error('Audit trail not initialized');
    }

    return this.storage.getEntry(id);
  }

  /**
   * Verify chain integrity
   */
  verify(): VerificationResult {
    return this.chain.verify();
  }

  /**
   * Get chain metadata
   */
  getMetadata() {
    return this.chain.getMetadata();
  }

  /**
   * Export audit trail
   */
  async export(options: ExportOptions): Promise<string> {
    const entries = this.chain.getEntries();

    switch (options.format) {
      case 'json':
        return this.exportJSON(entries, options);
      case 'csv':
        return this.exportCSV(entries, options);
      case 'html':
        return this.exportHTML(entries, options);
      case 'markdown':
        return this.exportMarkdown(entries, options);
      default:
        throw new Error(`Unknown export format: ${options.format}`);
    }
  }

  /**
   * Export as JSON
   */
  private exportJSON(
    entries: DecisionEntry[],
    options: ExportOptions
  ): string {
    const data = {
      metadata: options.includeMetadata ? this.getMetadata() : undefined,
      verification: options.includeMetadata ? this.verify() : undefined,
      entries: entries,
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Export as CSV
   */
  private exportCSV(
    entries: DecisionEntry[],
    options: ExportOptions
  ): string {
    const headers = [
      'ID',
      'Timestamp',
      'Agent ID',
      'Input',
      'Decision',
      'Confidence',
      'Execution Time',
      'Hash',
    ];

    const rows = entries.map((e) => [
      e.id,
      new Date(e.timestamp).toISOString(),
      e.agentId,
      e.input.prompt || JSON.stringify(e.input),
      e.output.decision,
      e.output.confidence || 'N/A',
      `${e.executionTime}ms`,
      e.hash,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Export as HTML
   */
  private exportHTML(
    entries: DecisionEntry[],
    options: ExportOptions
  ): string {
    const metadata = this.getMetadata();
    const verification = this.verify();

    let html = `<!DOCTYPE html>
<html>
<head>
  <title>Audit Trail - ${metadata.agentId}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .metadata { background: #f0f0f0; padding: 15px; margin-bottom: 20px; }
    .entry { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; }
    .hash { font-family: monospace; font-size: 12px; color: #666; }
    .verified { color: green; }
    .failed { color: red; }
  </style>
</head>
<body>
  <h1>Agent Audit Trail</h1>

  <div class="metadata">
    <h2>Chain Metadata</h2>
    <p><strong>Agent ID:</strong> ${metadata.agentId}</p>
    <p><strong>Total Entries:</strong> ${metadata.totalEntries}</p>
    <p><strong>Verified:</strong> <span class="${verification.valid ? 'verified' : 'failed'}">${verification.valid ? 'Yes' : 'No'}</span></p>
    <p><strong>Created:</strong> ${new Date(metadata.createdAt).toISOString()}</p>
  </div>

  <h2>Decisions</h2>`;

    entries.forEach((entry, index) => {
      html += `
  <div class="entry">
    <h3>Entry #${index + 1}</h3>
    <p><strong>ID:</strong> ${entry.id}</p>
    <p><strong>Timestamp:</strong> ${new Date(entry.timestamp).toISOString()}</p>
    <p><strong>Input:</strong> ${entry.input.prompt || 'N/A'}</p>
    <p><strong>Decision:</strong> ${entry.output.decision}</p>
    <p><strong>Execution Time:</strong> ${entry.executionTime}ms</p>
    ${options.includeReasoning ? `<p><strong>Reasoning:</strong> ${JSON.stringify(entry.reasoning, null, 2)}</p>` : ''}
    <p class="hash"><strong>Hash:</strong> ${entry.hash}</p>
  </div>`;
    });

    html += `
</body>
</html>`;

    return html;
  }

  /**
   * Export as Markdown
   */
  private exportMarkdown(
    entries: DecisionEntry[],
    options: ExportOptions
  ): string {
    const metadata = this.getMetadata();
    const verification = this.verify();

    let md = `# Agent Audit Trail\n\n`;
    md += `## Chain Metadata\n\n`;
    md += `- **Agent ID**: ${metadata.agentId}\n`;
    md += `- **Total Entries**: ${metadata.totalEntries}\n`;
    md += `- **Verified**: ${verification.valid ? '✅ Yes' : '❌ No'}\n`;
    md += `- **Created**: ${new Date(metadata.createdAt).toISOString()}\n\n`;
    md += `## Decisions\n\n`;

    entries.forEach((entry, index) => {
      md += `### Entry #${index + 1}\n\n`;
      md += `- **ID**: \`${entry.id}\`\n`;
      md += `- **Timestamp**: ${new Date(entry.timestamp).toISOString()}\n`;
      md += `- **Input**: ${entry.input.prompt || 'N/A'}\n`;
      md += `- **Decision**: ${entry.output.decision}\n`;
      md += `- **Execution Time**: ${entry.executionTime}ms\n`;
      if (options.includeReasoning) {
        md += `- **Reasoning Steps**: ${entry.reasoning.steps.length}\n`;
      }
      md += `- **Hash**: \`${entry.hash}\`\n\n`;
    });

    return md;
  }

  /**
   * Close audit trail
   */
  async close(): Promise<void> {
    await this.storage.close();
    this.initialized = false;
  }
}
