import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 静态导出配置
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(request: NextRequest) {
  try {
    const allTables = [
      // 核心功能表格
      'profiles',
      'design_works', 
      'user_energy_records',
      'meditation_sessions',
      'membership_info',
      'usage_stats',
      'user_settings',
      'crystals',
      'user_favorite_crystals',
      'ai_conversations',
      // 高级功能表格
      'user_behavior_patterns',
      'ml_predictions',
      'dynamic_pricing_rules',
      'ab_experiments',
      'ab_user_assignments',
      'analytics_metrics',
      'system_logs',
      'cache_management',
      'notifications',
      'user_feedback'
    ];

    const results: { [tableName: string]: boolean } = {};
    const existingTables: string[] = [];
    const missingTables: string[] = [];

    for (const table of allTables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('id')
          .limit(1);

        if (error && error.code === '42P01') {
          results[table] = false;
          missingTables.push(table);
        } else {
          results[table] = true;
          existingTables.push(table);
        }
      } catch (error) {
        results[table] = false;
        missingTables.push(table);
      }
    }

    return NextResponse.json({
      success: true,
      totalTables: allTables.length,
      existingCount: existingTables.length,
      missingCount: missingTables.length,
      existingTables,
      missingTables,
      results,
      completionPercentage: Math.round((existingTables.length / allTables.length) * 100),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 检查表格失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}
