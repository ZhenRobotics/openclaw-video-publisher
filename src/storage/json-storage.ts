/**
 * JSON File Storage Backend
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  StorageBackend,
  DecisionEntry,
  AuditChain,
  QueryOptions,
} from '../core/types';

export class JSONStorage implements StorageBackend {
  private storagePath: string;
  private chainsPath: string;
  private metadataPath: string;

  constructor(storagePath: string) {
    this.storagePath = storagePath;
    this.chainsPath = path.join(storagePath, 'chains');
    this.metadataPath = path.join(storagePath, 'metadata.json');
  }

  /**
   * Initialize storage directories
   */
  async initialize(): Promise<void> {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
    if (!fs.existsSync(this.chainsPath)) {
      fs.mkdirSync(this.chainsPath, { recursive: true });
    }
    if (!fs.existsSync(this.metadataPath)) {
      fs.writeFileSync(this.metadataPath, JSON.stringify({}, null, 2));
    }
  }

  /**
   * Save entry to chain file
   */
  async saveEntry(entry: DecisionEntry): Promise<void> {
    // Get chain file path
    const chainFile = this.getChainFilePath(entry.agentId);

    // Load existing entries
    let entries: DecisionEntry[] = [];
    if (fs.existsSync(chainFile)) {
      const data = fs.readFileSync(chainFile, 'utf-8');
      entries = JSON.parse(data);
    }

    // Append new entry
    entries.push(entry);

    // Save back
    fs.writeFileSync(chainFile, JSON.stringify(entries, null, 2));

    // Update metadata
    await this.updateChainMetadata(entry.agentId, entries);
  }

  /**
   * Get single entry by ID
   */
  async getEntry(id: string): Promise<DecisionEntry | null> {
    // Search all chain files
    const chainFiles = fs.readdirSync(this.chainsPath);

    for (const file of chainFiles) {
      const filePath = path.join(this.chainsPath, file);
      const data = fs.readFileSync(filePath, 'utf-8');
      const entries: DecisionEntry[] = JSON.parse(data);

      const entry = entries.find((e) => e.id === id);
      if (entry) {
        return entry;
      }
    }

    return null;
  }

  /**
   * Get all entries for a chain
   */
  async getChain(agentId: string): Promise<DecisionEntry[]> {
    const chainFile = this.getChainFilePath(agentId);

    if (!fs.existsSync(chainFile)) {
      return [];
    }

    const data = fs.readFileSync(chainFile, 'utf-8');
    return JSON.parse(data);
  }

  /**
   * Query entries with filters
   */
  async queryEntries(options: QueryOptions): Promise<DecisionEntry[]> {
    let entries: DecisionEntry[] = [];

    // Load entries from specified agent or all agents
    if (options.agentId) {
      entries = await this.getChain(options.agentId);
    } else {
      // Load all chains
      const chainFiles = fs.readdirSync(this.chainsPath);
      for (const file of chainFiles) {
        const filePath = path.join(this.chainsPath, file);
        const data = fs.readFileSync(filePath, 'utf-8');
        entries.push(...JSON.parse(data));
      }
    }

    // Apply filters
    let filtered = entries;

    if (options.startTime) {
      filtered = filtered.filter((e) => e.timestamp >= options.startTime!);
    }

    if (options.endTime) {
      filtered = filtered.filter((e) => e.timestamp <= options.endTime!);
    }

    // Sort by timestamp
    filtered.sort((a, b) => a.timestamp - b.timestamp);

    // Apply pagination
    if (options.offset) {
      filtered = filtered.slice(options.offset);
    }

    if (options.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  /**
   * Get chain metadata
   */
  async getChainMetadata(agentId: string): Promise<AuditChain | null> {
    const metadata = this.loadMetadata();
    return metadata[agentId] || null;
  }

  /**
   * Close storage (no-op for JSON)
   */
  async close(): Promise<void> {
    // Nothing to close for file storage
  }

  /**
   * Get chain file path
   */
  private getChainFilePath(agentId: string): string {
    return path.join(this.chainsPath, `${agentId}.json`);
  }

  /**
   * Load metadata file
   */
  private loadMetadata(): Record<string, AuditChain> {
    if (!fs.existsSync(this.metadataPath)) {
      return {};
    }
    const data = fs.readFileSync(this.metadataPath, 'utf-8');
    return JSON.parse(data);
  }

  /**
   * Update chain metadata
   */
  private async updateChainMetadata(
    agentId: string,
    entries: DecisionEntry[]
  ): Promise<void> {
    const metadata = this.loadMetadata();

    const chainMetadata: AuditChain = {
      chainId: `chain_${agentId}`,
      agentId,
      createdAt: entries.length > 0 ? entries[0].timestamp : Date.now(),
      lastUpdatedAt:
        entries.length > 0
          ? entries[entries.length - 1].timestamp
          : Date.now(),
      totalEntries: entries.length,
      verified: true, // Can run verification here
      genesisHash: '', // Would need to track this
      latestHash: entries.length > 0 ? entries[entries.length - 1].hash : '',
    };

    metadata[agentId] = chainMetadata;

    fs.writeFileSync(this.metadataPath, JSON.stringify(metadata, null, 2));
  }

  /**
   * Get all chain IDs
   */
  async getAllChainIds(): Promise<string[]> {
    const metadata = this.loadMetadata();
    return Object.keys(metadata);
  }
}
