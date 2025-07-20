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

// 本地定义的表结构（从代码中提取）
const LOCAL_TABLE_SCHEMAS = {
  profiles: [
    'id', 'user_id', 'email', 'name', 'birth_date', 'gender', 'zodiac_sign', 
    'chinese_zodiac', 'element', 'mbti', 'answers', 'chakra_analysis', 
    'energy_preferences', 'personality_insights', 'enhanced_assessment', 
    'avatar_url', 'location', 'timezone', 'language', 'created_at', 'updated_at'
  ],
  design_works: [
    'id', 'user_id', 'profile_id', 'title', 'description', 'prompt', 'image_url', 
    'thumbnail_url', 'style', 'category', 'crystals_used', 'colors', 'tags', 
    'is_favorite', 'is_public', 'view_count', 'like_count', 'share_count', 
    'generation_params', 'ai_analysis', 'created_at', 'updated_at'
  ],
  user_energy_records: [
    'id', 'user_id', 'profile_id', 'date', 'energy_level', 'chakra_states', 
    'mood_tags', 'emotions', 'activities', 'weather', 'lunar_phase', 'notes', 
    'ai_insights', 'created_at', 'updated_at'
  ],
  meditation_sessions: [
    'id', 'user_id', 'profile_id', 'session_type', 'title', 'description', 
    'duration_minutes', 'crystals_used', 'chakras_focused', 'intentions', 
    'guided_audio_url', 'background_music_url', 'completed_at', 
    'effectiveness_rating', 'mood_before', 'mood_after', 'insights', 'notes', 
    'created_at'
  ],
  crystals: [
    'id', 'name', 'english_name', 'scientific_name', 'crystal_system', 'hardness', 
    'color_varieties', 'chakra_associations', 'element_associations', 
    'zodiac_associations', 'healing_properties', 'metaphysical_properties', 
    'formation_process', 'geographical_origins', 'care_instructions', 'image_url', 
    'thumbnail_url', 'rarity_level', 'market_price_range', 'scientific_composition', 
    'crystal_structure_description', 'energy_frequency_hz', 'created_at', 'updated_at'
  ],
  user_favorite_crystals: [
    'id', 'user_id', 'profile_id', 'crystal_id', 'notes', 'personal_experience', 
    'effectiveness_rating', 'created_at'
  ],
  ai_conversations: [
    'id', 'user_id', 'profile_id', 'conversation_type', 'title', 'messages', 
    'context', 'ai_model', 'tokens_used', 'started_at', 'last_message_at', 
    'status', 'tags'
  ],
  membership_info: [
    'id', 'user_id', 'profile_id', 'membership_type', 'subscription_status', 
    'start_date', 'end_date', 'auto_renewal', 'payment_method', 'billing_history', 
    'features_enabled', 'usage_limits', 'created_at', 'updated_at'
  ],
  usage_stats: [
    'id', 'user_id', 'profile_id', 'month', 'designs_generated', 'images_created', 
    'ai_consultations', 'energy_analyses', 'meditation_sessions', 
    'premium_features_used', 'api_calls', 'storage_used_mb', 'created_at', 'updated_at'
  ],
  user_settings: [
    'id', 'user_id', 'profile_id', 'theme', 'language', 'timezone', 
    'notification_preferences', 'privacy_settings', 'display_preferences', 
    'ai_interaction_preferences', 'energy_tracking_settings', 'meditation_preferences', 
    'created_at', 'updated_at'
  ],
  user_behavior_patterns: [
    'id', 'user_id', 'session_id', 'action', 'page', 'duration', 'metadata', 
    'device_info', 'user_agent', 'ip_address', 'referrer', 'created_at'
  ],
  ml_predictions: [
    'id', 'user_id', 'prediction_type', 'input_data', 'prediction_result', 
    'confidence_score', 'model_version', 'cache_key', 'expires_at', 'created_at', 
    'last_accessed'
  ],
  dynamic_pricing_rules: [
    'id', 'rule_name', 'description', 'conditions', 'adjustments', 'priority', 
    'active', 'valid_from', 'valid_until', 'usage_count', 'success_rate', 
    'created_at', 'updated_at'
  ],
  ab_experiments: [
    'id', 'experiment_name', 'description', 'variants', 'allocation', 
    'target_metrics', 'status', 'start_date', 'end_date', 'sample_size', 
    'confidence_level', 'statistical_power', 'results', 'created_at', 'updated_at'
  ],
  ab_user_assignments: [
    'id', 'experiment_id', 'user_id', 'variant', 'assigned_at', 'first_exposure', 
    'conversion_events', 'metadata'
  ],
  analytics_metrics: [
    'id', 'metric_name', 'metric_type', 'value', 'dimensions', 'timestamp', 
    'user_id', 'session_id', 'experiment_id', 'metadata', 'created_at'
  ],
  system_logs: [
    'id', 'log_level', 'component', 'message', 'error_details', 'user_id', 
    'session_id', 'request_id', 'stack_trace', 'created_at'
  ],
  cache_management: [
    'id', 'cache_key', 'cache_type', 'data', 'expires_at', 'hit_count', 
    'last_accessed', 'created_at', 'updated_at'
  ],
  notifications: [
    'id', 'user_id', 'notification_type', 'title', 'message', 'data', 'read_at', 
    'action_url', 'priority', 'expires_at', 'created_at'
  ],
  user_feedback: [
    'id', 'user_id', 'feedback_type', 'rating', 'subject', 'message', 
    'feature_area', 'priority', 'status', 'response', 'responded_at', 
    'responded_by', 'metadata', 'created_at', 'updated_at'
  ]
};

