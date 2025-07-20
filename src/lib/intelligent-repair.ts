import { supabase } from './supabase';

/**
 * 智能修复系统
 * 提供高级的数据库修复和配置功能
 */
export class IntelligentRepairSystem {
  
  /**
   * 智能数据库表格修复
   * 根据错误类型选择最佳修复策略
   */
  static async intelligentTableRepair(): Promise<{
    success: boolean;
    strategy: string;
    results: any[];
    message: string;
  }> {
    console.log('🧠 开始智能表格修复...');
    
    const results: any[] = [];
    let strategy = 'unknown';
    
    try {
      // 1. 检测数据库连接状态
      const connectionStatus = await this.detectConnectionStatus();
      results.push({ step: '连接检测', status: connectionStatus });
      
      if (!connectionStatus.canConnect) {
        return {
          success: false,
          strategy: 'connection_failed',
          results,
          message: '数据库连接失败，无法进行修复'
        };
      }
      
      // 2. 分析缺失的表格
      const missingTables = await this.analyzeMissingTables();
      results.push({ step: '表格分析', missingTables });
      
      if (missingTables.length === 0) {
        return {
          success: true,
          strategy: 'no_repair_needed',
          results,
          message: '所有表格都存在，无需修复'
        };
      }
      
      // 3. 选择修复策略
      if (missingTables.length > 5) {
        strategy = 'complete_setup';
        const setupResult = await this.executeCompleteSetup();
        results.push({ step: '完整设置', result: setupResult });
        
        return {
          success: setupResult.success,
          strategy,
          results,
          message: setupResult.success ? '完整数据库设置成功' : '完整数据库设置失败'
        };
      } else {
        strategy = 'incremental_repair';
        const incrementalResult = await this.executeIncrementalRepair(missingTables);
        results.push({ step: '增量修复', result: incrementalResult });
        
        return {
          success: incrementalResult.success,
          strategy,
          results,
          message: incrementalResult.success ? '增量修复成功' : '增量修复失败'
        };
      }
      
    } catch (error) {
      console.error('❌ 智能修复异常:', error);
      return {
        success: false,
        strategy: 'error',
        results: [...results, { step: '异常', error: error }],
        message: `修复异常: ${error}`
      };
    }
  }
  
  /**
   * 检测数据库连接状态
   */
  private static async detectConnectionStatus(): Promise<{
    canConnect: boolean;
    hasAuth: boolean;
    errorType?: string;
    errorCode?: string;
  }> {
    try {
      // 测试认证
      const { error: authError } = await supabase.auth.getSession();
      const hasAuth = !authError;
      
      // 测试基础查询
      const { error: queryError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (!queryError) {
        return { canConnect: true, hasAuth };
      }
      
      // 分析错误类型
      if (queryError.code === '42P01') {
        return { canConnect: true, hasAuth, errorType: 'table_missing', errorCode: queryError.code };
      }
      
      return { 
        canConnect: false, 
        hasAuth, 
        errorType: 'connection_error', 
        errorCode: queryError.code 
      };
      
    } catch (error) {
      return { 
        canConnect: false, 
        hasAuth: false, 
        errorType: 'network_error' 
      };
    }
  }
  
  /**
   * 分析缺失的表格
   */
  private static async analyzeMissingTables(): Promise<string[]> {
    const requiredTables = [
      'profiles',
      'design_works',
      'user_energy_records',
      'meditation_sessions',
      'membership_info',
      'usage_stats',
      'user_settings',
      'crystals',
      'user_favorite_crystals',
      'ai_conversations'
    ];
    
    const missingTables: string[] = [];
    
    for (const table of requiredTables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        if (error && error.code === '42P01') {
          missingTables.push(table);
        }
      } catch (error) {
        missingTables.push(table);
      }
    }
    
    return missingTables;
  }
  
  /**
   * 执行完整数据库设置
   */
  private static async executeCompleteSetup(): Promise<{ success: boolean; details: any }> {
    try {
      const response = await fetch('/api/setup-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const result = await response.json();
        return { success: result.success, details: result };
      } else {
        return { success: false, details: { error: `HTTP ${response.status}` } };
      }
    } catch (error) {
      return { success: false, details: { error: error } };
    }
  }
  
