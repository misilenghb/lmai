'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Diamond, Crown, Heart, Gem, Sparkles } from 'lucide-react';

export default function LuxuryTestPage() {
  const { theme, setTheme } = useLanguage();

  const themes = [
    { value: 'diamond-platinum', label: '钻石白金', icon: <Diamond className="h-4 w-4" /> },
    { value: 'black-gold', label: '黑金经典', icon: <Crown className="h-4 w-4" /> },
    { value: 'rose-gold', label: '玫瑰金', icon: <Heart className="h-4 w-4" /> },
    { value: 'emerald', label: '祖母绿', icon: <Gem className="h-4 w-4" /> },
    { value: 'sapphire', label: '蓝宝石', icon: <Sparkles className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background luxury-particles">
      <div className="container-center space-section max-w-4xl">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 luxury-text-gradient diamond-facet">
            奢侈品主题测试
          </h1>
          <p className="text-lg text-muted-foreground">
            测试所有奢侈品主题的视觉效果和交互体验
          </p>
        </div>

        {/* 主题切换 */}
        <Card className="luxury-card luxury-shadow-medium mb-8">
          <CardHeader>
            <CardTitle className="luxury-text-gradient">主题切换测试</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {themes.map((themeOption) => (
                <Button
                  key={themeOption.value}
                  variant={theme === themeOption.value ? "default" : "outline"}
                  onClick={() => setTheme(themeOption.value as any)}
                  className={`luxury-button silk-hover jewelry-sparkle ${
                    theme === themeOption.value ? 'jewelry-pulse' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {themeOption.icon}
                    {themeOption.label}
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* UI组件测试 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 卡片效果测试 */}
          <Card className="luxury-card silk-hover diamond-refraction">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Diamond className="h-5 w-5" />
                毛玻璃卡片
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                这是一个具有毛玻璃效果的奢侈品风格卡片，具有钻石折射动画效果。
              </p>
              <Badge className="luxury-border">奢侈品徽章</Badge>
            </CardContent>
          </Card>

          {/* 按钮效果测试 */}
          <Card className="luxury-card silk-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                金属质感按钮
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="luxury-button w-full metal-reflection">
                金属反光按钮
              </Button>
              <Button className="luxury-button w-full jewelry-sparkle">
                珠宝闪烁按钮
              </Button>
              <Button className="luxury-button w-full jewelry-pulse">
                珠宝脉冲按钮
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 输入框测试 */}
        <Card className="luxury-card luxury-shadow-strong mb-8">
          <CardHeader>
            <CardTitle className="luxury-text-gradient">奢侈品输入组件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder="奢侈品风格输入框" 
              className="luxury-input"
            />
            <Input 
              placeholder="带钻石切面效果的输入框" 
              className="luxury-input diamond-facet"
            />
          </CardContent>
        </Card>

        {/* 动画效果展示 */}
        <Card className="luxury-card luxury-shadow-medium">
          <CardHeader>
            <CardTitle className="luxury-text-gradient">动画效果展示</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full luxury-loading"></div>
                <p className="text-sm text-muted-foreground">奢侈品加载动画</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full diamond-facet"></div>
                <p className="text-sm text-muted-foreground">钻石切面效果</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent rounded-full metal-reflection"></div>
                <p className="text-sm text-muted-foreground">金属反光效果</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 文字效果测试 */}
        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold luxury-text-gradient mb-4 luxury-typewriter">
            奢侈品文字效果
          </h2>
          <p className="text-lg text-muted-foreground">
            当前主题: <Badge className="luxury-border jewelry-pulse">
              {themes.find(t => t.value === theme)?.label}
            </Badge>
          </p>
        </div>
      </div>
    </div>
  );
}
