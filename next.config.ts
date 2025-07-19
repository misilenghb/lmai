import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // Cloudflare Pages 部署配置
  output: 'export',
  distDir: 'out',
  trailingSlash: true,

  // App Router 自动跳过 API 路由，不需要 exportPathMap

  // 配置服务器外部包和实验性功能
  serverExternalPackages: ['@genkit-ai/googleai', '@genkit-ai/next', 'sharp'],
  experimental: {
    // serverActions 与静态导出不兼容，已移除
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    unoptimized: true, // Cloudflare Pages 静态导出需要
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pollinations.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.pollinations.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    domains: ['pollinations.ai', 'image.pollinations.ai', 'firebasestorage.googleapis.com', 'placehold.co'],
  },
  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Webpack 配置优化
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // 外部化某些包以减少构建大小
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas', 'jsdom', 'sharp'];
    }

    // 解决模块解析问题
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
