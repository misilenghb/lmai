"use client";

import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useLanguage } from '@/contexts/LanguageContext';
import {
  Gem,
  Eye,
  Hand,
  Brain,
  Heart,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Palette,
  Activity,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { UserProfileDataOutput } from '@/ai/schemas/user-profile-schemas';

interface ScientificCrystalTherapyProps {
  userProfile: UserProfileDataOutput;
  className?: string;
}

// 基于科学研究的水晶疗法配置
const SCIENTIFIC_CRYSTAL_THERAPY = {
  colorTherapy: {
    title: '色彩心理学应用',
    titleEn: 'Color Psychology Application',
    description: '基于色彩心理学研究，利用水晶的颜色特性进行情绪调节',
    evidence: '色彩心理学研究表明不同颜色对情绪和认知有显著影响（Elliot & Maier, 2014）',
    crystals: [
      {
        name: '紫水晶',
        color: '紫色',
        psychologyEffect: '紫色与创造力和精神集中相关，有助于冥想和深度思考',
        scientificBasis: '紫色光波长较短，研究显示能促进大脑α波活动，有助于放松和专注',
        application: '放置在工作区域，作为视觉焦点进行专注力训练',
        duration: '每次15-20分钟',
        effectiveness: '中等',
        researchRef: 'Mehta et al. (2009) - 色彩对认知表现的影响'
      },
      {
        name: '粉水晶',
        color: '粉色',
        psychologyEffect: '粉色与温暖、安全感相关，能降低攻击性和焦虑',
        scientificBasis: '粉色被证实能降低皮质醇水平，减少压力反应',
        application: '握在手中进行深呼吸练习，利用颜色的心理暗示效应',
        duration: '每次10-15分钟',
        effectiveness: '较高',
        researchRef: 'Schauss (1985) - 粉色对行为的镇静效应'
      },
      {
        name: '绿幽灵',
        color: '绿色',
        psychologyEffect: '绿色与自然、平衡相关，能减少眼部疲劳和心理压力',
        scientificBasis: '绿色是眼睛最容易感知的颜色，能减少视觉疲劳',
        application: '作为办公桌装饰，在工作间隙进行视觉休息',
        duration: '随时观看，每次2-3分钟',
        effectiveness: '较高',
        researchRef: 'Lee et al. (2015) - 绿色环境对压力恢复的影响'
      }
    ]
  },
  tactileTherapy: {
    title: '触觉疗法应用',
    titleEn: 'Tactile Therapy Application',
    description: '基于触觉心理学，利用水晶的质地和温度进行感官疗法',
    evidence: '触觉刺激能激活副交感神经系统，降低压力激素水平（Field, 2014）',
    techniques: [
      {
        name: '温石疗法',
        description: '利用水晶的导热性质进行温度刺激',
        method: '将水晶在温水中加热至体温略高温度，握在手中',
        scientificBasis: '温热刺激能促进血液循环，激活C触觉纤维，产生舒适感',
        benefits: ['减少肌肉紧张', '促进血液循环', '降低焦虑水平'],
        safety: '温度不超过40°C，避免烫伤',
        duration: '10-15分钟',
        researchRef: 'Lund et al. (2002) - 温热疗法的生理效应'
      },
      {
        name: '质地刺激法',
        description: '利用不同水晶的表面质地进行触觉刺激',
        method: '用手指轻抚不同质地的水晶表面，专注于触觉感受',
        scientificBasis: '触觉刺激能激活大脑感觉皮层，分散注意力，减少疼痛感知',
        benefits: ['提高专注力', '减少焦虑', '促进正念状态'],
        safety: '确保水晶表面光滑，避免划伤',
        duration: '5-10分钟',
        researchRef: 'Gallace & Spence (2010) - 触觉在情绪调节中的作用'
      }
    ]
  },
  mindfulnessPractice: {
    title: '正念冥想辅助',
    titleEn: 'Mindfulness Meditation Aid',
    description: '将水晶作为正念练习的物理锚点，基于冥想科学',
    evidence: '正念冥想被证实能改变大脑结构，减少杏仁核活动（Goyal et al., 2014）',
    practices: [
      {
        name: '水晶专注冥想',
        description: '以水晶为专注对象进行正念练习',
        steps: [
          '选择一颗喜欢的水晶，舒适地坐着',
          '将水晶放在眼前，专注观察其颜色、形状、光泽',
          '当思绪游离时，温和地将注意力拉回到水晶上',
          '观察水晶时的身体感受和情绪变化',
          '结束时感谢这次练习体验'
        ],
        benefits: ['提高专注力', '减少思维游离', '增强觉察能力'],
        duration: '10-20分钟',
        difficulty: '初级',
        researchRef: 'Tang et al. (2007) - 专注力训练的神经机制'
      },
      {
        name: '水晶身体扫描',
        description: '结合身体扫描冥想与水晶触觉感受',
        steps: [
          '躺下，将水晶放在身体不同部位',
          '从头部开始，逐一感受每个部位的感觉',
          '特别注意水晶接触部位的温度、重量、质感',
          '观察身体对水晶的反应，不做判断',
          '完成全身扫描后静躺几分钟'
        ],
        benefits: ['增强身体觉察', '深度放松', '减少身体紧张'],
        duration: '20-30分钟',
        difficulty: '中级',
        researchRef: 'Kabat-Zinn (1982) - 身体扫描冥想的临床应用'
      }
    ]
  },
  placeboOptimization: {
    title: '积极期待效应',
    titleEn: 'Positive Expectation Effect',
    description: '科学利用安慰剂效应，通过积极期待增强疗愈体验',
    evidence: '安慰剂效应是真实的生理现象，能激活大脑的奖励系统（Benedetti, 2008）',
    strategies: [
      {
        name: '仪式感建立',
        description: '通过有意义的仪式增强心理期待',
        elements: [
          '选择特定的时间和地点进行水晶练习',
          '创建安静、舒适的环境',
          '设定明确的意图和期望',
          '使用一致的开始和结束仪式',
          '记录练习后的感受和变化'
        ],
        psychologyBasis: '仪式行为能增强控制感和意义感，提高治疗效果',
        researchRef: 'Norton & Gino (2014) - 仪式对焦虑和控制感的影响'
      },
      {
        name: '积极暗示技术',
        description: '使用科学的自我暗示方法增强效果',
        techniques: [
          '在练习前进行积极的自我对话',
          '想象水晶的能量与身体产生和谐共振',
          '专注于期望的积极结果',
          '使用肯定性语言描述体验',
          '庆祝和记录每次的积极变化'
        ],
        psychologyBasis: '积极期待能激活大脑的奖励回路，产生真实的生理变化',
        researchRef: 'Colloca & Benedetti (2005) - 期待在安慰剂效应中的作用'
      }
    ]
  }
};

const ScientificCrystalTherapy: React.FC<ScientificCrystalTherapyProps> = ({ userProfile, className = "" }) => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = React.useState(false);

  // 根据用户档案推荐适合的科学水晶疗法
  const getPersonalizedRecommendations = () => {
    const recommendations = [];
    
    if (userProfile.mbtiLikeType) {
      const mbtiType = userProfile.mbtiLikeType;
      
      if (mbtiType.includes('I')) {
        recommendations.push({
          therapy: 'mindfulnessPractice',
          reason: '内向型人格更适合独处的正念练习',
          priority: 'high'
        });
      } else {
        recommendations.push({
          therapy: 'colorTherapy',
          reason: '外向型人格对视觉刺激反应更敏感',
          priority: 'medium'
        });
      }
      
      if (mbtiType.includes('S')) {
        recommendations.push({
          therapy: 'tactileTherapy',
          reason: '实感型人格更注重具体的身体感受',
          priority: 'high'
        });
      }
    }
    
    return recommendations;
  };

  const personalizedRecs = getPersonalizedRecommendations();

  return (
    <Card className={`w-full ${className}`}>
      <div
        className="cursor-pointer hover:bg-accent/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gem className="h-6 w-6 text-primary" />
              <span>{language === 'zh' ? '科学水晶疗法' : 'Scientific Crystal Therapy'}</span>
              <Badge variant="outline">
                {language === 'zh' ? '基于心理学研究' : 'Psychology Research Based'}
              </Badge>
            </div>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CardTitle>
        </CardHeader>
      </div>
      {isExpanded && (
        <CardContent>
        {/* 个性化推荐 */}
        {personalizedRecs.length > 0 && (
          <div className="mb-6 p-4 bg-secondary/5 rounded-lg border border-secondary/20">
            <h4 className="font-semibold text-secondary mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              {language === 'zh' ? '为您推荐的疗法' : 'Recommended Therapies for You'}
            </h4>
            <div className="space-y-2">
              {personalizedRecs.map((rec, index) => (
                <div key={index} className="text-sm text-secondary">
                  <span className="font-medium">
                    {SCIENTIFIC_CRYSTAL_THERAPY[rec.therapy as keyof typeof SCIENTIFIC_CRYSTAL_THERAPY].title}
                  </span>
                  <span className="text-secondary/80 ml-2">- {rec.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Tabs defaultValue="colorTherapy" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colorTherapy" className="text-xs">
              <Palette className="h-4 w-4 mr-1" />
              色彩疗法
            </TabsTrigger>
            <TabsTrigger value="tactileTherapy" className="text-xs">
              <Hand className="h-4 w-4 mr-1" />
              触觉疗法
            </TabsTrigger>
            <TabsTrigger value="mindfulnessPractice" className="text-xs">
              <Brain className="h-4 w-4 mr-1" />
              正念练习
            </TabsTrigger>
            <TabsTrigger value="placeboOptimization" className="text-xs">
              <Lightbulb className="h-4 w-4 mr-1" />
              期待效应
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colorTherapy" className="space-y-4">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground mb-2">
                <Palette className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{SCIENTIFIC_CRYSTAL_THERAPY.colorTherapy.title}</h3>
              <p className="text-sm text-muted-foreground">{SCIENTIFIC_CRYSTAL_THERAPY.colorTherapy.description}</p>
              <div className="mt-2 text-xs text-primary bg-primary/5 p-2 rounded">
                <strong>科学依据：</strong>{SCIENTIFIC_CRYSTAL_THERAPY.colorTherapy.evidence}
              </div>
            </div>

            <div className="grid gap-4">
              {SCIENTIFIC_CRYSTAL_THERAPY.colorTherapy.crystals.map((crystal, index) => (
                <Card key={index} className="border-l-4 border-l-secondary">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Gem className="h-5 w-5 text-secondary" />
                        {crystal.name} ({crystal.color})
                      </CardTitle>
                      <Badge className="bg-success/10 text-success">
                        效果: {crystal.effectiveness}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h5 className="font-medium text-primary mb-1">心理效应</h5>
                      <p className="text-sm text-muted-foreground">{crystal.psychologyEffect}</p>
                    </div>

                    <div className="bg-warning/5 p-3 rounded border border-warning/20">
                      <h5 className="font-medium text-warning mb-1">科学原理</h5>
                      <p className="text-xs text-warning">{crystal.scientificBasis}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-success mb-1 flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        应用方法
                      </h5>
                      <p className="text-sm">{crystal.application}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {crystal.duration}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      <strong>研究参考：</strong>{crystal.researchRef}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tactileTherapy" className="space-y-4">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success text-success-foreground mb-2">
                <Hand className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{SCIENTIFIC_CRYSTAL_THERAPY.tactileTherapy.title}</h3>
              <p className="text-sm text-muted-foreground">{SCIENTIFIC_CRYSTAL_THERAPY.tactileTherapy.description}</p>
              <div className="mt-2 text-xs text-primary bg-primary/5 p-2 rounded">
                <strong>科学依据：</strong>{SCIENTIFIC_CRYSTAL_THERAPY.tactileTherapy.evidence}
              </div>
            </div>

            <div className="grid gap-4">
              {SCIENTIFIC_CRYSTAL_THERAPY.tactileTherapy.techniques.map((technique, index) => (
                <Card key={index} className="border-l-4 border-l-success">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="h-5 w-5 text-success" />
                      {technique.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{technique.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h5 className="font-medium text-primary mb-1">操作方法</h5>
                      <p className="text-sm">{technique.method}</p>
                    </div>

                    <div className="bg-warning/5 p-3 rounded border border-warning/20">
                      <h5 className="font-medium text-warning mb-1">科学原理</h5>
                      <p className="text-xs text-warning">{technique.scientificBasis}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-success mb-2">预期效果</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {technique.benefits.map((benefit, bIndex) => (
                          <div key={bIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-success" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-destructive/5 p-3 rounded border border-destructive/20">
                      <h5 className="font-medium text-destructive mb-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        安全提示
                      </h5>
                      <p className="text-xs text-destructive">{technique.safety}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        建议时长: {technique.duration}
                      </span>
                      <span className="text-muted-foreground">参考: {technique.researchRef}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mindfulnessPractice" className="space-y-4">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-2">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{SCIENTIFIC_CRYSTAL_THERAPY.mindfulnessPractice.title}</h3>
              <p className="text-sm text-muted-foreground">{SCIENTIFIC_CRYSTAL_THERAPY.mindfulnessPractice.description}</p>
              <div className="mt-2 text-xs text-primary bg-primary/5 p-2 rounded">
                <strong>科学依据：</strong>{SCIENTIFIC_CRYSTAL_THERAPY.mindfulnessPractice.evidence}
              </div>
            </div>

            <div className="grid gap-4">
              {SCIENTIFIC_CRYSTAL_THERAPY.mindfulnessPractice.practices.map((practice, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        {practice.name}
                      </CardTitle>
                      <Badge className={practice.difficulty === '初级' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}>
                        {practice.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{practice.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h5 className="font-medium text-primary mb-2">练习步骤</h5>
                      <ol className="space-y-2">
                        {practice.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-sm flex items-start gap-2">
                            <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                              {stepIndex + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h5 className="font-medium text-success mb-2">预期效果</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {practice.benefits.map((benefit, bIndex) => (
                          <div key={bIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-success" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        建议时长: {practice.duration}
                      </span>
                      <span className="text-muted-foreground">参考: {practice.researchRef}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="placeboOptimization" className="space-y-4">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-warning text-warning-foreground mb-2">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{SCIENTIFIC_CRYSTAL_THERAPY.placeboOptimization.title}</h3>
              <p className="text-sm text-muted-foreground">{SCIENTIFIC_CRYSTAL_THERAPY.placeboOptimization.description}</p>
              <div className="mt-2 text-xs text-primary bg-primary/5 p-2 rounded">
                <strong>科学依据：</strong>{SCIENTIFIC_CRYSTAL_THERAPY.placeboOptimization.evidence}
              </div>
            </div>

            <div className="grid gap-4">
              {SCIENTIFIC_CRYSTAL_THERAPY.placeboOptimization.strategies.map((strategy, index) => (
                <Card key={index} className="border-l-4 border-l-warning">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Heart className="h-5 w-5 text-warning" />
                      {strategy.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{strategy.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h5 className="font-medium text-warning mb-2">
                        {strategy.elements ? '关键要素' : '具体技术'}
                      </h5>
                      <ul className="space-y-2">
                        {(strategy.elements || strategy.techniques)?.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-warning/5 p-3 rounded border border-warning/20">
                      <h5 className="font-medium text-warning mb-1">心理学原理</h5>
                      <p className="text-xs text-warning">{strategy.psychologyBasis}</p>
                    </div>

                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      <strong>研究参考：</strong>{strategy.researchRef}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        </CardContent>
      )}
    </Card>
  );
};

export default ScientificCrystalTherapy;
