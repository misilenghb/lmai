"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Gem, Circle } from 'lucide-react';

interface BeadConfig {
  crystalType: string;
  color: string;
  size: string;
  isFocal?: boolean;
  isMetalSpacer?: boolean;
}

interface BeadedBraceletPreviewProps {
  beads?: BeadConfig[];
  beadSize?: string;
  beadArrangement?: string;
  metalSpacers?: string;
  title?: string;
}

// 颜色映射
const colorNameToHex = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    // 基础颜色
    'clear': '#f8f9fa',
    'white': '#ffffff',
    'black': '#1a1a1a',
    'grey': '#6c757d',
    'gray': '#6c757d',
    
    // 紫色系
    'purple': '#8b5cf6',
    'deeppurple': '#7c3aed',
    'lightpurple': '#a78bfa',
    'lavender': '#c4b5fd',
    'amethyst': '#9333ea',
    
    // 黄色系
    'yellow': '#fbbf24',
    'golden': '#f59e0b',
    'goldenyellow': '#f59e0b',
    'amber': '#f59e0b',
    'citrine': '#fbbf24',
    
    // 绿色系
    'green': '#10b981',
    'lightgreen': '#34d399',
    'darkgreen': '#059669',
    'emerald': '#10b981',
    'jade': '#22c55e',
    
    // 蓝色系
    'blue': '#3b82f6',
    'lightblue': '#60a5fa',
    'darkblue': '#1d4ed8',
    'sapphire': '#1e40af',
    'aqua': '#06b6d4',
    
    // 红色系
    'red': '#ef4444',
    'darkred': '#dc2626',
    'ruby': '#dc2626',
    'rose': '#f43f5e',
    'pink': '#ec4899',
    
    // 橙色系
    'orange': '#f97316',
    'darkorange': '#ea580c',
    'coral': '#ff7849',
    
    // 棕色系
    'brown': '#a3a3a3',
    'darkbrown': '#525252',
    'smoky': '#6b7280',
    'champagne': '#d4af37'
  };

  const key = colorName.toLowerCase().replace(/\s+/g, '').replace(/[()]/g, '');
  return colorMap[key] || '#cccccc';
};

// 金属间隔珠颜色
const getMetalSpacerColor = (metalType: string): string => {
  const metalColors: { [key: string]: string } = {
    'silver': '#c0c0c0',
    'gold': '#ffd700',
    'rose_gold': '#e8b4a0',
    'antique_brass': '#cd7f32',
    'none': 'transparent'
  };
  return metalColors[metalType] || '#c0c0c0';
};

// 根据珠子大小获取像素值
const getBeadPixelSize = (size: string): number => {
  const sizeMap: { [key: string]: number } = {
    '6mm': 18,
    '8mm': 24,
    '10mm': 30,
    '12mm': 36,
    '14mm': 42
  };
  return sizeMap[size] || 24;
};

