'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { testSupabaseConnection, supabase } from '@/lib/supabase';

export default function TestDatabaseConnection() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testConnection = async () => {
    setIsLoading(true);
    clearResults();
    
    addResult('🚀 开始数据库连接测试...');
    
    try {
      // 测试基础连接
      const isConnected = await testSupabaseConnection();
      
      if (isConnected) {
        addResult('✅ 基础连接测试成功');
        
        // 测试具体表格
        await testTables();
        
        addResult('🎉 所有测试完成！');
      } else {
        addResult('❌ 基础连接测试失败');
      }
    } catch (error) {
      addResult(`❌ 连接测试异常: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testTables = async () => {
    const tables = [
      'profiles',
      'design_works', 
      'user_energy_records',
      'meditation_sessions',
      'membership_info',
      'usage_stats',
      'user_settings',
      'crystals',
      'user_favorite_crystals',
      'ai_conversations'
    ];

    addResult('📊 开始测试数据库表格...');

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);

        if (error) {
          if (error.code === '42P01') {
            addResult(`⚠️ 表格 ${table}: 不存在`);
          } else {
            addResult(`❌ 表格 ${table}: ${error.message}`);
          }
        } else {
          addResult(`✅ 表格 ${table}: 连接成功 (${data?.length || 0} 条记录)`);
        }
      } catch (err) {
        addResult(`❌ 表格 ${table}: 异常 - ${err}`);
      }
    }
  };

  const testAuth = async () => {
    setIsLoading(true);
    addResult('🔐 测试认证服务...');
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        addResult(`❌ 认证服务错误: ${error.message}`);
      } else {
        addResult(`✅ 认证服务正常 - 会话状态: ${data.session ? '已登录' : '未登录'}`);
        if (data.session) {
          addResult(`👤 用户信息: ${data.session.user.email || '无邮箱'}`);
        }
      }
    } catch (error) {
      addResult(`❌ 认证服务异常: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testEnvironment = () => {
    addResult('🌍 检查环境变量...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    addResult(`📋 SUPABASE_URL: ${supabaseUrl ? '✅ 已配置' : '❌ 未配置'}`);
    addResult(`🔑 SUPABASE_ANON_KEY: ${supabaseKey ? '✅ 已配置' : '❌ 未配置'}`);
    
    if (supabaseUrl) {
      addResult(`🔗 URL: ${supabaseUrl}`);
    }
    if (supabaseKey) {
      addResult(`🔑 Key: ${supabaseKey.substring(0, 50)}...`);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🔍 数据库连接测试</CardTitle>
          <CardDescription>
            测试与 Supabase 数据库的连接状态和表格可用性
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={testConnection} 
              disabled={isLoading}
              variant="default"
            >
              {isLoading ? '测试中...' : '🚀 完整连接测试'}
            </Button>
            
            <Button 
              onClick={testAuth} 
              disabled={isLoading}
              variant="outline"
            >
              🔐 测试认证服务
            </Button>
            
            <Button 
              onClick={testEnvironment} 
              disabled={isLoading}
              variant="outline"
            >
              🌍 检查环境变量
            </Button>
            
            <Button 
              onClick={clearResults} 
              disabled={isLoading}
              variant="secondary"
            >
              🧹 清空结果
            </Button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">测试结果:</h3>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500">点击上方按钮开始测试...</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              💡 故障排除提示:
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• 如果环境变量未配置，请检查 .env.local 文件</li>
              <li>• 如果表格不存在，请运行数据库迁移</li>
              <li>• 如果权限错误，请检查 Supabase RLS 策略</li>
              <li>• 如果网络错误，请检查 Supabase 项目状态</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
