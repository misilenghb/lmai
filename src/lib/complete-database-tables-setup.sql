-- 水晶日历系统完整数据库表格设置脚本
-- 基于系统功能分析，创建所有必要的数据库表格
-- 执行时间: 2025-01-18

-- ============================================================================
-- 第一部分：核心功能表格
-- ============================================================================

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

-- ============================================================================
-- 第二部分：高级功能表格 (ML、分析、A/B测试等)
-- ============================================================================

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

-- ============================================================================
-- 第三部分：索引优化
-- ============================================================================

-- 核心表索引
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_design_works_user_id ON design_works(user_id);
CREATE INDEX IF NOT EXISTS idx_design_works_created_at ON design_works(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_energy_records_user_date ON user_energy_records(user_id, date);
CREATE INDEX IF NOT EXISTS idx_energy_records_date ON user_energy_records(date);
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_user_id ON meditation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_crystals_name ON crystals(name);
CREATE INDEX IF NOT EXISTS idx_favorite_crystals_user_id ON user_favorite_crystals(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);

-- 高级功能索引
CREATE INDEX IF NOT EXISTS idx_behavior_patterns_user_id ON user_behavior_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_behavior_patterns_created_at ON user_behavior_patterns(created_at);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_user_id ON ml_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_cache_key ON ml_predictions(cache_key);
CREATE INDEX IF NOT EXISTS idx_ab_assignments_experiment_id ON ab_user_assignments(experiment_id);
CREATE INDEX IF NOT EXISTS idx_ab_assignments_user_id ON ab_user_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_timestamp ON analytics_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_user_id ON analytics_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);

-- JSONB字段索引
CREATE INDEX IF NOT EXISTS idx_profiles_answers_gin ON profiles USING GIN(answers);
CREATE INDEX IF NOT EXISTS idx_design_works_generation_params_gin ON design_works USING GIN(generation_params);
CREATE INDEX IF NOT EXISTS idx_energy_records_chakra_states_gin ON user_energy_records USING GIN(chakra_states);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_result_gin ON ml_predictions USING GIN(prediction_result);

-- ============================================================================
-- 第四部分：触发器和函数
-- ============================================================================

-- 更新时间戳函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加更新时间戳触发器
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_design_works_updated_at BEFORE UPDATE ON design_works
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_energy_records_updated_at BEFORE UPDATE ON user_energy_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crystals_updated_at BEFORE UPDATE ON crystals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_membership_info_updated_at BEFORE UPDATE ON membership_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_stats_updated_at BEFORE UPDATE ON usage_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_rules_updated_at BEFORE UPDATE ON dynamic_pricing_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ab_experiments_updated_at BEFORE UPDATE ON ab_experiments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cache_management_updated_at BEFORE UPDATE ON cache_management
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_feedback_updated_at BEFORE UPDATE ON user_feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 第五部分：行级安全策略 (RLS)
-- ============================================================================

-- 启用行级安全
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_energy_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorite_crystals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_user_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- 用户档案策略
DROP POLICY IF EXISTS "Users can manage their own profiles" ON profiles;
CREATE POLICY "Users can manage their own profiles" ON profiles
    FOR ALL USING (auth.uid()::text = user_id::text OR email = auth.jwt() ->> 'email');

-- 设计作品策略
DROP POLICY IF EXISTS "Users can manage their own designs" ON design_works;
CREATE POLICY "Users can manage their own designs" ON design_works
    FOR ALL USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Public designs are viewable" ON design_works;
CREATE POLICY "Public designs are viewable" ON design_works
    FOR SELECT USING (is_public = true);

-- 能量记录策略
DROP POLICY IF EXISTS "Users can manage their own energy records" ON user_energy_records;
CREATE POLICY "Users can manage their own energy records" ON user_energy_records
    FOR ALL USING (auth.uid()::text = user_id::text);

-- 冥想会话策略
DROP POLICY IF EXISTS "Users can manage their own meditation sessions" ON meditation_sessions;
CREATE POLICY "Users can manage their own meditation sessions" ON meditation_sessions
    FOR ALL USING (auth.uid()::text = user_id::text);

-- 收藏水晶策略
DROP POLICY IF EXISTS "Users can manage their own favorite crystals" ON user_favorite_crystals;
CREATE POLICY "Users can manage their own favorite crystals" ON user_favorite_crystals
    FOR ALL USING (auth.uid()::text = user_id::text);

