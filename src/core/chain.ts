/**
 * Audit Chain - Cryptographic Decision Trail
 */

import * as crypto from 'crypto';
import {
  DecisionEntry,
  AuditChain,
  ReasoningStep,
  VerificationResult,
  AuditConfig,
} from './types';

export class AuditTrailChain {
  private chainId: string;
  private agentId: string;
  private agentVersion: string;
  private entries: DecisionEntry[] = [];
  private genesisHash: string;

  constructor(config: AuditConfig) {
    this.agentId = config.agentId;
    this.agentVersion = config.agentVersion;
    this.chainId = this.generateChainId();
    this.genesisHash = this.createGenesisHash();
  }

  /**
   * Generate unique chain ID
   */
  private generateChainId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `chain_${this.agentId}_${timestamp}_${random}`;
  }

  /**
   * Create genesis hash (hash of chain metadata)
   */
  private createGenesisHash(): string {
    const genesisData = {
      chainId: this.chainId,
      agentId: this.agentId,
      agentVersion: this.agentVersion,
      createdAt: Date.now(),
    };
    return this.hashData(genesisData);
  }

  /**
   * Hash data using SHA-256
   */
  private hashData(data: any): string {
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(data, null, 0));
    return hash.digest('hex');
  }

  /**
   * Create a new decision entry
   */
  createEntry(
    input: DecisionEntry['input'],
    reasoning: DecisionEntry['reasoning'],
    output: DecisionEntry['output'],
    executionTime: number,
    cost?: DecisionEntry['cost']
  ): DecisionEntry {
    const timestamp = Date.now();
    const id = this.generateEntryId(timestamp);

    // Get previous hash
    const previousHash =
      this.entries.length > 0
        ? this.entries[this.entries.length - 1].hash
        : this.genesisHash;

    // Create entry without hash
    const entryData = {
      id,
      timestamp,
      agentId: this.agentId,
      agentVersion: this.agentVersion,
      input,
      reasoning,
      output,
      executionTime,
      cost,
      previousHash,
    };

    // Calculate hash
    const hash = this.hashData(entryData);

    // Create final entry
    const entry: DecisionEntry = {
      ...entryData,
      hash,
    };

    return entry;
  }

  /**
   * Generate unique entry ID
   */
  private generateEntryId(timestamp: number): string {
    const random = Math.random().toString(36).substring(2, 9);
    return `entry_${timestamp}_${random}`;
  }

  /**
   * Add entry to chain
   */
  addEntry(entry: DecisionEntry): void {
    // Verify hash is correct
    const calculatedHash = this.calculateEntryHash(entry);
    if (calculatedHash !== entry.hash) {
      throw new Error('Entry hash mismatch - possible tampering detected');
    }

    // Verify chain link
    if (this.entries.length > 0) {
      const expectedPrevHash = this.entries[this.entries.length - 1].hash;
      if (entry.previousHash !== expectedPrevHash) {
        throw new Error('Chain broken - previous hash mismatch');
      }
    } else {
      // First entry should link to genesis
      if (entry.previousHash !== this.genesisHash) {
        throw new Error('First entry must link to genesis hash');
      }
    }

    this.entries.push(entry);
  }

  /**
   * Calculate hash for an entry
   */
  private calculateEntryHash(entry: DecisionEntry): string {
    const { hash, signature, ...entryWithoutHash } = entry;
    return this.hashData(entryWithoutHash);
  }

  /**
   * Verify entire chain integrity
   */
  verify(): VerificationResult {
    const errors: string[] = [];
    const brokenLinks: number[] = [];
    let verifiedEntries = 0;

    // Check each entry
    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];

      // Verify hash
      const calculatedHash = this.calculateEntryHash(entry);
      if (calculatedHash !== entry.hash) {
        errors.push(`Entry ${i} (${entry.id}): Hash mismatch`);
        brokenLinks.push(i);
        continue;
      }

      // Verify chain link
      const expectedPrevHash =
        i === 0 ? this.genesisHash : this.entries[i - 1].hash;
      if (entry.previousHash !== expectedPrevHash) {
        errors.push(`Entry ${i} (${entry.id}): Chain link broken`);
        brokenLinks.push(i);
        continue;
      }

      verifiedEntries++;
    }

    return {
      valid: brokenLinks.length === 0,
      chainId: this.chainId,
      totalEntries: this.entries.length,
      verifiedEntries,
      brokenLinks,
      errors,
      verifiedAt: Date.now(),
    };
  }

  /**
   * Get chain metadata
   */
  getMetadata(): AuditChain {
    return {
      chainId: this.chainId,
      agentId: this.agentId,
      createdAt: this.entries.length > 0 ? this.entries[0].timestamp : Date.now(),
      lastUpdatedAt:
        this.entries.length > 0
          ? this.entries[this.entries.length - 1].timestamp
          : Date.now(),
      totalEntries: this.entries.length,
      verified: this.verify().valid,
      genesisHash: this.genesisHash,
      latestHash:
        this.entries.length > 0
          ? this.entries[this.entries.length - 1].hash
          : this.genesisHash,
    };
  }

  /**
   * Get all entries
   */
  getEntries(): DecisionEntry[] {
    return [...this.entries];
  }

  /**
   * Get entry by ID
   */
  getEntry(id: string): DecisionEntry | undefined {
    return this.entries.find((e) => e.id === id);
  }

  /**
   * Get chain ID
   */
  getChainId(): string {
    return this.chainId;
  }

  /**
   * Load existing entries into chain
   */
  loadEntries(entries: DecisionEntry[]): void {
    this.entries = [];

    // If loading entries, set genesis hash from first entry's previous hash
    if (entries.length > 0) {
      this.genesisHash = entries[0].previousHash;
    }

    for (const entry of entries) {
      this.addEntry(entry);
    }
  }
}
