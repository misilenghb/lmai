import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fixDesignWorksRLS, temporarilyDisableRLS, enableRLS } from '@/lib/database-fix';

// 静态导出配置
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(request: NextRequest) {
  // 使用简单的 supabase 客户端，不依赖 cookies
  // 静态导出时不需要用户认证

  // 验证管理员权限（在开发环境中跳过验证）
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (!isDevelopment) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "未授权访问" }, { status: 401 });
    }
  }

  // 获取操作类型
  const action = request.nextUrl.searchParams.get('action');

  try {
    // 根据操作类型执行不同的修复
    switch (action) {
      case 'fix-design-works-rls':
        const result = await fixDesignWorksRLS();
        if (result) {
          return NextResponse.json({ 
            success: true, 
            message: "Design Works RLS策略修复成功",
            action
        });
      } else {
          return NextResponse.json({ 
            success: false, 
            message: "Design Works RLS策略修复失败",
            action
          }, { status: 500 });
    }

      case 'disable-rls':
        const disableResult = await temporarilyDisableRLS();
        if (disableResult) {
          return NextResponse.json({ 
            success: true, 
            message: "RLS策略已临时禁用，请在紧急操作完成后重新启用",
            action
          });
        } else {
          return NextResponse.json({ 
            success: false, 
            message: "RLS策略临时禁用失败",
            action
          }, { status: 500 });
      }
      
      case 'enable-rls':
        const enableResult = await enableRLS();
        if (enableResult) {
          return NextResponse.json({ 
            success: true, 
            message: "RLS策略已重新启用",
            action
      });
    } else {
          return NextResponse.json({ 
            success: false, 
            message: "RLS策略启用失败",
            action
          }, { status: 500 });
        }

      default:
        return NextResponse.json({ 
          success: false, 
          message: "未知操作类型",
          action
        }, { status: 400 });
    }
  } catch (error: any) {
    console.error('系统健康检查API错误:', error);
  return NextResponse.json({
      success: false, 
      message: error.message || "未知错误",
      action
    }, { status: 500 });
  }
} 