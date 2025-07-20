-- 修复缺失字段的SQL脚本
-- 执行时间: 2025-01-18

-- ============================================================================
-- 核心功能表修复
-- ============================================================================

-- 1. 修复 design_works 表
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS profile_id UUID;
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS title VARCHAR(200);
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS prompt TEXT;
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL;
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS style VARCHAR(100);
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS crystals_used TEXT[];
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS colors TEXT[];
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS generation_params JSONB DEFAULT '{}';
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS ai_analysis JSONB DEFAULT '{}';
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. 修复 user_energy_records 表
ALTER TABLE user_energy_records ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE user_energy_records ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE user_energy_records ADD COLUMN IF NOT EXISTS profile_id UUID;
ALTER TABLE user_energy_records ADD COLUMN IF NOT EXISTS date DATE NOT NULL;
ALTER TABLE user_energy_records ADD COLUMN IF NOT EXISTS energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10);
ALTER TABLE user_energy_records ADD COLUMN IF NOT EXISTS chakra_states JSONB DEFAULT '{}';
ALTER TABLE user_energy_records ADD COLUMN IF NOT EXISTS mood_tags TEXT[];
ALTER TABLE user_energy_records ADD COLUMN IF NOT EXISTS emotions JSONB DEFAULT '{}';
ALTER TABLE user_energy_records ADD COLUMN IF NOT EXISTS activities TEXT[];
ALTER TABLE user_energy_records ADD COLUMN IF NOT EXISTS weather VARCHAR(50);
ALTER TABLE user_energy_records ADD COLUMN IF NOT EXISTS lunar_phase VARCHAR(50);
ALTER TABLE user_energy_records ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE user_energy_records ADD COLUMN IF NOT EXISTS ai_insights JSONB DEFAULT '{}';
ALTER TABLE user_energy_records ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE user_energy_records ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. 修复 meditation_sessions 表
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS profile_id UUID;
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS session_type VARCHAR(100) NOT NULL;
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS title VARCHAR(200);
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS duration_minutes INTEGER NOT NULL;
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS crystals_used TEXT[];
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS chakras_focused TEXT[];
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS intentions TEXT[];
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS guided_audio_url TEXT;
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS background_music_url TEXT;
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5);
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS mood_before JSONB DEFAULT '{}';
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS mood_after JSONB DEFAULT '{}';
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS insights TEXT;
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE meditation_sessions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. 修复 crystals 表（添加缺失字段）
ALTER TABLE crystals ADD COLUMN IF NOT EXISTS english_name VARCHAR(100);
ALTER TABLE crystals ADD COLUMN IF NOT EXISTS scientific_name VARCHAR(100);
ALTER TABLE crystals ADD COLUMN IF NOT EXISTS crystal_system VARCHAR(50);
ALTER TABLE crystals ADD COLUMN IF NOT EXISTS color_varieties TEXT[];
ALTER TABLE crystals ADD COLUMN IF NOT EXISTS chakra_associations TEXT[];
ALTER TABLE crystals ADD COLUMN IF NOT EXISTS element_associations TEXT[];
ALTER TABLE crystals ADD COLUMN IF NOT EXISTS zodiac_associations TEXT[];
ALTER TABLE crystals ADD COLUMN IF NOT EXISTS formation_process TEXT;
ALTER TABLE crystals ADD COLUMN IF NOT EXISTS geographical_origins TEXT[];
ALTER TABLE crystals ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE crystals ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE crystals ADD COLUMN IF NOT EXISTS rarity_level VARCHAR(20);
ALTER TABLE crystals ADD COLUMN IF NOT EXISTS market_price_range JSONB DEFAULT '{}';
ALTER TABLE crystals ADD COLUMN IF NOT EXISTS scientific_composition TEXT;
ALTER TABLE crystals ADD COLUMN IF NOT EXISTS crystal_structure_description TEXT;
ALTER TABLE crystals ADD COLUMN IF NOT EXISTS energy_frequency_hz INTEGER;

-- 5. 修复 user_favorite_crystals 表
ALTER TABLE user_favorite_crystals ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE user_favorite_crystals ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE user_favorite_crystals ADD COLUMN IF NOT EXISTS profile_id UUID;
ALTER TABLE user_favorite_crystals ADD COLUMN IF NOT EXISTS crystal_id UUID;
ALTER TABLE user_favorite_crystals ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE user_favorite_crystals ADD COLUMN IF NOT EXISTS personal_experience TEXT;
ALTER TABLE user_favorite_crystals ADD COLUMN IF NOT EXISTS effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5);
ALTER TABLE user_favorite_crystals ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================================================
-- AI和分析表修复
-- ============================================================================

