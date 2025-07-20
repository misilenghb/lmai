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
  // 简单的哈希函数（在实际生产环境中应使用 bcrypt 等）
  const crypto = require('crypto');
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * 更新所有用户的密码
 */
async function updateAllPasswords() {
  try {
    console.log('🔐 开始更新所有用户密码...\n');
    
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
 * 验证密码功能
 */
async function verifyPassword(email, password) {
  try {
    // 获取用户信息
    const { data: user, error: fetchError } = await supabase
      .from('profiles')
      .select('password_hash, password_salt')
      .eq('email', email)
      .single();
    
    if (fetchError || !user) {
      return { success: false, error: '用户不存在' };
    }
    
    if (!user.password_hash || !user.password_salt) {
      return { success: false, error: '用户未设置密码' };
    }
    
    // 验证密码
    const crypto = require('crypto');
    const testHash = crypto.pbkdf2Sync(password, user.password_salt, 1000, 64, 'sha512').toString('hex');
    
    if (testHash === user.password_hash) {
      return { success: true, message: '密码验证成功' };
    } else {
      return { success: false, error: '密码错误' };
    }
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 测试密码验证
 */
async function testPasswordVerification() {
  console.log('\n🧪 测试密码验证...');
  
  // 获取第一个用户进行测试
  const { data: testUser, error: fetchError } = await supabase
    .from('profiles')
    .select('email')
    .limit(1)
    .single();
  
  if (fetchError || !testUser) {
    console.log('❌ 没有找到测试用户');
    return;
  }
  
  console.log(`测试用户: ${testUser.email}`);
  
  // 测试正确密码
  const correctResult = await verifyPassword(testUser.email, '123456');
  console.log(`正确密码测试: ${correctResult.success ? '✅ 通过' : '❌ 失败'}`);
  
  // 测试错误密码
  const wrongResult = await verifyPassword(testUser.email, 'wrongpassword');
  console.log(`错误密码测试: ${!wrongResult.success ? '✅ 通过' : '❌ 失败'}`);
}

// 运行更新
updateAllPasswords()
  .then(() => {
    return testPasswordVerification();
  })
  .then(() => {
    console.log('\n✅ 所有操作完成');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ 操作失败:', error);
    process.exit(1);
  }); 