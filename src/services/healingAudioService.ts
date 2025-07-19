import { HEALING_AUDIO_LIBRARY, AudioRecommendation } from '@/components/HealingAudioRecommendation';

export interface AudioRecommendationContext {
  meditationType?: string;
  chakraFocus?: string;
  emotionalState?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  duration?: number; // 期望的冥想时长（分钟）
  experience?: 'beginner' | 'intermediate' | 'advanced';
  intention?: string;
}

export class HealingAudioService {
  
  /**
   * 根据上下文智能推荐音频
   */
  static getRecommendations(context: AudioRecommendationContext): AudioRecommendation[] {
    const recommendations: AudioRecommendation[] = [];
    
    // 基于冥想类型的推荐
    if (context.meditationType) {
      recommendations.push(...this.getAudioByMeditationType(context.meditationType));
    }
    
    // 基于脉轮的推荐
    if (context.chakraFocus) {
      recommendations.push(...this.getAudioByChakra(context.chakraFocus));
    }
    
    // 基于情绪状态的推荐
    if (context.emotionalState) {
      recommendations.push(...this.getAudioByEmotionalState(context.emotionalState));
    }
    
    // 基于时间的推荐
    if (context.timeOfDay) {
      recommendations.push(...this.getAudioByTimeOfDay(context.timeOfDay));
    }
    
    // 基于经验水平的推荐
    if (context.experience) {
      recommendations.push(...this.getAudioByExperience(context.experience));
    }
    
    // 去重并按优先级排序
    const uniqueRecommendations = this.deduplicateAndSort(recommendations, context);
    
    // 返回前5个推荐
    return uniqueRecommendations.slice(0, 5);
  }
  
  /**
   * 根据冥想类型推荐音频
   */
  private static getAudioByMeditationType(type: string): AudioRecommendation[] {
    const typeMapping: Record<string, string[]> = {
      'crystal_focus': ['solfeggio-528', 'crystal-bowl-chakra', 'ambient-temple'],
      'chakra_balance': ['crystal-bowl-chakra', 'solfeggio-528', 'solfeggio-432'],
      'emotional_healing': ['solfeggio-528', 'solfeggio-639', 'crystal-bowl-heart', 'ocean-waves'],
      'protection': ['theta-meditation', 'forest-rain', 'ambient-temple'],
      'morning-energy': ['solfeggio-432', 'crystal-bowl-chakra', 'mountain-stream'],
      'heart-healing': ['solfeggio-528', 'solfeggio-639', 'crystal-bowl-heart'],
      'protection-grounding': ['forest-rain', 'mountain-stream', 'theta-meditation'],
      'intuition-awakening': ['theta-meditation', 'ambient-space', 'crystal-bowl-chakra']
    };
    
    const audioIds = typeMapping[type] || [];
    return HEALING_AUDIO_LIBRARY.filter(audio => audioIds.includes(audio.id));
  }
  
  /**
   * 根据脉轮推荐音频
   */
  private static getAudioByChakra(chakra: string): AudioRecommendation[] {
    const chakraMapping: Record<string, string[]> = {
      'root': ['forest-rain', 'mountain-stream', 'theta-meditation'],
      'sacral': ['solfeggio-639', 'ocean-waves', 'crystal-bowl-chakra'],
      'solarPlexus': ['solfeggio-528', 'alpha-relaxation', 'crystal-bowl-chakra'],
      'heart': ['solfeggio-528', 'solfeggio-639', 'crystal-bowl-heart', 'ocean-waves'],
      'throat': ['solfeggio-639', 'crystal-bowl-chakra', 'mountain-stream'],
      'thirdEye': ['theta-meditation', 'ambient-space', 'crystal-bowl-chakra'],
      'crown': ['solfeggio-432', 'ambient-space', 'crystal-bowl-chakra']
    };
    
    const audioIds = chakraMapping[chakra] || [];
    return HEALING_AUDIO_LIBRARY.filter(audio => audioIds.includes(audio.id));
  }
  
  /**
   * 根据情绪状态推荐音频
   */
  private static getAudioByEmotionalState(state: string): AudioRecommendation[] {
    const stateMapping: Record<string, string[]> = {
      'stressed': ['alpha-relaxation', 'ocean-waves', 'forest-rain'],
      'anxious': ['theta-meditation', 'ocean-waves', 'solfeggio-432'],
      'sad': ['solfeggio-528', 'crystal-bowl-heart', 'ambient-temple'],
      'angry': ['forest-rain', 'mountain-stream', 'alpha-relaxation'],
      'tired': ['theta-meditation', 'ocean-waves', 'ambient-space'],
      'excited': ['solfeggio-432', 'forest-rain', 'alpha-relaxation'],
      'peaceful': ['ambient-space', 'crystal-bowl-chakra', 'mountain-stream'],
      'loving': ['solfeggio-528', 'solfeggio-639', 'crystal-bowl-heart']
    };
    
    const audioIds = stateMapping[state] || [];
    return HEALING_AUDIO_LIBRARY.filter(audio => audioIds.includes(audio.id));
  }
  
