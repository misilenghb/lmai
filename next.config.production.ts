import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // 生产环境优化配置
  reactStrictMode: true,
  
  // 输出配置 - 适用于云平台部署
  output: 'standalone',
  
  // 压缩和优化
  compress: true,
  poweredByHeader: false,
  
  // 配置服务器外部包
  serverExternalPackages: [
    '@genkit-ai/googleai', 
    '@genkit-ai/next',
    'sharp',
    'canvas',
    'jsdom'
  ],
  
  // 实验性功能
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // 图片优化配置
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
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Webpack 配置优化
  webpack: (config: any, { isServer, dev }: { isServer: boolean; dev: boolean }) => {
    // 生产环境优化
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        minimize: true,
      };
    }

    // 处理 ESM 模块
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    // 外部化某些包以减少构建大小
    if (isServer) {
      config.externals = [
        ...config.externals,
        'canvas',
        'jsdom',
        'sharp',
        '@genkit-ai/googleai',
        '@genkit-ai/next'
      ];
    }

    // 解决模块解析问题
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      },
    };

    return config;
  },
  
  // 环境变量配置
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // 重定向配置
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false,
      },
    ];
  },
  
  // 头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
