'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Diamond, Crown, Heart, Gem, Sparkles, Zap, Star, Sun } from 'lucide-react';

export default function LightEffectsTestPage() {
  const { theme, setTheme } = useLanguage();

  // AURA是唯一主题

  return (
    <div className="min-h-screen bg-background luxury-particles">
      <div className="container-center space-section max-w-6xl">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 luxury-text-gradient diamond-facet luxury-glow">
            奢侈品光效测试中心
          </h1>
          <p className="text-xl text-muted-foreground">
            测试所有奢侈品主题的光效、动画和视觉特效
          </p>
        </div>

        {/* AURA主题信息 */}
        <Card className="aura-card aura-shadow-medium mb-8 aura-sparkle">
          <CardHeader>
            <CardTitle className="aura-text-gradient flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AURA光效系统
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="inline-flex items-center gap-3 p-4 bg-primary/10 rounded-lg aura-glow">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full aura-pulse"></div>
                <div>
                  <p className="font-semibold aura-text-gradient">AURA主题已激活</p>
                  <p className="text-sm text-muted-foreground">深蓝紫背景 + 粉红强调色</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 光效展示区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* 钻石切面效果 */}
          <Card className="luxury-card diamond-facet luxury-shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Diamond className="h-5 w-5" />
                钻石切面效果
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg diamond-facet flex items-center justify-center">
                <Diamond className="h-12 w-12 text-primary luxury-glow" />
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                钻石光线折射和闪烁效果
              </p>
            </CardContent>
          </Card>

          {/* 金属反光效果 */}
          <Card className="luxury-card metal-reflection luxury-shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                金属反光效果
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-32 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg metal-reflection flex items-center justify-center">
                <Crown className="h-12 w-12 text-accent luxury-glow" />
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                金属表面反光扫描效果
              </p>
            </CardContent>
          </Card>

          {/* 珠宝闪烁效果 */}
          <Card className="luxury-card jewelry-sparkle luxury-shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                珠宝闪烁效果
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-32 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg jewelry-sparkle flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-secondary luxury-glow" />
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                珠宝表面闪烁光效
              </p>
            </CardContent>
          </Card>

          {/* 钻石折射效果 */}
          <Card className="luxury-card diamond-refraction luxury-shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gem className="h-5 w-5" />
                钻石折射效果
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg diamond-refraction flex items-center justify-center">
                <Gem className="h-12 w-12 text-primary luxury-glow" />
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                彩虹色钻石折射旋转效果
              </p>
            </CardContent>
          </Card>

          {/* 珠宝脉冲效果 */}
          <Card className="luxury-card jewelry-pulse luxury-shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                珠宝脉冲效果
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-32 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg flex items-center justify-center">
                <Heart className="h-12 w-12 text-accent jewelry-pulse luxury-glow" />
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                珠宝脉冲呼吸光晕效果
              </p>
            </CardContent>
          </Card>

          {/* 奢侈品光晕效果 */}
          <Card className="luxury-card luxury-glow luxury-shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                奢侈品光晕效果
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                <Sun className="h-12 w-12 text-primary luxury-glow luxury-breathe" />
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                光晕和呼吸效果组合
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 交互式光效测试 */}
        <Card className="luxury-card luxury-shadow-strong mb-8">
          <CardHeader>
            <CardTitle className="luxury-text-gradient">交互式光效测试</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 按钮光效测试 */}
            <div>
              <h3 className="font-semibold mb-4">按钮光效测试</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="luxury-button metal-reflection">
                  金属反光按钮
                </Button>
                <Button className="luxury-button jewelry-sparkle">
                  珠宝闪烁按钮
                </Button>
                <Button className="luxury-button jewelry-pulse luxury-glow">
                  脉冲光晕按钮
                </Button>
              </div>
            </div>

            {/* 输入框光效测试 */}
            <div>
              <h3 className="font-semibold mb-4">输入框光效测试</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder="奢侈品输入框" 
                  className="luxury-input diamond-facet"
                />
                <Input 
                  placeholder="光晕输入框" 
                  className="luxury-input luxury-glow"
                />
              </div>
            </div>

            {/* 文字光效测试 */}
            <div>
              <h3 className="font-semibold mb-4">文字光效测试</h3>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold luxury-text-gradient">
                  奢侈品渐变文字效果
                </h2>
                <h2 className="text-3xl font-bold luxury-text-gradient luxury-glow">
                  带光晕的渐变文字
                </h2>
                <h2 className="text-3xl font-bold luxury-typewriter">
                  打字机效果文字
                </h2>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 加载动画测试 */}
        <Card className="luxury-card luxury-shadow-medium">
          <CardHeader>
            <CardTitle className="luxury-text-gradient">加载动画测试</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="luxury-loading mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">奢侈品加载动画</p>
              </div>
              
              <div>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full luxury-shimmer flex items-center justify-center">
                  <Star className="h-8 w-8 text-primary-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">闪光效果</p>
              </div>
              
              <div>
                <div className="w-16 h-16 mx-auto mb-4 bg-accent rounded-full luxury-breathe flex items-center justify-center">
                  <Diamond className="h-8 w-8 text-accent-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">呼吸效果</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 当前主题信息 */}
        <div className="text-center mt-12">
          <Badge className="aura-border aura-pulse aura-glow text-lg px-4 py-2">
            当前主题: AURA
          </Badge>
        </div>
      </div>
    </div>
  );
}
