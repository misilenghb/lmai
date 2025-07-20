'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  Zap,
  Settings,
  Gem,
  Palette,
  Camera,
  ChevronDown,
  Plus,
  Minus,
  Layers,
  Brush,
  Globe,
  Grid3X3,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreativeWorkshop } from '@/contexts/CreativeWorkshopContext';
import { useIsMobile } from '@/hooks/use-mobile';
import type { DesignStateInput } from '@/types/design';
import {
  crystalPromptSystem,
  generateComplexScenePrompt,
  generateNegativePrompt
} from '@/data/crystalPromptSystem';
import AdvancedAIService, { AdvancedDesignParams } from '@/services/advancedAIService';

interface AdvancedCrystalDesignPanelProps {
  onGenerateSuggestions: (data: any) => void;
  onClose?: () => void; // 可选的关闭回调函数
}

// 提取艺术风格描述的辅助函数
const getStyleDescription = (style: any) => {
  // 优先使用描述字段
  if (style.description) {
    return style.description;
  }

  // 如果没有描述字段，根据技法和特点生成描述
  const techniques = style.techniques?.slice(0, 2).join('、') || '';
  const qualityTerms = style.qualityTerms?.slice(0, 2).join('、') || '';

  if (techniques && qualityTerms) {
    return `技法：${techniques}，特点：${qualityTerms}`;
  } else if (techniques) {
    return `技法：${techniques}`;
  } else if (qualityTerms) {
    return `特点：${qualityTerms}`;
  }

  return '经典艺术风格';
};

// 提取文化风格描述的辅助函数
const getCulturalStyleDescription = (style: any) => {
  // 优先使用描述字段
  if (style.description) {
    return style.description;
  }

  // 如果没有描述字段，根据特征和提示词生成描述
  const characteristics = style.characteristics?.slice(0, 2).join('、') || '';
  const promptTerms = style.promptTerms?.slice(0, 2).join('、') || '';

  if (characteristics && promptTerms) {
    return `特征：${characteristics}，风格：${promptTerms}`;
  } else if (characteristics) {
    return `特征：${characteristics}`;
  } else if (promptTerms) {
    return `风格：${promptTerms}`;
  }

  return '传统文化风格';
};

// 获取表现精度描述的辅助函数
const getRenderingLevelDescription = (level: string) => {
  const descriptions: { [key: string]: string } = {
    '超精细': '极致细节表现，每个细微纹理、光影变化都清晰可见，适合展示水晶的完美品质',
    '精细': '高细节度渲染，主要特征和质感清晰呈现，平衡细节与整体效果',
    '标准': '平衡的细节表现，突出水晶的主要特征，适合大多数设计需求',
    '简化': '突出主要特征，简化次要细节，强调水晶的整体造型和色彩',
    '极简': '最简化表现，突出核心元素和基本形态，适合现代简约风格'
  };

  return descriptions[level] || '标准细节表现';
};

