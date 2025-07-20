import { NextRequest, NextResponse } from 'next/server';
import { AutoDiagnosticSystem } from '@/lib/supabase';

/**
 * 自动诊断和修复 API
 * POST /api/auto-repair
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 开始自动诊断和修复流程...');
    
    // 执行自动诊断和修复
    const result = await AutoDiagnosticSystem.executeAutoRepair();
    
    console.log('📊 自动修复结果:', {
      success: result.success,
      totalChecks: result.summary.totalChecks,
      errorCount: result.summary.errorCount,
      repairsAttempted: result.summary.repairsAttempted,
      repairsSuccessful: result.summary.repairsSuccessful
    });

    // 获取修复建议
    const suggestions = AutoDiagnosticSystem.getRepairSuggestions();

    return NextResponse.json({
      success: result.success,
      message: result.success ? '自动修复完成，所有检查通过' : '自动修复完成，但仍有问题需要手动处理',
      results: result.results,
      summary: result.summary,
      suggestions,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 自动修复API失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      message: '自动修复失败',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * 获取修复状态 API
 * GET /api/auto-repair
 */
export async function GET(request: NextRequest) {
  try {
    // 执行快速状态检查
    const result = await AutoDiagnosticSystem.executeAutoRepair();
    
    return NextResponse.json({
      success: result.success,
      summary: result.summary,
      suggestions: AutoDiagnosticSystem.getRepairSuggestions(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 获取修复状态失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      message: '获取状态失败',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
