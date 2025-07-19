// 动态定价引擎
import { supabase } from './supabase';
import { mlPredictionCache } from './ml-prediction-cache';

// 定价规则接口
interface PricingRule {
  id: string;
  rule_name: string;
  conditions: Record<string, any>;
  adjustments: Record<string, any>;
  priority: number;
  active: boolean;
}

// 用户上下文接口
interface UserContext {
  userId: string;
  sessionId: string;
  membershipType?: string;
  engagementScore?: number;
  crystalAffinityScore?: Record<string, number>;
  designPreferences?: Record<string, number>;
  purchasingProbability?: number;
  daysSinceSignup?: number;
  orderHistory?: OrderHistoryItem[];
  currentCartValue?: number;
  timeOfDay?: number;
  dayOfWeek?: number;
}

interface OrderHistoryItem {
  orderId: string;
  totalValue: number;
  itemCount: number;
  orderDate: Date;
  crystalTypes: string[];
}

// 定价结果接口
interface PricingResult {
  originalPrice: number;
  adjustedPrice: number;
  totalDiscount: number;
  discountPercentage: number;
  appliedRules: Array<{
    ruleName: string;
    adjustment: number;
    reason: string;
  }>;
  confidence: number;
  validUntil: Date;
  personalizedMessage?: string;
}

// 产品信息接口
interface ProductInfo {
  productId: string;
  basePrice: number;
  category: 'crystal' | 'design' | 'accessory' | 'service';
  complexity: 'simple' | 'medium' | 'complex';
  crystalTypes?: string[];
  designStyle?: string;
  estimatedCost: number;
  marketDemand: number; // 0-1
}

export class DynamicPricingEngine {
  private pricingRules: Map<string, PricingRule> = new Map();
  private marketData: Map<string, number> = new Map();
  private lastRulesUpdate: Date = new Date(0);

  constructor() {
    this.initializeMarketData();
    this.loadPricingRules();
  }

  // 初始化市场数据
  private initializeMarketData() {
    // 模拟市场需求数据
    this.marketData.set('amethyst', 0.85);
    this.marketData.set('rose_quartz', 0.92);
    this.marketData.set('clear_quartz', 0.78);
    this.marketData.set('citrine', 0.89);
    this.marketData.set('labradorite', 0.95);
    
    // 设计风格市场需求
    this.marketData.set('minimalist', 0.88);
    this.marketData.set('vintage', 0.76);
    this.marketData.set('modern', 0.91);
    this.marketData.set('bohemian', 0.82);
  }

  // 加载定价规则
  private async loadPricingRules() {
    try {
      const { data: rules, error } = await supabase
        .from('dynamic_pricing_rules')
        .select('*')
        .eq('active', true)
        .order('priority', { ascending: false });

      if (error) throw error;

      this.pricingRules.clear();
      rules?.forEach(rule => {
        this.pricingRules.set(rule.id, rule);
      });

      this.lastRulesUpdate = new Date();
      console.log(`加载了 ${rules?.length || 0} 个定价规则`);
    } catch (error) {
      console.error('加载定价规则失败:', error);
    }
  }

