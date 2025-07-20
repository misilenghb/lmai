const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 缺少 Supabase 环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function uuidv4() {
  // 简单UUID生成（仅用于测试数据）
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const now = new Date();
const nowStr = now.toISOString();
const today = nowStr.slice(0, 10);
const thisMonth = today.slice(0, 7) + '-01';

const testRows = [
  {
    table: 'design_works',
    row: { id: uuidv4(), image_url: 'test.png', title: 'test', created_at: nowStr }
  },
  {
    table: 'user_energy_records',
    row: { id: uuidv4(), date: today, created_at: nowStr }
  },
  {
    table: 'meditation_sessions',
    row: { id: uuidv4(), session_type: 'test', duration_minutes: 1, created_at: nowStr }
  },
  {
    table: 'crystals',
    row: { id: uuidv4(), name: 'test', created_at: nowStr }
  },
  {
    table: 'user_favorite_crystals',
    row: { id: uuidv4(), created_at: nowStr }
  },
  {
    table: 'ai_conversations',
    row: { id: uuidv4(), conversation_type: 'test', created_at: nowStr }
  },
  {
    table: 'membership_info',
    row: { id: uuidv4(), created_at: nowStr }
  },
  {
    table: 'usage_stats',
    row: { id: uuidv4(), month: thisMonth, created_at: nowStr }
  },
  {
    table: 'user_settings',
    row: { id: uuidv4(), created_at: nowStr }
  },
  {
    table: 'user_behavior_patterns',
    row: { id: uuidv4(), action: 'test', created_at: nowStr }
  },
  {
    table: 'ml_predictions',
    row: { id: uuidv4(), prediction_type: 'test', created_at: nowStr }
  },
  {
    table: 'dynamic_pricing_rules',
    row: { id: uuidv4(), rule_name: 'test', created_at: nowStr }
  },
  {
    table: 'ab_experiments',
    row: { id: uuidv4(), experiment_name: 'test', created_at: nowStr }
  },
  {
    table: 'ab_user_assignments',
    row: { id: uuidv4(), assigned_at: nowStr }
  },
  {
    table: 'analytics_metrics',
    row: { id: uuidv4(), metric_name: 'test', metric_type: 'test', created_at: nowStr }
  },
  {
    table: 'cache_management',
    row: { id: uuidv4(), cache_key: 'test', cache_type: 'test', created_at: nowStr }
  },
  {
    table: 'notifications',
    row: { id: uuidv4(), notification_type: 'test', created_at: nowStr }
  },
  {
    table: 'user_feedback',
    row: { id: uuidv4(), feedback_type: 'test', created_at: nowStr }
  }
];

async function main() {
  for (const { table, row } of testRows) {
    try {
      const { error } = await supabase.from(table).insert([row]);
      if (error) {
        console.log(`❌ 插入 ${table} 失败: ${error.message}`);
      } else {
        console.log(`✅ 插入 ${table} 成功`);
      }
    } catch (e) {
      console.log(`❌ 插入 ${table} 异常: ${e.message}`);
    }
  }
  process.exit(0);
}

main(); 