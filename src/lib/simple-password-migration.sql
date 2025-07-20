-- 简化的密码迁移脚本
-- 请在 Supabase SQL 编辑器中执行

-- 1. 添加安全问题字段到 profiles 表
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_question_1 VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_answer_1 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_question_2 VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_answer_2 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_question_3 VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_answer_3 VARCHAR(255);

-- 2. 更新测试用户数据，添加安全问题
UPDATE profiles SET 
  security_question_1 = '您的第一只宠物叫什么名字？',
  security_answer_1 = '小白',
  security_question_2 = '您的出生城市是哪里？',
  security_answer_2 = '北京',
  security_question_3 = '您最喜欢的颜色是什么？',
  security_answer_3 = '蓝色'
WHERE email = 'admin@lmai.cc';

UPDATE profiles SET 
  security_question_1 = '您的第一只宠物叫什么名字？',
  security_answer_1 = '小黑',
  security_question_2 = '您的出生城市是哪里？',
  security_answer_2 = '上海',
  security_question_3 = '您最喜欢的颜色是什么？',
  security_answer_3 = '红色'
WHERE email = 'user@lmai.cc';

UPDATE profiles SET 
  security_question_1 = '您的第一只宠物叫什么名字？',
  security_answer_1 = '小花',
  security_question_2 = '您的出生城市是哪里？',
  security_answer_2 = '广州',
  security_question_3 = '您最喜欢的颜色是什么？',
  security_answer_3 = '绿色'
WHERE email = 'test@lmai.cc';

-- 3. 创建获取安全问题函数
CREATE OR REPLACE FUNCTION get_security_questions(input_email TEXT)
RETURNS TABLE(
  success BOOLEAN,
  question1 TEXT,
  question2 TEXT,
  question3 TEXT,
  error_message TEXT
) AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- 查找用户
  SELECT security_question_1, security_question_2, security_question_3
  INTO user_record
  FROM profiles 
  WHERE email = input_email;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::TEXT, NULL::TEXT, '用户不存在';
    RETURN;
  END IF;
  
  RETURN QUERY SELECT TRUE, 
    user_record.security_question_1, 
    user_record.security_question_2, 
    user_record.security_question_3, 
    NULL::TEXT;
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. 创建验证安全问题函数
CREATE OR REPLACE FUNCTION verify_security_questions(
  input_email TEXT,
  answer1 TEXT,
  answer2 TEXT,
  answer3 TEXT
) RETURNS TABLE(
  success BOOLEAN,
  reset_token TEXT,
  error_message TEXT
) AS $$
DECLARE
  user_record RECORD;
  new_token TEXT;
  correct_answers INTEGER := 0;
BEGIN
  -- 查找用户和安全问题答案
  SELECT id, security_answer_1, security_answer_2, security_answer_3
  INTO user_record
  FROM profiles 
  WHERE email = input_email;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::TEXT, '用户不存在';
    RETURN;
  END IF;
  
  -- 检查安全问题答案（不区分大小写）
  IF user_record.security_answer_1 IS NOT NULL AND 
     LOWER(TRIM(user_record.security_answer_1)) = LOWER(TRIM(answer1)) THEN
    correct_answers := correct_answers + 1;
  END IF;
  
  IF user_record.security_answer_2 IS NOT NULL AND 
     LOWER(TRIM(user_record.security_answer_2)) = LOWER(TRIM(answer2)) THEN
    correct_answers := correct_answers + 1;
  END IF;
  
  IF user_record.security_answer_3 IS NOT NULL AND 
     LOWER(TRIM(user_record.security_answer_3)) = LOWER(TRIM(answer3)) THEN
    correct_answers := correct_answers + 1;
  END IF;
  
  -- 需要至少答对2个问题
  IF correct_answers < 2 THEN
    RETURN QUERY SELECT FALSE, NULL::TEXT, '安全问题答案错误，请重试';
    RETURN;
  END IF;
  
  -- 生成重置令牌（简化版本）
  new_token := 'reset_' || extract(epoch from now())::text || '_' || user_record.id::text;
  
  -- 更新用户记录
  UPDATE profiles 
  SET password_reset_token = new_token,
      password_reset_expires = NOW() + INTERVAL '1 hour'
  WHERE email = input_email;
  
  RETURN QUERY SELECT TRUE, new_token, NULL::TEXT;
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. 创建重置密码函数
CREATE OR REPLACE FUNCTION reset_password_with_token(
  reset_token TEXT,
  new_password TEXT
) RETURNS TABLE(
  success BOOLEAN,
  error_message TEXT
) AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- 查找有效的重置令牌
  SELECT id, email, password_reset_expires
  INTO user_record
  FROM profiles 
  WHERE password_reset_token = reset_token
    AND password_reset_expires > NOW();
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, '重置令牌无效或已过期';
    RETURN;
  END IF;
  
  -- 验证新密码强度
  IF length(new_password) < 6 THEN
    RETURN QUERY SELECT FALSE, '密码至少需要6个字符';
    RETURN;
  END IF;
  
  -- 更新密码并清除重置令牌
  UPDATE profiles 
  SET password_hash = new_password,
      password_reset_token = NULL,
      password_reset_expires = NULL,
      login_attempts = 0,
      account_locked_until = NULL,
      updated_at = NOW()
  WHERE id = user_record.id;
  
  RETURN QUERY SELECT TRUE, NULL::TEXT;
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 创建请求密码重置函数
CREATE OR REPLACE FUNCTION request_password_reset(input_email TEXT)
RETURNS TABLE(
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
  new_token := 'reset_' || extract(epoch from now())::text || '_' || user_record.id::text;
  
  -- 更新用户记录
  UPDATE profiles 
  SET password_reset_token = new_token,
      password_reset_expires = NOW() + INTERVAL '1 hour'
  WHERE email = input_email;
  
  RETURN QUERY SELECT TRUE, new_token, NULL::TEXT;
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
