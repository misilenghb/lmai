import { createBrowserClient } from '@supabase/ssr';
import type { UserProfileDataOutput } from '@/ai/schemas/user-profile-schemas';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// 在运行时检查环境变量（构建时使用占位符）
if (typeof window !== 'undefined' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  console.warn('Supabase 环境变量未配置，请检查 .env.local 文件中的 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// 数据类型定义
export interface UserProfile {
  id: string;
  user_id: string;
  email?: string;
  name?: string;
  birth_date?: string;
  gender?: string;
  zodiac_sign?: string;
  chinese_zodiac?: string;
  element?: string;
  mbti?: string;
  answers?: any;
  chakra_analysis?: any;
  energy_preferences?: any;
  personality_insights?: any;
  enhanced_assessment?: any;
  created_at: string;
  updated_at?: string;
}

export interface DesignWork {
  id: string;
  user_id: string;
  title?: string;
  prompt?: string;
  url: string;
  style?: string;
  category?: string;
  crystals_used?: string[];
  colors?: string[];
  tags?: string[];
  is_favorite?: boolean;
  share_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface EnergyRecord {
  id: string;
  user_id: string;
  date: string;
  energy_level: number;
  chakra_states: any;
  mood_tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MeditationSession {
  id: string;
  user_id: string;
  session_type: string;
  duration: number;
  crystals_used?: string[];
  notes?: string;
  completed_at: string;
}

export interface MembershipInfo {
  id: string;
  user_id: string;
  type: 'free' | 'premium' | 'ultimate';
  status: 'active' | 'expired' | 'cancelled';
  started_at: string;
  expired_at?: string;
}

export interface UsageStats {
  id: string;
  user_id: string;
  month: string;
  designs_generated: number;
  images_created: number;
  ai_consultations: number;
  energy_analyses: number;
  meditation_sessions: number;
  created_at: string;
  updated_at: string;
}

// 用户档案相关操作
export const profileService = {
  // 获取用户档案（通过用户ID）
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    return data;
  },

  // 获取用户档案（通过邮箱）
  async getUserProfileByEmail(email: string): Promise<UserProfile | null> {
    if (!email || email.trim() === '') {
      console.warn('getUserProfileByEmail: email is required');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email.trim())
        .single();
      
      if (error) {
        // 如果是因为没有找到记录，不输出错误日志
        if (error.code === 'PGRST116') {
          console.log('No user profile found for email:', email);
          return null;
        }
        
        // 如果是权限相关错误 (RLS, 认证问题等)
        if (error.code === 'PGRST001' || error.code === '42501' || error.message?.includes('row-level security')) {
          console.warn('访问被拒绝，可能是由于用户未通过 Supabase 认证或权限不足:', email);
          return null;
        }
        
        console.error('Error fetching user profile by email:', {
          message: error.message || '未知错误',
          code: error.code || '无错误代码',
          details: error.details || '无详细信息',
          hint: error.hint || '无提示',
          email: email
        });
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error fetching user profile by email:', {
        message: error instanceof Error ? error.message : '未知错误',
        email: email,
        error: error
      });
      return null;
    }
  },

  // 创建或更新用户档案
  async upsertUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      console.log('🔄 正在保存用户档案:', profile);
      
      if (!profile.email) {
        console.error('❌ Email is required for profile creation');
        return null;
      }
      
      // 首先检查是否存在该email的用户档案
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', profile.email)
        .single();
      
      let result;
      if (existingProfile) {
        // 更新现有档案
        console.log('📝 更新现有用户档案');
        const { data, error } = await supabase
          .from('profiles')
          .update({
            ...profile,
            updated_at: new Date().toISOString()
          })
          .eq('email', profile.email)
          .select()
          .single();
        result = { data, error };
      } else {
        // 创建新档案
        console.log('✨ 创建新用户档案');
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            ...profile,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        result = { data, error };
      }
      
      if (result.error) {
        console.error('❌ Error saving user profile:', {
          message: result.error.message || '未知错误',
          code: result.error.code || '无错误代码',
          details: result.error.details || '无详细信息',
          hint: result.error.hint || '无提示信息',
          fullError: result.error
        });
        return null;
      }
      
      console.log('✅ 用户档案保存成功:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Unexpected error saving user profile:', error);
      return null;
    }
  },

  // 获取用户所有档案（按创建时间倒序）
  async getUserProfiles(email: string): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });
    
    if (error || !data) {
      console.error('Error fetching user profiles:', error);
      return [];
    }
    return data;
  }
};