const BeadedBraceletPreview: React.FC<BeadedBraceletPreviewProps> = ({ 
  beads = [], 
  beadSize = '8mm',
  beadArrangement = 'uniform_beads',
  metalSpacers = 'silver',
  title = '手串预览'
}) => {
  const radius = 90; // 手串半径
  const beadPixelSize = getBeadPixelSize(beadSize);
  const spacerSize = Math.max(8, beadPixelSize * 0.4); // 间隔珠大小

  // 如果没有珠子数据，创建示例数据
  const displayBeads = beads.length > 0 ? beads : [
    { crystalType: 'Citrine', color: 'Golden Yellow', size: beadSize },
    { crystalType: 'Amethyst', color: 'Deep Purple', size: beadSize },
    { crystalType: 'Citrine', color: 'Golden Yellow', size: beadSize },
    { crystalType: 'Amethyst', color: 'Deep Purple', size: beadSize },
    { crystalType: 'Citrine', color: 'Golden Yellow', size: beadSize },
    { crystalType: 'Amethyst', color: 'Deep Purple', size: beadSize },
    { crystalType: 'Citrine', color: 'Golden Yellow', size: beadSize },
    { crystalType: 'Amethyst', color: 'Deep Purple', size: beadSize },
    { crystalType: 'Citrine', color: 'Golden Yellow', size: beadSize },
    { crystalType: 'Amethyst', color: 'Deep Purple', size: beadSize },
    { crystalType: 'Citrine', color: 'Golden Yellow', size: beadSize },
    { crystalType: 'Amethyst', color: 'Deep Purple', size: beadSize }
  ];

  // 根据排列方式处理珠子
  const processedBeads = displayBeads.flatMap((bead, index) => {
    const beadElement = { ...bead, index: index * 2 };
    
    // 如果有金属间隔珠且不是最后一个珠子
    if (metalSpacers !== 'none' && index < displayBeads.length - 1) {
      const spacerElement = {
        crystalType: 'Metal Spacer',
        color: metalSpacers,
        size: beadSize,
        isMetalSpacer: true,
        index: index * 2 + 1
      };
      return [beadElement, spacerElement];
    }
    
    return [beadElement];
  });

  const totalBeads = processedBeads.length;
  const angleStep = totalBeads > 0 ? 360 / totalBeads : 0;

  if (displayBeads.length === 0) {
    return (
      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-amber-500" />
            {title}
          </CardTitle>
          <CardDescription>手串设计预览</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">暂无手串设计</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="luxury-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gem className="w-5 h-5 text-amber-500" />
          {title}
        </CardTitle>
        <CardDescription>
          {beadSize} 珠子 • {beadArrangement.replace('_', ' ')} • {metalSpacers !== 'none' ? `${metalSpacers} 间隔珠` : '无间隔珠'}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80 flex items-center justify-center relative">
        <div className="relative w-0 h-0">
          {processedBeads.map((bead, index) => {
            const angle = angleStep * index;
            const isMetalSpacer = bead.isMetalSpacer;
            const beadColor = isMetalSpacer 
              ? getMetalSpacerColor(bead.color) 
              : colorNameToHex(bead.color);
            const currentSize = isMetalSpacer ? spacerSize : beadPixelSize;
            
            return (
              <div
                key={`${bead.crystalType}-${index}`}
                className={`absolute rounded-full border-2 shadow-lg transition-all duration-500 hover:scale-110 ${
                  isMetalSpacer 
                    ? 'border-gray-400/50' 
                    : 'border-white/50'
                }`}
                style={{
                  width: `${currentSize}px`,
                  height: `${currentSize}px`,
                  background: isMetalSpacer 
                    ? `linear-gradient(135deg, ${beadColor}, ${beadColor}dd)` 
                    : `radial-gradient(circle at 30% 30%, ${beadColor}ff, ${beadColor}cc, ${beadColor}88)`,
                  transform: `rotate(${angle}deg) translateY(-${radius}px) rotate(-${angle}deg)`,
                  transformOrigin: '0 0',
                  top: '50%',
                  left: '50%',
                  marginLeft: `-${currentSize / 2}px`,
                  marginTop: `-${currentSize / 2}px`,
                  zIndex: isMetalSpacer ? 5 : 10,
                  boxShadow: isMetalSpacer 
                    ? '0 2px 4px rgba(0,0,0,0.2)' 
                    : '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)'
                }}
                title={isMetalSpacer ? `${bead.color} 间隔珠` : `${bead.crystalType} - ${bead.color}`}
              />
            );
          })}
          
          {/* 中心装饰圆环 */}
          <div 
            className="absolute rounded-full border border-gray-300/30"
            style={{
              width: `${radius * 2 - 20}px`,
              height: `${radius * 2 - 20}px`,
              top: '50%',
              left: '50%',
              marginLeft: `-${radius - 10}px`,
              marginTop: `-${radius - 10}px`,
              background: 'radial-gradient(circle, transparent 60%, rgba(255,255,255,0.1) 100%)'
            }}
          />
        </div>
        
        {/* 排列方式说明 */}
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          {beadArrangement === 'uniform_beads' && '均匀排列'}
          {beadArrangement === 'alternating_pattern' && '交替图案'}
          {beadArrangement === 'focal_center' && '中心焦点'}
          {beadArrangement === 'graduated_size' && '渐变大小'}
          {beadArrangement === 'spacer_separated' && '间隔分隔'}
          {beadArrangement === 'prayer_mala' && '念珠式'}
        </div>
      </CardContent>
    </Card>
  );
};

export default BeadedBraceletPreview;