  // 计算动态价格
  async calculatePrice(
    productInfo: ProductInfo,
    userContext: UserContext
  ): Promise<PricingResult> {
    // 检查是否需要更新规则
    if (Date.now() - this.lastRulesUpdate.getTime() > 30 * 60 * 1000) {
      await this.loadPricingRules();
    }

    // 获取用户预测数据
    const userPredictions = await mlPredictionCache.getUserPredictions(userContext.userId);
    
    // 增强用户上下文
    const enhancedContext = await this.enhanceUserContext(userContext, userPredictions);

    // 应用定价规则
    const appliedRules: PricingResult['appliedRules'] = [];
    let totalAdjustment = 0;
    let confidence = 0.8; // 基础置信度

    // 按优先级排序规则
    const sortedRules = Array.from(this.pricingRules.values())
      .sort((a, b) => b.priority - a.priority);

    for (const rule of sortedRules) {
      const ruleResult = this.evaluateRule(rule, enhancedContext, productInfo);
      
      if (ruleResult.applies) {
        appliedRules.push({
          ruleName: rule.rule_name,
          adjustment: ruleResult.adjustment,
          reason: ruleResult.reason
        });
        
        totalAdjustment += ruleResult.adjustment;
        confidence = Math.min(1.0, confidence + 0.05); // 每应用一个规则增加置信度
      }
    }

    // 应用市场调整
    const marketAdjustment = this.calculateMarketAdjustment(productInfo);
    if (marketAdjustment !== 0) {
      appliedRules.push({
        ruleName: 'market_demand_adjustment',
        adjustment: marketAdjustment,
        reason: `市场需求调整: ${marketAdjustment > 0 ? '高需求' : '低需求'}`
      });
      totalAdjustment += marketAdjustment;
    }

    // 应用AI预测调整
    const aiAdjustment = this.calculateAIPredictionAdjustment(userPredictions, productInfo);
    if (aiAdjustment !== 0) {
      appliedRules.push({
        ruleName: 'ai_prediction_adjustment',
        adjustment: aiAdjustment,
        reason: `AI预测调整: 基于用户行为模式`
      });
      totalAdjustment += aiAdjustment;
      confidence = Math.min(1.0, confidence + 0.1);
    }

    // 确保价格不会过度调整
    const maxDiscount = 0.5; // 最大50%折扣
    const maxIncrease = 0.3; // 最大30%涨价
    totalAdjustment = Math.max(-maxDiscount, Math.min(maxIncrease, totalAdjustment));

    const adjustedPrice = Math.max(
      productInfo.estimatedCost * 1.1, // 确保至少10%利润
      productInfo.basePrice * (1 + totalAdjustment)
    );

    const discount = productInfo.basePrice - adjustedPrice;
    const discountPercentage = (discount / productInfo.basePrice) * 100;

    // 生成个性化消息
    const personalizedMessage = this.generatePersonalizedMessage(
      appliedRules,
      discountPercentage,
      enhancedContext
    );

    return {
      originalPrice: productInfo.basePrice,
      adjustedPrice: Math.round(adjustedPrice * 100) / 100,
      totalDiscount: Math.round(discount * 100) / 100,
      discountPercentage: Math.round(discountPercentage * 100) / 100,
      appliedRules,
      confidence: Math.round(confidence * 100) / 100,
      validUntil: new Date(Date.now() + 30 * 60 * 1000), // 30分钟有效
      personalizedMessage
    };
  }

  // 增强用户上下文
  private async enhanceUserContext(
    context: UserContext,
    predictions: any
  ): Promise<UserContext> {
    try {
      // 获取用户画像评分
      const { data: profileScore } = await supabase
        .from('user_profile_scores')
        .select('*')
        .eq('user_id', context.userId)
        .single();

      // 获取用户行为统计
      const { data: behaviorStats } = await supabase
        .from('user_behavior_patterns')
        .select('action, created_at')
        .eq('user_id', context.userId)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const enhancedContext = {
        ...context,
        engagementScore: profileScore?.engagement_score || 0,
        crystalAffinityScore: profileScore?.crystal_affinity_score || {},
        designPreferences: profileScore?.design_preference_score || {},
        purchasingProbability: profileScore?.purchasing_probability || 0,
        daysSinceSignup: this.calculateDaysSinceSignup(context.userId),
        timeOfDay: new Date().getHours(),
        dayOfWeek: new Date().getDay()
      };

      return enhancedContext;
    } catch (error) {
      console.warn('增强用户上下文失败:', error);
      return context;
    }
  }