// 设计作品相关操作
export const designService = {
  // 获取用户所有设计作品
  async getUserDesigns(userId: string): Promise<DesignWork[]> {
    try {
      if (!userId) {
        console.warn('getUserDesigns: userId is empty');
        return [];
      }

      console.log('Fetching user designs for userId:', userId);
      
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user designs:', {
          error,
          userId,
          table: 'images'
        });
        return [];
      }
      
      console.log(`Found ${data?.length || 0} designs for user ${userId}`);
      return data || [];
    } catch (error) {
      console.error('Unexpected error in getUserDesigns:', error);
      return [];
    }
  },

  // 创建新设计作品
  async createDesign(design: Omit<DesignWork, 'id' | 'created_at' | 'updated_at'>): Promise<DesignWork | null> {
    const { data, error } = await supabase
      .from('images')
      .insert(design)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating design:', error);
      return null;
    }
    return data;
  },

  // 更新设计作品
  async updateDesign(id: string, updates: Partial<DesignWork>): Promise<DesignWork | null> {
    const { data, error } = await supabase
      .from('images')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating design:', error);
      return null;
    }
    return data;
  },

  // 删除设计作品
  async deleteDesign(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting design:', error);
      return false;
    }
    return true;
  },

  // 切换收藏状态
  async toggleFavorite(id: string): Promise<boolean> {
    const { data: current } = await supabase
      .from('images')
      .select('is_favorite')
      .eq('id', id)
      .single();
    
    if (!current) return false;

    const { error } = await supabase
      .from('images')
      .update({ is_favorite: !current.is_favorite })
      .eq('id', id);
    
    return !error;
  }
};

// 能量记录相关操作
export const energyService = {
  // 获取用户能量记录
  async getUserEnergyRecords(userId: string, limit: number = 30): Promise<EnergyRecord[]> {
    try {
      if (!userId) {
        console.warn('getUserEnergyRecords: userId is empty');
        return [];
      }

      console.log('Fetching energy records for userId:', userId);
      
      const { data, error } = await supabase
        .from('user_energy_records')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching energy records:', {
          error,
          userId,
          table: 'user_energy_records'
        });
        return [];
      }
      
      console.log(`Found ${data?.length || 0} energy records for user ${userId}`);
      return data || [];
    } catch (error) {
      console.error('Unexpected error in getUserEnergyRecords:', error);
      return [];
    }
  },

  // 创建或更新每日能量记录
  async upsertEnergyRecord(record: Omit<EnergyRecord, 'id' | 'created_at' | 'updated_at'>): Promise<EnergyRecord | null> {
    const { data, error } = await supabase
      .from('user_energy_records')
      .upsert(record, { onConflict: 'user_id,date' })
      .select()
      .single();
    
    if (error) {
      console.error('Error upserting energy record:', error);
      return null;
    }
    return data;
  }
};

