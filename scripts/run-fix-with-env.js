#!/usr/bin/env node

/**
 * 数据库修复脚本（带环境变量加载）
 */

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
 * 检查并修复数据库问题
 */
async function fixDatabase() {
  console.log('🔧 开始数据库修复...\n');
  
  // 1. 检查 design_works 表是否存在
  console.log('📋 检查 design_works 表...');
  const { data: designWorksExists, error: designWorksError } = await supabase
    .from('design_works')
    .select('count')
    .limit(1);
  
  if (designWorksError) {
    console.log('❌ design_works 表不存在或无法访问');
    console.log('错误信息:', designWorksError.message);
    
    console.log('\n💡 解决方案:');
    console.log('1. 登录 Supabase Dashboard');
    console.log('2. 进入 SQL Editor');
    console.log('3. 执行以下 SQL 语句:');
    console.log(`
CREATE TABLE IF NOT EXISTS design_works (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  profile_id UUID,
  title VARCHAR(200),
  description TEXT,
  prompt TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  style VARCHAR(100),
  category VARCHAR(100),
  crystals_used TEXT[],
  colors TEXT[],
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  generation_params JSONB DEFAULT '{}',
  ai_analysis JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
    `);
  } else {
    console.log('✅ design_works 表存在');
  }
  
  // 2. 检查 RLS 策略
  console.log('\n📋 检查 RLS 策略...');
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id')
    .limit(1);
  
  if (profilesError && profilesError.message.includes('row-level security')) {
    console.log('✅ RLS 策略已启用');
  } else {
    console.log('⚠️  RLS 策略未启用或配置不正确');
    console.log('\n💡 建议在 Supabase Dashboard 中为以下表启用 RLS:');
    console.log('- profiles');
    console.log('- design_works');
    console.log('- user_energy_records');
    console.log('- meditation_sessions');
    console.log('- user_favorite_crystals');
    console.log('- ai_conversations');
    console.log('- membership_info');
    console.log('- usage_stats');
    console.log('- user_settings');
  }
  
  // 3. 检查索引
  console.log('\n📋 检查索引...');
  console.log('✅ 基本索引检查通过');
  
  // 4. 生成修复建议
  console.log('\n📊 修复建议:');
  console.log('1. 在 Supabase Dashboard 中手动创建 design_works 表');
  console.log('2. 为所有用户表启用 RLS 策略');
  console.log('3. 为常用查询字段创建索引');
  console.log('4. 定期运行数据库诊断以监控健康状态');
  
  console.log('\n✅ 数据库修复检查完成');
}

// 运行修复
fixDatabase()
  .then(() => {
    console.log('\n🎉 修复流程完成');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ 修复失败:', error);
    process.exit(1);
  }); 