  // 评估单个规则
  private evaluateRule(
    rule: PricingRule,
    context: UserContext,
    productInfo: ProductInfo
  ): { applies: boolean; adjustment: number; reason: string } {
    try {
      const conditions = rule.conditions;
      const adjustments = rule.adjustments;

      // 检查会员类型条件
      if (conditions.membership_type && context.membershipType !== conditions.membership_type) {
        return { applies: false, adjustment: 0, reason: '' };
      }

      // 检查参与度评分条件
      if (conditions.engagement_score) {
        const required = conditions.engagement_score['>'] || conditions.engagement_score['>='];
        if (required && (context.engagementScore || 0) < required) {
          return { applies: false, adjustment: 0, reason: '' };
        }
      }

      // 检查注册天数条件
      if (conditions.days_since_signup) {
        const maxDays = conditions.days_since_signup['<'] || conditions.days_since_signup['<='];
        if (maxDays && (context.daysSinceSignup || 999) >= maxDays) {
          return { applies: false, adjustment: 0, reason: '' };
        }
      }

      // 检查购物车价值条件
      if (conditions.order_quantity && context.currentCartValue) {
        const minQuantity = conditions.order_quantity['>'] || conditions.order_quantity['>='];
        if (minQuantity && (context.currentCartValue || 0) < minQuantity) {
          return { applies: false, adjustment: 0, reason: '' };
        }
      }

      // 检查水晶亲和力条件
      if (conditions.crystal_preference_strength && productInfo.crystalTypes) {
        const requiredStrength = conditions.crystal_preference_strength['>'] || 0;
        const userAffinity = context.crystalAffinityScore || {};
        const maxAffinity = Math.max(...productInfo.crystalTypes.map(c => userAffinity[c] || 0));
        
        if (maxAffinity < requiredStrength) {
          return { applies: false, adjustment: 0, reason: '' };
        }
      }

      // 规则适用，计算调整
      let adjustment = 0;
      let reason = rule.rule_name;

      if (adjustments.discount_percentage) {
        adjustment = -(adjustments.discount_percentage / 100);
        reason = `${adjustments.discount_percentage}% 折扣`;
      } else if (adjustments.price_multiplier) {
        adjustment = adjustments.price_multiplier - 1;
        reason = `价格倍数 ${adjustments.price_multiplier}x`;
      } else if (adjustments.fixed_discount) {
        adjustment = -adjustments.fixed_discount / productInfo.basePrice;
        reason = `固定折扣 ¥${adjustments.fixed_discount}`;
      }

      return { applies: true, adjustment, reason };
    } catch (error) {
      console.warn(`评估规则失败 ${rule.rule_name}:`, error);
      return { applies: false, adjustment: 0, reason: '' };
    }
  }

  // 计算市场调整
  private calculateMarketAdjustment(productInfo: ProductInfo): number {
    let marketDemand = productInfo.marketDemand;

    // 考虑产品相关的市场数据
    if (productInfo.crystalTypes) {
      const crystalDemand = productInfo.crystalTypes
        .map(crystal => this.marketData.get(crystal) || 0.8)
        .reduce((sum, demand) => sum + demand, 0) / productInfo.crystalTypes.length;
      marketDemand = (marketDemand + crystalDemand) / 2;
    }

    if (productInfo.designStyle) {
      const styleDemand = this.marketData.get(productInfo.designStyle) || 0.8;
      marketDemand = (marketDemand + styleDemand) / 2;
    }

    // 将市场需求转换为价格调整
    if (marketDemand > 0.9) {
      return 0.15; // 高需求，涨价15%
    } else if (marketDemand > 0.8) {
      return 0.05; // 中高需求，涨价5%
    } else if (marketDemand < 0.7) {
      return -0.1; // 低需求，降价10%
    }

    return 0; // 正常需求，不调整
  }

  // 计算AI预测调整
  private calculateAIPredictionAdjustment(predictions: any, productInfo: ProductInfo): number {
    if (!predictions) return 0;

    // 基于AI预测的用户购买概率调整价格
    const purchaseProbability = predictions.optimalCacheStrategy?.priority === 'high' ? 0.8 :
                               predictions.optimalCacheStrategy?.priority === 'medium' ? 0.6 : 0.4;

    // 检查推荐内容匹配度
    const relevantRecommendations = predictions.recommendedContent?.filter((rec: any) =>
      (rec.type === 'crystal' && productInfo.crystalTypes?.some((c: string) => rec.id.includes(c))) ||
      (rec.type === 'design' && rec.id.includes(productInfo.designStyle || ''))
    ) || [];

    const matchScore = relevantRecommendations.length > 0 ? 
      relevantRecommendations.reduce((sum: number, rec: any) => sum + rec.relevanceScore, 0) / relevantRecommendations.length : 0;

    // 综合调整
    if (purchaseProbability > 0.7 && matchScore > 0.8) {
      return 0.08; // 高购买概率 + 高匹配度，涨价8%
    } else if (purchaseProbability > 0.5 && matchScore > 0.6) {
      return 0.03; // 中等情况，涨价3%
    } else if (purchaseProbability < 0.4) {
      return -0.05; // 低购买概率，降价5%
    }

    return 0;
  }