-- AI对话策略
DROP POLICY IF EXISTS "Users can manage their own conversations" ON ai_conversations;
CREATE POLICY "Users can manage their own conversations" ON ai_conversations
    FOR ALL USING (auth.uid()::text = user_id::text);

-- 会员信息策略
DROP POLICY IF EXISTS "Users can view their own membership info" ON membership_info;
CREATE POLICY "Users can view their own membership info" ON membership_info
    FOR ALL USING (auth.uid()::text = user_id::text);

-- 使用统计策略
DROP POLICY IF EXISTS "Users can view their own usage stats" ON usage_stats;
CREATE POLICY "Users can view their own usage stats" ON usage_stats
    FOR ALL USING (auth.uid()::text = user_id::text);

-- 用户设置策略
DROP POLICY IF EXISTS "Users can manage their own settings" ON user_settings;
CREATE POLICY "Users can manage their own settings" ON user_settings
    FOR ALL USING (auth.uid()::text = user_id::text);

-- 用户行为策略
DROP POLICY IF EXISTS "Users can view their own behavior patterns" ON user_behavior_patterns;
CREATE POLICY "Users can view their own behavior patterns" ON user_behavior_patterns
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- ML预测策略
DROP POLICY IF EXISTS "Users can view their own predictions" ON ml_predictions;
CREATE POLICY "Users can view their own predictions" ON ml_predictions
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- A/B测试分配策略
DROP POLICY IF EXISTS "Users can view their own assignments" ON ab_user_assignments;
CREATE POLICY "Users can view their own assignments" ON ab_user_assignments
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- 通知策略
DROP POLICY IF EXISTS "Users can manage their own notifications" ON notifications;
CREATE POLICY "Users can manage their own notifications" ON notifications
    FOR ALL USING (auth.uid()::text = user_id::text);

-- 反馈策略
DROP POLICY IF EXISTS "Users can manage their own feedback" ON user_feedback;
CREATE POLICY "Users can manage their own feedback" ON user_feedback
    FOR ALL USING (auth.uid()::text = user_id::text);

-- ============================================================================
-- 第六部分：基础数据插入
-- ============================================================================

-- 插入基础水晶数据
INSERT INTO crystals (name, english_name, scientific_name, crystal_system, hardness, color_varieties, chakra_associations, element_associations, zodiac_associations, healing_properties, metaphysical_properties, formation_process, geographical_origins, care_instructions, rarity_level, energy_frequency_hz) VALUES
('紫水晶', 'Amethyst', 'Silicon Dioxide', 'Hexagonal', 7.0, ARRAY['Purple', 'Lavender', 'Deep Purple'], ARRAY['Crown', 'Third Eye'], ARRAY['Air', 'Water'], ARRAY['Pisces', 'Virgo', 'Aquarius'], ARRAY['Calming', 'Spiritual Protection', 'Enhanced Intuition'], ARRAY['Spiritual Awareness', 'Meditation Enhancement', 'Psychic Protection'], 'Formed in volcanic rock cavities through slow crystallization', ARRAY['Brazil', 'Uruguay', 'Madagascar', 'Russia'], 'Cleanse with moonlight, avoid direct sunlight', 'Common', 32768),
('白水晶', 'Clear Quartz', 'Silicon Dioxide', 'Hexagonal', 7.0, ARRAY['Clear', 'White', 'Transparent'], ARRAY['Crown', 'All Chakras'], ARRAY['All Elements'], ARRAY['All Signs'], ARRAY['Amplification', 'Clarity', 'Healing'], ARRAY['Master Healer', 'Energy Amplification', 'Programmable'], 'Formed through hydrothermal processes in igneous and metamorphic rocks', ARRAY['Brazil', 'Arkansas', 'Madagascar', 'Himalayas'], 'Cleanse with running water, charge in sunlight or moonlight', 'Very Common', 32768),
('粉水晶', 'Rose Quartz', 'Silicon Dioxide', 'Hexagonal', 7.0, ARRAY['Pink', 'Rose', 'Pale Pink'], ARRAY['Heart'], ARRAY['Water'], ARRAY['Taurus', 'Libra'], ARRAY['Love', 'Emotional Healing', 'Self-Love'], ARRAY['Unconditional Love', 'Emotional Balance', 'Heart Healing'], 'Formed through slow cooling of magma with trace amounts of titanium', ARRAY['Brazil', 'Madagascar', 'India', 'South Dakota'], 'Cleanse with moonlight, charge with love intentions', 'Common', 16384),
('黑曜石', 'Obsidian', 'Volcanic Glass', 'Amorphous', 5.5, ARRAY['Black', 'Mahogany', 'Snowflake'], ARRAY['Root'], ARRAY['Fire', 'Earth'], ARRAY['Scorpio', 'Sagittarius'], ARRAY['Protection', 'Grounding', 'Truth'], ARRAY['Psychic Protection', 'Negative Energy Removal', 'Truth Revelation'], 'Formed from rapidly cooling volcanic lava', ARRAY['Mexico', 'Iceland', 'Turkey', 'Armenia'], 'Cleanse with sage, charge on earth', 'Common', 8192),
('青金石', 'Lapis Lazuli', 'Complex Mineral', 'Cubic', 5.5, ARRAY['Deep Blue', 'Royal Blue', 'Blue with Gold'], ARRAY['Throat', 'Third Eye'], ARRAY['Air', 'Water'], ARRAY['Sagittarius', 'Pisces'], ARRAY['Communication', 'Wisdom', 'Truth'], ARRAY['Inner Truth', 'Royal Virtues', 'Spiritual Insight'], 'Formed through contact metamorphism of limestone', ARRAY['Afghanistan', 'Chile', 'Russia', 'Myanmar'], 'Cleanse with dry methods, avoid water', 'Rare', 65536)
ON CONFLICT (name) DO NOTHING;

