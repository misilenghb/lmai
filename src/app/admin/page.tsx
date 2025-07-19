"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Users,
  Palette,
  Database,
  Activity,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { verifyAdminAccess, AdminRole, getAdminStats } from '@/lib/admin-auth';
import Link from 'next/link';

interface AdminStats {
  totalUsers: number;
  totalDesigns: number;
  todayNewUsers: number;
  systemStatus: string;
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalDesigns: 0,
    todayNewUsers: 0,
    systemStatus: 'unknown'
  });

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
        toast({
          title: "访问被拒绝",
          description: "您没有管理员权限",
          variant: "destructive"
        });
        router.push('/');
        return;
      }

      setIsAdmin(true);
      setAdminRole(verification.role || null);

      // 加载统计数据
      const statsData = await getAdminStats();
      setStats(statsData);

    } catch (error) {
      console.error('验证管理员权限失败:', error);
      toast({
        title: "验证失败",
        description: "无法验证管理员权限",
        variant: "destructive"
      });
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>验证管理员权限中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>访问被拒绝</AlertTitle>
          <AlertDescription>
            您没有访问管理员面板的权限。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">管理员控制台</h1>
          <p className="text-muted-foreground mt-1">
            欢迎回来，{user?.email}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="default">
            <Shield className="w-3 h-3 mr-1" />
            管理员
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">设计作品</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDesigns}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">系统状态</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">正常运行</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">数据库</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">连接正常</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/users">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Users className="w-4 h-4 mr-2" />
                用户管理
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                查看和管理用户账户
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/content">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Palette className="w-4 h-4 mr-2" />
                内容管理
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                管理设计作品和数据
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/monitoring">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                系统监控
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                监控系统性能
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/settings">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                系统设置
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                系统配置管理
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/database">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Database className="w-4 h-4 mr-2" />
                数据库管理
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                数据库监控、修复和维护
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/diagnostic">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                系统诊断
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                系统健康检查
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
