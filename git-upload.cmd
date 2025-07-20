@echo off
cd /d "C:\project\水晶日历\luminos"

echo 配置Git用户信息...
git config user.name "Administrator"
git config user.email "admin@example.com"

echo 检查远程仓库...
git remote -v
if errorlevel 1 (
    echo 添加远程仓库...
    git remote add origin https://github.com/misilenghb/lmai.git
) else (
    echo 更新远程仓库URL...
    git remote set-url origin https://github.com/misilenghb/lmai.git
)

echo 添加所有文件...
git add .

echo 创建提交...
git commit -m "Initial commit: 水晶日历系统完整版"

echo 推送到GitHub...
git branch -M main
git push -u origin main

echo 完成！
pause
