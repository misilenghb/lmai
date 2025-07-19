"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LuxuryIcons, LuxuryIconGuide } from '@/components/icons/LuxuryIconSystem';
import { generateLuxuryIconClasses, luxurySizeMap, luxuryIconGuidelines } from '@/lib/luxury-icon-migration';

const LuxuryIconsShowcase = () => {
  const [selectedSize, setSelectedSize] = useState<keyof typeof luxurySizeMap>('md');
  const [selectedVariant, setSelectedVariant] = useState<'default' | 'nav' | 'button' | 'interactive'>('default');

  const iconCategories = {
    core: {
      title: '核心功能图标',
      description: '基于奢侈品网站的核心功能图标',
      icons: ['Search', 'User', 'Menu', 'Settings'] as const
    },
    crystal: {
      title: '水晶系统图标',
      description: '专为水晶日历系统设计的图标',
      icons: ['Crystal', 'Energy', 'Meditation'] as const
    },
    navigation: {
      title: '导航和洞察图标',
      description: '用于导航和功能指导的图标',
      icons: ['Calendar', 'Insight', 'Guidance'] as const
    },
    status: {
      title: '状态指示图标',
      description: '用于状态反馈的图标',
      icons: ['Success', 'Warning'] as const
    }
  };

  const sizeOptions = [
    { key: 'sm' as const, label: '小 (16px)', description: '内联文本使用' },
    { key: 'md' as const, label: '中 (20px)', description: '标准按钮和导航' },
    { key: 'lg' as const, label: '大 (24px)', description: '重要功能' },
    { key: 'xl' as const, label: '超大 (32px)', description: '主要操作' }
  ];

  const variantOptions = [
    { key: 'default' as const, label: '默认', description: '标准样式' },
    { key: 'nav' as const, label: '导航', description: '导航菜单使用' },
    { key: 'button' as const, label: '按钮', description: '按钮内图标' },
    { key: 'interactive' as const, label: '交互', description: '可交互元素' }
  ];

  return (
    <div className="container-center space-section">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold heading-enhanced mb-4">
            🏆 奢侈品级图标系统
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            基于 Hermès、Chanel、Louis Vuitton 等世界顶级奢侈品网站设计规律优化的图标系统
          </p>
        </div>

        <Tabs defaultValue="showcase" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="showcase">图标展示</TabsTrigger>
            <TabsTrigger value="guidelines">设计规范</TabsTrigger>
            <TabsTrigger value="comparison">对比分析</TabsTrigger>
            <TabsTrigger value="usage">使用指南</TabsTrigger>
          </TabsList>

          {/* 图标展示 */}
          <TabsContent value="showcase" className="space-y-6">
            {/* 控制面板 */}
            <Card>
              <CardHeader>
                <CardTitle>图标配置</CardTitle>
                <CardDescription>调整图标的尺寸和样式变体</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">尺寸</label>
                    <div className="grid grid-cols-2 gap-2">
                      {sizeOptions.map(option => (
                        <Button
                          key={option.key}
                          variant={selectedSize === option.key ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedSize(option.key)}
                          className="text-xs"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">样式变体</label>
                    <div className="grid grid-cols-2 gap-2">
                      {variantOptions.map(option => (
                        <Button
                          key={option.key}
                          variant={selectedVariant === option.key ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedVariant(option.key)}
                          className="text-xs"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 图标分类展示 */}
            {Object.entries(iconCategories).map(([categoryKey, category]) => (
              <Card key={categoryKey}>
                <CardHeader>
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {category.icons.map(iconName => {
                      const IconComponent = LuxuryIcons[iconName];
                      return (
                        <div key={iconName} className="flex flex-col items-center p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                          <div className="mb-3 p-3 rounded-lg bg-background border">
                            <IconComponent
                              size={luxurySizeMap[selectedSize]}
                              className={generateLuxuryIconClasses({
                                size: selectedSize,
                                variant: selectedVariant
                              })}
                            />
                          </div>
                          <span className="text-sm font-medium text-center">{iconName}</span>
                          <Badge variant="outline" className="text-xs mt-1">
                            {luxurySizeMap[selectedSize]}px
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* 设计规范 */}
          <TabsContent value="guidelines" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>奢侈品设计原则</CardTitle>
                <CardDescription>基于世界顶级奢侈品网站的设计规律</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(luxuryIconGuidelines.principles).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium capitalize mb-1">{key.replace(/([A-Z])/g, ' $1')}</h4>
                      <p className="text-sm text-muted-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>颜色使用规范</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(luxuryIconGuidelines.colors).map(([state, className]) => (
                    <div key={state} className="flex items-center justify-between p-2 border rounded">
                      <span className="capitalize">{state}</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{className}</code>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>动画效果规范</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(luxuryIconGuidelines.animations).map(([type, className]) => (
                    <div key={type} className="flex items-center justify-between p-2 border rounded">
                      <span className="capitalize">{type}</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{className}</code>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 对比分析 */}
          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>优化前后对比</CardTitle>
                <CardDescription>展示图标系统优化带来的改进</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-destructive">优化前 (Lucide Icons)</h3>
                    <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                      <ul className="space-y-2 text-sm">
                        <li>• 图标风格不统一</li>
                        <li>• 缺乏奢侈品美感</li>
                        <li>• 尺寸规范不一致</li>
                        <li>• 交互效果简单</li>
                        <li>• 主题适配不完善</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-success">优化后 (Luxury Icons)</h3>
                    <div className="p-4 border border-success/20 rounded-lg bg-success/5">
                      <ul className="space-y-2 text-sm">
                        <li>• 统一的奢侈品美学</li>
                        <li>• 符合顶级品牌标准</li>
                        <li>• 标准化尺寸系统</li>
                        <li>• 精致的交互动画</li>
                        <li>• 完美的主题支持</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 使用指南 */}
          <TabsContent value="usage" className="space-y-6">
            <LuxuryIconGuide />
            
            <Card>
              <CardHeader>
                <CardTitle>代码示例</CardTitle>
                <CardDescription>如何在项目中使用奢侈品级图标</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">基本使用</h4>
                  <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
{`import { LuxuryIcons } from '@/components/icons/LuxuryIconSystem';

<LuxuryIcons.Search size={20} className="luxury-icon-nav" />`}
                  </pre>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">高级配置</h4>
                  <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
{`import { generateLuxuryIconClasses } from '@/lib/luxury-icon-migration';

<LuxuryIcons.Energy 
  size={24}
  className={generateLuxuryIconClasses({
    size: 'lg',
    variant: 'interactive',
    state: 'active'
  })}
/>`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LuxuryIconsShowcase;
