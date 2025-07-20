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
 * 检查表结构
 */
async function checkTableStructure() {
  try {
    console.log('🔍 检查 profiles 表结构...\n');
    
    // 获取一个用户记录来查看字段结构
    const { data: user, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single();
    
    if (fetchError) {
      console.error('❌ 获取用户记录失败:', fetchError.message);
      return;
    }
    
    console.log('📋 profiles 表字段:');
    Object.keys(user).forEach(field => {
      const value = user[field];
      const type = typeof value;
      console.log(`- ${field}: ${type}${value !== null ? ` (${value})` : ' (null)'}`);
    });
    
    // 检查是否有密码相关字段
    const passwordFields = ['password_hash', 'password_salt', 'password', 'password_reset_token'];
    const existingPasswordFields = passwordFields.filter(field => field in user);
    
    console.log('\n🔐 密码相关字段:');
    if (existingPasswordFields.length > 0) {
      existingPasswordFields.forEach(field => {
        console.log(`✅ ${field}: ${user[field] ? '已设置' : '未设置'}`);
      });
    } else {
      console.log('❌ 没有找到密码相关字段');
      console.log('需要添加以下字段之一:');
      passwordFields.forEach(field => console.log(`- ${field}`));
    }
    
    return user;
    
  } catch (error) {
    console.error('❌ 检查表结构失败:', error);
  }
}

/**
 * 更新用户密码（使用现有字段）
 */
async function updatePasswords(userStructure) {
  try {
    console.log('\n🔐 开始更新用户密码...\n');
    
    // 获取所有用户
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
    
    // 检查可用的密码字段
    const availablePasswordFields = Object.keys(userStructure).filter(field => 
      field.includes('password') || field.includes('hash') || field.includes('salt')
    );
    
    if (availablePasswordFields.length === 0) {
      console.log('❌ 没有可用的密码字段');
      console.log('请先在 Supabase Dashboard 中添加密码字段');
      return;
    }
    
    console.log('📋 可用的密码字段:', availablePasswordFields);
    
    // 为每个用户设置密码
    const updatePromises = users.map(async (user) => {
      try {
        // 使用第一个可用的密码字段
        const passwordField = availablePasswordFields[0];
        const updateData = {
          [passwordField]: '123456',
          updated_at: new Date().toISOString()
        };
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updateData)
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
    
    // 统计结果
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
    
    console.log('\n🎉 密码更新完成！');
    console.log('💡 所有用户现在可以使用密码 "123456" 登录');
    
  } catch (error) {
    console.error('❌ 更新密码失败:', error);
  }
}

// 运行检查和更新
checkTableStructure()
  .then(userStructure => {
    if (userStructure) {
      return updatePasswords(userStructure);
    }
  })
  .then(() => {
    console.log('\n✅ 所有操作完成');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ 操作失败:', error);
    process.exit(1);
  }); 