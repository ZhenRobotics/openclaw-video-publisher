/**
 * Agent Audit Trail - Core Type Definitions
 * Immutable Black Box for AI Decisions
 */

/**
 * Single decision entry in the audit trail
 */
export interface DecisionEntry {
  id: string;
  timestamp: number;
  agentId: string;
  agentVersion: string;

  // Decision context
  input: {
    prompt?: string;
    context?: Record<string, any>;
    parameters?: Record<string, any>;
  };

  // Decision process
  reasoning: {
    steps: ReasoningStep[];
    model?: string;
    temperature?: number;
    maxTokens?: number;
  };

  // Decision output
  output: {
    decision: string;
    confidence?: number;
    alternatives?: Alternative[];
    metadata?: Record<string, any>;
  };

  // Audit metadata
  executionTime: number;
  cost?: {
    inputTokens: number;
    outputTokens: number;
    totalCost: number;
  };

  // Cryptographic chain
  previousHash: string;
  hash: string;
  signature?: string;
}

/**
 * Individual reasoning step
 */
export interface ReasoningStep {
  step: number;
  action: string;
  thought: string;
  observation?: string;
  timestamp: number;
}

/**
 * Alternative decision considered
 */
export interface Alternative {
  decision: string;
  confidence: number;
  reasoning: string;
}

/**
 * Audit chain metadata
 */
export interface AuditChain {
  chainId: string;
  agentId: string;
  createdAt: number;
  lastUpdatedAt: number;
  totalEntries: number;
  verified: boolean;
  genesisHash: string;
  latestHash: string;
}

/**
 * Query options for retrieving entries
 */
export interface QueryOptions {
  agentId?: string;
  chainId?: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
  offset?: number;
  includeVerification?: boolean;
}

/**
 * Verification result
 */
export interface VerificationResult {
  valid: boolean;
  chainId: string;
  totalEntries: number;
  verifiedEntries: number;
  brokenLinks: number[];
  errors: string[];
  verifiedAt: number;
}

/**
 * Export format options
 */
export type ExportFormat = 'json' | 'csv' | 'html' | 'markdown';

/**
 * Export options
 */
export interface ExportOptions {
  format: ExportFormat;
  includeMetadata: boolean;
  includeReasoning: boolean;
  compressOutput?: boolean;
}

/**
 * Storage backend interface
 */
export interface StorageBackend {
  initialize(): Promise<void>;
  saveEntry(entry: DecisionEntry): Promise<void>;
  getEntry(id: string): Promise<DecisionEntry | null>;
  getChain(chainId: string): Promise<DecisionEntry[]>;
  queryEntries(options: QueryOptions): Promise<DecisionEntry[]>;
  getChainMetadata(chainId: string): Promise<AuditChain | null>;
  close(): Promise<void>;
}

/**
 * Configuration
 */
export interface AuditConfig {
  agentId: string;
  agentVersion: string;
  storageType: 'json' | 'sqlite' | 'postgres';
  storagePath: string;
  enableSignatures: boolean;
  enableCompression: boolean;
  autoVerify: boolean;
}

/**
 * Logger interface
 */
export interface Logger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}
