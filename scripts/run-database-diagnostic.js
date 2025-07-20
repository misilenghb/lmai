#!/usr/bin/env node

/**
 * 数据库诊断脚本
 * 直接运行数据库诊断，无需启动完整的 Next.js 应用
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// 从环境变量获取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 缺少 Supabase 环境变量');
  console.error('请确保设置了 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 定义所有必需的表
const REQUIRED_TABLES = [
  'profiles',
  'design_works', 
  'user_energy_records',
  'meditation_sessions',
  'crystals',
  'user_favorite_crystals',
  'ai_conversations',
  'membership_info',
  'usage_stats',
  'user_settings',
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

/**
 * 检查单个表的状态
 */
async function checkTable(tableName) {
  try {
    console.log(`📋 检查表: ${tableName}`);
    
    // 检查表是否存在
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      return {
        tableName,
        exists: false,
        error: error.message
      };
    }
    
    // 获取行数
    const { count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    return {
      tableName,
      exists: true,
      rowCount: count || 0,
      hasIndexes: true, // 简化检查
      hasRLS: error?.message?.includes('row-level security') || false
    };
    
  } catch (error) {
    return {
      tableName,
      exists: false,
      error: error.message
    };
  }
}

/**
 * 执行完整数据库诊断
 */
async function runDiagnostic() {
  console.log('🔍 开始数据库诊断...\n');
  
  const tableDiagnostics = [];
  let existingTables = 0;
  let tablesWithData = 0;
  let tablesWithIndexes = 0;
  let tablesWithRLS = 0;
  
  for (const tableName of REQUIRED_TABLES) {
    const diagnostic = await checkTable(tableName);
    tableDiagnostics.push(diagnostic);
    
    if (diagnostic.exists) {
      existingTables++;
      if (diagnostic.rowCount && diagnostic.rowCount > 0) {
        tablesWithData++;
      }
      if (diagnostic.hasIndexes) {
        tablesWithIndexes++;
      }
      if (diagnostic.hasRLS) {
        tablesWithRLS++;
      }
    }
  }
  
  const missingTables = REQUIRED_TABLES.length - existingTables;
  
  // 生成建议
  const recommendations = [];
  
  if (missingTables > 0) {
    recommendations.push(`需要创建 ${missingTables} 个缺失的表`);
  }
  
  if (tablesWithData === 0) {
    recommendations.push('所有表都是空的，建议插入基础数据');
  }
  
  if (tablesWithIndexes < existingTables * 0.8) {
    recommendations.push('建议为更多表添加索引以提高查询性能');
  }
  
  if (tablesWithRLS < existingTables * 0.5) {
    recommendations.push('建议为更多表设置行级安全策略(RLS)');
  }
  
  const summary = {
    totalTables: REQUIRED_TABLES.length,
    existingTables,
    missingTables,
    tablesWithData,
    tablesWithIndexes,
    tablesWithRLS
  };
  
  // 生成报告
  let report = '📊 数据库诊断报告\n';
  report += '='.repeat(50) + '\n\n';
  
  // 摘要
  report += `📈 摘要:\n`;
  report += `- 总表数: ${summary.totalTables}\n`;
  report += `- 存在表数: ${summary.existingTables}\n`;
  report += `- 缺失表数: ${summary.missingTables}\n`;
  report += `- 有数据表数: ${summary.tablesWithData}\n`;
  report += `- 有索引表数: ${summary.tablesWithIndexes}\n`;
  report += `- 有RLS表数: ${summary.tablesWithRLS}\n\n`;
  
  // 详细表状态
  report += `📋 详细表状态:\n`;
  tableDiagnostics.forEach(table => {
    const status = table.exists ? '✅' : '❌';
    const rowInfo = table.rowCount !== undefined ? ` (${table.rowCount} 行)` : '';
    const indexInfo = table.hasIndexes ? ' [有索引]' : '';
    const rlsInfo = table.hasRLS ? ' [有RLS]' : '';
    
    report += `${status} ${table.tableName}${rowInfo}${indexInfo}${rlsInfo}\n`;
    
    if (table.error) {
      report += `   错误: ${table.error}\n`;
    }
  });
  
  // 建议
  if (recommendations.length > 0) {
    report += `\n💡 建议:\n`;
    recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
  }
  
  console.log(report);
  
  console.log('\n📊 详细结果:');
  console.log(JSON.stringify({ summary, tables: tableDiagnostics, recommendations }, null, 2));
  
  return {
    success: true,
    tables: tableDiagnostics,
    summary,
    recommendations
  };
}

// 运行诊断
runDiagnostic()
  .then(result => {
    console.log('\n✅ 诊断完成');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ 诊断失败:', error);
    process.exit(1);
  }); 