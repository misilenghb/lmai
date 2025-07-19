'use client';

/**
 * 全局动画配置
 * 用于统一管理动画参数，减少界面跳跃问题
 */

// 动画持续时间配置
export const ANIMATION_DURATION = {
  // 快速动画 - 用于小元素
  fast: 0.15,
  // 标准动画 - 用于大多数UI元素
  normal: 0.25,
  // 慢速动画 - 用于页面级别的转换
  slow: 0.4,
  // 布局动画 - 用于布局变化
  layout: 0.3,
} as const;

// 缓动函数配置
export const ANIMATION_EASING = {
  // 标准缓动
  standard: "easeInOut",
  // 进入缓动
  enter: "easeOut",
  // 退出缓动
  exit: "easeIn",
  // 弹性缓动
  spring: [0.4, 0, 0.2, 1],
} as const;

// 动画变体配置
export const ANIMATION_VARIANTS = {
  // 淡入淡出
  fadeInOut: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  // 缩放进入
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  
  // 滑动进入（从右侧）
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  
  // 滑动进入（从左侧）
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  
  // 滑动进入（从上方）
  slideInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  // 侧边栏动画
  sidebar: {
    initial: { opacity: 0, width: 0 },
    animate: { opacity: 1, width: "auto" },
    exit: { opacity: 0, width: 0 },
  },
} as const;

// 过渡配置
export const ANIMATION_TRANSITIONS = {
  // 快速过渡
  fast: {
    duration: ANIMATION_DURATION.fast,
    ease: ANIMATION_EASING.standard,
  },
  
  // 标准过渡
  normal: {
    duration: ANIMATION_DURATION.normal,
    ease: ANIMATION_EASING.standard,
  },
  
  // 慢速过渡
  slow: {
    duration: ANIMATION_DURATION.slow,
    ease: ANIMATION_EASING.standard,
  },
  
  // 弹性过渡
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  },
  
  // 布局过渡
  layout: {
    duration: ANIMATION_DURATION.layout,
    ease: ANIMATION_EASING.standard,
  },
} as const;

// 性能优化配置
export const PERFORMANCE_CONFIG = {
  // 启用硬件加速的CSS属性
  hardwareAcceleration: {
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden' as const,
    willChange: 'transform' as const,
  },
  
  // 防抖延迟（毫秒）
  debounceDelay: 100,
  
  // 节流延迟（毫秒）
  throttleDelay: 16, // ~60fps
  
  // 减少动画的条件
  reduceMotion: {
    // 检查用户是否偏好减少动画
    prefersReducedMotion: () => 
      typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  },
} as const;

// 动画预设组合
export const ANIMATION_PRESETS = {
  // 模态框动画
  modal: {
    variants: ANIMATION_VARIANTS.scaleIn,
    transition: ANIMATION_TRANSITIONS.normal,
  },
  
  // 侧边栏动画
  sidebar: {
    variants: ANIMATION_VARIANTS.sidebar,
    transition: ANIMATION_TRANSITIONS.layout,
  },
  
  // 页面过渡动画
  pageTransition: {
    variants: ANIMATION_VARIANTS.slideInUp,
    transition: ANIMATION_TRANSITIONS.normal,
  },
  
  // 列表项动画
  listItem: {
    variants: ANIMATION_VARIANTS.fadeInOut,
    transition: ANIMATION_TRANSITIONS.fast,
  },
  
  // 状态指示器动画
  statusIndicator: {
    variants: ANIMATION_VARIANTS.scaleIn,
    transition: ANIMATION_TRANSITIONS.fast,
  },
} as const;

// 动画工具函数
export const animationUtils = {
  // 获取适合的动画配置
  getConfig: (type: keyof typeof ANIMATION_PRESETS) => {
    const config = ANIMATION_PRESETS[type];
    
    // 如果用户偏好减少动画，则使用更快的配置
    if (PERFORMANCE_CONFIG.reduceMotion.prefersReducedMotion()) {
      return {
        ...config,
        transition: {
          ...config.transition,
          duration: (config.transition.duration as number) * 0.5,
        },
      };
    }
    
    return config;
  },
  
  // 创建防抖函数
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number = PERFORMANCE_CONFIG.debounceDelay
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },
  
  // 创建节流函数
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    delay: number = PERFORMANCE_CONFIG.throttleDelay
  ): ((...args: Parameters<T>) => void) => {
    let lastCall = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  },
};

export default {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  ANIMATION_VARIANTS,
  ANIMATION_TRANSITIONS,
  PERFORMANCE_CONFIG,
  ANIMATION_PRESETS,
  animationUtils,
};
