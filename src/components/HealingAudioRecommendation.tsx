import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, Headphones, Waves, Zap, Gem, Play, Pause, Volume2, VolumeX } from 'lucide-react';

// 音频推荐类型定义
export interface AudioRecommendation {
  id: string;
  name: string;
  type: 'frequency' | 'nature' | 'crystal_bowl' | 'binaural' | 'ambient';
  description: string;
  frequency?: string;
  duration: string;
  benefits: string[];
  chakraAlignment?: string;
  preview?: string;
  url?: string;
}

// 完整的疗愈音频库
export const HEALING_AUDIO_LIBRARY: AudioRecommendation[] = [
  {
    id: 'solfeggio-528',
    name: '528Hz DNA修复频率',
    type: 'frequency',
    description: '被称为"爱的频率"，促进细胞修复和心灵疗愈',
    frequency: '528Hz',
    duration: '循环播放',
    benefits: ['DNA修复', '心灵疗愈', '提升爱的振动', '细胞再生'],
    chakraAlignment: 'heart',
    preview: '纯净的528Hz正弦波，温和而深入'
  },
  {
    id: 'solfeggio-432',
    name: '432Hz自然和谐频率',
    type: 'frequency',
    description: '与自然频率共振，带来深度平静和和谐',
    frequency: '432Hz',
    duration: '循环播放',
    benefits: ['自然和谐', '深度放松', '情绪平衡', '压力释放'],
    chakraAlignment: 'crown',
    preview: '与地球自然频率同步的和谐音调'
  },
  {
    id: 'solfeggio-639',
    name: '639Hz关系疗愈频率',
    type: 'frequency',
    description: '促进人际关系和谐，增强沟通与理解',
    frequency: '639Hz',
    duration: '循环播放',
    benefits: ['关系疗愈', '沟通改善', '情感连接', '社交和谐'],
    chakraAlignment: 'heart',
    preview: '温暖的639Hz频率，促进心灵连接'
  },
  {
    id: 'crystal-bowl-chakra',
    name: '七脉轮水晶钵序列',
    type: 'crystal_bowl',
    description: '完整的七脉轮水晶唱钵疗愈序列',
    duration: '21分钟',
    benefits: ['脉轮平衡', '能量清理', '深度疗愈', '振动疗法'],
    preview: '从根轮到顶轮的完整水晶钵疗愈序列'
  },
  {
    id: 'crystal-bowl-heart',
    name: '心轮水晶钵疗愈',
    type: 'crystal_bowl',
    description: '专注于心轮的水晶钵疗愈音频',
    duration: '15分钟',
    benefits: ['心轮开启', '爱的疗愈', '情感平衡', '慈悲培养'],
    chakraAlignment: 'heart',
    preview: '心轮频率的水晶钵，温暖而疗愈'
  },
  {
    id: 'theta-meditation',
    name: 'Theta深度冥想波',
    type: 'binaural',
    description: '4-8Hz Theta脑波，引导进入深度冥想状态',
    frequency: '6Hz',
    duration: '30分钟',
    benefits: ['深度冥想', '直觉开发', '创造力提升', '潜意识疗愈'],
    chakraAlignment: 'thirdEye',
    preview: '双耳节拍产生6Hz Theta脑波'
  },
  {
    id: 'alpha-relaxation',
    name: 'Alpha放松脑波',
    type: 'binaural',
    description: '8-12Hz Alpha波，促进放松和专注',
    frequency: '10Hz',
    duration: '25分钟',
    benefits: ['深度放松', '压力缓解', '专注提升', '情绪平衡'],
    preview: '舒缓的Alpha脑波，带来宁静专注'
  },
  {
    id: 'ocean-waves',
    name: '海洋波浪自然音',
    type: 'nature',
    description: '温柔的海浪声，模拟母体环境的安全感',
    duration: '循环播放',
    benefits: ['深度放松', '压力缓解', '睡眠改善', '情绪稳定'],
    preview: '温和的海浪拍岸声，带来宁静安详'
  },
  {
    id: 'forest-rain',
    name: '森林雨声冥想',
    type: 'nature',
    description: '森林中的轻柔雨声，净化心灵空间',
    duration: '循环播放',
    benefits: ['心灵净化', '专注提升', '自然连接', '内在平静'],
    preview: '雨滴在树叶上的轻柔声音，鸟鸣点缀'
  },
  {
    id: 'mountain-stream',
    name: '山涧流水声',
    type: 'nature',
    description: '清澈山涧的流水声，洗涤心灵尘埃',
    duration: '循环播放',
    benefits: ['心灵净化', '思维清晰', '能量流动', '内在清洁'],
    preview: '清澈流水声，带来纯净能量'
  },
  {
    id: 'ambient-space',
    name: '宇宙空间环境音',
    type: 'ambient',
    description: '深邃的宇宙空间音效，连接无限意识',
    duration: '45分钟',
    benefits: ['意识扩展', '宇宙连接', '深度内观', '灵性觉醒'],
    chakraAlignment: 'crown',
    preview: '深邃的宇宙共振，带来无限感和宁静'
  },
  {
    id: 'ambient-temple',
    name: '神圣殿堂环境音',
    type: 'ambient',
    description: '神圣空间的环境音效，营造庄严氛围',
    duration: '40分钟',
    benefits: ['神圣连接', '内在宁静', '灵性提升', '心灵净化'],
    preview: '庄严神圣的殿堂氛围，带来内在平静'
  }
];

