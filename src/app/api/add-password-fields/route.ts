import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 开始添加密码字段并更新密码...');
    
    // 由于我们只有匿名密钥，无法执行DDL操作
    // 提供SQL语句供手动执行
    
    const sqlStatements = [
      // 添加密码相关字段
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_salt TEXT;`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_reset_token TEXT;`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP WITH TIME ZONE;`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0;`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP WITH TIME ZONE;`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_question_1 TEXT;`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_answer_1 TEXT;`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_question_2 TEXT;`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_answer_2 TEXT;`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_question_3 TEXT;`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_answer_3 TEXT;`
    ];
    
    console.log('⚠️  需要手动在 Supabase Dashboard 中执行以下SQL:');
    sqlStatements.forEach((sql, index) => {
      console.log(`${index + 1}. ${sql}`);
    });
    
    return NextResponse.json({
      success: false,
      message: '需要手动执行DDL操作',
      instructions: [
        '1. 登录 Supabase Dashboard',
        '2. 进入 SQL Editor',
        '3. 复制并粘贴上述SQL语句',
        '4. 点击 "Run" 执行',
        '5. 执行完成后，调用 /api/update-all-passwords 接口'
      ],
      sqlStatements,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 添加密码字段失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      message: '添加密码字段失败'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 检查密码字段状态...');
    
    // 检查是否有密码字段
    const { data: user, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single();
    
    if (fetchError) {
      return NextResponse.json({
        success: false,
        error: fetchError.message,
        message: '检查密码字段失败'
      }, { status: 500 });
    }
    
    const passwordFields = ['password_hash', 'password_salt', 'password', 'password_reset_token'];
    const existingPasswordFields = passwordFields.filter(field => field in user);
    
    return NextResponse.json({
      success: true,
      hasPasswordFields: existingPasswordFields.length > 0,
      existingFields: existingPasswordFields,
      allFields: Object.keys(user),
      message: existingPasswordFields.length > 0 ? '密码字段已存在' : '需要添加密码字段',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 检查密码字段状态失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      message: '检查密码字段状态失败'
    }, { status: 500 });
  }
} 