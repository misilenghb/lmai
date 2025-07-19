/**
 * 客户端 API 服务
 * 用于静态部署时替代服务器端 API 路由
 * 适配 EdgeOne 免费计划
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
      'user_favorite_crystals', 'ai_conversations'
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
  static async getDailyFocus(targetDate?: string) {
    try {
      const date = targetDate || new Date().toISOString().split('T')[0];
      
      // 基于日期生成每日焦点内容
      const crystals = ['紫水晶', '玫瑰石英', '白水晶', '黑曜石', '青金石', '绿松石'];
      const energies = ['平静与智慧', '爱与和谐', '净化与保护', '稳定与力量', '真理与洞察', '治愈与平衡'];
      
      const dateHash = date.split('-').reduce((acc, part) => acc + parseInt(part), 0);
      const crystalIndex = dateHash % crystals.length;
      
      return {
        success: true,
        date,
        crystal: crystals[crystalIndex],
        energy: energies[crystalIndex],
        meditation: `专注于${crystals[crystalIndex]}的能量，让它引导你找到今日的${energies[crystalIndex]}。`,
        affirmation: `我拥有内在的${energies[crystalIndex]}。`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // 获取系统状态
  static async getSystemStatus() {
    try {
      const healthCheck = await this.healthCheck();
      const tableCheck = await this.checkTables();
      
      return {
        success: true,
        health: healthCheck,
        database: tableCheck,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
