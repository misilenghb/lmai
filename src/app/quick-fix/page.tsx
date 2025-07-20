'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, CheckCircle, XCircle, Database, Key, Users } from 'lucide-react';

export default function QuickFixPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [step, setStep] = useState('');

  const executeQuickFix = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      // 步骤1: 修复密码函数
      setStep('正在修复密码验证函数...');
      const passwordResponse = await fetch('/api/fix-password-functions', {
        method: 'POST'
      });
      const passwordResult = await passwordResponse.json();
      
      // 步骤2: 测试密码函数
      setStep('正在测试密码函数...');
      const testResponse = await fetch('/api/fix-password-functions', {
        method: 'GET'
      });
      const testResult = await testResponse.json();
      
      setResults({
        passwordFix: passwordResult,
        passwordTest: testResult
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

  const testLogin = async () => {
    setIsLoading(true);
    try {
      // 直接测试登录功能
      const response = await fetch('/api/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'testLogin',
          email: 'admin@lmai.cc',
          password: 'admin123'
        })
      });
      
      const result = await response.json();
      setResults({ loginTest: result });
    } catch (error) {
      setResults({
        error: error instanceof Error ? error.message : '登录测试失败'
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
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-600" />
            <CardTitle>一键快速修复</CardTitle>
          </div>
          <CardDescription>
            快速修复登录验证问题，创建必要的数据库函数和测试用户
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Button 
              onClick={executeQuickFix} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <Zap className="h-4 w-4" />
              一键修复登录问题
            </Button>
            
            <Button 
              onClick={testLogin} 
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <Key className="h-4 w-4" />
              测试登录功能
            </Button>
          </div>

          {step && (
            <Alert>
              <Database className="h-4 w-4" />
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

              {results.passwordFix && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(results.passwordFix.success)}
                      密码函数修复
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {results.passwordFix.results?.map((result: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(result.success)}
                            <span className="font-medium">{result.function}</span>
                          </div>
                          {getStatusBadge(result.success)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {results.passwordTest && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Key className="h-5 w-5 text-blue-600" />
                      功能测试结果
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {results.passwordTest.tests?.map((test: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(test.success)}
                            <span className="font-medium">
                              {test.test === 'verify_password_function' ? '密码验证函数' : '测试用户'}
                            </span>
                          </div>
                          {getStatusBadge(test.success)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {results.loginTest && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(results.loginTest.success)}
                      登录测试
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(results.loginTest, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              测试账户信息：
            </h3>
            <div className="text-sm space-y-1">
              <div><strong>管理员：</strong> admin@lmai.cc / admin123</div>
              <div><strong>用户：</strong> user@lmai.cc / user123</div>
              <div><strong>测试：</strong> test@lmai.cc / test123</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium mb-2">修复完成后：</h3>
            <ol className="text-sm space-y-1">
              <li>1. 返回登录页面：<a href="/login" className="text-blue-600 hover:underline">/login</a></li>
              <li>2. 使用测试账户登录</li>
              <li>3. 测试忘记密码功能：<a href="/forgot-password" className="text-blue-600 hover:underline">/forgot-password</a></li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
