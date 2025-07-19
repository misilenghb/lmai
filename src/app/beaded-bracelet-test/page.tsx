"use client";

import React, { useState } from 'react';
import BeadedBraceletPreview from '@/components/BeadedBraceletPreview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BeadConfig {
  crystalType: string;
  color: string;
  size: string;
  isFocal?: boolean;
  isMetalSpacer?: boolean;
}

const BeadedBraceletTestPage: React.FC = () => {
  const [currentConfig, setCurrentConfig] = useState({
    beadSize: '8mm',
    beadArrangement: 'uniform_beads',
    metalSpacers: 'silver'
  });

  // 预设的手串配置
  const presetConfigs = [
    {
      name: '黄水晶紫水晶手串',
      beadSize: '8mm',
      beadArrangement: 'alternating_pattern',
      metalSpacers: 'silver',
      beads: [
        { crystalType: 'Citrine', color: 'Golden Yellow', size: '8mm' },
        { crystalType: 'Amethyst', color: 'Deep Purple', size: '8mm' },
        { crystalType: 'Citrine', color: 'Golden Yellow', size: '8mm' },
        { crystalType: 'Amethyst', color: 'Deep Purple', size: '8mm' },
        { crystalType: 'Citrine', color: 'Golden Yellow', size: '8mm' },
        { crystalType: 'Amethyst', color: 'Deep Purple', size: '8mm' },
        { crystalType: 'Citrine', color: 'Golden Yellow', size: '8mm' },
        { crystalType: 'Amethyst', color: 'Deep Purple', size: '8mm' },
        { crystalType: 'Citrine', color: 'Golden Yellow', size: '8mm' },
        { crystalType: 'Amethyst', color: 'Deep Purple', size: '8mm' },
        { crystalType: 'Citrine', color: 'Golden Yellow', size: '8mm' },
        { crystalType: 'Amethyst', color: 'Deep Purple', size: '8mm' }
      ]
    },
    {
      name: '绿幽灵手串',
      beadSize: '10mm',
      beadArrangement: 'focal_center',
      metalSpacers: 'gold',
      beads: [
        { crystalType: 'Green Phantom', color: 'Light Green', size: '10mm' },
        { crystalType: 'Green Phantom', color: 'Light Green', size: '10mm' },
        { crystalType: 'Green Phantom', color: 'Light Green', size: '10mm' },
        { crystalType: 'Green Phantom', color: 'Light Green', size: '10mm' },
        { crystalType: 'Green Phantom', color: 'Light Green', size: '10mm' },
        { crystalType: 'Green Phantom', color: 'Dark Green', size: '12mm', isFocal: true },
        { crystalType: 'Green Phantom', color: 'Light Green', size: '10mm' },
        { crystalType: 'Green Phantom', color: 'Light Green', size: '10mm' },
        { crystalType: 'Green Phantom', color: 'Light Green', size: '10mm' },
        { crystalType: 'Green Phantom', color: 'Light Green', size: '10mm' },
        { crystalType: 'Green Phantom', color: 'Light Green', size: '10mm' }
      ]
    },
    {
      name: '粉晶手串',
      beadSize: '6mm',
      beadArrangement: 'uniform_beads',
      metalSpacers: 'rose_gold',
      beads: [
        { crystalType: 'Rose Quartz', color: 'Pink', size: '6mm' },
        { crystalType: 'Rose Quartz', color: 'Pink', size: '6mm' },
        { crystalType: 'Rose Quartz', color: 'Pink', size: '6mm' },
        { crystalType: 'Rose Quartz', color: 'Pink', size: '6mm' },
        { crystalType: 'Rose Quartz', color: 'Pink', size: '6mm' },
        { crystalType: 'Rose Quartz', color: 'Pink', size: '6mm' },
        { crystalType: 'Rose Quartz', color: 'Pink', size: '6mm' },
        { crystalType: 'Rose Quartz', color: 'Pink', size: '6mm' },
        { crystalType: 'Rose Quartz', color: 'Pink', size: '6mm' },
        { crystalType: 'Rose Quartz', color: 'Pink', size: '6mm' },
        { crystalType: 'Rose Quartz', color: 'Pink', size: '6mm' },
        { crystalType: 'Rose Quartz', color: 'Pink', size: '6mm' },
        { crystalType: 'Rose Quartz', color: 'Pink', size: '6mm' },
        { crystalType: 'Rose Quartz', color: 'Pink', size: '6mm' },
        { crystalType: 'Rose Quartz', color: 'Pink', size: '6mm' },
        { crystalType: 'Rose Quartz', color: 'Pink', size: '6mm' }
      ]
    },
    {
      name: '念珠式手串',
      beadSize: '12mm',
      beadArrangement: 'prayer_mala',
      metalSpacers: 'antique_brass',
      beads: [
        { crystalType: 'Smoky Quartz', color: 'Brown', size: '12mm' },
        { crystalType: 'Smoky Quartz', color: 'Brown', size: '12mm' },
        { crystalType: 'Smoky Quartz', color: 'Brown', size: '12mm' },
        { crystalType: 'Smoky Quartz', color: 'Brown', size: '12mm' },
        { crystalType: 'Smoky Quartz', color: 'Brown', size: '12mm' },
        { crystalType: 'Smoky Quartz', color: 'Brown', size: '12mm' },
        { crystalType: 'Smoky Quartz', color: 'Brown', size: '12mm' },
        { crystalType: 'Smoky Quartz', color: 'Brown', size: '12mm' },
        { crystalType: 'Smoky Quartz', color: 'Brown', size: '12mm' },
        { crystalType: 'Smoky Quartz', color: 'Brown', size: '12mm' }
      ]
    }
  ];

  const [selectedPreset, setSelectedPreset] = useState(presetConfigs[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center">手串设计预览测试</CardTitle>
            <CardDescription className="text-center">
              测试不同手串配置的视觉效果
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 预设配置选择 */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="text-lg">预设配置</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {presetConfigs.map((config, index) => (
                <Button
                  key={index}
                  variant={selectedPreset.name === config.name ? "default" : "outline"}
                  onClick={() => setSelectedPreset(config)}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <span className="font-medium">{config.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {config.beadSize} • {config.metalSpacers}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 手串预览 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BeadedBraceletPreview
            beads={selectedPreset.beads}
            beadSize={selectedPreset.beadSize}
            beadArrangement={selectedPreset.beadArrangement}
            metalSpacers={selectedPreset.metalSpacers}
            title={selectedPreset.name}
          />

          {/* 配置详情 */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle>配置详情</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">基本信息</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">珠子大小:</span> {selectedPreset.beadSize}</p>
                  <p><span className="text-muted-foreground">排列方式:</span> {selectedPreset.beadArrangement.replace('_', ' ')}</p>
                  <p><span className="text-muted-foreground">金属间隔:</span> {selectedPreset.metalSpacers}</p>
                  <p><span className="text-muted-foreground">珠子数量:</span> {selectedPreset.beads.length}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">水晶组成</h4>
                <div className="space-y-1 text-sm max-h-40 overflow-y-auto">
                  {selectedPreset.beads.map((bead, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{bead.crystalType}</span>
                      <span className="text-muted-foreground">{bead.color}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">设计特点</h4>
                <div className="text-sm text-muted-foreground">
                  {selectedPreset.beadArrangement === 'uniform_beads' && '均匀排列的珠子，简洁大方'}
                  {selectedPreset.beadArrangement === 'alternating_pattern' && '交替排列的水晶，富有节奏感'}
                  {selectedPreset.beadArrangement === 'focal_center' && '中心主珠设计，突出重点'}
                  {selectedPreset.beadArrangement === 'prayer_mala' && '念珠式设计，具有禅意'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 使用说明 */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle>手串设计说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">珠子大小规格</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li><strong>6mm:</strong> 精致小珠，适合日常佩戴</li>
                  <li><strong>8mm:</strong> 标准大小，最常见规格</li>
                  <li><strong>10mm:</strong> 中等大小，视觉效果好</li>
                  <li><strong>12mm:</strong> 较大珠子，适合男士</li>
                  <li><strong>14mm:</strong> 大珠子，适合特殊场合</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">排列方式</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li><strong>均匀珠串:</strong> 所有珠子大小一致</li>
                  <li><strong>交替排列:</strong> 不同水晶交替出现</li>
                  <li><strong>中心主珠:</strong> 中央有一颗较大的主珠</li>
                  <li><strong>渐变大小:</strong> 珠子大小呈渐变排列</li>
                  <li><strong>间隔分隔:</strong> 用金属珠分隔水晶珠</li>
                  <li><strong>念珠式:</strong> 传统念珠排列方式</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BeadedBraceletTestPage;
