/**
 * Agent Audit Trail - Main Export
 */

export { AgentAuditTrail } from './core/audit-trail';
export { AuditTrailChain } from './core/chain';
export { JSONStorage } from './storage/json-storage';

export type {
  DecisionEntry,
  ReasoningStep,
  Alternative,
  AuditChain,
  QueryOptions,
  VerificationResult,
  ExportFormat,
  ExportOptions,
  StorageBackend,
  AuditConfig,
  Logger,
} from './core/types';
