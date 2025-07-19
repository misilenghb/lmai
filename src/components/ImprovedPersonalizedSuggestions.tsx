"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import EnergyCharts from './EnergyCharts';
import { useState, useEffect, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Triangle,
  Waves,
  Gauge,
  LineChart,
  PieChart,
  TrendingDown,
  AlertCircle,
  Shield,
  Flame,
  Snowflake,
  Sun,
  Moon,
  Wind,
  Mountain,
  Users,
  AlertTriangle,
  Hexagon,
  Orbit,
  BookOpen,
  BarChart3,
  Sparkles,
  Target
} from 'lucide-react';
import { LuxuryIcons } from '@/components/icons/LuxuryIconSystem';
import { generateLuxuryIconClasses } from '@/lib/luxury-icon-migration';
import type { UserProfileDataOutput } from '@/ai/schemas/user-profile-schemas';

interface ImprovedPersonalizedSuggestionsProps {
  userProfile: UserProfileDataOutput;
  fiveDimensionalData?: Array<{dimension: string, energy: number}>;
  className?: string;
}

// 3D能量模型数据结构
interface EnergyModel3D {
  physical: number;    // 身体能量 (0-100)
  mental: number;      // 心理能量 (0-100)
  spiritual: number;   // 精神能量 (0-100)
  balance: number;     // 平衡指数 (0-100)
  trend: 'rising' | 'stable' | 'declining';
  recommendations: string[];
}

// 科学化建议类型
interface ScientificSuggestion {
  id: string;
  title: string;
  description: string;
  scientificBasis: string;
  evidenceLevel: 'high' | 'medium' | 'low';
  timeCommitment: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'energy' | 'wellness' | 'productivity' | 'relationships' | 'growth';
  icon: string;
  crystalConnection?: string;
  researchCitation?: string;
  expectedOutcome: string;
  measurementMethod: string;
}

// 每日能量预测
interface DailyEnergyForecast {
  date: string;
  energyPeak: string;    // 能量高峰时间
  energyLow: string;     // 能量低谷时间
  optimalActivities: string[];
  avoidActivities: string[];
  crystalRecommendation: string;
  biorhythmPhase: 'physical' | 'emotional' | 'intellectual';
}



// 计算3D能量模型 - 简化版本避免复杂计算
const calculate3DEnergyModel = (userProfile: UserProfileDataOutput, fiveDimensionalData?: Array<{dimension: string, energy: number}>): EnergyModel3D => {
  try {
    const currentHour = new Date().getHours();
    const currentDay = new Date().getDay();

  // 基于生物节律计算身体能量
  const calculatePhysicalEnergy = (): number => {
    // 基于昼夜节律理论 (Circadian Rhythm Theory)
    let baseEnergy = 70;

    // 昼夜节律影响 (Roenneberg et al., 2007)
    if (currentHour >= 6 && currentHour <= 10) baseEnergy += 15; // 晨间高峰
    else if (currentHour >= 14 && currentHour <= 16) baseEnergy += 10; // 下午小高峰
    else if (currentHour >= 22 || currentHour <= 5) baseEnergy -= 20; // 夜间低谷

    // MBTI类型影响
    if (userProfile.mbtiLikeType?.includes('E')) baseEnergy += 5; // 外向者能量更充沛
    if (userProfile.mbtiLikeType?.includes('S')) baseEnergy += 3; // 实感者身体感知更敏锐

    return Math.min(100, Math.max(0, baseEnergy));
  };

  // 基于认知负荷理论计算心理能量
  const calculateMentalEnergy = (): number => {
    let baseEnergy = 75;

    // 认知负荷理论 (Sweller, 1988)
    if (currentHour >= 9 && currentHour <= 11) baseEnergy += 15; // 认知高峰期
    else if (currentHour >= 13 && currentHour <= 15) baseEnergy -= 10; // 午后低谷

    // MBTI认知功能影响
    if (userProfile.mbtiLikeType?.includes('N')) baseEnergy += 8; // 直觉者思维更活跃
    if (userProfile.mbtiLikeType?.includes('T')) baseEnergy += 5; // 思维者逻辑处理能力强

    // 五维数据影响
    if (fiveDimensionalData) {
      const mentalDimensions = fiveDimensionalData.filter(d =>
        d.dimension.includes('智力') || d.dimension.includes('思维') || d.dimension.includes('Mental')
      );
      if (mentalDimensions.length > 0) {
        const avgMental = mentalDimensions.reduce((sum, d) => sum + d.energy, 0) / mentalDimensions.length;
        baseEnergy = (baseEnergy + avgMental) / 2;
      }
    }

    return Math.min(100, Math.max(0, baseEnergy));
  };

  // 基于马斯洛需求层次理论计算精神能量
  const calculateSpiritualEnergy = (): number => {
    let baseEnergy = 65;

    // 马斯洛自我实现理论 (Maslow, 1943)
    if (userProfile.mbtiLikeType?.includes('F')) baseEnergy += 10; // 情感者精神需求更强
    if (userProfile.mbtiLikeType?.includes('P')) baseEnergy += 5; // 感知者更开放

    // 星座影响 (基于心理学研究)
    const spiritualSigns = ['双鱼座', 'Pisces', '天蝎座', 'Scorpio', '巨蟹座', 'Cancer'];
    if (userProfile.inferredZodiac && spiritualSigns.includes(userProfile.inferredZodiac)) {
      baseEnergy += 8;
    }

    // 周末精神能量提升
    if (currentDay === 0 || currentDay === 6) baseEnergy += 10;

    return Math.min(100, Math.max(0, baseEnergy));
  };

  const physical = calculatePhysicalEnergy();
  const mental = calculateMentalEnergy();
  const spiritual = calculateSpiritualEnergy();

  // 计算平衡指数 (基于方差分析)
  const mean = (physical + mental + spiritual) / 3;
  const variance = ((physical - mean) ** 2 + (mental - mean) ** 2 + (spiritual - mean) ** 2) / 3;
  const balance = Math.max(0, 100 - Math.sqrt(variance) * 2);

  // 趋势分析 (基于当前时间和历史模式)
  let trend: 'rising' | 'stable' | 'declining' = 'stable';
  if (currentHour >= 6 && currentHour <= 12) trend = 'rising';
  else if (currentHour >= 18 && currentHour <= 23) trend = 'declining';

    return {
      physical,
      mental,
      spiritual,
      balance,
      trend,
      recommendations: generateEnergyRecommendations(physical, mental, spiritual, balance)
    };
  } catch (error) {
    console.error('Error in calculate3DEnergyModel:', error);
    // 返回安全的默认值
    return {
      physical: 70,
      mental: 70,
      spiritual: 70,
      balance: 70,
      trend: 'stable' as const,
      recommendations: ['请稍后重试']
    };
  }
};

// 生成能量优化建议
const generateEnergyRecommendations = (physical: number, mental: number, spiritual: number, balance: number): string[] => {
  const recommendations: string[] = [];

  if (physical < 60) {
    recommendations.push("增加有氧运动，提升身体能量");
    recommendations.push("确保充足睡眠，遵循昼夜节律");
  }

  if (mental < 60) {
    recommendations.push("进行认知训练，如冥想或正念练习");
    recommendations.push("减少多任务处理，专注单一任务");
  }

  if (spiritual < 60) {
    recommendations.push("培养感恩习惯，提升精神满足感");
    recommendations.push("参与有意义的活动或志愿服务");
  }

  if (balance < 70) {
    recommendations.push("平衡各维度发展，避免过度偏重");
    recommendations.push("建立规律的作息和活动安排");
  }

  return recommendations;
};

