"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Download,
  Palette,
  Gem,
  MessageSquare,
  Image,
  Calendar,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { verifyAdminAccess, Permission, hasPermission } from '@/lib/admin-auth';
import { supabase, DesignWork } from '@/lib/supabase';

interface ContentStats {
  totalDesigns: number;
  totalCrystals: number;
  totalConversations: number;
  recentActivity: number;
}

interface DesignWorkWithUser extends DesignWork {
  userEmail?: string;
  userName?: string;
}

export default function ContentManagement() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasContentReadPermission, setHasContentReadPermission] = useState(false);
  const [hasContentWritePermission, setHasContentWritePermission] = useState(false);
  const [stats, setStats] = useState<ContentStats>({
    totalDesigns: 0,
    totalCrystals: 0,
    totalConversations: 0,
    recentActivity: 0
  });
  const [designs, setDesigns] = useState<DesignWorkWithUser[]>([]);
  const [filteredDesigns, setFilteredDesigns] = useState<DesignWorkWithUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('designs');

  useEffect(() => {
    checkPermissionsAndLoadData();
  }, [user, isAuthenticated]);

  useEffect(() => {
    filterContent();
  }, [searchTerm, designs]);

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

      const canRead = hasPermission(verification.role, Permission.CONTENT_READ);
      const canWrite = hasPermission(verification.role, Permission.CONTENT_WRITE);
      
      setHasContentReadPermission(canRead);
      setHasContentWritePermission(canWrite);

      if (canRead) {
        await loadContentData();
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

  const loadContentData = async () => {
    try {
      // 加载统计数据
      const [designsResult, crystalsResult] = await Promise.all([
        supabase.from('design_works').select('*', { count: 'exact', head: true }),
        supabase.from('crystals').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalDesigns: designsResult.count || 0,
        totalCrystals: crystalsResult.count || 0,
        totalConversations: 0, // AI对话记录表可能还未实现
        recentActivity: 0
      });

      // 加载设计作品数据
      await loadDesigns();
      
    } catch (error) {
      console.error('加载内容数据失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载内容数据",
        variant: "destructive"
      });
    }
  };

  const loadDesigns = async () => {
    try {
      const { data: designsData, error } = await supabase
        .from('design_works')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        throw error;
      }

      // 获取用户信息
      const designsWithUsers: DesignWorkWithUser[] = [];
      
      for (const design of designsData || []) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, name')
            .eq('user_id', design.user_id)
            .single();

          designsWithUsers.push({
            ...design,
            userEmail: profile?.email,
            userName: profile?.name
          });
        } catch (profileError) {
          // 如果无法获取用户信息，仍然添加设计作品
          designsWithUsers.push(design);
        }
      }

      setDesigns(designsWithUsers);
    } catch (error) {
      console.error('加载设计作品失败:', error);
    }
  };

  const filterContent = () => {
    if (!searchTerm) {
      setFilteredDesigns(designs);
      return;
    }

    const filtered = designs.filter(design => 
      design.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.style?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredDesigns(filtered);
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

  const getStatusBadge = (design: DesignWorkWithUser) => {
    if (design.is_favorite) {
      return <Badge variant="default" className="bg-yellow-100 text-yellow-800">收藏</Badge>;
    }
    return <Badge variant="outline">普通</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>加载内容数据中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasContentReadPermission) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertDescription>
            您没有查看内容的权限。
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
          <h1 className="text-3xl font-bold">内容管理</h1>
          <p className="text-muted-foreground mt-1">
            管理设计作品、水晶数据库和AI对话记录
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            导出数据
          </Button>
          {hasContentWritePermission && (
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              添加内容
            </Button>
          )}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">设计作品</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDesigns}</div>
            <p className="text-xs text-muted-foreground">
              用户创作总数
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">水晶数据</CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCrystals}</div>
            <p className="text-xs text-muted-foreground">
              数据库条目
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI对话</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConversations}</div>
            <p className="text-xs text-muted-foreground">
              对话记录
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日活动</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-muted-foreground">
              新增内容
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 内容管理标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="designs">设计作品</TabsTrigger>
          <TabsTrigger value="crystals">水晶数据</TabsTrigger>
          <TabsTrigger value="conversations">AI对话</TabsTrigger>
        </TabsList>

        <TabsContent value="designs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>设计作品管理</CardTitle>
              <CardDescription>
                查看和管理用户创建的设计作品
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索作品标题、用户、风格或类别..."
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

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>作品信息</TableHead>
                      <TableHead>创作者</TableHead>
                      <TableHead>风格/类别</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDesigns.map((design) => (
                      <TableRow key={design.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                              <Image className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                              <div className="font-medium">{design.title || '无标题'}</div>
                              <div className="text-sm text-muted-foreground">
                                ID: {design.id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{design.userName || '未知用户'}</div>
                            <div className="text-sm text-muted-foreground">{design.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{design.style || '未设置'}</div>
                            <div className="text-xs text-muted-foreground">{design.category || '未分类'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(design.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(design)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {hasContentWritePermission && (
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

              {filteredDesigns.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? '没有找到匹配的设计作品' : '暂无设计作品'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crystals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>水晶数据库管理</CardTitle>
              <CardDescription>
                管理系统中的水晶信息和属性数据
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                水晶数据库管理功能正在开发中...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI对话记录管理</CardTitle>
              <CardDescription>
                查看和管理用户与AI的对话记录
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                AI对话记录管理功能正在开发中...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