interface HealingAudioRecommendationProps {
  recommendedAudio?: AudioRecommendation[];
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
  showOnlyRecommendations?: boolean; // 新增：只显示推荐，不显示播放功能
}

const HealingAudioRecommendation: React.FC<HealingAudioRecommendationProps> = ({
  recommendedAudio = [],
  className = '',
  showTitle = true,
  compact = false,
  showOnlyRecommendations = false
}) => {
  const [selectedAudio, setSelectedAudio] = useState<AudioRecommendation | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  // 获取音频类型图标
  const getAudioIcon = (type: AudioRecommendation['type']) => {
    switch (type) {
      case 'frequency': return <Zap className="h-4 w-4" />;
      case 'nature': return <Waves className="h-4 w-4" />;
      case 'crystal_bowl': return <Gem className="h-4 w-4" />;
      case 'binaural': return <Headphones className="h-4 w-4" />;
      case 'ambient': return <Music className="h-4 w-4" />;
      default: return <Music className="h-4 w-4" />;
    }
  };

  // 获取音频类型标签
  const getAudioTypeLabel = (type: AudioRecommendation['type']) => {
    switch (type) {
      case 'frequency': return '频率疗愈';
      case 'nature': return '自然音效';
      case 'crystal_bowl': return '水晶钵';
      case 'binaural': return '双耳节拍';
      case 'ambient': return '环境音乐';
      default: return '音频';
    }
  };

  // 选择音频查看详情
  const selectAudio = (audio: AudioRecommendation) => {
    if (selectedAudio?.id === audio.id) {
      setSelectedAudio(null);
    } else {
      setSelectedAudio(audio);
    }
  };

  if (recommendedAudio.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPanel(!showPanel)}
          className="w-full flex items-center justify-center space-x-2"
        >
          <Headphones className="h-4 w-4" />
          <span>疗愈音频推荐</span>
        </Button>
        
        {showPanel && (
          <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg space-y-2 border border-gray-200 dark:border-gray-700">
            {recommendedAudio.map((audio) => (
              <div
                key={audio.id}
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                  selectedAudio?.id === audio.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => selectAudio(audio)}
              >
                <div className="flex items-center space-x-2">
                  {getAudioIcon(audio.type)}
                  <div>
                    <div className="text-xs font-medium">{audio.name}</div>
                    <div className="text-xs text-muted-foreground">{audio.duration}</div>
                  </div>
                </div>
                {!showOnlyRecommendations && (
                  <Badge variant="outline" className="text-xs">
                    {getAudioTypeLabel(audio.type)}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={`${className}`}>
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Music className="h-5 w-5" />
            <span>疗愈音频推荐</span>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {recommendedAudio.map((audio) => (
            <div
              key={audio.id}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                selectedAudio?.id === audio.id
                  ? 'bg-primary/10 border border-primary/20'
                  : 'bg-white/80 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => selectAudio(audio)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  {getAudioIcon(audio.type)}
                </div>
                <div>
                  <div className="font-medium">{audio.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {getAudioTypeLabel(audio.type)} • {audio.duration}
                  </div>
                  {audio.frequency && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {audio.frequency}
                    </Badge>
                  )}
                </div>
              </div>
              {!showOnlyRecommendations && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectAudio(audio);
                  }}
                >
                  <Music className="h-4 w-4" />
                  <span className="hidden sm:inline">详情</span>
                </Button>
              )}
            </div>
          ))}
        </div>
        
        {selectedAudio && (
          <div className="p-4 bg-white/90 dark:bg-gray-800/90 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="font-medium mb-2 text-gray-900 dark:text-gray-100">{selectedAudio.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">{selectedAudio.description}</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedAudio.benefits.map((benefit, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                  {benefit}
                </Badge>
              ))}
            </div>
            {selectedAudio.preview && (
              <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                💫 {selectedAudio.preview}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealingAudioRecommendation;