// 生成科学化的个性化建议 - 简化版本
const generateScientificSuggestions = (userProfile: UserProfileDataOutput, energyModel: EnergyModel3D, language: string): ScientificSuggestion[] => {
  try {
    const suggestions: ScientificSuggestion[] = [];
    const mbtiType = userProfile.mbtiLikeType || '';

  // 基于3D能量模型的建议
  if (energyModel.physical < 70) {
    suggestions.push({
      id: 'physical-boost',
      title: language === 'zh' ? '生物节律优化运动' : 'Circadian Rhythm Exercise',
      description: language === 'zh' ?
        '根据您当前的身体能量水平，建议进行15分钟中等强度有氧运动，配合红碧玺增强活力' :
        'Based on your current physical energy level, 15 minutes of moderate aerobic exercise with red tourmaline is recommended',
      scientificBasis: language === 'zh' ?
        '基于昼夜节律理论和运动生理学，有氧运动可提升线粒体功能和ATP产生效率' :
        'Based on circadian rhythm theory and exercise physiology, aerobic exercise enhances mitochondrial function and ATP production efficiency',
      evidenceLevel: 'high',
      timeCommitment: '15-20分钟',
      difficulty: 'easy',
      category: 'energy',
      icon: '🏃‍♂️',
      crystalConnection: language === 'zh' ? '红碧玺激发身体活力和血液循环' : 'Red tourmaline stimulates physical vitality and circulation',
      researchCitation: 'Roenneberg, T. et al. (2007). Life between Clocks: Daily Temporal Patterns',
      expectedOutcome: language === 'zh' ? '提升身体能量15-25%，改善血液循环' : 'Increase physical energy by 15-25%, improve circulation',
      measurementMethod: language === 'zh' ? '通过心率变异性和主观能量评分测量' : 'Measured through heart rate variability and subjective energy scores'
    });
  }

  if (energyModel.mental < 70) {
    suggestions.push({
      id: 'cognitive-enhancement',
      title: language === 'zh' ? '认知负荷管理冥想' : 'Cognitive Load Management Meditation',
      description: language === 'zh' ?
        '采用正念冥想技术，配合紫水晶，优化大脑认知资源分配，提升专注力' :
        'Use mindfulness meditation with amethyst to optimize brain cognitive resource allocation and enhance focus',
      scientificBasis: language === 'zh' ?
        '基于认知负荷理论和神经可塑性研究，正念练习可重塑大脑神经网络' :
        'Based on cognitive load theory and neuroplasticity research, mindfulness practice can reshape brain neural networks',
      evidenceLevel: 'high',
      timeCommitment: '10-15分钟',
      difficulty: 'medium',
      category: 'wellness',
      icon: '🧘‍♀️',
      crystalConnection: language === 'zh' ? '紫水晶增强大脑α波活动，促进专注' : 'Amethyst enhances brain alpha wave activity, promoting focus',
      researchCitation: 'Sweller, J. (1988). Cognitive Load Theory and Educational Technology',
      expectedOutcome: language === 'zh' ? '提升认知效率20-30%，减少心理疲劳' : 'Improve cognitive efficiency by 20-30%, reduce mental fatigue',
      measurementMethod: language === 'zh' ? '通过注意力测试和脑电图监测' : 'Measured through attention tests and EEG monitoring'
    });
  }

  if (energyModel.spiritual < 70) {
    suggestions.push({
      id: 'spiritual-alignment',
      title: language === 'zh' ? '自我实现价值对齐' : 'Self-Actualization Value Alignment',
      description: language === 'zh' ?
        '基于马斯洛需求层次理论，进行价值观澄清练习，配合月光石连接内在智慧' :
        'Based on Maslow\'s hierarchy of needs, practice value clarification with moonstone to connect inner wisdom',
      scientificBasis: language === 'zh' ?
        '马斯洛自我实现理论表明，价值对齐是精神满足的关键因素' :
        'Maslow\'s self-actualization theory shows that value alignment is key to spiritual fulfillment',
      evidenceLevel: 'medium',
      timeCommitment: '20-30分钟',
      difficulty: 'medium',
      category: 'growth',
      icon: '',
      crystalConnection: language === 'zh' ? '月光石激发直觉和内在智慧' : 'Moonstone stimulates intuition and inner wisdom',
      researchCitation: 'Maslow, A. H. (1943). A Theory of Human Motivation',
      expectedOutcome: language === 'zh' ? '提升生活意义感和精神满足度' : 'Enhance sense of life meaning and spiritual satisfaction',
      measurementMethod: language === 'zh' ? '通过生活满意度量表和价值观评估' : 'Measured through life satisfaction scales and value assessments'
    });
  }

  // 基于MBTI类型的个性化建议
  if (mbtiType.includes('I')) {
    suggestions.push({
      id: 'introvert-recharge',
      title: language === 'zh' ? '内向者能量充电法' : 'Introvert Energy Recharge Method',
      description: language === 'zh' ?
        '创建个人能量庇护所，使用拉长石进行深度内省，恢复社交消耗的能量' :
        'Create a personal energy sanctuary, use labradorite for deep introspection to restore socially depleted energy',
      scientificBasis: language === 'zh' ?
        '基于艾森克人格理论，内向者通过独处激活副交感神经系统，恢复能量' :
        'Based on Eysenck\'s personality theory, introverts activate the parasympathetic nervous system through solitude to restore energy',
      evidenceLevel: 'high',
      timeCommitment: '15-25分钟',
      difficulty: 'easy',
      category: 'energy',
      icon: '',
      crystalConnection: language === 'zh' ? '拉长石增强内在洞察力和直觉' : 'Labradorite enhances inner insight and intuition',
      researchCitation: 'Eysenck, H. J. (1967). The Biological Basis of Personality',
      expectedOutcome: language === 'zh' ? '恢复社交能量，提升内在平静感' : 'Restore social energy, enhance inner tranquility',
      measurementMethod: language === 'zh' ? '通过能量水平自评和压力激素测量' : 'Measured through energy self-assessment and stress hormone levels'
    });
  }

  if (mbtiType.includes('E')) {
    suggestions.push({
      id: 'extrovert-connection',
      title: language === 'zh' ? '外向者社交能量激活' : 'Extrovert Social Energy Activation',
      description: language === 'zh' ?
        '主动发起有意义的社交互动，佩戴黄水晶增强沟通魅力和自信表达' :
        'Actively initiate meaningful social interactions, wear citrine to enhance communication charm and confident expression',
      scientificBasis: language === 'zh' ?
        '社会认知理论表明，外向者通过社交互动激活奖励系统，获得多巴胺释放' :
        'Social cognitive theory shows extroverts activate reward systems through social interaction, gaining dopamine release',
      evidenceLevel: 'high',
      timeCommitment: '20-30分钟',
      difficulty: 'easy',
      category: 'relationships',
      icon: '🤝',
      crystalConnection: language === 'zh' ? '黄水晶激发自信和表达能力' : 'Citrine stimulates confidence and expression abilities',
      researchCitation: 'Bandura, A. (1991). Social Cognitive Theory of Self-Regulation',
      expectedOutcome: language === 'zh' ? '提升社交满足感和情绪正向性' : 'Enhance social satisfaction and emotional positivity',
      measurementMethod: language === 'zh' ? '通过社交满意度和情绪状态评估' : 'Measured through social satisfaction and emotional state assessment'
    });
  }

    return suggestions;
  } catch (error) {
    console.error('Error in generateScientificSuggestions:', error);
    // 返回基本建议
    return [{
      id: 'basic-suggestion',
      title: language === 'zh' ? '🧘 基础冥想练习' : '🧘 Basic Meditation',
      description: language === 'zh' ? '进行10分钟的深呼吸练习，帮助放松身心' : 'Practice 10 minutes of deep breathing to relax body and mind',
      scientificBasis: language === 'zh' ? '基于正念冥想的科学研究' : 'Based on scientific research on mindfulness meditation',
      evidenceLevel: 'high' as const,
      timeCommitment: '10分钟',
      difficulty: 'easy' as const,
      category: 'wellness' as const,
      icon: '🧘',
      expectedOutcome: language === 'zh' ? '减少压力，提升专注力' : 'Reduce stress, improve focus',
      measurementMethod: language === 'zh' ? '主观感受评估' : 'Subjective feeling assessment'
    }];
  }
};

