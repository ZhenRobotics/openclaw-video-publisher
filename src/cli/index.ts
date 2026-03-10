#!/usr/bin/env node

/**
 * OpenClaw Video Publisher - CLI 入口
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { VideoPublisher } from '../core/publisher';
import { VideoFile, VideoMetadata, PublishOptions } from '../core/types';

// 加载环境变量
dotenv.config();

const program = new Command();

program
  .name('video-publish')
  .description('OpenClaw Video Publisher - 多平台视频发布工具')
  .version('1.0.0');

/**
 * upload 命令 - 上传视频
 */
program
  .command('upload')
  .description('上传视频到指定平台')
  .requiredOption('-v, --video <path>', '视频文件路径')
  .requiredOption('-t, --title <title>', '视频标题')
  .option('-d, --description <desc>', '视频描述')
  .option('--tags <tags>', '标签（逗号分隔）')
  .option('-c, --cover <path>', '封面图片路径')
  .option(
    '-p, --platforms <platforms>',
    '目标平台（逗号分隔）',
    process.env.DEFAULT_PLATFORMS || 'douyin,kuaishou'
  )
  .option('--retry', '失败时自动重试', process.env.AUTO_RETRY === 'true')
  .option(
    '--max-retries <count>',
    '最大重试次数',
    process.env.MAX_RETRY || '3'
  )
  .action(async (options) => {
    try {
      // 读取配置
      const platformsConfig = loadPlatformsConfig();
      const credentials = loadCredentials();

      // 创建发布器
      const publisher = new VideoPublisher(
        platformsConfig,
        credentials,
        process.env.PUBLISH_HISTORY_PATH
      );

      // 准备视频文件信息
      const videoFile: VideoFile = {
        path: options.video,
        filename: path.basename(options.video),
        size: fs.statSync(options.video).size,
      };

      // 准备元数据
      const metadata: VideoMetadata = {
        title: options.title,
        description: options.description,
        tags: options.tags ? options.tags.split(',') : [],
        cover: options.cover,
      };

      // 准备发布选项
      const publishOptions: PublishOptions = {
        video: videoFile,
        metadata,
        platforms: options.platforms.split(','),
        retry: options.retry,
        maxRetries: parseInt(options.maxRetries),
      };

      console.log('\n🚀 开始发布视频...\n');
      console.log(`📹 视频: ${videoFile.filename}`);
      console.log(`📝 标题: ${metadata.title}`);
      console.log(`🎯 平台: ${publishOptions.platforms.join(', ')}\n`);

      // 执行发布
      const results = await publisher.publish(publishOptions);

      // 显示结果
      console.log('\n📊 发布结果:\n');
      results.forEach((result) => {
        const status = result.status === 'success' ? '✅' : '❌';
        console.log(`${status} ${result.platform}:`);
        if (result.status === 'success') {
          console.log(`   URL: ${result.url}`);
          console.log(`   视频ID: ${result.videoId}`);
        } else {
          console.log(`   错误: ${result.error}`);
        }
        console.log('');
      });

      const successCount = results.filter((r) => r.status === 'success').length;
      console.log(`\n✨ 成功: ${successCount}/${results.length}\n`);
    } catch (error: any) {
      console.error(`\n❌ 错误: ${error.message}\n`);
      process.exit(1);
    }
  });

/**
 * list 命令 - 查看发布历史
 */
program
  .command('list')
  .description('查看发布历史')
  .action(() => {
    try {
      const platformsConfig = loadPlatformsConfig();
      const credentials = loadCredentials();
      const publisher = new VideoPublisher(
        platformsConfig,
        credentials,
        process.env.PUBLISH_HISTORY_PATH
      );

      const history = publisher.getHistory();
      console.log('\n📜 发布历史:\n');
      console.log(JSON.stringify(history, null, 2));
    } catch (error: any) {
      console.error(`\n❌ 错误: ${error.message}\n`);
      process.exit(1);
    }
  });

/**
 * platforms 命令 - 查看可用平台
 */
program
  .command('platforms')
  .description('查看可用平台')
  .action(() => {
    try {
      const platformsConfig = loadPlatformsConfig();
      const credentials = loadCredentials();
      const publisher = new VideoPublisher(
        platformsConfig,
        credentials
      );

      const platforms = publisher.getAvailablePlatforms();
      console.log('\n🌍 可用平台:\n');
      platforms.forEach((platform) => {
        console.log(`  ✅ ${platform}`);
      });
      console.log('');
    } catch (error: any) {
      console.error(`\n❌ 错误: ${error.message}\n`);
      process.exit(1);
    }
  });

/**
 * 加载平台配置
 */
function loadPlatformsConfig(): any {
  const configPath = path.join(process.cwd(), 'config', 'platforms.json');
  if (!fs.existsSync(configPath)) {
    console.error('❌ 配置文件不存在: config/platforms.json');
    console.log('💡 提示: cp config/platforms.example.json config/platforms.json');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

/**
 * 加载平台凭证
 */
function loadCredentials(): any {
  return {
    douyin: {
      client_key: process.env.DOUYIN_CLIENT_KEY,
      client_secret: process.env.DOUYIN_CLIENT_SECRET,
      access_token: process.env.DOUYIN_ACCESS_TOKEN,
    },
    kuaishou: {
      app_id: process.env.KUAISHOU_APP_ID,
      app_secret: process.env.KUAISHOU_APP_SECRET,
      access_token: process.env.KUAISHOU_ACCESS_TOKEN,
    },
    // TODO: 添加更多平台凭证
  };
}

program.parse();
