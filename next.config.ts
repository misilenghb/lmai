import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // EdgeOne 部署配置 - 静态导出模式（免费计划）
  output: 'export',
  distDir: 'out',
  trailingSlash: true,

  // 优化构建以避免大文件
  swcMinify: true,
  compress: true,

  // 在构建时忽略 ESLint 错误
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 在构建时忽略 TypeScript 错误（如果需要）
  typescript: {
    ignoreBuildErrors: false,
  },

  // 配置服务器外部包和实验性功能
  serverExternalPackages: ['@genkit-ai/googleai', '@genkit-ai/next', 'sharp'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    unoptimized: true,
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
  // Webpack 配置优化 - 减少文件大小
  webpack: (config: any, { isServer, dev }: { isServer: boolean; dev: boolean }) => {
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

    // 生产环境优化 - 减少缓存文件大小
    if (!dev) {
      // 禁用持久化缓存以避免大文件
      config.cache = false;

      // 优化分包策略
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxSize: 20000000, // 20MB
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 15000000, // 15MB
            },
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
