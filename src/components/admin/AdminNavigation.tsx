"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Database,
  Activity,
  Wrench
} from 'lucide-react';

interface AdminNavigationProps {
  className?: string;
}

const navigationItems = [
  {
    title: '仪表板',
    href: '/admin',
    icon: LayoutDashboard,
    description: '系统概览和快速操作'
  },
  {
    title: '用户管理',
    href: '/admin/users',
    icon: Users,
    description: '管理用户账户和权限'
  },
  {
    title: '内容管理',
    href: '/admin/content',
    icon: FileText,
    description: '管理设计作品和数据'
  },
  {
    title: '系统监控',
    href: '/admin/monitoring',
    icon: BarChart3,
    description: '监控系统状态和性能'
  },
  {
    title: '系统设置',
    href: '/admin/settings',
    icon: Settings,
    description: '配置系统参数'
  },
  {
    title: '系统优化',
    href: '/admin/optimization',
    icon: Wrench,
    description: '数据库优化和修复'
  }
];

const quickActions = [
  {
    title: '数据库管理',
    href: '/database-management',
    icon: Database,
    badge: '工具'
  },
  {
    title: '系统诊断',
    href: '/diagnostic',
    icon: Activity,
    badge: '诊断'
  }
];

export default function AdminNavigation({ className }: AdminNavigationProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex flex-col h-full bg-card border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold">管理控制台</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* 主导航 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {!isCollapsed && (
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              主要功能
            </div>
          )}
          <nav className="space-y-1 mt-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                  {!isCollapsed && (
                    <span className="truncate">{item.title}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 快速操作 */}
        <div className="p-2 mt-4">
          {!isCollapsed && (
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              快速操作
            </div>
          )}
          <nav className="space-y-1 mt-2">
            {quickActions.map((item) => {
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted",
                    isCollapsed ? "justify-center" : "justify-between"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <div className={cn("flex items-center", isCollapsed ? "justify-center" : "")}>
                    <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                    {!isCollapsed && (
                      <span className="truncate">{item.title}</span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <Badge variant="outline" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 底部状态 */}
      {!isCollapsed && (
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>系统运行正常</span>
          </div>
        </div>
      )}
    </div>
  );
}
