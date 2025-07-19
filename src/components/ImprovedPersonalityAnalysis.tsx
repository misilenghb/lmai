"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Brain,
  TrendingUp,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Lightbulb,
  Heart,
  Zap,
  Clock,
  Star,
  ArrowLeft
} from 'lucide-react';
import type { UserProfileDataOutput } from '@/ai/schemas/user-profile-schemas';

interface ImprovedPersonalityAnalysisProps {
  userProfile: UserProfileDataOutput;
  className?: string;
  onBackToTraditional?: () => void;
}

// 基于科学研究的性格分析
const generateScientificAnalysis = (userProfile: UserProfileDataOutput, language: string) => {
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

const ImprovedPersonalityAnalysis: React.FC<ImprovedPersonalityAnalysisProps> = ({ userProfile, className = "", onBackToTraditional }) => {
  const { language } = useLanguage();
  
  const analysis = generateScientificAnalysis(userProfile, language);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'low': return 'bg-success/10 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            <span>{language === 'zh' ? '科学性格分析' : 'Scientific Personality Analysis'}</span>
            <Badge variant="outline">
              {language === 'zh' ? '基于认知科学' : 'Cognitive Science Based'}
            </Badge>
          </CardTitle>

          {/* 返回传统模式按钮 */}
          {onBackToTraditional && (
            <Button
              onClick={onBackToTraditional}
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              {language === 'zh' ? '返回传统模式' : 'Back to Traditional'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cognitive" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cognitive">
              <Brain className="h-4 w-4 mr-1" />
              {language === 'zh' ? '认知风格' : 'Cognitive Style'}
            </TabsTrigger>
            <TabsTrigger value="strengths">
              <Star className="h-4 w-4 mr-1" />
              {language === 'zh' ? '核心优势' : 'Core Strengths'}
            </TabsTrigger>
            <TabsTrigger value="growth">
              <TrendingUp className="h-4 w-4 mr-1" />
              {language === 'zh' ? '成长领域' : 'Growth Areas'}
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <Target className="h-4 w-4 mr-1" />
              {language === 'zh' ? '行动建议' : 'Recommendations'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cognitive" className="space-y-4">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {analysis.cognitiveStyle.type}
                </CardTitle>
                <p className="text-muted-foreground">{analysis.cognitiveStyle.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-success mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {language === 'zh' ? '认知优势' : 'Cognitive Advantages'}
                  </h4>
                  <ul className="space-y-1">
                    {analysis.cognitiveStyle.advantages.map((advantage, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <Zap className="h-3 w-3 text-success mt-1 flex-shrink-0" />
                        {advantage}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {analysis.cognitiveStyle.considerations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-warning mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {language === 'zh' ? '注意事项' : 'Considerations'}
                    </h4>
                    <ul className="space-y-1">
                      {analysis.cognitiveStyle.considerations.map((consideration, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <Clock className="h-3 w-3 text-warning mt-1 flex-shrink-0" />
                          {consideration}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strengths" className="space-y-4">
            {analysis.strengths.map((strength, index) => (
              <Card key={index} className="border-l-4 border-l-success">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="h-5 w-5 text-success" />
                    {strength.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{strength.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-primary/5 p-3 rounded border border-primary/20">
                    <p className="text-xs text-primary">
                      <strong>{language === 'zh' ? '科学依据：' : 'Scientific Evidence: '}</strong>
                      {strength.evidence}
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">{language === 'zh' ? '应用领域' : 'Applications'}</h5>
                    <div className="flex flex-wrap gap-2">
                      {strength.applications.map((app, appIndex) => (
                        <Badge key={appIndex} variant="secondary" className="text-xs">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="growth" className="space-y-4">
            {analysis.growthAreas.map((area, index) => (
              <Card key={index} className="border-l-4 border-l-warning">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-warning" />
                    {area.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{area.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      {language === 'zh' ? '改进策略' : 'Improvement Strategies'}
                    </h5>
                    <ul className="space-y-2">
                      {area.strategies.map((strategy, strategyIndex) => (
                        <li key={strategyIndex} className="text-sm flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-warning/5 p-3 rounded border border-warning/20">
                    <p className="text-xs text-warning">
                      <strong>{language === 'zh' ? '建议时间框架：' : 'Suggested Timeframe: '}</strong>
                      {area.timeframe}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            {analysis.recommendations.map((rec, index) => (
              <Card key={index} className="border-l-4 border-l-secondary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-secondary" />
                      {rec.title}
                    </CardTitle>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority === 'high' ? (language === 'zh' ? '高优先级' : 'High Priority') :
                       rec.priority === 'medium' ? (language === 'zh' ? '中优先级' : 'Medium Priority') :
                       (language === 'zh' ? '低优先级' : 'Low Priority')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ImprovedPersonalityAnalysis;
