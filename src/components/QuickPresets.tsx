"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, Crown, Star, Gem, Zap } from 'lucide-react';
import { useCreativeWorkshop } from '@/contexts/CreativeWorkshopContext';
import { useToast } from '@/hooks/use-toast';
import type { DesignStateInput } from '@/types/design';

interface QuickPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  config: Partial<DesignStateInput>;
}

const quickPresets: QuickPreset[] = [
  {
    id: 'elegant-classic',
    name: '经典优雅',
    description: '永恒的经典设计，适合日常佩戴',
    icon: <Crown className="w-5 h-5" />,
    color: 'bg-amber-500/10 text-amber-600 border-amber-200',
    config: {
      designCategory: 'necklace',
      overallDesignStyle: 'elegant',
      imageStyle: 'style_photo_realistic',
      mainStones: [{
        id: '1',
        crystalType: 'Diamond',
        color: 'Clear',
        shape: 'Round',
        size: 'Medium'
      }],
      compositionalAesthetics: {
        overallStructure: 'symmetric',
        layering: 'single',
        proportions: 'balanced'
      },
      colorSystem: {
        mainHue: 'neutral',
        contrast: 'medium',
        saturation: 'medium'
      }
    }
  },
  {
    id: 'romantic-rose',
    name: '浪漫玫瑰',
    description: '温柔浪漫的粉色系设计',
    icon: <Heart className="w-5 h-5" />,
    color: 'bg-rose-500/10 text-rose-600 border-rose-200',
    config: {
      designCategory: 'earrings',
      overallDesignStyle: 'romantic',
      imageStyle: 'style_photo_realistic',
      mainStones: [{
        id: '1',
        crystalType: 'RoseQuartz',
        color: 'Pink',
        shape: 'Heart',
        size: 'Medium'
      }],
      compositionalAesthetics: {
        overallStructure: 'organic',
        layering: 'single',
        proportions: 'delicate'
      },
      colorSystem: {
        mainHue: 'warm',
        contrast: 'low',
        saturation: 'medium'
      }
    }
  },
  {
    id: 'mystical-amethyst',
    name: '神秘紫晶',
    description: '充满神秘感的紫色水晶设计',
    icon: <Star className="w-5 h-5" />,
    color: 'bg-purple-500/10 text-purple-600 border-purple-200',
    config: {
      designCategory: 'ring',
      overallDesignStyle: 'mystical',
      imageStyle: 'style_photo_realistic',
      mainStones: [{
        id: '1',
        crystalType: 'Amethyst',
        color: 'Purple',
        shape: 'Oval',
        size: 'Large'
      }],
      compositionalAesthetics: {
        overallStructure: 'geometric',
        layering: 'single',
        proportions: 'bold'
      },
      colorSystem: {
        mainHue: 'cool',
        contrast: 'high',
        saturation: 'high'
      }
    }
  },
  {
    id: 'modern-minimalist',
    name: '现代简约',
    description: '简洁现代的设计风格',
    icon: <Gem className="w-5 h-5" />,
    color: 'bg-slate-500/10 text-slate-600 border-slate-200',
    config: {
      designCategory: 'bracelet',
      overallDesignStyle: 'modern',
      imageStyle: 'style_photo_realistic',
      mainStones: [{
        id: '1',
        crystalType: 'ClearQuartz',
        color: 'Clear',
        shape: 'Square',
        size: 'Small'
      }],
      compositionalAesthetics: {
        overallStructure: 'geometric',
        layering: 'single',
        proportions: 'minimal'
      },
      colorSystem: {
        mainHue: 'neutral',
        contrast: 'low',
        saturation: 'low'
      }
    }
  },
  {
    id: 'vibrant-energy',
    name: '活力四射',
    description: '充满活力的多彩设计',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    config: {
      designCategory: 'necklace',
      overallDesignStyle: 'vibrant',
      imageStyle: 'style_photo_realistic',
      mainStones: [{
        id: '1',
        crystalType: 'Emerald',
        color: 'Green',
        shape: 'Round',
        size: 'Medium'
      }],
      compositionalAesthetics: {
        overallStructure: 'dynamic',
        layering: 'multiple',
        proportions: 'bold'
      },
      colorSystem: {
        mainHue: 'vibrant',
        contrast: 'high',
        saturation: 'high'
      }
    }
  },
  {
    id: 'luxury-statement',
    name: '奢华宣言',
    description: '彰显品味的奢华设计',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
    config: {
      designCategory: 'earrings',
      overallDesignStyle: 'luxury',
      imageStyle: 'style_photo_realistic',
      mainStones: [{
        id: '1',
        crystalType: 'Sapphire',
        color: 'Blue',
        shape: 'Emerald',
        size: 'Large'
      }],
      compositionalAesthetics: {
        overallStructure: 'ornate',
        layering: 'multiple',
        proportions: 'dramatic'
      },
      colorSystem: {
        mainHue: 'rich',
        contrast: 'high',
        saturation: 'high'
      }
    }
  }
];

interface QuickPresetsProps {
  onPresetSelect?: (preset: QuickPreset) => void;
}

const QuickPresets: React.FC<QuickPresetsProps> = ({ onPresetSelect }) => {
  const { designInput, setDesignInput } = useCreativeWorkshop();
  const { toast } = useToast();

  const handlePresetClick = (preset: QuickPreset) => {
    setDesignInput({
      ...designInput,
      ...preset.config
    });
    
    toast({
      title: `已应用 "${preset.name}" 预设`,
      description: preset.description,
    });

    onPresetSelect?.(preset);
  };

  return (
    <Card className="luxury-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 luxury-text-gradient">
          <Sparkles className="w-5 h-5" />
          快速预设
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickPresets.map((preset) => (
            <Button
              key={preset.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2 luxury-button-hover"
              onClick={() => handlePresetClick(preset)}
            >
              <div className="flex items-center gap-2 w-full">
                <div className={`p-1.5 rounded-lg ${preset.color}`}>
                  {preset.icon}
                </div>
                <span className="font-medium text-sm">{preset.name}</span>
              </div>
              <p className="text-xs text-muted-foreground text-left leading-relaxed">
                {preset.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {preset.config.designCategory}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {preset.config.overallDesignStyle}
                </Badge>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickPresets;