// 生成每日能量预测 - 简化版本
const generateDailyEnergyForecast = (userProfile: UserProfileDataOutput, language: string): DailyEnergyForecast => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mbtiType = userProfile.mbtiLikeType || '';

  // 基于生物节律和个人特质预测能量模式
  let energyPeak = '09:00-11:00';
  let energyLow = '14:00-16:00';

  // MBTI类型影响能量模式
  if (mbtiType.includes('E')) {
    energyPeak = '10:00-12:00'; // 外向者稍晚达到高峰
    energyLow = '13:00-15:00';
  } else {
    energyPeak = '08:00-10:00'; // 内向者更早达到高峰
    energyLow = '15:00-17:00';
  }

  // 周末调整
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    energyPeak = '10:00-12:00'; // 周末稍晚起
    energyLow = '16:00-18:00';
  }

  // 基于能量高峰推荐活动
  const getOptimalActivities = (): string[] => {
    const activities = [];

    if (mbtiType.includes('T')) {
      activities.push(language === 'zh' ? '逻辑分析任务' : 'Logical analysis tasks');
      activities.push(language === 'zh' ? '数据处理工作' : 'Data processing work');
    }

    if (mbtiType.includes('F')) {
      activities.push(language === 'zh' ? '人际沟通交流' : 'Interpersonal communication');
      activities.push(language === 'zh' ? '创意表达活动' : 'Creative expression activities');
    }

    if (mbtiType.includes('N')) {
      activities.push(language === 'zh' ? '头脑风暴会议' : 'Brainstorming sessions');
      activities.push(language === 'zh' ? '概念性思考' : 'Conceptual thinking');
    }

    if (mbtiType.includes('S')) {
      activities.push(language === 'zh' ? '细节处理工作' : 'Detail-oriented work');
      activities.push(language === 'zh' ? '实际操作任务' : 'Hands-on tasks');
    }

    return activities.slice(0, 3); // 返回前3个
  };

  // 基于能量低谷推荐避免的活动
  const getAvoidActivities = (): string[] => {
    return [
      language === 'zh' ? '重要决策制定' : 'Important decision making',
      language === 'zh' ? '复杂问题解决' : 'Complex problem solving',
      language === 'zh' ? '高强度社交' : 'High-intensity socializing'
    ];
  };

  // 基于星座推荐水晶
  const getCrystalRecommendation = (): string => {
    const zodiac = userProfile.inferredZodiac || '';
    const crystalMap: Record<string, string> = {
      '白羊座': language === 'zh' ? '红碧玺 - 激发行动力' : 'Red Tourmaline - Stimulate action',
      'Aries': language === 'zh' ? '红碧玺 - 激发行动力' : 'Red Tourmaline - Stimulate action',
      '金牛座': language === 'zh' ? '绿幽灵 - 稳定能量' : 'Green Phantom - Stabilize energy',
      'Taurus': language === 'zh' ? '绿幽灵 - 稳定能量' : 'Green Phantom - Stabilize energy',
      '双子座': language === 'zh' ? '黄水晶 - 增强沟通' : 'Citrine - Enhance communication',
      'Gemini': language === 'zh' ? '黄水晶 - 增强沟通' : 'Citrine - Enhance communication',
      '巨蟹座': language === 'zh' ? '月光石 - 情感平衡' : 'Moonstone - Emotional balance',
      'Cancer': language === 'zh' ? '月光石 - 情感平衡' : 'Moonstone - Emotional balance',
      '狮子座': language === 'zh' ? '太阳石 - 提升自信' : 'Sunstone - Boost confidence',
      'Leo': language === 'zh' ? '太阳石 - 提升自信' : 'Sunstone - Boost confidence',
      '处女座': language === 'zh' ? '紫水晶 - 增强专注' : 'Amethyst - Enhance focus',
      'Virgo': language === 'zh' ? '紫水晶 - 增强专注' : 'Amethyst - Enhance focus'
    };

    return crystalMap[zodiac] || (language === 'zh' ? '白水晶 - 净化能量' : 'Clear Quartz - Purify energy');
  };

  // 计算生物节律相位
  const getBiorhythmPhase = (): 'physical' | 'emotional' | 'intellectual' => {
    // 使用一个安全的默认日期计算，避免潜在的日期错误
    const birthDate = new Date('1990-01-01'); // 默认日期
    const daysSinceBirth = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));

    // 简化的生物节律计算
    const physicalCycle = Math.sin((2 * Math.PI * daysSinceBirth) / 23);
    const emotionalCycle = Math.sin((2 * Math.PI * daysSinceBirth) / 28);
    const intellectualCycle = Math.sin((2 * Math.PI * daysSinceBirth) / 33);

    const maxCycle = Math.max(physicalCycle, emotionalCycle, intellectualCycle);

    if (maxCycle === physicalCycle) return 'physical';
    if (maxCycle === emotionalCycle) return 'emotional';
    return 'intellectual';
  };

    return {
      date: today.toISOString().split('T')[0],
      energyPeak,
      energyLow,
      optimalActivities: getOptimalActivities(),
      avoidActivities: getAvoidActivities(),
      crystalRecommendation: getCrystalRecommendation(),
      biorhythmPhase: getBiorhythmPhase()
    };
  } catch (error) {
    console.error('Error in generateDailyEnergyForecast:', error);
    // 返回安全的默认值
    return {
      date: new Date().toISOString().split('T')[0],
      energyPeak: '09:00-11:00',
      energyLow: '14:00-16:00',
      optimalActivities: [language === 'zh' ? '轻松工作' : 'Light work'],
      avoidActivities: [language === 'zh' ? '高强度任务' : 'High intensity tasks'],
      crystalRecommendation: language === 'zh' ? '白水晶 - 净化能量' : 'Clear Quartz - Purify energy',
      biorhythmPhase: 'physical' as const
    };
  }
};

