import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 静态导出配置
export const dynamic = 'force-static';
export const revalidate = false;

/**
 * 快速测试表格对比功能
 * GET /api/test-compare
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 开始快速表格对比测试...');
    
    // 测试1: 检查 profiles 表是否存在
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    const profilesExists = !profilesError || profilesError.code !== '42P01';
    
    // 测试2: 获取 profiles 表结构
    let profilesColumns = [];
    if (profilesExists) {
      try {
        const { data: columnsData, error: columnsError } = await supabase.rpc('exec_sql', {
          sql_query: `
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'profiles' 
            ORDER BY ordinal_position;
          `
        });
        
        if (!columnsError && columnsData) {
          profilesColumns = Array.isArray(columnsData) ? columnsData : [];
        }
      } catch (error) {
        console.warn('获取 profiles 表结构失败:', error);
      }
    }
    
    // 测试3: 检查其他核心表
    const coreTables = ['design_works', 'user_energy_records', 'meditation_sessions', 'crystals'];
    const tableStatus = {};
    
    for (const tableName of coreTables) {
      try {
        const { error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        tableStatus[tableName] = !error || error.code !== '42P01';
      } catch (error) {
        tableStatus[tableName] = false;
      }
    }
    
    // 测试4: 检查安全问题字段
    const securityFields = [
      'security_question_1', 'security_answer_1',
      'security_question_2', 'security_answer_2', 
      'security_question_3', 'security_answer_3'
    ];
    
    const securityFieldsStatus = {};
    for (const field of securityFields) {
      const hasField = profilesColumns.some(col => col.column_name === field);
      securityFieldsStatus[field] = hasField;
    }
    
    // 测试5: 检查密码字段
    const passwordFields = [
      'password_hash', 'password_salt', 'password_reset_token',
      'password_reset_expires', 'last_login', 'login_attempts', 'account_locked_until'
    ];
    
    const passwordFieldsStatus = {};
    for (const field of passwordFields) {
      const hasField = profilesColumns.some(col => col.column_name === field);
      passwordFieldsStatus[field] = hasField;
    }
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results: {
        profilesTable: {
          exists: profilesExists,
          totalColumns: profilesColumns.length,
          columns: profilesColumns.map(col => ({
            name: col.column_name,
            type: col.data_type,
            nullable: col.is_nullable === 'YES'
          }))
        },
        coreTables: tableStatus,
        securityFields: securityFieldsStatus,
        passwordFields: passwordFieldsStatus,
        summary: {
          totalCoreTables: coreTables.length,
          existingCoreTables: Object.values(tableStatus).filter(Boolean).length,
          totalSecurityFields: securityFields.length,
          existingSecurityFields: Object.values(securityFieldsStatus).filter(Boolean).length,
          totalPasswordFields: passwordFields.length,
          existingPasswordFields: Object.values(passwordFieldsStatus).filter(Boolean).length
        }
      }
    });

  } catch (error) {
    console.error('❌ 快速对比测试失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * 执行简单的字段检查
 * POST /api/test-compare
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableName, fieldName } = body;

    if (!tableName || !fieldName) {
      return NextResponse.json({
        success: false,
        error: '缺少表名或字段名'
      }, { status: 400 });
    }

    // 检查字段是否存在
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = '${tableName}' AND column_name = '${fieldName}';
      `
    });

    const fieldExists = !error && data && Array.isArray(data) && data.length > 0;

    return NextResponse.json({
      success: true,
      tableName,
      fieldName,
      exists: fieldExists,
      fieldInfo: fieldExists ? data[0] : null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 字段检查失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}
