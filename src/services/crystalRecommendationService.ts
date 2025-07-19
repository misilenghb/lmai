/**
 * 统一水晶推荐服务
 * 基于科学原理和用户体验的分层推荐算法
 * 整合完整水晶数据库，提供更丰富的推荐选择
 * 结合个人能量画像和每日3D能量模型的智能推荐
 */

import { crystalTypeMapping } from '@/lib/crystal-options';
import type { UserProfileDataOutput } from '@/ai/schemas/user-profile-schemas';

// 3D能量模型接口
interface EnergyModel3D {
  physical: number;    // 身体能量 (0-100)
  mental: number;      // 心理能量 (0-100)
  spiritual: number;   // 精神能量 (0-100)
  balance: number;     // 平衡指数 (0-100)
  trend: 'rising' | 'stable' | 'declining';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: number;   // 0-6 (周日到周六)
}

// 个人能量画像接口
interface PersonalEnergyProfile {
  mbtiType: string;
  zodiacSign: string;
  element: string;
  chakraBalance: Record<string, number>;
  emotionalPattern: string;
  energyArchetype: string;
  preferredEnergyLevel: number; // 1-5
}

// 核心水晶数据库 - 基于科学研究和用户反馈精选
export const CORE_CRYSTALS = {
  amethyst: {
    id: 'amethyst',
    name: '紫水晶',
    color: 'hsl(var(--primary))',
    chakra: '眉心轮',
    element: '风',
    energyLevel: [2, 3, 4], // 适合的能量等级
    emotions: ['stressed', 'anxious', 'excited'],
    mbtiTypes: ['N', 'I'], // 直觉型、内向型
    scientificBasis: '紫色具有镇静效果，触觉刺激有助于放松',
    primaryEffects: ['平静心神', '增强直觉', '改善睡眠'],
    usage: '放在枕头下改善睡眠，或在冥想时握在手中增强直觉',
    evidenceLevel: 'medium',
    matchScore: 85
  },
  rose_quartz: {
    id: 'rose_quartz',
    name: '玫瑰石英',
    color: 'hsl(var(--secondary))',
    chakra: '心轮',
    element: '水',
    energyLevel: [1, 2, 3],
    emotions: ['sad', 'anxious', 'grateful'],
    mbtiTypes: ['F'], // 情感型
    scientificBasis: '粉色有助于降低攻击性，触觉安慰提供情感支持',
    primaryEffects: ['自爱', '情感治愈', '温和能量'],
    usage: '佩戴在心脏附近，或在情感困扰时握在手中',
    evidenceLevel: 'high',
    matchScore: 88
  },
  clear_quartz: {
    id: 'clear_quartz',
    name: '白水晶',
    color: 'hsl(var(--accent))',
    chakra: '顶轮',
    element: '光',
    energyLevel: [1, 2, 3, 4, 5], // 万能水晶
    emotions: ['tired', 'neutral'],
    mbtiTypes: ['T', 'S'], // 思维型、实感型
    scientificBasis: '透明晶体的视觉效果有助于专注，仪式感增强意图',
    primaryEffects: ['净化能量', '增强专注', '放大意图'],
    usage: '可与任何其他水晶搭配使用，或单独用于冥想',
    evidenceLevel: 'medium',
    matchScore: 80
  },
  black_obsidian: {
    id: 'black_obsidian',
    name: '黑曜石',
    color: 'hsl(var(--muted-foreground))',
    chakra: '根轮',
    element: '土',
    energyLevel: [1, 2],
    emotions: ['stressed', 'anxious'],
    mbtiTypes: ['S', 'J'], // 实感型、判断型
    scientificBasis: '深色物体给人安全感，重量感提供心理稳定',
    primaryEffects: ['保护能量', '接地稳定', '释放负能量'],
    usage: '随身携带作为保护符，或在感到不安时握在手中',
    evidenceLevel: 'medium',
    matchScore: 75
  },
  citrine: {
    id: 'citrine',
    name: '黄水晶',
    color: 'hsl(var(--warning))',
    chakra: '太阳神经丛',
    element: '火',
    energyLevel: [3, 4, 5],
    emotions: ['sad', 'tired', 'happy'],
    mbtiTypes: ['E', 'T'], // 外向型、思维型
    scientificBasis: '黄色刺激大脑活跃度，增强积极情绪',
    primaryEffects: ['增强自信', '提升创造力', '正面能量'],
    usage: '放在工作区域或钱包中，冥想时放在太阳神经丛位置',
    evidenceLevel: 'high',
    matchScore: 82
  },
  green_aventurine: {
    id: 'green_aventurine',
    name: '绿东陵石',
    color: 'hsl(var(--success))',
    chakra: '心轮',
    element: '土',
    energyLevel: [2, 3, 4],
    emotions: ['neutral', 'happy', 'grateful'],
    mbtiTypes: ['F', 'P'], // 情感型、感知型
    scientificBasis: '绿色有镇静效果，触觉刺激缓解焦虑',
    primaryEffects: ['好运', '机会', '情绪平衡'],
    usage: '随身携带增加好运，或在做重要决定时握在手中',
    evidenceLevel: 'medium',
    matchScore: 78
  }
} as const;