-- 6. 修复 ai_conversations 表
ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS profile_id UUID;
ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS conversation_type VARCHAR(100) NOT NULL;
ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS title VARCHAR(200);
ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS messages JSONB DEFAULT '[]';
ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS context JSONB DEFAULT '{}';
ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS ai_model VARCHAR(100);
ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS tokens_used INTEGER DEFAULT 0;
ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS tags TEXT[];

-- 7. 修复 ml_predictions 表
ALTER TABLE ml_predictions ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE ml_predictions ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE ml_predictions ADD COLUMN IF NOT EXISTS prediction_type VARCHAR(100) NOT NULL;
ALTER TABLE ml_predictions ADD COLUMN IF NOT EXISTS input_data JSONB DEFAULT '{}';
ALTER TABLE ml_predictions ADD COLUMN IF NOT EXISTS prediction_result JSONB DEFAULT '{}';
ALTER TABLE ml_predictions ADD COLUMN IF NOT EXISTS confidence_score DECIMAL(5,4);
ALTER TABLE ml_predictions ADD COLUMN IF NOT EXISTS model_version VARCHAR(50);
ALTER TABLE ml_predictions ADD COLUMN IF NOT EXISTS cache_key VARCHAR(255) UNIQUE;
ALTER TABLE ml_predictions ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE ml_predictions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE ml_predictions ADD COLUMN IF NOT EXISTS last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 8. 修复 analytics_metrics 表
ALTER TABLE analytics_metrics ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE analytics_metrics ADD COLUMN IF NOT EXISTS metric_name VARCHAR(100) NOT NULL;
ALTER TABLE analytics_metrics ADD COLUMN IF NOT EXISTS metric_type VARCHAR(50) NOT NULL;
ALTER TABLE analytics_metrics ADD COLUMN IF NOT EXISTS value DECIMAL(15,6);
ALTER TABLE analytics_metrics ADD COLUMN IF NOT EXISTS dimensions JSONB DEFAULT '{}';
ALTER TABLE analytics_metrics ADD COLUMN IF NOT EXISTS timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE analytics_metrics ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE analytics_metrics ADD COLUMN IF NOT EXISTS session_id VARCHAR(100);
ALTER TABLE analytics_metrics ADD COLUMN IF NOT EXISTS experiment_id UUID;
ALTER TABLE analytics_metrics ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE analytics_metrics ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================================================
-- 用户管理表修复
-- ============================================================================

