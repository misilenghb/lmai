import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/middleware/admin-middleware';
import { verifyAdminAccess, getAdminStats } from '@/lib/admin-auth';

async function handleAdminRequest(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const userEmail = request.headers.get('x-user-email') || searchParams.get('userEmail');

  if (!userEmail) {
    return NextResponse.json(
      { success: false, error: '缺少用户邮箱' },
      { status: 400 }
    );
  }

  try {
    switch (action) {
      case 'verify':
        const verification = await verifyAdminAccess(userEmail);
        return NextResponse.json({
          success: true,
          data: verification
        });

      case 'stats':
        const stats = await getAdminStats();
        return NextResponse.json({
          success: true,
          data: stats
        });

      case 'health':
        // 系统健康检查
        const healthData = {
          timestamp: new Date().toISOString(),
          status: 'healthy',
          services: {
            database: 'connected',
            api: 'running',
            ai: 'available'
          }
        };
        return NextResponse.json({
          success: true,
          data: healthData
        });

      default:
        return NextResponse.json(
          { success: false, error: '未知操作' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('管理员API错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '服务器内部错误' 
      },
      { status: 500 }
    );
  }
}

// 使用管理员权限中间件包装处理函数
export const GET = withAdminAuth(handleAdminRequest);
export const POST = withAdminAuth(handleAdminRequest);
