"use client";

import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { useLanguage } from '@/contexts/LanguageContext';
import {
  Gem,
  Brain,
  Eye,
  Heart,
  Target,
  CheckCircle,
  TrendingUp,
  Palette,
  Hand,
  Clock,
  Star,
  Lightbulb,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { UserProfileDataOutput } from '@/ai/schemas/user-profile-schemas';

interface ScientificCrystalRecommendationProps {
  userProfile: UserProfileDataOutput;
  className?: string;
}

// 基于科学研究的水晶推荐系统
const generateScientificCrystalRecommendations = (userProfile: UserProfileDataOutput, language: string) => {
  const recommendations = [];
  
  // 基于MBTI的科学推荐
  if (userProfile.mbtiLikeType) {
    const mbtiType = userProfile.mbtiLikeType;
    
    // 内向者推荐
    if (mbtiType.includes('I')) {
      recommendations.push({
        crystal: '紫水晶',
        color: 'hsl(var(--secondary))',
        primaryReason: '专注力增强',
        scientificBasis: '紫色光波长有助于促进α脑波，增强专注和冥想状态',
        psychologyMatch: '内向者需要安静环境进行深度思考，紫水晶的视觉特性支持这种需求',
        applications: [
          '工作时放置在视线范围内作为专注锚点',
          '冥想时握在手中增强仪式感',
          '阅读时作为书签使用'
        ],
        evidenceLevel: '中等',
        researchBasis: '色彩心理学研究显示紫色与创造力和精神集中相关',
        matchScore: 85,
        category: 'focus'
      });
    }
    
    // 外向者推荐
    if (mbtiType.includes('E')) {
      recommendations.push({
        crystal: '黄水晶',
        color: 'hsl(var(--warning))',
        primaryReason: '能量激活',
        scientificBasis: '黄色是最能刺激视觉系统的颜色，能提高警觉性和活力感',
        psychologyMatch: '外向者通过外部刺激获得能量，黄色的视觉刺激符合这一特点',
        applications: [
          '佩戴在显眼位置增强自信',
          '社交场合前观看几分钟提升状态',
          '办公桌装饰增强工作活力'
        ],
        evidenceLevel: '较高',
        researchBasis: '黄色被证实能提高注意力和反应速度（Mehta & Zhu, 2009）',
        matchScore: 78,
        category: 'energy'
      });
    }
    
    // 直觉型推荐
    if (mbtiType.includes('N')) {
      recommendations.push({
        crystal: '月光石',
        color: 'hsl(var(--muted-foreground))',
        primaryReason: '创意激发',
        scientificBasis: '柔和的光泽变化能刺激大脑的模式识别能力',
        psychologyMatch: '直觉型思维者善于发现模式和可能性，月光石的变化特性能激发这种能力',
        applications: [
          '创意工作时放在桌面观察光泽变化',
          '头脑风暴前进行几分钟的观察冥想',
          '作为灵感触发器随身携带'
        ],
        evidenceLevel: '理论支持',
        researchBasis: '视觉刺激变化能激活大脑的创造性网络',
        matchScore: 72,
        category: 'creativity'
      });
    }
    
    // 实感型推荐
    if (mbtiType.includes('S')) {
      recommendations.push({
        crystal: '红碧玺',
        color: 'hsl(var(--destructive))',
        primaryReason: '身体觉察',
        scientificBasis: '红色能提高身体觉察和注意力，增强对具体细节的感知',
        psychologyMatch: '实感型注重具体的身体感受和现实细节，红色能增强这种觉察',
        applications: [
          '握在手中进行身体扫描练习',
          '工作时作为提醒专注当下的工具',
          '运动前观看增强身体意识'
        ],
        evidenceLevel: '较高',
        researchBasis: '红色被证实能提高身体觉察和运动表现',
        matchScore: 80,
        category: 'awareness'
      });
    }
  }
  
  // 基于压力水平的推荐
  recommendations.push({
    crystal: '粉水晶',
    color: 'hsl(var(--accent))',
    primaryReason: '压力缓解',
    scientificBasis: '粉色能降低皮质醇水平，激活副交感神经系统',
    psychologyMatch: '适合所有需要放松和减压的人群',
    applications: [
      '压力大时握在手中进行深呼吸',
      '睡前放在床头柜营造安全感',
      '工作间隙观看几分钟放松心情'
    ],
    evidenceLevel: '高',
    researchBasis: 'Schauss (1985) 研究证实粉色的镇静效应',
    matchScore: 88,
    category: 'relaxation'
  });
  
  return recommendations;
};

const ScientificCrystalRecommendation: React.FC<ScientificCrystalRecommendationProps> = ({ userProfile, className = "" }) => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const recommendations = generateScientificCrystalRecommendations(userProfile, language);
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'focus': return <Brain className="h-4 w-4" />;
      case 'energy': return <TrendingUp className="h-4 w-4" />;
      case 'creativity': return <Lightbulb className="h-4 w-4" />;
      case 'awareness': return <Eye className="h-4 w-4" />;
      case 'relaxation': return <Heart className="h-4 w-4" />;
      default: return <Gem className="h-4 w-4" />;
    }
  };
  
  const getCategoryName = (category: string) => {
    const names = {
      focus: '专注力',
      energy: '能量激活',
      creativity: '创造力',
      awareness: '觉察力',
      relaxation: '放松减压'
    };
    return names[category as keyof typeof names] || category;
  };
  
  const getEvidenceColor = (level: string) => {
    switch (level) {
      case '高': return 'bg-success/10 text-success';
      case '较高': return 'bg-primary/10 text-primary';
      case '中等': return 'bg-warning/10 text-warning';
      case '理论支持': return 'bg-secondary/10 text-secondary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

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
              <span>{language === 'zh' ? '科学水晶推荐' : 'Scientific Crystal Recommendations'}</span>
              <Badge variant="outline">
                {language === 'zh' ? '基于心理学匹配' : 'Psychology-Based Matching'}
              </Badge>
            </div>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CardTitle>
        </CardHeader>
      </div>
      {isExpanded && (
        <CardContent className="space-y-6">
        {/* 推荐概览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-secondary/5 to-accent/5 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{recommendations.length}</div>
            <div className="text-xs text-secondary/80">个性化推荐</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.round(recommendations.reduce((sum, r) => sum + r.matchScore, 0) / recommendations.length)}%
            </div>
            <div className="text-xs text-primary/80">平均匹配度</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {recommendations.filter(r => r.evidenceLevel === '高' || r.evidenceLevel === '较高').length}
            </div>
            <div className="text-xs text-success/80">高证据支持</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {new Set(recommendations.map(r => r.category)).size}
            </div>
            <div className="text-xs text-warning/80">功能类别</div>
          </div>
        </div>

        {/* 推荐列表 */}
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <Card key={index} className="border-l-4 hover:shadow-md transition-shadow border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Gem className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{rec.crystal}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getEvidenceColor(rec.evidenceLevel)}>
                          证据等级: {rec.evidenceLevel}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {getCategoryIcon(rec.category)}
                          {getCategoryName(rec.category)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{rec.matchScore}%</div>
                    <div className="text-xs text-muted-foreground">匹配度</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 匹配度进度条 */}
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>个性化匹配度</span>
                    <span>{rec.matchScore}%</span>
                  </div>
                  <Progress value={rec.matchScore} className="h-2" />
                </div>

                {/* 主要功效 */}
                <div className="bg-primary/5 p-3 rounded border border-primary/20">
                  <h5 className="font-medium text-primary mb-1 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    主要功效: {rec.primaryReason}
                  </h5>
                  <p className="text-sm text-primary/80">{rec.psychologyMatch}</p>
                </div>

                {/* 科学原理 */}
                <div className="bg-warning/5 p-3 rounded border border-warning/20">
                  <h5 className="font-medium text-warning mb-1">科学原理</h5>
                  <p className="text-sm text-warning/80">{rec.scientificBasis}</p>
                  <div className="mt-2 text-xs text-warning/70">
                    <strong>研究依据：</strong>{rec.researchBasis}
                  </div>
                </div>

                {/* 应用方法 */}
                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    推荐应用方法
                  </h5>
                  <div className="space-y-2">
                    {rec.applications.map((app, appIndex) => (
                      <div key={appIndex} className="flex items-start gap-3 p-2 bg-success/5 rounded border border-success/20">
                        <Star className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-success/80">{app}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 使用建议 */}
                <div className="pt-2 border-t bg-muted/50 p-3 rounded">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>建议每次使用5-15分钟，根据个人感受调整频率</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Hand className="h-3 w-3" />
                    <span>重点关注视觉和触觉感受，保持开放和好奇的心态</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 科学声明 */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-muted">
          <h4 className="font-semibold text-foreground mb-2">科学声明</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            以上推荐基于色彩心理学、触觉疗法和正念冥想的科学研究。水晶的效果主要来自于：
            <strong>视觉刺激</strong>（色彩心理学效应）、<strong>触觉感受</strong>（触觉疗法原理）、
            <strong>仪式感</strong>（积极期待效应）和<strong>正念练习</strong>（冥想科学支持）。
            这些都是有科学依据的心理和生理机制。
          </p>
        </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ScientificCrystalRecommendation;
