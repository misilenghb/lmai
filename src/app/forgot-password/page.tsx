'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Mail, Shield, Key } from 'lucide-react';
import Link from 'next/link';
import { profileService } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // 邮箱重置状态
  const [email, setEmail] = useState('');
  
  // 安全问题重置状态
  const [securityEmail, setSecurityEmail] = useState('');
  const [securityQuestions, setSecurityQuestions] = useState<{
    question1?: string;
    question2?: string;
    question3?: string;
  }>({});
  const [securityAnswers, setSecurityAnswers] = useState({
    answer1: '',
    answer2: '',
    answer3: ''
  });
  const [showQuestions, setShowQuestions] = useState(false);
  
  // 重置密码状态
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);

  // 邮箱重置处理
  const handleEmailReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await profileService.requestPasswordReset(email);
      
      if (result.success) {
        setMessage('密码重置链接已发送到您的邮箱（演示模式：直接使用令牌重置）');
        if (result.resetToken) {
          setResetToken(result.resetToken);
          setShowResetForm(true);
        }
      } else {
        setError(result.error || '请求失败');
      }
    } catch (error) {
      setError('系统错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 获取安全问题
  const handleGetSecurityQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await profileService.getSecurityQuestions(securityEmail);
      
      if (result.success && result.questions) {
        setSecurityQuestions(result.questions);
        setShowQuestions(true);
      } else {
        setError(result.error || '获取安全问题失败');
      }
    } catch (error) {
      setError('系统错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 验证安全问题
  const handleVerifySecurityQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await profileService.verifySecurityQuestions(securityEmail, securityAnswers);
      
      if (result.success && result.resetToken) {
        setMessage('安全问题验证成功！');
        setResetToken(result.resetToken);
        setShowResetForm(true);
        setShowQuestions(false);
      } else {
        setError(result.error || '安全问题答案错误');
      }
    } catch (error) {
      setError('系统错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 重置密码
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('密码至少需要6个字符');
      setIsLoading(false);
      return;
    }

    try {
      const result = await profileService.resetPasswordWithToken(resetToken, newPassword);
      
      if (result.success) {
        setMessage('密码重置成功！正在跳转到登录页面...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(result.error || '密码重置失败');
      }
    } catch (error) {
      setError('系统错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  if (showResetForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-2xl">重置密码</CardTitle>
            </div>
            <CardDescription>
              请输入您的新密码
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">新密码</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="请输入新密码"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入新密码"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '重置中...' : '重置密码'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link href="/login" className="text-sm text-purple-600 hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                返回登录
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">忘记密码</CardTitle>
          <CardDescription>
            选择一种方式来重置您的密码
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                邮箱重置
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                安全问题
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <form onSubmit={handleEmailReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱地址</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="请输入您的邮箱地址"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? '发送中...' : '发送重置链接'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              {!showQuestions ? (
                <form onSubmit={handleGetSecurityQuestions} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="securityEmail">邮箱地址</Label>
                    <Input
                      id="securityEmail"
                      type="email"
                      value={securityEmail}
                      onChange={(e) => setSecurityEmail(e.target.value)}
                      placeholder="请输入您的邮箱地址"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? '获取中...' : '获取安全问题'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifySecurityQuestions} className="space-y-4">
                  {securityQuestions.question1 && (
                    <div className="space-y-2">
                      <Label>{securityQuestions.question1}</Label>
                      <Input
                        value={securityAnswers.answer1}
                        onChange={(e) => setSecurityAnswers(prev => ({ ...prev, answer1: e.target.value }))}
                        placeholder="请输入答案"
                        required
                      />
                    </div>
                  )}

                  {securityQuestions.question2 && (
                    <div className="space-y-2">
                      <Label>{securityQuestions.question2}</Label>
                      <Input
                        value={securityAnswers.answer2}
                        onChange={(e) => setSecurityAnswers(prev => ({ ...prev, answer2: e.target.value }))}
                        placeholder="请输入答案"
                        required
                      />
                    </div>
                  )}

                  {securityQuestions.question3 && (
                    <div className="space-y-2">
                      <Label>{securityQuestions.question3}</Label>
                      <Input
                        value={securityAnswers.answer3}
                        onChange={(e) => setSecurityAnswers(prev => ({ ...prev, answer3: e.target.value }))}
                        placeholder="请输入答案"
                        required
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowQuestions(false)}
                      className="flex-1"
                    >
                      返回
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                      {isLoading ? '验证中...' : '验证答案'}
                    </Button>
                  </div>
                </form>
              )}
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className="mt-4">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-purple-600 hover:underline flex items-center justify-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              返回登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
