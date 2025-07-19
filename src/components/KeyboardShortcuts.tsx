"use client";

import React, { useEffect } from 'react';
import { useCreativeWorkshop } from '@/contexts/CreativeWorkshopContext';
import { useOptimizedToast } from '@/hooks/use-optimized-toast';

interface KeyboardShortcutsProps {
  onToggleSidebar?: () => void;
  onClearHistory?: () => void;
  onFocusPrompt?: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onToggleSidebar,
  onClearHistory,
  onFocusPrompt
}) => {
  const {
    handleSendMessage,
    prompt,
    isGenerating,
    toggleImageMode,
    isImageMode
  } = useCreativeWorkshop();
  const { showKeyboardShortcut } = useOptimizedToast();

  useEffect(() => {
    // 防抖处理，避免快速连续触发
    let debounceTimer: NodeJS.Timeout;

    const handleKeyDown = (event: KeyboardEvent) => {
      // 清除之前的定时器
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // 检查是否在输入框中
      const isInInput = (event.target as HTMLElement)?.tagName === 'INPUT' ||
                       (event.target as HTMLElement)?.tagName === 'TEXTAREA';

      // 防抖处理
      debounceTimer = setTimeout(() => {
        // Ctrl/Cmd + Enter: 发送消息
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
          event.preventDefault();
          if (prompt.trim() && !isGenerating) {
            handleSendMessage(prompt);
            showKeyboardShortcut('快捷键触发', '已发送消息 (Ctrl+Enter)');
          }
          return;
        }

        // Ctrl/Cmd + B: 切换侧边栏
        if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
          event.preventDefault();
          onToggleSidebar?.();
          showKeyboardShortcut('快捷键触发', '切换侧边栏 (Ctrl+B)');
          return;
        }

        // Ctrl/Cmd + K: 聚焦到提示词输入框
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
          event.preventDefault();
          onFocusPrompt?.();
          showKeyboardShortcut('快捷键触发', '聚焦输入框 (Ctrl+K)');
          return;
        }

        // Ctrl/Cmd + Shift + C: 清空历史
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
          event.preventDefault();
          onClearHistory?.();
          return;
        }

        // Ctrl/Cmd + I: 切换图像模式
        if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
          event.preventDefault();
          toggleImageMode();
          showKeyboardShortcut('快捷键触发', `切换到${isImageMode ? '文本' : '图像'}模式 (Ctrl+I)`);
          return;
        }

        // ESC: 取消生成（如果正在生成）
        if (event.key === 'Escape' && isGenerating) {
          event.preventDefault();
          // 这里可以添加取消生成的逻辑
          return;
        }

        // 数字键 1-6: 快速应用预设（仅在非输入状态下）
        if (!isInInput && /^[1-6]$/.test(event.key)) {
          event.preventDefault();
          const presetIndex = parseInt(event.key) - 1;
          // 这里可以触发快速预设选择
          showKeyboardShortcut('快捷键触发', `应用预设 ${event.key}`);
          return;
        }

        // Ctrl/Cmd + /: 显示快捷键帮助
        if ((event.ctrlKey || event.metaKey) && event.key === '/') {
          event.preventDefault();
          showKeyboardShortcut('键盘快捷键', 'Ctrl+Enter发送, Ctrl+B切换侧边栏, Ctrl+K聚焦输入框');
          return;
        }
      }, 100); // 100ms防抖
    };

    // 添加事件监听器
    document.addEventListener('keydown', handleKeyDown);

    // 清理函数
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [
    handleSendMessage,
    prompt,
    isGenerating,
    toggleImageMode,
    isImageMode,
    onToggleSidebar,
    onClearHistory,
    onFocusPrompt,
    showKeyboardShortcut
  ]);

  // 这个组件不渲染任何内容，只处理键盘事件
  return null;
};

export default KeyboardShortcuts;
