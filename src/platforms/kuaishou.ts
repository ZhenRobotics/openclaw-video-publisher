/**
 * 快手平台适配器
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

export class KuaishouPlatform extends BasePlatform {
  private appId: string;
  private appSecret: string;
  private accessToken: string;

  constructor(config: PlatformConfig, credentials: PlatformCredentials) {
    super('kuaishou', config, credentials);
    this.appId = credentials.app_id || '';
    this.appSecret = credentials.app_secret || '';
    this.accessToken = credentials.access_token || '';
  }

  async validate(): Promise<boolean> {
    if (!this.appId || !this.appSecret || !this.accessToken) {
      throw new Error('快手配置不完整');
    }
    return true;
  }

  async upload(
    video: VideoFile,
    metadata: VideoMetadata,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<PublishResult> {
    try {
      const validation = this.validateVideo(video);
      if (!validation.valid) {
        return {
          platform: 'kuaishou',
          status: 'failed',
          error: validation.error,
        };
      }

      // 快手上传逻辑（简化版）
      const formData = new FormData();
      formData.append('video', fs.createReadStream(video.path));
      formData.append('caption', metadata.title);
      formData.append('app_id', this.appId);
      formData.append('access_token', this.accessToken);

      const response = await axios.post(
        `${this.config.api_base}${this.config.upload_endpoint}`,
        formData,
        {
          headers: formData.getHeaders(),
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      return {
        platform: 'kuaishou',
        status: 'success',
        videoId: response.data.photo_id,
        url: `https://www.kuaishou.com/short-video/${response.data.photo_id}`,
        publishedAt: new Date(),
      };
    } catch (error: any) {
      return {
        platform: 'kuaishou',
        status: 'failed',
        error: error.message,
      };
    }
  }

  async getStatus(videoId: string): Promise<PublishResult> {
    return {
      platform: 'kuaishou',
      status: 'success',
      videoId,
      url: `https://www.kuaishou.com/short-video/${videoId}`,
    };
  }

  async refreshToken(): Promise<string> {
    const response = await axios.post(
      `${this.config.api_base}/oauth2/refresh_token`,
      {
        app_id: this.appId,
        app_secret: this.appSecret,
        refresh_token: this.credentials.refresh_token,
        grant_type: 'refresh_token',
      }
    );

    this.accessToken = response.data.access_token;
    return this.accessToken;
  }
}
