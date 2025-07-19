#!/usr/bin/env node

/**
 * 构建后处理脚本
 * 确保输出目录结构正确
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 开始构建后处理...');

// 检查 .next 目录是否存在
const nextDir = path.join(process.cwd(), '.next');
const outDir = path.join(process.cwd(), 'out');

if (fs.existsSync(nextDir)) {
  console.log('✅ .next 目录存在');
  
  // 如果云平台期望 out 目录，创建符号链接或复制
  if (!fs.existsSync(outDir)) {
    try {
      // 在 Windows 上创建目录链接
      if (process.platform === 'win32') {
        require('child_process').execSync(`mklink /D "${outDir}" "${nextDir}"`);
      } else {
        // 在 Unix 系统上创建符号链接
        fs.symlinkSync(nextDir, outDir);
      }
      console.log('✅ 创建了 out -> .next 链接');
    } catch (error) {
      console.log('⚠️ 无法创建链接，尝试复制目录...');
      // 如果链接失败，复制目录
      copyDir(nextDir, outDir);
    }
  }
} else {
  console.log('❌ .next 目录不存在');
  process.exit(1);
}

// 检查关键文件
const serverFile = path.join(nextDir, 'server.js');
const standaloneDir = path.join(nextDir, 'standalone');

if (fs.existsSync(serverFile)) {
  console.log('✅ server.js 存在');
} else if (fs.existsSync(standaloneDir)) {
  console.log('✅ standalone 目录存在');
} else {
  console.log('✅ 静态构建完成');
}

console.log('🎉 构建后处理完成！');

function copyDir(src, dest) {
  try {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
    console.log('✅ 目录复制完成');
  } catch (error) {
    console.error('❌ 复制失败:', error.message);
  }
}
