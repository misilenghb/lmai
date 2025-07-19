'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Diamond, Crown, Heart, Gem, Sparkles } from 'lucide-react';

export default function ColorTestPage() {
  const { theme, setTheme } = useLanguage();

  const themes = [
    { value: 'diamond-platinum', label: '钻石白金', icon: <Diamond className="h-4 w-4" /> },
    { value: 'black-gold', label: '黑金经典', icon: <Crown className="h-4 w-4" /> },
    { value: 'rose-gold', label: '玫瑰金', icon: <Heart className="h-4 w-4" /> },
    { value: 'emerald', label: '祖母绿', icon: <Gem className="h-4 w-4" /> },
    { value: 'sapphire', label: '蓝宝石', icon: <Sparkles className="h-4 w-4" /> },
  ];

  const colorVariables = [
    { name: 'background', label: '背景色' },
    { name: 'foreground', label: '前景色' },
    { name: 'primary', label: '主色调' },
    { name: 'primary-foreground', label: '主色调前景' },
    { name: 'secondary', label: '次要色调' },
    { name: 'secondary-foreground', label: '次要色调前景' },
    { name: 'accent', label: '强调色调' },
    { name: 'accent-foreground', label: '强调色调前景' },
    { name: 'muted', label: '静音色' },
    { name: 'muted-foreground', label: '静音色前景' },
    { name: 'border', label: '边框色' },
    { name: 'input', label: '输入框色' },
    { name: 'ring', label: '焦点环色' },
  ];

  const functionalColors = [
    { name: 'success', label: '成功色' },
    { name: 'success-foreground', label: '成功色前景' },
    { name: 'warning', label: '警告色' },
    { name: 'warning-foreground', label: '警告色前景' },
    { name: 'destructive', label: '危险色' },
    { name: 'destructive-foreground', label: '危险色前景' },
    { name: 'info', label: '信息色' },
    { name: 'info-foreground', label: '信息色前景' },
  ];

  const luxuryColors = [
    { name: 'luxury-gold', label: '奢华金' },
    { name: 'luxury-silver', label: '奢华银' },
    { name: 'luxury-platinum', label: '奢华铂金' },
    { name: 'luxury-diamond', label: '钻石色' },
    { name: 'luxury-shadow', label: '奢华阴影' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container-center space-section max-w-6xl">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 luxury-text-gradient">
            颜色系统验证工具
          </h1>
          <p className="text-lg text-muted-foreground">
            验证所有奢侈品主题的颜色变量和对比度
          </p>
        </div>

        {/* 主题切换 */}
        <Card className="luxury-card mb-8">
          <CardHeader>
            <CardTitle>主题切换</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {themes.map((themeOption) => (
                <Button
                  key={themeOption.value}
                  variant={theme === themeOption.value ? "default" : "outline"}
                  onClick={() => setTheme(themeOption.value as any)}
                  className="flex items-center gap-2"
                >
                  {themeOption.icon}
                  {themeOption.label}
                </Button>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Badge>当前主题: {themes.find(t => t.value === theme)?.label}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* 基础颜色变量 */}
        <Card className="luxury-card mb-8">
          <CardHeader>
            <CardTitle>基础颜色变量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {colorVariables.map((color) => (
                <div key={color.name} className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: `hsl(var(--${color.name}))` }}
                  />
                  <div>
                    <div className="font-medium">{color.label}</div>
                    <div className="text-xs text-muted-foreground">--{color.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 功能性颜色 */}
        <Card className="luxury-card mb-8">
          <CardHeader>
            <CardTitle>功能性颜色</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {functionalColors.map((color) => (
                <div key={color.name} className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: `hsl(var(--${color.name}))` }}
                  />
                  <div>
                    <div className="font-medium">{color.label}</div>
                    <div className="text-xs text-muted-foreground">--{color.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 奢侈品特效颜色 */}
        <Card className="luxury-card mb-8">
          <CardHeader>
            <CardTitle>奢侈品特效颜色</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {luxuryColors.map((color) => (
                <div key={color.name} className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: `hsl(var(--${color.name}))` }}
                  />
                  <div>
                    <div className="font-medium">{color.label}</div>
                    <div className="text-xs text-muted-foreground">--{color.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 颜色对比度测试 */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle>颜色对比度测试</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">文字对比度测试</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-primary text-primary-foreground rounded">
                    主色调文字对比度测试
                  </div>
                  <div className="p-3 bg-secondary text-secondary-foreground rounded">
                    次要色调文字对比度测试
                  </div>
                  <div className="p-3 bg-accent text-accent-foreground rounded">
                    强调色调文字对比度测试
                  </div>
                  <div className="p-3 bg-muted text-muted-foreground rounded">
                    静音色文字对比度测试
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">功能色对比度测试</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-success text-success-foreground rounded">
                    成功状态文字对比度测试
                  </div>
                  <div className="p-3 bg-warning text-warning-foreground rounded">
                    警告状态文字对比度测试
                  </div>
                  <div className="p-3 bg-destructive text-destructive-foreground rounded">
                    危险状态文字对比度测试
                  </div>
                  <div className="p-3 bg-info text-info-foreground rounded">
                    信息状态文字对比度测试
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
