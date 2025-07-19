"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Database,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Settings,
  Table,
  Shield,
  Zap,
  BarChart3
} from 'lucide-react';

interface SetupResult {
  step: string;
  success: boolean;
  error?: any;
  message?: string;
}

interface SetupSummary {
  totalSteps: number;
  successfulSteps: number;
  failedSteps: number;
  tablesCreated: string[];
  indexesCreated: number;
  triggersCreated: number;
  policiesCreated: number;
}

interface ValidationResult {
  success: boolean;
  tableCount: number;
  missingTables: string[];
  existingTables: string[];
}

const DatabaseSetupPage = () => {
  const { toast } = useToast();
  const [isExecuting, setIsExecuting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [setupResults, setSetupResults] = useState<SetupResult[]>([]);
  const [setupSummary, setSetupSummary] = useState<SetupSummary | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [progress, setProgress] = useState(0);

  const executeSetup = async () => {
    setIsExecuting(true);
    setSetupResults([]);
    setSetupSummary(null);
    setProgress(0);

    try {
      const response = await fetch('/api/setup-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setSetupResults(data.results);
        setSetupSummary(data.summary);
        setProgress(100);
        toast({
          title: "数据库设置完成",
          description: `成功创建 ${data.summary.tablesCreated.length} 个表格`,
        });
      } else {
        setSetupResults(data.results || []);
        setSetupSummary(data.summary);
        toast({
          title: "数据库设置失败",
          description: data.message || "请查看详细错误信息",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('执行数据库设置失败:', error);
      toast({
        title: "执行失败",
        description: "无法连接到服务器",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const validateSetup = async () => {
    setIsValidating(true);

    try {
      const response = await fetch('/api/setup-database', {
        method: 'GET',
      });

      const data = await response.json();

      if (data.success) {
        setValidation(data.validation);
        toast({
          title: "验证完成",
          description: data.validation.success 
            ? `数据库完整，共 ${data.validation.tableCount} 个表格`
            : `缺失 ${data.validation.missingTables.length} 个表格`,
        });
      } else {
        toast({
          title: "验证失败",
          description: data.message || "验证过程出错",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('验证数据库失败:', error);
      toast({
        title: "验证失败",
        description: "无法连接到服务器",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const downloadSQLScript = () => {
    const link = document.createElement('a');
    link.href = '/src/lib/complete-database-tables-setup.sql';
    link.download = 'complete-database-tables-setup.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Database className="h-8 w-8 text-primary" />
          数据库完整设置
        </h1>
        <p className="text-muted-foreground">
          创建水晶日历系统所需的所有数据库表格、索引、触发器和安全策略
        </p>
      </div>

      {/* 操作面板 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            操作控制
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={executeSetup}
              disabled={isExecuting}
              className="flex items-center gap-2"
            >
              {isExecuting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isExecuting ? '执行中...' : '执行完整设置'}
            </Button>

            <Button
              variant="outline"
              onClick={validateSetup}
              disabled={isValidating}
              className="flex items-center gap-2"
            >
              {isValidating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {isValidating ? '验证中...' : '验证设置'}
            </Button>

            <Button
              variant="outline"
              onClick={downloadSQLScript}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              下载SQL脚本
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 进度显示 */}
      {isExecuting && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>执行进度</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 验证结果 */}
      {validation && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              数据库验证结果
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {validation.existingTables.length}
                </div>
                <div className="text-sm text-muted-foreground">存在的表格</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {validation.missingTables.length}
                </div>
                <div className="text-sm text-muted-foreground">缺失的表格</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${validation.success ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.success ? '完整' : '不完整'}
                </div>
                <div className="text-sm text-muted-foreground">数据库状态</div>
              </div>
            </div>

            {validation.missingTables.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2 text-red-600">缺失的表格:</h4>
                <div className="flex flex-wrap gap-2">
                  {validation.missingTables.map((table) => (
                    <Badge key={table} variant="destructive">
                      {table}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 设置摘要 */}
      {setupSummary && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              设置摘要
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Table className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold">{setupSummary.tablesCreated.length}</div>
                <div className="text-sm text-muted-foreground">表格</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold">{setupSummary.indexesCreated}</div>
                <div className="text-sm text-muted-foreground">索引</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold">{setupSummary.triggersCreated}</div>
                <div className="text-sm text-muted-foreground">触发器</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold">{setupSummary.policiesCreated}</div>
                <div className="text-sm text-muted-foreground">安全策略</div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="text-center">
              <div className="text-lg font-medium mb-2">
                执行结果: {setupSummary.successfulSteps}/{setupSummary.totalSteps} 步骤成功
              </div>
              <Progress 
                value={(setupSummary.successfulSteps / setupSummary.totalSteps) * 100} 
                className="w-full max-w-md mx-auto"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatabaseSetupPage;
