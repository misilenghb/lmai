const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// 从环境变量获取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 缺少 Supabase 环境变量');
  console.error('请确保设置了 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 添加密码相关字段
 */
async function addPasswordFields() {
  try {
    console.log('🔧 开始添加密码相关字段...\n');
    
    // 由于我们只有匿名密钥，无法执行DDL操作
    // 需要手动在 Supabase Dashboard 中执行SQL
    
    console.log('⚠️  需要手动在 Supabase Dashboard 中执行以下SQL:');
    console.log(`
-- 为 profiles 表添加密码相关字段

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
    `);
    
    console.log('\n📋 执行步骤:');
    console.log('1. 登录 Supabase Dashboard');
    console.log('2. 进入 SQL Editor');
    console.log('3. 复制并粘贴上述SQL语句');
    console.log('4. 点击 "Run" 执行');
    console.log('5. 执行完成后，运行密码更新脚本');
    
    console.log('\n💡 执行完成后，请运行:');
    console.log('node scripts/update-all-passwords.js');
    
  } catch (error) {
    console.error('❌ 添加字段失败:', error);
  }
}

// 运行添加字段
addPasswordFields()
  .then(() => {
    console.log('\n✅ 脚本执行完成');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ 脚本执行失败:', error);
    process.exit(1);
  }); 