-- 9. 修复 membership_info 表
ALTER TABLE membership_info ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE membership_info ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE membership_info ADD COLUMN IF NOT EXISTS profile_id UUID;
ALTER TABLE membership_info ADD COLUMN IF NOT EXISTS membership_type VARCHAR(50) DEFAULT 'free';
ALTER TABLE membership_info ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'active';
ALTER TABLE membership_info ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE membership_info ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE membership_info ADD COLUMN IF NOT EXISTS auto_renewal BOOLEAN DEFAULT TRUE;
ALTER TABLE membership_info ADD COLUMN IF NOT EXISTS payment_method JSONB DEFAULT '{}';
ALTER TABLE membership_info ADD COLUMN IF NOT EXISTS billing_history JSONB DEFAULT '[]';
ALTER TABLE membership_info ADD COLUMN IF NOT EXISTS features_enabled TEXT[];
ALTER TABLE membership_info ADD COLUMN IF NOT EXISTS usage_limits JSONB DEFAULT '{}';
ALTER TABLE membership_info ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE membership_info ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 10. 修复 usage_stats 表
ALTER TABLE usage_stats ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE usage_stats ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE usage_stats ADD COLUMN IF NOT EXISTS profile_id UUID;
ALTER TABLE usage_stats ADD COLUMN IF NOT EXISTS month DATE NOT NULL;
ALTER TABLE usage_stats ADD COLUMN IF NOT EXISTS designs_generated INTEGER DEFAULT 0;
ALTER TABLE usage_stats ADD COLUMN IF NOT EXISTS images_created INTEGER DEFAULT 0;
ALTER TABLE usage_stats ADD COLUMN IF NOT EXISTS ai_consultations INTEGER DEFAULT 0;
ALTER TABLE usage_stats ADD COLUMN IF NOT EXISTS energy_analyses INTEGER DEFAULT 0;
ALTER TABLE usage_stats ADD COLUMN IF NOT EXISTS meditation_sessions INTEGER DEFAULT 0;
ALTER TABLE usage_stats ADD COLUMN IF NOT EXISTS premium_features_used INTEGER DEFAULT 0;
ALTER TABLE usage_stats ADD COLUMN IF NOT EXISTS api_calls INTEGER DEFAULT 0;
ALTER TABLE usage_stats ADD COLUMN IF NOT EXISTS storage_used_mb INTEGER DEFAULT 0;
ALTER TABLE usage_stats ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE usage_stats ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 11. 修复 user_settings 表
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS profile_id UUID;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS theme VARCHAR(50) DEFAULT 'aura';
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'zh';
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS timezone VARCHAR(50);
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{}';
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{}';
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS display_preferences JSONB DEFAULT '{}';
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS ai_interaction_preferences JSONB DEFAULT '{}';
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS energy_tracking_settings JSONB DEFAULT '{}';
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS meditation_preferences JSONB DEFAULT '{}';
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 12. 修复 user_behavior_patterns 表
ALTER TABLE user_behavior_patterns ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE user_behavior_patterns ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE user_behavior_patterns ADD COLUMN IF NOT EXISTS session_id VARCHAR(100);
ALTER TABLE user_behavior_patterns ADD COLUMN IF NOT EXISTS action VARCHAR(50) NOT NULL;
ALTER TABLE user_behavior_patterns ADD COLUMN IF NOT EXISTS page VARCHAR(200);
ALTER TABLE user_behavior_patterns ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 0;
ALTER TABLE user_behavior_patterns ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE user_behavior_patterns ADD COLUMN IF NOT EXISTS device_info JSONB DEFAULT '{}';
ALTER TABLE user_behavior_patterns ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE user_behavior_patterns ADD COLUMN IF NOT EXISTS ip_address INET;
ALTER TABLE user_behavior_patterns ADD COLUMN IF NOT EXISTS referrer TEXT;
ALTER TABLE user_behavior_patterns ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================================================
-- 系统表修复
-- ============================================================================

-- 13. 修复 dynamic_pricing_rules 表
ALTER TABLE dynamic_pricing_rules ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE dynamic_pricing_rules ADD COLUMN IF NOT EXISTS rule_name VARCHAR(100) NOT NULL;
ALTER TABLE dynamic_pricing_rules ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE dynamic_pricing_rules ADD COLUMN IF NOT EXISTS conditions JSONB DEFAULT '{}';
ALTER TABLE dynamic_pricing_rules ADD COLUMN IF NOT EXISTS adjustments JSONB DEFAULT '{}';
ALTER TABLE dynamic_pricing_rules ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;
ALTER TABLE dynamic_pricing_rules ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;
ALTER TABLE dynamic_pricing_rules ADD COLUMN IF NOT EXISTS valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE dynamic_pricing_rules ADD COLUMN IF NOT EXISTS valid_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE dynamic_pricing_rules ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;
ALTER TABLE dynamic_pricing_rules ADD COLUMN IF NOT EXISTS success_rate DECIMAL(5,4);
ALTER TABLE dynamic_pricing_rules ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE dynamic_pricing_rules ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 14. 修复 ab_experiments 表
ALTER TABLE ab_experiments ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE ab_experiments ADD COLUMN IF NOT EXISTS experiment_name VARCHAR(100) NOT NULL;
ALTER TABLE ab_experiments ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE ab_experiments ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '{}';
ALTER TABLE ab_experiments ADD COLUMN IF NOT EXISTS allocation JSONB DEFAULT '{}';
ALTER TABLE ab_experiments ADD COLUMN IF NOT EXISTS target_metrics TEXT[];
ALTER TABLE ab_experiments ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft';
ALTER TABLE ab_experiments ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE ab_experiments ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE ab_experiments ADD COLUMN IF NOT EXISTS sample_size INTEGER;
ALTER TABLE ab_experiments ADD COLUMN IF NOT EXISTS confidence_level DECIMAL(5,4) DEFAULT 0.95;
ALTER TABLE ab_experiments ADD COLUMN IF NOT EXISTS statistical_power DECIMAL(5,4) DEFAULT 0.80;
ALTER TABLE ab_experiments ADD COLUMN IF NOT EXISTS results JSONB DEFAULT '{}';
ALTER TABLE ab_experiments ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE ab_experiments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 15. 修复 ab_user_assignments 表
ALTER TABLE ab_user_assignments ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE ab_user_assignments ADD COLUMN IF NOT EXISTS experiment_id UUID;
ALTER TABLE ab_user_assignments ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE ab_user_assignments ADD COLUMN IF NOT EXISTS variant VARCHAR(100);
ALTER TABLE ab_user_assignments ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE ab_user_assignments ADD COLUMN IF NOT EXISTS first_exposure TIMESTAMP WITH TIME ZONE;
ALTER TABLE ab_user_assignments ADD COLUMN IF NOT EXISTS conversion_events JSONB DEFAULT '[]';
ALTER TABLE ab_user_assignments ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- 16. 修复 cache_management 表
ALTER TABLE cache_management ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE cache_management ADD COLUMN IF NOT EXISTS cache_key VARCHAR(255) UNIQUE NOT NULL;
ALTER TABLE cache_management ADD COLUMN IF NOT EXISTS cache_type VARCHAR(50) NOT NULL;
ALTER TABLE cache_management ADD COLUMN IF NOT EXISTS data JSONB;
ALTER TABLE cache_management ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE cache_management ADD COLUMN IF NOT EXISTS hit_count INTEGER DEFAULT 0;
ALTER TABLE cache_management ADD COLUMN IF NOT EXISTS last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE cache_management ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE cache_management ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 17. 修复 notifications 表
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS notification_type VARCHAR(50) NOT NULL;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS title VARCHAR(200);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS action_url TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'normal';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 18. 修复 user_feedback 表
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS feedback_type VARCHAR(50) NOT NULL;
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5);
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS subject VARCHAR(200);
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS feature_area VARCHAR(100);
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'normal';
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'open';
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS response TEXT;
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS responded_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS responded_by UUID;
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================================================
-- 创建索引
-- ============================================================================

