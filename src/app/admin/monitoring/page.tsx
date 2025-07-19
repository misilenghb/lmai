"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Database, 
  Server, 
  Zap, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Eye,
  BarChart3,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { verifyAdminAccess, Permission, hasPermission } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';

interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  uptime: string;
  responseTime: number;
  errorRate: number;
  lastCheck: string;
}

interface DatabaseStatus {
  connectionStatus: 'connected' | 'disconnected' | 'slow';
  activeConnections: number;
  queryTime: number;
  tableCount: number;
  dataSize: string;
  missingTables?: number;
  completionPercentage?: number;
}

interface ApiStats {
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  errorCount: number;
  topEndpoints: Array<{
    endpoint: string;
    requests: number;
    avgTime: number;
  }>;
}

export default function SystemMonitoring() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasSystemReadPermission, setHasSystemReadPermission] = useState(false);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    uptime: '0d 0h 0m',
    responseTime: 0,
    errorRate: 0,
    lastCheck: new Date().toISOString()
  });
  const [databaseStatus, setDatabaseStatus] = useState<DatabaseStatus>({
    connectionStatus: 'connected',
    activeConnections: 0,
    queryTime: 0,
    tableCount: 0,
    dataSize: '0 MB'
  });
  const [apiStats, setApiStats] = useState<ApiStats>({
    totalRequests: 0,
    successRate: 0,
    averageResponseTime: 0,
    errorCount: 0,
    topEndpoints: []
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    checkPermissionsAndLoadData();
    
    // 设置定时刷新
    const interval = setInterval(() => {
      if (hasSystemReadPermission) {
        loadMonitoringData();
      }
    }, 30000); // 每30秒刷新一次

    return () => clearInterval(interval);
  }, [user, isAuthenticated, hasSystemReadPermission]);

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

      const canRead = hasPermission(verification.role, Permission.SYSTEM_READ);
      setHasSystemReadPermission(canRead);

      if (canRead) {
        await loadMonitoringData();
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

  const loadMonitoringData = async () => {
    try {
      await Promise.all([
        loadSystemHealth(),
        loadDatabaseStatus(),
        loadApiStats()
      ]);
    } catch (error) {
      console.error('加载监控数据失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载监控数据",
        variant: "destructive"
      });
    }
  };

  const loadSystemHealth = async () => {
    try {
      const startTime = Date.now();
      
      // 测试系统响应时间
      const response = await fetch('/api/health-check');
      const responseTime = Date.now() - startTime;
      
      setSystemHealth({
        status: responseTime < 1000 ? 'healthy' : responseTime < 3000 ? 'warning' : 'error',
        uptime: calculateUptime(),
        responseTime,
        errorRate: Math.random() * 5, // 模拟错误率
        lastCheck: new Date().toISOString()
      });
    } catch (error) {
      setSystemHealth(prev => ({
        ...prev,
        status: 'error',
        lastCheck: new Date().toISOString()
      }));
    }
  };

  const loadDatabaseStatus = async () => {
    try {
      const startTime = Date.now();
      
      // 测试数据库连接
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      const queryTime = Date.now() - startTime;
      
      // 获取表数量（模拟数据）
      const tableCount = 10; // 实际应用中应该查询系统表
      
      setDatabaseStatus({
        connectionStatus: error ? 'disconnected' : queryTime > 1000 ? 'slow' : 'connected',
        activeConnections: Math.floor(Math.random() * 20) + 5,
        queryTime,
        tableCount,
        dataSize: '125.6 MB'
      });
    } catch (error) {
      setDatabaseStatus(prev => ({
        ...prev,
        connectionStatus: 'disconnected'
      }));
    }
  };

  const loadApiStats = async () => {
    // 模拟API统计数据（实际应用中应该从日志或监控服务获取）
    setApiStats({
      totalRequests: Math.floor(Math.random() * 10000) + 5000,
      successRate: 95 + Math.random() * 4,
      averageResponseTime: Math.floor(Math.random() * 500) + 200,
      errorCount: Math.floor(Math.random() * 50) + 10,
      topEndpoints: [
        { endpoint: '/api/daily-focus', requests: 1250, avgTime: 180 },
        { endpoint: '/api/save-design', requests: 890, avgTime: 320 },
        { endpoint: '/api/user-profile', requests: 650, avgTime: 150 },
        { endpoint: '/api/crystal-data', requests: 420, avgTime: 95 },
        { endpoint: '/api/ai-conversation', requests: 380, avgTime: 850 }
      ]
    });
  };

  const calculateUptime = () => {
    // 模拟系统运行时间
    const hours = Math.floor(Math.random() * 720) + 24;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h 0m`;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadMonitoringData();
    setIsRefreshing(false);
    toast({
      title: "刷新完成",
      description: "监控数据已更新"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return <Badge variant="default" className="bg-green-100 text-green-800">正常</Badge>;
      case 'warning':
      case 'slow':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">警告</Badge>;
      case 'error':
      case 'disconnected':
        return <Badge variant="destructive">错误</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };

  const formatTime = (ms: number) => {
    return `${ms}ms`;
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>加载监控数据中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasSystemReadPermission) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertDescription>
            您没有查看系统监控的权限。
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
          <h1 className="text-3xl font-bold">系统监控</h1>
          <p className="text-muted-foreground mt-1">
            实时监控系统健康状态和性能指标
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            刷新数据
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      {/* 系统状态概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">系统状态</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {systemHealth.status === 'healthy' ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
              {getStatusBadge(systemHealth.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              运行时间: {systemHealth.uptime}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">响应时间</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(systemHealth.responseTime)}</div>
            <p className="text-xs text-muted-foreground">
              平均响应时间
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">数据库</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusBadge(databaseStatus.connectionStatus)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              查询时间: {formatTime(databaseStatus.queryTime)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API成功率</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiStats.successRate.toFixed(1)}%</div>
            <Progress value={apiStats.successRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* 详细监控信息 */}
      <Tabs defaultValue="system" className="space-y-4">
        <TabsList>
          <TabsTrigger value="system">系统健康</TabsTrigger>
          <TabsTrigger value="database">数据库状态</TabsTrigger>
          <TabsTrigger value="api">API统计</TabsTrigger>
          <TabsTrigger value="logs">错误日志</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="w-5 h-5 mr-2" />
                  系统性能
                </CardTitle>
                <CardDescription>
                  服务器资源使用情况
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">CPU使用率</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <Progress value={45} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">内存使用率</span>
                    <span className="text-sm font-medium">62%</span>
                  </div>
                  <Progress value={62} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">磁盘使用率</span>
                    <span className="text-sm font-medium">38%</span>
                  </div>
                  <Progress value={38} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wifi className="w-5 h-5 mr-2" />
                  网络状态
                </CardTitle>
                <CardDescription>
                  网络连接和流量统计
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">网络延迟</span>
                  <span className="text-sm font-medium">12ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">入站流量</span>
                  <span className="text-sm font-medium">2.3 MB/s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">出站流量</span>
                  <span className="text-sm font-medium">1.8 MB/s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">活跃连接</span>
                  <span className="text-sm font-medium">156</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>数据库详细状态</CardTitle>
              <CardDescription>
                数据库连接、性能和存储信息
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{databaseStatus.activeConnections}</div>
                  <div className="text-sm text-muted-foreground">活跃连接</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{formatTime(databaseStatus.queryTime)}</div>
                  <div className="text-sm text-muted-foreground">平均查询时间</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{databaseStatus.tableCount}</div>
                  <div className="text-sm text-muted-foreground">数据表数量</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{databaseStatus.dataSize}</div>
                  <div className="text-sm text-muted-foreground">数据大小</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>API统计概览</CardTitle>
                <CardDescription>
                  API请求和响应统计
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">总请求数</span>
                  <span className="text-sm font-medium">{apiStats.totalRequests.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">成功率</span>
                  <span className="text-sm font-medium">{apiStats.successRate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">平均响应时间</span>
                  <span className="text-sm font-medium">{formatTime(apiStats.averageResponseTime)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">错误数量</span>
                  <span className="text-sm font-medium">{apiStats.errorCount}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>热门API端点</CardTitle>
                <CardDescription>
                  请求量最高的API接口
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {apiStats.topEndpoints.map((endpoint, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{endpoint.endpoint}</div>
                        <div className="text-xs text-muted-foreground">
                          {endpoint.requests} 请求 · {formatTime(endpoint.avgTime)}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>错误日志</CardTitle>
              <CardDescription>
                系统错误和异常记录
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                错误日志功能正在开发中...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
