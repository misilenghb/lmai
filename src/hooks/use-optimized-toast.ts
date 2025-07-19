'use client';

import { useToast } from '@/hooks/use-toast';
import { animationUtils } from '@/lib/animation-config';
import { useCallback, useRef } from 'react';

interface OptimizedToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
  // 防重复配置
  deduplicationKey?: string;
  // 频率限制配置
  rateLimitMs?: number;
  // 优先级配置
  priority?: 'low' | 'normal' | 'high';
}

/**
 * 优化的Toast Hook
 * 提供防重复、频率限制、优先级管理等功能
 */
export const useOptimizedToast = () => {
  const { toast } = useToast();
  
  // 存储最近的toast记录
  const recentToasts = useRef<Map<string, number>>(new Map());
  const lastToastTime = useRef<number>(0);
  
  // 清理过期的toast记录
  const cleanupExpiredToasts = useCallback(() => {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    recentToasts.current.forEach((timestamp, key) => {
      if (now - timestamp > 5000) { // 5秒后清理
        expiredKeys.push(key);
      }
    });
    
    expiredKeys.forEach(key => {
      recentToasts.current.delete(key);
    });
  }, []);
  
  // 防抖的toast函数
  const debouncedToast = useCallback(
    animationUtils.debounce((options: OptimizedToastOptions) => {
      const {
        title,
        description,
        variant = 'default',
        duration = 3000,
        deduplicationKey,
        rateLimitMs = 1000,
        priority = 'normal'
      } = options;
      
      const now = Date.now();
      
      // 清理过期记录
      cleanupExpiredToasts();
      
      // 检查频率限制
      if (now - lastToastTime.current < rateLimitMs && priority !== 'high') {
        return;
      }
      
      // 检查重复
      const key = deduplicationKey || `${title}-${description}`;
      const lastTime = recentToasts.current.get(key);
      
      if (lastTime && now - lastTime < 3000 && priority !== 'high') {
        return; // 3秒内不重复显示相同内容
      }
      
      // 记录此次toast
      recentToasts.current.set(key, now);
      lastToastTime.current = now;
      
      // 显示toast
      toast({
        title,
        description,
        variant,
        duration,
      });
    }, 150), // 150ms防抖
    [toast, cleanupExpiredToasts]
  );
  
  // 快捷方法
  const showSuccess = useCallback((title: string, description?: string) => {
    debouncedToast({
      title,
      description,
      variant: 'default',
      priority: 'normal',
    });
  }, [debouncedToast]);
  
  const showError = useCallback((title: string, description?: string) => {
    debouncedToast({
      title,
      description,
      variant: 'destructive',
      priority: 'high', // 错误消息优先级高
    });
  }, [debouncedToast]);
  
  const showInfo = useCallback((title: string, description?: string) => {
    debouncedToast({
      title,
      description,
      variant: 'default',
      priority: 'low',
    });
  }, [debouncedToast]);
  
  // 键盘快捷键专用toast（频率更低）
  const showKeyboardShortcut = useCallback((title: string, description: string) => {
    // 只有20%的概率显示键盘快捷键toast
    if (Math.random() > 0.8) {
      debouncedToast({
        title,
        description,
        variant: 'default',
        priority: 'low',
        rateLimitMs: 2000, // 更长的频率限制
        duration: 2000, // 更短的显示时间
      });
    }
  }, [debouncedToast]);
  
  // 状态变化toast（更低频率）
  const showStatusChange = useCallback((title: string, description?: string) => {
    debouncedToast({
      title,
      description,
      variant: 'default',
      priority: 'low',
      rateLimitMs: 3000, // 3秒频率限制
      duration: 2000,
    });
  }, [debouncedToast]);
  
  return {
    toast: debouncedToast,
    showSuccess,
    showError,
    showInfo,
    showKeyboardShortcut,
    showStatusChange,
  };
};

export default useOptimizedToast;
