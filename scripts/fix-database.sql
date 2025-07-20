-- 水晶日历系统数据库修复脚本
-- 修复缺失的表和设置RLS策略

-- 1. 创建缺失的 design_works 表
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

-- 2. 为所有表设置 RLS 策略
-- profiles 表
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profiles" ON profiles
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own profiles" ON profiles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own profiles" ON profiles
  FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own profiles" ON profiles
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- design_works 表
ALTER TABLE design_works ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own design works" ON design_works
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own design works" ON design_works
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own design works" ON design_works
  FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own design works" ON design_works
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- user_energy_records 表
ALTER TABLE user_energy_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own energy records" ON user_energy_records
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own energy records" ON user_energy_records
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own energy records" ON user_energy_records
  FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own energy records" ON user_energy_records
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- meditation_sessions 表
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own meditation sessions" ON meditation_sessions
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own meditation sessions" ON meditation_sessions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own meditation sessions" ON meditation_sessions
  FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own meditation sessions" ON meditation_sessions
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- crystals 表（公开读取，但只有管理员可以修改）
ALTER TABLE crystals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view crystals" ON crystals
  FOR SELECT USING (true);
CREATE POLICY "Only admins can modify crystals" ON crystals
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- user_favorite_crystals 表
ALTER TABLE user_favorite_crystals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own favorite crystals" ON user_favorite_crystals
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own favorite crystals" ON user_favorite_crystals
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own favorite crystals" ON user_favorite_crystals
  FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own favorite crystals" ON user_favorite_crystals
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- ai_conversations 表
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations" ON ai_conversations
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own conversations" ON ai_conversations
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own conversations" ON ai_conversations
  FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own conversations" ON ai_conversations
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- membership_info 表
ALTER TABLE membership_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own membership" ON membership_info
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own membership" ON membership_info
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own membership" ON membership_info
  FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own membership" ON membership_info
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- usage_stats 表
ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own usage stats" ON usage_stats
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own usage stats" ON usage_stats
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own usage stats" ON usage_stats
  FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own usage stats" ON usage_stats
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- user_settings 表
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own settings" ON user_settings
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- 3. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_design_works_user_id ON design_works(user_id);
CREATE INDEX IF NOT EXISTS idx_design_works_profile_id ON design_works(profile_id);
CREATE INDEX IF NOT EXISTS idx_design_works_created_at ON design_works(created_at);

-- 4. 创建触发器函数（如果不存在）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. 为 design_works 表添加触发器
DROP TRIGGER IF EXISTS update_design_works_updated_at ON design_works;
CREATE TRIGGER update_design_works_updated_at
    BEFORE UPDATE ON design_works
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. 验证修复结果
SELECT 
  'design_works' as table_name,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'design_works') as table_exists,
  (SELECT COUNT(*) FROM design_works) as row_count
UNION ALL
SELECT 
  'profiles' as table_name,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') as table_exists,
  (SELECT COUNT(*) FROM profiles) as row_count; 