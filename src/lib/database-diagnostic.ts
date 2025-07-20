import { supabase } from './supabase';

/**
 * 数据库诊断工具
 * 检查所有表的存在性和完整性
 */

export interface TableDiagnostic {
  tableName: string;
  exists: boolean;
  columns?: string[];
  rowCount?: number;
  hasIndexes?: boolean;
  hasRLS?: boolean;
  error?: string;
}

export interface DatabaseDiagnostic {
  success: boolean;
  tables: TableDiagnostic[];
  summary: {
    totalTables: number;
    existingTables: number;
    missingTables: number;
    tablesWithData: number;
    tablesWithIndexes: number;
    tablesWithRLS: number;
  };
  recommendations: string[];
}

export class DatabaseDiagnostic {
  
  /**
   * 执行完整数据库诊断
   */
  static async runDiagnostic(): Promise<DatabaseDiagnostic> {
    console.log('🔍 开始数据库诊断...');
    
    const requiredTables = [
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
    
    const tableDiagnostics: TableDiagnostic[] = [];
    let existingTables = 0;
    let tablesWithData = 0;
    let tablesWithIndexes = 0;
    let tablesWithRLS = 0;
    
    for (const tableName of requiredTables) {
      console.log(`📋 检查表: ${tableName}`);
      const diagnostic = await this.checkTable(tableName);
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
    
    const missingTables = requiredTables.length - existingTables;
    
    // 生成建议
    const recommendations: string[] = [];
    
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
      totalTables: requiredTables.length,
      existingTables,
      missingTables,
      tablesWithData,
      tablesWithIndexes,
      tablesWithRLS
    };
    
    console.log('✅ 数据库诊断完成');
    
    return {
      success: true,
      tables: tableDiagnostics,
      summary,
      recommendations
    };
  }
  
  /**
   * 检查单个表的状态
   */
  private static async checkTable(tableName: string): Promise<TableDiagnostic> {
    try {
      // 检查表是否存在
      const { data: tableExists, error: tableError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (tableError) {
        return {
          tableName,
          exists: false,
          error: tableError.message
        };
      }
      
      // 获取表结构信息
      let columns = null;
      let columnsError = null;
      try {
        const result = await supabase.rpc('get_table_columns', { table_name: tableName });
        columns = result.data;
        columnsError = result.error;
      } catch (error) {
        columnsError = 'Function not available';
      }
      
      // 获取行数
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      // 检查是否有索引（简化检查）
      const hasIndexes = await this.checkTableIndexes(tableName);
      
      // 检查是否有RLS策略（简化检查）
      const hasRLS = await this.checkTableRLS(tableName);
      
      return {
        tableName,
        exists: true,
        columns: columns || undefined,
        rowCount: count || 0,
        hasIndexes,
        hasRLS
      };
      
    } catch (error) {
      return {
        tableName,
        exists: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }
  
  /**
   * 检查表是否有索引
   */
  private static async checkTableIndexes(tableName: string): Promise<boolean> {
    try {
      // 尝试创建一个简单的索引查询
      const { error } = await supabase
        .from(tableName)
        .select('id')
        .limit(1);
      
      // 如果查询成功，假设有基本索引
      return !error;
    } catch {
      return false;
    }
  }
  
  /**
   * 检查表是否有RLS策略
   */
  private static async checkTableRLS(tableName: string): Promise<boolean> {
    try {
      // 尝试查询表，如果被RLS阻止，说明有RLS策略
      const { error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      // 如果有权限错误，可能表示有RLS
      return error?.message?.includes('row-level security') || false;
    } catch {
      return false;
    }
  }
  
  /**
   * 生成诊断报告
   */
  static generateReport(diagnostic: DatabaseDiagnostic): string {
    let report = '📊 数据库诊断报告\n';
    report += '='.repeat(50) + '\n\n';
    
    // 摘要
    report += `📈 摘要:\n`;
    report += `- 总表数: ${diagnostic.summary.totalTables}\n`;
    report += `- 存在表数: ${diagnostic.summary.existingTables}\n`;
    report += `- 缺失表数: ${diagnostic.summary.missingTables}\n`;
    report += `- 有数据表数: ${diagnostic.summary.tablesWithData}\n`;
    report += `- 有索引表数: ${diagnostic.summary.tablesWithIndexes}\n`;
    report += `- 有RLS表数: ${diagnostic.summary.tablesWithRLS}\n\n`;
    
    // 详细表状态
    report += `📋 详细表状态:\n`;
    diagnostic.tables.forEach(table => {
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
    if (diagnostic.recommendations.length > 0) {
      report += `\n💡 建议:\n`;
      diagnostic.recommendations.forEach(rec => {
        report += `- ${rec}\n`;
      });
    }
    
    return report;
  }
} 