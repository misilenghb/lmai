
'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from './LanguageContext';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // 验证用户对象结构
        if (parsedUser && typeof parsedUser.email === 'string' && parsedUser.email.trim() !== '') {
          setUser(parsedUser);
        } else {
          console.warn('Invalid user object in localStorage:', parsedUser);
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    } finally {
        setIsAuthLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (!email || email.trim() === '') {
      toast({
        title: '登录失败',
        description: '邮箱地址无效',
        variant: 'destructive'
      });
      return false;
    }

    if (!password || password.trim() === '') {
      toast({
        title: '登录失败',
        description: '密码不能为空',
        variant: 'destructive'
      });
      return false;
    }

    try {
      // 使用数据库验证密码
      const { profileService } = await import('@/lib/supabase');
      const result = await profileService.verifyPassword(email.trim(), password);

      if (!result.success) {
        toast({
          title: '登录失败',
          description: result.error || '邮箱或密码错误',
          variant: 'destructive'
        });
        return false;
      }

      const newUser = { email: email.trim() };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast({
        title: t('toasts.loginSuccessTitle'),
        description: t('toasts.loginSuccessDesc', { email: newUser.email })
      });
      router.push('/');
      return true;

    } catch (error) {
      console.error('登录过程中发生错误:', error);
      toast({
        title: '登录失败',
        description: '系统错误，请稍后重试',
        variant: 'destructive'
      });
      return false;
    }
  }, [router, toast, t]);

  const register = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (!email || email.trim() === '') {
      toast({
        title: '注册失败',
        description: '邮箱地址无效',
        variant: 'destructive'
      });
      return false;
    }

    if (!password || password.length < 6) {
      toast({
        title: '注册失败',
        description: '密码至少需要6个字符',
        variant: 'destructive'
      });
      return false;
    }

    try {
      // 使用数据库注册用户
      const { profileService } = await import('@/lib/supabase');
      const result = await profileService.registerUser(email.trim(), password);

      if (!result.success) {
        toast({
          title: '注册失败',
          description: result.error || '注册失败，请稍后重试',
          variant: 'destructive'
        });
        return false;
      }

      toast({
        title: t('toasts.registerSuccessTitle'),
        description: t('toasts.registerSuccessDesc')
      });
      router.push('/login');
      return true;

    } catch (error) {
      console.error('注册过程中发生错误:', error);
      toast({
        title: '注册失败',
        description: '系统错误，请稍后重试',
        variant: 'destructive'
      });
      return false;
    }
  }, [router, toast, t]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    toast({ title: t('toasts.logoutSuccessTitle') });
    router.push('/');
  }, [router, toast, t]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
