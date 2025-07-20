import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

// 静态导出配置
export const dynamic = 'force-static';
export const revalidate = false;

/**
 * 生成密码哈希和盐值
 */
function generatePasswordHash(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 开始更新所有用户密码...');
    
    // 1. 获取所有用户
    console.log('📋 获取所有用户...');
    const { data: users, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, name');
    
    if (fetchError) {
      console.error('❌ 获取用户失败:', fetchError.message);
      return NextResponse.json({
        success: false,
        error: fetchError.message,
        message: '获取用户失败'
      }, { status: 500 });
    }
    
    if (!users || users.length === 0) {
      console.log('ℹ️  没有找到任何用户');
      return NextResponse.json({
        success: true,
        message: '没有找到任何用户',
        updatedCount: 0
      });
    }
    
    console.log(`✅ 找到 ${users.length} 个用户`);
    
    // 2. 为每个用户生成密码哈希
    const defaultPassword = '123456';
    const { hash, salt } = generatePasswordHash(defaultPassword);
    
    console.log('🔧 生成密码哈希...');
    console.log(`默认密码: ${defaultPassword}`);
    console.log(`哈希: ${hash.substring(0, 20)}...`);
    console.log(`盐值: ${salt.substring(0, 20)}...`);
    
    // 3. 更新所有用户的密码
    console.log('\n📝 更新用户密码...');
    const updatePromises = users.map(async (user) => {
      try {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            password_hash: hash,
            password_salt: salt,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
        
        if (updateError) {
          console.error(`❌ 更新用户 ${user.email} 密码失败:`, updateError.message);
          return { success: false, user: user.email, error: updateError.message };
        } else {
          console.log(`✅ 用户 ${user.email} 密码更新成功`);
          return { success: true, user: user.email };
        }
      } catch (error) {
        console.error(`❌ 更新用户 ${user.email} 密码异常:`, error);
        return { success: false, user: user.email, error: error instanceof Error ? error.message : '未知错误' };
      }
    });
    
    const results = await Promise.all(updatePromises);
    
    // 4. 统计结果
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    console.log('\n📊 更新结果:');
    console.log(`✅ 成功: ${successCount} 个用户`);
    console.log(`❌ 失败: ${failureCount} 个用户`);
    
    // 5. 验证更新
    console.log('\n🔍 验证密码更新...');
    const { data: verifyUsers, error: verifyError } = await supabase
      .from('profiles')
      .select('email, password_hash, password_salt')
      .not('password_hash', 'is', null);
    
    let verificationCount = 0;
    if (!verifyError && verifyUsers) {
      verificationCount = verifyUsers.filter(u => u.password_hash && u.password_salt).length;
    }
    
    const response = {
      success: failureCount === 0,
      message: failureCount === 0 ? '所有用户密码更新成功' : '部分用户密码更新失败',
      summary: {
        totalUsers: users.length,
        successfulUpdates: successCount,
        failedUpdates: failureCount,
        verifiedUsers: verificationCount
      },
      results: results.map(r => ({
        user: r.user,
        success: r.success,
        error: r.error
      })),
      defaultPassword: defaultPassword,
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ 密码更新完成！');
    console.log('💡 所有用户现在可以使用密码 "123456" 登录');
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ 更新密码失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      message: '更新密码失败'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 检查密码状态...');
    
    // 检查有多少用户已设置密码
    const { data: usersWithPassword, error: fetchError } = await supabase
      .from('profiles')
      .select('email, password_hash, password_salt')
      .not('password_hash', 'is', null);
    
    if (fetchError) {
      return NextResponse.json({
        success: false,
        error: fetchError.message,
        message: '检查密码状态失败'
      }, { status: 500 });
    }
    
    // 获取总用户数
    const { data: allUsers, error: allUsersError } = await supabase
      .from('profiles')
      .select('email');
    
    const totalUsers = allUsers?.length || 0;
    const usersWithPasswordCount = usersWithPassword?.length || 0;
    const usersWithoutPasswordCount = totalUsers - usersWithPasswordCount;
    
    return NextResponse.json({
      success: true,
      summary: {
        totalUsers,
        usersWithPassword: usersWithPasswordCount,
        usersWithoutPassword: usersWithoutPasswordCount,
        percentageWithPassword: totalUsers > 0 ? Math.round((usersWithPasswordCount / totalUsers) * 100) : 0
      },
      message: usersWithPasswordCount === totalUsers ? '所有用户都已设置密码' : '部分用户未设置密码',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 检查密码状态失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      message: '检查密码状态失败'
    }, { status: 500 });
  }
} 