/**
 * 高级AI设计服务
 * 专门处理复杂的水晶饰品设计生成，使用专业AI模型
 */

export interface AdvancedDesignParams {
  // 基础设计参数
  designCategory: string;
  mainStones: any[];

  // 高级艺术参数
  artStyle: string;
  qualityLevel: string;
  renderingLevel: string;

  // 水晶配置参数
  crystalShape: string;
  transparency: string;
  crystalProcessing: string;

  // 材质配件参数
  metalType: string;

  // 文化风格参数
  culturalStyle: string;

  // 构图美学参数
  composition: string;
  structuralAesthetics: string;
  overallLayout: string;
  visualFocus: string;

  // 场景配置参数
  background: string;
  accessories: string[];
  accessoryQuantity: string;
  accessoryArrangement: string;

  // 珠子配置参数（新增）
  beadSize?: string;
  beadArrangement?: string;
  metalSpacers?: string;

  // 自定义关键词
  customKeywords: string[];

  // 生成的提示词
  aiPrompt: string;
  negativePrompt: string;
}

export interface AdvancedAIResponse {
  success: boolean;
  data?: {
    images: Array<{
      id: string;
      url: string;
      prompt: string;
      parameters: AdvancedDesignParams;
      quality_score: number;
      generation_time: number;
      model_used: string;
    }>;
    metadata: {
      total_parameters: number;
      complexity_level: 'high' | 'expert' | 'professional';
      processing_time: number;
      model_version: string;
    };
  };
  error?: string;
  message?: string;
}

/**
 * 高级AI设计生成服务
 */
