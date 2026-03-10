/**
 * OpenClaw Video Publisher - 核心类型定义
 */

export interface VideoFile {
  path: string;
  filename: string;
  size: number;
  duration?: number;
  format?: string;
}

export interface VideoMetadata {
  title: string;
  description?: string;
  tags?: string[];
  cover?: string;
  category?: string;
  privacy?: 'public' | 'private' | 'unlisted';
  scheduleTime?: Date;
}

export interface PlatformConfig {
  enabled: boolean;
  name: string;
  api_base: string;
  upload_endpoint: string;
  max_file_size: number;
  supported_formats: string[];
  max_duration: number;
  rate_limit: {
    requests_per_hour: number;
    requests_per_day: number;
  };
}

export interface PlatformCredentials {
  [key: string]: string | undefined;
}

export interface PublishOptions {
  video: VideoFile;
  metadata: VideoMetadata;
  platforms: string[];
  retry?: boolean;
  maxRetries?: number;
}

export interface PublishResult {
  platform: string;
  status: 'success' | 'failed' | 'pending';
  videoId?: string;
  url?: string;
  error?: string;
  retryCount?: number;
  publishedAt?: Date;
}

export interface PublishHistory {
  [videoPath: string]: {
    title: string;
    uploadedAt: string;
    platforms: {
      [platform: string]: PublishResult;
    };
  };
}

export interface UploadProgress {
  platform: string;
  percent: number;
  uploaded: number;
  total: number;
  status: string;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}
