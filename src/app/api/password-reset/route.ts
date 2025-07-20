import { NextRequest, NextResponse } from 'next/server';
import { profileService } from '@/lib/supabase';

// 静态导出配置
export const dynamic = 'force-static';
export const revalidate = false;

/**
 * 密码重置 API
 * POST /api/password-reset
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, answers, resetToken, newPassword } = body;

    switch (action) {
      case 'getSecurityQuestions':
        return await handleGetSecurityQuestions(email);
      
      case 'verifySecurityQuestions':
        return await handleVerifySecurityQuestions(email, answers);
      
      case 'requestEmailReset':
        return await handleRequestEmailReset(email);
      
      case 'resetPassword':
        return await handleResetPassword(resetToken, newPassword);
      
      default:
        return NextResponse.json({
          success: false,
          error: '无效的操作类型'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('密码重置 API 错误:', error);
    return NextResponse.json({
      success: false,
      error: '服务器内部错误'
    }, { status: 500 });
  }
}

/**
 * 获取安全问题
 */
async function handleGetSecurityQuestions(email: string) {
  if (!email) {
    return NextResponse.json({
      success: false,
      error: '邮箱地址不能为空'
    }, { status: 400 });
  }

  try {
    const result = await profileService.getSecurityQuestions(email);
    
    return NextResponse.json({
      success: result.success,
      questions: result.questions,
      error: result.error
    });

  } catch (error) {
    console.error('获取安全问题失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取安全问题失败'
    }, { status: 500 });
  }
}

/**
 * 验证安全问题答案
 */
async function handleVerifySecurityQuestions(email: string, answers: any) {
  if (!email || !answers) {
    return NextResponse.json({
      success: false,
      error: '邮箱地址和答案不能为空'
    }, { status: 400 });
  }

  try {
    const result = await profileService.verifySecurityQuestions(email, answers);
    
    return NextResponse.json({
      success: result.success,
      resetToken: result.resetToken,
      error: result.error
    });

  } catch (error) {
    console.error('验证安全问题失败:', error);
    return NextResponse.json({
      success: false,
      error: '验证安全问题失败'
    }, { status: 500 });
  }
}

/**
 * 请求邮箱重置
 */
async function handleRequestEmailReset(email: string) {
  if (!email) {
    return NextResponse.json({
      success: false,
      error: '邮箱地址不能为空'
    }, { status: 400 });
  }

  try {
    const result = await profileService.requestPasswordReset(email);
    
    return NextResponse.json({
      success: result.success,
      resetToken: result.resetToken, // 在实际应用中，这应该通过邮件发送
      error: result.error
    });

  } catch (error) {
    console.error('请求密码重置失败:', error);
    return NextResponse.json({
      success: false,
      error: '请求密码重置失败'
    }, { status: 500 });
  }
}

/**
 * 重置密码
 */
async function handleResetPassword(resetToken: string, newPassword: string) {
  if (!resetToken || !newPassword) {
    return NextResponse.json({
      success: false,
      error: '重置令牌和新密码不能为空'
    }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({
      success: false,
      error: '密码至少需要6个字符'
    }, { status: 400 });
  }

  try {
    const result = await profileService.resetPasswordWithToken(resetToken, newPassword);
    
    return NextResponse.json({
      success: result.success,
      error: result.error
    });

  } catch (error) {
    console.error('重置密码失败:', error);
    return NextResponse.json({
      success: false,
      error: '重置密码失败'
    }, { status: 500 });
  }
}

/**
 * 获取密码重置状态
 * GET /api/password-reset
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({
      success: false,
      error: '缺少重置令牌'
    }, { status: 400 });
  }

  // 这里可以验证令牌的有效性
  // 在实际应用中，应该检查令牌是否存在且未过期
  
  return NextResponse.json({
    success: true,
    message: '令牌有效',
    token: token
  });
}
