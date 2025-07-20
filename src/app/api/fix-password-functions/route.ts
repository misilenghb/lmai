import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 静态导出配置
export const dynamic = 'force-static';
export const revalidate = false;

/**
 * 修复密码相关函数
 * POST /api/fix-password-functions
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔧 开始修复密码相关函数...');
    
    const results = [];
    
    // 1. 创建 verify_password 函数
    const verifyPasswordSQL = `
CREATE OR REPLACE FUNCTION verify_password(
  input_email TEXT,
  input_password TEXT
) RETURNS TABLE(
  success BOOLEAN,
  user_data JSONB,
  error_message TEXT
) AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- 查找用户
  SELECT id, email, name, password_hash, login_attempts, account_locked_until
  INTO user_record
  FROM profiles 
  WHERE email = input_email;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::JSONB, '用户不存在';
    RETURN;
  END IF;
  
  -- 检查账户是否被锁定
  IF user_record.account_locked_until IS NOT NULL AND user_record.account_locked_until > NOW() THEN
    RETURN QUERY SELECT FALSE, NULL::JSONB, '账户已被锁定，请稍后重试';
    RETURN;
  END IF;
  
  -- 验证密码（简化版本，实际应该使用哈希）
  IF user_record.password_hash = input_password THEN
    -- 密码正确，重置登录失败次数
    UPDATE profiles 
    SET login_attempts = 0,
        account_locked_until = NULL,
        last_login = NOW()
    WHERE id = user_record.id;
    
    RETURN QUERY SELECT TRUE, 
      jsonb_build_object(
        'id', user_record.id,
        'email', user_record.email,
        'name', user_record.name
      ), 
      NULL::TEXT;
    RETURN;
  ELSE
    -- 密码错误，增加失败次数
    UPDATE profiles 
    SET login_attempts = COALESCE(login_attempts, 0) + 1,
        account_locked_until = CASE 
          WHEN COALESCE(login_attempts, 0) + 1 >= 5 THEN NOW() + INTERVAL '15 minutes'
          ELSE NULL
        END
    WHERE id = user_record.id;
    
    RETURN QUERY SELECT FALSE, NULL::JSONB, '密码错误';
    RETURN;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    try {
      const { error: verifyError } = await supabase.rpc('exec_sql', {
        sql_query: verifyPasswordSQL
      });
      
      if (verifyError) {
        results.push({
          function: 'verify_password',
          success: false,
          error: verifyError.message
        });
      } else {
        results.push({
          function: 'verify_password',
          success: true,
          message: '创建成功'
        });
      }
    } catch (error) {
      results.push({
        function: 'verify_password',
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
    
    // 2. 创建 register_user 函数
    const registerUserSQL = `
CREATE OR REPLACE FUNCTION register_user(
  input_email TEXT,
  input_password TEXT,
  input_name TEXT DEFAULT NULL
) RETURNS TABLE(
  success BOOLEAN,
  user_id UUID,
  error_message TEXT
) AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- 检查邮箱是否已存在
  IF EXISTS (SELECT 1 FROM profiles WHERE email = input_email) THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, '邮箱已被注册';
    RETURN;
  END IF;
  
  -- 创建新用户
  INSERT INTO profiles (email, name, password_hash, created_at, updated_at)
  VALUES (input_email, input_name, input_password, NOW(), NOW())
  RETURNING id INTO new_user_id;
  
  RETURN QUERY SELECT TRUE, new_user_id, NULL::TEXT;
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    try {
      const { error: registerError } = await supabase.rpc('exec_sql', {
        sql_query: registerUserSQL
      });
      
      if (registerError) {
        results.push({
          function: 'register_user',
          success: false,
          error: registerError.message
        });
      } else {
        results.push({
          function: 'register_user',
          success: true,
          message: '创建成功'
        });
      }
    } catch (error) {
      results.push({
        function: 'register_user',
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
    
    // 3. 确保测试用户存在
    const insertTestUsersSQL = `
INSERT INTO profiles (email, name, password_hash, created_at, updated_at)
VALUES 
  ('admin@lmai.cc', '管理员', 'admin123', NOW(), NOW()),
  ('user@lmai.cc', '用户', 'user123', NOW(), NOW()),
  ('test@lmai.cc', '测试用户', 'test123', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();
    `;
    
    try {
      const { error: insertError } = await supabase.rpc('exec_sql', {
        sql_query: insertTestUsersSQL
      });
      
      if (insertError) {
        results.push({
          function: 'insert_test_users',
          success: false,
          error: insertError.message
        });
      } else {
        results.push({
          function: 'insert_test_users',
          success: true,
          message: '测试用户创建/更新成功'
        });
      }
    } catch (error) {
      results.push({
        function: 'insert_test_users',
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
    
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    return NextResponse.json({
      success: successCount === totalCount,
      message: `密码函数修复完成 (${successCount}/${totalCount})`,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 密码函数修复失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * 测试密码函数
 * GET /api/fix-password-functions
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🧪 测试密码函数...');
    
    const tests = [];
    
    // 测试1: 验证 verify_password 函数是否存在
    try {
      const { data, error } = await supabase.rpc('verify_password', {
        input_email: 'admin@lmai.cc',
        input_password: 'admin123'
      });
      
      tests.push({
        test: 'verify_password_function',
        success: !error,
        result: error ? error.message : data,
        error: error?.message
      });
    } catch (error) {
      tests.push({
        test: 'verify_password_function',
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
    
    // 测试2: 检查测试用户是否存在
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email, name')
        .in('email', ['admin@lmai.cc', 'user@lmai.cc', 'test@lmai.cc']);
      
      tests.push({
        test: 'test_users_exist',
        success: !error && data && data.length > 0,
        result: data,
        error: error?.message
      });
    } catch (error) {
      tests.push({
        test: 'test_users_exist',
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
    
    return NextResponse.json({
      success: true,
      tests,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 密码函数测试失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
