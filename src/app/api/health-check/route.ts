import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // 检查数据库连接
    const { error: dbError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    const responseTime = Date.now() - startTime;
    
    // 系统健康状态
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime,
      services: {
        database: {
          status: dbError ? 'error' : 'healthy',
          responseTime,
          error: dbError?.message
        },
        api: {
          status: 'healthy',
          responseTime
        }
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    };

    // 如果有任何服务出错，整体状态为警告或错误
    if (dbError) {
      healthStatus.status = 'error';
    } else if (responseTime > 1000) {
      healthStatus.status = 'warning';
    }

    return NextResponse.json(healthStatus);
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
      services: {
        database: { status: 'error' },
        api: { status: 'error' }
      }
    }, { status: 500 });
  }
}
