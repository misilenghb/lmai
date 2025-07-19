import { NextRequest, NextResponse } from 'next/server';

// 静态导出配置
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(request: NextRequest) {
  const missingTablesSql = `-- 水晶日历系统 - 缺失表格创建脚本
-- 请将以下SQL语句复制到Supabase Dashboard的SQL编辑器中执行

-- 17. 系统日志表 (system_logs)
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  log_level VARCHAR(20) NOT NULL,
  component VARCHAR(100),
  message TEXT NOT NULL,
  error_details JSONB DEFAULT '{}',
  user_id UUID,
  session_id VARCHAR(100),
  request_id VARCHAR(100),
  stack_trace TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. 缓存管理表 (cache_management)
CREATE TABLE IF NOT EXISTS cache_management (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key VARCHAR(255) UNIQUE NOT NULL,
  cache_type VARCHAR(50) NOT NULL,
  data JSONB,
  expires_at TIMESTAMP WITH TIME ZONE,
  hit_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. 通知管理表 (notifications)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  notification_type VARCHAR(50) NOT NULL,
  title VARCHAR(200),
  message TEXT,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT,
  priority VARCHAR(20) DEFAULT 'normal',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 20. 反馈收集表 (user_feedback)
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  feedback_type VARCHAR(50) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  subject VARCHAR(200),
  message TEXT,
  feature_area VARCHAR(100),
  priority VARCHAR(20) DEFAULT 'normal',
  status VARCHAR(50) DEFAULT 'open',
  response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  responded_by UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(log_level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_cache_management_key ON cache_management(cache_key);
CREATE INDEX IF NOT EXISTS idx_cache_management_expires ON cache_management(expires_at);
CREATE INDEX IF NOT EXISTS idx_cache_management_type ON cache_management(cache_type);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(notification_type);

CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_status ON user_feedback(status);
CREATE INDEX IF NOT EXISTS idx_user_feedback_type ON user_feedback(feedback_type);

-- 插入一些示例数据（可选）
INSERT INTO system_logs (log_level, component, message) VALUES 
('INFO', 'database', '数据库表格创建完成') 
ON CONFLICT DO NOTHING;

-- 执行完成后的验证查询
-- SELECT 'system_logs' as table_name, COUNT(*) as record_count FROM system_logs
-- UNION ALL
-- SELECT 'cache_management', COUNT(*) FROM cache_management
-- UNION ALL  
-- SELECT 'notifications', COUNT(*) FROM notifications
-- UNION ALL
-- SELECT 'user_feedback', COUNT(*) FROM user_feedback;`;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const projectRef = supabaseUrl ? supabaseUrl.split('//')[1].split('.')[0] : '';

  return NextResponse.json({
    success: true,
    sql: missingTablesSql,
    instructions: [
      '1. 复制上方的SQL语句',
      '2. 打开Supabase Dashboard的SQL编辑器',
      '3. 粘贴SQL语句并点击"Run"执行',
      '4. 等待执行完成（应该显示成功消息）',
      '5. 返回系统检查表格状态'
    ],
    dashboardUrl: `https://supabase.com/dashboard/project/${projectRef}/sql`,
    missingTables: [
      'system_logs',
      'cache_management', 
      'notifications',
      'user_feedback'
    ],
    timestamp: new Date().toISOString()
  });
}
