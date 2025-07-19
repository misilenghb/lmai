import { supabase } from './supabase';

/**
 * 执行完整数据库设置脚本
 * 这个函数会读取SQL文件并在Supabase中执行
 */
export class DatabaseSetupExecutor {
  
  /**
   * 执行完整的数据库设置
   */
  static async executeCompleteSetup(): Promise<{
    success: boolean;
    results: Array<{
      step: string;
      success: boolean;
      error?: any;
      message?: string;
    }>;
    summary: {
      totalSteps: number;
      successfulSteps: number;
      failedSteps: number;
      tablesCreated: string[];
      indexesCreated: number;
      triggersCreated: number;
      policiesCreated: number;
    };
  }> {
    const results: Array<{
      step: string;
      success: boolean;
      error?: any;
      message?: string;
    }> = [];

    console.log('🚀 开始执行完整数据库设置...');

    try {
      // 直接使用SQL内容（避免文件系统操作）
      const sqlContent = this.getSQLContent();

      // 将SQL分割成独立的语句
      const sqlStatements = this.parseSQLStatements(sqlContent);
      
      console.log(`📄 解析到 ${sqlStatements.length} 个SQL语句`);

      // 执行每个SQL语句
      let tablesCreated: string[] = [];
      let indexesCreated = 0;
      let triggersCreated = 0;
      let policiesCreated = 0;

      for (let i = 0; i < sqlStatements.length; i++) {
        const statement = sqlStatements[i];
        const stepName = this.getStatementType(statement);
        
        try {
          console.log(`🔄 执行步骤 ${i + 1}/${sqlStatements.length}: ${stepName}`);
          
          const { error } = await supabase.rpc('exec_sql', { 
            sql: statement 
          });

          if (error) {
            console.error(`❌ 步骤 ${i + 1} 失败:`, error);
            results.push({
              step: `${stepName} (${i + 1}/${sqlStatements.length})`,
              success: false,
              error: error,
              message: error.message || '执行失败'
            });
          } else {
            console.log(`✅ 步骤 ${i + 1} 成功: ${stepName}`);
            results.push({
              step: `${stepName} (${i + 1}/${sqlStatements.length})`,
              success: true,
              message: '执行成功'
            });

            // 统计创建的对象
            if (statement.includes('CREATE TABLE')) {
              const tableName = this.extractTableName(statement);
              if (tableName) tablesCreated.push(tableName);
            } else if (statement.includes('CREATE INDEX')) {
              indexesCreated++;
            } else if (statement.includes('CREATE TRIGGER')) {
              triggersCreated++;
            } else if (statement.includes('CREATE POLICY')) {
              policiesCreated++;
            }
          }
        } catch (error) {
          console.error(`❌ 步骤 ${i + 1} 异常:`, error);
          results.push({
            step: `${stepName} (${i + 1}/${sqlStatements.length})`,
            success: false,
            error: error,
            message: error instanceof Error ? error.message : '执行异常'
          });
        }
      }

      const successfulSteps = results.filter(r => r.success).length;
      const failedSteps = results.filter(r => !r.success).length;

      console.log(`📊 数据库设置完成: ${successfulSteps}/${results.length} 步骤成功`);
      console.log(`📋 创建的表格: ${tablesCreated.join(', ')}`);
      console.log(`📋 创建的索引: ${indexesCreated} 个`);
      console.log(`📋 创建的触发器: ${triggersCreated} 个`);
      console.log(`📋 创建的策略: ${policiesCreated} 个`);

      return {
        success: failedSteps === 0,
        results,
        summary: {
          totalSteps: results.length,
          successfulSteps,
          failedSteps,
          tablesCreated,
          indexesCreated,
          triggersCreated,
          policiesCreated
        }
      };

    } catch (error) {
      console.error('❌ 数据库设置失败:', error);
      return {
        success: false,
        results: [{
          step: '读取SQL文件',
          success: false,
          error: error,
          message: error instanceof Error ? error.message : '未知错误'
        }],
        summary: {
          totalSteps: 0,
          successfulSteps: 0,
          failedSteps: 1,
          tablesCreated: [],
          indexesCreated: 0,
          triggersCreated: 0,
          policiesCreated: 0
        }
      };
    }
  }

