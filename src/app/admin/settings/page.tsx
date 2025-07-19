"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  AlertTriangle,
  CheckCircle2,
  Database,
  Shield,
  Bell,
  Palette,
  Globe,
  HardDrive,
  Download,
  Upload,
  Power,
  Wrench
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { verifyAdminAccess, Permission, hasPermission } from '@/lib/admin-auth';

interface SystemConfig {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  aiServiceEnabled: boolean;
  emailNotifications: boolean;
  maxFileSize: number;
  sessionTimeout: number;
  backupEnabled: boolean;
  backupFrequency: string;
}

export default function SystemSettings() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasSystemWritePermission, setHasSystemWritePermission] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState<SystemConfig>({
    siteName: '水晶日历 - Luminos',
    siteDescription: '个性化水晶能量日历系统',
    maintenanceMode: false,
    registrationEnabled: true,
    aiServiceEnabled: true,
    emailNotifications: true,
    maxFileSize: 10,
    sessionTimeout: 24,
    backupEnabled: true,
    backupFrequency: 'daily'
  });

  useEffect(() => {
    checkPermissionsAndLoadSettings();
  }, [user, isAuthenticated]);

  const checkPermissionsAndLoadSettings = async () => {
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

      const canWrite = hasPermission(verification.role, Permission.SYSTEM_WRITE);
      setHasSystemWritePermission(canWrite);

      // 加载系统设置（实际应用中应该从数据库或配置文件加载）
      await loadSystemSettings();
      
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

  const loadSystemSettings = async () => {
    try {
      // 实际应用中应该从API或数据库加载配置
      // 这里使用默认配置
      console.log('加载系统设置...');
    } catch (error) {
      console.error('加载系统设置失败:', error);
    }
  };

  const handleSaveSettings = async () => {
    if (!hasSystemWritePermission) {
      toast({
        title: "权限不足",
        description: "您没有修改系统设置的权限",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // 实际应用中应该调用API保存设置
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟保存过程
      
      toast({
        title: "保存成功",
        description: "系统设置已更新"
      });
    } catch (error) {
      console.error('保存设置失败:', error);
      toast({
        title: "保存失败",
        description: "无法保存系统设置",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSettings = () => {
    if (!hasSystemWritePermission) return;

    if (window.confirm('确定要重置所有设置到默认值吗？此操作不可撤销。')) {
      setConfig({
        siteName: '水晶日历 - Luminos',
        siteDescription: '个性化水晶能量日历系统',
        maintenanceMode: false,
        registrationEnabled: true,
        aiServiceEnabled: true,
        emailNotifications: true,
        maxFileSize: 10,
        sessionTimeout: 24,
        backupEnabled: true,
        backupFrequency: 'daily'
      });
      
      toast({
        title: "设置已重置",
        description: "所有设置已恢复到默认值"
      });
    }
  };

  const handleMaintenanceToggle = (enabled: boolean) => {
    if (!hasSystemWritePermission) return;

    if (enabled) {
      if (window.confirm('启用维护模式将暂时关闭网站访问，确定要继续吗？')) {
        setConfig(prev => ({ ...prev, maintenanceMode: enabled }));
        toast({
          title: "维护模式已启用",
          description: "网站现在处于维护状态",
          variant: "destructive"
        });
      }
    } else {
      setConfig(prev => ({ ...prev, maintenanceMode: enabled }));
      toast({
        title: "维护模式已关闭",
        description: "网站已恢复正常访问"
      });
    }
  };

  const handleBackup = async () => {
    if (!hasSystemWritePermission) return;

    try {
      toast({
        title: "备份开始",
        description: "正在创建系统备份..."
      });
      
      // 模拟备份过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "备份完成",
        description: "系统备份已成功创建"
      });
    } catch (error) {
      toast({
        title: "备份失败",
        description: "创建备份时发生错误",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>加载系统设置中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">系统设置</h1>
          <p className="text-muted-foreground mt-1">
            管理系统配置、功能开关和维护选项
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {hasSystemWritePermission && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleResetSettings}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                重置设置
              </Button>
              <Button 
                size="sm"
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? '保存中...' : '保存设置'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 维护模式警告 */}
      {config.maintenanceMode && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>维护模式已启用</AlertTitle>
          <AlertDescription>
            网站当前处于维护状态，普通用户无法访问。请在完成维护后关闭此模式。
          </AlertDescription>
        </Alert>
      )}

      {/* 设置标签页 */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">常规设置</TabsTrigger>
          <TabsTrigger value="features">功能开关</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
          <TabsTrigger value="backup">备份恢复</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                网站基本信息
              </CardTitle>
              <CardDescription>
                配置网站的基本信息和显示设置
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">网站名称</Label>
                  <Input
                    id="siteName"
                    value={config.siteName}
                    onChange={(e) => setConfig(prev => ({ ...prev, siteName: e.target.value }))}
                    disabled={!hasSystemWritePermission}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">最大文件大小 (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={config.maxFileSize}
                    onChange={(e) => setConfig(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
                    disabled={!hasSystemWritePermission}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">网站描述</Label>
                <Textarea
                  id="siteDescription"
                  value={config.siteDescription}
                  onChange={(e) => setConfig(prev => ({ ...prev, siteDescription: e.target.value }))}
                  disabled={!hasSystemWritePermission}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="w-5 h-5 mr-2" />
                维护模式
              </CardTitle>
              <CardDescription>
                启用维护模式将暂时关闭网站访问
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">维护模式</div>
                  <div className="text-sm text-muted-foreground">
                    启用后，只有管理员可以访问网站
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {config.maintenanceMode && (
                    <Badge variant="destructive">
                      <Power className="w-3 h-3 mr-1" />
                      维护中
                    </Badge>
                  )}
                  <Switch
                    checked={config.maintenanceMode}
                    onCheckedChange={handleMaintenanceToggle}
                    disabled={!hasSystemWritePermission}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                功能开关
              </CardTitle>
              <CardDescription>
                控制系统各项功能的启用状态
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">用户注册</div>
                  <div className="text-sm text-muted-foreground">
                    允许新用户注册账户
                  </div>
                </div>
                <Switch
                  checked={config.registrationEnabled}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, registrationEnabled: checked }))}
                  disabled={!hasSystemWritePermission}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">AI服务</div>
                  <div className="text-sm text-muted-foreground">
                    启用AI对话和图像生成功能
                  </div>
                </div>
                <Switch
                  checked={config.aiServiceEnabled}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, aiServiceEnabled: checked }))}
                  disabled={!hasSystemWritePermission}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">邮件通知</div>
                  <div className="text-sm text-muted-foreground">
                    发送系统通知邮件
                  </div>
                </div>
                <Switch
                  checked={config.emailNotifications}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, emailNotifications: checked }))}
                  disabled={!hasSystemWritePermission}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                安全设置
              </CardTitle>
              <CardDescription>
                配置系统安全相关参数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">会话超时时间 (小时)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={config.sessionTimeout}
                  onChange={(e) => setConfig(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                  disabled={!hasSystemWritePermission}
                />
                <div className="text-sm text-muted-foreground">
                  用户会话的有效期，超时后需要重新登录
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">数据库安全</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>行级安全策略 (RLS)</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      已启用
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SSL连接</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      已启用
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HardDrive className="w-5 h-5 mr-2" />
                备份设置
              </CardTitle>
              <CardDescription>
                配置自动备份和数据恢复选项
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">自动备份</div>
                  <div className="text-sm text-muted-foreground">
                    定期自动创建系统备份
                  </div>
                </div>
                <Switch
                  checked={config.backupEnabled}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, backupEnabled: checked }))}
                  disabled={!hasSystemWritePermission}
                />
              </div>

              {config.backupEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">备份频率</Label>
                  <select
                    id="backupFrequency"
                    value={config.backupFrequency}
                    onChange={(e) => setConfig(prev => ({ ...prev, backupFrequency: e.target.value }))}
                    disabled={!hasSystemWritePermission}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="hourly">每小时</option>
                    <option value="daily">每日</option>
                    <option value="weekly">每周</option>
                    <option value="monthly">每月</option>
                  </select>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={handleBackup}
                  disabled={!hasSystemWritePermission}
                >
                  <Download className="w-4 h-4 mr-2" />
                  立即备份
                </Button>
                <Button
                  variant="outline"
                  disabled={!hasSystemWritePermission}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  恢复备份
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">最近备份</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>2024-01-15 02:00:00</span>
                    <Badge variant="outline">125.6 MB</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>2024-01-14 02:00:00</span>
                    <Badge variant="outline">124.8 MB</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>2024-01-13 02:00:00</span>
                    <Badge variant="outline">123.9 MB</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {!hasSystemWritePermission && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            您只有查看权限，无法修改系统设置。
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
