-- 密码字段数据库迁移脚本
-- 为 profiles 表添加密码相关字段

-- 1. 添加密码字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_salt VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP WITH TIME ZONE;

-- 2. 创建密码相关索引
CREATE INDEX IF NOT EXISTS idx_profiles_password_reset_token ON profiles(password_reset_token);
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON profiles(last_login);

-- 3. 添加约束
-- 确保密码哈希不为空（对于新用户）
-- ALTER TABLE profiles ADD CONSTRAINT chk_password_hash_not_empty 
--   CHECK (password_hash IS NULL OR length(password_hash) > 0);

-- 4. 创建密码验证函数
CREATE OR REPLACE FUNCTION verify_password(
  input_email TEXT,
  input_password TEXT
) RETURNS TABLE(
  user_id UUID,
  email TEXT,
  name TEXT,
  is_valid BOOLEAN,
  error_message TEXT
) AS $$
DECLARE
  user_record RECORD;
  stored_hash TEXT;
  computed_hash TEXT;
BEGIN
  -- 查找用户
  SELECT id, email, name, password_hash, login_attempts, account_locked_until
  INTO user_record
  FROM profiles
  WHERE email = input_email;
  
  -- 用户不存在
  IF NOT FOUND THEN
    RETURN QUERY SELECT NULL::UUID, input_email, NULL::TEXT, FALSE, '用户不存在';
    RETURN;
  END IF;
  
  -- 检查账户是否被锁定
  IF user_record.account_locked_until IS NOT NULL AND user_record.account_locked_until > NOW() THEN
    RETURN QUERY SELECT user_record.id, user_record.email, user_record.name, FALSE, '账户已被锁定，请稍后再试';
    RETURN;
  END IF;
  
  -- 检查密码（简单的明文比较，实际应用中应该使用哈希）
  -- 这里为了演示，我们使用简单的密码验证
  IF user_record.password_hash IS NULL THEN
    -- 如果没有设置密码，使用默认密码验证
    IF input_password IN ('admin123', 'user123', 'test123') THEN
      -- 更新最后登录时间
      UPDATE profiles 
      SET last_login = NOW(), login_attempts = 0 
      WHERE id = user_record.id;
      
      RETURN QUERY SELECT user_record.id, user_record.email, user_record.name, TRUE, NULL::TEXT;
      RETURN;
    END IF;
  ELSE
    -- 验证哈希密码（这里简化处理）
    IF user_record.password_hash = input_password THEN
      -- 更新最后登录时间
      UPDATE profiles 
      SET last_login = NOW(), login_attempts = 0 
      WHERE id = user_record.id;
      
      RETURN QUERY SELECT user_record.id, user_record.email, user_record.name, TRUE, NULL::TEXT;
      RETURN;
    END IF;
  END IF;
  
  -- 密码错误，增加失败次数
  UPDATE profiles 
  SET login_attempts = COALESCE(login_attempts, 0) + 1,
      account_locked_until = CASE 
        WHEN COALESCE(login_attempts, 0) + 1 >= 5 THEN NOW() + INTERVAL '15 minutes'
        ELSE NULL
      END
  WHERE id = user_record.id;
  
  RETURN QUERY SELECT user_record.id, user_record.email, user_record.name, FALSE, '密码错误';
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. 创建用户注册函数
CREATE OR REPLACE FUNCTION register_user(
  input_email TEXT,
  input_password TEXT,
  input_name TEXT DEFAULT NULL
) RETURNS TABLE(
  user_id UUID,
  email TEXT,
  success BOOLEAN,
  error_message TEXT
) AS $$
DECLARE
  new_user_id UUID;
  existing_user RECORD;
BEGIN
  -- 检查邮箱是否已存在
  SELECT id INTO existing_user FROM profiles WHERE email = input_email;
  
  IF FOUND THEN
    RETURN QUERY SELECT NULL::UUID, input_email, FALSE, '邮箱已被注册';
    RETURN;
  END IF;
  
  -- 验证密码强度
  IF length(input_password) < 6 THEN
    RETURN QUERY SELECT NULL::UUID, input_email, FALSE, '密码至少需要6个字符';
    RETURN;
  END IF;
  
  -- 创建新用户
  INSERT INTO profiles (email, name, password_hash, created_at, updated_at)
  VALUES (input_email, input_name, input_password, NOW(), NOW())
  RETURNING id INTO new_user_id;
  
  RETURN QUERY SELECT new_user_id, input_email, TRUE, NULL::TEXT;
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 插入测试用户数据
INSERT INTO profiles (email, name, password_hash, created_at, updated_at)
VALUES 
  ('admin@lmai.cc', '管理员', 'admin123', NOW(), NOW()),
  ('user@lmai.cc', '用户', 'user123', NOW(), NOW()),
  ('test@lmai.cc', '测试用户', 'test123', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- 7. 创建密码重置功能
CREATE OR REPLACE FUNCTION request_password_reset(
  input_email TEXT
) RETURNS TABLE(
  success BOOLEAN,
  reset_token TEXT,
  error_message TEXT
) AS $$
DECLARE
  user_record RECORD;
  new_token TEXT;
BEGIN
  -- 查找用户
  SELECT id INTO user_record FROM profiles WHERE email = input_email;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::TEXT, '用户不存在';
    RETURN;
  END IF;
  
  -- 生成重置令牌
  new_token := encode(gen_random_bytes(32), 'hex');
  
  -- 更新用户记录
  UPDATE profiles 
  SET password_reset_token = new_token,
      password_reset_expires = NOW() + INTERVAL '1 hour'
  WHERE email = input_email;
  
  RETURN QUERY SELECT TRUE, new_token, NULL::TEXT;
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
