"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Briefcase, 
  Heart, 
  Activity, 
  Brain, 
  Home, 
  BookOpen, 
  Target, 
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  Lightbulb
} from 'lucide-react';
import type { UserProfileDataOutput } from '@/ai/schemas/user-profile-schemas';

interface EvidenceBasedGuidanceProps {
  userProfile: UserProfileDataOutput;
  className?: string;
}

// 基于科学研究的生活指导配置
const EVIDENCE_BASED_SCENARIOS = {
  productivity: {
    icon: Briefcase,
    title: '工作效率',
    titleEn: 'Productivity & Focus',
    color: 'bg-primary',
    description: '基于认知心理学研究的工作效率提升方法',
    scenarios: [
      {
        situation: '深度工作',
        method: '番茄工作法',
        description: '25分钟专注工作 + 5分钟休息的循环',
        evidence: '研究表明可提高专注力和工作质量',
        steps: [
          '选择一个任务',
          '设置25分钟计时器',
          '专注工作直到计时器响起',
          '休息5分钟',
          '重复4次后休息15-30分钟'
        ],
        timeframe: '每日2-4个番茄时段',
        difficulty: '简单',
        effectiveness: '85%'
      },
      {
        situation: '创意思维',
        method: '发散-收敛思维法',
        description: '先发散思考产生想法，再收敛筛选最佳方案',
        evidence: '创造力研究证实的有效方法',
        steps: [
          '设定明确的问题或目标',
          '10分钟自由联想，记录所有想法',
          '不批判任何想法',
          '休息5分钟',
          '评估和筛选最有价值的想法'
        ],
        timeframe: '每周2-3次',
        difficulty: '中等',
        effectiveness: '78%'
      }
    ]
  },
  wellbeing: {
    icon: Activity,
    title: '身心健康',
    titleEn: 'Mental & Physical Health',
    color: 'bg-success',
    description: '基于心理学和医学研究的健康改善方法',
    scenarios: [
      {
        situation: '压力管理',
        method: '4-7-8呼吸法',
        description: '通过控制呼吸节奏来激活副交感神经系统',
        evidence: '临床研究证实可降低皮质醇水平',
        steps: [
          '舒适坐姿，闭上眼睛',
          '吸气4秒',
          '屏住呼吸7秒',
          '呼气8秒',
          '重复4-8次'
        ],
        timeframe: '每日2-3次',
        difficulty: '简单',
        effectiveness: '82%'
      },
      {
        situation: '改善睡眠',
        method: '睡眠卫生习惯',
        description: '建立有利于优质睡眠的环境和习惯',
        evidence: '睡眠医学研究支持的方法',
        steps: [
          '固定睡眠时间',
          '睡前1小时避免屏幕',
          '保持卧室凉爽(16-19°C)',
          '使用遮光窗帘',
          '睡前进行放松活动'
        ],
        timeframe: '持续执行',
        difficulty: '中等',
        effectiveness: '76%'
      }
    ]
  },
  relationships: {
    icon: Heart,
    title: '人际关系',
    titleEn: 'Relationships & Communication',
    color: 'bg-accent',
    description: '基于社会心理学研究的关系改善方法',
    scenarios: [
      {
        situation: '有效沟通',
        method: '积极倾听技巧',
        description: '通过专注倾听建立更好的人际连接',
        evidence: '沟通心理学研究证实的有效方法',
        steps: [
          '全神贯注地听对方说话',
          '避免打断或急于回应',
          '重复对方的关键点确认理解',
          '询问开放性问题',
          '表达共情和理解'
        ],
        timeframe: '日常交流中应用',
        difficulty: '中等',
        effectiveness: '80%'
      },
      {
        situation: '冲突解决',
        method: '非暴力沟通',
        description: '通过观察、感受、需要、请求四步骤解决冲突',
        evidence: '冲突解决研究支持的方法',
        steps: [
          '客观描述观察到的事实',
          '表达自己的感受',
          '说明背后的需要',
          '提出具体的请求',
          '倾听对方的回应'
        ],
        timeframe: '冲突发生时使用',
        difficulty: '较难',
        effectiveness: '74%'
      }
    ]
  },
  learning: {
    icon: BookOpen,
    title: '学习成长',
    titleEn: 'Learning & Growth',
    color: 'bg-secondary',
    description: '基于学习科学研究的有效学习方法',
    scenarios: [
      {
        situation: '记忆巩固',
        method: '间隔重复法',
        description: '按照遗忘曲线规律安排复习时间',
        evidence: '记忆心理学研究证实的最有效方法',
        steps: [
          '学习新内容后1天复习',
          '3天后再次复习',
          '1周后第三次复习',
          '2周后第四次复习',
          '1个月后最后复习'
        ],
        timeframe: '按计划执行',
        difficulty: '中等',
        effectiveness: '88%'
      },
      {
        situation: '技能习得',
        method: '刻意练习',
        description: '专注于弱点，获得即时反馈的练习方法',
        evidence: '专业技能研究的核心发现',
        steps: [
          '识别具体的改进目标',
          '设计针对性练习',
          '保持高度专注',
          '获得即时反馈',
          '不断调整练习方法'
        ],
        timeframe: '每日30-60分钟',
        difficulty: '较难',
        effectiveness: '85%'
      }
    ]
  }
};