// 扩展水晶数据库 - 基于完整数据库的精选推荐水晶
export const EXTENDED_CRYSTALS = {
  // 情绪疗愈类
  angelite: {
    id: 'angelite',
    name: '天使石',
    englishName: 'Angelite',
    color: 'hsl(var(--info))',
    chakra: '喉轮',
    element: '风',
    energyLevel: [1, 2, 3],
    emotions: ['sad', 'anxious', 'stressed'],
    mbtiTypes: ['F', 'N'],
    scientificBasis: '淡蓝色具有平静效果，有助于情绪稳定和沟通表达',
    primaryEffects: ['天使连接', '温和沟通', '内心平静'],
    usage: '冥想时放在喉轮位置，或随身携带增强沟通能力',
    evidenceLevel: 'medium',
    matchScore: 78,
    category: 'emotional_healing'
  },

  aquamarine: {
    id: 'aquamarine',
    name: '海蓝宝',
    englishName: 'Aquamarine',
    color: 'hsl(var(--info))',
    chakra: '喉轮',
    element: '水',
    energyLevel: [2, 3, 4],
    emotions: ['anxious', 'stressed', 'neutral'],
    mbtiTypes: ['F', 'P'],
    scientificBasis: '海蓝色调有助于减压和增强表达能力',
    primaryEffects: ['勇气沟通', '平静舒缓', '真实表达'],
    usage: '佩戴在颈部或握在手中进行深呼吸练习',
    evidenceLevel: 'medium',
    matchScore: 82,
    category: 'communication'
  },

  // 保护能量类
  bloodstone: {
    id: 'bloodstone',
    name: '血石',
    englishName: 'Bloodstone',
    color: 'hsl(var(--destructive))',
    chakra: '根轮',
    element: '土',
    energyLevel: [3, 4, 5],
    emotions: ['tired', 'stressed', 'neutral'],
    mbtiTypes: ['S', 'J'],
    scientificBasis: '深绿色有助于稳定情绪，红色斑点象征活力',
    primaryEffects: ['血液净化', '勇气无私', '接地保护'],
    usage: '放在口袋中或佩戴增强体力和勇气',
    evidenceLevel: 'low',
    matchScore: 75,
    category: 'protection'
  },

  // 心灵成长类
  labradorite: {
    id: 'labradorite',
    name: '拉长石',
    englishName: 'Labradorite',
    color: 'hsl(var(--secondary))',
    chakra: '眉心轮',
    element: '风',
    energyLevel: [3, 4, 5],
    emotions: ['excited', 'neutral', 'happy'],
    mbtiTypes: ['N', 'P'],
    scientificBasis: '变彩效应刺激视觉，有助于激发创造力和直觉',
    primaryEffects: ['变化转换', '神秘直觉', '彩虹闪光'],
    usage: '冥想时观察其闪光效应，或放在工作区域激发灵感',
    evidenceLevel: 'medium',
    matchScore: 80,
    category: 'spiritual_growth'
  }
} as const;

// 推荐上下文类型
export interface RecommendationContext {
  // 基础信息
  mood?: string;
  energyLevel?: number;
  chakra?: string;
  
  // 用户档案
  mbtiType?: string;
  element?: string;
  zodiac?: string;
  
  // 使用场景
  scenario?: 'meditation' | 'daily' | 'healing' | 'protection';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  
  // 个性化权重
  preferScientific?: boolean;
  maxRecommendations?: number;
}

// 推荐结果类型
export interface CrystalRecommendation {
  id: string;
  name: string;
  color: string;
  chakra: string;
  element: string;
  energyLevel: number[];
  emotions: string[];
  mbtiTypes: string[];
  scientificBasis: string;
  primaryEffects: string[];
  usage: string;
  evidenceLevel: string;
  matchScore: number;
  reasons?: string[];
  confidence?: 'high' | 'medium' | 'low';
}

/**
 * 统一水晶推荐算法
 * 分层推荐逻辑：情绪匹配 -> 能量匹配 -> 个性化匹配 -> 科学验证
 */
export class CrystalRecommendationService {
  
