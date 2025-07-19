# Cloudflare Pages 部署设置

## 构建配置

在 Cloudflare Pages 控制台中设置以下配置：

### 构建设置

**选项 1: 使用 Next.js 构建 (推荐)**
- **Framework preset**: Next.js (Static HTML Export)
- **Build command**: `npm run build:cloudflare`
- **Build output directory**: `out`
- **Root directory**: `/` (项目根目录)

**选项 2: 使用 wrangler 部署**
- **Framework preset**: None
- **Build command**: `npm run deploy:cloudflare`
- **Build output directory**: `out`
- **Root directory**: `/` (项目根目录)

### 环境变量
```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Node.js 版本
- **Node.js version**: `18` 或 `20`

## 重要说明

1. **不要使用 wrangler deploy**: Cloudflare Pages 使用 Git 集成自动部署
2. **静态导出**: 项目配置为静态导出模式，不支持服务器端 API 路由
3. **客户端 API**: 使用 `src/services/clientApiService.ts` 替代服务器端 API
4. **数据库**: 通过 Supabase 客户端直接连接

## 部署流程

1. 推送代码到 GitHub
2. Cloudflare Pages 自动检测更改
3. 执行构建命令 `npm run build:cloudflare`
4. 输出静态文件到 `out` 目录
5. 部署到全球 CDN

## 故障排除

如果构建失败，检查：
- 构建命令是否正确
- 输出目录是否为 `out`
- 环境变量是否设置
- Node.js 版本是否兼容