-- 核心功能表索引
CREATE INDEX IF NOT EXISTS idx_design_works_user_id ON design_works(user_id);
CREATE INDEX IF NOT EXISTS idx_design_works_profile_id ON design_works(profile_id);
CREATE INDEX IF NOT EXISTS idx_energy_records_user_date ON user_energy_records(user_id, date);
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_user_id ON meditation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_crystals_user_id ON user_favorite_crystals(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_crystals_crystal_id ON user_favorite_crystals(crystal_id);

-- AI和分析表索引
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_user_id ON ml_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_cache_key ON ml_predictions(cache_key);
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_timestamp ON analytics_metrics(timestamp);

-- 用户管理表索引
CREATE INDEX IF NOT EXISTS idx_membership_info_user_id ON membership_info(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_stats_user_month ON usage_stats(user_id, month);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_behavior_patterns_user_id ON user_behavior_patterns(user_id);

-- 系统表索引
CREATE INDEX IF NOT EXISTS idx_ab_assignments_experiment_id ON ab_user_assignments(experiment_id);
CREATE INDEX IF NOT EXISTS idx_cache_management_key ON cache_management(cache_key);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);

-- ============================================================================
-- 验证修复结果
-- ============================================================================

-- 检查所有表是否存在
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('profiles', 'system_logs') THEN '✅ 完全匹配'
    WHEN table_name IN ('design_works', 'user_energy_records', 'meditation_sessions', 'user_favorite_crystals', 'ai_conversations', 'ml_predictions', 'analytics_metrics', 'membership_info', 'usage_stats', 'user_settings', 'user_behavior_patterns', 'dynamic_pricing_rules', 'ab_experiments', 'ab_user_assignments', 'cache_management', 'notifications', 'user_feedback') THEN '🔧 已修复'
    ELSE '❓ 未知状态'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'profiles', 'design_works', 'user_energy_records', 'meditation_sessions', 
    'crystals', 'user_favorite_crystals', 'ai_conversations', 'membership_info', 
    'usage_stats', 'user_settings', 'user_behavior_patterns', 'ml_predictions', 
    'dynamic_pricing_rules', 'ab_experiments', 'ab_user_assignments', 
    'analytics_metrics', 'system_logs', 'cache_management', 'notifications', 
    'user_feedback'
  )
ORDER BY table_name; 