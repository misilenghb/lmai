import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 静态导出配置
export const dynamic = 'force-static';
export const revalidate = false;

// 本地表格定义
const LOCAL_TABLE_DEFINITIONS = {
  profiles: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'UUID',
    email: 'VARCHAR(255) UNIQUE',
    name: 'VARCHAR(255)',
    birth_date: 'DATE',
    gender: 'VARCHAR(10)',
    zodiac_sign: 'VARCHAR(20)',
    chinese_zodiac: 'VARCHAR(20)',
    element: 'VARCHAR(20)',
    mbti: 'VARCHAR(10)',
    answers: 'JSONB',
    chakra_analysis: 'JSONB',
    energy_preferences: 'JSONB',
    personality_insights: 'JSONB',
    enhanced_assessment: 'JSONB',
    password_hash: 'VARCHAR(255)',
    password_salt: 'VARCHAR(255)',
    password_reset_token: 'VARCHAR(255)',
    password_reset_expires: 'TIMESTAMP WITH TIME ZONE',
    last_login: 'TIMESTAMP WITH TIME ZONE',
    login_attempts: 'INTEGER DEFAULT 0',
    account_locked_until: 'TIMESTAMP WITH TIME ZONE',
    security_question_1: 'VARCHAR(500)',
    security_answer_1: 'VARCHAR(255)',
    security_question_2: 'VARCHAR(500)',
    security_answer_2: 'VARCHAR(255)',
    security_question_3: 'VARCHAR(500)',
    security_answer_3: 'VARCHAR(255)',
    created_at: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    updated_at: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
  },
  design_works: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'UUID REFERENCES profiles(id)',
    title: 'VARCHAR(255)',
    description: 'TEXT',
    design_data: 'JSONB',
    image_url: 'TEXT',
    is_public: 'BOOLEAN DEFAULT false',
    created_at: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    updated_at: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
  },
  user_energy_records: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'UUID REFERENCES profiles(id)',
    date: 'DATE',
    energy_data: 'JSONB',
    mood_score: 'INTEGER',
    notes: 'TEXT',
    created_at: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
  },
  meditation_sessions: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'UUID REFERENCES profiles(id)',
    duration: 'INTEGER',
    type: 'VARCHAR(50)',
    completed_at: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    notes: 'TEXT'
  },
  membership_info: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'UUID REFERENCES profiles(id)',
    plan_type: 'VARCHAR(20) DEFAULT \'free\'',
    start_date: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    end_date: 'TIMESTAMP WITH TIME ZONE',
    is_active: 'BOOLEAN DEFAULT true',
    created_at: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
  },
  usage_stats: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'UUID REFERENCES profiles(id)',
    feature: 'VARCHAR(50)',
    usage_count: 'INTEGER DEFAULT 0',
    last_used: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    created_at: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
  },
  user_settings: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'UUID REFERENCES profiles(id)',
    settings_data: 'JSONB',
    created_at: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    updated_at: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
  },
  crystals: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    name: 'VARCHAR(255)',
    description: 'TEXT',
    properties: 'JSONB',
    chakra: 'VARCHAR(50)',
    color: 'VARCHAR(50)',
    hardness: 'DECIMAL(3,1)',
    created_at: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
  },
  user_favorite_crystals: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'UUID REFERENCES profiles(id)',
    crystal_id: 'UUID REFERENCES crystals(id)',
    created_at: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
  },
  ai_conversations: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'UUID REFERENCES profiles(id)',
    conversation_data: 'JSONB',
    created_at: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
  }
};

/**
 * 表格对比 API
 * POST /api/table-compare
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'compare':
        return await handleTableComparison();
      case 'generateSQL':
        return await handleGenerateSQL();
      default:
        return NextResponse.json({
          success: false,
          error: '无效的操作类型'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('表格对比 API 错误:', error);
    return NextResponse.json({
      success: false,
      error: '服务器内部错误'
    }, { status: 500 });
  }
}

/**
 * 执行表格对比
 */
