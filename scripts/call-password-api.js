const fetch = require('node-fetch');

const API_BASE = 'http://localhost:9005/api';

async function checkPasswordStatus() {
  try {
    console.log('🔍 检查密码状态...');
    
    const response = await fetch(`${API_BASE}/update-all-passwords`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ 密码状态检查成功');
      console.log(`📊 总用户数: ${data.summary.totalUsers}`);
      console.log(`🔐 已设置密码: ${data.summary.usersWithPassword}`);
      console.log(`❌ 未设置密码: ${data.summary.usersWithoutPassword}`);
      console.log(`📈 密码设置率: ${data.summary.percentageWithPassword}%`);
      console.log(`💬 ${data.message}`);
    } else {
      console.log('❌ 密码状态检查失败:', data.message);
    }
    
    return data;
  } catch (error) {
    console.error('❌ 检查密码状态失败:', error.message);
    return null;
  }
}

async function updateAllPasswords() {
  try {
    console.log('🔐 开始更新所有用户密码...');
    
    const response = await fetch(`${API_BASE}/update-all-passwords`, {
      method: 'POST'
    });
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ 密码更新成功');
      console.log(`📊 总用户数: ${data.summary.totalUsers}`);
      console.log(`✅ 更新成功: ${data.summary.successfulUpdates}`);
      console.log(`❌ 更新失败: ${data.summary.failedUpdates}`);
      console.log(`🔍 验证通过: ${data.summary.verifiedUsers}`);
      console.log(`💬 ${data.message}`);
      console.log(`🔑 默认密码: ${data.defaultPassword}`);
      
      if (data.results && data.results.length > 0) {
        console.log('\n📋 详细结果:');
        data.results.forEach(result => {
          const status = result.success ? '✅' : '❌';
          console.log(`${status} ${result.user}${result.error ? ` (${result.error})` : ''}`);
        });
      }
    } else {
      console.log('❌ 密码更新失败:', data.message);
    }
    
    return data;
  } catch (error) {
    console.error('❌ 更新密码失败:', error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 开始密码管理流程...\n');
  
  // 1. 检查密码状态
  const status = await checkPasswordStatus();
  
  if (status && status.summary.usersWithoutPassword > 0) {
    console.log('\n⚠️  发现未设置密码的用户，开始更新...\n');
    
    // 2. 更新密码
    await updateAllPasswords();
    
    // 3. 再次检查状态
    console.log('\n🔍 更新后再次检查状态...\n');
    await checkPasswordStatus();
  } else if (status && status.summary.usersWithPassword === status.summary.totalUsers) {
    console.log('\n✅ 所有用户都已设置密码，无需更新');
  }
  
  console.log('\n🎉 密码管理流程完成');
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