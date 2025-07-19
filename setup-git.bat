@echo off
echo 正在初始化Git仓库...
git init

echo 添加远程仓库...
git remote add origin https://github.com/misilenghb/lmai.git

echo 配置Git用户信息...
git config user.name "Administrator"
git config user.email "admin@example.com"

echo 添加所有文件...
git add .

echo 创建初始提交...
git commit -m "Initial commit: 水晶日历系统 - 完整的数据库管理功能"

echo 推送到GitHub...
git branch -M main
git push -u origin main

echo Git仓库设置完成！
pause