  /**
   * 获取SQL内容
   */
  private static getSQLContent(): string {
    return `
-- 水晶日历系统完整数据库表格设置脚本
-- 基于系统功能分析，创建所有必要的数据库表格

-- 1. 用户档案表 (profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  birth_date DATE,
  gender VARCHAR(50),
  zodiac_sign VARCHAR(50),
  chinese_zodiac VARCHAR(50),
  element VARCHAR(50),
  mbti VARCHAR(10),
  answers JSONB DEFAULT '{}',
  chakra_analysis JSONB DEFAULT '{}',
  energy_preferences TEXT[],
  personality_insights TEXT[],
  enhanced_assessment JSONB DEFAULT '{}',
  avatar_url TEXT,
  location VARCHAR(100),
  timezone VARCHAR(50),
  language VARCHAR(10) DEFAULT 'zh',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 设计作品表 (design_works)
CREATE TABLE IF NOT EXISTS design_works (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  profile_id UUID,
  title VARCHAR(200),
  description TEXT,
  prompt TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  style VARCHAR(100),
  category VARCHAR(100),
  crystals_used TEXT[],
  colors TEXT[],
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  generation_params JSONB DEFAULT '{}',
  ai_analysis JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 用户能量记录表 (user_energy_records)
CREATE TABLE IF NOT EXISTS user_energy_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  profile_id UUID,
  date DATE NOT NULL,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  chakra_states JSONB DEFAULT '{}',
  mood_tags TEXT[],
  emotions JSONB DEFAULT '{}',
  activities TEXT[],
  weather VARCHAR(50),
  lunar_phase VARCHAR(50),
  notes TEXT,
  ai_insights JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 4. 冥想会话表 (meditation_sessions)
CREATE TABLE IF NOT EXISTS meditation_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  profile_id UUID,
  session_type VARCHAR(100) NOT NULL,
  title VARCHAR(200),
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  crystals_used TEXT[],
  chakras_focused TEXT[],
  intentions TEXT[],
  guided_audio_url TEXT,
  background_music_url TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  mood_before JSONB DEFAULT '{}',
  mood_after JSONB DEFAULT '{}',
  insights TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 水晶库表 (crystals)
CREATE TABLE IF NOT EXISTS crystals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  english_name VARCHAR(100),
  scientific_name VARCHAR(100),
  crystal_system VARCHAR(50),
  hardness DECIMAL(3,1),
  color_varieties TEXT[],
  chakra_associations TEXT[],
  element_associations TEXT[],
  zodiac_associations TEXT[],
  healing_properties TEXT[],
  metaphysical_properties TEXT[],
  formation_process TEXT,
  geographical_origins TEXT[],
  care_instructions TEXT,
  image_url TEXT,
  thumbnail_url TEXT,
  rarity_level VARCHAR(20),
  market_price_range JSONB DEFAULT '{}',
  scientific_composition TEXT,
  crystal_structure_description TEXT,
  energy_frequency_hz INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 用户收藏水晶表 (user_favorite_crystals)
CREATE TABLE IF NOT EXISTS user_favorite_crystals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  profile_id UUID,
  crystal_id UUID,
  notes TEXT,
  personal_experience TEXT,
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, crystal_id)
);

-- 7. AI对话历史表 (ai_conversations)
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  profile_id UUID,
  conversation_type VARCHAR(100) NOT NULL,
  title VARCHAR(200),
  messages JSONB DEFAULT '[]',
  context JSONB DEFAULT '{}',
  ai_model VARCHAR(100),
  tokens_used INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active',
  tags TEXT[]
);

-- 8. 会员信息表 (membership_info)
CREATE TABLE IF NOT EXISTS membership_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  profile_id UUID,
  membership_type VARCHAR(50) DEFAULT 'free',
  subscription_status VARCHAR(50) DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  auto_renewal BOOLEAN DEFAULT TRUE,
  payment_method JSONB DEFAULT '{}',
  billing_history JSONB DEFAULT '[]',
  features_enabled TEXT[],
  usage_limits JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 9. 使用统计表 (usage_stats)
CREATE TABLE IF NOT EXISTS usage_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  profile_id UUID,
  month DATE NOT NULL,
  designs_generated INTEGER DEFAULT 0,
  images_created INTEGER DEFAULT 0,
  ai_consultations INTEGER DEFAULT 0,
  energy_analyses INTEGER DEFAULT 0,
  meditation_sessions INTEGER DEFAULT 0,
  premium_features_used INTEGER DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  storage_used_mb INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- 10. 用户设置表 (user_settings)
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  profile_id UUID,
  theme VARCHAR(50) DEFAULT 'aura',
  language VARCHAR(10) DEFAULT 'zh',
  timezone VARCHAR(50),
  notification_preferences JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',
  display_preferences JSONB DEFAULT '{}',
  ai_interaction_preferences JSONB DEFAULT '{}',
  energy_tracking_settings JSONB DEFAULT '{}',
  meditation_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 11. 用户行为追踪表 (user_behavior_patterns)
CREATE TABLE IF NOT EXISTS user_behavior_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id VARCHAR(100),
  action VARCHAR(50) NOT NULL,
  page VARCHAR(200),
  duration INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  device_info JSONB DEFAULT '{}',
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. ML预测缓存表 (ml_predictions)
CREATE TABLE IF NOT EXISTS ml_predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  prediction_type VARCHAR(100) NOT NULL,
  input_data JSONB DEFAULT '{}',
  prediction_result JSONB DEFAULT '{}',
  confidence_score DECIMAL(5,4),
  model_version VARCHAR(50),
  cache_key VARCHAR(255) UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. 动态定价规则表 (dynamic_pricing_rules)
CREATE TABLE IF NOT EXISTS dynamic_pricing_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name VARCHAR(100) NOT NULL,
  description TEXT,
  conditions JSONB DEFAULT '{}',
  adjustments JSONB DEFAULT '{}',
  priority INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. A/B测试实验表 (ab_experiments)
CREATE TABLE IF NOT EXISTS ab_experiments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_name VARCHAR(100) NOT NULL,
  description TEXT,
  variants JSONB DEFAULT '{}',
  allocation JSONB DEFAULT '{}',
  target_metrics TEXT[],
  status VARCHAR(50) DEFAULT 'draft',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  sample_size INTEGER,
  confidence_level DECIMAL(5,4) DEFAULT 0.95,
  statistical_power DECIMAL(5,4) DEFAULT 0.80,
  results JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. A/B测试用户分配表 (ab_user_assignments)
CREATE TABLE IF NOT EXISTS ab_user_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID,
  user_id UUID,
  variant VARCHAR(100),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_exposure TIMESTAMP WITH TIME ZONE,
  conversion_events JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  UNIQUE(experiment_id, user_id)
);

-- 16. 分析指标表 (analytics_metrics)
CREATE TABLE IF NOT EXISTS analytics_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name VARCHAR(100) NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  value DECIMAL(15,6),
  dimensions JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID,
  session_id VARCHAR(100),
  experiment_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. 系统日志表 (system_logs)
CREATE TABLE IF NOT EXISTS system_logs (
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
);

-- 18. 缓存管理表 (cache_management)
CREATE TABLE IF NOT EXISTS cache_management (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key VARCHAR(255) UNIQUE NOT NULL,
  cache_type VARCHAR(50) NOT NULL,
  data JSONB,
  expires_at TIMESTAMP WITH TIME ZONE,
  hit_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. 通知管理表 (notifications)
CREATE TABLE IF NOT EXISTS notifications (
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
);

-- 20. 反馈收集表 (user_feedback)
CREATE TABLE IF NOT EXISTS user_feedback (
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
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_design_works_user_id ON design_works(user_id);
CREATE INDEX IF NOT EXISTS idx_energy_records_user_date ON user_energy_records(user_id, date);
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_user_id ON meditation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_crystals_name ON crystals(name);
CREATE INDEX IF NOT EXISTS idx_favorite_crystals_user_id ON user_favorite_crystals(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_behavior_patterns_user_id ON user_behavior_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_user_id ON ml_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_assignments_experiment_id ON ab_user_assignments(experiment_id);
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_timestamp ON analytics_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
    `;
  }

