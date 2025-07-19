// 管理员权限验证中间件
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess, Permission, hasPermission } from '@/lib/admin-auth';

/**
 * 管理员权限验证中间件
 */
export async function adminAuthMiddleware(
  request: NextRequest,
  requiredPermission?: Permission
): Promise<NextResponse | null> {
  try {
    // 在开发环境中，允许绕过某些权限检查
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // 从请求头或查询参数中获取用户邮箱
    const userEmail = request.headers.get('x-user-email') || 
                     request.nextUrl.searchParams.get('userEmail') ||
                     request.headers.get('authorization')?.replace('Bearer ', '');

    if (!userEmail) {
      return NextResponse.json(
        { 
          success: false, 
          error: '未提供用户身份信息',
          code: 'MISSING_AUTH'
        }, 
        { status: 401 }
      );
    }

    // 验证管理员身份
    const verification = await verifyAdminAccess(userEmail);
    
    if (!verification.isAdmin) {
      return NextResponse.json(
        { 
          success: false, 
          error: verification.error || '非管理员用户',
          code: 'NOT_ADMIN'
        }, 
        { status: 403 }
      );
    }

    // 如果指定了特定权限要求，进行权限检查
    if (requiredPermission && verification.role) {
      const hasRequiredPermission = hasPermission(verification.role, requiredPermission);
      
      if (!hasRequiredPermission && !isDevelopment) {
        return NextResponse.json(
          { 
            success: false, 
            error: `缺少必要权限: ${requiredPermission}`,
            code: 'INSUFFICIENT_PERMISSION',
            requiredPermission
          }, 
          { status: 403 }
        );
      }
    }

    // 在请求头中添加管理员信息，供后续处理使用
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-admin-email', userEmail);
    requestHeaders.set('x-admin-role', verification.role || '');
    requestHeaders.set('x-admin-permissions', JSON.stringify(verification.permissions || []));

    return null; // 继续处理请求
  } catch (error) {
    console.error('管理员权限验证中间件错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '权限验证过程中发生错误',
        code: 'AUTH_ERROR'
      }, 
      { status: 500 }
    );
  }
}

/**
 * 创建需要特定权限的API路由包装器
 */
export function withAdminPermission(permission: Permission) {
  return function(handler: (request: NextRequest) => Promise<NextResponse>) {
    return async function(request: NextRequest): Promise<NextResponse> {
      // 执行权限检查
      const authResult = await adminAuthMiddleware(request, permission);
      
      if (authResult) {
        return authResult; // 返回权限检查失败的响应
      }

      // 权限检查通过，执行原始处理器
      return handler(request);
    };
  };
}

/**
 * 创建管理员专用的API路由包装器
 */
export function withAdminAuth(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async function(request: NextRequest): Promise<NextResponse> {
    // 执行基础管理员身份检查
    const authResult = await adminAuthMiddleware(request);
    
    if (authResult) {
      return authResult; // 返回权限检查失败的响应
    }

    // 权限检查通过，执行原始处理器
    return handler(request);
  };
}

/**
 * 从请求中提取管理员信息
 */
export function getAdminFromRequest(request: NextRequest) {
  return {
    email: request.headers.get('x-admin-email'),
    role: request.headers.get('x-admin-role'),
    permissions: JSON.parse(request.headers.get('x-admin-permissions') || '[]')
  };
}

/**
 * 验证API密钥（用于服务间调用）
 */
export function verifyApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  const validApiKey = process.env.ADMIN_API_KEY;
  
  if (!validApiKey) {
    console.warn('未设置 ADMIN_API_KEY 环境变量');
    return false;
  }
  
  return apiKey === validApiKey;
}

/**
 * API密钥验证中间件
 */
export function withApiKey(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async function(request: NextRequest): Promise<NextResponse> {
    if (!verifyApiKey(request)) {
      return NextResponse.json(
        { 
          success: false, 
          error: '无效的API密钥',
          code: 'INVALID_API_KEY'
        }, 
        { status: 401 }
      );
    }

    return handler(request);
  };
}

/**
 * 组合中间件：API密钥或管理员权限
 */
export function withApiKeyOrAdmin(permission?: Permission) {
  return function(handler: (request: NextRequest) => Promise<NextResponse>) {
    return async function(request: NextRequest): Promise<NextResponse> {
      // 首先尝试API密钥验证
      if (verifyApiKey(request)) {
        return handler(request);
      }

      // API密钥验证失败，尝试管理员权限验证
      const authResult = await adminAuthMiddleware(request, permission);
      
      if (authResult) {
        return authResult;
      }

      return handler(request);
    };
  };
}

/**
 * 记录管理员操作日志
 */
export async function logAdminAction(
  adminEmail: string,
  action: string,
  details?: any,
  request?: NextRequest
) {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      adminEmail,
      action,
      details: details || {},
      ip: request?.ip || request?.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request?.headers.get('user-agent') || 'unknown'
    };

    // 在实际应用中，这里应该写入到专门的日志表或日志服务
    console.log('管理员操作日志:', JSON.stringify(logEntry, null, 2));
    
    // TODO: 实现日志持久化
    // await supabase.from('admin_logs').insert(logEntry);
    
  } catch (error) {
    console.error('记录管理员操作日志失败:', error);
  }
}