const EvidenceBasedGuidance: React.FC<EvidenceBasedGuidanceProps> = ({ userProfile, className = "" }) => {
  const { language } = useLanguage();

  // 根据用户档案生成个性化建议
  const getPersonalizedRecommendations = () => {
    const recommendations = [];
    
    // 基于MBTI类型的建议
    if (userProfile.mbtiLikeType) {
      const mbtiType = userProfile.mbtiLikeType;
      
      if (mbtiType.includes('I')) {
        recommendations.push({
          category: 'productivity',
          priority: 'high',
          reason: '内向型人格更适合深度专注的工作方式'
        });
      } else {
        recommendations.push({
          category: 'relationships',
          priority: 'high',
          reason: '外向型人格可以通过社交互动获得更多能量'
        });
      }
      
      if (mbtiType.includes('N')) {
        recommendations.push({
          category: 'learning',
          priority: 'medium',
          reason: '直觉型人格喜欢探索新概念和可能性'
        });
      }
    }
    
    return recommendations;
  };

  const personalizedRecs = getPersonalizedRecommendations();

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Target className="h-6 w-6 text-primary" />
          <span>{language === 'zh' ? '科学生活指导' : 'Evidence-Based Life Guidance'}</span>
          <Badge variant="outline" className="ml-auto">
            {language === 'zh' ? '基于科学研究' : 'Research-Based'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 个性化推荐 */}
        {personalizedRecs.length > 0 && (
          <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              {language === 'zh' ? '为您推荐' : 'Recommended for You'}
            </h4>
            <div className="space-y-2">
              {personalizedRecs.map((rec, index) => (
                <div key={index} className="text-sm text-primary">
                  <span className="font-medium">
                    {EVIDENCE_BASED_SCENARIOS[rec.category as keyof typeof EVIDENCE_BASED_SCENARIOS].title}
                  </span>
                  <span className="text-primary/80 ml-2">- {rec.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Tabs defaultValue="productivity" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {Object.entries(EVIDENCE_BASED_SCENARIOS).map(([key, scenario]) => (
              <TabsTrigger key={key} value={key} className="text-xs">
                <scenario.icon className="h-4 w-4 mr-1" />
                {scenario.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(EVIDENCE_BASED_SCENARIOS).map(([key, scenario]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="text-center mb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${scenario.color} text-white mb-2`}>
                  <scenario.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{scenario.title}</h3>
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
              </div>

              <div className="grid gap-4">
                {scenario.scenarios.map((item, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{item.situation}</CardTitle>
                        <Badge className="bg-success/10 text-success">
                          {language === 'zh' ? '有效性' : 'Effectiveness'}: {item.effectiveness}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.timeframe}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {item.difficulty}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h5 className="font-medium text-primary mb-1">{item.method}</h5>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      
                      <div className="bg-warning/5 p-3 rounded border border-warning/20">
                        <p className="text-xs text-warning">
                          <strong>{language === 'zh' ? '科学依据：' : 'Evidence: '}</strong>
                          {item.evidence}
                        </p>
                      </div>

                      <div>
                        <h6 className="font-medium mb-2 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-success" />
                          {language === 'zh' ? '实施步骤' : 'Implementation Steps'}
                        </h6>
                        <ol className="space-y-1">
                          {item.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="text-sm flex items-start gap-2">
                              <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                {stepIndex + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EvidenceBasedGuidance;
