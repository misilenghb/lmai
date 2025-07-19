import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // 临时禁用严格模式来避免双重渲染
  // 配置服务器外部包和实验性功能
  serverExternalPackages: [],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:9004', '192.168.1.11:9004'],
      bodySizeLimit: '2mb',
    },
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
  allowedDevOrigins: ['http://localhost:9004', 'http://192.168.1.11:9004'],
  // 使用新的 turbopack 配置替代已弃用的 experimental.turbo
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // 简化的开发模式配置
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config: any) => {
      // 基本的 webpack 配置
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };

      // 禁用代码分割以避免 ChunkLoadError
      config.optimization = {
        ...config.optimization,
        splitChunks: false,
      };

      return config;
    },
  }),
};

export default nextConfig;
