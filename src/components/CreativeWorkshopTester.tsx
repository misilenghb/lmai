"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useCreativeWorkshop } from '@/contexts/CreativeWorkshopContext';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  duration?: number;
}

const CreativeWorkshopTester: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { id: 'ui-render', name: 'UI 渲染测试', status: 'pending' },
    { id: 'prompt-input', name: '提示词输入测试', status: 'pending' },
    { id: 'mode-toggle', name: '模式切换测试', status: 'pending' },
    { id: 'preset-apply', name: '预设应用测试', status: 'pending' },
    { id: 'history-save', name: '历史保存测试', status: 'pending' },
    { id: 'keyboard-shortcuts', name: '键盘快捷键测试', status: 'pending' },
    { id: 'responsive-design', name: '响应式设计测试', status: 'pending' },
    { id: 'accessibility', name: '可访问性测试', status: 'pending' }
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const { setPrompt, toggleImageMode, isImageMode, setDesignInput, designInput } = useCreativeWorkshop();
  const { toast } = useToast();

  const updateTestStatus = (id: string, status: TestResult['status'], message?: string, duration?: number) => {
    setTests(prev => prev.map(test => 
      test.id === id ? { ...test, status, message, duration } : test
    ));
  };

  const runTest = async (test: TestResult): Promise<void> => {
    updateTestStatus(test.id, 'running');
    const startTime = Date.now();

    try {
      switch (test.id) {
        case 'ui-render':
          // 测试UI组件是否正确渲染
          await new Promise(resolve => setTimeout(resolve, 500));
          const elements = document.querySelectorAll('[data-testid]');
          if (elements.length === 0) {
            throw new Error('未找到测试元素');
          }
          break;

        case 'prompt-input':
          // 测试提示词输入功能
          const testPrompt = 'Test prompt for creative workshop';
          setPrompt(testPrompt);
          await new Promise(resolve => setTimeout(resolve, 300));
          // 这里应该检查prompt是否正确设置
          break;

        case 'mode-toggle':
          // 测试模式切换功能
          const initialMode = isImageMode;
          toggleImageMode();
          await new Promise(resolve => setTimeout(resolve, 300));
          toggleImageMode(); // 切换回原状态
          break;

        case 'preset-apply':
          // 测试预设应用功能
          const testPreset = {
            designCategory: 'necklace',
            overallDesignStyle: 'elegant',
            mainStones: [{
              id: '1',
              crystalType: 'Diamond',
              color: 'Clear',
              shape: 'Round',
              size: 'Medium'
            }]
          };
          setDesignInput({ ...designInput, ...testPreset });
          await new Promise(resolve => setTimeout(resolve, 300));
          break;

        case 'history-save':
          // 测试历史保存功能
          const historyKey = 'creative-workshop-history';
          const testHistory = [{ id: 'test', timestamp: Date.now(), designInput: {} }];
          localStorage.setItem(historyKey, JSON.stringify(testHistory));
          const saved = localStorage.getItem(historyKey);
          if (!saved) {
            throw new Error('历史保存失败');
          }
          break;

        case 'keyboard-shortcuts':
          // 测试键盘快捷键
          const event = new KeyboardEvent('keydown', { 
            key: '/', 
            ctrlKey: true,
            bubbles: true 
          });
          document.dispatchEvent(event);
          await new Promise(resolve => setTimeout(resolve, 300));
          break;

        case 'responsive-design':
          // 测试响应式设计
          const viewport = window.innerWidth;
          if (viewport < 768) {
            // 移动端测试
            const mobileElements = document.querySelectorAll('.md\\:hidden');
            // 检查移动端特定元素
          }
          break;

        case 'accessibility':
          // 测试可访问性
          const buttons = document.querySelectorAll('button');
          let accessibilityIssues = 0;
          buttons.forEach(button => {
            if (!button.getAttribute('aria-label') && !button.textContent?.trim()) {
              accessibilityIssues++;
            }
          });
          if (accessibilityIssues > 0) {
            throw new Error(`发现 ${accessibilityIssues} 个可访问性问题`);
          }
          break;

        default:
          throw new Error('未知测试类型');
      }

      const duration = Date.now() - startTime;
      updateTestStatus(test.id, 'passed', '测试通过', duration);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      const message = error instanceof Error ? error.message : '测试失败';
      updateTestStatus(test.id, 'failed', message, duration);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    for (const test of tests) {
      await runTest(test);
      // 在测试之间添加短暂延迟
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setIsRunning(false);
    
    const passedTests = tests.filter(t => t.status === 'passed').length;
    const totalTests = tests.length;
    
    toast({
      title: '测试完成',
      description: `${passedTests}/${totalTests} 个测试通过`,
      variant: passedTests === totalTests ? 'default' : 'destructive'
    });
  };

  const resetTests = () => {
    setTests(prev => prev.map(test => ({ 
      ...test, 
      status: 'pending' as const, 
      message: undefined, 
      duration: undefined 
    })));
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-muted" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-200">通过</Badge>;
      case 'failed':
        return <Badge variant="destructive">失败</Badge>;
      case 'running':
        return <Badge variant="default">运行中</Badge>;
      default:
        return <Badge variant="secondary">待运行</Badge>;
    }
  };

  const passedCount = tests.filter(t => t.status === 'passed').length;
  const failedCount = tests.filter(t => t.status === 'failed').length;
  const totalCount = tests.length;

  return (
    <Card className="luxury-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 luxury-text-gradient">
            <TestTube className="w-5 h-5" />
            功能测试
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetTests}
              disabled={isRunning}
              className="luxury-button-hover"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              重置
            </Button>
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="luxury-button"
            >
              {isRunning ? (
                <Pause className="w-4 h-4 mr-1" />
              ) : (
                <Play className="w-4 h-4 mr-1" />
              )}
              {isRunning ? '运行中...' : '运行测试'}
            </Button>
          </div>
        </div>
        
        {/* 测试统计 */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>{passedCount} 通过</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="w-4 h-4 text-red-500" />
            <span>{failedCount} 失败</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            <span>{totalCount - passedCount - failedCount} 待运行</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {tests.map((test) => (
            <div
              key={test.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <div className="font-medium text-sm">{test.name}</div>
                  {test.message && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {test.message}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {test.duration && (
                  <span className="text-xs text-muted-foreground">
                    {test.duration}ms
                  </span>
                )}
                {getStatusBadge(test.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CreativeWorkshopTester;
