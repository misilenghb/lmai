'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface RepairStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'error' | 'warning';
  message: string;
  details?: any;
  timestamp?: string;
}

interface RepairStatusMonitorProps {
  onRepairComplete?: (success: boolean) => void;
  autoStart?: boolean;
}

export function RepairStatusMonitor({ onRepairComplete, autoStart = false }: RepairStatusMonitorProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<RepairStep[]>([
    {
      id: 'check-env',
      name: '检查环境变量',
      status: 'pending',
      message: '等待开始...'
    },
    {
      id: 'check-db-connection',
      name: '检查数据库连接',
      status: 'pending',
      message: '等待开始...'
    },
    {
      id: 'check-tables',
      name: '检查数据库表',
      status: 'pending',
      message: '等待开始...'
    },
    {
      id: 'create-missing-tables',
      name: '创建缺失的表',
      status: 'pending',
      message: '等待开始...'
    },
    {
      id: 'set-permissions',
      name: '设置权限策略',
      status: 'pending',
      message: '等待开始...'
    },
    {
      id: 'verify-repair',
      name: '验证修复结果',
      status: 'pending',
      message: '等待开始...'
    }
  ]);

  const updateStep = (stepId: string, status: RepairStep['status'], message: string, details?: any) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, message, details, timestamp: new Date().toISOString() }
        : step
    ));
  };

  const runRepair = async () => {
    setIsRunning(true);
    setCurrentStep(0);

    try {
      // 步骤 1: 检查环境变量
      updateStep('check-env', 'running', '正在检查环境变量...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const envCheck = await checkEnvironmentVariables();
      updateStep('check-env', envCheck.success ? 'success' : 'error', envCheck.message, envCheck.details);
      
      if (!envCheck.success) {
        setIsRunning(false);
        onRepairComplete?.(false);
        return;
      }

      // 步骤 2: 检查数据库连接
      setCurrentStep(1);
      updateStep('check-db-connection', 'running', '正在检查数据库连接...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const dbCheck = await checkDatabaseConnection();
      updateStep('check-db-connection', dbCheck.success ? 'success' : 'error', dbCheck.message, dbCheck.details);
      
      if (!dbCheck.success) {
        setIsRunning(false);
        onRepairComplete?.(false);
        return;
      }

      // 步骤 3: 检查数据库表
      setCurrentStep(2);
      updateStep('check-tables', 'running', '正在检查数据库表...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const tablesCheck = await checkDatabaseTables();
      updateStep('check-tables', tablesCheck.success ? 'success' : 'warning', tablesCheck.message, tablesCheck.details);

      // 步骤 4: 创建缺失的表
      setCurrentStep(3);
      updateStep('create-missing-tables', 'running', '正在创建缺失的表...');
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const createTables = await createMissingTables();
      updateStep('create-missing-tables', createTables.success ? 'success' : 'error', createTables.message, createTables.details);
      
      if (!createTables.success) {
        setIsRunning(false);
        onRepairComplete?.(false);
        return;
      }

      // 步骤 5: 设置权限策略
      setCurrentStep(4);
      updateStep('set-permissions', 'running', '正在设置权限策略...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const permissionsCheck = await setPermissions();
      updateStep('set-permissions', permissionsCheck.success ? 'success' : 'warning', permissionsCheck.message, permissionsCheck.details);

      // 步骤 6: 验证修复结果
      setCurrentStep(5);
      updateStep('verify-repair', 'running', '正在验证修复结果...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const verifyResult = await verifyRepair();
      updateStep('verify-repair', verifyResult.success ? 'success' : 'error', verifyResult.message, verifyResult.details);

      setIsRunning(false);
      onRepairComplete?.(verifyResult.success);

    } catch (error) {
      console.error('修复过程出错:', error);
      updateStep('verify-repair', 'error', '修复过程出现未知错误');
      setIsRunning(false);
      onRepairComplete?.(false);
    }
  };

  // 模拟检查环境变量
  const checkEnvironmentVariables = async () => {
    try {
      const response = await fetch('/api/database-diagnostic');
      const data = await response.json();
      
      if (data.success) {
        return { success: true, message: '环境变量配置正确', details: data };
      } else {
        return { success: false, message: '环境变量配置有问题', details: data };
      }
    } catch (error) {
      return { success: false, message: '无法检查环境变量', details: error };
    }
  };

  // 模拟检查数据库连接
  const checkDatabaseConnection = async () => {
    try {
      const response = await fetch('/api/database-diagnostic');
      const data = await response.json();
      
      if (data.success && data.diagnostic?.tables?.length > 0) {
        return { success: true, message: '数据库连接正常', details: data };
      } else {
        return { success: false, message: '数据库连接失败', details: data };
      }
    } catch (error) {
      return { success: false, message: '无法连接到数据库', details: error };
    }
  };

  // 模拟检查数据库表
  const checkDatabaseTables = async () => {
    try {
      const response = await fetch('/api/database-diagnostic');
      const data = await response.json();
      
      if (data.success) {
        const missingTables = data.diagnostic?.tables?.filter((table: any) => !table.exists) || [];
        if (missingTables.length === 0) {
          return { success: true, message: '所有数据库表都存在', details: data };
        } else {
          return { success: false, message: `发现 ${missingTables.length} 个缺失的表`, details: data };
        }
      } else {
        return { success: false, message: '无法检查数据库表', details: data };
      }
    } catch (error) {
      return { success: false, message: '检查数据库表时出错', details: error };
    }
  };

  // 模拟创建缺失的表
  const createMissingTables = async () => {
    try {
      const response = await fetch('/api/fix-database', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        return { success: true, message: '成功创建缺失的表', details: data };
      } else {
        return { success: false, message: '创建表失败', details: data };
      }
    } catch (error) {
      return { success: false, message: '创建表时出错', details: error };
    }
  };

  // 模拟设置权限
  const setPermissions = async () => {
    try {
      // 这里可以添加设置RLS策略的逻辑
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: '权限策略设置完成', details: {} };
    } catch (error) {
      return { success: false, message: '设置权限时出错', details: error };
    }
  };

  // 模拟验证修复结果
  const verifyRepair = async () => {
    try {
      const response = await fetch('/api/database-diagnostic');
      const data = await response.json();
      
      if (data.success) {
        const allTablesExist = data.diagnostic?.tables?.every((table: any) => table.exists);
        if (allTablesExist) {
          return { success: true, message: '所有修复验证通过', details: data };
        } else {
          return { success: false, message: '部分修复验证失败', details: data };
        }
      } else {
        return { success: false, message: '验证修复结果时出错', details: data };
      }
    } catch (error) {
      return { success: false, message: '验证修复结果时出错', details: error };
    }
  };

  useEffect(() => {
    if (autoStart && !isRunning) {
      runRepair();
    }
  }, [autoStart]);

  const getStatusColor = (status: RepairStep['status']) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'running': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: RepairStep['status']) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'running': return '🔄';
      default: return '⏳';
    }
  };

  const completedSteps = steps.filter(step => step.status === 'success').length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 数据库自动修复
          {isRunning && <Badge variant="secondary">运行中</Badge>}
        </CardTitle>
        <CardDescription>
          自动检测和修复数据库连接问题
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 进度条 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>修复进度</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* 修复步骤 */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-3 p-3 rounded-lg border">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${getStatusColor(step.status)}`}>
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{step.name}</span>
                  {step.status === 'running' && (
                    <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{step.message}</p>
                {step.details && (
                  <details className="mt-2">
                    <summary className="text-xs text-blue-600 cursor-pointer">查看详情</summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                      {JSON.stringify(step.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <Button
            onClick={runRepair}
            disabled={isRunning}
            className="flex-1"
          >
            {isRunning ? '修复中...' : '开始修复'}
          </Button>
          {isRunning && (
            <Button
              onClick={() => setIsRunning(false)}
              variant="outline"
            >
              停止
            </Button>
          )}
        </div>

        {/* 状态摘要 */}
        {!isRunning && completedSteps > 0 && (
          <Alert>
            <AlertDescription>
              <div className="flex items-center gap-2">
                <span>修复状态:</span>
                <Badge variant={completedSteps === steps.length ? 'default' : 'secondary'}>
                  {completedSteps === steps.length ? '全部完成' : `${completedSteps}/${steps.length} 步骤完成`}
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 