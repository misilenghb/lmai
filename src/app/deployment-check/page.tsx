'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

export default function DeploymentCheck() {
  const [checks, setChecks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [environment, setEnvironment] = useState<string>('unknown');

  useEffect(() => {
    // 检测环境
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        setEnvironment('development');
      } else if (hostname.includes('.pages.dev')) {
        setEnvironment('cloudflare-pages');
      } else {
        setEnvironment('production');
      }
    }
  }, []);

  const addCheck = (name: string, status: 'success' | 'error' | 'warning', message: string, details?: any) => {
    setChecks(prev => [...prev, {
      name,
      status,
      message,
      details,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const clearChecks = () => {
    setChecks([]);
  };

  const runDeploymentChecks = async () => {
    setIsLoading(true);
    clearChecks();

    addCheck('环境检测', 'success', `当前环境: ${environment}`);

    // 1. 检查环境变量
    checkEnvironmentVariables();

    // 2. 检查网络连接
    await checkNetworkConnectivity();

    // 3. 检查 Supabase 连接
    await checkSupabaseConnection();

    // 4. 检查数据库表格
    await checkDatabaseTables();

    // 5. 检查 API 路由
    await checkApiRoutes();

    setIsLoading(false);
  };

  const checkEnvironmentVariables = () => {
    addCheck('环境变量检查', 'success', '开始检查环境变量...');

    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];

    const optionalVars = [
      'POLLINATIONS_API_TOKEN',
      'POLLINATIONS_TEXT_MODEL',
      'POLLINATIONS_IMAGE_MODEL'
    ];

    requiredVars.forEach(varName => {
      const value = process.env[varName];
      if (value) {
        addCheck(
          `必需变量 ${varName}`,
          'success',
          '已配置',
          { value: value.substring(0, 50) + '...' }
        );
      } else {
        addCheck(
          `必需变量 ${varName}`,
          'error',
          '未配置 - 这会导致数据库连接失败！'
        );
      }
    });

    optionalVars.forEach(varName => {
      const value = process.env[varName];
      if (value) {
        addCheck(
          `可选变量 ${varName}`,
          'success',
          '已配置'
        );
      } else {
        addCheck(
          `可选变量 ${varName}`,
          'warning',
          '未配置 - 某些功能可能受限'
        );
      }
    });
  };

  const checkNetworkConnectivity = async () => {
    addCheck('网络连接', 'success', '检查网络连接...');

    try {
      // 检查基础网络连接
      const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        addCheck('网络连接', 'success', '网络连接正常');
      } else {
        addCheck('网络连接', 'error', `网络响应异常: ${response.status}`);
      }
    } catch (error) {
      addCheck('网络连接', 'error', `网络连接失败: ${error}`);
    }

    // 检查 Supabase 域名解析
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl) {
        const response = await fetch(supabaseUrl + '/rest/v1/', {
          method: 'HEAD'
        });
        addCheck('Supabase 域名', 'success', 'Supabase 域名可访问');
      }
    } catch (error) {
      addCheck('Supabase 域名', 'error', `Supabase 域名无法访问: ${error}`);
    }
  };

  const checkSupabaseConnection = async () => {
    addCheck('Supabase 连接', 'success', '测试 Supabase 连接...');

    try {
      // 测试认证服务
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        addCheck('Supabase 认证', 'error', `认证服务错误: ${authError.message}`);
      } else {
        addCheck('Supabase 认证', 'success', '认证服务正常');
      }

      // 测试基础查询
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (error) {
        addCheck(
          'Supabase 查询',
          'error',
          `数据库查询失败: ${error.message}`,
          { code: error.code, details: error.details }
        );
      } else {
        addCheck('Supabase 查询', 'success', '数据库查询成功');
      }

    } catch (error) {
      addCheck('Supabase 连接', 'error', `连接异常: ${error}`);
    }
  };

  const checkDatabaseTables = async () => {
    addCheck('数据库表格', 'success', '检查数据库表格...');

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

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);

        if (error) {
          if (error.code === '42P01') {
            addCheck(`表格 ${table}`, 'warning', '表格不存在');
          } else {
            addCheck(`表格 ${table}`, 'error', `访问错误: ${error.message}`);
          }
        } else {
          addCheck(`表格 ${table}`, 'success', `可访问 (${data?.length || 0} 条记录)`);
        }
      } catch (error) {
        addCheck(`表格 ${table}`, 'error', `异常: ${error}`);
      }
    }
  };

  const checkApiRoutes = async () => {
    addCheck('API 路由', 'success', '检查 API 路由...');

    const routes = [
      '/api/health-check',
      '/api/check-tables',
      '/api/admin/database-status'
    ];

    for (const route of routes) {
      try {
        const response = await fetch(route);
        if (response.ok) {
          addCheck(`API ${route}`, 'success', '路由可访问');
        } else {
          addCheck(`API ${route}`, 'error', `HTTP ${response.status}`);
        }
      } catch (error) {
        addCheck(`API ${route}`, 'error', `请求失败: ${error}`);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>🚀 部署环境检查</CardTitle>
          <CardDescription>
            检查部署后的数据库连接和环境配置状态
          </CardDescription>
          <div className="flex gap-2">
            <Badge variant="outline">环境: {environment}</Badge>
            <Badge variant="outline">域名: {typeof window !== 'undefined' ? window.location.hostname : 'unknown'}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={runDeploymentChecks} 
              disabled={isLoading}
              variant="default"
            >
              {isLoading ? '检查中...' : '🔍 运行完整检查'}
            </Button>
            
            <Button 
              onClick={clearChecks} 
              disabled={isLoading}
              variant="outline"
            >
              🧹 清空结果
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">检查结果:</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {checks.length === 0 ? (
                  <p className="text-gray-500">点击"运行完整检查"开始...</p>
                ) : (
                  checks.map((check, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-lg">{getStatusIcon(check.status)}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{check.name}</span>
                          <Badge className={getStatusColor(check.status)}>
                            {check.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{check.message}</p>
                        {check.details && (
                          <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded mt-1">
                            {JSON.stringify(check.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  🔧 Cloudflare Pages 环境变量配置
                </h4>
                <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <p><strong>必需配置:</strong></p>
                  <ul className="list-disc list-inside ml-2">
                    <li>NEXT_PUBLIC_SUPABASE_URL</li>
                    <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  ⚠️ 常见部署问题
                </h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• 环境变量未在 Cloudflare Pages 中配置</li>
                  <li>• Supabase 项目暂停或删除</li>
                  <li>• 数据库表格未创建</li>
                  <li>• RLS 策略阻止访问</li>
                  <li>• API 密钥过期或无效</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  ✅ 解决步骤
                </h4>
                <ol className="text-sm text-green-700 dark:text-green-300 space-y-1 list-decimal list-inside">
                  <li>在 Cloudflare Pages 设置中添加环境变量</li>
                  <li>检查 Supabase 项目状态</li>
                  <li>运行数据库迁移创建表格</li>
                  <li>配置 RLS 策略或临时禁用</li>
                  <li>重新部署项目</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