/**
 * 获取数据库中的表结构
 */
async function getDatabaseTableSchemas() {
  try {
    console.log('🔍 获取数据库表结构...');
    
    const databaseSchemas = {};
    
    // 遍历所有本地定义的表
    for (const tableName of Object.keys(LOCAL_TABLE_SCHEMAS)) {
      try {
        // 尝试获取表结构信息
        const { data: tableInfo, error: tableError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (tableError) {
          console.log(`❌ 表 ${tableName} 不存在或无法访问: ${tableError.message}`);
          databaseSchemas[tableName] = { exists: false, fields: [] };
        } else if (tableInfo && tableInfo.length > 0) {
          // 从第一条记录推断字段
          const fields = Object.keys(tableInfo[0]);
          databaseSchemas[tableName] = { exists: true, fields };
          console.log(`✅ 表 ${tableName}: ${fields.length} 个字段`);
        } else {
          // 表存在但没有数据，尝试其他方法获取结构
          databaseSchemas[tableName] = { exists: true, fields: [] };
          console.log(`⚠️  表 ${tableName} 存在但无法获取字段信息`);
        }
      } catch (error) {
        console.log(`❌ 检查表 ${tableName} 时出错: ${error.message}`);
        databaseSchemas[tableName] = { exists: false, fields: [] };
      }
    }
    
    return databaseSchemas;
  } catch (error) {
    console.error('❌ 获取数据库表结构失败:', error);
    return {};
  }
}

/**
 * 对比表结构
 */
function compareTableSchemas(localSchemas, databaseSchemas) {
  console.log('\n📊 表结构对比结果:\n');
  
  const comparison = {
    totalTables: Object.keys(localSchemas).length,
    existingTables: 0,
    missingTables: 0,
    tablesWithDifferences: 0,
    detailedResults: {}
  };
  
  for (const tableName of Object.keys(localSchemas)) {
    const localFields = localSchemas[tableName];
    const dbInfo = databaseSchemas[tableName];
    
    const result = {
      tableName,
      exists: dbInfo?.exists || false,
      localFieldCount: localFields.length,
      dbFieldCount: dbInfo?.fields?.length || 0,
      missingFields: [],
      extraFields: [],
      differences: []
    };
    
    if (dbInfo?.exists && dbInfo?.fields) {
      comparison.existingTables++;
      
      // 找出缺失的字段
      const missingFields = localFields.filter(field => !dbInfo.fields.includes(field));
      result.missingFields = missingFields;
      
      // 找出额外的字段
      const extraFields = dbInfo.fields.filter(field => !localFields.includes(field));
      result.extraFields = extraFields;
      
      // 检查是否有差异
      if (missingFields.length > 0 || extraFields.length > 0) {
        comparison.tablesWithDifferences++;
        result.differences = [
          ...missingFields.map(field => `- 缺失字段: ${field}`),
          ...extraFields.map(field => `+ 额外字段: ${field}`)
        ];
      }
    } else {
      comparison.missingTables++;
      result.differences = ['表不存在'];
    }
    
    comparison.detailedResults[tableName] = result;
  }
  
  return comparison;
}

/**
 * 生成对比报告
 */
function generateComparisonReport(comparison) {
  console.log('='.repeat(80));
  console.log('📋 数据库表结构对比报告');
  console.log('='.repeat(80));
  
  console.log(`\n📊 总体统计:`);
  console.log(`- 总表数: ${comparison.totalTables}`);
  console.log(`- 存在的表: ${comparison.existingTables}`);
  console.log(`- 缺失的表: ${comparison.missingTables}`);
  console.log(`- 有差异的表: ${comparison.tablesWithDifferences}`);
  
  console.log('\n' + '='.repeat(80));
  console.log('📋 详细对比结果:');
  console.log('='.repeat(80));
  
  for (const tableName of Object.keys(comparison.detailedResults)) {
    const result = comparison.detailedResults[tableName];
    
    console.log(`\n📋 ${tableName}:`);
    console.log(`   状态: ${result.exists ? '✅ 存在' : '❌ 缺失'}`);
    console.log(`   本地字段数: ${result.localFieldCount}`);
    console.log(`   数据库字段数: ${result.dbFieldCount}`);
    
    if (result.differences.length > 0) {
      console.log(`   差异:`);
      result.differences.forEach(diff => {
        console.log(`     ${diff}`);
      });
    } else {
      console.log(`   差异: ✅ 无差异`);
    }
  }
  
  // 生成修复建议
  console.log('\n' + '='.repeat(80));
  console.log('🔧 修复建议:');
  console.log('='.repeat(80));
  
  const missingTables = Object.keys(comparison.detailedResults).filter(
    tableName => !comparison.detailedResults[tableName].exists
  );
  
  const tablesWithMissingFields = Object.keys(comparison.detailedResults).filter(
    tableName => comparison.detailedResults[tableName].missingFields.length > 0
  );
  
  if (missingTables.length > 0) {
    console.log(`\n❌ 缺失的表 (${missingTables.length} 个):`);
    missingTables.forEach(tableName => {
      console.log(`   - ${tableName}`);
    });
  }
  
  if (tablesWithMissingFields.length > 0) {
    console.log(`\n⚠️  缺少字段的表 (${tablesWithMissingFields.length} 个):`);
    tablesWithMissingFields.forEach(tableName => {
      const result = comparison.detailedResults[tableName];
      console.log(`   - ${tableName}: ${result.missingFields.join(', ')}`);
    });
  }
  
  if (missingTables.length === 0 && tablesWithMissingFields.length === 0) {
    console.log('\n✅ 所有表结构都匹配，无需修复！');
  } else {
    console.log('\n💡 建议执行数据库修复脚本来解决这些问题');
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🚀 开始对比本地与数据库表结构...\n');
    
    // 1. 获取数据库表结构
    const databaseSchemas = await getDatabaseTableSchemas();
    
    // 2. 对比表结构
    const comparison = compareTableSchemas(LOCAL_TABLE_SCHEMAS, databaseSchemas);
    
    // 3. 生成报告
    generateComparisonReport(comparison);
    
    console.log('\n✅ 对比完成');
    
  } catch (error) {
    console.error('❌ 对比失败:', error);
  }
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