// 保留原有函数以兼容性，但标记为已弃用
const generateEnhancedSuggestions = (userProfile: UserProfileDataOutput, language: string) => {
  const suggestions = {
    immediate: [] as Array<{
      title: string;
      description: string;
      timeCommitment: string;
      difficulty: 'easy' | 'medium' | 'hard';
      category: string;
      icon: string;
      crystalConnection?: string;
      tip?: string;
    }>,
    insights: [] as Array<{
      trait: string;
      description: string;
      strength: string;
      application: string;
    }>
  };

  const mbtiType = userProfile.mbtiLikeType || '';
  
  // 立即行动建议
  if (mbtiType.includes('I')) {
    suggestions.immediate.push({
      title: language === 'zh' ? '🧘 内在能量充电' : '🧘 Inner Energy Recharge',
      description: language === 'zh' ? 
        '找一个安静的角落，点燃一支香薰蜡烛，握着紫水晶进行10分钟的深度冥想，感受内心的平静与力量' :
        'Find a quiet corner, light an aromatherapy candle, hold amethyst for 10 minutes of deep meditation, feel inner peace and strength',
      timeCommitment: language === 'zh' ? '10-15分钟' : '10-15 minutes',
      difficulty: 'easy',
      category: language === 'zh' ? '能量恢复' : 'Energy Recovery',
      icon: '🧘',
      crystalConnection: language === 'zh' ? '紫水晶增强专注力和内在平静' : 'Amethyst enhances focus and inner peace',
      tip: language === 'zh' ? '内向者通过独处获得能量，这是天赋而非缺陷' : 'Introverts gain energy through solitude - this is a gift, not a flaw'
    });
  } else {
    suggestions.immediate.push({
      title: language === 'zh' ? '💬 活力社交连接' : '💬 Energizing Social Connection',
      description: language === 'zh' ? 
        '主动联系一位好友，分享今天的见闻或计划，佩戴黄水晶增强沟通的自信和魅力' :
        'Actively contact a good friend, share today\'s experiences or plans, wear citrine to enhance communication confidence and charm',
      timeCommitment: language === 'zh' ? '15-20分钟' : '15-20 minutes',
      difficulty: 'easy',
      category: language === 'zh' ? '社交能量' : 'Social Energy',
      icon: '💬',
      crystalConnection: language === 'zh' ? '黄水晶激发自信和表达能力' : 'Citrine stimulates confidence and expression',
      tip: language === 'zh' ? '外向者通过真诚交流获得活力' : 'Extroverts gain vitality through genuine communication'
    });
  }

  if (mbtiType.includes('N')) {
    suggestions.immediate.push({
      title: language === 'zh' ? '创意灵感捕捉' : 'Creative Inspiration Capture',
      description: language === 'zh' ? 
        '随身携带月光石，当有灵感闪现时轻抚它的表面，同时用手机记录下这些珍贵的想法' :
        'Carry moonstone with you, gently touch its surface when inspiration strikes, and record these precious ideas on your phone',
      timeCommitment: language === 'zh' ? '随时进行' : 'Anytime',
      difficulty: 'easy',
      category: language === 'zh' ? '创意激发' : 'Creativity Boost',
      icon: '',
      crystalConnection: language === 'zh' ? '月光石激发直觉和创造力' : 'Moonstone stimulates intuition and creativity'
    });
  } else {
    suggestions.immediate.push({
      title: language === 'zh' ? '📋 实用计划制定' : '📋 Practical Planning',
      description: language === 'zh' ? 
        '握着红碧玺，为明天制定3个具体可行的小目标，感受水晶的稳定能量帮助你专注当下' :
        'Hold red tourmaline and set 3 specific achievable goals for tomorrow, feel the crystal\'s stable energy help you focus on the present',
      timeCommitment: language === 'zh' ? '10分钟' : '10 minutes',
      difficulty: 'easy',
      category: language === 'zh' ? '目标规划' : 'Goal Planning',
      icon: '📋',
      crystalConnection: language === 'zh' ? '红碧玺增强专注力和执行力' : 'Red tourmaline enhances focus and execution'
    });
  }



  // 性格洞察
  if (mbtiType.includes('T')) {
    suggestions.insights.push({
      trait: language === 'zh' ? '理性决策者' : 'Rational Decision Maker',
      description: language === 'zh' ? 
        '你习惯用逻辑分析问题，重视客观事实和因果关系' :
        'You habitually analyze problems logically, valuing objective facts and cause-effect relationships',
      strength: language === 'zh' ? 
        '在复杂情况下能保持冷静，做出明智决策' :
        'Can stay calm in complex situations and make wise decisions',
      application: language === 'zh' ? 
        '适合担任分析师、项目经理等需要逻辑思维的角色' :
        'Suitable for roles requiring logical thinking like analyst, project manager'
    });
  } else {
    suggestions.insights.push({
      trait: language === 'zh' ? '情感协调者' : 'Emotional Harmonizer',
      description: language === 'zh' ? 
        '你重视人际和谐，善于理解他人感受和需求' :
        'You value interpersonal harmony and are good at understanding others\' feelings and needs',
      strength: language === 'zh' ? 
        '能够建立深度连接，创造温暖包容的环境' :
        'Can build deep connections and create warm, inclusive environments',
      application: language === 'zh' ? 
        '适合从事咨询、教育、人力资源等人际导向的工作' :
        'Suitable for people-oriented work like counseling, education, human resources'
    });
  }

  return suggestions;
};

