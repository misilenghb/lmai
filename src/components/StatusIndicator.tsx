"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Image as ImageIcon,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useCreativeWorkshop } from '@/contexts/CreativeWorkshopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { animationUtils, ANIMATION_PRESETS } from '@/lib/animation-config';

const StatusIndicator: React.FC = () => {
  const { isGenerating, isImageMode, history } = useCreativeWorkshop();

  // 获取优化的动画配置
  const statusConfig = animationUtils.getConfig('statusIndicator');

  const getStatusInfo = () => {
    if (isGenerating) {
      return {
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        text: isImageMode ? '正在生成图像...' : '正在生成回复...',
        variant: 'default' as const,
        color: 'text-primary',
        bgColor: 'bg-primary/10'
      };
    }

    const lastItem = history[history.length - 1];
    if (lastItem?.isLoading) {
      return {
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        text: '处理中...',
        variant: 'default' as const,
        color: 'text-primary',
        bgColor: 'bg-primary/10'
      };
    }

    if (history.length === 0) {
      return {
        icon: <Sparkles className="w-4 h-4" />,
        text: '准备就绪',
        variant: 'secondary' as const,
        color: 'text-muted-foreground',
        bgColor: 'bg-muted/50'
      };
    }

    // 检查最后一项是否有错误
    if (lastItem?.type === 'images' && lastItem.content?.error) {
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        text: '生成失败',
        variant: 'destructive' as const,
        color: 'text-destructive',
        bgColor: 'bg-destructive/10'
      };
    }

    // 成功状态
    return {
      icon: <CheckCircle className="w-4 h-4" />,
      text: '完成',
      variant: 'secondary' as const,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10'
    };
  };

  const getModeInfo = () => {
    return {
      icon: isImageMode ? <ImageIcon className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />,
      text: isImageMode ? '图像模式' : '对话模式',
      variant: 'outline' as const,
      color: isImageMode ? 'text-accent' : 'text-primary',
      bgColor: isImageMode ? 'bg-accent/10' : 'bg-primary/10'
    };
  };

  const getSessionInfo = () => {
    const count = history.length;
    return {
      icon: <Clock className="w-4 h-4" />,
      text: `${count} 条记录`,
      variant: 'outline' as const,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/30'
    };
  };

  const statusInfo = getStatusInfo();
  const modeInfo = getModeInfo();
  const sessionInfo = getSessionInfo();

  return (
    <div className="flex items-center gap-2 text-sm">
      {/* 状态指示器 - 使用优化的动画配置 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={statusInfo.text}
          variants={statusConfig.variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={statusConfig.transition}
        >
          <Badge
            variant={statusInfo.variant}
            className={`flex items-center gap-1.5 ${statusInfo.bgColor} ${statusInfo.color} border-0 px-3 py-1 transition-all duration-200`}
          >
            {statusInfo.icon}
            {statusInfo.text}
          </Badge>
        </motion.div>
      </AnimatePresence>

      {/* 模式指示器 - 减少动画强度 */}
      <motion.div
        animate={{
          scale: isGenerating ? [1, 1.02, 1] : 1, // 减少缩放幅度
        }}
        transition={{
          duration: 2, // 增加动画时长，减少频率
          repeat: isGenerating ? Infinity : 0,
          ease: "easeInOut",
          repeatType: "reverse"
        }}
      >
        <Badge
          variant={modeInfo.variant}
          className={`flex items-center gap-1.5 ${modeInfo.bgColor} ${modeInfo.color} border-0 px-3 py-1 transition-all duration-200`}
        >
          {modeInfo.icon}
          {modeInfo.text}
        </Badge>
      </motion.div>

      {/* 会话信息 - 添加稳定的过渡 */}
      <AnimatePresence>
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Badge
              variant={sessionInfo.variant}
              className={`flex items-center gap-1.5 ${sessionInfo.bgColor} ${sessionInfo.color} border-0 px-3 py-1 transition-all duration-200`}
            >
              {sessionInfo.icon}
              {sessionInfo.text}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 性能指示器 */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="flex items-center gap-1"
        >
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-4 bg-primary/60 rounded-full"
                animate={{
                  scaleY: [0.5, 1, 0.5],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StatusIndicator;
