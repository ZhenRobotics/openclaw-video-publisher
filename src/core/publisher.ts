/**
 * 核心发布管理器
 */

import * as fs from 'fs';
import * as path from 'path';
import { BasePlatform } from '../platforms/base';
import { DouyinPlatform } from '../platforms/douyin';
import { KuaishouPlatform } from '../platforms/kuaishou';
import {
  PublishOptions,
  PublishResult,
  PublishHistory,
  PlatformConfig,
  PlatformCredentials,
} from './types';

export class VideoPublisher {
  private platforms: Map<string, BasePlatform> = new Map();
  private historyPath: string;
  private history: PublishHistory = {};

  constructor(
    platformsConfig: Record<string, PlatformConfig>,
    credentials: Record<string, PlatformCredentials>,
    historyPath: string = './data/publish-history.json'
  ) {
    this.historyPath = historyPath;
    this.loadHistory();
    this.initializePlatforms(platformsConfig, credentials);
  }

  /**
   * 初始化平台适配器
   */
  private initializePlatforms(
    platformsConfig: Record<string, PlatformConfig>,
    credentials: Record<string, PlatformCredentials>
  ): void {
    // 抖音
    if (platformsConfig.douyin?.enabled && credentials.douyin) {
      this.platforms.set(
        'douyin',
        new DouyinPlatform(platformsConfig.douyin, credentials.douyin)
      );
    }

    // 快手
    if (platformsConfig.kuaishou?.enabled && credentials.kuaishou) {
      this.platforms.set(
        'kuaishou',
        new KuaishouPlatform(platformsConfig.kuaishou, credentials.kuaishou)
      );
    }

    // TODO: 添加更多平台
  }

  /**
   * 发布视频到指定平台
   */
  async publish(options: PublishOptions): Promise<PublishResult[]> {
    const results: PublishResult[] = [];

    for (const platformName of options.platforms) {
      const platform = this.platforms.get(platformName);

      if (!platform) {
        results.push({
          platform: platformName,
          status: 'failed',
          error: `平台 ${platformName} 未配置或未启用`,
        });
        continue;
      }

      // 验证平台配置
      try {
        await platform.validate();
      } catch (error: any) {
        results.push({
          platform: platformName,
          status: 'failed',
          error: `平台验证失败: ${error.message}`,
        });
        continue;
      }

      // 上传视频
      let result = await platform.upload(options.video, options.metadata);

      // 重试逻辑
      if (
        result.status === 'failed' &&
        options.retry &&
        options.maxRetries &&
        options.maxRetries > 0
      ) {
        for (let i = 0; i < options.maxRetries; i++) {
          console.log(`重试 ${platformName} (${i + 1}/${options.maxRetries})...`);
          await this.sleep(5000); // 等待 5 秒
          result = await platform.upload(options.video, options.metadata);

          if (result.status === 'success') {
            result.retryCount = i + 1;
            break;
          }
        }
      }

      results.push(result);
    }

    // 保存发布记录
    this.saveHistory(options.video.path, options.metadata.title, results);

    return results;
  }

  /**
   * 获取发布历史
   */
  getHistory(videoPath?: string): PublishHistory | any {
    if (videoPath) {
      return this.history[videoPath];
    }
    return this.history;
  }

  /**
   * 加载发布历史
   */
  private loadHistory(): void {
    try {
      if (fs.existsSync(this.historyPath)) {
        const data = fs.readFileSync(this.historyPath, 'utf-8');
        this.history = JSON.parse(data);
      }
    } catch (error) {
      console.warn('无法加载发布历史，将创建新的历史记录');
      this.history = {};
    }
  }

  /**
   * 保存发布历史
   */
  private saveHistory(
    videoPath: string,
    title: string,
    results: PublishResult[]
  ): void {
    if (!this.history[videoPath]) {
      this.history[videoPath] = {
        title,
        uploadedAt: new Date().toISOString(),
        platforms: {},
      };
    }

    results.forEach((result) => {
      this.history[videoPath].platforms[result.platform] = result;
    });

    // 确保目录存在
    const dir = path.dirname(this.historyPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(this.historyPath, JSON.stringify(this.history, null, 2));
  }

  /**
   * 获取可用平台列表
   */
  getAvailablePlatforms(): string[] {
    return Array.from(this.platforms.keys());
  }

  /**
   * 睡眠函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