// 冥想会话相关操作
export const meditationService = {
  // 获取用户冥想记录
  async getUserMeditationSessions(userId: string, limit: number = 50): Promise<MeditationSession[]> {
    try {
      if (!userId) {
        console.warn('getUserMeditationSessions: userId is empty');
        return [];
      }

      console.log('Fetching meditation sessions for userId:', userId);
      
      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching meditation sessions:', {
          error,
          userId,
          table: 'meditation_sessions'
        });
        return [];
      }
      
      console.log(`Found ${data?.length || 0} meditation sessions for user ${userId}`);
      return data || [];
    } catch (error) {
      console.error('Unexpected error in getUserMeditationSessions:', error);
      return [];
    }
  },

  // 记录冥想会话
  async recordMeditationSession(session: Omit<MeditationSession, 'id' | 'completed_at'>): Promise<MeditationSession | null> {
    const { data, error } = await supabase
      .from('meditation_sessions')
      .insert(session)
      .select()
      .single();
    
    if (error) {
      console.error('Error recording meditation session:', error);
      return null;
    }
    return data;
  }
};

// 会员相关操作
export const membershipService = {
  // 获取用户会员信息
  async getUserMembership(userId: string): Promise<MembershipInfo | null> {
    try {
      if (!userId) {
        console.warn('getUserMembership: userId is empty');
        return null;
      }

      console.log('Fetching membership for userId:', userId);
      
    const { data, error } = await supabase
        .from('membership_info')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
        console.error('Error fetching membership:', {
          error,
          userId,
          table: 'membership_info'
        });
        return null;
      }
      
      console.log(`Found membership for user ${userId}:`, data);
      return data;
    } catch (error) {
      console.error('Unexpected error in getUserMembership:', error);
      return null;
    }
  },

  // 获取用户使用统计
  async getUserUsageStats(userId: string, months: number = 6): Promise<UsageStats[]> {
    try {
      if (!userId) {
        console.warn('getUserUsageStats: userId is empty');
        return [];
      }

      console.log('Fetching usage stats for userId:', userId);
      
    const { data, error } = await supabase
        .from('usage_stats')
      .select('*')
      .eq('user_id', userId)
      .order('month', { ascending: false })
      .limit(months);
    
    if (error) {
        console.error('Error fetching usage stats:', {
          error,
          userId,
          table: 'usage_stats'
        });
        return [];
      }
      
      console.log(`Found ${data?.length || 0} usage stats for user ${userId}`);
      return data || [];
    } catch (error) {
      console.error('Unexpected error in getUserUsageStats:', error);
      return [];
    }
  },

  // 更新使用统计
  async updateUsageStats(userId: string, updates: Partial<UsageStats>): Promise<boolean> {
    try {
      if (!userId) {
        console.warn('updateUsageStats: userId is empty');
        return false;
      }

    const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
      
      console.log('Updating usage stats for userId:', userId, 'month:', currentMonth);
    
    const { error } = await supabase
        .from('usage_stats')
      .upsert({
        user_id: userId,
        month: currentMonth,
        ...updates
      }, { onConflict: 'user_id,month' });
    
    if (error) {
        console.error('Error updating usage stats:', {
          error,
          userId,
          currentMonth,
          updates,
          table: 'usage_stats'
        });
        return false;
      }
      
      console.log('Successfully updated usage stats for user:', userId);
      return true;
    } catch (error) {
      console.error('Unexpected error in updateUsageStats:', error);
      return false;
    }
  }
};

// 用户设置相关操作
export const settingsService = {
  // 获取用户设置
  async getUserSettings(userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user settings:', error);
      return null;
    }
    return data;
  },

  // 更新用户设置
  async updateUserSettings(userId: string, settings: any): Promise<boolean> {
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        ...settings
      }, { onConflict: 'user_id' });
    
    if (error) {
      console.error('Error updating user settings:', error);
      return false;
    }
    return true;
  }
};

// 获取 Supabase 项目 URL 和密钥（用于客户端配置）
export const getSupabaseConfig = () => ({
  url: supabaseUrl,
  anonKey: supabaseAnonKey
});

// 自动诊断和修复系统
export class AutoDiagnosticSystem {
  private static results: Array<{
    category: string;
    name: string;
    status: 'success' | 'error' | 'warning' | 'info';
    message: string;
    details?: any;
    timestamp: string;
  }> = [];

