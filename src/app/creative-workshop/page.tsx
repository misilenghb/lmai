"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import '@/styles/creative-workshop.css';
import AdvancedCrystalDesignPanel from '@/components/AdvancedCrystalDesignPanel';
import ParametersSummary from '@/components/ParametersSummary';
import GeneratedSuggestions from '@/components/GeneratedSuggestions';
import PromptBar from '@/components/PromptBar';
import DesignPreview from '@/components/DesignPreview';
import QuickPresets from '@/components/QuickPresets';
import DesignHistory from '@/components/DesignHistory';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
import StatusIndicator from '@/components/StatusIndicator';
import OptimizationSummary from '@/components/OptimizationSummary';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useCreativeWorkshop } from '@/contexts/CreativeWorkshopContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Wand2, User, RefreshCw, Lightbulb, Images, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function CreativeWorkshopPage() {
  const { 
    history, 
    prompt, 
    setPrompt, 
    isGenerating,
    designInput,
    handleGenerateSuggestions,
    handleSendMessage,
    handleRefineImage,
    handleGenerateSimilar,
    handleEnhance,
    handleSaveImage,
    clearHistory,
    isImageMode,
    toggleImageMode,
    sendInitialGreeting,
  } = useCreativeWorkshop();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const historyEndRef = useRef<HTMLDivElement>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Effect to send an initial greeting if the user is idle
  useEffect(() => {
    if (history.length === 0) {
      idleTimerRef.current = setTimeout(() => {
        sendInitialGreeting();
      }, 60000); // 1 minute
    }

    // Cleanup function to clear the timer
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [history.length, sendInitialGreeting]);
  
  // Effect to clear the idle timer if the user starts interacting
  useEffect(() => {
    if (prompt || history.length > 0) {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    }
  }, [prompt, history.length]);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSidebarGenerate = useCallback(async (data: any) => {
    await handleGenerateSuggestions(data);
  }, [handleGenerateSuggestions]);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleFocusPrompt = useCallback(() => {
    promptInputRef.current?.focus();
  }, []);
  
  const renderHistory = useMemo(() => (
    <>
      {/* 参数摘要 - 只在侧边栏关闭时显示 */}
      {!isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <ParametersSummary designInput={designInput} />
          <QuickPresets />
        </motion.div>
      )}

      {history.map((item, index) => {
        switch (item.type) {
          case 'suggestions':
            return (
              <motion.div
                key={item.id}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 size-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center luxury-glow">
                  <Wand2 className="size-5 text-primary" />
                </div>
                <div className="w-full max-w-2xl">
                  <GeneratedSuggestions suggestions={item.content} isLoading={item.isLoading} />
                </div>
              </motion.div>
            );
          case 'images':
             if (item.content?.isSaving) {
               return null;
             }
            return (
              <motion.div
                key={item.id}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 size-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center luxury-glow">
                  <Images className="size-5 text-accent" />
                </div>
                <div className="w-full max-w-2xl">
                  <DesignPreview
                    prompt={item.content?.prompt}
                    imageUrls={item.content?.imageUrls}
                    error={item.content?.error}
                    isGenerating={item.isLoading}
                    onSave={handleSaveImage}
                    onRefine={handleRefineImage}
                    onGenerateSimilar={handleGenerateSimilar}
                    onEnhance={handleEnhance}
                  />
                </div>
              </motion.div>
            );
          case 'user-prompt':
            return (
              <motion.div
                key={item.id}
                className="flex items-start gap-4 justify-end"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="luxury-card bg-primary/10 border-primary/20 text-foreground p-4 rounded-2xl max-w-xl order-1 shadow-lg">
                  <p className="text-sm leading-relaxed">{item.content}</p>
                </div>
                <div className="flex-shrink-0 size-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/20 flex items-center justify-center order-2 border border-primary/30 luxury-glow">
                  <User className="size-5 text-primary" />
                </div>
              </motion.div>
            );
          case 'ai-response':
              return (
                <motion.div
                  key={item.id}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 size-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center luxury-glow">
                    <Wand2 className="size-5 text-primary" />
                  </div>
                  <div className="w-full max-w-2xl">
                    {item.isLoading ? (
                      <div className="luxury-card p-4">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ) : (
                      <div className="luxury-card p-4 shadow-lg">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                          {item.content}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
          default:
            return null;
        }
      })}
    </>
  ), [history, isSidebarOpen, designInput, handleSaveImage, handleRefineImage, handleGenerateSimilar, handleEnhance]);

  const WelcomeCanvas = useMemo(() => (
    <div className="space-y-8 min-h-[60vh] flex flex-col justify-center">
      {/* 参数摘要 */}
      {!isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ParametersSummary designInput={designInput} />
        </motion.div>
      )}

      {/* 欢迎内容 */}
      <motion.div
        className="text-center flex flex-col items-center justify-center text-muted-foreground p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          className="relative mb-8"
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Wand2 className="w-20 h-20 text-primary luxury-glow" />
          <div className="absolute inset-0 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-bold luxury-text-gradient mb-6 tracking-tight">
          {t('creativeWorkshopPage.title')}
        </h1>
        <p className="max-w-2xl text-lg md:text-xl mb-12 leading-relaxed text-muted-foreground/80">
          {t('creativeWorkshopPage.description')}
        </p>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            className="luxury-card p-6 text-left group hover:scale-105 transition-all duration-300"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-primary/10 mr-3 group-hover:bg-primary/20 transition-colors">
                <Lightbulb className="w-6 h-6 text-primary luxury-glow" />
              </div>
              <h3 className="font-semibold text-foreground text-lg">
                {t('creativeWorkshopPage.welcome.getSuggestionsTitle')}
              </h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('creativeWorkshopPage.welcome.getSuggestionsDesc')}
            </p>
          </motion.div>

          <motion.div
            className="luxury-card p-6 text-left group hover:scale-105 transition-all duration-300"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-accent/10 mr-3 group-hover:bg-accent/20 transition-colors">
                <Images className="w-6 h-6 text-accent luxury-glow" />
              </div>
              <h3 className="font-semibold text-foreground text-lg">
                {t('creativeWorkshopPage.welcome.generateDirectlyTitle')}
              </h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('creativeWorkshopPage.welcome.generateDirectlyDesc')}
            </p>
          </motion.div>
        </motion.div>
        
        {/* 快速开始按钮 */}
        {/* 快速预设 */}
        <motion.div
          className="mt-12 w-full max-w-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <QuickPresets />
        </motion.div>

        {/* 优化总结 */}
        <motion.div
          className="mt-16 w-full max-w-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <OptimizationSummary />
        </motion.div>



        {/* 快速开始按钮 */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              try {
                const { buildDrawingPrompts } = require('@/lib/prompt-builder');
                const prompts = buildDrawingPrompts(designInput);
                const currentPrompt = language === 'zh' ? prompts.zh : prompts.en;
                setPrompt(currentPrompt);
                toast({
                  title: '默认提示词已生成',
                  description: `基于当前参数生成的${language === 'zh' ? '中文' : '英文'}提示词已填入输入框`,
                });
              } catch (error) {
                console.error('生成默认提示词失败:', error);
                toast({
                  variant: 'destructive',
                  title: '生成失败',
                  description: '无法生成默认提示词，请检查参数设置',
                });
              }
            }}
            className="luxury-button-hover px-8 py-3 text-lg font-medium group"
          >
            <Eye className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            生成基于参数的默认提示词
          </Button>
        </motion.div>
      </motion.div>
    </div>
  ), [isSidebarOpen, designInput, t, language, setPrompt, toast]);

  return (
    <ErrorBoundary>
      <div className="flex min-h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-background/95 to-muted/20">
        {/* 键盘快捷键处理 */}
        <KeyboardShortcuts
          onToggleSidebar={handleToggleSidebar}
          onClearHistory={clearHistory}
          onFocusPrompt={handleFocusPrompt}
        />

      {/* 主内容区域 */}
      <div className={`flex flex-col transition-all duration-500 ease-in-out ${isSidebarOpen ? 'flex-1' : 'w-full'} relative`}>
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

        {/* 聊天历史区域 */}
        <div className="flex-grow overflow-y-auto overflow-x-visible min-h-0 px-4 md:px-6 py-4 space-y-6 hide-scrollbar relative z-10">
          {history.length === 0 ? WelcomeCanvas : renderHistory}
          <div ref={historyEndRef} />
        </div>
        
        {/* 底部输入栏 */}
        <div className="relative z-10 border-t bg-background/80 backdrop-blur-sm">
          {/* 状态栏 */}
          <div className="px-4 md:px-6 py-2 border-b border-border/50">
            <StatusIndicator />
          </div>

          <div className="p-4 md:p-6">
            <div className="flex items-end gap-3">
              <div className="flex-grow">
                <PromptBar
                  ref={promptInputRef}
                  prompt={prompt}
                  onPromptChange={setPrompt}
                  onGenerate={handleSendMessage}
                  isGenerating={isGenerating}
                  isImageMode={isImageMode}
                  onToggleImageMode={toggleImageMode}
                />
              </div>
          
            {/* 控制按钮组 */}
            <div className="flex items-center gap-2">
              {/* 侧边栏切换按钮 */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSidebarOpen(prev => !prev)}
                className="shrink-0 luxury-button-hover"
                title={isSidebarOpen ? "隐藏参数面板" : "显示参数面板"}
              >
                {isSidebarOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
          
              {history.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 luxury-button-hover" title={t('creativeWorkshopPage.clearSession.title')}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="luxury-card">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="luxury-text-gradient">{t('creativeWorkshopPage.clearSession.title')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('creativeWorkshopPage.clearSession.description')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('common.cancelButton')}</AlertDialogCancel>
                      <AlertDialogAction onClick={clearHistory} className="luxury-button">
                        {t('creativeWorkshopPage.clearSession.confirmButton')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* 右侧参数面板 - 优化动画性能 */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 384 }}
            exit={{ opacity: 0, width: 0 }}
            transition={{
              duration: 0.3, // 缩短动画时间
              ease: "easeInOut", // 使用标准缓动
              layout: { duration: 0.3 } // 添加布局动画控制
            }}
            className="border-l border-border/50 bg-background/95 backdrop-blur-sm overflow-hidden shadow-2xl will-change-transform"
            style={{
              transform: 'translateZ(0)', // 启用硬件加速
              backfaceVisibility: 'hidden' // 优化渲染
            }}
          >
            <div className="w-96 h-full relative">
              {/* 侧边栏背景装饰 */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/10 pointer-events-none" />
              <div className="relative z-10 h-full">
                <AdvancedCrystalDesignPanel onGenerateSuggestions={handleSidebarGenerate} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