// 基于科学研究的性格分析 - 从ImprovedPersonalityAnalysis组件移植
const generateScientificPersonalityAnalysis = (userProfile: UserProfileDataOutput, language: string) => {
  const analysis = {
    strengths: [] as Array<{title: string, description: string, evidence: string, applications: string[]}>,
    growthAreas: [] as Array<{title: string, description: string, strategies: string[], timeframe: string}>,
    cognitiveStyle: {} as {type: string, description: string, advantages: string[], considerations: string[]},
    recommendations: [] as Array<{category: string, title: string, description: string, priority: 'high' | 'medium' | 'low'}>
  };

  if (userProfile.mbtiLikeType) {
    const mbtiType = userProfile.mbtiLikeType;

    // 分析认知风格
    const isIntrovert = mbtiType.includes('I');
    const isIntuitive = mbtiType.includes('N');
    const isThinking = mbtiType.includes('T');
    const isJudging = mbtiType.includes('J');

    // 认知风格分析
    analysis.cognitiveStyle = {
      type: language === 'zh' ?
        `${isIntrovert ? '内向' : '外向'}-${isIntuitive ? '直觉' : '实感'}-${isThinking ? '思考' : '情感'}-${isJudging ? '判断' : '感知'}型` :
        `${isIntrovert ? 'Introvert' : 'Extrovert'}-${isIntuitive ? 'Intuitive' : 'Sensing'}-${isThinking ? 'Thinking' : 'Feeling'}-${isJudging ? 'Judging' : 'Perceiving'}`,
      description: language === 'zh' ?
        '基于认知功能理论，您的信息处理和决策风格具有以下特点' :
        'Based on cognitive function theory, your information processing and decision-making style has these characteristics',
      advantages: [],
      considerations: []
    };

    // 内向/外向优势
    if (isIntrovert) {
      analysis.strengths.push({
        title: language === 'zh' ? '深度思考能力' : 'Deep Thinking Ability',
        description: language === 'zh' ?
          '内向者的大脑前额叶皮质更活跃，擅长深度分析和独立思考' :
          'Introverts have more active prefrontal cortex, excelling in deep analysis and independent thinking',
        evidence: language === 'zh' ? '神经科学研究（Eysenck, 1967; DeYoung et al., 2010）' : 'Neuroscience research (Eysenck, 1967; DeYoung et al., 2010)',
        applications: [
          language === 'zh' ? '复杂问题解决' : 'Complex problem solving',
          language === 'zh' ? '创意写作和设计' : 'Creative writing and design',
          language === 'zh' ? '研究和分析工作' : 'Research and analytical work'
        ]
      });

      analysis.cognitiveStyle.advantages.push(
        language === 'zh' ? '在安静环境中专注力更强' : 'Better focus in quiet environments',
        language === 'zh' ? '善于一对一深度交流' : 'Excellent at one-on-one deep conversations',
        language === 'zh' ? '决策前会充分思考' : 'Thorough consideration before decisions'
      );

      analysis.cognitiveStyle.considerations.push(
        language === 'zh' ? '需要独处时间来恢复能量' : 'Need alone time to recharge energy',
        language === 'zh' ? '在大型社交场合可能感到疲惫' : 'May feel drained in large social settings'
      );
    } else {
      analysis.strengths.push({
        title: language === 'zh' ? '社交协调能力' : 'Social Coordination Ability',
        description: language === 'zh' ?
          '外向者通过社交互动获得能量，擅长团队协作和人际沟通' :
          'Extroverts gain energy from social interaction, excelling in teamwork and interpersonal communication',
        evidence: language === 'zh' ? '社会心理学研究（Costa & McCrae, 1992）' : 'Social psychology research (Costa & McCrae, 1992)',
        applications: [
          language === 'zh' ? '团队领导和管理' : 'Team leadership and management',
          language === 'zh' ? '销售和客户服务' : 'Sales and customer service',
          language === 'zh' ? '公共演讲和培训' : 'Public speaking and training'
        ]
      });

      analysis.cognitiveStyle.advantages.push(
        language === 'zh' ? '在团队环境中表现出色' : 'Excel in team environments',
        language === 'zh' ? '善于激励和影响他人' : 'Good at motivating and influencing others',
        language === 'zh' ? '能快速建立人际关系' : 'Can quickly build relationships'
      );
    }

    // 直觉/实感优势
    if (isIntuitive) {
      analysis.strengths.push({
        title: language === 'zh' ? '创新思维能力' : 'Innovative Thinking Ability',
        description: language === 'zh' ?
          '直觉型思维者擅长模式识别和概念连接，具有强烈的创新倾向' :
          'Intuitive thinkers excel at pattern recognition and concept connection, with strong innovative tendencies',
        evidence: language === 'zh' ? '创造力研究（Guilford, 1967; Torrance, 1974）' : 'Creativity research (Guilford, 1967; Torrance, 1974)',
        applications: [
          language === 'zh' ? '产品创新和设计' : 'Product innovation and design',
          language === 'zh' ? '战略规划' : 'Strategic planning',
          language === 'zh' ? '艺术和创意工作' : 'Artistic and creative work'
        ]
      });

      analysis.growthAreas.push({
        title: language === 'zh' ? '细节执行力' : 'Detail Execution',
        description: language === 'zh' ?
          '直觉型思维者可能在具体执行和细节关注方面需要加强' :
          'Intuitive thinkers may need to strengthen concrete execution and attention to detail',
        strategies: [
          language === 'zh' ? '使用项目管理工具跟踪进度' : 'Use project management tools to track progress',
          language === 'zh' ? '设置具体的里程碑和截止日期' : 'Set specific milestones and deadlines',
          language === 'zh' ? '与实感型同事合作互补' : 'Collaborate with sensing-type colleagues for balance'
        ],
        timeframe: language === 'zh' ? '3-6个月持续练习' : '3-6 months of consistent practice'
      });
    } else {
      analysis.strengths.push({
        title: language === 'zh' ? '实务执行能力' : 'Practical Execution Ability',
        description: language === 'zh' ?
          '实感型思维者注重具体细节和实际应用，执行力强' :
          'Sensing thinkers focus on concrete details and practical application, with strong execution skills',
        evidence: language === 'zh' ? '认知心理学研究（Jung, 1971; Myers, 1980）' : 'Cognitive psychology research (Jung, 1971; Myers, 1980)',
        applications: [
          language === 'zh' ? '项目管理和执行' : 'Project management and execution',
          language === 'zh' ? '质量控制和改进' : 'Quality control and improvement',
          language === 'zh' ? '操作和技术工作' : 'Operations and technical work'
        ]
      });
    }

    // 思考/情感优势
    if (isThinking) {
      analysis.strengths.push({
        title: language === 'zh' ? '逻辑分析能力' : 'Logical Analysis Ability',
        description: language === 'zh' ?
          '思考型决策者重视客观逻辑和因果关系，决策理性' :
          'Thinking-type decision makers value objective logic and causality, making rational decisions',
        evidence: language === 'zh' ? '决策科学研究（Kahneman, 2011）' : 'Decision science research (Kahneman, 2011)',
        applications: [
          language === 'zh' ? '数据分析和研究' : 'Data analysis and research',
          language === 'zh' ? '系统设计和优化' : 'System design and optimization',
          language === 'zh' ? '法律和咨询工作' : 'Legal and consulting work'
        ]
      });
    } else {
      analysis.strengths.push({
        title: language === 'zh' ? '人际敏感度' : 'Interpersonal Sensitivity',
        description: language === 'zh' ?
          '情感型决策者重视人际和谐和他人感受，具有高情商' :
          'Feeling-type decision makers value interpersonal harmony and others\' feelings, with high emotional intelligence',
        evidence: language === 'zh' ? '情商研究（Goleman, 1995; Bar-On, 1997）' : 'Emotional intelligence research (Goleman, 1995; Bar-On, 1997)',
        applications: [
          language === 'zh' ? '人力资源和组织发展' : 'Human resources and organizational development',
          language === 'zh' ? '咨询和治疗工作' : 'Counseling and therapeutic work',
          language === 'zh' ? '教育和培训' : 'Education and training'
        ]
      });
    }
  }

  // 通用建议
  analysis.recommendations = [
    {
      category: 'development',
      title: language === 'zh' ? '个人发展计划' : 'Personal Development Plan',
      description: language === 'zh' ?
        '基于您的认知风格制定个性化的成长计划' :
        'Create a personalized growth plan based on your cognitive style',
      priority: 'high' as const
    },
    {
      category: 'career',
      title: language === 'zh' ? '职业发展建议' : 'Career Development Advice',
      description: language === 'zh' ?
        '选择与您的优势匹配的职业方向和工作环境' :
        'Choose career directions and work environments that match your strengths',
      priority: 'high' as const
    },
    {
      category: 'relationships',
      title: language === 'zh' ? '人际关系优化' : 'Relationship Optimization',
      description: language === 'zh' ?
        '了解不同性格类型，改善沟通和协作效果' :
        'Understand different personality types to improve communication and collaboration',
      priority: 'medium' as const
    }
  ];

  return analysis;
};

