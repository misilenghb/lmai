import { NextRequest, NextResponse } from 'next/server';
import { DatabaseSetupExecutor } from '@/lib/execute-database-setup';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 开始执行数据库完整设置...');
    
    // 执行完整数据库设置
    const result = await DatabaseSetupExecutor.executeCompleteSetup();
    
    console.log('📊 数据库设置结果:', {
      success: result.success,
      totalSteps: result.summary.totalSteps,
      successfulSteps: result.summary.successfulSteps,
      failedSteps: result.summary.failedSteps
    });

    return NextResponse.json({
      success: result.success,
      message: result.success ? '数据库设置完成' : '数据库设置部分失败',
      results: result.results,
      summary: result.summary,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 数据库设置API失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      message: '数据库设置失败'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 验证数据库设置状态...');
    
    // 验证数据库设置
    const validation = await DatabaseSetupExecutor.validateSetup();
    
    console.log('📋 数据库验证结果:', validation);

    return NextResponse.json({
      success: true,
      validation,
      message: validation.success ? '数据库设置完整' : '数据库设置不完整',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 数据库验证API失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      message: '数据库验证失败'
    }, { status: 500 });
  }
}