  private static addResult(category: string, name: string, status: 'success' | 'error' | 'warning' | 'info', message: string, details?: any) {
    this.results.push({
      category,
      name,
      status,
      message,
      details,
      timestamp: new Date().toISOString()
    });
    console.log(`${this.getStatusIcon(status)} [${category}] ${name}: ${message}`);
  }

  private static getStatusIcon(status: string): string {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📋';
    }
  }

  /**
   * 执行完整的自动诊断和修复流程
   */
  static async executeAutoRepair(): Promise<{
    success: boolean;
    results: Array<{
      category: string;
      name: string;
      status: 'success' | 'error' | 'warning' | 'info';
      message: string;
      details?: any;
      timestamp: string;
    }>;
    summary: {
      totalChecks: number;
      successCount: number;
      errorCount: number;
      warningCount: number;
      repairsAttempted: number;
      repairsSuccessful: number;
    };
  }> {
    this.results = [];
    console.log('🚀 开始自动诊断和修复流程...');

    let repairsAttempted = 0;
    let repairsSuccessful = 0;

    try {
      // 1. 环境变量检查
      await this.checkEnvironmentVariables();

      // 2. 网络连接检查
      await this.checkNetworkConnectivity();

      // 3. Supabase 基础连接检查
      const connectionResult = await this.checkSupabaseConnection();

      // 4. 数据库表格检查和修复
      if (connectionResult.canConnect) {
        const tableResult = await this.checkAndRepairTables();
        repairsAttempted += tableResult.repairsAttempted;
        repairsSuccessful += tableResult.repairsSuccessful;

        // 5. RLS 策略检查和修复
        const rlsResult = await this.checkAndRepairRLS();
        repairsAttempted += rlsResult.repairsAttempted;
        repairsSuccessful += rlsResult.repairsSuccessful;

        // 6. 最终连接验证
        await this.finalConnectionTest();
      }

      const summary = this.generateSummary(repairsAttempted, repairsSuccessful);

      console.log('📊 自动修复完成:', summary);

      return {
        success: summary.errorCount === 0,
        results: this.results,
        summary
      };

    } catch (error) {
      this.addResult('系统', '自动修复', 'error', `修复流程异常: ${error}`, error);
      return {
        success: false,
        results: this.results,
        summary: this.generateSummary(repairsAttempted, repairsSuccessful)
      };
    }
  }

  /**
   * 检查环境变量配置
   */
  private static async checkEnvironmentVariables(): Promise<void> {
    this.addResult('环境', '环境变量检查', 'info', '开始检查环境变量配置...');

    const requiredVars = [
      { name: 'NEXT_PUBLIC_SUPABASE_URL', value: supabaseUrl },
      { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: supabaseAnonKey }
    ];

    for (const envVar of requiredVars) {
      if (envVar.value && envVar.value !== 'https://placeholder.supabase.co' && envVar.value !== 'placeholder-anon-key') {
        this.addResult('环境', envVar.name, 'success', '已正确配置', {
          value: envVar.value.substring(0, 50) + '...'
        });
      } else {
        this.addResult('环境', envVar.name, 'error', '未配置或使用占位符值', {
          currentValue: envVar.value,
          required: true
        });
      }
    }
  }

  /**
   * 检查网络连接
   */
  private static async checkNetworkConnectivity(): Promise<void> {
    this.addResult('网络', '网络连接', 'info', '检查网络连接...');

    try {
      // 检查基础网络连接
      const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000) // 10秒超时
      });

      if (response.ok) {
        this.addResult('网络', '基础网络', 'success', '网络连接正常');
      } else {
        this.addResult('网络', '基础网络', 'warning', `网络响应异常: ${response.status}`);
      }
    } catch (error) {
      this.addResult('网络', '基础网络', 'error', `网络连接失败: ${error}`);
    }

    // 检查 Supabase 域名可达性
    if (supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co') {
      try {
        const response = await fetch(supabaseUrl + '/rest/v1/', {
          method: 'HEAD',
          signal: AbortSignal.timeout(10000)
        });
        this.addResult('网络', 'Supabase域名', 'success', 'Supabase 域名可访问');
      } catch (error) {
        this.addResult('网络', 'Supabase域名', 'error', `Supabase 域名无法访问: ${error}`);
      }
    }
  }

  /**
   * 检查 Supabase 连接
   */
  private static async checkSupabaseConnection(): Promise<{ canConnect: boolean; hasAuth: boolean }> {
    this.addResult('数据库', 'Supabase连接', 'info', '测试 Supabase 连接...');

    let canConnect = false;
    let hasAuth = false;

    try {
      // 测试认证服务
      const { data: authData, error: authError } = await supabase.auth.getSession();

      if (authError) {
        this.addResult('数据库', 'Supabase认证', 'warning', `认证服务警告: ${authError.message}`, authError);
      } else {
        hasAuth = true;
        this.addResult('数据库', 'Supabase认证', 'success', '认证服务正常');
      }

      // 测试基础查询 - 尝试查询一个简单的表
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          this.addResult('数据库', 'Supabase查询', 'warning', '数据库连接正常，但表格不存在', {
            code: error.code,
            message: error.message
          });
          canConnect = true; // 连接正常，只是表格不存在
        } else {
          this.addResult('数据库', 'Supabase查询', 'error', `数据库查询失败: ${error.message}`, {
            code: error.code,
            details: error.details
          });
        }
      } else {
        canConnect = true;
        this.addResult('数据库', 'Supabase查询', 'success', `数据库查询成功 (${data?.length || 0} 条记录)`);
      }

    } catch (error) {
      this.addResult('数据库', 'Supabase连接', 'error', `连接异常: ${error}`, error);
    }

    return { canConnect, hasAuth };
  }



  /**
   * 检查和修复数据库表格（使用智能修复）
   */
  private static async checkAndRepairTables(): Promise<{ repairsAttempted: number; repairsSuccessful: number }> {
    this.addResult('数据库', '表格检查', 'info', '检查数据库表格状态...');

    let repairsAttempted = 0;
    let repairsSuccessful = 0;

    try {
      // 导入智能修复系统
      const { IntelligentRepairSystem } = await import('./intelligent-repair');

      // 执行智能表格修复
      const repairResult = await IntelligentRepairSystem.intelligentTableRepair();

      this.addResult('修复', '智能表格修复', repairResult.success ? 'success' : 'error', repairResult.message, {
        strategy: repairResult.strategy,
        results: repairResult.results
      });

      if (repairResult.strategy !== 'no_repair_needed') {
        repairsAttempted++;
        if (repairResult.success) {
          repairsSuccessful++;
        }
      }

      // 验证修复结果
      await this.verifyTableRepair();

    } catch (error) {
      this.addResult('修复', '表格修复', 'error', `智能修复异常: ${error}`, error);
      repairsAttempted++;
    }

    return { repairsAttempted, repairsSuccessful };
  }

  /**
   * 验证表格修复结果
   */
  private static async verifyTableRepair(): Promise<void> {
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

    let successCount = 0;

    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);

        if (error) {
          if (error.code === '42P01') {
            this.addResult('验证', `表格${table}`, 'warning', '表格仍不存在');
          } else {
            this.addResult('验证', `表格${table}`, 'error', `访问错误: ${error.message}`);
          }
        } else {
          this.addResult('验证', `表格${table}`, 'success', `验证通过 (${data?.length || 0} 条记录)`);
          successCount++;
        }
      } catch (error) {
        this.addResult('验证', `表格${table}`, 'error', `验证异常: ${error}`);
      }
    }

    this.addResult('验证', '表格验证汇总', 'info', `${successCount}/${requiredTables.length} 个表格验证通过`);
  }

  /**
   * 检查和修复 RLS 策略（使用智能修复）
   */
  private static async checkAndRepairRLS(): Promise<{ repairsAttempted: number; repairsSuccessful: number }> {
    this.addResult('安全', 'RLS策略', 'info', '检查行级安全策略...');

    let repairsAttempted = 0;
    let repairsSuccessful = 0;

    try {
      // 导入智能修复系统
      const { IntelligentRepairSystem } = await import('./intelligent-repair');

      // 执行智能 RLS 修复
      const rlsResult = await IntelligentRepairSystem.intelligentRLSRepair();

      this.addResult('修复', '智能RLS修复', rlsResult.success ? 'success' : 'error', rlsResult.message, {
        strategy: rlsResult.strategy
      });

      if (rlsResult.strategy !== 'no_issues') {
        repairsAttempted++;
        if (rlsResult.success) {
          repairsSuccessful++;
        }
      }

      // 验证 RLS 修复结果
      await this.verifyRLSRepair();

    } catch (error) {
      this.addResult('安全', 'RLS策略', 'error', `智能RLS修复异常: ${error}`, error);
      repairsAttempted++;
    }

    return { repairsAttempted, repairsSuccessful };
  }

  /**
   * 验证 RLS 修复结果
   */
  private static async verifyRLSRepair(): Promise<void> {
    try {
      // 测试基础查询操作
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (error) {
        if (error.code === 'PGRST301' || error.message.includes('RLS')) {
          this.addResult('验证', 'RLS验证', 'warning', 'RLS 策略仍然阻止访问');
        } else if (error.code === '42P01') {
          this.addResult('验证', 'RLS验证', 'info', '表格不存在，跳过RLS验证');
        } else {
          this.addResult('验证', 'RLS验证', 'error', `RLS验证失败: ${error.message}`);
        }
      } else {
        this.addResult('验证', 'RLS验证', 'success', 'RLS 策略验证通过');
      }
    } catch (error) {
      this.addResult('验证', 'RLS验证', 'error', `RLS验证异常: ${error}`);
    }
  }

  /**
   * 最终连接测试
   */
  private static async finalConnectionTest(): Promise<void> {
    this.addResult('验证', '最终测试', 'info', '执行最终连接验证...');

    try {
      // 测试基本的 CRUD 操作
      const testOperations = [
        { name: '查询操作', test: () => supabase.from('profiles').select('id').limit(1) },
        { name: '认证状态', test: () => supabase.auth.getSession() }
      ];

      for (const operation of testOperations) {
        try {
          const { error } = await operation.test();
          if (error && error.code !== '42P01') {
            this.addResult('验证', operation.name, 'error', `操作失败: ${error.message}`, error);
          } else {
            this.addResult('验证', operation.name, 'success', '操作正常');
          }
        } catch (error) {
          this.addResult('验证', operation.name, 'error', `操作异常: ${error}`, error);
        }
      }
    } catch (error) {
      this.addResult('验证', '最终测试', 'error', `验证异常: ${error}`, error);
    }
  }

  /**
   * 生成修复摘要
   */
  private static generateSummary(repairsAttempted: number, repairsSuccessful: number) {
    const totalChecks = this.results.length;
    const successCount = this.results.filter(r => r.status === 'success').length;
    const errorCount = this.results.filter(r => r.status === 'error').length;
    const warningCount = this.results.filter(r => r.status === 'warning').length;

    return {
      totalChecks,
      successCount,
      errorCount,
      warningCount,
      repairsAttempted,
      repairsSuccessful
    };
  }

  /**
   * 获取修复建议
   */
  static getRepairSuggestions(): string[] {
    const suggestions: string[] = [];
    const errors = this.results.filter(r => r.status === 'error');

    if (errors.some(e => e.name.includes('NEXT_PUBLIC_SUPABASE'))) {
      suggestions.push('在 Cloudflare Pages 控制台中配置 Supabase 环境变量');
    }

    if (errors.some(e => e.category === '网络')) {
      suggestions.push('检查网络连接和 Supabase 项目状态');
    }

    if (errors.some(e => e.category === '数据库')) {
      suggestions.push('运行数据库迁移创建缺失的表格');
    }

    if (errors.some(e => e.name.includes('RLS'))) {
      suggestions.push('配置或临时禁用行级安全策略');
    }

    if (suggestions.length === 0) {
      suggestions.push('所有检查通过，系统运行正常');
    }

    return suggestions;
  }
}

