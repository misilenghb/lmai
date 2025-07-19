"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { verifyAdminAccess } from '@/lib/admin-auth';
import AdminNavigation from '@/components/admin/AdminNavigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAccess();
  }, [user, isAuthenticated]);

  const checkAdminAccess = async () => {
    if (!isAuthenticated || !user?.email) {
      router.push('/login');
      return;
    }

    try {
      const verification = await verifyAdminAccess(user.email);
      
      if (!verification.isAdmin) {
        setError('您没有访问管理员面板的权限');
        setTimeout(() => {
          router.push('/');
        }, 3000);
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('验证管理员权限失败:', error);
      setError('验证管理员权限时发生错误');
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>验证管理员权限中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* 侧边导航 */}
      <AdminNavigation />
      
      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
