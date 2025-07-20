import { NextRequest, NextResponse } from 'next/server';
import { DatabaseDiagnostic } from '@/lib/database-diagnostic';

// 静态导出配置
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 开始数据库诊断...');
    
    // 运行数据库诊断
    const diagnostic = await DatabaseDiagnostic.runDiagnostic();
    
    // 生成报告
    const report = DatabaseDiagnostic.generateReport(diagnostic);
    
    console.log('✅ 数据库诊断完成');
    
    return NextResponse.json({
      success: true,
      diagnostic,
      report,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 数据库诊断失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      message: '数据库诊断失败'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 开始数据库诊断...');
    
    // 运行数据库诊断
    const diagnostic = await DatabaseDiagnostic.runDiagnostic();
    
    // 生成报告
    const report = DatabaseDiagnostic.generateReport(diagnostic);
    
    console.log('✅ 数据库诊断完成');
    
    return NextResponse.json({
      success: true,
      diagnostic,
      report,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 数据库诊断失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      message: '数据库诊断失败'
    }, { status: 500 });
  }
} 