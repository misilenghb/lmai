"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Gem, Heart, Brain, Sparkles, Camera, BookOpen,
  TrendingUp, Moon, Sun, Zap, Shield, Target,
  Play, Pause, RotateCcw, Volume2, VolumeX,
  Calendar, Clock, Star, Eye, Flower2, Music, Headphones, Waves
} from 'lucide-react';
import AudioRecommendationDisplay from '@/components/AudioRecommendationDisplay';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { CrystalRecommendationService, CORE_CRYSTALS, EXTENDED_CRYSTALS } from '@/services/crystalRecommendationService';
import type { UserProfileDataOutput } from '@/ai/schemas/user-profile-schemas';
import { crystalTypeMapping } from '@/lib/crystal-options';
import { getCrystalIcon } from '@/lib/crystal-icons';
import { useRouter } from 'next/navigation';

// 移除本地图标配置，使用统一的图标系统

// 使用统一的水晶数据库
const CRYSTAL_DATABASE = Object.values(CORE_CRYSTALS).map(crystal => {
  const iconData = getCrystalIcon(crystal.id);
  return {
    ...crystal,
    properties: crystal.primaryEffects,
    description: `${crystal.name}的疗愈功效基于${crystal.scientificBasis}`,
    image: iconData.symbol,
    iconData: iconData
  };
});

// 情绪状态选项 - 设计感图标 (使用翻译)
const getMoodOptions = (t: (key: string) => string) => [
  {
    id: 'stressed',
    label: t('crystalHealingPage.moodOptions.stressed'),
    icon: '⚡',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/30'
  },
  {
    id: 'anxious',
    label: t('crystalHealingPage.moodOptions.anxious'),
    icon: '◈',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/30'
  },
  {
    id: 'sad',
    label: t('crystalHealingPage.moodOptions.sad'),
    icon: '◐',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30'
  },
  {
    id: 'tired',
    label: t('crystalHealingPage.moodOptions.tired'),
    icon: '◯',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/50',
    borderColor: 'border-muted'
  },
  {
    id: 'neutral',
    label: t('crystalHealingPage.moodOptions.neutral'),
    icon: '◊',
    color: 'text-foreground/70',
    bgColor: 'bg-card',
    borderColor: 'border-border'
  },
  {
    id: 'happy',
    label: t('crystalHealingPage.moodOptions.happy'),
    icon: '◆',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    borderColor: 'border-secondary/30'
  },
  {
    id: 'excited',
    label: t('crystalHealingPage.moodOptions.excited'),
    icon: '✦',
    color: 'text-primary',
    bgColor: 'bg-primary/15',
    borderColor: 'border-primary/40'
  },
  {
    id: 'grateful',
    label: t('crystalHealingPage.moodOptions.grateful'),
    icon: '✧',
    color: 'text-secondary',
    bgColor: 'bg-secondary/15',
    borderColor: 'border-secondary/40'
  }
];

// 音频推荐类型
interface AudioRecommendation {
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

// 音频推荐数据
const HEALING_AUDIO_LIBRARY: AudioRecommendation[] = [
  {
    id: 'solfeggio-528',
    name: '528Hz 爱的频率',
    type: 'frequency',
    description: 'DNA修复频率，促进心灵疗愈',
    frequency: '528Hz',
    duration: '循环播放',
    benefits: ['DNA修复', '心灵疗愈', '爱的振动'],
    chakraAlignment: 'heart',
    preview: '纯净的528Hz正弦波'
  },
  {
    id: 'crystal-bowl-chakra',
    name: '七脉轮水晶钵',
    type: 'crystal_bowl',
    description: '完整脉轮平衡序列',
    duration: '21分钟',
    benefits: ['脉轮平衡', '能量清理', '深度疗愈'],
    preview: '从根轮到顶轮的水晶钵序列'
  },
  {
    id: 'theta-meditation',
    name: 'Theta冥想波',
    type: 'binaural',
    description: '深度冥想脑波引导',
    frequency: '6Hz',
    duration: '30分钟',
    benefits: ['深度冥想', '直觉开发', '潜意识疗愈'],
    chakraAlignment: 'thirdEye',
    preview: '双耳节拍产生Theta脑波'
  },
  {
    id: 'forest-healing',
    name: '森林疗愈音景',
    type: 'nature',
    description: '自然森林环境音效',
    duration: '循环播放',
    benefits: ['自然连接', '压力释放', '心灵净化'],
    preview: '鸟鸣、流水、风声的和谐组合'
  }
];

// 冥想类型 - 设计感图标
const MEDITATION_TYPES = [
  {
    id: 'crystal_focus',
    name: '水晶专注冥想',
    duration: 10,
    description: '专注于水晶的能量，深化与水晶的连接',
    icon: '◇',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    recommendedAudio: [
      HEALING_AUDIO_LIBRARY.find(a => a.id === 'solfeggio-528')!,
      HEALING_AUDIO_LIBRARY.find(a => a.id === 'crystal-bowl-chakra')!
    ]
  },
  {
    id: 'chakra_balance',
    name: '脉轮平衡冥想',
    duration: 15,
    description: '使用水晶平衡七个主要脉轮的能量',
    icon: '◉',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    recommendedAudio: [
      HEALING_AUDIO_LIBRARY.find(a => a.id === 'crystal-bowl-chakra')!,
      HEALING_AUDIO_LIBRARY.find(a => a.id === 'solfeggio-528')!
    ]
  },
  {
    id: 'emotional_healing',
    name: '情感疗愈冥想',
    duration: 12,
    description: '释放负面情绪，培养内在平静',
    icon: '♥',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    recommendedAudio: [
      HEALING_AUDIO_LIBRARY.find(a => a.id === 'solfeggio-528')!,
      HEALING_AUDIO_LIBRARY.find(a => a.id === 'forest-healing')!
    ]
  },
  {
    id: 'protection',
    name: '能量保护冥想',
    duration: 8,
    description: '建立能量保护屏障，增强内在力量',
    icon: '◈',
    color: 'text-secondary',
    bgColor: 'bg-secondary/15',
    recommendedAudio: [
      HEALING_AUDIO_LIBRARY.find(a => a.id === 'theta-meditation')!,
      HEALING_AUDIO_LIBRARY.find(a => a.id === 'forest-healing')!
    ]
  }
];

// 冥想指导内容
const MEDITATION_GUIDES = {
  crystal_focus: {
    preparation: [
      '找一个安静舒适的地方坐下',
      '将水晶握在双手中，感受它的重量',
      '关闭或调暗灯光，营造宁静氛围',
      '深呼吸三次，让身体完全放松'
    ],
    process: [
      '专注于水晶的重量、温度和质感',
      '想象水晶内部的光芒慢慢亮起',
      '感受水晶的振动频率与您的心跳同步',
      '让水晶的能量从手心流向全身',
      '如果思绪飘散，轻柔地将注意力拉回水晶'
    ],
    ending: [
      '慢慢加深呼吸，感受身体的存在',
      '感谢水晶给予的能量和指导',
      '将水晶的能量锁定在心中',
      '轻柔地睁开眼睛，保持内在的平静'
    ]
  },
  chakra_balance: {
    preparation: [
      '选择七颗对应脉轮的水晶排列在身前',
      '舒适地躺下或坐直，脊椎保持挺直',
      '深呼吸，想象根部与大地连接',
      '设定平衡所有脉轮的意图'
    ],
    process: [
      '从海底轮开始，想象红色光芒在尾骨处旋转',
      '逐一观想每个脉轮：橙、黄、绿、蓝、靛、紫',
      '感受每个脉轮的水晶能量激活对应部位',
      '想象七色彩虹光柱贯穿整个身体',
      '保持呼吸平稳，让能量自然流动'
    ],
    ending: [
      '感受所有脉轮和谐共振的状态',
      '将平衡的能量锁定在身体中',
      '感谢每颗水晶的疗愈力量',
      '慢慢回到当下，记录体验感受'
    ]
  },
  emotional_healing: {
    preparation: [
      '选择一颗情感疗愈水晶（如玫瑰石英）',
      '找到内心最需要疗愈的情感',
      '将水晶放在心轮位置',
      '允许自己感受当下的情绪状态'
    ],
    process: [
      '深呼吸，想象粉色或绿色的疗愈光芒',
      '让这光芒包围并渗透痛苦的情感',
      '不抗拒任何涌现的感受，只是观察',
      '想象负面情绪被光芒转化为爱与理解',
      '重复肯定语："我值得被爱，我选择原谅"'
    ],
    ending: [
      '感受心中温暖平静的能量',
      '将这份爱的能量扩散到全身',
      '感谢自己的勇气和水晶的支持',
      '承诺继续以爱对待自己和他人'
    ]
  },
  protection: {
    preparation: [
      '选择保护性水晶（如黑曜石或紫水晶）',
      '坐直，想象自己是一座坚固的山峰',
      '设定保护自己能量场的明确意图',
      '深呼吸，感受内在的力量'
    ],
    process: [
      '想象水晶发出强大的保护光芒',
      '这光芒在您周围形成一个能量护盾',
      '护盾反射所有负面能量，只允许爱进入',
      '感受自己的内在力量不断增强',
      '重复："我是安全的，我是受保护的"'
    ],
    ending: [
      '确认保护屏障已经稳固建立',
      '感受内在力量和自信的增长',
      '感谢水晶提供的保护能量',
      '带着这份力量和保护回到日常生活'
    ]
  }
};

// 根据冥想类型推荐水晶
const getRecommendedCrystalForMeditation = (meditationType: string) => {
  const recommendations = {
    crystal_focus: ['紫水晶', '白水晶', '萤石'],
    chakra_balance: ['七脉轮套装', '彩虹萤石', '拉长石'],
    emotional_healing: ['玫瑰石英', '绿东陵', '月光石'],
    protection: ['黑曜石', '黑碧玺', '赤铁矿']
  };

  const crystalNames = recommendations[meditationType as keyof typeof recommendations] || ['紫水晶'];

  // 从可用水晶中找到匹配的
  const allCrystals = [...Object.values(CORE_CRYSTALS), ...Object.values(EXTENDED_CRYSTALS)];
  for (const name of crystalNames) {
    const crystal = allCrystals.find(c => c.name === name);
    if (crystal) return crystal;
  }

  // 如果没找到，返回紫水晶作为默认
  return Object.values(CORE_CRYSTALS).find(c => c.name === '紫水晶') || Object.values(CORE_CRYSTALS)[0];
};



export default function CrystalHealingPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  // 获取翻译后的情绪选项
  const MOOD_OPTIONS = getMoodOptions(t);