// 测试 Supabase 连接
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 开始 Supabase 连接测试...');
    console.log('📋 Supabase 配置状态:', {
      url: supabaseUrl ? `✅ 已配置 (${supabaseUrl})` : '❌ 未配置',
      anonKey: supabaseAnonKey ? `✅ 已配置 (${supabaseAnonKey.substring(0, 50)}...)` : '❌ 未配置'
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      const error = 'Supabase 环境变量未配置';
      console.error('❌', error);
      throw new Error(error);
    }

    // 测试1: 基础认证服务连接
    console.log('🔌 测试1: 认证服务连接...');
    try {
      const { data: authData, error: authError } = await supabase.auth.getSession();

      if (authError) {
        console.error('❌ 认证服务连接失败:', JSON.stringify(authError, null, 2));
        throw authError;
      }

      console.log('✅ 认证服务连接成功');
    } catch (authErr: any) {
      console.error('❌ 认证服务异常:', JSON.stringify(authErr, null, 2));
      throw authErr;
    }

    // 测试2: 使用最简单的查询测试数据库连接
    console.log('🗄️ 测试2: 数据库连接（使用最简单查询）...');
    try {
      const { data, error, status, statusText } = await supabase
        .from('user_energy_records')
        .select('id')
        .limit(1);

      console.log('📊 查询响应状态:', {
        status,
        statusText,
        hasData: !!data,
        hasError: !!error,
        dataLength: data ? data.length : 0
      });

      if (error) {
        console.log('⚠️ user_energy_records 表查询失败');
        console.error('❌ 数据库连接失败:', JSON.stringify(error, null, 2));

        // 尝试其他表
        console.log('🔄 尝试其他表...');
        const { data: imagesData, error: imagesError } = await supabase
          .from('images')
          .select('id')
          .limit(1);

        if (imagesError) {
          console.error('❌ images 表也失败:', JSON.stringify(imagesError, null, 2));
          throw error; // 抛出原始错误
        } else {
          console.log('✅ images 表连接成功');
          return true;
        }
      }

      console.log('✅ 数据库连接成功', data ? `(找到 ${data.length} 条记录)` : '(空表)');
      console.log('🎉 Supabase 连接测试完全成功！');
      return true;

    } catch (dbErr: any) {
      console.error('❌ 数据库连接异常:', JSON.stringify(dbErr, null, 2));
      throw dbErr;
    }

  } catch (error: any) {
    const errorInfo = {
      name: error?.name || '未知错误类型',
      message: error?.message || '未知错误信息',
      code: error?.code || '无错误代码',
      details: error?.details || '无详细信息',
      hint: error?.hint || '无提示',
      stack: error?.stack ? error.stack.split('\n').slice(0, 3).join('\n') : '无堆栈信息',
      fullError: JSON.stringify(error, null, 2)
    };

    console.error('💥 Supabase 连接测试失败:', errorInfo);

    // 提供解决建议
    if (!supabaseUrl || !supabaseAnonKey) {
      console.log('💡 解决建议: 请检查 .env.local 文件中的 Supabase 配置');
    } else if (error?.message?.includes('Failed to fetch') || error?.message?.includes('network')) {
      console.log('💡 解决建议: 请检查网络连接或 Supabase 项目状态');
    } else if (error?.code === '42P01') {
      console.log('💡 解决建议: 数据库表需要初始化，请运行数据库迁移');
    } else if (error?.code === 'PGRST301') {
      console.log('💡 解决建议: 可能是 RLS (Row Level Security) 权限问题');
    }

    return false;
  }
};