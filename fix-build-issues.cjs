#!/usr/bin/env node

/**
 * 修复常见的构建问题脚本
 * 用于解决云平台部署时的 Build error at stage 2 问题
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 开始修复构建问题...');

// 1. 检查和修复 package.json
function fixPackageJson() {
  console.log('📦 检查 package.json...');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // 确保有正确的构建脚本
  if (!packageJson.scripts.build) {
    packageJson.scripts.build = 'next build';
    console.log('✅ 添加了构建脚本');
  }
  
  // 确保有正确的启动脚本
  if (!packageJson.scripts.start) {
    packageJson.scripts.start = 'next start';
    console.log('✅ 添加了启动脚本');
  }
  
  // 添加引擎要求
  if (!packageJson.engines) {
    packageJson.engines = {
      "node": ">=18.0.0",
      "npm": ">=8.0.0"
    };
    console.log('✅ 添加了引擎要求');
  }
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json 已更新');
}

// 2. 检查和修复 TypeScript 配置
function fixTsConfig() {
  console.log('📝 检查 tsconfig.json...');
  
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (!fs.existsSync(tsConfigPath)) {
    console.log('❌ tsconfig.json 不存在，创建默认配置');
    
    const defaultTsConfig = {
      "compilerOptions": {
        "target": "ES2017",
        "lib": ["dom", "dom.iterable", "esnext"],
        "allowJs": true,
        "skipLibCheck": true,
        "strict": false,
        "noEmit": true,
        "esModuleInterop": true,
        "module": "esnext",
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "jsx": "preserve",
        "incremental": true,
        "plugins": [{ "name": "next" }],
        "paths": { "@/*": ["./src/*"] }
      },
      "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      "exclude": ["node_modules"]
    };
    
    fs.writeFileSync(tsConfigPath, JSON.stringify(defaultTsConfig, null, 2));
    console.log('✅ 创建了默认 tsconfig.json');
  } else {
    console.log('✅ tsconfig.json 存在');
  }
}

// 3. 检查和修复环境变量
function fixEnvFiles() {
  console.log('🌍 检查环境变量文件...');
  
  const envExamplePath = path.join(process.cwd(), '.env.example');
  if (!fs.existsSync(envExamplePath)) {
    const envExample = `# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Pollinations AI配置
POLLINATIONS_API_TOKEN=your_pollinations_token
POLLINATIONS_TEXT_MODEL=openai
POLLINATIONS_IMAGE_MODEL=flux

# 其他配置
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production`;
    
    fs.writeFileSync(envExamplePath, envExample);
    console.log('✅ 创建了 .env.example');
  }
}

// 4. 检查和修复 Next.js 配置
function fixNextConfig() {
  console.log('⚙️ 检查 Next.js 配置...');
  
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  const nextConfigTsPath = path.join(process.cwd(), 'next.config.ts');
  
  if (!fs.existsSync(nextConfigPath) && !fs.existsSync(nextConfigTsPath)) {
    console.log('❌ Next.js 配置文件不存在，创建默认配置');
    
    const defaultConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
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
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;`;
    
    fs.writeFileSync(nextConfigPath, defaultConfig);
    console.log('✅ 创建了默认 next.config.js');
  } else {
    console.log('✅ Next.js 配置文件存在');
  }
}

// 5. 清理构建缓存
function cleanBuildCache() {
  console.log('🧹 清理构建缓存...');
  
  const dirsToClean = ['.next', 'node_modules/.cache', 'dist', 'build'];
  
  dirsToClean.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ 清理了 ${dir}`);
    }
  });
}

// 6. 检查依赖问题
function checkDependencies() {
  console.log('📚 检查依赖问题...');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // 检查是否有冲突的依赖
  const problematicDeps = ['@types/node-fetch'];
  let hasIssues = false;
  
  problematicDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`⚠️ 发现可能有问题的依赖: ${dep}`);
      hasIssues = true;
    }
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      console.log(`⚠️ 发现可能有问题的开发依赖: ${dep}`);
      hasIssues = true;
    }
  });
  
  if (!hasIssues) {
    console.log('✅ 依赖检查通过');
  }
}

// 主函数
function main() {
  try {
    fixPackageJson();
    fixTsConfig();
    fixEnvFiles();
    fixNextConfig();
    cleanBuildCache();
    checkDependencies();
    
    console.log('\n🎉 构建问题修复完成！');
    console.log('\n📋 建议的下一步操作:');
    console.log('1. 运行 npm install 重新安装依赖');
    console.log('2. 运行 npm run build 测试构建');
    console.log('3. 检查环境变量是否正确配置');
    console.log('4. 重新部署到云平台');
    
  } catch (error) {
    console.error('❌ 修复过程中出现错误:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = {
  fixPackageJson,
  fixTsConfig,
  fixEnvFiles,
  fixNextConfig,
  cleanBuildCache,
  checkDependencies
};
