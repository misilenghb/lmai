import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

// 静态导出配置
export const dynamic = 'force-static';
export const revalidate = false;

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 开始执行数据库修复...');
    
    // 读取SQL修复脚本
    const sqlPath = path.join(process.cwd(), 'scripts', 'fix-database.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // 分割SQL语句
    const sqlStatements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    
    console.log(`📋 执行 ${sqlStatements.length} 条SQL语句...`);
    
    for (let i = 0; i < sqlStatements.length; i++) {
      const sql = sqlStatements[i];
      
      try {
        // 注意：这里需要服务端角色密钥才能执行DDL操作
        // 由于我们只有匿名密钥，这里会失败
        console.log(`⚠️  需要服务端角色密钥才能执行DDL操作`);
        
        results.push({
          statement: i + 1,
          sql: sql.substring(0, 100) + '...',
          success: false,
          error: '需要服务端角色密钥才能执行DDL操作'
        });
        errorCount++;
        
      } catch (error) {
        results.push({
          statement: i + 1,
          sql: sql.substring(0, 100) + '...',
          success: false,
          error: error instanceof Error ? error.message : '未知错误'
        });
        errorCount++;
      }
    }
    
    console.log(`📊 修复完成: ${successCount} 成功, ${errorCount} 失败`);
    
    return NextResponse.json({
      success: errorCount === 0,
      message: errorCount === 0 ? '数据库修复完成' : '数据库修复部分失败',
      results,
      summary: {
        totalStatements: sqlStatements.length,
        successfulStatements: successCount,
        failedStatements: errorCount
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 数据库修复失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      message: '数据库修复失败'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 检查数据库修复状态...');
    
    // 检查 design_works 表是否存在
    const { data: designWorksExists, error: designWorksError } = await supabase
      .from('design_works')
      .select('count')
      .limit(1);
    
    const designWorksStatus = designWorksError ? 'missing' : 'exists';
    
    // 检查 RLS 策略
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    const rlsStatus = profilesError?.message?.includes('row-level security') ? 'enabled' : 'disabled';
    
    return NextResponse.json({
      success: true,
      status: {
        designWorksTable: designWorksStatus,
        rlsPolicies: rlsStatus
      },
      message: designWorksStatus === 'exists' ? '数据库修复完成' : '需要执行数据库修复',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 检查数据库修复状态失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      message: '检查数据库修复状态失败'
    }, { status: 500 });
  }
} 