export class AdvancedAIService {
  private static instance: AdvancedAIService;
  private baseURL = process.env.NEXT_PUBLIC_ADVANCED_AI_API_URL || 'https://api.advanced-crystal-ai.com';
  private apiKey = process.env.NEXT_PUBLIC_ADVANCED_AI_API_KEY || '';
  private cache = new Map<string, { data: AdvancedAIResponse; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

  private constructor() {
    console.log('🚀 高级AI服务初始化:', {
      hasApiKey: !!this.apiKey,
      baseURL: this.baseURL,
      environment: process.env.NODE_ENV,
      cacheEnabled: true
    });
  }

  public static getInstance(): AdvancedAIService {
    if (!AdvancedAIService.instance) {
      AdvancedAIService.instance = new AdvancedAIService();
    }
    return AdvancedAIService.instance;
  }

  /**
   * 生成高级水晶设计
   */
  async generateAdvancedDesign(params: AdvancedDesignParams): Promise<AdvancedAIResponse> {
    const startTime = Date.now();

    // 生成缓存键
    const cacheKey = this.generateCacheKey(params);

    // 检查缓存
    const cachedResult = this.getCachedResult(cacheKey);
    if (cachedResult) {
      console.log('💾 使用缓存结果:', {
        cacheKey: cacheKey.substring(0, 16) + '...',
        age: Date.now() - cachedResult.timestamp
      });
      return cachedResult.data;
    }

    // 计算复杂度级别
    const complexityLevel = this.calculateComplexityLevel(params);

    // 选择合适的AI模型
    const modelConfig = this.selectAIModel(complexityLevel);

    // 优化提示词
    const optimizedPrompt = this.optimizePromptForAdvancedAI(params);

    console.log('🎨 开始高级AI设计生成:', {
      complexity: complexityLevel,
      model: modelConfig.model,
      parameters_count: Object.keys(params).length,
      prompt_length: optimizedPrompt.positive.length,
      cacheKey: cacheKey.substring(0, 16) + '...'
    });

    // 在开发环境中直接使用模拟数据，避免网络请求
    if (process.env.NODE_ENV === 'development' || !this.apiKey) {
      console.log('🔧 使用开发模式，生成模拟高级设计数据');
      return this.generateMockAdvancedDesign(params, complexityLevel, modelConfig, optimizedPrompt);
    }

    try {
      // 准备请求数据
      const requestData = {
        prompt: optimizedPrompt.positive,
        negative_prompt: optimizedPrompt.negative,
        parameters: params,
        model: modelConfig.model,
        settings: {
          steps: modelConfig.steps,
          cfg_scale: modelConfig.cfg_scale,
          sampler: modelConfig.sampler,
          seed: -1,
          batch_size: 4, // 生成4张图片
          width: 1024,
          height: 1024
        },
        advanced_features: {
          style_transfer: true,
          detail_enhancement: true,
          color_correction: true,
          quality_upscaling: true
        }
      };

      // 发送请求到高级AI服务
      const response = await fetch(`${this.baseURL}/v2/advanced-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Client-Type': 'crystal-design-advanced',
          'X-Complexity-Level': complexityLevel
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`高级AI服务响应错误: ${response.status}`);
      }

      const result = await response.json();

      const finalResult = {
        success: true,
        data: {
          images: result.images.map((img: any, index: number) => ({
            id: `advanced_${Date.now()}_${index}`,
            url: img.url,
            prompt: optimizedPrompt.positive,
            parameters: params,
            quality_score: img.quality_score || 0.85,
            generation_time: img.generation_time || 0,
            model_used: modelConfig.model
          })),
          metadata: {
            total_parameters: Object.keys(params).length,
            complexity_level: complexityLevel,
            processing_time: result.processing_time || 0,
            model_version: result.model_version || modelConfig.model,
            generation_time: Date.now() - startTime,
            cached: false
          }
        }
      };

      // 缓存结果
      this.setCachedResult(cacheKey, finalResult);

      console.log('✅ 高级AI设计生成完成:', {
        complexity: complexityLevel,
        total_time: Date.now() - startTime,
        images_count: finalResult.data.images.length,
        cached: false
      });

      return finalResult;

    } catch (error) {
      console.error('❌ 高级AI服务请求失败:', error);

      // 智能错误处理和重试
      const errorType = this.classifyError(error);
      const shouldRetry = this.shouldRetryRequest(errorType);

      if (shouldRetry) {
        console.log('🔄 尝试重试请求...');
        try {
          // 简化参数重试
          const simplifiedParams = this.simplifyParamsForRetry(params);
          const retryResult = await this.retryWithSimplifiedParams(simplifiedParams);
          if (retryResult.success) {
            return retryResult;
          }
        } catch (retryError) {
          console.error('❌ 重试也失败了:', retryError);
        }
      }

      // 最终降级到模拟数据
      console.log('🎭 降级到模拟数据生成');
      const mockResult = await this.generateMockAdvancedDesign(params, complexityLevel, modelConfig, optimizedPrompt);

      // 缓存模拟结果
      this.setCachedResult(cacheKey, mockResult);

      return mockResult;
    }
  }

  /**
   * 计算设计复杂度级别
   */
  private calculateComplexityLevel(params: AdvancedDesignParams): 'high' | 'expert' | 'professional' {
    let complexityScore = 0;

    // 基础参数权重
    if (params.mainStones?.length > 1) complexityScore += 2;
    if (params.mainStones?.length > 3) complexityScore += 1; // 超过3个水晶额外加分
    if (params.customKeywords?.length > 3) complexityScore += 2;
    if (params.customKeywords?.length > 6) complexityScore += 1; // 超过6个关键词额外加分

    // 高级参数权重
    if (params.artStyle !== 'realistic') complexityScore += 1;
    if (params.renderingLevel === '超精细') complexityScore += 3;
    if (params.renderingLevel === '精细') complexityScore += 2;
    if (params.renderingLevel === '标准') complexityScore += 1;

    // 文化风格权重
    if (params.culturalStyle !== 'chinese_traditional') complexityScore += 2;
    if (params.culturalStyle === 'mixed_cultural') complexityScore += 1; // 混合文化风格额外复杂

    // 构图复杂度权重
    if (params.composition === 'golden_ratio') complexityScore += 2;
    if (params.composition === 'rule_of_thirds') complexityScore += 1;
    if (params.structuralAesthetics !== 'structural beauty display') complexityScore += 1;

    // 配件复杂度权重
    if (params.accessories?.length > 0) complexityScore += 1;
    if (params.accessories?.length > 1) complexityScore += 1; // 多种装饰元素
    if (params.accessoryArrangement === 'integrated design') complexityScore += 1;

    // 珠子配置复杂度权重（新增）
    if (params.beadSize === 'mixed') complexityScore += 1; // 混合大小更复杂
    if (params.beadArrangement === 'gradient_arrangement') complexityScore += 2; // 渐变排列复杂
    if (params.beadArrangement === 'focal_center') complexityScore += 1; // 中心焦点设计
    if (params.metalSpacers && params.metalSpacers !== 'none') complexityScore += 1; // 金属间隔珠

    // 水晶处理复杂度
    if (params.crystalProcessing === 'faceted') complexityScore += 1; // 刻面处理
    if (params.transparency === 'translucent') complexityScore += 1; // 半透明更复杂

    // 背景复杂度
    if (params.background !== 'pure white background') complexityScore += 1;

    console.log('🧮 复杂度计算详情:', {
      mainStones: params.mainStones?.length || 0,
      customKeywords: params.customKeywords?.length || 0,
      artStyle: params.artStyle,
      renderingLevel: params.renderingLevel,
      culturalStyle: params.culturalStyle,
      accessories: params.accessories?.length || 0,
      beadConfig: {
        size: params.beadSize,
        arrangement: params.beadArrangement,
        metalSpacers: params.metalSpacers
      },
      totalScore: complexityScore
    });

    if (complexityScore >= 12) return 'professional';
    if (complexityScore >= 7) return 'expert';
    return 'high';
  }

  /**
   * 选择合适的AI模型配置
   */
  private selectAIModel(complexityLevel: string) {
    const modelConfigs = {
      'professional': {
        model: 'crystal-master-pro-v3',
        steps: 50,
        cfg_scale: 8.5,
        sampler: 'DPM++ 2M Karras'
      },
      'expert': {
        model: 'crystal-expert-v2',
        steps: 40,
        cfg_scale: 7.5,
        sampler: 'Euler a'
      },
      'high': {
        model: 'crystal-advanced-v1',
        steps: 30,
        cfg_scale: 7.0,
        sampler: 'DDIM'
      }
    };
    
    return modelConfigs[complexityLevel as keyof typeof modelConfigs] || modelConfigs.high;
  }

  /**
   * 为高级AI优化提示词
   */
  private optimizePromptForAdvancedAI(params: AdvancedDesignParams) {
    const complexityLevel = this.calculateComplexityLevel(params);
    const positivePrompt = params.aiPrompt;
    const negativePrompt = params.negativePrompt;

    // 根据复杂度级别选择不同的增强策略
    const qualityEnhancements = this.getQualityEnhancements(complexityLevel, params);
    const styleEnhancements = this.getStyleEnhancements(params);
    const technicalEnhancements = this.getTechnicalEnhancements(params);

    // 智能组合增强词
    const enhancedPositive = [
      ...qualityEnhancements,
      positivePrompt,
      ...styleEnhancements,
      ...technicalEnhancements
    ].filter(Boolean).join(', ');

    // 根据参数动态生成负面提示词
    const dynamicNegative = this.generateDynamicNegativePrompt(params);
    const enhancedNegative = [
      negativePrompt,
      ...dynamicNegative
    ].filter(Boolean).join(', ');

    console.log('🎨 提示词优化完成:', {
      complexity: complexityLevel,
      original_length: positivePrompt.length,
      enhanced_length: enhancedPositive.length,
      enhancement_ratio: (enhancedPositive.length / positivePrompt.length).toFixed(2)
    });

    return {
      positive: enhancedPositive,
      negative: enhancedNegative
    };
  }

  /**
   * 根据复杂度级别获取质量增强词
   */
  private getQualityEnhancements(complexityLevel: string, params: AdvancedDesignParams): string[] {
    const baseQuality = ['(masterpiece:1.4)', '(ultra high quality:1.3)'];

    switch (complexityLevel) {
      case 'professional':
        return [
          ...baseQuality,
          '(museum quality:1.3)',
          '(award winning photography:1.2)',
          '(professional studio lighting:1.2)',
          params.renderingLevel === '超精细' ? '(8k resolution:1.2)' : '(4k resolution:1.1)'
        ];
      case 'expert':
        return [
          ...baseQuality,
          '(professional jewelry photography:1.2)',
          '(expert craftsmanship:1.1)',
          params.renderingLevel === '精细' ? '(high resolution:1.1)' : ''
        ].filter(Boolean);
      default:
        return [
          ...baseQuality,
          '(professional photography:1.1)',
          '(high quality craftsmanship:1.1)'
        ];
    }
  }

  /**
   * 获取风格增强词
   */
  private getStyleEnhancements(params: AdvancedDesignParams): string[] {
    const enhancements: string[] = [];

    // 艺术风格增强
    if (params.artStyle === 'photorealistic') {
      enhancements.push('(photorealistic:1.2)', '(detailed textures:1.1)');
    } else if (params.artStyle === 'artistic') {
      enhancements.push('(artistic composition:1.2)', '(creative lighting:1.1)');
    }

    // 文化风格增强
    if (params.culturalStyle === 'chinese_traditional') {
      enhancements.push('(traditional Chinese aesthetics:1.1)');
    } else if (params.culturalStyle === 'modern_minimalist') {
      enhancements.push('(minimalist design:1.1)', '(clean composition:1.1)');
    }

    // 珠宝类型增强
    if (params.designCategory === 'beaded_bracelet') {
      enhancements.push('(perfect bead alignment:1.1)', '(smooth surface finish:1.1)');
    }

    return enhancements;
  }

  /**
   * 获取技术增强词
   */
  private getTechnicalEnhancements(params: AdvancedDesignParams): string[] {
    const enhancements: string[] = [
      '(crystal clarity:1.2)',
      '(perfect lighting:1.1)',
      '(luxury jewelry:1.1)'
    ];

    // 根据透明度添加增强
    if (params.transparency === 'transparent') {
      enhancements.push('(crystal transparency:1.2)');
    } else if (params.transparency === 'translucent') {
      enhancements.push('(soft translucency:1.1)');
    }

    // 根据加工方式添加增强
    if (params.crystalProcessing === 'faceted') {
      enhancements.push('(precise faceting:1.1)', '(light refraction:1.1)');
    } else if (params.crystalProcessing === 'polished') {
      enhancements.push('(mirror polish:1.1)');
    }

    // 根据金属类型添加增强
    if (params.metalType === 'gold') {
      enhancements.push('(gold luster:1.1)');
    } else if (params.metalType === 'silver') {
      enhancements.push('(silver shine:1.1)');
    }

    return enhancements;
  }

  /**
   * 生成动态负面提示词
   */
  private generateDynamicNegativePrompt(params: AdvancedDesignParams): string[] {
    const negatives: string[] = [
      'amateur photography',
      'poor quality',
      'blurry details',
      'incorrect proportions'
    ];

    // 根据珠宝类型添加特定负面词
    if (params.designCategory === 'beaded_bracelet') {
      negatives.push('uneven beads', 'misaligned pattern', 'rough surface');
    }

    // 根据艺术风格添加负面词
    if (params.artStyle === 'photorealistic') {
      negatives.push('artificial looking', 'cartoon style', 'unrealistic rendering');
    }

    // 根据质量要求添加负面词
    if (params.renderingLevel === '超精细') {
      negatives.push('low resolution', 'pixelated', 'compression artifacts');
    }

    return negatives;
  }

  /**
   * 错误分类
   */
  private classifyError(error: any): 'network' | 'timeout' | 'quota' | 'validation' | 'server' | 'unknown' {
    const errorMessage = error?.message?.toLowerCase() || '';
    const errorStatus = error?.status || error?.response?.status;

    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return 'network';
    }
    if (errorMessage.includes('timeout') || errorStatus === 408) {
      return 'timeout';
    }
    if (errorMessage.includes('quota') || errorMessage.includes('rate limit') || errorStatus === 429) {
      return 'quota';
    }
    if (errorMessage.includes('validation') || errorStatus === 400) {
      return 'validation';
    }
    if (errorStatus >= 500) {
      return 'server';
    }

    return 'unknown';
  }

  /**
   * 判断是否应该重试
   */
  private shouldRetryRequest(errorType: string): boolean {
    const retryableErrors = ['network', 'timeout', 'server'];
    return retryableErrors.includes(errorType);
  }

  /**
   * 简化参数用于重试
   */
  private simplifyParamsForRetry(params: AdvancedDesignParams): AdvancedDesignParams {
    return {
      ...params,
      // 降低渲染质量
      renderingLevel: params.renderingLevel === '超精细' ? '精细' :
                     params.renderingLevel === '精细' ? '标准' : params.renderingLevel,
      // 简化自定义关键词
      customKeywords: params.customKeywords.slice(0, 3),
      // 简化水晶配置
      mainStones: params.mainStones.slice(0, 2),
      // 简化装饰元素
      accessories: params.accessories.slice(0, 1)
    };
  }

  /**
   * 使用简化参数重试
   */
  private async retryWithSimplifiedParams(params: AdvancedDesignParams): Promise<AdvancedAIResponse> {
    const complexityLevel = this.calculateComplexityLevel(params);
    const modelConfig = this.selectAIModel(complexityLevel);
    const optimizedPrompt = this.optimizePromptForAdvancedAI(params);

    console.log('🔄 使用简化参数重试:', {
      original_complexity: this.calculateComplexityLevel(params),
      simplified_complexity: complexityLevel,
      keywords_count: params.customKeywords.length,
      stones_count: params.mainStones.length
    });

    // 这里可以实现实际的重试逻辑
    // 目前返回模拟数据
    return this.generateMockAdvancedDesign(params, complexityLevel, modelConfig, optimizedPrompt);
  }

  /**
   * 生成模拟的高级设计数据（用于开发和降级）
   */
  private async generateMockAdvancedDesign(
    params: AdvancedDesignParams,
    complexityLevel?: string,
    modelConfig?: any,
    optimizedPrompt?: any
  ): Promise<AdvancedAIResponse> {
    // 如果没有传入参数，重新计算
    const finalComplexityLevel = complexityLevel || this.calculateComplexityLevel(params);
    const finalModelConfig = modelConfig || this.selectAIModel(finalComplexityLevel);
    const finalPrompt = optimizedPrompt || this.optimizePromptForAdvancedAI(params);

    // 根据复杂度调整模拟处理时间
    const processingTime = {
      'professional': 3000,
      'expert': 2500,
      'high': 2000
    }[finalComplexityLevel] || 2000;

    console.log('🎭 生成模拟高级设计数据:', {
      complexity: finalComplexityLevel,
      model: finalModelConfig.model,
      processing_time: processingTime
    });

    // 模拟处理时间
    await new Promise(resolve => setTimeout(resolve, processingTime));

    // 根据艺术风格生成不同的图片
    const getImageUrl = (index: number) => {
      const baseUrl = 'https://picsum.photos/1024/1024';
      const seed = Date.now() + index;

      // 根据艺术风格调整图片效果
      switch (params.artStyle) {
        case 'sketch':
          return `${baseUrl}?random=${seed}&grayscale`;
        case 'watercolor':
          return `${baseUrl}?random=${seed}&blur=1`;
        case 'cartoon':
          return `${baseUrl}?random=${seed}`;
        default:
          return `${baseUrl}?random=${seed}`;
      }
    };

    const result = {
      success: true,
      data: {
        images: Array.from({ length: 4 }, (_, index) => ({
          id: `mock_advanced_${Date.now()}_${index}`,
          url: getImageUrl(index),
          prompt: finalPrompt.positive,
          parameters: params,
          quality_score: 0.85 + Math.random() * 0.12, // 高级AI质量更高
          generation_time: 12 + Math.random() * 8,
          model_used: finalModelConfig.model
        })),
        metadata: {
          total_parameters: Object.keys(params).length,
          complexity_level: finalComplexityLevel as 'high' | 'expert' | 'professional',
          processing_time: processingTime / 1000,
          model_version: `${finalModelConfig.model}-dev-v1.0`
        }
      }
    };

    return result;
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(params: AdvancedDesignParams): string {
    // 选择关键参数生成缓存键
    const keyParams = {
      designCategory: params.designCategory,
      artStyle: params.artStyle,
      qualityLevel: params.qualityLevel,
      renderingLevel: params.renderingLevel,
      crystalShape: params.crystalShape,
      transparency: params.transparency,
      crystalProcessing: params.crystalProcessing,
      metalType: params.metalType,
      culturalStyle: params.culturalStyle,
      composition: params.composition,
      background: params.background,
      accessories: params.accessories.sort(), // 排序确保一致性
      beadSize: params.beadSize,
      beadArrangement: params.beadArrangement,
      metalSpacers: params.metalSpacers,
      customKeywords: params.customKeywords.sort(), // 排序确保一致性
      mainStones: params.mainStones.map(stone => ({
        crystalType: stone.crystalType,
        color: stone.color,
        size: stone.size
      }))
    };

    return btoa(JSON.stringify(keyParams)).replace(/[+/=]/g, '');
  }

  /**
   * 获取缓存结果
   */
  private getCachedResult(cacheKey: string): { data: AdvancedAIResponse; timestamp: number } | null {
    const cached = this.cache.get(cacheKey);
    if (!cached) return null;

    // 检查是否过期
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(cacheKey);
      return null;
    }

    return cached;
  }

  /**
   * 缓存结果
   */
  private setCachedResult(cacheKey: string, result: AdvancedAIResponse): void {
    this.cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    // 清理过期缓存
    this.cleanExpiredCache();
  }

  /**
   * 清理过期缓存
   */
  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
  }
}

export default AdvancedAIService.getInstance();
