# 快速开始 - OpenClaw Video Publisher

**5 分钟快速上手多平台视频发布**

---

## 📦 安装

### 方式 1: npm 全局安装

```bash
npm install -g openclaw-video-publisher
```

### 方式 2: 克隆项目

```bash
git clone https://github.com/ZhenRobotics/openclaw-video-publisher.git
cd openclaw-video-publisher
npm install
```

---

## ⚙️ 配置

### 1. 复制配置模板

```bash
# 复制平台配置
cp config/platforms.example.json config/platforms.json

# 复制环境变量
cp .env.example .env
```

### 2. 配置平台凭证

编辑 `.env` 文件，填入至少一个平台的 API 凭证：

```bash
# 抖音
DOUYIN_CLIENT_KEY=your-client-key
DOUYIN_CLIENT_SECRET=your-client-secret
DOUYIN_ACCESS_TOKEN=your-access-token

# 快手
KUAISHOU_APP_ID=your-app-id
KUAISHOU_APP_SECRET=your-app-secret
KUAISHOU_ACCESS_TOKEN=your-access-token
```

**获取凭证方法**：
- 抖音：https://open.douyin.com/
- 快手：https://open.kuaishou.com/
- 详细步骤见 [README.md](README.md#获取平台凭证)

---

## 🚀 发布第一个视频

### 单个平台发布

```bash
./publish.sh upload \
  --video my-video.mp4 \
  --title "我的第一个视频" \
  --description "测试发布" \
  --platforms "douyin"
```

### 多平台同时发布

```bash
./publish.sh upload \
  --video my-video.mp4 \
  --title "多平台发布测试" \
  --tags "测试,短视频" \
  --platforms "douyin,kuaishou,bilibili"
```

### 带封面和重试

```bash
./publish.sh upload \
  --video my-video.mp4 \
  --title "带封面的视频" \
  --cover cover.jpg \
  --platforms "douyin,kuaishou" \
  --retry \
  --max-retries 3
```

---

## 📝 常用命令

### 查看可用平台

```bash
./publish.sh platforms
```

输出示例：
```
🌍 可用平台:
  ✅ douyin
  ✅ kuaishou
```

### 查看发布历史

```bash
./publish.sh list
```

### 批量发布

创建配置文件 `my-batch.json`:

```json
{
  "videos": [
    {
      "path": "video1.mp4",
      "title": "视频1",
      "platforms": ["douyin", "kuaishou"]
    },
    {
      "path": "video2.mp4",
      "title": "视频2",
      "platforms": ["bilibili"]
    }
  ]
}
```

执行批量发布：

```bash
./batch-publish.sh my-batch.json
```

---

## 🎯 使用场景

### 场景 1: 自媒体创作者

```bash
# 每天发布一个视频到所有平台
./publish.sh upload \
  --video daily-video.mp4 \
  --title "每日内容" \
  --platforms "douyin,kuaishou,weixin,bilibili"
```

### 场景 2: 企业营销

```bash
# 产品宣传视频，定向投放
./publish.sh upload \
  --video product-ad.mp4 \
  --title "新品上市" \
  --description "限时优惠" \
  --tags "产品,促销,新品" \
  --platforms "douyin,kuaishou"
```

### 场景 3: 内容工作室

```bash
# 为客户批量发布视频
./batch-publish.sh client-videos.json
```

---

## 🔧 故障排查

### 问题 1: 配置文件不存在

```bash
❌ 配置文件不存在: config/platforms.json
💡 提示: cp config/platforms.example.json config/platforms.json
```

**解决方案**：
```bash
cp config/platforms.example.json config/platforms.json
```

### 问题 2: API 凭证无效

```
❌ douyin: 平台验证失败: Invalid access_token
```

**解决方案**：
1. 检查 `.env` 文件中的凭证是否正确
2. 访问平台开放平台刷新 token
3. 重新获取 access_token

### 问题 3: 视频上传失败

```
❌ douyin: 文件大小超过限制 256MB
```

**解决方案**：
- 压缩视频文件
- 检查平台文件大小限制（见 `config/platforms.json`）

---

## 📊 配置说明

### 平台配置 (config/platforms.json)

每个平台的配置包括：

```json
{
  "douyin": {
    "enabled": true,              // 是否启用
    "name": "抖音",               // 平台名称
    "api_base": "...",            // API 地址
    "max_file_size": 268435456,   // 最大文件大小 (256MB)
    "supported_formats": ["mp4"], // 支持的格式
    "max_duration": 300,          // 最大时长（秒）
    "rate_limit": {               // 频率限制
      "requests_per_hour": 100
    }
  }
}
```

### 环境变量 (.env)

```bash
# 默认平台
DEFAULT_PLATFORMS=douyin,kuaishou

# 自动重试
AUTO_RETRY=true
MAX_RETRY=3

# 日志级别
LOG_LEVEL=info
```

---

## 📚 更多资源

- **完整文档**: [README.md](README.md)
- **API 文档**: [docs/API.md](docs/API.md)
- **平台指南**: [docs/PLATFORMS.md](docs/PLATFORMS.md)
- **问题反馈**: https://github.com/ZhenRobotics/openclaw-video-publisher/issues

---

## 🎉 下一步

1. ✅ 配置完成，开始发布视频
2. 📖 阅读 [README.md](README.md) 了解更多功能
3. 🔧 添加更多平台凭证
4. 📊 查看发布历史和统计
5. 🚀 自动化你的视频发布流程

---

**就是这么简单！开始用 AI 发布你的视频吧！** ✨🚀
