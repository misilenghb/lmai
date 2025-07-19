"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Gem, Search, Filter, Heart, Eye, Zap, 
  ArrowLeft, BookOpen, Sparkles, Target,
  Sun, Moon, Wind, Droplets, Mountain, Flame
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { crystalTypeMapping } from '@/lib/crystal-options';
import { getCrystalIcon } from '@/lib/crystal-icons';
import { useRouter } from 'next/navigation';

// 脉轮图标映射
const CHAKRA_ICONS = {
  'chakra_root': { icon: Mountain, color: 'text-destructive', nameKey: 'root' },
  'chakra_sacral': { icon: Droplets, color: 'text-orange-500', nameKey: 'sacral' },
  'chakra_solarPlexus': { icon: Sun, color: 'text-yellow-500', nameKey: 'solarPlexus' },
  'chakra_heart': { icon: Heart, color: 'text-green-500', nameKey: 'heart' },
  'chakra_throat': { icon: Wind, color: 'text-blue-500', nameKey: 'throat' },
  'chakra_thirdEye': { icon: Eye, color: 'text-indigo-500', nameKey: 'thirdEye' },
  'chakra_crown': { icon: Sparkles, color: 'text-primary', nameKey: 'crown' }
};

// 元素图标映射
const ELEMENT_ICONS = {
  'element_fire': { icon: Flame, color: 'text-destructive', nameKey: 'fire' },
  'element_water': { icon: Droplets, color: 'text-blue-500', nameKey: 'water' },
  'element_air': { icon: Wind, color: 'text-muted-foreground', nameKey: 'air' },
  'element_earth': { icon: Mountain, color: 'text-green-500', nameKey: 'earth' },
  'element_ether': { icon: Sparkles, color: 'text-primary', nameKey: 'ether' }
};

// 移除本地图标配置，使用统一的图标系统

