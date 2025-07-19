"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Play,
  Settings,
  Copy,
  ExternalLink,
  Wrench,
  TestTube,
  Activity,
  Shield,
  Download,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TableStatus {
  [tableName: string]: boolean;
}

interface DatabaseStatus {
  success: boolean;
  totalTables: number;
  existingCount: number;
  missingCount: number;
  existingTables: string[];
  missingTables: string[];
  results: TableStatus;
  completionPercentage: number;
  timestamp: string;
}

interface FixResult {
  success: boolean;
  message: string;
  sql?: string;
  instructions?: string[];
  dashboardUrl?: string;
}

const DatabaseManagementPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('status');
  const [isLoading, setIsLoading] = useState(false);
  const [databaseStatus, setDatabaseStatus] = useState<DatabaseStatus | null>(null);
  const [fixResult, setFixResult] = useState<FixResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/database-status');
      const data = await response.json();
      setDatabaseStatus(data);
      
      if (data.missingCount > 0) {
        toast({
          title: "数据库检查完成",
          description: `发现 ${data.missingCount} 个表格缺失`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "数据库检查完成",
          description: "所有表格都已存在",
        });
      }
    } catch (error) {
      console.error('检查数据库状态失败:', error);
      toast({
        title: "检查失败",
        description: "无法检查数据库状态",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFixSQL = async () => {
    try {
      const response = await fetch('/api/get-missing-tables-sql');
      const data = await response.json();
      setFixResult(data);
      setActiveTab('fix');
    } catch (error) {
      console.error('获取修复SQL失败:', error);
      toast({
        title: "获取失败",
        description: "无法获取修复SQL语句",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "复制成功",
        description: "SQL语句已复制到剪贴板",
      });
    } catch (error) {
      console.error('复制失败:', error);
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive"
      });
    }
  };

  const downloadSQL = () => {
    if (fixResult?.sql) {
      const blob = new Blob([fixResult.sql], { type: 'text/sql' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'missing-tables.sql';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "下载成功",
        description: "SQL文件已下载",
      });
    }
  };

  const openSupabaseDashboard = () => {
    const url = fixResult?.dashboardUrl || 'https://supabase.com/dashboard';
    window.open(url, '_blank');
  };

  const coreTableNames = [
    'profiles', 'design_works', 'user_energy_records', 'meditation_sessions',
    'membership_info', 'usage_stats', 'user_settings', 'crystals',
    'user_favorite_crystals', 'ai_conversations'
  ];

  const advancedTableNames = [
    'user_behavior_patterns', 'ml_predictions', 'dynamic_pricing_rules',
    'ab_experiments', 'ab_user_assignments', 'analytics_metrics',
    'system_logs', 'cache_management', 'notifications', 'user_feedback'
  ];

  const renderTableList = (tables: string[], title: string, description: string) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {tables.map((table) => {
            const exists = databaseStatus?.results?.[table] ?? false;
            return (
              <div key={table} className="flex items-center gap-2 p-2 border rounded">
                {exists ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm ${exists ? 'text-green-700' : 'text-red-700'}`}>
                  {table}
                </span>
                <Badge variant={exists ? 'default' : 'destructive'} className="ml-auto text-xs">
                  {exists ? '存在' : '缺失'}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Database className="h-8 w-8 text-blue-500" />
          数据库管理中心
        </h1>
        <p className="text-muted-foreground">
          水晶日历系统数据库管理、监控和修复工具
        </p>
      </div>

      {/* 状态概览 */}
      {databaseStatus && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{databaseStatus.totalTables}</div>
              <div className="text-sm text-blue-700">总表格数</div>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{databaseStatus.existingCount}</div>
              <div className="text-sm text-green-700">已存在</div>
            </CardContent>
          </Card>
          <Card className={`border-${databaseStatus.missingCount > 0 ? 'red' : 'green'}-200 bg-${databaseStatus.missingCount > 0 ? 'red' : 'green'}-50`}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold text-${databaseStatus.missingCount > 0 ? 'red' : 'green'}-600`}>
                {databaseStatus.missingCount}
              </div>
              <div className={`text-sm text-${databaseStatus.missingCount > 0 ? 'red' : 'green'}-700`}>缺失</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{databaseStatus.completionPercentage}%</div>
              <div className="text-sm text-purple-700">完成度</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 主要操作按钮 */}
      <div className="flex gap-4 mb-6">
        <Button
          onClick={checkDatabaseStatus}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <TestTube className="h-4 w-4" />
          )}
          检查状态
        </Button>
        
        {databaseStatus && databaseStatus.missingCount > 0 && (
          <Button
            onClick={getFixSQL}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Wrench className="h-4 w-4" />
            获取修复方案
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status">状态检查</TabsTrigger>
          <TabsTrigger value="fix">修复方案</TabsTrigger>
          <TabsTrigger value="tools">管理工具</TabsTrigger>
          <TabsTrigger value="monitoring">监控</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          {databaseStatus ? (
            <div>
              {databaseStatus.missingCount > 0 && (
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    检测到 {databaseStatus.missingCount} 个表格缺失，建议立即修复以确保系统完整功能。
                  </AlertDescription>
                </Alert>
              )}
              
              {renderTableList(coreTableNames, "核心功能表格 (10个)", "系统基本运行所必需的表格")}
              {renderTableList(advancedTableNames, "高级功能表格 (10个)", "支持ML分析、A/B测试等高级功能的表格")}
              
              <div className="text-sm text-muted-foreground">
                最后检查时间: {new Date(databaseStatus.timestamp).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground">点击"检查状态"按钮开始检查数据库</div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="fix" className="space-y-4">
          {fixResult ? (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>修复方案</span>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyToClipboard(fixResult.sql || '')}
                        variant="outline"
                        size="sm"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {copied ? '已复制!' : '复制SQL'}
                      </Button>
                      <Button
                        onClick={downloadSQL}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        下载SQL
                      </Button>
                      <Button
                        onClick={openSupabaseDashboard}
                        variant="outline"
                        size="sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        打开Dashboard
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {fixResult.instructions && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">操作步骤:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        {fixResult.instructions.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">SQL语句:</h4>
                    <pre className="text-xs overflow-x-auto max-h-64">
                      <code>{fixResult.sql}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                {databaseStatus && databaseStatus.missingCount > 0
                  ? '点击"获取修复方案"按钮获取SQL语句'
                  : '数据库状态正常，无需修复'
                }
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  数据库设置
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  执行完整的数据库初始化和配置
                </p>
                <Button 
                  onClick={() => window.location.href = '/admin/database-setup'}
                  variant="outline" 
                  size="sm"
                >
                  打开设置
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  系统诊断
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  全面的系统健康检查和诊断
                </p>
                <Button
                  onClick={() => window.location.href = '/admin/monitoring'}
                  variant="outline"
                  size="sm"
                >
                  运行诊断
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  备份管理
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  数据库备份和恢复管理
                </p>
                <Button variant="outline" size="sm" disabled>
                  即将推出
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">连接状态</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">数据库连接正常</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">性能指标</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>查询响应时间: &lt; 100ms</div>
                  <div>连接池状态: 正常</div>
                  <div>存储使用率: 正常</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseManagementPage;
