"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  FileText,
  Settings,
  Shield
} from 'lucide-react';

interface DiagnosticResult {
  success: boolean;
  report: string;
  result: {
    issues: Array<{
      type: string;
      table?: string;
      column?: string;
      message: string;
      severity: 'critical' | 'warning' | 'info';
    }>;
    fixes: Array<{
      type: string;
      description: string;
      success: boolean;
      error?: string;
    }>;
    summary: {
      totalIssues: number;
      criticalIssues: number;
      warnings: number;
      fixesApplied: number;
      fixesFailed: number;
    };
  };
  message: string;
  timestamp: string;
}

export default function DatabaseDiagnosticPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostic = async () => {
    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/database-diagnostic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success !== undefined) {
        setResult(data);
      } else {
        setError(data.error || '诊断失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络错误');
    } finally {
      setIsRunning(false);
    }
  };

  const runFix = async () => {
    setIsRunning(true);
    setError(null);

    try {
      const response = await fetch('/api/fix-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success !== undefined) {
        // 修复完成后重新运行诊断
        await runDiagnostic();
      } else {
        setError(data.error || '修复失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络错误');
    } finally {
      setIsRunning(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <CheckCircle className="h-4 w-4 text-success" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-success/10 text-success border-success/20';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            数据库诊断工具
          </h1>
          <p className="text-muted-foreground mt-2">
            检查数据库表结构、字段完整性、RLS 策略等问题并自动修复
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runDiagnostic} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            {isRunning ? '诊断中...' : '运行诊断'}
          </Button>
          
          {result && result.result.summary.criticalIssues > 0 && (
            <Button 
              onClick={runFix} 
              disabled={isRunning}
              variant="destructive"
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Settings className="h-4 w-4" />
              )}
              {isRunning ? '修复中...' : '自动修复'}
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert className="border-destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-6">
          {/* 摘要卡片 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                诊断摘要
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {result.result.summary.totalIssues}
                  </div>
                  <div className="text-sm text-muted-foreground">总问题数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">
                    {result.result.summary.criticalIssues}
                  </div>
                  <div className="text-sm text-muted-foreground">严重问题</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">
                    {result.result.summary.warnings}
                  </div>
                  <div className="text-sm text-muted-foreground">警告</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {result.result.summary.fixesApplied}
                  </div>
                  <div className="text-sm text-muted-foreground">修复成功</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">
                    {result.result.summary.fixesFailed}
                  </div>
                  <div className="text-sm text-muted-foreground">修复失败</div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>整体健康度</span>
                  <span>{result.success ? '良好' : '需要修复'}</span>
                </div>
                <Progress 
                  value={result.result.summary.criticalIssues === 0 ? 100 : 
                         result.result.summary.criticalIssues <= 2 ? 70 : 
                         result.result.summary.criticalIssues <= 5 ? 40 : 20} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* 问题详情 */}
          {result.result.issues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  发现的问题 ({result.result.issues.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.result.issues.map((issue, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(issue.severity)}
                        <div className="flex-1">
                          <div className="font-medium mb-1">{issue.message}</div>
                          {issue.table && (
                            <div className="text-sm opacity-80">
                              表: {issue.table}
                              {issue.column && ` | 字段: ${issue.column}`}
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {issue.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 修复详情 */}
          {result.result.fixes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  修复操作 ({result.result.fixes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.result.fixes.map((fix, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border ${
                        fix.success 
                          ? 'bg-success/10 text-success border-success/20' 
                          : 'bg-destructive/10 text-destructive border-destructive/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {fix.success ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium mb-1">{fix.description}</div>
                          {!fix.success && fix.error && (
                            <div className="text-sm opacity-80 mt-1">
                              错误: {fix.error}
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {fix.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 详细报告 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                详细报告
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {result.report}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* 建议 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                建议
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.result.summary.criticalIssues > 0 ? (
                  <>
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="font-medium text-destructive mb-2">⚠️ 需要立即处理</div>
                      <ul className="text-sm space-y-1">
                        <li>• 检查严重问题并手动修复</li>
                        <li>• 确保所有必要的表都已创建</li>
                        <li>• 验证 RLS 策略是否正确配置</li>
                      </ul>
                    </div>
                  </>
                ) : result.result.summary.warnings > 0 ? (
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="font-medium text-warning mb-2">💡 优化建议</div>
                    <ul className="text-sm space-y-1">
                      <li>• 考虑处理警告以提高系统稳定性</li>
                      <li>• 定期运行诊断以监控数据库健康状态</li>
                    </ul>
                  </div>
                ) : (
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="font-medium text-success mb-2">🎉 数据库状态良好</div>
                    <div className="text-sm">
                      所有检查都通过了，数据库结构完整且配置正确。
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 使用说明 */}
      {!result && !isRunning && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              使用说明
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>这个诊断工具会检查以下内容：</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>核心表是否存在（profiles, design_works, energy_records 等）</li>
                <li>表字段是否完整（必需的字段是否存在）</li>
                <li>RLS（行级安全）策略是否正确配置</li>
                <li>数据完整性（重复数据、约束等）</li>
                <li>自动修复可以解决的问题</li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                点击"运行诊断"按钮开始检查数据库状态。
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 