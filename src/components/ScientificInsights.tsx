"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Clock,
  AlertCircle,
  BookOpen,
  Users
} from 'lucide-react';
import { LuxuryIcons } from '@/components/icons/LuxuryIconSystem';
import { generateLuxuryIconClasses } from '@/lib/luxury-icon-migration';
import type { UserProfileDataOutput } from '@/ai/schemas/user-profile-schemas';

interface ScientificInsightsProps {
  userProfile: UserProfileDataOutput;
  className?: string;
}

// 基于科学研究的洞察和建议
const generateScientificInsights = (userProfile: UserProfileDataOutput, language: string) => {
  const insights = [];
  
  // 基于MBTI的科学洞察
  if (userProfile.mbtiLikeType) {
    const mbtiType = userProfile.mbtiLikeType;
    
    // 内向/外向的科学建议
    if (mbtiType.includes('I')) {
      insights.push({
        category: 'personality',
        icon: () => <LuxuryIcons.Insight size={20} className={generateLuxuryIconClasses({ size: 'md', variant: 'default' })} />,
        title: language === 'zh' ? '内向优势发挥' : 'Leveraging Introvert Strengths',
        insight: language === 'zh' 
          ? '研究表明内向者在需要深度思考的任务中表现更佳，大脑前额叶皮质活动更活跃'
          : 'Research shows introverts excel in tasks requiring deep thinking, with higher prefrontal cortex activity',
        actionable: [
          language === 'zh' ? '安排每日1-2小时的独处深度工作时间' : 'Schedule 1-2 hours of solitary deep work daily',
          language === 'zh' ? '在安静环境中进行重要决策' : 'Make important decisions in quiet environments',
          language === 'zh' ? '通过写作整理和表达想法' : 'Use writing to organize and express thoughts'
        ],
        evidence: language === 'zh' ? '神经科学研究' : 'Neuroscience Research',
        priority: 'high',
        timeframe: language === 'zh' ? '立即开始' : 'Start immediately',
        difficulty: 'easy'
      });
    } else {
      insights.push({
        category: 'personality',
        icon: () => <Users size={20} />,
        title: language === 'zh' ? '外向能量管理' : 'Extrovert Energy Management',
        insight: language === 'zh'
          ? '外向者通过社交互动获得能量，但需要平衡以避免过度刺激'
          : 'Extroverts gain energy from social interaction but need balance to avoid overstimulation',
        actionable: [
          language === 'zh' ? '每天安排2-3次社交互动' : 'Schedule 2-3 social interactions daily',
          language === 'zh' ? '在团队环境中进行头脑风暴' : 'Conduct brainstorming in team settings',
          language === 'zh' ? '通过口头讨论处理复杂问题' : 'Process complex issues through verbal discussion'
        ],
        evidence: language === 'zh' ? '社会心理学研究' : 'Social Psychology Research',
        priority: 'high',
        timeframe: language === 'zh' ? '立即开始' : 'Start immediately',
        difficulty: 'easy'
      });
    }
    
    // 感知/直觉的科学建议
    if (mbtiType.includes('N')) {
      insights.push({
        category: 'cognition',
        icon: () => <LuxuryIcons.Insight size={20} className={generateLuxuryIconClasses({ size: 'md', variant: 'default' })} />,
        title: language === 'zh' ? '直觉思维优化' : 'Intuitive Thinking Optimization',
        insight: language === 'zh'
          ? '直觉型思维者擅长模式识别和创新思考，但需要结构化方法来实现想法'
          : 'Intuitive thinkers excel at pattern recognition and innovation but need structured approaches to implement ideas',
        actionable: [
          language === 'zh' ? '使用思维导图记录和连接想法' : 'Use mind maps to record and connect ideas',
          language === 'zh' ? '设定具体的里程碑来实现大目标' : 'Set specific milestones to achieve big goals',
          language === 'zh' ? '定期进行创意时间，不受打扰' : 'Schedule regular uninterrupted creative time'
        ],
        evidence: language === 'zh' ? '认知心理学研究' : 'Cognitive Psychology Research',
        priority: 'medium',
        timeframe: language === 'zh' ? '本周开始' : 'Start this week',
        difficulty: 'medium'
      });
    } else {
      insights.push({
        category: 'cognition',
        icon: () => <LuxuryIcons.Guidance size={20} className={generateLuxuryIconClasses({ size: 'md', variant: 'default' })} />,
        title: language === 'zh' ? '实感思维强化' : 'Sensing Thinking Enhancement',
        insight: language === 'zh'
          ? '实感型思维者注重细节和实际应用，在结构化环境中表现最佳'
          : 'Sensing thinkers focus on details and practical application, performing best in structured environments',
        actionable: [
          language === 'zh' ? '制定详细的日程计划和检查清单' : 'Create detailed schedules and checklists',
          language === 'zh' ? '将大项目分解为具体的小任务' : 'Break large projects into specific small tasks',
          language === 'zh' ? '使用实际案例来学习新概念' : 'Use real examples to learn new concepts'
        ],
        evidence: language === 'zh' ? '学习科学研究' : 'Learning Science Research',
        priority: 'medium',
        timeframe: language === 'zh' ? '本周开始' : 'Start this week',
        difficulty: 'easy'
      });
    }
  }
  
  // 基于当前状态的科学建议
  insights.push({
    category: 'wellbeing',
    icon: () => <LuxuryIcons.Activity size={20} className={generateLuxuryIconClasses({ size: 'md', variant: 'default' })} />,
    title: language === 'zh' ? '压力管理科学方法' : 'Scientific Stress Management',
    insight: language === 'zh'
      ? '慢性压力会影响海马体和前额叶皮质，但规律的放松练习可以逆转这些影响'
      : 'Chronic stress affects the hippocampus and prefrontal cortex, but regular relaxation practices can reverse these effects',
    actionable: [
      language === 'zh' ? '每日进行10分钟深呼吸练习' : 'Practice 10 minutes of deep breathing daily',
      language === 'zh' ? '建立固定的睡眠时间表' : 'Establish a consistent sleep schedule',
      language === 'zh' ? '每周进行3次30分钟的有氧运动' : 'Engage in 30 minutes of aerobic exercise 3 times weekly'
    ],
    evidence: language === 'zh' ? '神经科学和医学研究' : 'Neuroscience and Medical Research',
    priority: 'high',
    timeframe: language === 'zh' ? '立即开始' : 'Start immediately',
    difficulty: 'medium'
  });
  
  // 学习和成长建议
  insights.push({
    category: 'growth',
    icon: () => <BookOpen size={20} />,
    title: language === 'zh' ? '有效学习策略' : 'Effective Learning Strategies',
    insight: language === 'zh'
      ? '间隔重复和主动回忆是最有效的学习方法，比重复阅读效果好6倍'
      : 'Spaced repetition and active recall are the most effective learning methods, 6x more effective than re-reading',
    actionable: [
      language === 'zh' ? '学习新内容后24小时内复习一次' : 'Review new content within 24 hours',
      language === 'zh' ? '使用闪卡进行主动回忆练习' : 'Use flashcards for active recall practice',
      language === 'zh' ? '教授他人来巩固自己的理解' : 'Teach others to consolidate your understanding'
    ],
    evidence: language === 'zh' ? '学习科学研究' : 'Learning Science Research',
    priority: 'medium',
    timeframe: language === 'zh' ? '下次学习时应用' : 'Apply in next learning session',
    difficulty: 'medium'
  });
  
  return insights;
};

