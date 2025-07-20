'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface PasswordStatus {
  success: boolean;
  summary: {
    totalUsers: number;
    usersWithPassword: number;
    usersWithoutPassword: number;
    percentageWithPassword: number;
  };
  message: string;
}

interface UpdateResult {
  success: boolean;
  message: string;
  summary: {
    totalUsers: number;
    successfulUpdates: number;
    failedUpdates: number;
    verifiedUsers: number;
  };
  results: Array<{
    user: string;
    success: boolean;
    error?: string;
  }>;
  defaultPassword: string;
}

export default function PasswordManagementPage() {
  const [passwordStatus, setPasswordStatus] = useState<PasswordStatus | null>(null);
  const [updateResult, setUpdateResult] = useState<UpdateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPasswordStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/update-all-passwords');
      const data = await response.json();
      
      if (data.success) {
        setPasswordStatus(data);
      } else {
        setError(data.message || '检查密码状态失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const updateAllPasswords = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/update-all-passwords', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setUpdateResult(data);
        // 重新检查状态
        await checkPasswordStatus();
      } else {
        setError(data.message || '更新密码失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const getAddPasswordFieldsInstructions = () => {
    return {
      sqlStatements: [
        'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;',
        'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_salt TEXT;',
        'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_reset_token TEXT;',
        'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP WITH TIME ZONE;',
        'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0;',
        'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP WITH TIME ZONE;',
        'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;',
        'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_question_1 TEXT;',
        'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_answer_1 TEXT;',
        'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_question_2 TEXT;',
        'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_answer_2 TEXT;',
        'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_question_3 TEXT;',
        'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_answer_3 TEXT;'
      ],
      instructions: [
        '1. 登录 Supabase Dashboard',
        '2. 进入 SQL Editor',
        '3. 复制并粘贴上述SQL语句',
        '4. 点击 "Run" 执行',
        '5. 执行完成后，点击下方按钮更新密码'
      ]
    };
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">密码管理</h1>
        <p className="text-muted-foreground">为所有用户设置默认密码</p>
      </div>

      {/* 检查密码状态 */}
      <Card>
        <CardHeader>
          <CardTitle>密码状态检查</CardTitle>
          <CardDescription>检查当前用户的密码设置情况</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={checkPasswordStatus} 
            disabled={loading}
            className="w-full"
          >
            {loading ? '检查中...' : '检查密码状态'}
          </Button>

          {passwordStatus && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  {passwordStatus.message}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{passwordStatus.summary.totalUsers}</div>
                  <div className="text-sm text-muted-foreground">总用户数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {passwordStatus.summary.usersWithPassword}
                  </div>
                  <div className="text-sm text-muted-foreground">已设置密码</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {passwordStatus.summary.usersWithoutPassword}
                  </div>
                  <div className="text-sm text-muted-foreground">未设置密码</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {passwordStatus.summary.percentageWithPassword}%
                  </div>
                  <div className="text-sm text-muted-foreground">密码设置率</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 添加密码字段说明 */}
      <Card>
        <CardHeader>
          <CardTitle>添加密码字段</CardTitle>
          <CardDescription>如果密码字段不存在，需要先在数据库中添加</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              如果检查结果显示没有密码字段，请先在 Supabase Dashboard 中执行以下 SQL 语句：
            </AlertDescription>
          </Alert>

          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto">
              {getAddPasswordFieldsInstructions().sqlStatements.join('\n')}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">执行步骤：</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              {getAddPasswordFieldsInstructions().instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* 更新所有密码 */}
      <Card>
        <CardHeader>
          <CardTitle>更新所有用户密码</CardTitle>
          <CardDescription>为所有用户设置默认密码 "123456"</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={updateAllPasswords} 
            disabled={loading}
            className="w-full"
            variant="destructive"
          >
            {loading ? '更新中...' : '更新所有用户密码为 123456'}
          </Button>

          {updateResult && (
            <div className="space-y-4">
              <Alert className={updateResult.success ? 'border-green-500' : 'border-red-500'}>
                <AlertDescription>
                  {updateResult.message}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{updateResult.summary.totalUsers}</div>
                  <div className="text-sm text-muted-foreground">总用户数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {updateResult.summary.successfulUpdates}
                  </div>
                  <div className="text-sm text-muted-foreground">更新成功</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {updateResult.summary.failedUpdates}
                  </div>
                  <div className="text-sm text-muted-foreground">更新失败</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {updateResult.summary.verifiedUsers}
                  </div>
                  <div className="text-sm text-muted-foreground">验证通过</div>
                </div>
              </div>

              {updateResult.results.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">详细结果：</h4>
                  <div className="space-y-2">
                    {updateResult.results.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{result.user}</span>
                        <Badge variant={result.success ? 'default' : 'destructive'}>
                          {result.success ? '成功' : '失败'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Alert>
                <AlertDescription>
                  <strong>默认密码：</strong> {updateResult.defaultPassword}
                  <br />
                  所有用户现在可以使用此密码登录
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 