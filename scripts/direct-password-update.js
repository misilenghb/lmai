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
 * 生成密码哈希和盐值
 */
function generatePasswordHash(password) {
  const crypto = require('crypto');
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * 检查并添加密码字段
 */
async function checkAndAddPasswordFields() {
  try {
    console.log('🔍 检查密码字段状态...');
    
    // 获取一个用户记录来查看字段结构
    const { data: user, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single();
    
    if (fetchError) {
      console.error('❌ 获取用户记录失败:', fetchError.message);
      return false;
    }
    
    console.log('📋 profiles 表字段:');
    Object.keys(user).forEach(field => {
      console.log(`- ${field}`);
    });
    
    // 检查是否有密码相关字段
    const passwordFields = ['password_hash', 'password_salt', 'password', 'password_reset_token'];
    const existingPasswordFields = passwordFields.filter(field => field in user);
    
    console.log('\n🔐 密码相关字段:');
    if (existingPasswordFields.length > 0) {
      existingPasswordFields.forEach(field => {
        console.log(`✅ ${field}: ${user[field] ? '已设置' : '未设置'}`);
      });
      return true;
    } else {
      console.log('❌ 没有找到密码相关字段');
      console.log('\n⚠️  需要先在 Supabase Dashboard 中添加密码字段');
      console.log('请执行以下SQL语句:');
      console.log(`
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_salt TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_reset_token TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
      `);
      return false;
    }
    
  } catch (error) {
    console.error('❌ 检查密码字段失败:', error);
    return false;
  }
}

/**
 * 更新所有用户密码
 */
async function updateAllPasswords() {
  try {
    console.log('🔐 开始更新所有用户密码...');
    
    // 1. 获取所有用户
    console.log('📋 获取所有用户...');
    const { data: users, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, name');
    
    if (fetchError) {
      console.error('❌ 获取用户失败:', fetchError.message);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log('ℹ️  没有找到任何用户');
      return;
    }
    
    console.log(`✅ 找到 ${users.length} 个用户`);
    
    // 2. 为每个用户生成密码哈希
    const defaultPassword = '123456';
    const { hash, salt } = generatePasswordHash(defaultPassword);
    
    console.log('🔧 生成密码哈希...');
    console.log(`默认密码: ${defaultPassword}`);
    console.log(`哈希: ${hash.substring(0, 20)}...`);
    console.log(`盐值: ${salt.substring(0, 20)}...`);
    
    // 3. 更新所有用户的密码
    console.log('\n📝 更新用户密码...');
    const updatePromises = users.map(async (user) => {
      try {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            password_hash: hash,
            password_salt: salt,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
        
        if (updateError) {
          console.error(`❌ 更新用户 ${user.email} 密码失败:`, updateError.message);
          return { success: false, user: user.email, error: updateError.message };
        } else {
          console.log(`✅ 用户 ${user.email} 密码更新成功`);
          return { success: true, user: user.email };
        }
      } catch (error) {
        console.error(`❌ 更新用户 ${user.email} 密码异常:`, error.message);
        return { success: false, user: user.email, error: error.message };
      }
    });
    
    const results = await Promise.all(updatePromises);
    
    // 4. 统计结果
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    console.log('\n📊 更新结果:');
    console.log(`✅ 成功: ${successCount} 个用户`);
    console.log(`❌ 失败: ${failureCount} 个用户`);
    
    if (failureCount > 0) {
      console.log('\n❌ 失败的更新:');
      results.filter(r => !r.success).forEach(result => {
        console.log(`- ${result.user}: ${result.error}`);
      });
    }
    
    // 5. 验证更新
    console.log('\n🔍 验证密码更新...');
    const { data: verifyUsers, error: verifyError } = await supabase
      .from('profiles')
      .select('email, password_hash, password_salt')
      .not('password_hash', 'is', null);
    
    if (verifyError) {
      console.error('❌ 验证失败:', verifyError.message);
    } else {
      const usersWithPassword = verifyUsers.filter(u => u.password_hash && u.password_salt);
      console.log(`✅ 验证完成: ${usersWithPassword.length} 个用户已设置密码`);
    }
    
    console.log('\n🎉 密码更新完成！');
    console.log('💡 所有用户现在可以使用密码 "123456" 登录');
    
  } catch (error) {
    console.error('❌ 更新密码失败:', error);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始密码管理流程...\n');
  
  // 1. 检查密码字段
  const hasPasswordFields = await checkAndAddPasswordFields();
  
  if (!hasPasswordFields) {
    console.log('\n❌ 请先在 Supabase Dashboard 中添加密码字段，然后重新运行此脚本');
    return;
  }
  
  // 2. 更新密码
  await updateAllPasswords();
  
  console.log('\n✅ 密码管理流程完成');
}

// 运行主函数
main()
  .then(() => {
    console.log('✅ 脚本执行完成');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ 脚本执行失败:', error);
    process.exit(1);
  }); 