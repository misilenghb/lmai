'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Database, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function AutoFixPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [step, setStep] = useState('');

  const executeAutoFix = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      // 步骤1: 诊断问题
      setStep('正在诊断数据库问题...');
      const diagnosisResponse = await fetch('/api/database-migration', {
        method: 'GET'
      });
      const diagnosis = await diagnosisResponse.json();
      
      // 步骤2: 执行完整设置
      setStep('正在执行数据库完整设置...');
      const setupResponse = await fetch('/api/database-migration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'completeSetup' })
      });
      const setupResult = await setupResponse.json();
      
      // 步骤3: 执行密码迁移
      setStep('正在执行密码字段迁移...');
      const passwordResponse = await fetch('/api/migrate-password', {
        method: 'POST'
      });
      const passwordResult = await passwordResponse.json();
      
      // 步骤4: 快速修复
      setStep('正在执行快速修复...');
      const quickFixResponse = await fetch('/api/database-migration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'quickFix' })
      });
      const quickFixResult = await quickFixResponse.json();
      
      // 步骤5: 最终验证
      setStep('正在验证修复结果...');
      const verifyResponse = await fetch('/api/database-migration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkTables' })
      });
      const verifyResult = await verifyResponse.json();
      
      setResults({
        diagnosis,
        setup: setupResult,
        password: passwordResult,
        quickFix: quickFixResult,
        verification: verifyResult
      });
      
    } catch (error) {
      setResults({
        error: error instanceof Error ? error.message : '未知错误'
      });
    } finally {
      setIsLoading(false);
      setStep('');
    }
  };

  const testSecurityQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getSecurityQuestions',
          email: 'admin@lmai.cc'
        })
      });
      const result = await response.json();
      setResults({ securityTest: result });
    } catch (error) {
      setResults({
        error: error instanceof Error ? error.message : '测试失败'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? "default" : "destructive"}>
        {success ? "成功" : "失败"}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-600" />
            <CardTitle>数据库自动修复</CardTitle>
          </div>
          <CardDescription>
            自动诊断并修复数据库问题，包括表格创建、字段添加和函数设置
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Button 
              onClick={executeAutoFix} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <Database className="h-4 w-4" />
              执行完整修复
            </Button>
            
            <Button 
              onClick={testSecurityQuestions} 
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              测试安全问题功能
            </Button>
          </div>

          {step && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{step}</AlertDescription>
            </Alert>
          )}

          {results && (
            <div className="space-y-4">
              {results.error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{results.error}</AlertDescription>
                </Alert>
              )}

              {results.diagnosis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(results.diagnosis.success)}
                      诊断结果
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">表格状态:</p>
                        <div className="space-y-1">
                          {results.diagnosis.tableStatus && Object.entries(results.diagnosis.tableStatus).map(([table, exists]) => (
                            <div key={table} className="flex items-center justify-between">
                              <span className="text-sm">{table}</span>
                              {getStatusBadge(exists as boolean)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {results.setup && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(results.setup.success)}
                      数据库设置
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(results.setup, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}

              {results.password && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(results.password.success)}
                      密码字段迁移
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(results.password, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}

              {results.securityTest && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(results.securityTest.success)}
                      安全问题测试
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {results.securityTest.success ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">获取到的安全问题:</p>
                        <ul className="text-sm space-y-1">
                          <li>1. {results.securityTest.questions?.question1}</li>
                          <li>2. {results.securityTest.questions?.question2}</li>
                          <li>3. {results.securityTest.questions?.question3}</li>
                        </ul>
                      </div>
                    ) : (
                      <Alert variant="destructive">
                        <AlertDescription>{results.securityTest.error}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-2">修复步骤说明：</h3>
            <ol className="text-sm space-y-1">
              <li>1. <strong>诊断问题</strong> - 检查数据库表格和连接状态</li>
              <li>2. <strong>完整设置</strong> - 创建缺失的表格和字段</li>
              <li>3. <strong>密码迁移</strong> - 添加密码相关字段和函数</li>
              <li>4. <strong>快速修复</strong> - 修复常见的配置问题</li>
              <li>5. <strong>验证结果</strong> - 确认所有修复是否成功</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