  /**
   * 执行增量修复
   */
  private static async executeIncrementalRepair(missingTables: string[]): Promise<{ success: boolean; details: any }> {
    try {
      const response = await fetch('/api/database-migration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'quickFix',
          tables: missingTables 
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        return { success: result.success, details: result };
      } else {
        return { success: false, details: { error: `HTTP ${response.status}` } };
      }
    } catch (error) {
      return { success: false, details: { error: error } };
    }
  }
  
  /**
   * 智能 RLS 策略修复
   */
  static async intelligentRLSRepair(): Promise<{
    success: boolean;
    strategy: string;
    message: string;
  }> {
    console.log('🔒 开始智能 RLS 策略修复...');
    
    try {
      // 1. 检测 RLS 问题
      const rlsStatus = await this.detectRLSIssues();
      
      if (!rlsStatus.hasIssues) {
        return {
          success: true,
          strategy: 'no_issues',
          message: 'RLS 策略正常，无需修复'
        };
      }
      
      // 2. 选择修复策略
      if (rlsStatus.severity === 'critical') {
        // 临时禁用 RLS
        const disableResult = await this.temporaryDisableRLS();
        return {
          success: disableResult.success,
          strategy: 'temporary_disable',
          message: disableResult.success ? 'RLS 已临时禁用' : 'RLS 禁用失败'
        };
      } else {
        // 修复 RLS 策略
        const repairResult = await this.repairRLSPolicies();
        return {
          success: repairResult.success,
          strategy: 'policy_repair',
          message: repairResult.success ? 'RLS 策略修复成功' : 'RLS 策略修复失败'
        };
      }
      
    } catch (error) {
      console.error('❌ RLS 修复异常:', error);
      return {
        success: false,
        strategy: 'error',
        message: `RLS 修复异常: ${error}`
      };
    }
  }
  
  /**
   * 检测 RLS 问题
   */
  private static async detectRLSIssues(): Promise<{
    hasIssues: boolean;
    severity: 'low' | 'medium' | 'critical';
    issues: string[];
  }> {
    const issues: string[] = [];
    
    try {
      // 测试插入操作
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ user_id: 'test-rls', email: 'test@rls.com' });
      
      if (insertError) {
        if (insertError.code === 'PGRST301' || insertError.message.includes('RLS')) {
          issues.push('RLS 策略阻止插入操作');
        }
      } else {
        // 清理测试数据
        await supabase.from('profiles').delete().eq('user_id', 'test-rls');
      }
      
      // 测试查询操作
      const { error: selectError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (selectError && selectError.message.includes('RLS')) {
        issues.push('RLS 策略阻止查询操作');
      }
      
    } catch (error) {
      issues.push(`RLS 检测异常: ${error}`);
    }
    
    const hasIssues = issues.length > 0;
    const severity = issues.length > 1 ? 'critical' : issues.length === 1 ? 'medium' : 'low';
    
    return { hasIssues, severity, issues };
  }
  
  /**
   * 临时禁用 RLS
   */
  private static async temporaryDisableRLS(): Promise<{ success: boolean }> {
    try {
      const response = await fetch('/api/database-migration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disableRLS' })
      });
      
      return { success: response.ok };
    } catch (error) {
      return { success: false };
    }
  }
  
  /**
   * 修复 RLS 策略
   */
  private static async repairRLSPolicies(): Promise<{ success: boolean }> {
    try {
      const response = await fetch('/api/database-migration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'repairRLS' })
      });
      
      return { success: response.ok };
    } catch (error) {
      return { success: false };
    }
  }
  
  /**
   * 生成修复报告
   */
  static generateRepairReport(results: any[]): {
    summary: string;
    recommendations: string[];
    nextSteps: string[];
  } {
    const summary = `修复流程完成，共执行 ${results.length} 个步骤`;
    
    const recommendations = [
      '定期检查数据库连接状态',
      '监控 Supabase 项目使用情况',
      '备份重要数据',
      '配置适当的 RLS 策略'
    ];
    
    const nextSteps = [
      '验证所有功能正常工作',
      '测试用户注册和登录',
      '检查数据读写操作',
      '监控系统性能'
    ];
    
    return { summary, recommendations, nextSteps };
  }
}
