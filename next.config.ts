import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // 移除 output 配置，使用默认设置

  // 配置服务器外部包和实验性功能
  serverExternalPackages: ['@genkit-ai/googleai', '@genkit-ai/next', 'sharp'],
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
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    POLLINATIONS_API_TOKEN: process.env.POLLINATIONS_API_TOKEN,
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
