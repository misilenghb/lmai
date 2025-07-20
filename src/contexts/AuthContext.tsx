
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

    // 简单的密码验证（在实际应用中应该调用后端API）
    // 这里使用一个简单的演示密码验证
    const validCredentials = [
      { email: 'admin@lmai.cc', password: 'admin123' },
      { email: 'user@lmai.cc', password: 'user123' },
      { email: 'test@lmai.cc', password: 'test123' }
    ];

    const isValidUser = validCredentials.some(
      cred => cred.email === email.trim() && cred.password === password
    );

    if (!isValidUser) {
      toast({
        title: '登录失败',
        description: '邮箱或密码错误',
        variant: 'destructive'
      });
      return false;
    }

    const newUser = { email: email.trim() };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    toast({ title: t('toasts.loginSuccessTitle'), description: t('toasts.loginSuccessDesc', { email: newUser.email }) });
    router.push('/');
    return true;
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

    // 在实际应用中，这里应该调用后端API进行注册
    console.log(`Simulating registration for ${email.trim()}`);
    toast({ title: t('toasts.registerSuccessTitle'), description: t('toasts.registerSuccessDesc') });
    router.push('/login');
    return true;
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
