import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

// 静态导出配置
export const dynamic = 'force-static';
export const revalidate = false;

/**
 * 执行密码字段数据库迁移
 * POST /api/migrate-password
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔐 开始密码字段数据库迁移...');
    
    // 读取迁移 SQL 文件
    const sqlFilePath = path.join(process.cwd(), 'src/lib/password-migration.sql');
    let migrationSQL: string;
    
    try {
      migrationSQL = fs.readFileSync(sqlFilePath, 'utf8');
    } catch (error) {
      console.error('❌ 无法读取迁移文件:', error);
      return NextResponse.json({
        success: false,
        error: '无法读取迁移文件',
        message: '迁移文件不存在或无法访问'
      }, { status: 500 });
    }
    
    // 分割 SQL 语句（按分号分割，忽略函数内的分号）
    const sqlStatements = migrationSQL
      .split(/;\s*(?=(?:[^']*'[^']*')*[^']*$)/) // 分割SQL语句，忽略字符串内的分号
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--')); // 过滤空语句和注释
    
    const results = [];
    let successCount = 0;
    
    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i];
      if (!statement) continue;
      
      try {
        console.log(`执行 SQL 语句 ${i + 1}/${sqlStatements.length}...`);
        
        // 执行 SQL 语句
        const { data, error } = await supabase.rpc('exec_sql', {
          sql_query: statement
        });
        
        if (error) {
          console.error(`❌ SQL 语句 ${i + 1} 执行失败:`, error);
          results.push({
            statement: statement.substring(0, 100) + '...',
            success: false,
            error: error.message
          });
        } else {
          console.log(`✅ SQL 语句 ${i + 1} 执行成功`);
          results.push({
            statement: statement.substring(0, 100) + '...',
            success: true
          });
          successCount++;
        }
      } catch (err) {
        console.error(`❌ SQL 语句 ${i + 1} 执行异常:`, err);
        results.push({
          statement: statement.substring(0, 100) + '...',
          success: false,
          error: err instanceof Error ? err.message : '未知错误'
        });
      }
    }
    
    // 验证迁移结果
    const verificationResults = await verifyMigration();
    
    const overallSuccess = successCount === sqlStatements.length;
    
    return NextResponse.json({
      success: overallSuccess,
      message: overallSuccess ? '密码字段迁移完成' : '密码字段迁移部分失败',
      results: {
        totalStatements: sqlStatements.length,
        successfulStatements: successCount,
        failedStatements: sqlStatements.length - successCount,
        details: results,
        verification: verificationResults
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 密码字段迁移失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      message: '密码字段迁移失败'
    }, { status: 500 });
  }
}

/**
 * 检查密码字段迁移状态
 * GET /api/migrate-password
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 检查密码字段迁移状态...');
    
    const verificationResults = await verifyMigration();
    
    return NextResponse.json({
      success: true,
      message: '密码字段状态检查完成',
      results: verificationResults,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 密码字段状态检查失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      message: '密码字段状态检查失败'
    }, { status: 500 });
  }
}

/**
 * 验证密码字段迁移结果
 */
async function verifyMigration(): Promise<{
  columnsExist: { [key: string]: boolean };
  functionsExist: { [key: string]: boolean };
  testUsersExist: boolean;
  overallStatus: 'complete' | 'partial' | 'failed';
}> {
  const results = {
    columnsExist: {},
    functionsExist: {},
    testUsersExist: false,
    overallStatus: 'failed' as 'complete' | 'partial' | 'failed'
  };
  
  try {
    // 检查密码相关字段是否存在
    const passwordColumns = [
      'password_hash',
      'password_salt', 
      'password_reset_token',
      'password_reset_expires',
      'last_login',
      'login_attempts',
      'account_locked_until'
    ];
    
    for (const column of passwordColumns) {
      try {
        const { error } = await supabase
          .from('profiles')
          .select(column)
          .limit(1);
        
        results.columnsExist[column] = !error;
      } catch (err) {
        results.columnsExist[column] = false;
      }
    }
    
    // 检查函数是否存在
    const functions = ['verify_password', 'register_user', 'request_password_reset'];
    
    for (const func of functions) {
      try {
        // 尝试调用函数来检查是否存在
        const { error } = await supabase.rpc(func, {});
        // 如果函数存在但参数错误，这是正常的
        results.functionsExist[func] = !error || error.message.includes('argument');
      } catch (err) {
        results.functionsExist[func] = false;
      }
    }
    
    // 检查测试用户是否存在
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .in('email', ['admin@lmai.cc', 'user@lmai.cc', 'test@lmai.cc']);
      
      results.testUsersExist = !error && data && data.length > 0;
    } catch (err) {
      results.testUsersExist = false;
    }
    
    // 计算整体状态
    const columnCount = Object.values(results.columnsExist).filter(Boolean).length;
    const functionCount = Object.values(results.functionsExist).filter(Boolean).length;
    
    if (columnCount === passwordColumns.length && functionCount === functions.length && results.testUsersExist) {
      results.overallStatus = 'complete';
    } else if (columnCount > 0 || functionCount > 0) {
      results.overallStatus = 'partial';
    } else {
      results.overallStatus = 'failed';
    }
    
  } catch (error) {
    console.error('验证迁移结果时发生错误:', error);
  }
  
  return results;
}