  // 生成个性化消息
  private generatePersonalizedMessage(
    appliedRules: PricingResult['appliedRules'],
    discountPercentage: number,
    context: UserContext
  ): string {
    if (appliedRules.length === 0) {
      return '为您提供标准定价';
    }

    const topRule = appliedRules[0];
    
    if (discountPercentage > 20) {
      return `特别优惠！基于您的${topRule.reason}，为您节省了 ${Math.round(discountPercentage)}%！`;
    } else if (discountPercentage > 10) {
      return `个性化折扣：${topRule.reason}，为您优惠 ${Math.round(discountPercentage)}%`;
    } else if (discountPercentage > 0) {
      return `感谢您的支持！${topRule.reason}，享受 ${Math.round(discountPercentage)}% 优惠`;
    } else {
      return `当前为市场优质定价，保证最佳性价比`;
    }
  }

  // 计算注册天数
  private calculateDaysSinceSignup(userId: string): number {
    // 这里应该从数据库获取用户注册时间
    // 暂时返回模拟数据
    return Math.floor(Math.random() * 365);
  }

  // 批量计算价格
  async calculateBatchPrices(
    products: ProductInfo[],
    userContext: UserContext
  ): Promise<Map<string, PricingResult>> {
    const results = new Map<string, PricingResult>();
    
    for (const product of products) {
      try {
        const result = await this.calculatePrice(product, userContext);
        results.set(product.productId, result);
      } catch (error) {
        console.error(`计算产品 ${product.productId} 价格失败:`, error);
      }
    }
    
    return results;
  }

  // 更新市场数据
  async updateMarketData(marketUpdates: Record<string, number>) {
    for (const [key, value] of Object.entries(marketUpdates)) {
      this.marketData.set(key, value);
    }
    
    // 记录市场数据更新
    await supabase
      .from('analytics_metrics')
      .insert({
        metric_name: 'market_data_update',
        metric_value: Object.keys(marketUpdates).length,
        dimensions: { updated_items: Object.keys(marketUpdates) }
      });
  }

  // 获取定价统计
  async getPricingStats() {
    const activeRules = Array.from(this.pricingRules.values()).filter(r => r.active).length;
    const marketItems = this.marketData.size;
    
    return {
      activeRules,
      marketItems,
      lastRulesUpdate: this.lastRulesUpdate,
      averageDiscount: await this.calculateAverageDiscount(),
      totalPricingRequests: await this.getTotalPricingRequests()
    };
  }

  // 计算平均折扣
  private async calculateAverageDiscount(): Promise<number> {
    // 这里应该从analytics_metrics表获取实际数据
    return 12.5; // 模拟平均12.5%折扣
  }

  // 获取总定价请求数
  private async getTotalPricingRequests(): Promise<number> {
    try {
      const { count } = await supabase
        .from('analytics_metrics')
        .select('*', { count: 'exact' })
        .eq('metric_name', 'pricing_request');
      
      return count || 0;
    } catch {
      return 0;
    }
  }

  // 记录定价请求
  async logPricingRequest(result: PricingResult, userContext: UserContext, productInfo: ProductInfo) {
    try {
      await supabase
        .from('analytics_metrics')
        .insert({
          metric_name: 'pricing_request',
          metric_value: result.adjustedPrice,
          dimensions: {
            user_id: userContext.userId,
            product_id: productInfo.productId,
            discount_percentage: result.discountPercentage,
            applied_rules: result.appliedRules.map(r => r.ruleName),
            confidence: result.confidence
          }
        });
    } catch (error) {
      console.warn('记录定价请求失败:', error);
    }
  }
}

// 创建全局实例
export const dynamicPricingEngine = new DynamicPricingEngine(); 