const ScientificInsights: React.FC<ScientificInsightsProps> = ({ userProfile, className = "" }) => {
  const { language } = useLanguage();
  
  const insights = generateScientificInsights(userProfile, language);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <LuxuryIcons.Success size={16} className={generateLuxuryIconClasses({ size: 'sm', variant: 'default' })} />;
      case 'medium': return <Clock className="h-4 w-4 text-warning" />;
      case 'hard': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <LuxuryIcons.Success size={16} className={generateLuxuryIconClasses({ size: 'sm', variant: 'default' })} />;
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <LuxuryIcons.Insight
            size={24}
            className={generateLuxuryIconClasses({
              size: 'lg',
              variant: 'interactive'
            })}
          />
          <span>{language === 'zh' ? '科学洞察与建议' : 'Scientific Insights & Recommendations'}</span>
          <Badge variant="outline" className="ml-auto">
            {language === 'zh' ? '基于研究证据' : 'Evidence-Based'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 概览统计 */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{insights.length}</div>
            <div className="text-xs text-primary/80">{language === 'zh' ? '个性化建议' : 'Personalized Tips'}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">
              {insights.filter(i => i.priority === 'high').length}
            </div>
            <div className="text-xs text-secondary/80">{language === 'zh' ? '高优先级' : 'High Priority'}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {insights.filter(i => i.difficulty === 'easy').length}
            </div>
            <div className="text-xs text-success/80">{language === 'zh' ? '易于实施' : 'Easy to Start'}</div>
          </div>
        </div>

        {/* 洞察列表 */}
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <Card key={index} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {insight.icon()}
                    </div>
                    <div>
                      <CardTitle className="text-base">{insight.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getPriorityColor(insight.priority)}>
                          {insight.priority === 'high' ? (language === 'zh' ? '高优先级' : 'High Priority') :
                           insight.priority === 'medium' ? (language === 'zh' ? '中优先级' : 'Medium Priority') :
                           (language === 'zh' ? '低优先级' : 'Low Priority')}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {getDifficultyIcon(insight.difficulty)}
                          {insight.difficulty === 'easy' ? (language === 'zh' ? '简单' : 'Easy') :
                           insight.difficulty === 'medium' ? (language === 'zh' ? '中等' : 'Medium') :
                           (language === 'zh' ? '困难' : 'Hard')}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {insight.timeframe}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 科学洞察 */}
                <div className="bg-primary/5 p-3 rounded border border-primary/20">
                  <h5 className="font-medium text-primary mb-1 flex items-center gap-2">
                    <LuxuryIcons.Energy
                      size={16}
                      className={generateLuxuryIconClasses({
                        size: 'sm',
                        variant: 'default'
                      })}
                    />
                    {language === 'zh' ? '科学洞察' : 'Scientific Insight'}
                  </h5>
                  <p className="text-sm text-primary/80">{insight.insight}</p>
                  <div className="mt-2 text-xs text-primary/70">
                    <strong>{language === 'zh' ? '研究依据：' : 'Research Base: '}</strong>
                    {insight.evidence}
                  </div>
                </div>

                {/* 可执行建议 */}
                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <LuxuryIcons.Guidance
                      size={16}
                      className={generateLuxuryIconClasses({
                        size: 'sm',
                        variant: 'default'
                      })}
                    />
                    {language === 'zh' ? '立即行动' : 'Action Steps'}
                  </h5>
                  <div className="space-y-2">
                    {insight.actionable.map((action, actionIndex) => (
                      <div key={actionIndex} className="flex items-start gap-3 p-2 bg-success/5 rounded border border-success/20">
                        <LuxuryIcons.Success
                          size={16}
                          className={generateLuxuryIconClasses({
                            size: 'sm',
                            variant: 'default'
                          })}
                        />
                        <span className="text-sm text-success/80">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 进度追踪 */}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{language === 'zh' ? '实施进度' : 'Implementation Progress'}</span>
                    <span>0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    {language === 'zh' ? '开始实施' : 'Start Implementation'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScientificInsights;
