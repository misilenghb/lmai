"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  UserPlus, 
  Download,
  Calendar,
  Mail,
  Activity,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { verifyAdminAccess, Permission, hasPermission } from '@/lib/admin-auth';
import { supabase, UserProfile } from '@/lib/supabase';

interface UserWithStats extends UserProfile {
  designCount?: number;
  lastActivity?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

export default function UserManagement() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserReadPermission, setHasUserReadPermission] = useState(false);
  const [hasUserWritePermission, setHasUserWritePermission] = useState(false);
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithStats[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);

  useEffect(() => {
    checkPermissionsAndLoadData();
  }, [user, isAuthenticated]);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const checkPermissionsAndLoadData = async () => {
    if (!isAuthenticated || !user?.email) {
      router.push('/login');
      return;
    }

    try {
      const verification = await verifyAdminAccess(user.email);
      
      if (!verification.isAdmin || !verification.role) {
        toast({
          title: "访问被拒绝",
          description: "您没有管理员权限",
          variant: "destructive"
        });
        router.push('/admin');
        return;
      }

      const canRead = hasPermission(verification.role, Permission.USER_READ);
      const canWrite = hasPermission(verification.role, Permission.USER_WRITE);
      
      setHasUserReadPermission(canRead);
      setHasUserWritePermission(canWrite);

      if (canRead) {
        await loadUsers();
      }
      
    } catch (error) {
      console.error('验证权限失败:', error);
      toast({
        title: "验证失败",
        description: "无法验证管理员权限",
        variant: "destructive"
      });
      router.push('/admin');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      // 获取用户基本信息
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        throw profilesError;
      }

      // 获取每个用户的设计作品数量
      const usersWithStats: UserWithStats[] = [];
      
      for (const profile of profiles || []) {
        const { count: designCount } = await supabase
          .from('design_works')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.user_id);

        usersWithStats.push({
          ...profile,
          designCount: designCount || 0,
          status: 'active', // 默认状态，实际应用中可能需要从数据库获取
          lastActivity: profile.updated_at || profile.created_at
        });
      }

      setUsers(usersWithStats);
    } catch (error) {
      console.error('加载用户数据失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载用户数据",
        variant: "destructive"
      });
    }
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredUsers(filtered);
  };

  const handleViewUser = (user: UserWithStats) => {
    setSelectedUser(user);
    setIsUserDetailOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">活跃</Badge>;
      case 'inactive':
        return <Badge variant="secondary">不活跃</Badge>;
      case 'suspended':
        return <Badge variant="destructive">已暂停</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>加载用户数据中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasUserReadPermission) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertDescription>
            您没有查看用户信息的权限。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">用户管理</h1>
          <p className="text-muted-foreground mt-1">
            管理系统用户账户和权限
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            导出数据
          </Button>
          {hasUserWritePermission && (
            <Button size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              添加用户
            </Button>
          )}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日注册</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => {
                const today = new Date().toDateString();
                const userDate = new Date(u.created_at).toDateString();
                return today === userDate;
              }).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">设计作品</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.reduce((sum, u) => sum + (u.designCount || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和过滤 */}
      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
          <CardDescription>
            查看和管理所有注册用户
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索用户邮箱、姓名或ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </Button>
          </div>

          {/* 用户表格 */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户信息</TableHead>
                  <TableHead>注册时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>设计作品</TableHead>
                  <TableHead>最后活动</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name || '未设置'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <div className="text-xs text-muted-foreground">ID: {user.id.slice(0, 8)}...</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(user.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status || 'active')}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {user.designCount || 0} 个作品
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.lastActivity ? formatDate(user.lastActivity) : '无记录'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {hasUserWritePermission && (
                          <>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? '没有找到匹配的用户' : '暂无用户数据'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 用户详情对话框 */}
      <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>用户详情</DialogTitle>
            <DialogDescription>
              查看用户的详细信息和活动记录
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">基本信息</TabsTrigger>
                <TabsTrigger value="profile">用户画像</TabsTrigger>
                <TabsTrigger value="activity">活动记录</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">用户ID</label>
                    <p className="text-sm text-muted-foreground">{selectedUser.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">邮箱</label>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">姓名</label>
                    <p className="text-sm text-muted-foreground">{selectedUser.name || '未设置'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">注册时间</label>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedUser.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">设计作品数</label>
                    <p className="text-sm text-muted-foreground">{selectedUser.designCount || 0} 个</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">账户状态</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedUser.status || 'active')}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="profile" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">生日</label>
                    <p className="text-sm text-muted-foreground">{selectedUser.birth_date || '未设置'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">性别</label>
                    <p className="text-sm text-muted-foreground">{selectedUser.gender || '未设置'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">星座</label>
                    <p className="text-sm text-muted-foreground">{selectedUser.zodiac_sign || '未设置'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">MBTI类型</label>
                    <p className="text-sm text-muted-foreground">{selectedUser.mbti || '未设置'}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  活动记录功能正在开发中...
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
