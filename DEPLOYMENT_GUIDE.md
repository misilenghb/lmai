# 🚀 云平台部署指南

解决 "Build error at stage 2" 错误的完整指南

## 🔍 常见的 Build error at stage 2 原因

### 1. TypeScript 类型错误
- **问题**: 严格的类型检查导致构建失败
- **解决方案**: 修复所有 TypeScript 类型错误

### 2. 依赖包问题
- **问题**: 某些包在云环境中无法正确安装或构建
- **解决方案**: 配置 `serverExternalPackages` 和优化依赖

### 3. 环境变量缺失
- **问题**: 构建时缺少必要的环境变量
- **解决方案**: 正确配置所有环境变量

### 4. Next.js 配置问题
- **问题**: 配置不适合云平台部署
- **解决方案**: 使用优化的配置

## 🛠️ 解决方案

### 步骤 1: 修复 TypeScript 错误

```bash
# 检查 TypeScript 错误
npx tsc --noEmit

# 修复所有类型错误
```

### 步骤 2: 优化 Next.js 配置

使用以下优化的 `next.config.ts`:

```typescript
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // 输出配置 - 适用于云平台部署
  output: 'standalone',
  
  // 配置服务器外部包
  serverExternalPackages: [
    '@genkit-ai/googleai', 
    '@genkit-ai/next', 
    'sharp',
    'canvas',
    'jsdom'
  ],
  
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizePackageImports: ['lucide-react'],
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pollinations.ai',
      },
      {
        protocol: 'https',
        hostname: 'image.pollinations.ai',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      config.externals = [
        ...config.externals, 
        'canvas', 
        'jsdom', 
        'sharp'
      ];
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
};

export default nextConfig;
```

### 步骤 3: 配置环境变量

在云平台中设置以下环境变量:

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI 配置
POLLINATIONS_API_TOKEN=your_pollinations_token
POLLINATIONS_TEXT_MODEL=openai
POLLINATIONS_IMAGE_MODEL=flux

# 构建配置
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production
```

### 步骤 4: 优化 package.json

确保 `package.json` 配置正确:

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

**注意**: 移除 `"type": "module"` 如果存在，因为它可能导致构建问题。

### 步骤 5: 使用 Vercel 配置

创建 `vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

## 🔧 特定平台解决方案

### Vercel 部署
1. 确保环境变量正确配置
2. 使用 `output: 'standalone'` 配置
3. 设置正确的构建命令

### Netlify 部署
1. 使用 `npm run build` 作为构建命令
2. 设置发布目录为 `.next`
3. 配置环境变量

### Railway/Render 部署
1. 使用 Dockerfile 进行容器化部署
2. 确保 Node.js 版本 >= 18
3. 配置健康检查

## 🚨 常见错误和解决方案

### 错误 1: "Module not found"
```bash
# 解决方案: 清理缓存并重新安装
rm -rf node_modules .next
npm install
npm run build
```

### 错误 2: "Type error"
```bash
# 解决方案: 修复 TypeScript 错误
npx tsc --noEmit
# 修复所有显示的错误
```

### 错误 3: "Sharp 安装失败"
```javascript
// 在 next.config.ts 中添加:
serverExternalPackages: ['sharp']
```

### 错误 4: "Canvas 相关错误"
```javascript
// 在 webpack 配置中添加:
if (isServer) {
  config.externals = [...config.externals, 'canvas'];
}
```

## ✅ 部署前检查清单

- [ ] 所有 TypeScript 错误已修复
- [ ] 环境变量已正确配置
- [ ] Next.js 配置已优化
- [ ] 本地构建成功 (`npm run build`)
- [ ] 依赖包版本兼容
- [ ] 移除了 `"type": "module"`
- [ ] 配置了正确的 Node.js 版本

## 🎯 推荐的部署流程

1. **本地测试**:
   ```bash
   npm run build
   npm start
   ```

2. **提交代码**:
   ```bash
   git add .
   git commit -m "Fix build issues for deployment"
   git push origin main
   ```

3. **云平台部署**:
   - 配置环境变量
   - 触发重新部署
   - 监控构建日志

4. **验证部署**:
   - 检查应用是否正常运行
   - 测试关键功能
   - 检查数据库连接

## 📞 获取帮助

如果仍然遇到问题:

1. 检查云平台的构建日志
2. 确认 Node.js 版本兼容性
3. 验证所有环境变量
4. 尝试简化配置后重新部署

记住: 大多数 "Build error at stage 2" 错误都是由于 TypeScript 类型错误或依赖包配置问题导致的。按照上述步骤逐一排查，通常可以解决问题。
