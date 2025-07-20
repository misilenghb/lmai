const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
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
 * 读取SQL文件内容
 */
function readSQLFile(filename) {
  try {
    const filePath = path.join(__dirname, filename);
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`❌ 读取SQL文件失败: ${error.message}`);
    return null;
  }
}

/**
 * 执行SQL语句
 */
async function executeSQL(sql) {
  try {
    console.log('🔧 执行SQL修复语句...');
    
    // 由于匿名密钥无法执行DDL操作，我们需要提供指导
    console.log('\n⚠️  注意: 匿名密钥无法执行DDL操作');
    console.log('请按照以下步骤手动执行SQL:');
    console.log('\n1. 登录 Supabase Dashboard');
    console.log('2. 进入您的项目');
    console.log('3. 点击 "SQL Editor"');
    console.log('4. 复制以下SQL语句并执行:');
    console.log('\n' + '='.repeat(80));
    console.log(sql);
    console.log('='.repeat(80));
    
    return { success: true, message: 'SQL语句已提供，请在Supabase Dashboard中手动执行' };
  } catch (error) {
    console.error('❌ 执行SQL失败:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 验证修复结果
 */
async function verifyRepair() {
  try {
    console.log('\n🔍 验证修复结果...');
    
    // 检查关键表是否存在
    const keyTables = [
      'profiles', 'design_works', 'user_energy_records', 'meditation_sessions',
      'crystals', 'user_favorite_crystals', 'ai_conversations'
    ];
    
    const results = {};
    
    for (const tableName of keyTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          results[tableName] = { exists: false, error: error.message };
        } else {
          results[tableName] = { exists: true, fieldCount: data.length > 0 ? Object.keys(data[0]).length : 0 };
        }
      } catch (error) {
        results[tableName] = { exists: false, error: error.message };
      }
    }
    
    return results;
  } catch (error) {
    console.error('❌ 验证失败:', error);
    return {};
  }
}

/**
 * 生成修复报告
 */
function generateRepairReport(verificationResults) {
  console.log('\n' + '='.repeat(80));
  console.log('📋 修复验证报告');
  console.log('='.repeat(80));
  
  let successCount = 0;
  let totalCount = 0;
  
  for (const [tableName, result] of Object.entries(verificationResults)) {
    totalCount++;
    if (result.exists) {
      successCount++;
      console.log(`✅ ${tableName}: 存在 (${result.fieldCount || 0} 个字段)`);
    } else {
      console.log(`❌ ${tableName}: 不存在 - ${result.error || '未知错误'}`);
    }
  }
  
  console.log(`\n📊 修复统计:`);
  console.log(`- 成功修复: ${successCount}/${totalCount} 张表`);
  console.log(`- 成功率: ${Math.round((successCount / totalCount) * 100)}%`);
  
  if (successCount === totalCount) {
    console.log('\n🎉 所有表修复成功！');
  } else {
    console.log('\n⚠️  部分表仍需修复，请检查SQL执行情况');
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🚀 开始修复缺失的数据库字段...\n');
    
    // 1. 读取SQL文件
    const sql = readSQLFile('fix-missing-fields.sql');
    if (!sql) {
      console.error('❌ 无法读取SQL文件');
      process.exit(1);
    }
    
    // 2. 执行SQL
    const result = await executeSQL(sql);
    
    if (result.success) {
      console.log('\n✅ SQL语句已准备就绪');
      console.log('\n📋 下一步操作:');
      console.log('1. 复制上面的SQL语句');
      console.log('2. 在 Supabase Dashboard 的 SQL Editor 中执行');
      console.log('3. 执行完成后运行验证脚本');
      
      // 3. 等待用户确认
      console.log('\n⏳ 请在执行SQL后按任意键继续验证...');
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on('data', async () => {
        process.stdin.setRawMode(false);
        
        // 4. 验证修复结果
        const verificationResults = await verifyRepair();
        generateRepairReport(verificationResults);
        
        console.log('\n✅ 修复流程完成');
        process.exit(0);
      });
    } else {
      console.error('❌ 修复失败:', result.error);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ 修复过程出错:', error);
    process.exit(1);
  }
}

// 运行主函数
main()
  .catch(error => {
    console.error('❌ 脚本执行失败:', error);
    process.exit(1);
  }); 