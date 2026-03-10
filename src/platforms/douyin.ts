/**
 * 抖音平台适配器
 */

import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import { BasePlatform } from './base';
import {
  VideoFile,
  VideoMetadata,
  PublishResult,
  PlatformConfig,
  PlatformCredentials,
  UploadProgress,
} from '../core/types';

export class DouyinPlatform extends BasePlatform {
  private clientKey: string;
  private clientSecret: string;
  private accessToken: string;

  constructor(config: PlatformConfig, credentials: PlatformCredentials) {
    super('douyin', config, credentials);
    this.clientKey = credentials.client_key || '';
    this.clientSecret = credentials.client_secret || '';
    this.accessToken = credentials.access_token || '';
  }

  /**
   * 验证配置
   */
  async validate(): Promise<boolean> {
    if (!this.clientKey || !this.clientSecret || !this.accessToken) {
      throw new Error('抖音配置不完整：缺少 client_key, client_secret 或 access_token');
    }

    try {
      // 测试 token 有效性
      const response = await axios.get(`${this.config.api_base}/oauth/userinfo`, {
        params: {
          access_token: this.accessToken,
          open_id: 'test',
        },
      });
      return response.status === 200;
    } catch (error: any) {
      throw new Error(`抖音凭证验证失败: ${error.message}`);
    }
  }

  /**
   * 上传视频
   */
  async upload(
    video: VideoFile,
    metadata: VideoMetadata,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<PublishResult> {
    try {
      // 1. 验证视频文件
      const validation = this.validateVideo(video);
      if (!validation.valid) {
        return {
          platform: 'douyin',
          status: 'failed',
          error: validation.error,
        };
      }

      // 2. 创建上传任务
      const uploadUrl = await this.createUploadTask(video);

      // 3. 上传视频文件
      await this.uploadVideoFile(video, uploadUrl, onProgress);

      // 4. 提交视频信息
      const result = await this.publishVideo(video, metadata);

      return {
        platform: 'douyin',
        status: 'success',
        videoId: result.item_id,
        url: `https://www.douyin.com/video/${result.item_id}`,
        publishedAt: new Date(),
      };
    } catch (error: any) {
      return {
        platform: 'douyin',
        status: 'failed',
        error: error.message,
      };
    }
  }

  /**
   * 创建上传任务
   */
  private async createUploadTask(video: VideoFile): Promise<string> {
    const response = await axios.post(
      `${this.config.api_base}/oauth/video/upload/task/init`,
      {
        access_token: this.accessToken,
      }
    );

    if (response.data.data?.upload_url) {
      return response.data.data.upload_url;
    }

    throw new Error('创建上传任务失败');
  }

  /**
   * 上传视频文件
   */
  private async uploadVideoFile(
    video: VideoFile,
    uploadUrl: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<void> {
    const formData = new FormData();
    formData.append('video', fs.createReadStream(video.path));

    await axios.post(uploadUrl, formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          onProgress({
            platform: 'douyin',
            percent: Math.round((progressEvent.loaded * 100) / progressEvent.total),
            uploaded: progressEvent.loaded,
            total: progressEvent.total,
            status: 'uploading',
          });
        }
      },
    });
  }

  /**
   * 发布视频
   */
  private async publishVideo(
    video: VideoFile,
    metadata: VideoMetadata
  ): Promise<any> {
    const response = await axios.post(
      `${this.config.api_base}/oauth/video/create`,
      {
        access_token: this.accessToken,
        video_id: video.filename,
        text: metadata.title,
        micro_app_id: this.clientKey,
        cover_tsp: 0,
      }
    );

    if (response.data.data?.item_id) {
      return response.data.data;
    }

    throw new Error('发布视频失败');
  }

  /**
   * 查询视频状态
   */
  async getStatus(videoId: string): Promise<PublishResult> {
    try {
      const response = await axios.get(
        `${this.config.api_base}/oauth/video/data`,
        {
          params: {
            access_token: this.accessToken,
            item_ids: videoId,
          },
        }
      );

      const status = response.data.data?.list?.[0];
      if (status) {
        return {
          platform: 'douyin',
          status: 'success',
          videoId: videoId,
          url: `https://www.douyin.com/video/${videoId}`,
        };
      }

      return {
        platform: 'douyin',
        status: 'failed',
        error: '视频不存在',
      };
    } catch (error: any) {
      return {
        platform: 'douyin',
        status: 'failed',
        error: error.message,
      };
    }
  }

  /**
   * 刷新访问令牌
   */
  async refreshToken(): Promise<string> {
    const response = await axios.post(
      `${this.config.api_base}/oauth/refresh_token`,
      {
        client_key: this.clientKey,
        grant_type: 'refresh_token',
        refresh_token: this.credentials.refresh_token,
      }
    );

    if (response.data.data?.access_token) {
      this.accessToken = response.data.data.access_token;
      return this.accessToken;
    }

    throw new Error('刷新 token 失败');
  }
}
