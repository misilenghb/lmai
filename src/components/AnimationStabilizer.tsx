'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PERFORMANCE_CONFIG } from '@/lib/animation-config';

interface AnimationStabilizerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 动画稳定器组件
 * 用于监控和优化动画性能，减少界面跳跃
 */
const AnimationStabilizer: React.FC<AnimationStabilizerProps> = ({ 
  children, 
  className = "" 
}) => {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [performanceMode, setPerformanceMode] = useState<'auto' | 'performance' | 'quality'>('auto');
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const fpsRef = useRef(60);
  
  // 检测用户偏好和性能
  useEffect(() => {
    // 检查用户是否偏好减少动画
    const checkReducedMotion = () => {
      const prefersReduced = PERFORMANCE_CONFIG.reduceMotion.prefersReducedMotion();
      setIsReducedMotion(prefersReduced);
    };
    
    checkReducedMotion();
    
    // 监听媒体查询变化
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkReducedMotion);
    
    return () => {
      mediaQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);
  
  // 性能监控
  useEffect(() => {
    let animationId: number;
    
    const measurePerformance = (timestamp: number) => {
      frameCountRef.current++;
      
      if (lastFrameTimeRef.current) {
        const delta = timestamp - lastFrameTimeRef.current;
        const fps = 1000 / delta;
        
        // 使用移动平均计算FPS
        fpsRef.current = fpsRef.current * 0.9 + fps * 0.1;
        
        // 根据FPS调整性能模式
        if (fpsRef.current < 30 && performanceMode !== 'performance') {
          setPerformanceMode('performance');
        } else if (fpsRef.current > 50 && performanceMode !== 'quality') {
          setPerformanceMode('quality');
        }
      }
      
      lastFrameTimeRef.current = timestamp;
      animationId = requestAnimationFrame(measurePerformance);
    };
    
    // 只在有动画时监控性能
    const observer = new MutationObserver((mutations) => {
      const hasAnimations = mutations.some(mutation => 
        Array.from(mutation.addedNodes).some(node => 
          node instanceof Element && 
          (node.classList.contains('animate-') || 
           node.querySelector('[class*="animate-"]'))
        )
      );
      
      if (hasAnimations) {
        animationId = requestAnimationFrame(measurePerformance);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => {
      observer.disconnect();
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [performanceMode]);
  
  // 根据性能模式和用户偏好调整动画
  const getOptimizedProps = () => {
    if (isReducedMotion) {
      return {
        initial: false,
        animate: false,
        exit: undefined,
        transition: { duration: 0 }
      };
    }
    
    switch (performanceMode) {
      case 'performance':
        return {
          transition: { 
            duration: 0.1,
            ease: "linear"
          }
        };
      case 'quality':
        return {
          transition: { 
            duration: 0.3,
            ease: "easeInOut"
          }
        };
      default:
        return {
          transition: { 
            duration: 0.2,
            ease: "easeOut"
          }
        };
    }
  };
  
  // 防止布局抖动的容器样式
  const containerStyle = {
    ...PERFORMANCE_CONFIG.hardwareAcceleration,
    // 防止内容溢出导致的布局变化
    overflow: 'hidden',
    // 确保容器有固定的渲染上下文
    isolation: 'isolate' as const,
  };
  
  return (
    <motion.div
      className={`animation-stabilizer ${className}`}
      style={containerStyle}
      {...getOptimizedProps()}
    >
      {children}
      
      {/* 开发环境下的性能指示器 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 opacity-50 hover:opacity-100 transition-opacity">
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded">
            <div>FPS: {Math.round(fpsRef.current)}</div>
            <div>Mode: {performanceMode}</div>
            <div>Reduced: {isReducedMotion ? 'Yes' : 'No'}</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/**
 * 高阶组件：为组件添加动画稳定功能
 */
export const withAnimationStabilizer = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const StabilizedComponent = (props: P) => (
    <AnimationStabilizer>
      <Component {...props} />
    </AnimationStabilizer>
  );
  
  StabilizedComponent.displayName = `withAnimationStabilizer(${Component.displayName || Component.name})`;
  
  return StabilizedComponent;
};

/**
 * Hook：获取当前的动画性能状态
 */
export const useAnimationPerformance = () => {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [performanceMode, setPerformanceMode] = useState<'auto' | 'performance' | 'quality'>('auto');
  
  useEffect(() => {
    const checkReducedMotion = () => {
      setIsReducedMotion(PERFORMANCE_CONFIG.reduceMotion.prefersReducedMotion());
    };
    
    checkReducedMotion();
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkReducedMotion);
    
    return () => {
      mediaQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);
  
  return {
    isReducedMotion,
    performanceMode,
    shouldReduceAnimations: isReducedMotion || performanceMode === 'performance',
  };
};

export default AnimationStabilizer;