export default function CrystalDatabasePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  // 状态管理
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChakra, setSelectedChakra] = useState<string>('');
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [selectedCrystal, setSelectedCrystal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // 转换水晶数据
  const crystalList = useMemo(() => {
    return Object.entries(crystalTypeMapping).map(([key, data]) => {
      const iconData = getCrystalIcon(key);
      return {
        id: key,
        name: data.displayName.split(' (')[0], // 中文名
        englishName: data.englishName,
        fullName: data.displayName,
        icon: iconData.symbol,
        iconColor: iconData.color,
        iconBgColor: iconData.bgColor,
        colors: data.availableColors || [],
        healingProperties: data.healingProperties || [],
        chakras: data.chakra || [],
        elements: data.element || [],
        zodiac: data.zodiac || []
      };
    });
  }, []);

  // 筛选逻辑
  const filteredCrystals = useMemo(() => {
    return crystalList.filter(crystal => {
      const matchesSearch = crystal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           crystal.englishName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesChakra = !selectedChakra || crystal.chakras.includes(selectedChakra);
      const matchesElement = !selectedElement || crystal.elements.includes(selectedElement);
      
      return matchesSearch && matchesChakra && matchesElement;
    });
  }, [crystalList, searchTerm, selectedChakra, selectedElement]);

  // 按类别分组
  const crystalsByCategory = useMemo(() => {
    const categories = {
      popular: crystalList.filter(c => ['Amethyst', 'RoseQuartz', 'ClearQuartz', 'Citrine', 'BlackTourmaline', 'Carnelian'].includes(c.id)),
      protection: crystalList.filter(c => c.healingProperties.some(prop => prop.includes('protection') || prop.includes('shield'))),
      healing: crystalList.filter(c => c.healingProperties.some(prop => prop.includes('healing') || prop.includes('soothing'))),
      manifestation: crystalList.filter(c => c.healingProperties.some(prop => prop.includes('abundance') || prop.includes('manifestation')))
    };
    return categories;
  }, [crystalList]);

  const selectedCrystalData = selectedCrystal ? crystalList.find(c => c.id === selectedCrystal) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-primary/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('common.back')}
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold heading-enhanced mb-3 flex items-center justify-center gap-3">
              <Gem className="h-8 w-8 text-primary" />
              {t('crystalDatabasePage.title')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('crystalDatabasePage.subtitle', { count: crystalList.length })}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：筛选和搜索 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 搜索框 */}
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  {t('crystalDatabasePage.searchCrystals')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder={t('crystalDatabasePage.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-4"
                />
                <div className="text-sm text-muted-foreground">
                  {t('crystalDatabasePage.foundCrystals', { count: filteredCrystals.length })}
                </div>
              </CardContent>
            </Card>

            {/* 脉轮筛选 */}
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-secondary" />
                  {t('crystalDatabasePage.filterByChakra')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={selectedChakra === '' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedChakra('')}
                    className="w-full justify-start"
                  >
                    {t('crystalDatabasePage.allChakras')}
                  </Button>
                  {Object.entries(CHAKRA_ICONS).map(([key, { icon: Icon, color, nameKey }]) => (
                    <Button
                      key={key}
                      variant={selectedChakra === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedChakra(key)}
                      className="w-full justify-start"
                    >
                      <Icon className={`h-4 w-4 mr-2 ${color}`} />
                      {t(`crystalDatabasePage.chakras.${nameKey}`)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 元素筛选 */}
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  {t('crystalDatabasePage.filterByElement')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={selectedElement === '' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedElement('')}
                    className="w-full justify-start"
                  >
                    {t('crystalDatabasePage.allElements')}
                  </Button>
                  {Object.entries(ELEMENT_ICONS).map(([key, { icon: Icon, color, nameKey }]) => (
                    <Button
                      key={key}
                      variant={selectedElement === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedElement(key)}
                      className="w-full justify-start"
                    >
                      <Icon className={`h-4 w-4 mr-2 ${color}`} />
                      {t(`crystalDatabasePage.elements.${nameKey}`)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：水晶展示 */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-muted/20 to-muted/30">
                <TabsTrigger value="all">{t('crystalDatabasePage.tabs.all')}</TabsTrigger>
                <TabsTrigger value="popular">{t('crystalDatabasePage.tabs.popular')}</TabsTrigger>
                <TabsTrigger value="protection">{t('crystalDatabasePage.tabs.protection')}</TabsTrigger>
                <TabsTrigger value="healing">{t('crystalDatabasePage.tabs.healing')}</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <Card className="quantum-card">
                  <CardHeader>
                    <CardTitle>{t('crystalDatabasePage.allCrystalsTitle', { count: filteredCrystals.length })}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px]">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredCrystals.map((crystal) => (
                          <div
                            key={crystal.id}
                            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                              selectedCrystal === crystal.id
                                ? 'border-primary bg-primary/5'
                                : 'border-muted hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedCrystal(crystal.id)}
                          >
                            <div className="text-center">
                              <div className={`text-3xl mb-2 ${crystal.iconColor || 'text-primary'}`}>{crystal.icon}</div>
                              <h4 className="font-medium text-sm mb-1">{crystal.name}</h4>
                              <p className="text-xs text-muted-foreground mb-2">{crystal.englishName}</p>
                              <div className="flex flex-wrap gap-1 justify-center">
                                {crystal.chakras.slice(0, 2).map((chakra) => {
                                  const chakraInfo = CHAKRA_ICONS[chakra as keyof typeof CHAKRA_ICONS];
                                  return chakraInfo ? (
                                    <Badge key={chakra} variant="secondary" className="text-xs">
                                      {t(`crystalDatabasePage.chakras.${chakraInfo.nameKey}`)}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 其他标签页内容类似... */}
              {Object.entries(crystalsByCategory).map(([category, crystals]) => (
                <TabsContent key={category} value={category} className="space-y-6">
                  <Card className="quantum-card">
                    <CardHeader>
                      <CardTitle>
                        {t(`crystalDatabasePage.categories.${category}`, { count: crystals.length })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {crystals.map((crystal) => (
                          <div
                            key={crystal.id}
                            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                              selectedCrystal === crystal.id
                                ? 'border-primary bg-primary/5'
                                : 'border-muted hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedCrystal(crystal.id)}
                          >
                            <div className="text-center">
                              <div className={`text-3xl mb-2 ${crystal.iconColor || 'text-primary'}`}>{crystal.icon}</div>
                              <h4 className="font-medium text-sm mb-1">{crystal.name}</h4>
                              <p className="text-xs text-muted-foreground mb-2">{crystal.englishName}</p>
                              <div className="flex flex-wrap gap-1 justify-center">
                                {crystal.chakras.slice(0, 2).map((chakra) => {
                                  const chakraInfo = CHAKRA_ICONS[chakra as keyof typeof CHAKRA_ICONS];
                                  return chakraInfo ? (
                                    <Badge key={chakra} variant="secondary" className="text-xs">
                                      {t(`crystalDatabasePage.chakras.${chakraInfo.nameKey}`)}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            {/* 水晶详情 */}
            {selectedCrystalData && (
              <Card className="quantum-card energy-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className={`text-3xl ${selectedCrystalData.iconColor || 'text-primary'}`}>{selectedCrystalData.icon}</span>
                    <div>
                      <h3 className="text-xl">{selectedCrystalData.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedCrystalData.englishName}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-primary" />
                        {t('crystalDatabasePage.crystalDetails.correspondingChakras')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCrystalData.chakras.map((chakra) => {
                          const chakraInfo = CHAKRA_ICONS[chakra as keyof typeof CHAKRA_ICONS];
                          return chakraInfo ? (
                            <Badge key={chakra} variant="outline" className="flex items-center gap-1">
                              <chakraInfo.icon className={`h-3 w-3 ${chakraInfo.color}`} />
                              {t(`crystalDatabasePage.chakras.${chakraInfo.nameKey}`)}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-secondary" />
                        {t('crystalDatabasePage.crystalDetails.correspondingElements')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCrystalData.elements.map((element) => {
                          const elementInfo = ELEMENT_ICONS[element as keyof typeof ELEMENT_ICONS];
                          return elementInfo ? (
                            <Badge key={element} variant="outline" className="flex items-center gap-1">
                              <elementInfo.icon className={`h-3 w-3 ${elementInfo.color}`} />
                              {t(`crystalDatabasePage.elements.${elementInfo.nameKey}`)}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-accent" />
                      {t('crystalDatabasePage.crystalDetails.availableColors')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCrystalData.colors.map((color, index) => (
                        <Badge key={index} variant="secondary">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-warning" />
                      {t('crystalDatabasePage.crystalDetails.healingProperties')}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedCrystalData.healingProperties.map((property, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {property.replace('prop_', '').replace(/_/g, ' ')}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
