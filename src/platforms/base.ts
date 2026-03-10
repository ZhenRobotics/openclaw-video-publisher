/**
 * 平台适配器基类
 */

import {
  VideoFile,
  VideoMetadata,
  PublishResult,
  PlatformConfig,
  PlatformCredentials,
  UploadProgress,
} from '../core/types';

export abstract class BasePlatform {
  protected name: string;
  protected config: PlatformConfig;
  protected credentials: PlatformCredentials;

  constructor(
    name: string,
    config: PlatformConfig,
    credentials: PlatformCredentials
  ) {
    this.name = name;
    this.config = config;
    this.credentials = credentials;
  }

  /**
   * 验证配置和凭证
   */
  abstract validate(): Promise<boolean>;

  /**
   * 上传视频
   */
  abstract upload(
    video: VideoFile,
    metadata: VideoMetadata,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<PublishResult>;

  /**
   * 查询视频状态
   */
  abstract getStatus(videoId: string): Promise<PublishResult>;

  /**
   * 刷新访问令牌
   */
  abstract refreshToken?(): Promise<string>;

  /**
   * 删除视频
   */
  abstract delete?(videoId: string): Promise<boolean>;

  /**
   * 检查视频文件是否符合平台要求
   */
  validateVideo(video: VideoFile): { valid: boolean; error?: string } {
    // 检查文件大小
    if (video.size > this.config.max_file_size) {
      return {
        valid: false,
        error: `文件大小超过限制 ${this.config.max_file_size / 1024 / 1024}MB`,
      };
    }

    // 检查文件格式
    const ext = video.filename.split('.').pop()?.toLowerCase();
    if (ext && !this.config.supported_formats.includes(ext)) {
      return {
        valid: false,
        error: `不支持的文件格式 ${ext}，支持: ${this.config.supported_formats.join(', ')}`,
      };
    }

    // 检查时长
    if (video.duration && video.duration > this.config.max_duration) {
      return {
        valid: false,
        error: `视频时长超过限制 ${this.config.max_duration}秒`,
      };
    }

    return { valid: true };
  }

  /**
   * 获取平台名称
   */
  getName(): string {
    return this.config.name;
  }

  /**
   * 检查平台是否启用
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }
}
