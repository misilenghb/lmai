import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 静态导出配置
export const dynamic = 'force-static';
export const revalidate = false;

/**
 * 直接执行 SQL 的 API
 * POST /api/execute-sql
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sql } = body;

    if (!sql) {
      return NextResponse.json({
        success: false,
        error: 'SQL 语句不能为空'
      }, { status: 400 });
    }

    console.log('🔧 执行 SQL:', sql.substring(0, 100) + '...');

    // 直接执行 SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: sql
    });

    if (error) {
      console.error('❌ SQL 执行失败:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      });
    }

    console.log('✅ SQL 执行成功');
    return NextResponse.json({
      success: true,
      data,
      message: 'SQL 执行成功'
    });

  } catch (error) {
    console.error('❌ SQL 执行异常:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}

/**
 * 执行预定义的修复脚本
 * GET /api/execute-sql?action=fix-security
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'fix-security') {
    const securityFixSQL = `
-- 添加安全问题字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_question_1 VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_answer_1 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_question_2 VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_answer_2 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_question_3 VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_answer_3 VARCHAR(255);

-- 更新测试用户数据
UPDATE profiles SET 
  security_question_1 = '您的第一只宠物叫什么名字？',
  security_answer_1 = '小白',
  security_question_2 = '您的出生城市是哪里？',
  security_answer_2 = '北京',
  security_question_3 = '您最喜欢的颜色是什么？',
  security_answer_3 = '蓝色'
WHERE email = 'admin@lmai.cc';

-- 创建获取安全问题函数
CREATE OR REPLACE FUNCTION get_security_questions(input_email TEXT)
RETURNS TABLE(success BOOLEAN, question1 TEXT, question2 TEXT, question3 TEXT, error_message TEXT)
AS $$
DECLARE
  user_record RECORD;
BEGIN
  SELECT security_question_1, security_question_2, security_question_3
  INTO user_record FROM profiles WHERE email = input_email;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::TEXT, NULL::TEXT, '用户不存在';
    RETURN;
  END IF;
  
  RETURN QUERY SELECT TRUE, user_record.security_question_1, user_record.security_question_2, user_record.security_question_3, NULL::TEXT;
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: securityFixSQL
      });

      if (error) {
        return NextResponse.json({
          success: false,
          error: error.message,
          action: 'fix-security'
        });
      }

      return NextResponse.json({
        success: true,
        data,
        action: 'fix-security',
        message: '安全问题功能修复完成'
      });

    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        action: 'fix-security'
      }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: false,
    error: '未知的操作类型'
  }, { status: 400 });
}