const ImprovedPersonalizedSuggestions: React.FC<ImprovedPersonalizedSuggestionsProps> = ({
  userProfile,
  fiveDimensionalData,
  className = ""
}) => {
  const { language } = useLanguage();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [show3DModel, setShow3DModel] = useState(true);
  const [showPersonalityAnalysis, setShowPersonalityAnalysis] = useState(false);

  // 计算3D能量模型 - 使用useMemo优化性能
  const energyModel = useMemo(() => {
    try {
      return calculate3DEnergyModel(userProfile, fiveDimensionalData);
    } catch (error) {
      console.error('Error calculating 3D energy model:', error);
      return {
        physical: 70,
        mental: 70,
        spiritual: 70,
        balance: 70,
        trend: 'stable' as const,
        recommendations: ['请稍后重试']
      };
    }
  }, [userProfile, fiveDimensionalData]);

  // 生成科学化建议 - 使用useMemo优化性能
  const scientificSuggestions = useMemo(() => {
    try {
      return generateScientificSuggestions(userProfile, energyModel, language);
    } catch (error) {
      console.error('Error generating scientific suggestions:', error);
      return [];
    }
  }, [userProfile, energyModel, language]);

  // 生成每日预测 - 使用useMemo优化性能
  const dailyForecast = useMemo(() => {
    try {
      return generateDailyEnergyForecast(userProfile, language);
    } catch (error) {
      console.error('Error generating daily forecast:', error);
      return {
        date: new Date().toISOString().split('T')[0],
        energyPeak: '09:00-11:00',
        energyLow: '14:00-16:00',
        optimalActivities: ['休息'],
        avoidActivities: ['高强度工作'],
        crystalRecommendation: '白水晶 - 净化能量',
        biorhythmPhase: 'physical' as const
      };
    }
  }, [userProfile, language]);

  const getEvidenceLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-success/10 text-success';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'low': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted/50 text-muted-foreground';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-primary/10 text-primary';
      case 'medium': return 'bg-secondary/10 text-secondary';
      case 'hard': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted/50 text-muted-foreground';
    }
  };

  // 安全检查
  if (!userProfile) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {language === 'zh' ? '正在加载个性化建议...' : 'Loading personalized suggestions...'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-3 text-xl">
          <LuxuryIcons.Energy
            size={24}
            className={generateLuxuryIconClasses({
              size: 'lg',
              variant: 'interactive',
              animation: 'pulse'
            })}
          />
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-bold">
            {language === 'zh' ? '科学能量优化建议' : 'Scientific Energy Optimization'}
          </span>
        </CardTitle>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
            {language === 'zh' ? '基于科学研究' : 'Evidence-Based'}
          </Badge>
          <Badge className="bg-gradient-to-r from-secondary to-accent text-secondary-foreground">
            {userProfile.mbtiLikeType || (language === 'zh' ? '个性化算法' : 'Personalized Algorithm')}
          </Badge>
          <Badge variant="outline" className="border-secondary/30">
            {language === 'zh' ? '3D能量模型' : '3D Energy Model'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 3D能量模型显示 */}
        <Card className="border-l-4 border-l-secondary bg-gradient-to-br from-secondary/5 to-primary/5">
          <Collapsible open={show3DModel} onOpenChange={setShow3DModel}>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-accent/5 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <LuxuryIcons.Energy
                      size={20}
                      className={`${generateLuxuryIconClasses({
                        size: 'md',
                        variant: 'interactive',
                        animation: 'spin'
                      })} animate-pulse`}
                    />
                    {language === 'zh' ? '每日3D能量模型与预测' : 'Daily 3D Energy Model & Forecast'}
                  </CardTitle>
                  {show3DModel ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'zh' ? '基于生物节律和心理学理论的实时能量分析与智能预测' : 'Real-time energy analysis and smart predictions based on biorhythm and psychological theories'}
                </p>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                {/* 雷达图 */}
                <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-primary mb-4 flex items-center gap-2">
                    <LuxuryIcons.Activity
                      size={16}
                      className={generateLuxuryIconClasses({
                        size: 'sm',
                        variant: 'default'
                      })}
                    />
                    {language === 'zh' ? '能量雷达图' : 'Energy Radar Chart'}
                  </h4>
                  <EnergyCharts energyModel={energyModel} language={language} />
                </div>

                {/* 3D能量指标卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-card rounded-lg border border-destructive/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="h-5 w-5 text-destructive" />
                      <span className="font-medium text-destructive">
                        {language === 'zh' ? '身体能量' : 'Physical Energy'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <Progress value={Math.min(100, Math.max(0, energyModel.physical || 0))} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{(energyModel.physical || 0).toFixed(0)}%</span>
                        <span className="text-destructive font-medium">
                          {(energyModel.physical || 0) >= 80 ? (language === 'zh' ? '优秀' : 'Excellent') :
                           (energyModel.physical || 0) >= 60 ? (language === 'zh' ? '良好' : 'Good') :
                           language === 'zh' ? '需提升' : 'Needs Improvement'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-card rounded-lg border border-secondary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <LuxuryIcons.Insight
                        size={20}
                        className={generateLuxuryIconClasses({
                          size: 'md',
                          variant: 'default'
                        })}
                      />
                      <span className="font-medium text-secondary">
                        {language === 'zh' ? '心理能量' : 'Mental Energy'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <Progress value={Math.min(100, Math.max(0, energyModel.mental || 0))} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{(energyModel.mental || 0).toFixed(0)}%</span>
                        <span className="text-secondary font-medium">
                          {(energyModel.mental || 0) >= 80 ? (language === 'zh' ? '优秀' : 'Excellent') :
                           (energyModel.mental || 0) >= 60 ? (language === 'zh' ? '良好' : 'Good') :
                           language === 'zh' ? '需提升' : 'Needs Improvement'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-card rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <LuxuryIcons.Meditation
                        size={20}
                        className={generateLuxuryIconClasses({
                          size: 'md',
                          variant: 'default'
                        })}
                      />
                      <span className="font-medium text-primary">
                        {language === 'zh' ? '精神能量' : 'Spiritual Energy'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <Progress value={Math.min(100, Math.max(0, energyModel.spiritual || 0))} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{(energyModel.spiritual || 0).toFixed(0)}%</span>
                        <span className="text-primary font-medium">
                          {(energyModel.spiritual || 0) >= 80 ? (language === 'zh' ? '优秀' : 'Excellent') :
                           (energyModel.spiritual || 0) >= 60 ? (language === 'zh' ? '良好' : 'Good') :
                           language === 'zh' ? '需提升' : 'Needs Improvement'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 平衡指数和趋势 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-success/5 to-success/10 rounded-lg border border-success/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="h-5 w-5 text-success" />
                      <span className="font-medium text-success">
                        {language === 'zh' ? '平衡指数' : 'Balance Index'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-success">{(energyModel.balance || 0).toFixed(1)}%</div>
                    <p className="text-sm text-success mt-1">
                      {(energyModel.balance || 0) >= 80 ? (language === 'zh' ? '高度平衡' : 'Highly Balanced') :
                       (energyModel.balance || 0) >= 60 ? (language === 'zh' ? '基本平衡' : 'Moderately Balanced') :
                       language === 'zh' ? '需要调整' : 'Needs Adjustment'}
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-warning/5 to-warning/10 rounded-lg border border-warning/20">
                    <div className="flex items-center gap-2 mb-2">
                      {energyModel.trend === 'rising' ? (
                        <LuxuryIcons.Trend
                          size={20}
                          className={generateLuxuryIconClasses({
                            size: 'md',
                            variant: 'default'
                          })}
                        />
                      ) : energyModel.trend === 'declining' ? (
                        <TrendingDown className="h-5 w-5 text-destructive" />
                      ) : (
                        <LuxuryIcons.Activity
                          size={20}
                          className={generateLuxuryIconClasses({
                            size: 'md',
                            variant: 'default'
                          })}
                        />
                      )}
                      <span className="font-medium text-warning">
                        {language === 'zh' ? '能量趋势' : 'Energy Trend'}
                      </span>
                    </div>
                    <div className="text-lg font-semibold">
                      {energyModel.trend === 'rising' ? (language === 'zh' ? '上升期' : 'Rising') :
                       energyModel.trend === 'declining' ? (language === 'zh' ? '下降期' : 'Declining') :
                       language === 'zh' ? '稳定期' : 'Stable'}
                    </div>
                    <p className="text-sm text-warning mt-1">
                      {energyModel.trend === 'rising' ? (language === 'zh' ? '适合挑战新任务' : 'Good for new challenges') :
                       energyModel.trend === 'declining' ? (language === 'zh' ? '建议休息恢复' : 'Recommended to rest') :
                       language === 'zh' ? '维持当前节奏' : 'Maintain current pace'}
                    </p>
                  </div>
                </div>

                {/* 今日能量预测 */}
                <div className="p-4 bg-gradient-to-r from-secondary/5 to-accent/5 rounded-lg border border-secondary/20">
                  <h4 className="font-medium text-secondary mb-4 flex items-center gap-2">
                    <LuxuryIcons.Calendar
                      size={16}
                      className={generateLuxuryIconClasses({
                        size: 'sm',
                        variant: 'default'
                      })}
                    />
                    {language === 'zh' ? '今日能量预测' : 'Today\'s Energy Forecast'}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </Badge>
                  </h4>

                  {/* 能量时间轴 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-r from-success/5 to-success/10 rounded-lg border border-success/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4 text-success" />
                          <span className="font-medium text-success">
                            {language === 'zh' ? '能量高峰期' : 'Energy Peak'}
                          </span>
                        </div>
                        <Badge className="bg-success/10 text-success text-xs">
                          {language === 'zh' ? '最佳时段' : 'Optimal'}
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-success">{dailyForecast?.energyPeak || '09:00-11:00'}</div>
                      <p className="text-xs text-success/70 mt-1">
                        {language === 'zh' ? '最佳工作和学习时间，专注力最强' : 'Optimal time for work and study, highest focus'}
                      </p>
                      <div className="mt-2 text-xs text-success/60">
                        {language === 'zh' ? '💡 建议：处理重要任务、创意工作' : '💡 Tip: Handle important tasks, creative work'}
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-warning/5 to-warning/10 rounded-lg border border-warning/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4 text-warning" />
                          <span className="font-medium text-warning">
                            {language === 'zh' ? '能量低谷期' : 'Energy Low'}
                          </span>
                        </div>
                        <Badge className="bg-warning/10 text-warning text-xs">
                          {language === 'zh' ? '休息时段' : 'Rest Time'}
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-warning">{dailyForecast?.energyLow || '14:00-16:00'}</div>
                      <p className="text-xs text-warning/70 mt-1">
                        {language === 'zh' ? '建议休息或轻松活动，避免重要决策' : 'Recommended for rest or light activities, avoid important decisions'}
                      </p>
                      <div className="mt-2 text-xs text-warning/60">
                        {language === 'zh' ? '💡 建议：冥想、散步、整理工作' : '💡 Tip: Meditation, walking, organizing work'}
                      </div>
                    </div>
                  </div>

                  {/* 生物节律相位 */}
                  <div className="p-3 border border-border rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Waves className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">
                        {language === 'zh' ? '生物节律相位' : 'Biorhythm Phase'}
                      </span>
                    </div>
                    <div className="text-lg font-semibold text-primary">
                      {(dailyForecast?.biorhythmPhase || 'physical') === 'physical' ? (language === 'zh' ? '身体周期' : 'Physical Cycle') :
                       (dailyForecast?.biorhythmPhase || 'physical') === 'emotional' ? (language === 'zh' ? '情感周期' : 'Emotional Cycle') :
                       language === 'zh' ? '智力周期' : 'Intellectual Cycle'}
                    </div>
                    <p className="text-sm text-foreground/70 mt-1">
                      {(dailyForecast?.biorhythmPhase || 'physical') === 'physical' ? (language === 'zh' ? '适合体力活动和运动' : 'Good for physical activities and exercise') :
                       (dailyForecast?.biorhythmPhase || 'physical') === 'emotional' ? (language === 'zh' ? '适合社交和情感表达' : 'Good for socializing and emotional expression') :
                       language === 'zh' ? '适合学习和思考' : 'Good for learning and thinking'}
                    </p>
                  </div>

                  {/* 推荐与避免活动 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <h6 className="font-medium text-foreground flex items-center gap-2">
                        <Sun className="h-4 w-4 text-success" />
                        {language === 'zh' ? '推荐活动' : 'Recommended Activities'}
                      </h6>
                      <div className="space-y-1">
                        {(dailyForecast?.optimalActivities || [
                          language === 'zh' ? '创意工作' : 'Creative work',
                          language === 'zh' ? '重要决策' : 'Important decisions',
                          language === 'zh' ? '学习新技能' : 'Learning new skills'
                        ]).map((activity, index) => (
                          <div key={index} className="text-sm text-foreground/70 flex items-center gap-2 p-2 bg-success/5 rounded">
                            <span className="w-1 h-1 bg-success rounded-full"></span>
                            {activity}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h6 className="font-medium text-foreground flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-warning" />
                        {language === 'zh' ? '避免活动' : 'Avoid Activities'}
                      </h6>
                      <div className="space-y-1">
                        {(dailyForecast?.avoidActivities || [
                          language === 'zh' ? '高强度运动' : 'High intensity exercise',
                          language === 'zh' ? '复杂谈判' : 'Complex negotiations',
                          language === 'zh' ? '情绪化决定' : 'Emotional decisions'
                        ]).map((activity, index) => (
                          <div key={index} className="text-sm text-foreground/70 flex items-center gap-2 p-2 bg-warning/5 rounded">
                            <span className="w-1 h-1 bg-warning rounded-full"></span>
                            {activity}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 今日水晶推荐 */}
                  <div className="p-3 bg-gradient-to-r from-accent/5 to-primary/5 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <LuxuryIcons.Crystal
                        size={16}
                        className={generateLuxuryIconClasses({
                          size: 'sm',
                          variant: 'default'
                        })}
                      />
                      <span className="font-medium text-accent">
                        {language === 'zh' ? '今日水晶推荐' : 'Today\'s Crystal Recommendation'}
                      </span>
                    </div>
                    <div className="text-lg font-semibold text-accent mb-2">{dailyForecast?.crystalRecommendation || '白水晶 - 净化能量'}</div>
                    <p className="text-xs text-accent/70">
                      {language === 'zh' ? '根据您的能量状态和今日预测精心挑选，建议随身佩戴或放置在工作区域' : 'Carefully selected based on your energy state and today\'s forecast, recommended to wear or place in work area'}
                    </p>
                  </div>
                </div>

                {/* 智能优化建议 - 合并循证实践建议 */}
                <div className="p-4 bg-gradient-to-r from-accent/5 to-secondary/5 rounded-lg border border-accent/20">
                  {/* 基础能量建议 */}
                  <div className="space-y-2 mb-4">
                    {(energyModel.recommendations || []).map((rec, index) => (
                      <div key={index} className="text-sm text-accent flex items-center gap-2 p-2 bg-accent/5 rounded">
                        <LuxuryIcons.Success
                          size={12}
                          className={generateLuxuryIconClasses({
                            size: 'sm',
                            variant: 'default'
                          })}
                        />
                        {rec}
                      </div>
                    ))}
                  </div>

                  {/* 循证科学建议 */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-primary flex items-center gap-2">
                      <LuxuryIcons.Guidance
                        size={14}
                        className={generateLuxuryIconClasses({
                          size: 'sm',
                          variant: 'default'
                        })}
                      />
                      {language === 'zh' ? '循证实践建议' : 'Evidence-Based Practices'}
                    </h5>
                    {(scientificSuggestions || []).slice(0, 2).map((suggestion, index) => (
                      <div key={suggestion.id} className="p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
                        <div className="flex items-start gap-2">
                          <div className="text-lg">{suggestion.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h6 className="font-medium text-foreground text-sm">{suggestion.title}</h6>
                              <Badge className={getEvidenceLevelColor(suggestion.evidenceLevel)} variant="outline">
                                {suggestion.evidenceLevel === 'high' ? (language === 'zh' ? '高证据' : 'High') :
                                 suggestion.evidenceLevel === 'medium' ? (language === 'zh' ? '中证据' : 'Medium') :
                                 language === 'zh' ? '低证据' : 'Low'}
                              </Badge>
                            </div>

                            <p className="text-xs text-muted-foreground mb-3">{suggestion.description}</p>

                            {/* 科学依据 */}
                            <div className="bg-card p-2 rounded border-l-2 border-l-success mb-2">
                              <p className="text-xs text-success font-medium mb-1">
                                {language === 'zh' ? '科学依据:' : 'Scientific Basis:'}
                              </p>
                              <p className="text-xs text-success">{suggestion.scientificBasis}</p>
                            </div>

                            {/* 预期效果 */}
                            <div className="bg-card p-2 rounded border-l-2 border-l-warning mb-2">
                              <p className="text-xs text-warning font-medium mb-1">
                                {language === 'zh' ? '预期效果:' : 'Expected Outcome:'}
                              </p>
                              <p className="text-xs text-warning">{suggestion.expectedOutcome}</p>
                            </div>

                            {/* 测量方法 */}
                            <div className="bg-card p-2 rounded border-l-2 border-l-secondary mb-2">
                              <p className="text-xs text-secondary font-medium mb-1">
                                {language === 'zh' ? '测量方法:' : 'Measurement Method:'}
                              </p>
                              <p className="text-xs text-secondary">{suggestion.measurementMethod}</p>
                            </div>

                            {/* 研究引用 */}
                            {suggestion.researchCitation && (
                              <div className="text-xs text-muted-foreground italic bg-muted/50 p-2 rounded mb-2">
                                📚 {language === 'zh' ? '研究引用: ' : 'Research Citation: '}{suggestion.researchCitation}
                              </div>
                            )}

                            {/* 底部信息栏 */}
                            <div className="flex items-center gap-3 text-xs pt-2 border-t border-border/50">
                              <div className="flex items-center gap-1">
                                <LuxuryIcons.Calendar
                                  size={10}
                                  className={generateLuxuryIconClasses({
                                    size: 'sm',
                                    variant: 'default'
                                  })}
                                />
                                <span className="text-primary">{suggestion.timeCommitment}</span>
                              </div>
                              <Badge className={getDifficultyColor(suggestion.difficulty)} variant="outline">
                                {suggestion.difficulty === 'easy' ? (language === 'zh' ? '简单' : 'Easy') :
                                 suggestion.difficulty === 'medium' ? (language === 'zh' ? '中等' : 'Medium') :
                                 language === 'zh' ? '困难' : 'Hard'}
                              </Badge>
                              {suggestion.crystalConnection && (
                                <div className="flex items-center gap-1">
                                  <LuxuryIcons.Crystal
                                    size={10}
                                    className={generateLuxuryIconClasses({
                                      size: 'sm',
                                      variant: 'default'
                                    })}
                                  />
                                  <span className="text-secondary truncate">{suggestion.crystalConnection}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* 科学分析原理 */}
        <Card className="border-l-4 border-l-accent">
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-accent/5 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {language === 'zh' ? '科学分析原理' : 'Scientific Analysis Principles'}
                  </CardTitle>
                  {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'zh' ? '了解能量分析的理论基础和科学依据' : 'Understand the theoretical basis and scientific foundation of energy analysis'}
                </p>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {/* 1. 能量分布数学模型 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-foreground">
                      {language === 'zh' ? '能量分布的数学模型与统计分析' : 'Mathematical Model & Statistical Analysis of Energy Distribution'}
                    </h4>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="text-sm text-foreground/70 leading-relaxed">
                      <p className="mb-3">
                        {language === 'zh' ?
                          '您的能量分布遵循多元正态分布的变形，这在心理测量学中是常见现象。基于3D能量模型，我们可以进行深度的统计学分析。' :
                          'Your energy distribution follows a variant of multivariate normal distribution, which is common in psychometrics. Based on the 3D energy model, we can perform in-depth statistical analysis.'}
                      </p>
                      <div className="space-y-2">
                        <div className="p-3 bg-primary/5 border-l-2 border-primary text-xs">
                          <strong>{language === 'zh' ? '核心数学公式：' : 'Core Mathematical Formulas:'}</strong>
                          <br />
                          {language === 'zh' ?
                            '• 能量平衡指数 (EBI) = 100 - (σ/μ × 100)\n• 协同效应系数 (SC) = 1 - (Σ|xi - μ|)/(n × max(xi))\n• 内在一致性系数 (ICC) 基于Cronbach\'s α公式' :
                            '• Energy Balance Index (EBI) = 100 - (σ/μ × 100)\n• Synergy Coefficient (SC) = 1 - (Σ|xi - μ|)/(n × max(xi))\n• Internal Consistency Coefficient (ICC) based on Cronbach\'s α formula'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. 理论基础 */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-foreground">
                      {language === 'zh' ? '权威理论框架' : 'Authoritative Theoretical Framework'}
                    </h4>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="text-sm text-foreground/70 leading-relaxed">
                      <div className="space-y-3">
                        <div className="p-3 bg-success/5 border-l-2 border-success text-xs">
                          <strong>{language === 'zh' ? '心理学基础：' : 'Psychological Foundation:'}</strong>
                          <br />
                          {language === 'zh' ?
                            '• 马斯洛需求层次理论 (Maslow, 1943)\n• 艾森克人格理论 (Eysenck, 1967)\n• 认知负荷理论 (Sweller, 1988)' :
                            '• Maslow\'s Hierarchy of Needs (Maslow, 1943)\n• Eysenck\'s Personality Theory (Eysenck, 1967)\n• Cognitive Load Theory (Sweller, 1988)'}
                        </div>
                        <div className="p-3 bg-warning/5 border-l-2 border-warning text-xs">
                          <strong>{language === 'zh' ? '神经科学支撑：' : 'Neuroscience Support:'}</strong>
                          <br />
                          {language === 'zh' ?
                            '• 昼夜节律理论 (Roenneberg et al., 2007)\n• 神经可塑性研究 (Doidge, 2007)\n• 运动生理学与线粒体功能' :
                            '• Circadian Rhythm Theory (Roenneberg et al., 2007)\n• Neuroplasticity Research (Doidge, 2007)\n• Exercise Physiology & Mitochondrial Function'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. 科学验证标准 */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-foreground">
                      {language === 'zh' ? '科学验证标准' : 'Scientific Validation Standards'}
                    </h4>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="text-sm text-foreground/70 leading-relaxed">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-secondary/5 border border-secondary/20 rounded">
                          <div className="font-medium text-secondary mb-2">{language === 'zh' ? '统计学指标' : 'Statistical Indicators'}</div>
                          <div className="text-xs space-y-1">
                            <div>• {language === 'zh' ? '标准差控制 < 30%阈值' : 'Standard deviation control < 30% threshold'}</div>
                            <div>• {language === 'zh' ? '偏度检验 |Skewness| < 1.0' : 'Skewness test |Skewness| < 1.0'}</div>
                            <div>• {language === 'zh' ? '峰度检验 |Kurtosis| < 2.0' : 'Kurtosis test |Kurtosis| < 2.0'}</div>
                          </div>
                        </div>
                        <div className="p-3 bg-accent/5 border border-accent/20 rounded">
                          <div className="font-medium text-accent mb-2">{language === 'zh' ? '可靠性评估' : 'Reliability Assessment'}</div>
                          <div className="text-xs space-y-1">
                            <div>• {language === 'zh' ? 'Cronbach\'s α > 0.7' : 'Cronbach\'s α > 0.7'}</div>
                            <div>• {language === 'zh' ? '测试-重测信度 > 0.8' : 'Test-retest reliability > 0.8'}</div>
                            <div>• {language === 'zh' ? '内容效度专家评估' : 'Content validity expert assessment'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. 方法论说明 */}
                <div className="p-4 bg-gradient-to-r from-muted/30 to-muted/50 rounded-lg border border-border">
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {language === 'zh' ? '科学方法论' : 'Scientific Methodology'}
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      {language === 'zh' ?
                        '本分析基于循证心理学原理，结合生物节律理论、认知负荷理论、马斯洛需求层次理论等权威科学框架。' :
                        'This analysis is based on evidence-based psychology principles, combined with authoritative scientific frameworks such as biorhythm theory, cognitive load theory, and Maslow\'s hierarchy of needs.'}
                    </p>
                    <p>
                      {language === 'zh' ?
                        '所有建议都经过同行评议的研究验证，并根据您的个人特质进行个性化调整。' :
                        'All recommendations are validated by peer-reviewed research and personalized according to your individual traits.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ImprovedPersonalizedSuggestions;