  // 状态管理
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedCrystal, setSelectedCrystal] = useState(CRYSTAL_DATABASE[0]);
  const [currentMood, setCurrentMood] = useState('');
  const [moodHistory, setMoodHistory] = useState<Array<{date: string, mood: string, crystal: string}>>([]);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [meditationTimer, setMeditationTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState(MEDITATION_TYPES[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showAudioPanel, setShowAudioPanel] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [userProfile, setUserProfile] = useState<UserProfileDataOutput | null>(null);
  const [current3DEnergy, setCurrent3DEnergy] = useState<any>(null);

  // 个性化疗愈建议状态
  const [showDailyRecommendation, setShowDailyRecommendation] = useState(false);
  const [showMeditationReminder, setShowMeditationReminder] = useState(false);
  const [showEmergencyKit, setShowEmergencyKit] = useState(false);
  const [showPurificationRitual, setShowPurificationRitual] = useState(false);

  // 知识库状态
  const [showKnowledgeDetail, setShowKnowledgeDetail] = useState(false);
  const [selectedKnowledge, setSelectedKnowledge] = useState<any>(null);

  // 水晶知识库详细内容
  const KNOWLEDGE_DATABASE = {
    crystal_formation: {
      title: '水晶的形成',
      category: '基础知识',
      icon: Target,
      sections: [
        {
          title: '地质形成过程',
          content: [
            '水晶是在地球深处经过数百万年的地质作用形成的天然矿物。',
            '在高温高压的环境下，硅酸盐溶液缓慢冷却结晶，形成了各种不同的水晶结构。',
            '不同的矿物成分和形成条件，造就了水晶丰富的颜色和独特的能量特性。'
          ]
        },
        {
          title: '水晶的分类',
          content: [
            '石英族：包括紫水晶、白水晶、粉水晶等，是最常见的水晶类型。',
            '长石族：如月光石、拉长石，具有独特的光学效应。',
            '碳酸盐族：如孔雀石、青金石，颜色鲜艳，能量强烈。'
          ]
        },
        {
          title: '能量形成原理',
          content: [
            '水晶的规则晶体结构使其具有稳定的振动频率。',
            '这种振动频率能够与人体的能量场产生共振效应。',
            '不同的水晶因其化学成分和结构差异，具有不同的疗愈频率。'
          ]
        }
      ]
    },
    chakra_crystals: {
      title: '脉轮与水晶',
      category: '能量系统',
      icon: Zap,
      sections: [
        {
          title: '七大脉轮系统',
          content: [
            '脉轮是人体能量系统中的七个主要能量中心，从根轮到顶轮依次排列。',
            '每个脉轮对应不同的身体部位、情感状态和精神层面。',
            '通过特定水晶的能量共振，可以平衡和激活相应的脉轮。'
          ]
        },
        {
          title: '脉轮与水晶对应',
          content: [
            '根轮（红色）：红碧玉、石榴石 - 增强安全感和稳定性',
            '脐轮（橙色）：橙色方解石、太阳石 - 激发创造力和热情',
            '太阳神经丛（黄色）：黄水晶、虎眼石 - 提升自信和个人力量',
            '心轮（绿色）：绿幽灵、粉水晶 - 促进爱与慈悲',
            '喉轮（蓝色）：蓝晶石、海蓝宝 - 改善沟通和表达',
            '眉心轮（靛蓝）：紫水晶、萤石 - 增强直觉和洞察力',
            '顶轮（紫色）：白水晶、紫锂辉 - 连接宇宙意识'
          ]
        },
        {
          title: '脉轮平衡方法',
          content: [
            '将对应的水晶放置在相应脉轮位置，进行15-20分钟的冥想。',
            '可以同时使用多颗水晶，从根轮到顶轮依次放置。',
            '配合深呼吸和观想，感受水晶能量在脉轮中的流动。'
          ]
        }
      ]
    },
    crystal_cleansing: {
      title: '水晶净化方法',
      category: '护理指南',
      icon: Sparkles,
      sections: [
        {
          title: '为什么需要净化',
          content: [
            '水晶在使用过程中会吸收负面能量，需要定期清理。',
            '新购买的水晶可能携带他人的能量印记，需要净化后再使用。',
            '定期净化可以保持水晶的最佳能量状态和疗愈效果。'
          ]
        },
        {
          title: '常用净化方法',
          content: [
            '月光净化：将水晶放在月光下过夜，特别是满月时效果最佳。',
            '流水净化：用清水冲洗水晶1-2分钟，同时观想负能量被冲走。',
            '音频净化：使用颂钵、音叉或冥想音乐的振动来净化水晶。',
            '烟熏净化：用鼠尾草、檀香等天然香料的烟雾净化水晶。',
            '土埋净化：将水晶埋在干净的土壤中24小时，让大地吸收负能量。'
          ]
        },
        {
          title: '净化注意事项',
          content: [
            '某些水晶不适合水洗，如天青石、孔雀石等，应选择其他方法。',
            '净化后的水晶需要重新充能，可放在阳光下或水晶簇上。',
            '建议每周净化一次，使用频繁时可增加净化频率。'
          ]
        }
      ]
    },
    meditation_crystals: {
      title: '冥想与水晶',
      category: '实践方法',
      icon: Brain,
      sections: [
        {
          title: '水晶冥想的原理',
          content: [
            '水晶的稳定振动频率有助于平静心灵，进入深度冥想状态。',
            '不同水晶的能量特性可以引导冥想朝向特定的目标。',
            '水晶作为能量放大器，可以增强冥想的效果和体验。'
          ]
        },
        {
          title: '冥想水晶选择',
          content: [
            '初学者：白水晶或紫水晶，能量温和且易于感受。',
            '深度冥想：萤石或拉长石，有助于进入更深层的意识状态。',
            '情感疗愈：粉水晶或绿幽灵，专注于心轮的开启和疗愈。',
            '直觉开发：紫水晶或青金石，激活第三眼脉轮。'
          ]
        },
        {
          title: '水晶冥想技巧',
          content: [
            '握持法：将水晶握在手中，感受其温度和振动。',
            '放置法：将水晶放在身体相应部位或面前的地面上。',
            '观想法：凝视水晶，将注意力集中在其颜色和光泽上。',
            '呼吸法：配合深呼吸，想象水晶的能量随呼吸进入身体。'
          ]
        }
      ]
    }
  };





  // 处理冥想类型选择
  const handleMeditationTypeChange = (meditation: any) => {
    setSelectedMeditation(meditation);
    // 可选：自动切换到推荐的水晶
    // const recommendedCrystal = getRecommendedCrystalForMeditation(meditation.id);
    // setSelectedCrystal(recommendedCrystal);
  };

  // 个性化疗愈建议处理函数
  const handleDailyRecommendation = () => {
    setShowDailyRecommendation(true);
  };

  const handleMeditationReminder = () => {
    setShowMeditationReminder(true);
  };

  const handleEmergencyKit = () => {
    setShowEmergencyKit(true);
  };

  const handlePurificationRitual = () => {
    setShowPurificationRitual(true);
  };

  // 知识库处理函数
  const handleKnowledgeClick = (knowledgeKey: string) => {
    const knowledge = KNOWLEDGE_DATABASE[knowledgeKey as keyof typeof KNOWLEDGE_DATABASE];
    if (knowledge) {
      setSelectedKnowledge(knowledge);
      setShowKnowledgeDetail(true);
    }
  };

  // 加载用户画像和生成3D能量模型
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        if (user) {
          // 从数据库加载用户画像
          const { profileService } = await import('@/lib/supabase');
          const savedProfile = await profileService.getUserProfileByEmail(user.email);

          if (savedProfile) {
            const profileData: UserProfileDataOutput = {
              name: savedProfile.name,
              coreEnergyInsights: savedProfile.personality_insights,
              inferredZodiac: savedProfile.zodiac_sign || '',
              inferredChineseZodiac: savedProfile.chinese_zodiac || '',
              inferredElement: savedProfile.element || '',
              inferredPlanet: '',
              mbtiLikeType: savedProfile.mbti || '',
              chakraAnalysis: savedProfile.chakra_analysis && typeof savedProfile.chakra_analysis === 'object' ?
                '您的脉轮能量分析已完成，请查看下方的脉轮能量图谱了解详细信息。' :
                (typeof savedProfile.chakra_analysis === 'string' ? savedProfile.chakra_analysis : ''),
            };

            setUserProfile(profileData);

            // 生成当前3D能量模型
            const energyModel = CrystalRecommendationService.generateCurrent3DEnergyModel(profileData);
            setCurrent3DEnergy(energyModel);

            console.log('✅ 用户画像加载成功:', profileData);
          } else {
            console.log('ℹ️ 未找到用户画像，将使用默认推荐');
          }
        }

        // 如果没有用户画像，生成默认的3D能量模型
        if (!userProfile) {
          const defaultEnergyModel = CrystalRecommendationService.generateCurrent3DEnergyModel();
          setCurrent3DEnergy(defaultEnergyModel);
        }
      } catch (error) {
        console.error('加载用户画像失败:', error);
        // 生成默认的3D能量模型
        const defaultEnergyModel = CrystalRecommendationService.generateCurrent3DEnergyModel();
        setCurrent3DEnergy(defaultEnergyModel);
      }
    };

    loadUserProfile();
  }, [user]);

  // 使用统一推荐算法 - 与智能推荐保持一致
  const getRecommendedCrystal = (mood: string) => {
    try {
      // 如果有用户画像和3D能量模型，使用智能推荐的第一个结果
      if (userProfile && current3DEnergy) {
        const intelligentRecommendations = CrystalRecommendationService.intelligentRecommendation(
          userProfile,
          current3DEnergy,
          1, // 只取第一个推荐
          mood
        );
        if (intelligentRecommendations && intelligentRecommendations.length > 0) {
          const crystalId = intelligentRecommendations[0].id;
          return CRYSTAL_DATABASE.find(crystal => crystal.id === crystalId) ||
                 EXTENDED_CRYSTALS[crystalId as keyof typeof EXTENDED_CRYSTALS] ||
                 CRYSTAL_DATABASE[0];
        }
      }

      // 降级到快速情绪推荐
      const recommendation = CrystalRecommendationService.quickMoodRecommendation(mood);
      if (recommendation) {
        return CRYSTAL_DATABASE.find(crystal => crystal.id === recommendation.id) || CRYSTAL_DATABASE[0];
      }
      return CRYSTAL_DATABASE[0]; // 默认返回紫水晶
    } catch (error) {
      console.error('Error getting recommended crystal:', error);
      return CRYSTAL_DATABASE[0];
    }
  };

  // 获取扩展推荐 - 使用智能推荐算法
  const getExtendedRecommendations = (mood: string) => {
    try {
      // 如果有用户画像和3D能量模型，使用智能推荐
      if (userProfile && current3DEnergy) {
        return CrystalRecommendationService.intelligentRecommendation(
          userProfile,
          current3DEnergy,
          4,
          mood // 传递当日情绪状态
        );
      }

      // 否则使用基础推荐
      return CrystalRecommendationService.extendedRecommendation({
        mood,
        maxRecommendations: 6
      }) || [];
    } catch (error) {
      console.error('Error getting extended recommendations:', error);
      return [];
    }
  };

  // 获取智能推荐（不依赖情绪状态）
  const getIntelligentRecommendations = () => {
    try {
      if (userProfile && current3DEnergy) {
        console.log('🧠 使用个人画像进行智能推荐:', {
          mbti: userProfile.mbtiLikeType,
          zodiac: userProfile.inferredZodiac,
          energyBalance: current3DEnergy.balance,
          currentMood: currentMood || '未选择'
        });
        return CrystalRecommendationService.intelligentRecommendation(
          userProfile,
          current3DEnergy,
          4,
          currentMood || undefined // 传递当前情绪状态
        );
      }

      // 降级到扩展水晶推荐
      return Object.values(EXTENDED_CRYSTALS).slice(0, 4).map(crystal => ({
        id: crystal.id,
        name: crystal.name,
        color: crystal.color,
        chakra: crystal.chakra,
        element: crystal.element,
        energyLevel: [...crystal.energyLevel],
        emotions: [...crystal.emotions],
        mbtiTypes: [...crystal.mbtiTypes],
        scientificBasis: crystal.scientificBasis || '基于传统水晶疗法',
        primaryEffects: [...(crystal.primaryEffects || ['平衡能量'])],
        usage: crystal.usage || '随身携带或放置在生活空间中',
        evidenceLevel: crystal.evidenceLevel,
        matchScore: crystal.matchScore || 75,
        reasons: crystal.primaryEffects || ['平衡能量'],
        confidence: 'medium' as const
      }));
    } catch (error) {
      console.error('Error getting intelligent recommendations:', error);
      return [];
    }
  };



  // 记录情绪
  const recordMood = (mood: string) => {
    setCurrentMood(mood);
    const recommendedCrystal = getRecommendedCrystal(mood);
    // 确保推荐的水晶与selectedCrystal的类型匹配
    const crystalData = CRYSTAL_DATABASE.find(crystal =>
      crystal.id === recommendedCrystal.id
    ) || CRYSTAL_DATABASE[0];
    setSelectedCrystal(crystalData);

    console.log('🎯 情绪选择推荐:', {
      mood,
      recommendedCrystal: recommendedCrystal.name,
      hasUserProfile: !!userProfile,
      has3DEnergy: !!current3DEnergy
    });

    const newRecord = {
      date: new Date().toISOString().split('T')[0],
      mood,
      crystal: recommendedCrystal.name
    };

    setMoodHistory(prev => [newRecord, ...prev.slice(0, 6)]);
  };

  // 冥想计时器
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && meditationTimer > 0) {
      interval = setInterval(() => {
        setMeditationTimer(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            if (soundEnabled) {
              // 这里可以播放结束音效
              console.log('冥想结束');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, meditationTimer, soundEnabled]);

  const startMeditation = (duration: number) => {
    setMeditationTimer(duration * 60);
    setIsTimerActive(true);
  };

  const pauseMeditation = () => {
    setIsTimerActive(!isTimerActive);
  };

  const resetMeditation = () => {
    setIsTimerActive(false);
    setMeditationTimer(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 弹窗组件
  const DailyRecommendationModal = () => (
    showDailyRecommendation && (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Gem className="h-5 w-5 text-primary" />
              每日水晶携带建议
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowDailyRecommendation(false)}>
              ✕
            </Button>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              根据您最近的情绪模式分析，为您推荐以下水晶：
            </p>
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl text-primary">◆</span>
                <div>
                  <h4 className="font-medium">紫水晶</h4>
                  <p className="text-xs text-muted-foreground">缓解压力，提升专注力</p>
                </div>
              </div>
              <p className="text-sm text-foreground">建议携带时间：上午9点-下午6点</p>
            </div>
            <Button className="w-full" onClick={() => setShowDailyRecommendation(false)}>
              了解更多水晶
            </Button>
          </div>
        </div>
      </div>
    )
  );

  const MeditationReminderModal = () => (
    showMeditationReminder && (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              冥想提醒设置
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowMeditationReminder(false)}>
              ✕
            </Button>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              设置个性化的冥想提醒，帮助您建立规律的练习习惯：
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <span className="text-sm font-medium">晨间冥想</span>
                <span className="text-sm text-muted-foreground">08:00</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <span className="text-sm font-medium">午间放松</span>
                <span className="text-sm text-muted-foreground">12:30</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <span className="text-sm font-medium">晚间冥想</span>
                <span className="text-sm text-muted-foreground">21:00</span>
              </div>
            </div>
            <Button className="w-full" onClick={() => setShowMeditationReminder(false)}>
              保存设置
            </Button>
          </div>
        </div>
      </div>
    )
  );

  const EmergencyKitModal = () => (
    showEmergencyKit && (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-destructive" />
              情绪急救包
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowEmergencyKit(false)}>
              ✕
            </Button>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              为突发的负面情绪准备快速疗愈方案：
            </p>
            <div className="space-y-3">
              <div className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg text-destructive">⚡</span>
                  <div>
                    <h4 className="font-medium text-sm">压力过大</h4>
                    <p className="text-xs text-muted-foreground">3分钟呼吸冥想 + 紫水晶</p>
                  </div>
                </div>
              </div>
              <div className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg text-secondary-foreground">◈</span>
                  <div>
                    <h4 className="font-medium text-sm">焦虑不安</h4>
                    <p className="text-xs text-muted-foreground">5分钟正念练习 + 天使石</p>
                  </div>
                </div>
              </div>
            </div>
            <Button className="w-full" onClick={() => setShowEmergencyKit(false)}>
              开始急救练习
            </Button>
          </div>
        </div>
      </div>
    )
  );

  const PurificationRitualModal = () => (
    showPurificationRitual && (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              能量净化仪式
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowPurificationRitual(false)}>
              ✕
            </Button>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              定期进行能量净化，保持身心平衡：
            </p>
            <div className="space-y-3">
              <div className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <h4 className="font-medium text-sm mb-2">月光净化</h4>
                <p className="text-xs text-muted-foreground">将水晶放在月光下过夜</p>
              </div>
              <div className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <h4 className="font-medium text-sm mb-2">流水净化</h4>
                <p className="text-xs text-muted-foreground">用清水冲洗水晶1-2分钟</p>
              </div>
              <div className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <h4 className="font-medium text-sm mb-2">音频净化</h4>
                <p className="text-xs text-muted-foreground">使用颂钵或冥想音乐净化</p>
              </div>
            </div>
            <Button className="w-full" onClick={() => setShowPurificationRitual(false)}>
              开始净化仪式
            </Button>
          </div>
        </div>
      </div>
    )
  );

  const KnowledgeDetailModal = () => (
    showKnowledgeDetail && selectedKnowledge && (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-lg">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <selectedKnowledge.icon className="h-6 w-6 text-primary" />
              {selectedKnowledge.title}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowKnowledgeDetail(false)}>
              ✕
            </Button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">{selectedKnowledge.category}</Badge>
              </div>
              {selectedKnowledge.sections.map((section: any, index: number) => (
                <div key={index} className="space-y-3">
                  <h4 className="text-lg font-semibold text-primary">{section.title}</h4>
                  <div className="space-y-2">
                    {section.content.map((paragraph: string, pIndex: number) => (
                      <p key={pIndex} className="text-sm text-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 border-t border-border">
            <Button className="w-full" onClick={() => setShowKnowledgeDetail(false)}>
              关闭
            </Button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* 弹窗组件 */}
      <DailyRecommendationModal />
      <MeditationReminderModal />
      <EmergencyKitModal />
      <PurificationRitualModal />
      <KnowledgeDetailModal />
      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-primary/10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold heading-enhanced mb-3 flex items-center justify-center gap-3">
              <Gem className="h-8 w-8 text-primary" />
              {t('crystalHealingPage.title')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('crystalHealingPage.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* 标签页导航 - 移动端优化 */}
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-2 rounded-2xl border border-primary/10">
            <TabsTrigger value="discover" className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">{t('crystalHealingPage.tabs.discover')}</span>
            </TabsTrigger>
            <TabsTrigger value="identify" className="flex items-center gap-2 text-sm">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">{t('crystalHealingPage.tabs.identify')}</span>
            </TabsTrigger>
            <TabsTrigger value="meditate" className="flex items-center gap-2 text-sm">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">{t('crystalHealingPage.tabs.meditate')}</span>
            </TabsTrigger>
            <TabsTrigger value="track" className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">{t('crystalHealingPage.tabs.track')}</span>
            </TabsTrigger>
          </TabsList>

          {/* 发现水晶标签页 */}
          <TabsContent value="discover" className="space-y-6">
            {/* 当前情绪选择 */}
            <Card className="quantum-card energy-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  {t('crystalHealingPage.discover.howDoYouFeel')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {MOOD_OPTIONS.map((mood) => (
                    <Button
                      key={mood.id}
                      variant="ghost"
                      className={`h-auto p-4 flex flex-col items-center gap-3 transition-all duration-300 border-2 ${
                        currentMood === mood.id
                          ? `${mood.bgColor} ${mood.borderColor} ${mood.color} shadow-lg scale-105`
                          : `hover:${mood.bgColor} hover:${mood.borderColor} border-transparent hover:scale-102`
                      }`}
                      onClick={() => recordMood(mood.id)}
                    >
                      <div className={`text-3xl font-light ${currentMood === mood.id ? mood.color : 'text-muted-foreground'} transition-colors duration-300`}>
                        {mood.icon}
                      </div>
                      <span className={`text-sm font-medium ${currentMood === mood.id ? mood.color : 'text-muted-foreground'} transition-colors duration-300`}>
                        {mood.label}
                      </span>
                    </Button>
                  ))}
                </div>

                {currentMood && (
                  <div className="mt-6 p-8 bg-gradient-to-br from-primary/8 via-secondary/8 to-accent/8 rounded-2xl border border-primary/20 shadow-lg backdrop-blur-sm">
                    <p className="text-sm text-foreground/70 mb-6 text-center font-medium">{t('crystalHealingPage.discover.basedOnMood')}</p>

                    {/* 水晶主要信息 */}
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                      <div className={`flex items-center justify-center w-24 h-24 rounded-full ${selectedCrystal.iconData?.bgColor} flex-shrink-0 shadow-xl`}>
                        <span className={`text-4xl ${selectedCrystal.iconData?.color}`}>{selectedCrystal.image}</span>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-3xl font-bold text-foreground mb-3 drop-shadow-sm">{selectedCrystal.name}</h3>
                        <p className="text-base text-foreground/80 mb-4 leading-relaxed max-w-2xl">{selectedCrystal.description}</p>

                        {/* 基本属性 */}
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                          <div className="flex items-center gap-2 px-3 py-2 bg-primary/20 rounded-full border border-primary/30">
                            <Target className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold text-foreground">{selectedCrystal.chakra}</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 bg-secondary/20 rounded-full border border-secondary/30">
                            <Sparkles className="h-4 w-4 text-secondary" />
                            <span className="text-sm font-semibold text-foreground">{selectedCrystal.element}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 疗愈功效 */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center justify-center md:justify-start gap-2">
                        <Sparkles className="h-5 w-5 text-secondary" />
                        {t('crystalHealingPage.discover.healingEffects')}
                      </h4>
                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        {(selectedCrystal.properties || []).map((property, index) => (
                          <span key={index} className="text-sm px-4 py-2 bg-secondary/20 text-foreground rounded-full font-medium border border-secondary/30 hover:bg-secondary/30 transition-colors">
                            {property}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 使用方法和科学原理 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                      <div className="p-6 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl border border-accent/20">
                        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-accent" />
                          {t('crystalHealingPage.discover.usageMethod')}
                        </h4>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {selectedCrystal.usage}
                        </p>
                      </div>

                      <div className="p-6 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-xl border border-accent/20">
                        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                          <Brain className="h-5 w-5 text-accent" />
                          {t('crystalHealingPage.discover.scientificPrinciple')}
                        </h4>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {selectedCrystal.scientificBasis}
                        </p>
                      </div>
                    </div>

                    {/* 行动建议 */}
                    <div className="p-6 bg-gradient-to-r from-accent/12 to-primary/12 rounded-xl border border-accent/25 backdrop-blur-sm">
                      <h4 className="text-lg font-semibold text-foreground mb-6 flex items-center justify-center gap-2">
                        <Star className="h-5 w-5 text-accent" />
                        {t('crystalHealingPage.discover.todaysSuggestion')}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 hover:shadow-lg transition-shadow">
                          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-primary/20 rounded-full">
                            <Brain className="h-6 w-6 text-primary" />
                          </div>
                          <p className="text-sm font-semibold text-foreground mb-2">{t('crystalHealingPage.discover.morningMeditation')}</p>
                          <p className="text-xs text-foreground/70">{t('crystalHealingPage.discover.holdCrystalMeditate')}</p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl border border-secondary/20 hover:shadow-lg transition-shadow">
                          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-secondary/20 rounded-full">
                            <Gem className="h-6 w-6 text-secondary" />
                          </div>
                          <p className="text-sm font-semibold text-foreground mb-2">{t('crystalHealingPage.discover.carryWithYou')}</p>
                          <p className="text-xs text-foreground/70">{t('crystalHealingPage.discover.putInPocketOrBag')}</p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20 hover:shadow-lg transition-shadow">
                          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-accent/20 rounded-full">
                            <Moon className="h-6 w-6 text-accent" />
                          </div>
                          <p className="text-sm font-semibold text-foreground mb-2">{t('crystalHealingPage.discover.bedtimeCleansing')}</p>
                          <p className="text-xs text-foreground/70">{t('crystalHealingPage.discover.cleanseCrystalInMoonlight')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>



            {/* 智能推荐系统 */}
            <Card className="quantum-card energy-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {t('crystalHealingPage.intelligentRecommendation.title')}
                  {userProfile && (
                    <Badge variant="secondary" className="text-xs">
                      {t('crystalHealingPage.intelligentRecommendation.personalized')}
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-foreground/70 mt-2">
                  {currentMood
                    ? `基于您今日的${MOOD_OPTIONS.find(m => m.id === currentMood)?.label || '情绪'}状态和个人能量画像，为您推荐最适合的疗愈水晶`
                    : '基于您的个人能量画像和当前3D能量状态，为您推荐最适合的疗愈水晶'
                  }
                </p>
              </CardHeader>
              <CardContent>
                {/* 用户画像提示 */}
                {user && !userProfile && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-warning/10 to-secondary/10 rounded-lg border border-warning/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-warning/20 rounded-full p-2">
                        <Brain className="h-5 w-5 text-warning" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-warning">完善您的能量画像</h4>
                        <p className="text-sm text-muted-foreground">
                          完成能量画像测试，获得基于您个人特质的精准水晶推荐
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push('/energy-exploration')}
                      className="bg-gradient-to-r from-warning to-secondary hover:from-warning/90 hover:to-secondary/90"
                      size="sm"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {t('crystalHealingPage.intelligentRecommendation.startEnergyTest')}
                    </Button>
                  </div>
                )}

                {/* 当前能量状态显示 */}
                {current3DEnergy && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      当前能量状态
                      {userProfile && (
                        <Badge variant="secondary" className="text-xs">
                          个性化
                        </Badge>
                      )}
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">{Math.round(current3DEnergy.physical)}</div>
                        <div className="text-xs text-muted-foreground">身体能量</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-secondary">{Math.round(current3DEnergy.mental)}</div>
                        <div className="text-xs text-muted-foreground">心理能量</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">{Math.round(current3DEnergy.spiritual)}</div>
                        <div className="text-xs text-muted-foreground">精神能量</div>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <div className="text-sm text-muted-foreground">
                        平衡指数: <span className="font-medium">{Math.round(current3DEnergy.balance)}</span> |
                        趋势: <span className="font-medium">
                          {current3DEnergy.trend === 'rising' ? '上升' :
                           current3DEnergy.trend === 'declining' ? '下降' : '稳定'}
                        </span> |
                        时段: <span className="font-medium">
                          {current3DEnergy.timeOfDay === 'morning' ? '晨间' :
                           current3DEnergy.timeOfDay === 'afternoon' ? '午后' :
                           current3DEnergy.timeOfDay === 'evening' ? '傍晚' : '夜间'}
                        </span>
                        {currentMood && (
                          <>
                            {' | '}
                            今日状态: <span className="font-medium text-primary">
                              {MOOD_OPTIONS.find(m => m.id === currentMood)?.label || currentMood}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 智能推荐内容 */}
                <div className="mb-6">
                  <div className="space-y-4">
                    {/* 类别选择 */}
                    <div className="flex flex-wrap gap-2">
                        {[
                          { id: '', label: '全部', icon: '◇', color: 'text-muted-foreground', bgColor: 'bg-muted/30' },
                          { id: 'emotional_healing', label: '情绪疗愈', icon: '♥', color: 'text-secondary', bgColor: 'bg-secondary/10' },
                          { id: 'communication', label: '沟通表达', icon: '◈', color: 'text-primary', bgColor: 'bg-primary/10' },
                          { id: 'protection', label: '保护能量', icon: '◉', color: 'text-accent', bgColor: 'bg-accent/10' },
                          { id: 'spiritual_growth', label: '心灵成长', icon: '✦', color: 'text-primary', bgColor: 'bg-primary/15' }
                        ].map((category) => (
                          <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center gap-2 transition-all duration-300 ${
                              selectedCategory === category.id
                                ? `${category.bgColor} ${category.color} border-2 border-current shadow-sm`
                                : `hover:${category.bgColor} hover:${category.color}`
                            }`}
                          >
                            <span className={selectedCategory === category.id ? category.color : 'text-muted-foreground'}>{category.icon}</span>
                            <span>{category.label}</span>
                          </Button>
                        ))}
                      </div>

                      {/* 推荐结果 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(() => {
                          let recommendations = [];

                          if (selectedCategory && selectedCategory !== '') {
                            // 根据类别筛选推荐
                            recommendations = Object.values(EXTENDED_CRYSTALS)
                              .filter(crystal => {
                                const effects = crystal.primaryEffects || [];
                                switch (selectedCategory) {
                                  case 'emotional_healing':
                                    return effects.some(effect => effect.includes('情绪') || effect.includes('平静') || effect.includes('安抚'));
                                  case 'communication':
                                    return effects.some(effect => effect.includes('沟通') || effect.includes('表达') || effect.includes('交流'));
                                  case 'protection':
                                    return effects.some(effect => effect.includes('保护') || effect.includes('防护') || effect.includes('净化'));
                                  case 'spiritual_growth':
                                    return effects.some(effect => effect.includes('灵性') || effect.includes('直觉') || effect.includes('冥想'));
                                  default:
                                    return true;
                                }
                              })
                              .slice(0, 4)
                              .map(crystal => ({
                                crystal,
                                matchScore: crystal.matchScore || 85,
                                reasons: crystal.primaryEffects,
                                usage: crystal.usage,
                                scientificBasis: crystal.scientificBasis,
                                confidence: 'medium' as const
                              }));
                          } else if (currentMood) {
                            recommendations = getExtendedRecommendations(currentMood);
                          } else {
                            // 优先使用智能推荐
                            recommendations = getIntelligentRecommendations();
                            console.log('🔮 使用智能推荐算法，推荐数量:', recommendations.length);
                          }

                          return (recommendations || []).map((recommendation, index) => {
                            const recId = 'id' in recommendation ? recommendation.id : (recommendation as any).crystal?.id || `rec-${index}`;
                            const recName = 'name' in recommendation ? recommendation.name : (recommendation as any).crystal?.name || '未知水晶';

                            return (
                          <div
                            key={recId}
                            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 cursor-pointer hover:bg-muted/30"
                            onClick={() => {
                              // 查找对应的水晶数据
                              const crystalData = CRYSTAL_DATABASE.find(crystal =>
                                crystal.id === recId
                              ) || CRYSTAL_DATABASE[0];
                              setSelectedCrystal(crystalData);
                            }}
                          >
                            {/* 水晶图标 */}
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm text-primary">
                                {getCrystalIcon(recId).symbol}
                              </span>
                            </div>

                            {/* 水晶信息 */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-sm text-foreground truncate">{recName}</h5>
                                <span className="text-xs text-primary font-medium ml-2">{Math.round(recommendation.matchScore)}%</span>
                              </div>
                              <p className="text-xs text-foreground/60 mb-1">{(recommendation as any).englishName || ''}</p>
                              {recommendation.reasons && recommendation.reasons.length > 0 && (
                                <p className="text-xs text-foreground/70 truncate">{recommendation.reasons[0]}</p>
                              )}
                            </div>
                          </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                </div>

                {/* 探索完整数据库按钮 */}
                <div className="text-center">
                  <Button
                    onClick={() => router.push('/crystal-database')}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    {t('crystalHealingPage.intelligentRecommendation.exploreDatabase', { count: Object.keys(crystalTypeMapping).length })}
                  </Button>
                  <p className="text-xs text-foreground/60 mt-2">
                    包含详细的疗愈属性、脉轮对应、使用指导等信息
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 水晶识别标签页 */}
          <TabsContent value="identify" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  {t('crystalHealingPage.identify.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="border-2 border-dashed border-muted rounded-lg p-12">
                  <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('crystalHealingPage.identify.photoIdentify')}</h3>
                  <p className="text-muted-foreground mb-6">
                    {t('crystalHealingPage.identify.description')}
                  </p>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary"
                    onClick={() => setIsIdentifying(true)}
                    disabled={isIdentifying}
                  >
                    {isIdentifying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('crystalHealingPage.identify.identifying')}
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        {t('crystalHealingPage.identify.startIdentify')}
                      </>
                    )}
                  </Button>
                </div>

                {/* 识别历史 */}
                <div className="text-left">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-secondary" />
                    {t('crystalHealingPage.identify.history')}
                  </h4>
                  <div className="space-y-3">
                    {[
                      {
                        name: '紫水晶',
                        confidence: 95,
                        date: '今天 14:30',
                        ...getCrystalIcon('amethyst')
                      },
                      {
                        name: '玫瑰石英',
                        confidence: 88,
                        date: '昨天 09:15',
                        ...getCrystalIcon('rose_quartz')
                      },
                      {
                        name: '白水晶',
                        confidence: 92,
                        date: '2天前',
                        ...getCrystalIcon('clear_quartz')
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${item.bgColor}`}>
                            <span className={`text-lg ${item.color}`}>{item.symbol}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.date}</p>
                          </div>
                        </div>
                        <Badge variant={parseInt(item.confidence.toString()) > 90 ? "default" : "secondary"} className="text-xs">
                          {item.confidence}% {t('crystalHealingPage.identify.match')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 水晶知识库 */}
            <Card className="quantum-card energy-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-accent" />
                  {t('crystalHealingPage.identify.knowledgeBase')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      key: 'crystal_formation',
                      title: '水晶的形成',
                      description: '了解水晶在地球深处的形成过程',
                      icon: Target,
                      color: 'text-primary',
                      bgColor: 'bg-muted/50',
                      category: '基础知识'
                    },
                    {
                      key: 'chakra_crystals',
                      title: '脉轮与水晶',
                      description: '七大脉轮与对应水晶的关系',
                      icon: Zap,
                      color: 'text-primary',
                      bgColor: 'bg-muted/50',
                      category: '能量系统'
                    },
                    {
                      key: 'crystal_cleansing',
                      title: '水晶净化方法',
                      description: '如何正确清洁和净化您的水晶',
                      icon: Sparkles,
                      color: 'text-primary',
                      bgColor: 'bg-muted/50',
                      category: '护理指南'
                    },
                    {
                      key: 'meditation_crystals',
                      title: '冥想与水晶',
                      description: '在冥想中使用水晶的技巧',
                      icon: Brain,
                      color: 'text-primary',
                      bgColor: 'bg-muted/50',
                      category: '实践方法'
                    }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 border border-border rounded-lg hover:border-primary/50 transition-all duration-200 cursor-pointer hover:bg-muted/30"
                      onClick={() => handleKnowledgeClick(item.key)}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-foreground/60 truncate">{item.description}</p>
                      </div>
                      <span className="text-xs text-foreground/50 px-2 py-1 bg-muted/50 rounded">{item.category}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 冥想指导标签页 */}
          <TabsContent value="meditate" className="space-y-6">
            {/* 冥想计时器 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  {t('crystalHealingPage.meditate.timer')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                {/* 计时器显示 */}
                <div className="relative">
                  <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-primary/15 via-secondary/15 to-accent/15 flex items-center justify-center border-4 border-primary/40 shadow-lg">
                    <div className="text-center">
                      <div className="text-4xl font-bold energy-gradient bg-clip-text text-transparent mb-2">
                        {formatTime(meditationTimer)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedMeditation.name}
                      </div>
                    </div>
                  </div>

                  {/* 进度环 */}
                  {meditationTimer > 0 && (
                    <div className="absolute inset-0 w-48 h-48 mx-auto">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-primary/20"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          strokeDashoffset={`${2 * Math.PI * 45 * (1 - (selectedMeditation.duration * 60 - meditationTimer) / (selectedMeditation.duration * 60))}`}
                          className="text-primary transition-all duration-1000"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* 控制按钮 */}
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={pauseMeditation}
                    disabled={meditationTimer === 0}
                  >
                    {isTimerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={resetMeditation}
                    disabled={meditationTimer === 0}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowAudioPanel(!showAudioPanel)}
                  >
                    <Headphones className="h-4 w-4" />
                  </Button>
                </div>

                {/* 音频推荐面板 */}
                {showAudioPanel && (
                  <div className="p-4 bg-card/90 backdrop-blur-sm rounded-lg border border-border shadow-lg">
                    <AudioRecommendationDisplay
                      recommendedAudio={selectedMeditation.recommendedAudio || []}
                      compact={true}
                    />
                  </div>
                )}

                {/* 冥想类型选择 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MEDITATION_TYPES.map((meditation) => (
                    <div
                      key={meditation.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedMeditation.id === meditation.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-muted/30'
                      }`}
                      onClick={() => handleMeditationTypeChange(meditation)}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm text-primary">{meditation.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground mb-1">{meditation.name}</h4>
                        <p className="text-xs text-foreground/60 truncate">{meditation.description}</p>
                      </div>
                      <span className="text-xs text-primary font-medium px-2 py-1 bg-primary/10 rounded">
                        {meditation.duration}分钟
                      </span>
                    </div>
                  ))}
                </div>

                {/* 开始冥想按钮 */}
                {meditationTimer === 0 && (
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary via-secondary to-accent px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => startMeditation(selectedMeditation.duration)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    开始 {selectedMeditation.name}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* 冥想指导 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-secondary" />
                  {selectedMeditation.name} - 冥想指导
                </CardTitle>
                <p className="text-sm text-foreground/70 mt-1">
                  {selectedMeditation.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-sm">准备阶段</h4>
                    </div>
                    <ul className="text-sm text-foreground/70 space-y-1 ml-6">
                      {MEDITATION_GUIDES[selectedMeditation.id as keyof typeof MEDITATION_GUIDES]?.preparation.map((step, index) => (
                        <li key={index}>• {step}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-border pt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-sm">冥想过程</h4>
                    </div>
                    <ul className="text-sm text-foreground/70 space-y-1 ml-6">
                      {MEDITATION_GUIDES[selectedMeditation.id as keyof typeof MEDITATION_GUIDES]?.process.map((step, index) => (
                        <li key={index}>• {step}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-border pt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-sm">结束阶段</h4>
                    </div>
                    <ul className="text-sm text-foreground/70 space-y-1 ml-6">
                      {MEDITATION_GUIDES[selectedMeditation.id as keyof typeof MEDITATION_GUIDES]?.ending.map((step, index) => (
                        <li key={index}>• {step}</li>
                      ))}
                    </ul>
                  </div>

                  {/* 水晶建议 */}
                  <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Gem className="h-4 w-4 text-primary" />
                      推荐水晶：{getRecommendedCrystalForMeditation(selectedMeditation.id).name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {getRecommendedCrystalForMeditation(selectedMeditation.id).scientificBasis}
                    </p>
                    {selectedCrystal.name !== getRecommendedCrystalForMeditation(selectedMeditation.id).name && (
                      <div className="mt-2 p-2 bg-muted/50 rounded border border-border">
                        <p className="text-xs text-muted-foreground mb-2">
                          💡 当前选择的{selectedCrystal.name}也很适合，但{getRecommendedCrystalForMeditation(selectedMeditation.id).name}可能更匹配此冥想类型
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-6 px-2"
                          onClick={() => {
                            const recommended = getRecommendedCrystalForMeditation(selectedMeditation.id);
                            const crystalFromDB = CRYSTAL_DATABASE.find(c => c.id === recommended.id);
                            if (crystalFromDB) setSelectedCrystal(crystalFromDB);
                          }}
                        >
                          切换到推荐水晶
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 情绪追踪标签页 */}
          <TabsContent value="track" className="space-y-6">
            {/* 情绪趋势 */}
            <Card className="quantum-card energy-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  情绪趋势分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                {moodHistory.length > 0 ? (
                  <div className="space-y-6">
                    {/* 最近记录 - 简洁版 */}
                    <div>
                      <h4 className="font-medium mb-3 text-sm text-muted-foreground">最近记录</h4>
                      <div className="space-y-2">
                        {moodHistory.map((record, index) => {
                          const moodOption = MOOD_OPTIONS.find(m => m.id === record.mood);
                          return (
                            <div key={index} className="flex items-center justify-between py-2 px-3 hover:bg-muted/50 rounded-md transition-colors">
                              <div className="flex items-center gap-3">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${moodOption?.bgColor}`}>
                                  <span className={`text-base ${moodOption?.color}`}>{moodOption?.icon}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">{moodOption?.label}</span>
                                  <span className="text-xs text-muted-foreground">{record.date}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-sm text-foreground">{record.crystal}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 情绪统计 - 简洁版 */}
                    <div>
                      <h4 className="font-medium mb-3 text-sm text-muted-foreground">情绪分布</h4>
                      <div className="space-y-2">
                        {MOOD_OPTIONS.map((mood) => {
                          const count = moodHistory.filter(record => record.mood === mood.id).length;
                          const percentage = moodHistory.length > 0 ? (count / moodHistory.length) * 100 : 0;

                          return (
                            <div key={mood.id} className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-3">
                                <div className={`flex items-center justify-center w-7 h-7 rounded-full ${mood.bgColor}`}>
                                  <span className={`text-sm ${mood.color}`}>{mood.icon}</span>
                                </div>
                                <span className="text-sm font-medium">{mood.label}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground min-w-[30px] text-right">{count}次</span>
                                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-base font-medium mb-2">开始记录您的情绪</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      记录每日情绪状态，了解自己的情绪模式
                    </p>
                    <Button
                      onClick={() => setActiveTab('discover')}
                      size="sm"
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    >
                      开始记录
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 疗愈建议 */}
            <Card className="quantum-card energy-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-warning" />
                  个性化疗愈建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: '每日水晶携带',
                      description: '根据您的情绪模式，建议每日携带相应的水晶',
                      icon: Gem,
                      color: 'text-primary',
                      bgColor: 'bg-primary/10',
                      action: '查看推荐',
                      handler: handleDailyRecommendation
                    },
                    {
                      title: '冥想提醒设置',
                      description: '设置个性化的冥想提醒，保持规律的练习',
                      icon: Clock,
                      color: 'text-secondary',
                      bgColor: 'bg-secondary/10',
                      action: '设置提醒',
                      handler: handleMeditationReminder
                    },
                    {
                      title: '情绪急救包',
                      description: '为突发的负面情绪准备快速疗愈方案',
                      icon: Shield,
                      color: 'text-destructive',
                      bgColor: 'bg-destructive/10',
                      action: '创建急救包',
                      handler: handleEmergencyKit
                    },
                    {
                      title: '能量净化仪式',
                      description: '定期进行能量净化，保持身心平衡',
                      icon: Sparkles,
                      color: 'text-accent',
                      bgColor: 'bg-accent/10',
                      action: '学习仪式',
                      handler: handlePurificationRitual
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:border-primary/50 transition-all duration-200 hover:bg-muted/30">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-foreground/60 truncate">{item.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={item.handler}
                        className="text-xs h-7 flex-shrink-0"
                      >
                        {item.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 科学声明 */}
            <Card className="quantum-card energy-card border-warning/20 bg-warning/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <Brain className="h-5 w-5" />
                  科学声明
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  水晶疗愈系统基于<strong>色彩心理学</strong>、<strong>触觉疗法</strong>、<strong>正念冥想</strong>和<strong>积极心理学</strong>的科学原理。
                  水晶的疗愈效果主要来自于视觉刺激、触觉感受、仪式感和正念练习，这些都是有科学依据的心理和生理机制。
                  本系统旨在通过结构化的方法帮助您建立健康的情绪管理习惯。
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