  /**
   * 主推荐方法
   */
  static recommend(context: RecommendationContext): CrystalRecommendation[] {
    const crystals = Object.values(CORE_CRYSTALS);
    const recommendations: CrystalRecommendation[] = [];
    
    for (const crystal of crystals) {
      const matchScore = this.calculateMatchScore(crystal, context);
      const reasons = this.generateReasons(crystal, context);
      
      if (matchScore > 0) {
        recommendations.push({
          id: crystal.id,
          name: crystal.name,
          color: crystal.color,
          chakra: crystal.chakra,
          element: crystal.element,
          energyLevel: [...crystal.energyLevel],
          emotions: [...crystal.emotions],
          mbtiTypes: [...crystal.mbtiTypes],
          scientificBasis: crystal.scientificBasis,
          primaryEffects: [...crystal.primaryEffects],
          usage: this.getContextualUsage(crystal, context),
          evidenceLevel: crystal.evidenceLevel,
          matchScore,
          reasons,
          confidence: this.getConfidenceLevel(matchScore, crystal.evidenceLevel)
        });
      }
    }
    
    // 按匹配度排序并限制数量
    return recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, context.maxRecommendations || 3);
  }
  
  /**
   * 计算匹配分数 (0-100)
   */
  private static calculateMatchScore(
    crystal: typeof CORE_CRYSTALS[keyof typeof CORE_CRYSTALS], 
    context: RecommendationContext
  ): number {
    let score = 0;
    let maxScore = 0;
    
    // 1. 情绪匹配 (权重: 40%)
    if (context.mood) {
      maxScore += 40;
      if ((crystal.emotions as readonly string[]).includes(context.mood)) {
        score += 40;
      }
    }
    
    // 2. 能量等级匹配 (权重: 25%)
    if (context.energyLevel) {
      maxScore += 25;
      if ((crystal.energyLevel as readonly number[]).includes(context.energyLevel)) {
        score += 25;
      }
    }
    
    // 3. MBTI匹配 (权重: 20%)
    if (context.mbtiType) {
      maxScore += 20;
      const hasMatch = crystal.mbtiTypes.some(type => 
        context.mbtiType!.includes(type)
      );
      if (hasMatch) {
        score += 20;
      }
    }
    
    // 4. 脉轮匹配 (权重: 10%)
    if (context.chakra) {
      maxScore += 10;
      if (crystal.chakra === context.chakra) {
        score += 10;
      }
    }
    
    // 5. 使用场景匹配 (权重: 5%)
    if (context.scenario) {
      maxScore += 5;
      // 根据场景调整分数
      const scenarioBonus = this.getScenarioBonus(crystal, context.scenario);
      score += scenarioBonus;
    }
    
    // 转换为百分比，如果没有任何匹配条件则返回基础分数
    return maxScore > 0 ? Math.round((score / maxScore) * 100) : crystal.matchScore;
  }
  
  /**
   * 生成推荐理由
   */
  private static generateReasons(
    crystal: typeof CORE_CRYSTALS[keyof typeof CORE_CRYSTALS],
    context: RecommendationContext
  ): string[] {
    const reasons: string[] = [];
    
    if (context.mood && (crystal.emotions as readonly string[]).includes(context.mood)) {
      const moodMap: Record<string, string> = {
        'stressed': '有助于缓解压力和紧张情绪',
        'anxious': '能够平静焦虑，带来内心安宁',
        'sad': '提升情绪，带来积极能量',
        'tired': '补充能量，恢复活力',
        'happy': '增强正面情绪，保持愉悦状态',
        'grateful': '深化感恩之心，增强爱的能量'
      };
      reasons.push(moodMap[context.mood] || '适合当前情绪状态');
    }
    
    if (context.energyLevel && (crystal.energyLevel as readonly number[]).includes(context.energyLevel)) {
      if (context.energyLevel <= 2) {
        reasons.push('适合低能量状态，提供稳定支持');
      } else if (context.energyLevel >= 4) {
        reasons.push('适合高能量状态，增强和聚焦能量');
      } else {
        reasons.push('适合当前能量水平，保持平衡');
      }
    }
    
    if (context.mbtiType) {
      const mbtiReasons: Record<string, string> = {
        'I': '适合内向型，支持深度内省',
        'E': '适合外向型，增强表达能力',
        'N': '适合直觉型，增强洞察力',
        'S': '适合实感型，增强现实感知',
        'T': '适合思维型，增强理性思考',
        'F': '适合情感型，增强情感治愈'
      };
      
      for (const [type, reason] of Object.entries(mbtiReasons)) {
        if (context.mbtiType.includes(type) && (crystal.mbtiTypes as readonly string[]).includes(type)) {
          reasons.push(reason);
          break;
        }
      }
    }
    
    return reasons.length > 0 ? reasons : ['基于综合能量分析推荐'];
  }
  
  /**
   * 获取场景奖励分数
   */
  private static getScenarioBonus(
    crystal: typeof CORE_CRYSTALS[keyof typeof CORE_CRYSTALS],
    scenario: string
  ): number {
    const scenarioMap: Record<string, Record<string, number>> = {
      'meditation': {
        'amethyst': 5,
        'clear_quartz': 4,
        'rose_quartz': 3
      },
      'daily': {
        'citrine': 5,
        'green_aventurine': 4,
        'clear_quartz': 3
      },
      'healing': {
        'rose_quartz': 5,
        'amethyst': 4,
        'green_aventurine': 3
      },
      'protection': {
        'black_obsidian': 5,
        'clear_quartz': 3,
        'amethyst': 2
      }
    };
    
    return scenarioMap[scenario]?.[crystal.id] || 0;
  }
  
  /**
   * 获取上下文相关的使用方法
   */
  private static getContextualUsage(
    crystal: typeof CORE_CRYSTALS[keyof typeof CORE_CRYSTALS],
    context: RecommendationContext
  ): string {
    let usage = crystal.usage;
    
    // 根据时间调整使用建议
    if (context.timeOfDay === 'morning') {
      usage += '。建议在晨间冥想时使用。';
    } else if (context.timeOfDay === 'evening') {
      usage += '。适合在晚间放松时使用。';
    }
    
    // 根据场景调整
    if (context.scenario === 'meditation') {
      usage += '。冥想时握在手中或放在面前。';
    } else if (context.scenario === 'daily') {
      usage += '。可随身携带或放在工作区域。';
    }
    
    return usage;
  }
  
  /**
   * 获取置信度等级
   */
  private static getConfidenceLevel(
    matchScore: number, 
    evidenceLevel: string
  ): 'high' | 'medium' | 'low' {
    if (matchScore >= 80 && evidenceLevel === 'high') return 'high';
    if (matchScore >= 60 && evidenceLevel !== 'low') return 'medium';
    return 'low';
  }
  
  /**
   * 快速情绪推荐 (用于简单场景)
   */
  static quickMoodRecommendation(mood: string): CrystalRecommendation | null {
    const recommendations = this.recommend({ mood, maxRecommendations: 1 });
    return recommendations.length > 0 ? recommendations[0] : null;
  }
  
  /**
   * 个性化推荐 (用于复杂场景)
   */
  static personalizedRecommendation(context: RecommendationContext): CrystalRecommendation[] {
    return this.recommend({
      ...context,
      preferScientific: true,
      maxRecommendations: 3
    });
  }

  /**
   * 扩展推荐 - 从完整数据库中推荐
   */
  static extendedRecommendation(context: RecommendationContext): CrystalRecommendation[] {
    const allCrystals = { ...CORE_CRYSTALS, ...EXTENDED_CRYSTALS };
    const crystals = Object.values(allCrystals);
    const recommendations: CrystalRecommendation[] = [];

    for (const crystal of crystals) {
      const matchScore = this.calculateMatchScore(crystal as any, context);
      const reasons = this.generateReasons(crystal as any, context);

      if (matchScore > 0) {
        recommendations.push({
          id: crystal.id,
          name: crystal.name,
          color: crystal.color,
          chakra: crystal.chakra,
          element: crystal.element,
          energyLevel: [...crystal.energyLevel],
          emotions: [...crystal.emotions],
          mbtiTypes: [...crystal.mbtiTypes],
          scientificBasis: crystal.scientificBasis,
          primaryEffects: [...crystal.primaryEffects],
          usage: this.getContextualUsage(crystal as any, context),
          evidenceLevel: crystal.evidenceLevel,
          matchScore,
          reasons,
          confidence: this.getConfidenceLevel(matchScore, crystal.evidenceLevel)
        });
      }
    }

    // 按匹配度排序并限制数量
    return recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, context.maxRecommendations || 5);
  }

  /**
   * 按类别推荐水晶
   */
  static recommendByCategory(category: string, maxRecommendations: number = 3): CrystalRecommendation[] {
    const extendedCrystals = Object.values(EXTENDED_CRYSTALS)
      .filter(crystal => crystal.category === category);

    return extendedCrystals
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, maxRecommendations)
      .map(crystal => ({
        id: crystal.id,
        name: crystal.name,
        color: crystal.color,
        chakra: crystal.chakra,
        element: crystal.element,
        energyLevel: [...crystal.energyLevel],
        emotions: [...crystal.emotions],
        mbtiTypes: [...crystal.mbtiTypes],
        scientificBasis: crystal.scientificBasis,
        primaryEffects: [...crystal.primaryEffects],
        usage: crystal.usage,
        evidenceLevel: crystal.evidenceLevel,
        matchScore: crystal.matchScore,
        reasons: [`专为${category}设计的水晶`],
        confidence: this.getConfidenceLevel(crystal.matchScore, crystal.evidenceLevel)
      }));
  }

  /**
   * 获取完整水晶数据库信息
   */
  static getFullCrystalDatabase() {
    return {
      core: CORE_CRYSTALS,
      extended: EXTENDED_CRYSTALS,
      complete: crystalTypeMapping
    };
  }

  /**
   * 基于个人能量画像和3D能量模型的智能推荐
   * 这是最核心的推荐算法，结合用户的完整能量档案和当日情绪状态
   */
  static intelligentRecommendation(
    userProfile: UserProfileDataOutput,
    currentEnergyModel: EnergyModel3D,
    maxRecommendations: number = 4,
    currentMood?: string // 新增：用户当日选择的情绪状态
  ): CrystalRecommendation[] {
    try {
      // 1. 解析个人能量画像
      const personalProfile = this.parsePersonalEnergyProfile(userProfile);

      // 2. 分析当前3D能量状态，整合当日情绪
      const energyNeeds = this.analyzeEnergyNeeds(currentEnergyModel, currentMood);

      // 3. 计算水晶匹配度
      const allCrystals = Object.values(EXTENDED_CRYSTALS);
      const scoredCrystals = allCrystals.map(crystal => {
        const score = this.calculateIntelligentMatchScore(
          crystal,
          personalProfile,
          energyNeeds,
          currentEnergyModel,
          currentMood
        );

        return {
          id: crystal.id,
          name: crystal.name,
          color: crystal.color,
          chakra: crystal.chakra,
          element: crystal.element,
          energyLevel: [...crystal.energyLevel],
          emotions: [...crystal.emotions],
          mbtiTypes: [...crystal.mbtiTypes],
          scientificBasis: crystal.scientificBasis,
          primaryEffects: [...crystal.primaryEffects],
          usage: this.generatePersonalizedUsage(crystal, personalProfile, energyNeeds),
          evidenceLevel: crystal.evidenceLevel,
          matchScore: score.total,
          reasons: score.reasons,
          confidence: score.confidence
        };
      });

      // 4. 排序并返回最佳推荐
      return scoredCrystals
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, maxRecommendations);

    } catch (error) {
      console.error('智能推荐算法错误:', error);
      // 降级到基础推荐
      return this.quickMoodRecommendation('neutral') ? [this.quickMoodRecommendation('neutral')!] : [];
    }
  }

  /**
   * 解析个人能量画像
   */
  private static parsePersonalEnergyProfile(userProfile: UserProfileDataOutput): PersonalEnergyProfile {
    return {
      mbtiType: userProfile.mbtiLikeType || '',
      zodiacSign: userProfile.inferredZodiac || '',
      element: userProfile.inferredElement || '',
      chakraBalance: this.parseChakraAnalysis(userProfile.chakraAnalysis || ''),
      emotionalPattern: this.extractEmotionalPattern(userProfile.coreEnergyInsights || ''),
      energyArchetype: this.extractEnergyArchetype(userProfile.coreEnergyInsights || ''),
      preferredEnergyLevel: this.inferPreferredEnergyLevel(userProfile)
    };
  }

  /**
   * 分析当前能量需求，整合当日情绪状态
   */
  private static analyzeEnergyNeeds(energyModel: EnergyModel3D, currentMood?: string): {
    primaryNeed: string;
    secondaryNeeds: string[];
    urgency: 'low' | 'medium' | 'high';
    timeContext: string;
    moodContext: string;
    integratedNeeds: string[];
  } {
    const needs = [];
    let primaryNeed = 'balance';
    let urgency: 'low' | 'medium' | 'high' = 'medium';

    // 分析身体能量
    if (energyModel.physical < 40) {
      needs.push('physical_boost');
      if (energyModel.physical < 25) urgency = 'high';
    } else if (energyModel.physical > 80) {
      needs.push('grounding');
    }

    // 分析心理能量
    if (energyModel.mental < 40) {
      needs.push('mental_clarity');
      primaryNeed = 'focus';
    } else if (energyModel.mental > 80) {
      needs.push('calming');
      primaryNeed = 'peace';
    }

    // 分析精神能量
    if (energyModel.spiritual < 40) {
      needs.push('spiritual_connection');
    }

    // 分析平衡状态
    if (energyModel.balance < 50) {
      needs.push('energy_balance');
      if (energyModel.balance < 30) {
        primaryNeed = 'urgent_balance';
        urgency = 'high';
      }
    }

    // 时间上下文分析
    let timeContext = '';
    switch (energyModel.timeOfDay) {
      case 'morning':
        timeContext = '晨间激活';
        break;
      case 'afternoon':
        timeContext = '午后维持';
        break;
      case 'evening':
        timeContext = '傍晚平衡';
        break;
      case 'night':
        timeContext = '夜间安抚';
        break;
    }

    // 分析当日情绪状态的影响
    let moodContext = '';
    const moodNeeds: string[] = [];

    if (currentMood) {
      switch (currentMood) {
        case 'stressed':
          moodNeeds.push('stress_relief', 'calming', 'grounding');
          moodContext = '压力缓解';
          if (primaryNeed === 'balance') primaryNeed = 'stress_relief';
          urgency = 'high';
          break;
        case 'anxious':
          moodNeeds.push('anxiety_relief', 'peace', 'emotional_stability');
          moodContext = '焦虑安抚';
          if (primaryNeed === 'balance') primaryNeed = 'anxiety_relief';
          if (urgency !== 'high') urgency = 'medium';
          break;
        case 'sad':
          moodNeeds.push('emotional_healing', 'comfort', 'heart_opening');
          moodContext = '情感疗愈';
          if (primaryNeed === 'balance') primaryNeed = 'emotional_healing';
          break;
        case 'tired':
          moodNeeds.push('energy_boost', 'vitality', 'physical_support');
          moodContext = '能量提升';
          if (energyModel.physical < 50) urgency = 'high';
          break;
        case 'excited':
          moodNeeds.push('grounding', 'balance', 'focus');
          moodContext = '能量平衡';
          if (energyModel.balance < 60) primaryNeed = 'grounding';
          break;
        case 'happy':
          moodNeeds.push('amplification', 'joy_enhancement', 'gratitude');
          moodContext = '正能量增强';
          break;
        case 'grateful':
          moodNeeds.push('heart_opening', 'spiritual_connection', 'love_energy');
          moodContext = '心灵连接';
          break;
        case 'neutral':
          moodNeeds.push('general_balance', 'clarity', 'awareness');
          moodContext = '整体平衡';
          break;
        default:
          moodContext = '基础调节';
          break;
      }
    }

    // 整合3D能量模型和情绪状态的需求
    const integratedNeeds = [...new Set([...needs, ...moodNeeds])];

    // 如果情绪状态表明紧急需求，调整优先级
    if (currentMood && ['stressed', 'anxious'].includes(currentMood)) {
      urgency = 'high';
    }

    return {
      primaryNeed,
      secondaryNeeds: needs,
      urgency,
      timeContext,
      moodContext,
      integratedNeeds
    };
  }

  /**
   * 计算智能匹配分数，整合当日情绪状态
   */
  private static calculateIntelligentMatchScore(
    crystal: any,
    personalProfile: PersonalEnergyProfile,
    energyNeeds: any,
    energyModel: EnergyModel3D,
    currentMood?: string
  ): { total: number; reasons: string[]; confidence: 'low' | 'medium' | 'high' } {
    let score = 0;
    const reasons: string[] = [];
    let confidence: 'low' | 'medium' | 'high' = 'medium';

    // 1. 当日情绪状态匹配 (权重: 30% - 最高优先级)
    if (currentMood && crystal.emotions && (crystal.emotions as readonly string[]).includes(currentMood)) {
      score += 30;
      reasons.push(`完美匹配您今日的${this.getMoodLabel(currentMood)}状态`);
      confidence = 'high';
    }

    // 2. 整合需求匹配 (权重: 25%)
    if (energyNeeds.integratedNeeds && crystal.primaryEffects) {
      const needsMatch = energyNeeds.integratedNeeds.some((need: string) =>
        crystal.primaryEffects.some((effect: string) =>
          this.matchNeedWithEffect(need, effect)
        )
      );
      if (needsMatch) {
        score += 25;
        reasons.push(`针对您的${energyNeeds.moodContext || '当前需求'}提供支持`);
      }
    }

    // 3. MBTI匹配 (权重: 20%)
    if (crystal.mbtiTypes && personalProfile.mbtiType) {
      const mbtiMatch = crystal.mbtiTypes.some((type: string) =>
        personalProfile.mbtiType.includes(type)
      );
      if (mbtiMatch) {
        score += 20;
        reasons.push(`与您的${personalProfile.mbtiType}性格类型高度匹配`);
        if (confidence !== 'high') confidence = 'high';
      }
    }

    // 4. 能量等级匹配 (权重: 15%)
    if (crystal.energyLevel && (crystal.energyLevel as readonly number[]).includes(personalProfile.preferredEnergyLevel)) {
      score += 15;
      reasons.push(`适合您当前的能量状态`);
    }

    // 5. 脉轮平衡需求 (权重: 10%)
    const chakraMatch = this.calculateChakraMatch(crystal, personalProfile.chakraBalance);
    score += Math.round(chakraMatch.score * 0.67); // 调整为10%权重
    if (chakraMatch.score > 0) {
      reasons.push(chakraMatch.reason);
    }

    // 6. 时间上下文匹配 (权重: 5%)
    const timeMatch = this.calculateTimeContextMatch(crystal, energyModel);
    score += Math.round(timeMatch.score * 0.5); // 调整为5%权重
    if (timeMatch.score > 0) {
      reasons.push(timeMatch.reason);
    }

    // 7. 能量趋势匹配 (权重: 5%)
    const trendMatch = this.calculateTrendMatch(crystal, energyModel.trend);
    score += Math.round(trendMatch.score * 0.5); // 调整为5%权重
    if (trendMatch.score > 0) {
      reasons.push(trendMatch.reason);
    }

    // 紧急情绪状态加分
    if (currentMood && ['stressed', 'anxious'].includes(currentMood) &&
        crystal.primaryEffects &&
        (crystal.primaryEffects as readonly string[]).some((effect: string) =>
          effect.includes('平静') || effect.includes('安抚') || effect.includes('缓解')
        )) {
      score += 10;
      reasons.push(`特别适合缓解当前的紧急情绪状态`);
    }

    // 调整置信度
    if (score > 80) confidence = 'high';
    else if (score < 50) confidence = 'low';

    return {
      total: Math.min(100, Math.max(0, score)),
      reasons,
      confidence
    };
  }

  /**
   * 推断当前情绪状态
   */
  private static inferCurrentMood(energyModel: EnergyModel3D): string {
    const { physical, mental, spiritual, balance } = energyModel;

    if (balance < 30) return 'stressed';
    if (physical < 30 && mental < 30) return 'tired';
    if (mental < 40) return 'anxious';
    if (physical > 70 && mental > 70) return 'excited';
    if (spiritual > 70) return 'grateful';
    if (balance > 70) return 'happy';

    return 'neutral';
  }

  /**
   * 计算脉轮匹配度
   */
  private static calculateChakraMatch(crystal: any, chakraBalance: Record<string, number>): { score: number; reason: string } {
    if (!crystal.chakra || Object.keys(chakraBalance).length === 0) {
      return { score: 0, reason: '' };
    }

    // 找到最需要平衡的脉轮
    const lowestChakra = Object.entries(chakraBalance)
      .sort(([,a], [,b]) => a - b)[0];

    if (!lowestChakra) return { score: 0, reason: '' };

    const [chakraName, chakraValue] = lowestChakra;

    // 检查水晶是否对应这个脉轮
    const crystalChakras = Array.isArray(crystal.chakra) ? crystal.chakra : [crystal.chakra];
    const chakraMapping: Record<string, string[]> = {
      'root': ['chakra_root', '根轮'],
      'sacral': ['chakra_sacral', '骶轮'],
      'solar': ['chakra_solarPlexus', '太阳神经丛'],
      'heart': ['chakra_heart', '心轮'],
      'throat': ['chakra_throat', '喉轮'],
      'third_eye': ['chakra_thirdEye', '眉心轮'],
      'crown': ['chakra_crown', '顶轮']
    };

    for (const [key, variations] of Object.entries(chakraMapping)) {
      if (chakraName.includes(key) && (crystalChakras as readonly string[]).some((cc: string) => variations.includes(cc))) {
        const urgency = chakraValue < 40 ? 15 : 10;
        return {
          score: urgency,
          reason: `有助于平衡您的${variations[1]}能量`
        };
      }
    }

    return { score: 0, reason: '' };
  }

  /**
   * 计算时间上下文匹配度
   */
  private static calculateTimeContextMatch(crystal: any, energyModel: EnergyModel3D): { score: number; reason: string } {
    const { timeOfDay } = energyModel;

    // 根据水晶属性和时间匹配
    const timePreferences: Record<string, string[]> = {
      morning: ['citrine', 'sunstone', 'carnelian'], // 激活型水晶
      afternoon: ['clear_quartz', 'fluorite', 'tiger_eye'], // 专注型水晶
      evening: ['amethyst', 'rose_quartz', 'moonstone'], // 平衡型水晶
      night: ['lepidolite', 'howlite', 'selenite'] // 安抚型水晶
    };

    const preferredCrystals = timePreferences[timeOfDay] || [];
    if ((preferredCrystals as readonly string[]).includes(crystal.id)) {
      return {
        score: 10,
        reason: `适合${timeOfDay === 'morning' ? '晨间' : timeOfDay === 'afternoon' ? '午后' : timeOfDay === 'evening' ? '傍晚' : '夜间'}使用`
      };
    }

    return { score: 0, reason: '' };
  }

  /**
   * 计算能量趋势匹配度
   */
  private static calculateTrendMatch(crystal: any, trend: 'rising' | 'stable' | 'declining'): { score: number; reason: string } {
    const trendCrystals: Record<string, string[]> = {
      rising: ['citrine', 'carnelian', 'sunstone'], // 增强型
      stable: ['clear_quartz', 'green_aventurine'], // 维持型
      declining: ['amethyst', 'rose_quartz', 'black_obsidian'] // 恢复型
    };

    const suitableCrystals = trendCrystals[trend] || [];
    if ((suitableCrystals as readonly string[]).includes(crystal.id)) {
      return {
        score: 10,
        reason: `适合当前${trend === 'rising' ? '上升' : trend === 'stable' ? '稳定' : '下降'}的能量趋势`
      };
    }

    return { score: 0, reason: '' };
  }

  /**
   * 生成个性化使用建议
   */
  private static generatePersonalizedUsage(
    crystal: any,
    personalProfile: PersonalEnergyProfile,
    energyNeeds: any
  ): string {
    const baseUsage = crystal.usage || '随身携带或放置在生活空间中';
    const personalizations = [];

    // 基于MBTI的个性化建议
    if (personalProfile.mbtiType.includes('I')) {
      personalizations.push('建议在安静的个人空间中使用');
    } else if (personalProfile.mbtiType.includes('E')) {
      personalizations.push('可在社交场合佩戴增强能量');
    }

    // 基于能量需求的建议
    if (energyNeeds.primaryNeed === 'focus') {
      personalizations.push('放在工作区域有助于提升专注力');
    } else if (energyNeeds.primaryNeed === 'peace') {
      personalizations.push('睡前握在手中或放在枕头下');
    }

    // 基于时间的建议
    if (energyNeeds.timeContext.includes('晨间')) {
      personalizations.push('建议在晨间冥想时使用');
    } else if (energyNeeds.timeContext.includes('夜间')) {
      personalizations.push('适合睡前放松时使用');
    }

    return personalizations.length > 0
      ? `${baseUsage}。${personalizations.join('，')}。`
      : baseUsage;
  }

  /**
   * 解析脉轮分析文本
   */
  private static parseChakraAnalysis(chakraText: string): Record<string, number> {
    const chakras: Record<string, number> = {};

    // 简化的解析逻辑，实际应该更复杂
    const chakraNames = ['root', 'sacral', 'solar', 'heart', 'throat', 'third_eye', 'crown'];
    chakraNames.forEach(chakra => {
      // 默认值，实际应该从文本中解析
      chakras[chakra] = 50 + Math.random() * 30; // 50-80之间的随机值
    });

    return chakras;
  }

  /**
   * 提取情感模式
   */
  private static extractEmotionalPattern(insights: string): string {
    if (insights.includes('情感丰富') || insights.includes('敏感')) return 'sensitive';
    if (insights.includes('理性') || insights.includes('逻辑')) return 'rational';
    if (insights.includes('平衡') || insights.includes('稳定')) return 'balanced';
    return 'adaptive';
  }

  /**
   * 提取能量原型
   */
  private static extractEnergyArchetype(insights: string): string {
    if (insights.includes('领导') || insights.includes('主导')) return 'leader';
    if (insights.includes('创造') || insights.includes('艺术')) return 'creator';
    if (insights.includes('治愈') || insights.includes('帮助')) return 'healer';
    if (insights.includes('智慧') || insights.includes('学者')) return 'sage';
    return 'explorer';
  }

  /**
   * 推断偏好能量等级
   */
  private static inferPreferredEnergyLevel(userProfile: UserProfileDataOutput): number {
    const mbti = userProfile.mbtiLikeType || '';

    if (mbti.includes('E') && mbti.includes('S')) return 4; // 外向实感型喜欢高能量
    if (mbti.includes('I') && mbti.includes('N')) return 2; // 内向直觉型喜欢低能量
    if (mbti.includes('E')) return 3; // 外向型偏好中高能量
    if (mbti.includes('I')) return 2; // 内向型偏好中低能量

    return 3; // 默认中等能量
  }

  /**
   * 生成当前3D能量模型
   * 基于时间、用户画像等因素计算当前能量状态
   */
  static generateCurrent3DEnergyModel(userProfile?: UserProfileDataOutput): EnergyModel3D {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    // 基础能量计算
    let physical = 50;
    let mental = 50;
    let spiritual = 50;

    // 时间因素
    if (hour >= 6 && hour <= 10) {
      physical += 20; // 晨间身体能量高
      mental += 10;
    } else if (hour >= 11 && hour <= 14) {
      mental += 20; // 上午心理能量高
      physical += 10;
    } else if (hour >= 15 && hour <= 17) {
      mental -= 10; // 下午能量下降
      physical -= 5;
    } else if (hour >= 18 && hour <= 21) {
      spiritual += 15; // 傍晚精神能量上升
      physical -= 10;
    } else {
      physical -= 20; // 夜间身体能量低
      mental -= 15;
      spiritual += 10;
    }

    // MBTI影响
    if (userProfile?.mbtiLikeType) {
      const mbti = userProfile.mbtiLikeType;
      if (mbti.includes('E')) {
        physical += 10;
        mental += 5;
      }
      if (mbti.includes('I')) {
        spiritual += 10;
        mental += 5;
      }
      if (mbti.includes('N')) {
        spiritual += 10;
      }
      if (mbti.includes('S')) {
        physical += 10;
      }
    }

    // 周末效应
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      physical += 5;
      spiritual += 10;
      mental -= 5;
    }

    // 确保数值在合理范围内
    physical = Math.max(10, Math.min(90, physical));
    mental = Math.max(10, Math.min(90, mental));
    spiritual = Math.max(10, Math.min(90, spiritual));

    const balance = (physical + mental + spiritual) / 3;

    // 确定趋势
    let trend: 'rising' | 'stable' | 'declining' = 'stable';
    if (hour >= 6 && hour <= 12) trend = 'rising';
    else if (hour >= 18 && hour <= 23) trend = 'declining';

    // 确定时间段
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 'afternoon';
    if (hour >= 5 && hour <= 11) timeOfDay = 'morning';
    else if (hour >= 12 && hour <= 17) timeOfDay = 'afternoon';
    else if (hour >= 18 && hour <= 22) timeOfDay = 'evening';
    else timeOfDay = 'night';

    return {
      physical,
      mental,
      spiritual,
      balance,
      trend,
      timeOfDay,
      dayOfWeek
    };
  }

  /**
   * 获取情绪状态的中文标签
   */
  private static getMoodLabel(mood: string): string {
    const moodLabels: Record<string, string> = {
      'stressed': '压力',
      'anxious': '焦虑',
      'sad': '悲伤',
      'tired': '疲惫',
      'neutral': '平静',
      'happy': '开心',
      'excited': '兴奋',
      'grateful': '感恩'
    };
    return moodLabels[mood] || mood;
  }

  /**
   * 匹配需求与水晶效果
   */
  private static matchNeedWithEffect(need: string, effect: string): boolean {
    const needEffectMapping: Record<string, string[]> = {
      'stress_relief': ['平静', '缓解', '放松', '安抚'],
      'anxiety_relief': ['平静', '安抚', '稳定', '镇定'],
      'emotional_healing': ['疗愈', '治愈', '情感', '心灵'],
      'energy_boost': ['活力', '能量', '提升', '激活'],
      'grounding': ['接地', '稳定', '根基', '平衡'],
      'calming': ['平静', '安抚', '镇定', '宁静'],
      'peace': ['平和', '宁静', '安详', '平静'],
      'emotional_stability': ['稳定', '平衡', '调节', '和谐'],
      'comfort': ['安慰', '温暖', '支持', '陪伴'],
      'heart_opening': ['心轮', '爱', '开放', '连接'],
      'vitality': ['活力', '生命力', '精力', '能量'],
      'physical_support': ['身体', '体力', '健康', '恢复'],
      'balance': ['平衡', '和谐', '调节', '稳定'],
      'focus': ['专注', '集中', '清晰', '明确'],
      'amplification': ['增强', '放大', '提升', '强化'],
      'joy_enhancement': ['快乐', '喜悦', '愉悦', '欢乐'],
      'gratitude': ['感恩', '感谢', '珍惜', '欣赏'],
      'spiritual_connection': ['灵性', '精神', '连接', '觉醒'],
      'love_energy': ['爱', '慈悲', '温暖', '关怀'],
      'general_balance': ['平衡', '和谐', '整体', '全面'],
      'clarity': ['清晰', '明确', '透明', '清楚'],
      'awareness': ['觉知', '意识', '察觉', '感知']
    };

    const keywords = needEffectMapping[need] || [];
    return keywords.some(keyword => effect.includes(keyword));
  }
}
