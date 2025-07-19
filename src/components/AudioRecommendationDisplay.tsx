import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Music, Headphones, Waves, Zap, Gem } from 'lucide-react';

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
}

interface AudioRecommendationDisplayProps {
  recommendedAudio: AudioRecommendation[];
  title?: string;
  className?: string;
  compact?: boolean;
}

const AudioRecommendationDisplay: React.FC<AudioRecommendationDisplayProps> = ({
  recommendedAudio,
  title = "推荐疗愈音频",
  className = "",
  compact = false
}) => {
  // 获取音频类型图标
  const getAudioIcon = (type: AudioRecommendation['type']) => {
    switch (type) {
      case 'frequency': return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'nature': return <Waves className="h-4 w-4 text-green-500" />;
      case 'crystal_bowl': return <Gem className="h-4 w-4 text-purple-500" />;
      case 'binaural': return <Headphones className="h-4 w-4 text-blue-500" />;
      case 'ambient': return <Music className="h-4 w-4 text-indigo-500" />;
      default: return <Music className="h-4 w-4 text-gray-500" />;
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

  if (recommendedAudio.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className={`space-y-2 ${className}`}>
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <Music className="mr-2 h-4 w-4" />
          {title}
        </h4>
        <div className="space-y-2">
          {recommendedAudio.map((audio) => (
            <div 
              key={audio.id} 
              className="flex items-center justify-between p-2 bg-white/90 dark:bg-gray-800/90 rounded border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
                  {getAudioIcon(audio.type)}
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-900 dark:text-gray-100">{audio.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{audio.duration}</div>
                </div>
              </div>
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                {getAudioTypeLabel(audio.type)}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
        <Music className="mr-2 h-4 w-4" />
        {title}
      </h4>
      <div className="space-y-3">
        {recommendedAudio.map((audio) => (
          <div 
            key={audio.id} 
            className="p-3 bg-white/90 dark:bg-gray-800/90 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  {getAudioIcon(audio.type)}
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{audio.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {getAudioTypeLabel(audio.type)} • {audio.duration}
                  </div>
                  {audio.frequency && (
                    <Badge variant="outline" className="text-xs mt-1 bg-primary/10 text-primary border-primary/20">
                      {audio.frequency}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-primary/10 px-2 py-1 rounded">
                推荐
              </div>
            </div>
            
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              {audio.description}
            </div>
            
            <div className="flex flex-wrap gap-1">
              {audio.benefits.map((benefit, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                >
                  {benefit}
                </span>
              ))}
            </div>
            
            {audio.preview && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
                💫 {audio.preview}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
        💫 根据您的冥想类型和能量状态智能推荐
      </div>
    </div>
  );
};

export default AudioRecommendationDisplay;
