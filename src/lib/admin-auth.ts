// 管理员权限系统
import { supabase } from './supabase';

// 管理员角色定义
export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  VIEWER = 'viewer'
}

// 权限定义
export enum Permission {
  // 用户管理
  USER_READ = 'user:read',
  USER_WRITE = 'user:write',
  USER_DELETE = 'user:delete',
  
  // 内容管理
  CONTENT_READ = 'content:read',
  CONTENT_WRITE = 'content:write',
  CONTENT_DELETE = 'content:delete',
  CONTENT_MODERATE = 'content:moderate',
  
  // 系统管理
  SYSTEM_READ = 'system:read',
  SYSTEM_WRITE = 'system:write',
  SYSTEM_MAINTENANCE = 'system:maintenance',
  
  // 数据库管理
  DATABASE_READ = 'database:read',
  DATABASE_WRITE = 'database:write',
  DATABASE_ADMIN = 'database:admin',
  
  // 分析和报告
  ANALYTICS_READ = 'analytics:read',
  ANALYTICS_EXPORT = 'analytics:export'
}

// 角色权限映射
const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  [AdminRole.SUPER_ADMIN]: Object.values(Permission),
  [AdminRole.ADMIN]: [
    Permission.USER_READ,
    Permission.USER_WRITE,
    Permission.CONTENT_READ,
    Permission.CONTENT_WRITE,
    Permission.CONTENT_MODERATE,
    Permission.SYSTEM_READ,
    Permission.SYSTEM_WRITE,
    Permission.DATABASE_READ,
    Permission.DATABASE_WRITE,
    Permission.ANALYTICS_READ,
    Permission.ANALYTICS_EXPORT
  ],
  [AdminRole.MODERATOR]: [
    Permission.USER_READ,
    Permission.CONTENT_READ,
    Permission.CONTENT_WRITE,
    Permission.CONTENT_MODERATE,
    Permission.SYSTEM_READ,
    Permission.ANALYTICS_READ
  ],
  [AdminRole.VIEWER]: [
    Permission.USER_READ,
    Permission.CONTENT_READ,
    Permission.SYSTEM_READ,
    Permission.ANALYTICS_READ
  ]
};

// 管理员用户接口
export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: AdminRole;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

// 预定义的管理员邮箱列表（开发环境）
const ADMIN_EMAILS = [
  'admin@luminos.com',
  'super@luminos.com',
  'dev@luminos.com',
  'test@luminos.com'
];

/**
 * 检查用户是否为管理员
 */
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * 根据邮箱获取管理员角色
 */
export function getAdminRole(email: string): AdminRole {
  const lowerEmail = email.toLowerCase();
  
  if (lowerEmail === 'super@luminos.com' || lowerEmail === 'admin@luminos.com') {
    return AdminRole.SUPER_ADMIN;
  }
  
  if (lowerEmail === 'dev@luminos.com') {
    return AdminRole.ADMIN;
  }
  
  return AdminRole.MODERATOR;
}

/**
 * 获取角色对应的权限列表
 */
export function getRolePermissions(role: AdminRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * 检查用户是否有特定权限
 */
export function hasPermission(userRole: AdminRole, permission: Permission): boolean {
  const permissions = getRolePermissions(userRole);
  return permissions.includes(permission);
}

/**
 * 验证管理员身份
 */
export async function verifyAdminAccess(email: string): Promise<{
  isAdmin: boolean;
  role?: AdminRole;
  permissions?: Permission[];
  error?: string;
}> {
  try {
    if (!email) {
      return { isAdmin: false, error: '邮箱地址为空' };
    }

    // 检查是否为管理员邮箱
    if (!isAdminEmail(email)) {
      return { isAdmin: false, error: '非管理员邮箱' };
    }

    // 获取角色和权限
    const role = getAdminRole(email);
    const permissions = getRolePermissions(role);

    return {
      isAdmin: true,
      role,
      permissions
    };
  } catch (error) {
    console.error('验证管理员身份失败:', error);
    return { isAdmin: false, error: '验证过程中发生错误' };
  }
}

/**
 * 创建管理员用户对象
 */
export function createAdminUser(email: string, name?: string): AdminUser | null {
  if (!isAdminEmail(email)) {
    return null;
  }

  const role = getAdminRole(email);
  const permissions = getRolePermissions(role);

  return {
    id: `admin_${Date.now()}`,
    email,
    name: name || email.split('@')[0],
    role,
    permissions,
    isActive: true,
    createdAt: new Date().toISOString()
  };
}

/**
 * 管理员权限中间件
 */
export function requireAdminPermission(requiredPermission: Permission) {
  return async (email: string): Promise<boolean> => {
    const verification = await verifyAdminAccess(email);
    
    if (!verification.isAdmin || !verification.role) {
      return false;
    }

    return hasPermission(verification.role, requiredPermission);
  };
}

/**
 * 批量权限检查
 */
export function checkMultiplePermissions(
  userRole: AdminRole, 
  permissions: Permission[]
): Record<Permission, boolean> {
  const result: Record<Permission, boolean> = {} as any;
  
  permissions.forEach(permission => {
    result[permission] = hasPermission(userRole, permission);
  });
  
  return result;
}

/**
 * 获取管理员统计信息
 */
export async function getAdminStats() {
  try {
    // 获取用户总数
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // 获取设计作品总数
    const { count: designCount } = await supabase
      .from('design_works')
      .select('*', { count: 'exact', head: true });

    // 获取今日新增用户
    const today = new Date().toISOString().split('T')[0];
    const { count: todayUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today);

    return {
      totalUsers: userCount || 0,
      totalDesigns: designCount || 0,
      todayNewUsers: todayUsers || 0,
      systemStatus: 'healthy'
    };
  } catch (error) {
    console.error('获取管理员统计信息失败:', error);
    return {
      totalUsers: 0,
      totalDesigns: 0,
      todayNewUsers: 0,
      systemStatus: 'error'
    };
  }
}