  /**
   * 根据时间推荐音频
   */
  private static getAudioByTimeOfDay(timeOfDay: string): AudioRecommendation[] {
    const timeMapping: Record<string, string[]> = {
      'morning': ['solfeggio-432', 'mountain-stream', 'crystal-bowl-chakra'],
      'afternoon': ['alpha-relaxation', 'forest-rain', 'solfeggio-528'],
      'evening': ['ocean-waves', 'theta-meditation', 'ambient-temple'],
      'night': ['theta-meditation', 'ocean-waves', 'ambient-space']
    };
    
    const audioIds = timeMapping[timeOfDay] || [];
    return HEALING_AUDIO_LIBRARY.filter(audio => audioIds.includes(audio.id));
  }
  
  /**
   * 根据经验水平推荐音频
   */
  private static getAudioByExperience(experience: string): AudioRecommendation[] {
    const experienceMapping: Record<string, string[]> = {
      'beginner': ['ocean-waves', 'forest-rain', 'solfeggio-432', 'alpha-relaxation'],
      'intermediate': ['solfeggio-528', 'crystal-bowl-chakra', 'theta-meditation'],
      'advanced': ['ambient-space', 'theta-meditation', 'crystal-bowl-chakra', 'ambient-temple']
    };
    
    const audioIds = experienceMapping[experience] || [];
    return HEALING_AUDIO_LIBRARY.filter(audio => audioIds.includes(audio.id));
  }
  
  /**
   * 去重并按优先级排序
   */
  private static deduplicateAndSort(
    recommendations: AudioRecommendation[], 
    context: AudioRecommendationContext
  ): AudioRecommendation[] {
    // 使用Map去重，保持第一次出现的顺序
    const uniqueMap = new Map<string, AudioRecommendation>();
    recommendations.forEach(audio => {
      if (!uniqueMap.has(audio.id)) {
        uniqueMap.set(audio.id, audio);
      }
    });
    
    const uniqueRecommendations = Array.from(uniqueMap.values());
    
    // 根据上下文计算优先级分数
    return uniqueRecommendations.sort((a, b) => {
      const scoreA = this.calculatePriorityScore(a, context);
      const scoreB = this.calculatePriorityScore(b, context);
      return scoreB - scoreA; // 降序排列
    });
  }
  
  /**
   * 计算音频的优先级分数
   */
  private static calculatePriorityScore(
    audio: AudioRecommendation, 
    context: AudioRecommendationContext
  ): number {
    let score = 0;
    
    // 脉轮匹配加分
    if (context.chakraFocus && audio.chakraAlignment === context.chakraFocus) {
      score += 10;
    }
    
    // 频率类型在某些情况下优先
    if (audio.type === 'frequency') {
      score += 5;
    }
    
    // 水晶钵在水晶相关冥想中优先
    if (context.meditationType?.includes('crystal') && audio.type === 'crystal_bowl') {
      score += 8;
    }
    
    // 自然音效在压力缓解中优先
    if (context.emotionalState === 'stressed' && audio.type === 'nature') {
      score += 6;
    }
    
    // 双耳节拍在深度冥想中优先
    if (context.meditationType?.includes('intuition') && audio.type === 'binaural') {
      score += 7;
    }
    
    return score;
  }
  
  /**
   * 获取特定类型的所有音频
   */
  static getAudioByType(type: AudioRecommendation['type']): AudioRecommendation[] {
    return HEALING_AUDIO_LIBRARY.filter(audio => audio.type === type);
  }
  
  /**
   * 根据ID获取音频
   */
  static getAudioById(id: string): AudioRecommendation | undefined {
    return HEALING_AUDIO_LIBRARY.find(audio => audio.id === id);
  }
  
  /**
   * 获取所有音频
   */
  static getAllAudio(): AudioRecommendation[] {
    return [...HEALING_AUDIO_LIBRARY];
  }
  
  /**
   * 搜索音频
   */
  static searchAudio(query: string): AudioRecommendation[] {
    const lowerQuery = query.toLowerCase();
    return HEALING_AUDIO_LIBRARY.filter(audio => 
      audio.name.toLowerCase().includes(lowerQuery) ||
      audio.description.toLowerCase().includes(lowerQuery) ||
      audio.benefits.some(benefit => benefit.toLowerCase().includes(lowerQuery))
    );
  }
  
  /**
   * 获取随机推荐
   */
  static getRandomRecommendations(count: number = 3): AudioRecommendation[] {
    const shuffled = [...HEALING_AUDIO_LIBRARY].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

export default HealingAudioService;
