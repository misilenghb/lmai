'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';

export default function TestDbPage() {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email, name')
        .limit(3);

      if (error) {
        setResult({ success: false, error: error.message });
      } else {
        setResult({ success: true, data });
      }
    } catch (error) {
      setResult({ success: false, error: error instanceof Error ? error.message : '未知错误' });
    } finally {
      setIsLoading(false);
    }
  };

  const testSecurityQuestions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_security_questions', {
        input_email: 'admin@lmai.cc'
      });

      if (error) {
        setResult({ success: false, error: error.message });
      } else {
        setResult({ success: true, data });
      }
    } catch (error) {
      setResult({ success: false, error: error instanceof Error ? error.message : '未知错误' });
    } finally {
      setIsLoading(false);
    }
  };

  const createTestUser = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            email: 'admin@lmai.cc',
            name: '管理员',
            password_hash: 'admin123',
            security_question_1: '您的第一只宠物叫什么名字？',
            security_answer_1: '小白',
            security_question_2: '您的出生城市是哪里？',
            security_answer_2: '北京',
            security_question_3: '您最喜欢的颜色是什么？',
            security_answer_3: '蓝色'
          }
        ])
        .select();

      if (error) {
        setResult({ success: false, error: error.message });
      } else {
        setResult({ success: true, data });
      }
    } catch (error) {
      setResult({ success: false, error: error instanceof Error ? error.message : '未知错误' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>数据库连接测试</CardTitle>
          <CardDescription>
            测试 Supabase 数据库连接和函数
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={testConnection} disabled={isLoading}>
              测试基础连接
            </Button>
            <Button onClick={testSecurityQuestions} disabled={isLoading}>
              测试安全问题函数
            </Button>
            <Button onClick={createTestUser} disabled={isLoading}>
              创建测试用户
            </Button>
          </div>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <AlertDescription>
                <pre className="whitespace-pre-wrap text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-2">手动执行 SQL 步骤：</h3>
            <ol className="text-sm space-y-1">
              <li>1. 访问 Supabase 控制台</li>
              <li>2. 进入 SQL 编辑器</li>
              <li>3. 复制并执行 src/lib/simple-password-migration.sql 中的内容</li>
              <li>4. 返回此页面测试功能</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