async function handleTableComparison() {
  try {
    const comparisons = [];
    let totalTables = 0;
    let missingTables = 0;
    let missingFields = 0;
    let typeMismatches = 0;

    for (const [tableName, localFields] of Object.entries(LOCAL_TABLE_DEFINITIONS)) {
      totalTables++;
      
      // 检查表格是否存在
      const { data: tableExists, error: tableError } = await supabase
        .from(tableName)
        .select('*')
        .limit(0);

      const existsInDb = !tableError || tableError.code !== '42P01';
      
      if (!existsInDb) {
        missingTables++;
      }

      // 获取数据库表格结构
      let dbColumns: any[] = [];
      if (existsInDb) {
        try {
          const { data: columnsData, error: columnsError } = await supabase.rpc('exec_sql', {
            sql_query: `
              SELECT column_name, data_type, is_nullable, column_default
              FROM information_schema.columns 
              WHERE table_name = '${tableName}' 
              ORDER BY ordinal_position;
            `
          });
          
          if (!columnsError && columnsData) {
            dbColumns = Array.isArray(columnsData) ? columnsData : [];
          }
        } catch (error) {
          console.warn(`获取表 ${tableName} 结构失败:`, error);
        }
      }

      // 对比字段
      const fields = [];
      const dbColumnMap = new Map(dbColumns.map(col => [col.column_name, col]));
      
      // 检查本地定义的字段
      for (const [fieldName, localType] of Object.entries(localFields)) {
        const dbColumn = dbColumnMap.get(fieldName);
        
        if (!dbColumn) {
          fields.push({
            fieldName,
            localType,
            status: 'missing_in_db',
            localDefinition: localType
          });
          missingFields++;
        } else {
          const dbType = `${dbColumn.data_type}${dbColumn.is_nullable === 'NO' ? ' NOT NULL' : ''}`;
          const isMatch = normalizeType(localType).includes(normalizeType(dbColumn.data_type));
          
          fields.push({
            fieldName,
            localType,
            dbType,
            status: isMatch ? 'match' : 'type_mismatch',
            localDefinition: localType,
            dbDefinition: dbType
          });
          
          if (!isMatch) {
            typeMismatches++;
          }
        }
      }
      
      // 检查数据库中存在但本地没有定义的字段
      for (const dbColumn of dbColumns) {
        if (!localFields[dbColumn.column_name]) {
          fields.push({
            fieldName: dbColumn.column_name,
            dbType: dbColumn.data_type,
            status: 'missing_in_local',
            dbDefinition: `${dbColumn.data_type}${dbColumn.is_nullable === 'NO' ? ' NOT NULL' : ''}`
          });
        }
      }

      comparisons.push({
        tableName,
        existsInLocal: true,
        existsInDb,
        fields
      });
    }

    const summary = {
      totalTables,
      missingTables,
      missingFields,
      typeMismatches
    };

    return NextResponse.json({
      success: true,
      comparisons,
      summary
    });

  } catch (error) {
    console.error('表格对比失败:', error);
    return NextResponse.json({
      success: false,
      error: '表格对比失败'
    }, { status: 500 });
  }
}

/**
 * 生成修复 SQL
 */
async function handleGenerateSQL() {
  try {
    const sqlStatements = [];
    
    // 重新执行对比以获取最新数据
    const comparisonResult = await handleTableComparison();
    const comparisonData = await comparisonResult.json();
    
    if (!comparisonData.success) {
      throw new Error('无法获取对比数据');
    }

    for (const table of comparisonData.comparisons) {
      // 如果表格不存在，创建表格
      if (!table.existsInDb) {
        const localDef = LOCAL_TABLE_DEFINITIONS[table.tableName];
        const columns = Object.entries(localDef)
          .map(([name, type]) => `  ${name} ${type}`)
          .join(',\n');
        
        sqlStatements.push(`-- 创建表格 ${table.tableName}`);
        sqlStatements.push(`CREATE TABLE IF NOT EXISTS ${table.tableName} (\n${columns}\n);`);
        sqlStatements.push('');
      } else {
        // 添加缺失的字段
        const missingFields = table.fields.filter(f => f.status === 'missing_in_db');
        if (missingFields.length > 0) {
          sqlStatements.push(`-- 为表格 ${table.tableName} 添加缺失字段`);
          for (const field of missingFields) {
            sqlStatements.push(`ALTER TABLE ${table.tableName} ADD COLUMN IF NOT EXISTS ${field.fieldName} ${field.localDefinition};`);
          }
          sqlStatements.push('');
        }
      }
    }

    const sql = sqlStatements.join('\n');

    return NextResponse.json({
      success: true,
      sql
    });

  } catch (error) {
    console.error('生成 SQL 失败:', error);
    return NextResponse.json({
      success: false,
      error: '生成 SQL 失败'
    }, { status: 500 });
  }
}

/**
 * 标准化类型名称用于比较
 */
function normalizeType(type: string): string {
  return type.toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/varchar\(\d+\)/g, 'varchar')
    .replace(/decimal\(\d+,\d+\)/g, 'decimal')
    .replace(/timestamp with time zone/g, 'timestamptz')
    .trim();
}
