import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('开始数据库迁移检查...')

    // 检查表是否存在的简单方法
    const tableChecks = []
    const tables = ['profiles', 'crystal_designs', 'crystal_calendar_events']

    for (const tableName of tables) {
      try {
        console.log(`检查表: ${tableName}`)

        // 尝试查询表来检查是否存在
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)

        if (error) {
          console.log(`表 ${tableName} 不存在或有错误:`, error.message)
          tableChecks.push({
            table: tableName,
            exists: false,
            error: error.message,
            needsCreation: true
          })
        } else {
          console.log(`表 ${tableName} 存在`)
          tableChecks.push({
            table: tableName,
            exists: true,
            error: null,
            needsCreation: false
          })
        }
      } catch (err) {
        console.error(`检查表 ${tableName} 时异常:`, err)
        tableChecks.push({
          table: tableName,
          exists: false,
          error: err.message,
          needsCreation: true
        })
      }
    }

    // 提供创建表的 SQL 语句
    const createTableSQL = {
      profiles: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(100),
          birth_date DATE,
          gender VARCHAR(50),
          zodiac_sign VARCHAR(50),
          chinese_zodiac VARCHAR(50),
          element VARCHAR(50),
          mbti VARCHAR(10),
          answers JSONB DEFAULT '{}',
          chakra_analysis JSONB DEFAULT '{}',
          energy_preferences TEXT[],
          personality_insights TEXT[],
          enhanced_assessment JSONB DEFAULT '{}',
          avatar_url TEXT,
          location VARCHAR(100),
          timezone VARCHAR(50),
          language VARCHAR(10) DEFAULT 'zh',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
      crystal_designs: `
        CREATE TABLE IF NOT EXISTS crystal_designs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID,
          name TEXT NOT NULL,
          description TEXT,
          design_data JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
      crystal_calendar_events: `
        CREATE TABLE IF NOT EXISTS crystal_calendar_events (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID,
          title TEXT NOT NULL,
          description TEXT,
          event_date DATE NOT NULL,
          crystal_type TEXT,
          event_data JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }

    res.status(200).json({
      success: true,
      message: '数据库迁移检查完成',
      tableChecks: tableChecks,
      createTableSQL: createTableSQL,
      instructions: '请在 Supabase 控制台的 SQL 编辑器中执行相应的 CREATE TABLE 语句',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('数据库迁移检查失败:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}
