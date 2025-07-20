-- 为 profiles 表添加密码相关字段
-- 执行时间: 2025-01-18

-- 1. 添加密码哈希字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 2. 添加密码盐值字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_salt TEXT;

-- 3. 添加密码重置令牌字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_reset_token TEXT;

-- 4. 添加密码重置过期时间字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP WITH TIME ZONE;

-- 5. 添加登录尝试次数字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0;

-- 6. 添加账户锁定时间字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP WITH TIME ZONE;

-- 7. 添加最后登录时间字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- 8. 添加安全问题和答案字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_question_1 TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_answer_1 TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_question_2 TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_answer_2 TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_question_3 TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_answer_3 TEXT;

-- 9. 验证字段是否添加成功
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN (
    'password_hash', 
    'password_salt', 
    'password_reset_token', 
    'password_reset_expires',
    'login_attempts',
    'account_locked_until',
    'last_login',
    'security_question_1',
    'security_answer_1',
    'security_question_2',
    'security_answer_2',
    'security_question_3',
    'security_answer_3'
  )
ORDER BY column_name; 