-- 插入基础动态定价规则
INSERT INTO dynamic_pricing_rules (rule_name, description, conditions, adjustments, priority, active) VALUES
('新用户欢迎折扣', '新注册用户首次购买享受20%折扣', '{"days_since_signup": {"max": 7}, "order_count": {"max": 0}}', '{"discount_percentage": 20, "max_discount": 50}', 100, true),
('高活跃用户奖励', '高活跃用户享受10%折扣', '{"engagement_score": {"min": 80}, "monthly_sessions": {"min": 10}}', '{"discount_percentage": 10}', 80, true),
('批量购买优惠', '购买多件商品享受递增折扣', '{"cart_item_count": {"min": 3}}', '{"discount_percentage": 15, "bulk_bonus": 5}', 60, true)
ON CONFLICT (rule_name) DO NOTHING;

-- 插入基础A/B测试实验
INSERT INTO ab_experiments (experiment_name, description, variants, allocation, target_metrics, status) VALUES
('设计界面优化', '测试新的设计界面布局对用户参与度的影响', '{"control": {"layout": "original"}, "variant_a": {"layout": "simplified"}, "variant_b": {"layout": "enhanced"}}', '{"control": 34, "variant_a": 33, "variant_b": 33}', ARRAY['engagement_rate', 'design_completion_rate'], 'draft'),
('推荐算法测试', '测试不同推荐算法对用户满意度的影响', '{"control": {"algorithm": "collaborative"}, "variant_a": {"algorithm": "content_based"}, "variant_b": {"algorithm": "hybrid"}}', '{"control": 50, "variant_a": 25, "variant_b": 25}', ARRAY['user_satisfaction', 'click_through_rate'], 'draft')
ON CONFLICT (experiment_name) DO NOTHING;

-- ============================================================================
-- 完成信息
-- ============================================================================

-- 显示创建完成信息
DO $$
BEGIN
    RAISE NOTICE '=================================================================';
    RAISE NOTICE '水晶日历系统数据库表格创建完成！';
    RAISE NOTICE '=================================================================';
    RAISE NOTICE '已创建的表格数量: 20个';
    RAISE NOTICE '核心功能表格: 10个 (profiles, design_works, user_energy_records, 等)';
    RAISE NOTICE '高级功能表格: 10个 (user_behavior_patterns, ml_predictions, 等)';
    RAISE NOTICE '已创建索引数量: 20+个';
    RAISE NOTICE '已设置触发器: 11个';
    RAISE NOTICE '已配置RLS策略: 14个表格';
    RAISE NOTICE '已插入基础数据: 水晶库、定价规则、A/B测试';
    RAISE NOTICE '=================================================================';
    RAISE NOTICE '建议下一步操作:';
    RAISE NOTICE '1. 在应用中测试数据库连接';
    RAISE NOTICE '2. 运行数据库诊断检查';
    RAISE NOTICE '3. 测试用户注册和档案创建';
    RAISE NOTICE '4. 验证RLS策略是否正常工作';
    RAISE NOTICE '=================================================================';
END $$;
