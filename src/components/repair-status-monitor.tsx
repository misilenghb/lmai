'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface RepairStatus {
  isRunning: boolean;
  currentStep: string;
  progress: number;
  results: any[];
  summary?: {
    totalChecks: number;
    successCount: number;
    errorCount: number;
    warningCount: number;
    repairsAttempted: number;
    repairsSuccessful: number;
  };
  suggestions?: string[];
}

interface RepairStatusMonitorProps {
  onRepairComplete?: (success: boolean) => void;
  autoStart?: boolean;
}

export function RepairStatusMonitor({ onRepairComplete, autoStart = false }: RepairStatusMonitorProps) {
  const [status, setStatus] = useState<RepairStatus>({
    isRunning: false,
    currentStep: '等待开始...',
    progress: 0,
    results: []
  });

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (autoStart) {
      startRepair();
    }
  }, [autoStart]);

  const startRepair = async () => {
    setStatus(prev => ({
      ...prev,
      isRunning: true,
      currentStep: '初始化修复流程...',
      progress: 0,
      results: []
    }));

    try {
      // 模拟进度更新
      const progressSteps = [
        { step: '🌍 检查环境变量...', progress: 10 },
        { step: '🌐 测试网络连接...', progress: 25 },
        { step: '🗄️ 验证数据库连接...', progress: 40 },
        { step: '📋 检查数据库表格...', progress: 60 },
        { step: '🔧 修复发现的问题...', progress: 80 },
        { step: '✅ 最终验证...', progress: 95 }
      ];

      // 启动修复流程
      const repairPromise = fetch('/api/auto-repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      // 模拟进度更新
      for (const { step, progress } of progressSteps) {
        setStatus(prev => ({
          ...prev,
          currentStep: step,
          progress
        }));
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // 等待修复完成
      const response = await repairPromise;
      const result = await response.json();

      setStatus(prev => ({
        ...prev,
        isRunning: false,
        currentStep: result.success ? '✅ 修复完成' : '⚠️ 修复完成，但有问题需要处理',
        progress: 100,
        results: result.results || [],
        summary: result.summary,
        suggestions: result.suggestions || []
      }));

      onRepairComplete?.(result.success);

    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isRunning: false,
        currentStep: '❌ 修复失败',
        progress: 100,
        results: [{
          category: '系统',
          name: '修复流程',
          status: 'error',
          message: `修复异常: ${error}`,
          timestamp: new Date().toISOString()
        }]
      }));

      onRepairComplete?.(false);
    }
  };

  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusIcon = (statusType: string) => {
    switch (statusType) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📋';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '环境': return '🌍';
      case '网络': return '🌐';
      case '数据库': return '🗄️';
      case '安全': return '🔒';
      case '修复': return '🔧';
      case '验证': return '✅';
      default: return '📋';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            🔧 修复状态监控
          </span>
          {!status.isRunning && status.progress === 0 && (
            <Button onClick={startRepair} size="sm">
              开始修复
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          实时监控数据库修复进度和状态
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 进度显示 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{status.currentStep}</span>
            <span className="text-sm text-gray-500">{status.progress}%</span>
          </div>
          <Progress value={status.progress} className="w-full" />
        </div>

        {/* 摘要信息 */}
        {status.summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <div className="text-lg font-bold text-blue-600">{status.summary.totalChecks}</div>
              <div className="text-xs text-gray-600">总检查</div>
            </div>
            <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <div className="text-lg font-bold text-green-600">{status.summary.successCount}</div>
              <div className="text-xs text-gray-600">成功</div>
            </div>
            <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <div className="text-lg font-bold text-red-600">{status.summary.errorCount}</div>
              <div className="text-xs text-gray-600">错误</div>
            </div>
            <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
              <div className="text-lg font-bold text-orange-600">
                {status.summary.repairsSuccessful}/{status.summary.repairsAttempted}
              </div>
              <div className="text-xs text-gray-600">修复</div>
            </div>
          </div>
        )}

        {/* 修复建议 */}
        {status.suggestions && status.suggestions.length > 0 && (
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-semibold">💡 修复建议:</div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {status.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* 详细结果 */}
        {status.results.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">检查详情</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? '隐藏详情' : '显示详情'}
              </Button>
            </div>
            
            {showDetails && (
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {status.results.map((result, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded text-sm">
                    <span>{getCategoryIcon(result.category)}</span>
                    <span>{getStatusIcon(result.status)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.name}</span>
                        <Badge className={getStatusColor(result.status)} variant="secondary">
                          {result.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{result.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 操作按钮 */}
        {!status.isRunning && status.progress > 0 && (
          <div className="flex gap-2">
            <Button onClick={startRepair} variant="outline" size="sm">
              🔄 重新修复
            </Button>
            {status.summary && status.summary.errorCount === 0 && (
              <Button 
                onClick={() => window.location.href = '/'}
                variant="default"
                size="sm"
              >
                🏠 返回首页
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
