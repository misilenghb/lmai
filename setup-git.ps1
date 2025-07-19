# 设置执行策略
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

# 切换到项目目录
Set-Location "C:\project\水晶日历\luminos"

Write-Host "正在初始化Git仓库..." -ForegroundColor Green
git init

Write-Host "配置Git用户信息..." -ForegroundColor Green
git config user.name "Administrator"
git config user.email "admin@example.com"

Write-Host "添加远程仓库..." -ForegroundColor Green
git remote add origin https://github.com/misilenghb/lmai.git

Write-Host "添加所有文件..." -ForegroundColor Green
git add .

Write-Host "创建初始提交..." -ForegroundColor Green
git commit -m "Initial commit: 水晶日历系统 - 完整的数据库管理功能

- 完整的Next.js水晶日历应用
- 管理员控制台和数据库管理中心
- 20个数据库表格设计（核心+高级功能）
- 数据库状态检查和修复工具
- Supabase集成和API接口
- 响应式UI设计和组件库
- 用户认证和权限管理
- 水晶设计工具和AI集成"

Write-Host "设置主分支..." -ForegroundColor Green
git branch -M main

Write-Host "推送到GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host "Git仓库设置完成！" -ForegroundColor Green
Write-Host "仓库地址: https://github.com/misilenghb/lmai.git" -ForegroundColor Yellow
