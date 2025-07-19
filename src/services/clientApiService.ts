/**
 * 客户端 API 服务
 * 用于静态部署时替代服务器端 API 路由
 */

import { supabase } from '@/lib/supabase';

export class ClientApiService {
  
  // 健康检查
  static async healthCheck() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      return {
        success: !error,
        status: error ? 'error' : 'healthy',
        timestamp: new Date().toISOString(),
        database: !error ? 'connected' : 'disconnected'
      };
    } catch (error) {
      return {
        success: false,
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // 检查表格状态
  static async checkTables() {
    const allTables = [
      'profiles', 'design_works', 'user_energy_records', 'meditation_sessions',
      'membership_info', 'usage_stats', 'user_settings', 'crystals',
      'user_favorite_crystals', 'ai_conversations', 'user_behavior_patterns',
      'ml_predictions', 'dynamic_pricing_rules', 'ab_experiments',
      'ab_user_assignments', 'analytics_metrics', 'system_logs',
      'cache_management', 'notifications', 'user_feedback'
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

    const completionPercentage = Math.round((existingTables.length / allTables.length) * 100);

    return {
      success: true,
      totalTables: allTables.length,
      existingCount: existingTables.length,
      missingCount: missingTables.length,
      existingTables,
      missingTables,
      results,
      completionPercentage,
      timestamp: new Date().toISOString()
    };
  }

  // 获取缺失表格的 SQL
  static getMissingTablesSQL(missingTables: string[]) {
    const tableDefinitions: { [key: string]: string } = {
      'system_logs': `CREATE TABLE IF NOT EXISTS system_logs (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        log_level VARCHAR(20) NOT NULL,
        component VARCHAR(100),
        message TEXT NOT NULL,
        error_details JSONB DEFAULT '{}',
        user_id UUID,
        session_id VARCHAR(100),
        request_id VARCHAR(100),
        stack_trace TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      'cache_management': `CREATE TABLE IF NOT EXISTS cache_management (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        cache_key VARCHAR(255) UNIQUE NOT NULL,
        cache_type VARCHAR(50) NOT NULL,
        data JSONB,
        expires_at TIMESTAMP WITH TIME ZONE,
        hit_count INTEGER DEFAULT 0,
        last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      'notifications': `CREATE TABLE IF NOT EXISTS notifications (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID,
        notification_type VARCHAR(50) NOT NULL,
        title VARCHAR(200),
        message TEXT,
        data JSONB DEFAULT '{}',
        read_at TIMESTAMP WITH TIME ZONE,
        action_url TEXT,
        priority VARCHAR(20) DEFAULT 'normal',
        expires_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      'user_feedback': `CREATE TABLE IF NOT EXISTS user_feedback (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID,
        feedback_type VARCHAR(50) NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        subject VARCHAR(200),
        message TEXT,
        feature_area VARCHAR(100),
        priority VARCHAR(20) DEFAULT 'normal',
        status VARCHAR(50) DEFAULT 'open',
        response TEXT,
        responded_at TIMESTAMP WITH TIME ZONE,
        responded_by UUID,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`
    };

    let sql = '-- 水晶日历系统 - 缺失表格创建脚本\n\n';
    
    missingTables.forEach(table => {
      if (tableDefinitions[table]) {
        sql += `-- ${table} 表\n${tableDefinitions[table]}\n\n`;
      }
    });

    // 添加索引
    sql += `-- 创建索引\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(log_level);\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_cache_management_key ON cache_management(cache_key);\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);\n`;

    return {
      success: true,
      sql,
      instructions: [
        '1. 复制下面的 SQL 语句',
        '2. 打开 Supabase Dashboard',
        '3. 进入 SQL 编辑器',
        '4. 粘贴并执行 SQL 语句',
        '5. 验证表格创建成功'
      ],
      dashboardUrl: 'https://supabase.com/dashboard/project/psloezwvxtelstlpczay/sql'
    };
  }

  // 保存设计作品
  static async saveDesign(designData: any) {
    try {
      const { data, error } = await supabase
        .from('design_works')
        .insert([designData])
        .select();

      return {
        success: !error,
        data: data?.[0],
        error: error?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // 获取每日焦点
  static async getDailyFocus() {
    try {
      // 这里可以实现客户端逻辑
      const today = new Date().toISOString().split('T')[0];
      
      return {
        success: true,
        date: today,
        crystal: '紫水晶',
        energy: '平静与智慧',
        meditation: '专注于内心的平静，让紫水晶的能量引导你找到今日的智慧。',
        affirmation: '我拥有内在的智慧和平静的力量。'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
