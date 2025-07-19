# 🚀 Cloudflare Pages 环境变量配置指南

## 📋 **必需的环境变量**

在 Cloudflare Pages 中配置以下环境变量以确保数据库连接正常：

### 🔗 **Supabase 数据库连接**

```bash
# 必需 - Supabase 项目 URL
NEXT_PUBLIC_SUPABASE_URL=https://psloezwvxtelstlpczay.supabase.co

# 必需 - Supabase 匿名密钥
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzbG9lend2eHRlbHN0bHBjemF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjUyOTUsImV4cCI6MjA2NjQ0MTI5NX0.TKr7dK7MatvpvH2V273bnjtxmguwSZxs2XJBiVi1J4Y
```

### 🤖 **AI 服务配置 (可选)**

```bash
# Pollinations AI Token
POLLINATIONS_API_TOKEN=il05Qcr-VQMGovbi

# AI 模型配置
POLLINATIONS_TEXT_MODEL=openai
POLLINATIONS_IMAGE_MODEL=flux
```

### 🌍 **其他环境变量**

```bash
# Next.js 配置
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## 🛠️ **Cloudflare Pages 配置步骤**

### 1. 访问 Cloudflare Pages 控制台
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择 **Pages** 服务
3. 找到您的项目 (lmai)
4. 点击项目名称进入详情页

### 2. 配置环境变量
1. 在项目详情页，点击 **Settings** 标签
2. 滚动到 **Environment variables** 部分
3. 点击 **Add variable** 按钮
4. 逐一添加上述环境变量

### 3. 配置格式
```
Variable name: NEXT_PUBLIC_SUPABASE_URL
Value: https://psloezwvxtelstlpczay.supabase.co
Environment: Production (and Preview if needed)
```

### 4. 重新部署
配置完环境变量后：
1. 点击 **Deployments** 标签
2. 点击最新部署右侧的 **Retry deployment** 按钮
3. 或者推送新的代码触发自动部署

## 🔍 **验证配置**

### 部署后验证步骤：
1. 访问部署的网站
2. 打开浏览器开发者工具 (F12)
3. 在 Console 中运行：
```javascript
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured' : 'Missing');
```

### 使用部署检查页面：
访问：`https://your-domain.pages.dev/deployment-check`

## ⚠️ **常见问题解决**

### 问题 1: 环境变量未生效
**解决方案:**
- 确保变量名完全正确 (区分大小写)
- 确保选择了正确的环境 (Production)
- 重新部署项目

### 问题 2: Supabase 连接失败
**解决方案:**
- 检查 Supabase 项目是否暂停
- 验证 URL 和密钥是否正确
- 检查 Supabase 项目的区域设置

### 问题 3: 数据库表格不存在
**解决方案:**
- 在 Supabase Dashboard 中创建必要的表格
- 运行数据库迁移脚本
- 检查表格权限设置

### 问题 4: RLS 策略阻止访问
**解决方案:**
```sql
-- 临时禁用 RLS (在 Supabase SQL 编辑器中执行)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE design_works DISABLE ROW LEVEL SECURITY;
-- 对其他表格重复此操作
```

## 📊 **环境变量检查清单**

- [ ] NEXT_PUBLIC_SUPABASE_URL 已配置
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY 已配置
- [ ] 环境变量在 Production 环境中可用
- [ ] 项目已重新部署
- [ ] Supabase 项目状态正常
- [ ] 数据库表格已创建
- [ ] RLS 策略已配置或禁用

## 🚀 **部署成功验证**

当所有配置正确时，您应该能够：
- ✅ 访问网站首页
- ✅ 数据库连接正常
- ✅ API 路由响应正常
- ✅ 用户功能正常工作

## 📞 **获取帮助**

如果仍然遇到问题：
1. 运行部署检查页面获取详细错误信息
2. 检查 Cloudflare Pages 部署日志
3. 检查 Supabase 项目日志
4. 验证所有环境变量配置

---

**注意**: 请确保不要在公开的代码仓库中提交包含敏感信息的 .env 文件。环境变量应该只在 Cloudflare Pages 控制台中配置。