  /**
   * 解析SQL语句
   */
  private static parseSQLStatements(sqlContent: string): string[] {
    // 移除注释
    const cleanedSQL = sqlContent
      .replace(/--.*$/gm, '') // 移除单行注释
      .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释
      .trim();

    // 按分号分割语句
    const statements = cleanedSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.match(/^\s*$/));

    return statements;
  }

  /**
   * 获取SQL语句类型
   */
  private static getStatementType(statement: string): string {
    const upperStatement = statement.toUpperCase().trim();
    
    if (upperStatement.startsWith('CREATE TABLE')) {
      const tableName = this.extractTableName(statement);
      return `创建表: ${tableName}`;
    } else if (upperStatement.startsWith('CREATE INDEX')) {
      return '创建索引';
    } else if (upperStatement.startsWith('CREATE TRIGGER')) {
      return '创建触发器';
    } else if (upperStatement.startsWith('CREATE POLICY')) {
      return '创建策略';
    } else if (upperStatement.startsWith('CREATE OR REPLACE FUNCTION')) {
      return '创建函数';
    } else if (upperStatement.startsWith('ALTER TABLE')) {
      return '修改表结构';
    } else if (upperStatement.startsWith('INSERT INTO')) {
      return '插入数据';
    } else if (upperStatement.startsWith('DROP POLICY')) {
      return '删除策略';
    } else if (upperStatement.startsWith('DO $$')) {
      return '执行脚本块';
    } else {
      return 'SQL语句';
    }
  }

  /**
   * 提取表名
   */
  private static extractTableName(statement: string): string | null {
    const match = statement.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(\w+)/i);
    return match ? match[1] : null;
  }

  /**
   * 验证数据库设置结果
   */
  static async validateSetup(): Promise<{
    success: boolean;
    tableCount: number;
    missingTables: string[];
    existingTables: string[];
  }> {
    const expectedTables = [
      'profiles', 'design_works', 'user_energy_records', 'meditation_sessions',
      'crystals', 'user_favorite_crystals', 'ai_conversations', 'membership_info',
      'usage_stats', 'user_settings', 'user_behavior_patterns', 'ml_predictions',
      'dynamic_pricing_rules', 'ab_experiments', 'ab_user_assignments',
      'analytics_metrics', 'system_logs', 'cache_management', 'notifications',
      'user_feedback'
    ];

    const existingTables: string[] = [];
    const missingTables: string[] = [];

    for (const table of expectedTables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('id')
          .limit(1);

        if (error && error.code === '42P01') {
          missingTables.push(table);
        } else {
          existingTables.push(table);
        }
      } catch (error) {
        missingTables.push(table);
      }
    }

    console.log(`✅ 存在的表格 (${existingTables.length}): ${existingTables.join(', ')}`);
    if (missingTables.length > 0) {
      console.log(`❌ 缺失的表格 (${missingTables.length}): ${missingTables.join(', ')}`);
    }

    return {
      success: missingTables.length === 0,
      tableCount: existingTables.length,
      missingTables,
      existingTables
    };
  }
}

// 导出便捷函数
export const executeCompleteSetup = DatabaseSetupExecutor.executeCompleteSetup;
export const validateDatabaseSetup = DatabaseSetupExecutor.validateSetup;