const AdvancedCrystalDesignPanel: React.FC<AdvancedCrystalDesignPanelProps> = ({
  onGenerateSuggestions,
  onClose
}) => {
  const { designInput, setDesignInput } = useCreativeWorkshop();
  const isMobile = useIsMobile();
  const [customKeywords, setCustomKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // 高级参数状态
  const [artStyle, setArtStyle] = useState('realistic');
  const [qualityLevel, setQualityLevel] = useState('high quality');
  const [renderingLevel, setRenderingLevel] = useState('标准');
  const [crystalShape, setCrystalShape] = useState('round');
  const [transparency, setTransparency] = useState('transparent');

  const [crystalProcessing, setCrystalProcessing] = useState('beads');
  const [metalType, setMetalType] = useState('silver');
  const [culturalStyle, setCulturalStyle] = useState('chinese_traditional');
  const [composition, setComposition] = useState('golden_ratio');
  const [structuralAesthetics, setStructuralAesthetics] = useState('structural beauty display');
  const [overallLayout, setOverallLayout] = useState('bracelet arrangement');
  const [visualFocus, setVisualFocus] = useState('fully displayed');
  const [background, setBackground] = useState('pure white background');
  const [accessories, setAccessories] = useState<string[]>(['tassels']);
  const [accessoryQuantity, setAccessoryQuantity] = useState('multiple');
  const [accessoryArrangement, setAccessoryArrangement] = useState('coordinated composition');

  // 手串专用状态
  const [beadSize, setBeadSize] = useState('8mm');
  const [beadArrangement, setBeadArrangement] = useState('uniform_beads');
  const [metalSpacers, setMetalSpacers] = useState('silver');

  const updateDesignInput = useCallback((field: string, value: any) => {
    setDesignInput({
      ...designInput,
      [field]: value
    });
  }, [setDesignInput]);

  const addMainStone = useCallback(() => {
    const currentStones = designInput.mainStones || [];
    if (currentStones.length < 5) {
      updateDesignInput('mainStones', [
        ...currentStones,
        { crystalType: '', color: '', shape: 'round', size: 'medium' }
      ]);
    }
  }, [designInput.mainStones, updateDesignInput]);

  const removeMainStone = useCallback((index: number) => {
    const currentStones = designInput.mainStones || [];
    updateDesignInput('mainStones', currentStones.filter((_, i) => i !== index));
  }, [designInput.mainStones, updateDesignInput]);

  const updateMainStone = useCallback((index: number, field: string, value: string) => {
    const currentStones = [...(designInput.mainStones || [])];
    if (currentStones[index]) {
      currentStones[index] = { ...currentStones[index], [field]: value };
      updateDesignInput('mainStones', currentStones);
    }
  }, [designInput.mainStones, updateDesignInput]);

  // 生成复杂场景提示词
  const generatedPrompt = useMemo(() => {
    const keywords = customKeywords.split(',').map(k => k.trim()).filter(k => k);

    // 处理多个水晶的情况，使用每个水晶的独立参数
    const crystalConfigs = (designInput.mainStones || []).map(stone => ({
      crystalType: stone.crystalType,
      color: stone.color || 'natural',
      crystalShape: stone.crystalShape || crystalShape,
      size: stone.size || 'medium',
      transparency: stone.transparency || transparency,
      inclusion: stone.inclusion || 'none',
      inclusionColor: stone.inclusionColor || '',
      inclusionDistribution: stone.inclusionDistribution || '',
      crystalProcessing: stone.crystalProcessing || crystalProcessing
    }));

    // 为手串添加特殊关键词
    const beadedBraceletKeywords = designInput.designCategory === 'beaded_bracelet' ? [
      `${beadSize} crystal beads`,
      `${beadArrangement.replace('_', ' ')} pattern`,
      metalSpacers !== 'none' ? `${metalSpacers} metal spacers` : '',
      'circular bracelet arrangement',
      'round crystal beads',
      'elastic string design'
    ].filter(Boolean) : [];

    return generateComplexScenePrompt({
      artStyle,
      qualityLevel,
      renderingLevel,
      crystalConfigs, // 传递所有水晶配置
      metalType,
      culturalStyle,
      composition,
      structuralAesthetics,
      overallLayout,
      visualFocus,
      jewelryType: designInput.designCategory,
      background,
      accessories,
      accessoryQuantity,
      accessoryArrangement,
      customKeywords: [...keywords, ...beadedBraceletKeywords]
    });
  }, [
    designInput,
    customKeywords,
    artStyle,
    qualityLevel,
    renderingLevel,
    crystalShape,
    transparency,
    crystalProcessing,
    metalType,
    culturalStyle,
    composition,
    structuralAesthetics,
    overallLayout,
    visualFocus,
    background,
    accessories,
    accessoryQuantity,
    accessoryArrangement,
    beadSize,
    beadArrangement,
    metalSpacers
  ]);



  const handleAdvancedGenerate = useCallback(async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // 准备高级设计参数
      const advancedParams: AdvancedDesignParams = {
        // 基础设计参数
        designCategory: designInput.designCategory || 'bracelet',
        mainStones: designInput.mainStones || [],

        // 高级艺术参数
        artStyle,
        qualityLevel,
        renderingLevel,

        // 水晶配置参数
        crystalShape,
        transparency,
        crystalProcessing,

        // 材质配件参数
        metalType,

        // 文化风格参数
        culturalStyle,

        // 构图美学参数
        composition,
        structuralAesthetics,
        overallLayout,
        visualFocus,

        // 场景配置参数
        background,
        accessories,
        accessoryQuantity,
        accessoryArrangement,

        // 珠子配置参数（新增）
        beadSize,
        beadArrangement,
        metalSpacers,

        // 自定义关键词
        customKeywords: customKeywords.split(',').map(k => k.trim()).filter(k => k),

        // 生成的提示词
        aiPrompt: generatedPrompt,
        negativePrompt: generateNegativePrompt()
      };

      console.log('🎨 开始高级AI设计生成...', {
        parameters: Object.keys(advancedParams).length,
        artStyle: advancedParams.artStyle,
        renderingLevel: advancedParams.renderingLevel,
        culturalStyle: advancedParams.culturalStyle,
        complexity: 'advanced',
        generatedPrompt: generatedPrompt.substring(0, 100) + '...'
      });

      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      // 调用高级AI服务
      const result = await AdvancedAIService.generateAdvancedDesign(advancedParams);

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (result.success && result.data) {
        // 转换为标准格式并传递给父组件
        const enhancedInput = {
          ...designInput,
          aiPrompt: generatedPrompt,
          negativePrompt: generateNegativePrompt(),
          advancedParams,
          advancedResults: result.data
        };

        onGenerateSuggestions(enhancedInput);

        console.log('✅ 高级AI设计生成成功:', {
          images: result.data.images.length,
          complexity: result.data.metadata.complexity_level,
          model: result.data.metadata.model_version
        });
      } else {
        throw new Error(result.error || '高级AI设计生成失败');
      }

    } catch (error) {
      console.error('❌ 高级AI设计生成错误:', error);

      // 显示错误信息（可选）
      // 这里可以添加 toast 通知或其他用户反馈

      // 降级到普通生成，确保用户仍能获得结果
      console.log('🔄 降级到普通生成模式...');

      const fallbackInput = {
        ...designInput,
        aiPrompt: generatedPrompt,
        negativePrompt: generateNegativePrompt(),
        advancedParams: {
          artStyle,
          qualityLevel,
          renderingLevel,
          crystalShape,
          transparency,
          crystalProcessing,
          metalType,
          culturalStyle,
          composition,
          structuralAesthetics,
          overallLayout,
          visualFocus,
          background,
          accessories,
          accessoryQuantity,
          accessoryArrangement,
          beadSize,
          beadArrangement,
          metalSpacers,
          customKeywords: customKeywords.split(',').map(k => k.trim()).filter(k => k)
        },
        fallbackMode: true // 标记为降级模式
      };
      onGenerateSuggestions(fallbackInput);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  }, [
    isGenerating,
    designInput,
    generatedPrompt,
    onGenerateSuggestions,
    artStyle,
    qualityLevel,
    renderingLevel,
    crystalShape,
    transparency,
    crystalProcessing,
    metalType,
    culturalStyle,
    composition,
    structuralAesthetics,
    overallLayout,
    visualFocus,
    background,
    accessories,
    accessoryQuantity,
    accessoryArrangement,
    customKeywords
  ]);



  return (
    <div className="h-full flex flex-col aura-panel-gradient">
      {/* 头部 */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-aura-pink/20 to-aura-purple/20 border border-aura-pink/30">
            <Sparkles className="w-5 h-5 text-aura-pink" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold luxury-text-gradient">高级水晶设计面板</h2>
            <p className="text-sm text-muted-foreground">专业级AI提示词生成</p>
          </div>
          {/* 移动端关闭按钮 */}
          {isMobile && onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>



        {/* 高级生成按钮 */}
        <Button
          onClick={handleAdvancedGenerate}
          disabled={isGenerating}
          className="w-full luxury-button luxury-button-hover group mb-3 relative overflow-hidden"
          size="lg"
        >
          {isGenerating ? (
            <>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                生成中... {generationProgress}%
              </div>
              {/* 进度条 */}
              <div
                className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              />
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              生成高级AI设计
              <Zap className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
            </>
          )}
        </Button>

        {/* 高级AI提示 */}
        {!isGenerating && (
          <div className="mb-3 p-2 bg-gradient-to-r from-aura-pink/10 to-aura-purple/10 rounded-lg border border-aura-pink/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-aura-pink animate-pulse" />
              <span>使用专业AI模型，支持25+参数复杂设计生成</span>
            </div>
          </div>
        )}


      </div>

      {/* 参数配置区域 */}
      <div className="flex-1 overflow-y-auto hide-scrollbar p-4">
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="text-xs">基础</TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">主体</TabsTrigger>
            <TabsTrigger value="style" className="text-xs">风格</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            {/* 基础设计 */}
            <Card className="luxury-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="w-4 h-4 text-aura-pink" />
                  基础设计
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">珠宝类型</label>
                  <select
                    value={designInput.designCategory || ''}
                    onChange={(e) => updateDesignInput('designCategory', e.target.value)}
                    className="w-full h-10 px-3 py-2 text-sm aura-select"
                  >
                    <option value="">选择珠宝类型</option>
                    {Object.entries(crystalPromptSystem.jewelryTypes).map(([key, jewelry]) => (
                      <option key={key} value={key}>{jewelry.chineseName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">艺术风格</label>
                  <select
                    value={artStyle}
                    onChange={(e) => setArtStyle(e.target.value)}
                    className="w-full h-10 px-3 py-2 text-sm aura-select"
                  >
                    {Object.entries(crystalPromptSystem.artStyles).map(([key, style]) => (
                      <option key={key} value={key} title={getStyleDescription(style)}>
                        {style.chineseName}
                      </option>
                    ))}
                  </select>
                  {/* 当前选择的风格说明 */}
                  {artStyle && crystalPromptSystem.artStyles[artStyle] && (
                    <div className="mt-2 p-2 bg-muted/20 rounded text-xs text-muted-foreground">
                      {getStyleDescription(crystalPromptSystem.artStyles[artStyle])}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">文化风格</label>
                  <select
                    value={culturalStyle}
                    onChange={(e) => setCulturalStyle(e.target.value)}
                    className="w-full h-10 px-3 py-2 text-sm aura-select"
                  >
                    {Object.entries(crystalPromptSystem.culturalStyles).map(([key, style]) => (
                      <option key={key} value={key} title={getCulturalStyleDescription(style)}>
                        {style.chineseName}
                      </option>
                    ))}
                  </select>
                  {/* 当前选择的文化风格说明 */}
                  {culturalStyle && crystalPromptSystem.culturalStyles[culturalStyle] && (
                    <div className="mt-2 p-2 bg-muted/20 rounded text-xs text-muted-foreground">
                      {getCulturalStyleDescription(crystalPromptSystem.culturalStyles[culturalStyle])}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">品质要求</label>
                  <select
                    value={qualityLevel}
                    onChange={(e) => setQualityLevel(e.target.value)}
                    className="w-full h-10 px-3 py-2 text-sm aura-select"
                  >
                    {crystalPromptSystem.qualityLevels.map((level, index) => (
                      <option key={index} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">表现精度</label>
                  <select
                    value={renderingLevel}
                    onChange={(e) => setRenderingLevel(e.target.value)}
                    className="w-full h-10 px-3 py-2 text-sm aura-select"
                  >
                    {crystalPromptSystem.renderingLevels.map((level, index) => (
                      <option key={index} value={level}>{level}</option>
                    ))}
                  </select>
                  {/* 表现精度说明 */}
                  <div className="mt-2 p-2 bg-muted/20 rounded text-xs text-muted-foreground">
                    {getRenderingLevelDescription(renderingLevel)}
                  </div>
                </div>
              </CardContent>
            </Card>




          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            {/* 水晶配置 */}
            <Card className="luxury-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Gem className="w-4 h-4 text-aura-purple" />
                    水晶配置
                  </CardTitle>
                  <Button
                    onClick={addMainStone}
                    size="sm"
                    variant="outline"
                    className="h-8 px-2"
                    disabled={(designInput.mainStones?.length || 0) >= 5}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {(designInput.mainStones || []).map((stone, index) => (
                  <div key={index} className="p-3 aura-crystal-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">水晶 {index + 1}</span>
                      <Button
                        onClick={() => removeMainStone(index)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <select
                        value={stone.crystalType || ''}
                        onChange={(e) => updateMainStone(index, 'crystalType', e.target.value)}
                        className="w-full h-8 px-2 py-1 text-xs aura-select"
                      >
                        <option value="">选择水晶类型</option>
                        {Object.entries(crystalPromptSystem.crystalTypes).map(([key, crystal]) => (
                          <option key={key} value={key}>{crystal.chineseName}</option>
                        ))}
                      </select>

                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={stone.color || ''}
                          onChange={(e) => updateMainStone(index, 'color', e.target.value)}
                          className="w-full h-8 px-2 py-1 text-xs aura-select"
                        >
                          <option value="">颜色</option>
                          {stone.crystalType && crystalPromptSystem.crystalTypes[stone.crystalType]?.colors.map((color, colorIndex) => (
                            <option key={colorIndex} value={color}>{color}</option>
                          ))}
                        </select>

                        <select
                          value={stone.crystalShape || ''}
                          onChange={(e) => updateMainStone(index, 'crystalShape', e.target.value)}
                          className="w-full h-8 px-2 py-1 text-xs aura-select"
                        >
                          <option value="">水晶形状</option>
                          {crystalPromptSystem.crystalShapes.map((shape: string, idx: number) => (
                            <option key={idx} value={shape}>{shape}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={stone.transparency || ''}
                          onChange={(e) => updateMainStone(index, 'transparency', e.target.value)}
                          className="w-full h-8 px-2 py-1 text-xs aura-select"
                        >
                          <option value="">透明度</option>
                          {crystalPromptSystem.transparencyLevels.map((level: string, idx: number) => (
                            <option key={idx} value={level}>{level}</option>
                          ))}
                        </select>

                        <select
                          value={stone.size || ''}
                          onChange={(e) => updateMainStone(index, 'size', e.target.value)}
                          className="w-full h-8 px-2 py-1 text-xs aura-select"
                        >
                          <option value="">大小</option>
                          <option value="small">小</option>
                          <option value="medium">中</option>
                          <option value="large">大</option>
                          <option value="extra_large">特大</option>
                        </select>
                      </div>

                      <select
                        value={stone.crystalProcessing || ''}
                        onChange={(e) => updateMainStone(index, 'crystalProcessing', e.target.value)}
                        className="w-full h-8 px-2 py-1 text-xs aura-select"
                      >
                        <option value="">加工方式</option>
                        <option value="beads">珠状</option>
                        <option value="faceted">刻面</option>
                        <option value="cabochon">凸圆形</option>
                        <option value="rough">原石</option>
                      </select>
                    </div>
                  </div>
                ))}

                {(!designInput.mainStones || designInput.mainStones.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Gem className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">点击上方 + 按钮添加水晶</p>
                  </div>
                )}
              </CardContent>
            </Card>


            {/* 金属配件 */}
            <Card className="luxury-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="w-4 h-4 text-amber-500" />
                  配件材质
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">金属类型</label>
                  <select
                    value={metalType}
                    onChange={(e) => setMetalType(e.target.value)}
                    className="w-full h-10 px-3 py-2 text-sm aura-select"
                  >
                    {Object.entries(crystalPromptSystem.metalTypes).map(([key, metal]) => (
                      <option key={key} value={key}>{metal.chineseName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">装饰元素</label>
                  <select
                    value={accessories.length > 0 ? accessories[0] : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        setAccessories([e.target.value]);
                      } else {
                        setAccessories([]);
                      }
                    }}
                    className="w-full h-10 px-3 py-2 text-sm aura-select"
                  >
                    <option value="">无装饰元素</option>
                    <option value="tassels">流苏 - 传统装饰元素</option>
                    <option value="beads">珠子 - 装饰性小珠</option>
                    <option value="charms">吊坠 - 主题装饰</option>
                    <option value="spacers">间隔珠 - 分隔装饰</option>
                  </select>
                  <div className="mt-1 text-xs text-muted-foreground">
                    装饰元素可以增加珠宝的个性化和层次感
                  </div>
                </div>

                {/* 只有选择了装饰元素时才显示配件数量和搭配方式 */}
                {accessories.length > 0 && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">配件数量</label>
                      <select
                        value={accessoryQuantity}
                        onChange={(e) => setAccessoryQuantity(e.target.value)}
                        className="w-full h-10 px-3 py-2 text-sm aura-select"
                      >
                        <option value="single">单个</option>
                        <option value="few">少量</option>
                        <option value="several">若干</option>
                        <option value="multiple">多个</option>
                        <option value="many">许多</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">搭配方式</label>
                      <select
                        value={accessoryArrangement}
                        onChange={(e) => setAccessoryArrangement(e.target.value)}
                        className="w-full h-10 px-3 py-2 text-sm aura-select"
                      >
                        <option value="coordinated composition">搭配组成</option>
                        <option value="harmonious arrangement">和谐搭配</option>
                        <option value="integrated design">整体设计</option>
                        <option value="balanced combination">平衡组合</option>
                      </select>
                    </div>
                  </>
                )}

                {/* 珠子配置 - 适用于手串类型 */}
                {(designInput.designCategory === 'beaded_bracelet' || designInput.designCategory === 'bracelet') && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">珠子大小</label>
                      <select
                        value={beadSize}
                        onChange={(e) => setBeadSize(e.target.value)}
                        className="w-full h-10 px-3 py-2 text-sm aura-select"
                      >
                        <option value="6mm">6mm - 精致小珠</option>
                        <option value="8mm">8mm - 标准珠子</option>
                        <option value="10mm">10mm - 中号珠子</option>
                        <option value="12mm">12mm - 大号珠子</option>
                        <option value="14mm">14mm - 特大珠子</option>
                        <option value="mixed">混合大小</option>
                      </select>
                      <div className="mt-1 text-xs text-muted-foreground">
                        珠子大小影响整体视觉效果和佩戴舒适度
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">排列方式</label>
                      <select
                        value={beadArrangement}
                        onChange={(e) => setBeadArrangement(e.target.value)}
                        className="w-full h-10 px-3 py-2 text-sm aura-select"
                      >
                        <option value="uniform_beads">均匀排列 - 规整对称</option>
                        <option value="alternating_pattern">交替图案 - 不同元素交替</option>
                        <option value="gradient_arrangement">渐变排列 - 大小或颜色渐变</option>
                        <option value="focal_center">中心焦点 - 突出中心主珠</option>
                        <option value="symmetrical_pattern">对称图案 - 左右对称</option>
                        <option value="spacer_separated">间隔珠分隔 - 金属珠分隔</option>
                      </select>
                      <div className="mt-1 text-xs text-muted-foreground">
                        排列方式决定珠宝的整体设计风格
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">金属间隔珠</label>
                      <select
                        value={metalSpacers}
                        onChange={(e) => setMetalSpacers(e.target.value)}
                        className="w-full h-10 px-3 py-2 text-sm aura-select"
                      >
                        <option value="none">无间隔珠</option>
                        <option value="silver">银色间隔珠</option>
                        <option value="gold">金色间隔珠</option>
                        <option value="rose_gold">玫瑰金间隔珠</option>
                        <option value="antique_brass">古铜色间隔珠</option>
                      </select>
                      <div className="mt-1 text-xs text-muted-foreground">
                        金属间隔珠可以增加层次感和精致度
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            {/* 构图美学 */}
            <Card className="luxury-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4 text-green-500" />
                  构图美学
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">构图原理</label>
                  <select
                    value={composition}
                    onChange={(e) => setComposition(e.target.value)}
                    className="w-full h-10 px-3 py-2 text-sm aura-select"
                  >
                    {Object.entries(crystalPromptSystem.compositions).map(([key, comp]) => (
                      <option key={key} value={key}>{comp.chineseName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">背景设置</label>
                  <select
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="w-full h-10 px-3 py-2 text-sm aura-select"
                  >
                    {crystalPromptSystem.backgroundOptions.map((bg, index) => (
                      <option key={index} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">结构美学</label>
                  <select
                    value={structuralAesthetics}
                    onChange={(e) => setStructuralAesthetics(e.target.value)}
                    className="w-full h-10 px-3 py-2 text-sm aura-select"
                  >
                    <option value="structural beauty display">结构美展示</option>
                    <option value="aesthetic arrangement">美学排列</option>
                    <option value="harmonious composition">和谐构图</option>
                    <option value="balanced structure">平衡结构</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">整体布局</label>
                  <select
                    value={overallLayout}
                    onChange={(e) => setOverallLayout(e.target.value)}
                    className="w-full h-10 px-3 py-2 text-sm aura-select"
                  >
                    {designInput.designCategory === 'beaded_bracelet' ? (
                      <>
                        <option value="circular beaded arrangement">环形珠串排列</option>
                        <option value="uniform bead spacing">均匀珠子间距</option>
                        <option value="alternating crystal pattern">交替水晶图案</option>
                        <option value="focal center design">中心焦点设计</option>
                        <option value="graduated bead sizes">渐变珠子大小</option>
                        <option value="metal spacer accents">金属间隔装饰</option>
                      </>
                    ) : (
                      <>
                        <option value="bracelet arrangement">手串排列</option>
                        <option value="circular layout">环形布局</option>
                        <option value="linear arrangement">线性排列</option>
                        <option value="spiral composition">螺旋构图</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">视觉重点</label>
                  <select
                    value={visualFocus}
                    onChange={(e) => setVisualFocus(e.target.value)}
                    className="w-full h-10 px-3 py-2 text-sm aura-select"
                  >
                    <option value="fully displayed">充分展示</option>
                    <option value="prominently featured">突出展现</option>
                    <option value="clearly visible">清晰可见</option>
                    <option value="detailed showcase">详细展示</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* 自定义关键词 */}
            <Card className="luxury-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Brush className="w-4 h-4 text-purple-500" />
                  自定义关键词
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="输入自定义关键词，用逗号分隔..."
                  value={customKeywords}
                  onChange={(e) => setCustomKeywords(e.target.value)}
                  className="min-h-[80px] text-sm aura-select"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  例如: restrained colors, natural transitions, structural beauty
                </p>
              </CardContent>
            </Card>
          </TabsContent>


        </Tabs>
      </div>

      {/* 底部状态 */}
      <div className="p-4 border-t border-border/50 bg-muted/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-aura-pink animate-pulse" />
            <span>专业级高级AI设计系统</span>
          </div>
          <div className="flex items-center gap-4">
            {isGenerating && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-aura-pink border-t-transparent rounded-full animate-spin" />
                <span>AI处理中...</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="text-aura-pink">●</span>
              <span>25+参数</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-aura-purple">●</span>
              <span>专业模型</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCrystalDesignPanel;
