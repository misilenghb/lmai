"use client";

import React, { useState, useEffect } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import PersonalizedQuestionnaire from "./PersonalizedQuestionnaire";
import UserProfileDisplay from "./UserProfileDisplay";
import CrystalFilteringSystem from "./CrystalFilteringSystem";
import FiveDimensionalEnergyChart from './FiveDimensionalEnergyChart';
import LifeScenarioGuidance from './LifeScenarioGuidance';
import ImprovedPersonalityAnalysis from './ImprovedPersonalityAnalysis';
import ScientificCrystalTherapy from './ScientificCrystalTherapy';
import ScientificCrystalRecommendation from './ScientificCrystalRecommendation';
import ImprovedPersonalizedSuggestions from './ImprovedPersonalizedSuggestions';

// 暂时移除统一的核心组件以解决水合错误
// import { EnergyAnalysisHub } from '@/components/core/EnergyCore';
// import { ProfileDisplayHub } from '@/components/core/ProfileCore';
import type { UserProfileDataOutput as UserProfileData } from "@/ai/schemas/user-profile-schemas";
import type { ChakraAssessmentScores } from "@/types/questionnaire";
import { supabase } from '@/lib/supabase';
import {
  Loader2, Star, Zap, Target, TrendingUp, CheckCircle,
  Brain, Lightbulb, Gem, Sparkles, Heart, User, ToggleLeft, ToggleRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";



export default function EnergyExplorationPageContent() {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [chakraScores, setChakraScores] = useState<ChakraAssessmentScores | null>(null);
  const [isAnalyzingProfile, setIsAnalyzingProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [hasUnsubmittedData, setHasUnsubmittedData] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  


  // 添加重新测试确认的状态
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  // 添加Tab状态
  const [activeTab, setActiveTab] = useState("overview");
  // 添加科学模式切换状态
  const [isScientificMode, setIsScientificMode] = useState(false);


  // 在组件加载时检查本地存储和已保存的画像
  useEffect(() => {
    const checkDataAndLoadProfile = async () => {
      // 检查本地存储是否有未提交的数据
      if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem('questionnaire_form_data');
        const hasLocalData = storedData && storedData !== 'null';
        setHasUnsubmittedData(!!hasLocalData);
        
        if (hasLocalData) {
          console.log('💾 发现本地存储的问卷数据，用户可以继续完成或重新提交');
        }
      }
      
      // 检查是否有已保存的画像
      if (isAuthenticated && user && user.email && !userProfile && !isAnalyzingProfile) {
        setIsLoadingProfile(true);
        try {
          const { profileService } = await import('@/lib/supabase');
          const savedProfile = await profileService.getUserProfileByEmail(user.email);
          
          if (savedProfile && savedProfile.personality_insights) {
            // 从星座推导主宰行星的辅助函数
            const getZodiacPlanet = (zodiac: string): string => {
              const zodiacPlanetMap: Record<string, string> = {
                '白羊座': '火星', '白羊': '火星',
                '金牛座': '金星', '金牛': '金星', 
                '双子座': '水星', '双子': '水星',
                '巨蟹座': '月亮', '巨蟹': '月亮',
                '狮子座': '太阳', '狮子': '太阳',
                '处女座': '水星', '处女': '水星',
                '天秤座': '金星', '天秤': '金星',
                '天蝎座': '冥王星', '天蝎': '冥王星',
                '射手座': '木星', '射手': '木星',
                '摩羯座': '土星', '摩羯': '土星',
                '水瓶座': '天王星', '水瓶': '天王星',
                '双鱼座': '海王星', '双鱼': '海王星'
              };
              
              for (const [sign, planet] of Object.entries(zodiacPlanetMap)) {
                if (zodiac && zodiac.includes(sign.replace('座', ''))) {
                  return planet;
                }
              }
              return '太阳'; // 默认主宰行星
            };

            // 将数据库格式转换为UserProfileData格式
            const profileData: UserProfileData = {
              name: savedProfile.name,
              coreEnergyInsights: savedProfile.personality_insights,
              inferredZodiac: savedProfile.zodiac_sign || '',
              inferredChineseZodiac: savedProfile.chinese_zodiac || '',
              inferredElement: savedProfile.element || '',
              inferredPlanet: getZodiacPlanet(savedProfile.zodiac_sign || ''),
              mbtiLikeType: savedProfile.mbti || '',
              chakraAnalysis: savedProfile.chakra_analysis && typeof savedProfile.chakra_analysis === 'object' ? 
                '您的脉轮能量分析已完成，请查看下方的脉轮能量图谱了解详细信息。' : 
                (typeof savedProfile.chakra_analysis === 'string' ? savedProfile.chakra_analysis : ''),
            };

            setUserProfile(profileData);
            setProfileLoaded(true);
            
            // 处理脉轮评分数据
            if (savedProfile.chakra_analysis && typeof savedProfile.chakra_analysis === 'object') {
              setChakraScores(savedProfile.chakra_analysis as ChakraAssessmentScores);
            } else {
              setChakraScores(null);
            }
            

            
            // 如果数据库中有画像，可以清除本地存储的问卷数据
            if (hasUnsubmittedData) {
              console.log('🔄 数据库中已有完整画像，本地问卷数据可能是旧数据');
            }
          }
        } catch (error) {
          console.error('Error loading saved profile:', error);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    checkDataAndLoadProfile();
  }, [isAuthenticated, user, userProfile, isAnalyzingProfile, hasUnsubmittedData]);



  // 处理基础评估完成事件
  const handleBasicProfileComplete = (profileData: UserProfileData | null) => {
    if (!profileData) return; // 如果是null就直接返回

    setUserProfile(profileData);
  };





  // 重新开始问卷的功能
  const handleRestartQuestionnaire = async () => {
    try {
      console.log('🔄 开始重新测试，清空所有数据...');
      
      // 显示处理状态
      setIsLoadingProfile(true);
      setShowRestartConfirm(false); // 隐藏确认对话框
      
      // 1. 清空组件状态
      setUserProfile(null);
      setChakraScores(null);
      setIsAnalyzingProfile(false);
      setProfileLoaded(false);
      
      // 2. 清空本地存储
      if (typeof window !== 'undefined') {
        console.log('🗑️ 清空本地存储数据...');
        const keysToRemove = [
          'questionnaire_form_data',
          'questionnaire_progress',
          'questionnaire_current_step',
          'chakra_assessment_scores',
          'user_profile_cache',
          'meditation_reminders',
          'crystal_preferences',
          'energy_history',
          'daily_insights_cache',
          'personalized_recommendations'
        ];
        
        keysToRemove.forEach(key => {
          try {
            localStorage.removeItem(key);
            console.log(`✅ 已清空: ${key}`);
          } catch (error) {
            console.warn(`⚠️ 清空失败: ${key}`, error);
          }
        });
        
        setHasUnsubmittedData(false);
      }
      
      // 3. 清空数据库中的用户数据
      try {
        console.log('🗄️ 清空数据库用户数据...');
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // 删除用户档案数据
          const { error: profileError } = await supabase
            .from('user_profiles')
            .delete()
            .eq('user_id', user.id);
          
          if (profileError) {
            console.warn('⚠️ 清空档案数据时出现警告:', profileError);
          } else {
            console.log('✅ 数据库用户档案已清空');
          }
          
          // 删除能量记录
          const { error: energyError } = await supabase
            .from('energy_records')
            .delete()
            .eq('user_id', user.id);
          
          if (energyError) {
            console.warn('⚠️ 清空能量记录时出现警告:', energyError);
          } else {
            console.log('✅ 数据库能量记录已清空');
          }
        }
      } catch (dbError) {
        console.warn('⚠️ 数据库清理过程中出现警告:', dbError);
      }
      
      // 4. 状态重置完成
      setIsLoadingProfile(false);
      console.log('🎉 重新测试准备完成！');
      
    } catch (error) {
      console.error('❌ 重新测试过程中发生错误:', error);
      setIsLoadingProfile(false);
    }
  };

  return (
    <div className="container-center space-section">
      <div className="max-w-6xl mx-auto">

        {/* 主要内容区域 */}
        <div className="space-content">


            {/* 能量画像完成状态 - 直接显示详细内容 */}
            {profileLoaded && userProfile && (
              <div className="space-y-6">






                {/* 统一的能量分析组件 - 暂时移除以解决水合错误 */}
                {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <EnergyAnalysisHub
                    profile={userProfile}
                    mode="exploration"
                    layout="chart"
                    showAdvanced={true}
                  />

                  <ProfileDisplayHub
                    profile={userProfile}
                    mode="detailed"
                    showElements={['mbti', 'zodiac', 'chakra', 'energy', 'element', 'planet']}
                    interactive={true}
                  />
                </div> */}

                {/* 根据模式显示不同的分析组件 */}
                {isScientificMode ? (
                  // 科学模式组件
                  <div className="space-y-6">
                    {/* 科学性格分析 */}
                    <ImprovedPersonalityAnalysis
                      userProfile={userProfile}
                      className="mt-6"
                      onBackToTraditional={() => setIsScientificMode(false)}
                    />

                    {/* 科学水晶推荐 */}
                    <ScientificCrystalRecommendation
                      userProfile={userProfile}
                      className="mt-6"
                    />

                    {/* 科学水晶疗法 */}
                    <ScientificCrystalTherapy
                      userProfile={userProfile}
                      className="mt-6"
                    />
                  </div>
                ) : (
                  // 传统模式组件
                  <div className="space-y-6">


                    {/* 八维度能量画像 */}
                    <div data-chart="five-dimensional">
                      <FiveDimensionalEnergyChart
                        profileData={userProfile}
                        chakraScores={chakraScores}
                        className="mt-6"
                        isScientificMode={isScientificMode}
                        onScientificModeToggle={() => setIsScientificMode(!isScientificMode)}
                        onRestartTest={() => setShowRestartConfirm(true)}
                      />
                    </div>

                    {/* 优化的专属建议 */}
                    <div data-section="personalized-suggestions">
                      <ImprovedPersonalizedSuggestions
                        userProfile={userProfile}
                        className="mt-6"
                      />
                    </div>

                    {/* 生活场景水晶指导 */}
                    <div data-section="life-guidance">
                      <LifeScenarioGuidance
                        userProfile={userProfile ?? {} as any}
                        className="mt-6"
                      />
                    </div>
                  </div>
                )}

                {/* 推荐水晶详细信息 - 仅在传统模式下显示 */}
                {!isScientificMode && (
                  <div data-section="crystal-filtering">
                    {userProfile?.recommendedCrystals && userProfile.recommendedCrystals.length > 0 && (
                    <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        推荐水晶详解
                      </CardTitle>
                      <CardDescription>
                        根据您的能量特质为您精心推荐的水晶及其作用原理
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {userProfile.recommendedCrystals.map((crystal, index) => (
                        <div key={index} className="p-4 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-foreground">{crystal.name}</h4>
                            {crystal.matchScore && (
                              <span className="text-xs text-primary font-medium px-2 py-1 bg-primary/10 rounded">
                                匹配度: {Math.round(crystal.matchScore * 10)}/10
                              </span>
                            )}
                          </div>
                          <div className="space-y-3">
                            {Object.entries(crystal.reasoningDetails).map(([reasonKey, reasonText]) => (
                              <div key={reasonKey}>
                                <h5 className="font-medium text-sm text-foreground mb-1">
                                  {reasonKey === 'personalityFit' && '个性匹配'}
                                  {reasonKey === 'chakraSupport' && '脉轮支持'}
                                  {reasonKey === 'goalAlignment' && '目标对齐'}
                                  {reasonKey === 'holisticSynergy' && '整体协同'}
                                </h5>
                                <div className="text-sm text-foreground/70 pl-3 border-l-2 border-primary/30">
                                  {reasonText.split('\n\n').map((paragraph, pIndex) => (
                                    <p key={`p-${pIndex}`} className="mb-2 last:mb-0">
                                      {paragraph.split('\n').map((line, lIndex) => (
                                        <React.Fragment key={`l-${lIndex}`}>
                                          {line}
                                          {lIndex < paragraph.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                      ))}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* 水晶组合 */}
                {userProfile?.crystalCombinations && userProfile.crystalCombinations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Gem className="h-5 w-5 text-primary" />
                        水晶疗愈组合
                      </CardTitle>
                      <CardDescription>
                        多种水晶协同作用，放大疗愈效果的专属组合建议
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {userProfile.crystalCombinations.map((combo, index) => (
                        <div key={index} className="p-3 border border-border rounded-lg">
                          <h4 className="font-medium text-primary mb-2">{combo.combination.join(' + ')}</h4>
                          <div className="text-sm text-foreground/70 leading-relaxed">
                            {combo.synergyEffect.split('\n\n').map((paragraph, pIndex) => (
                              <p key={`p-${pIndex}`} className="mb-2 last:mb-0">
                                {paragraph.split('\n').map((line, lIndex) => (
                                  <React.Fragment key={`l-${lIndex}`}>
                                    {line}
                                    {lIndex < paragraph.split('\n').length - 1 && <br />}
                                  </React.Fragment>
                                ))}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  )}
                  </div>
                )}
              </div>
            )}

            {/* 基础评估模式 */}
            {!userProfile && !isAnalyzingProfile && !isLoadingProfile && (
              <PersonalizedQuestionnaire
                setProfileData={handleBasicProfileComplete}
                setIsAnalyzing={setIsAnalyzingProfile}
              />
            )}

            {/* 分析状态 */}
            {(isAnalyzingProfile || isLoadingProfile) && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-lg font-medium text-foreground">
                  {isLoadingProfile ? '加载您的档案数据...' : '正在分析您的能量画像...'}
                </p>
                <p className="text-foreground/70 mt-2">
                  {isLoadingProfile ? '请稍候，正在获取您的个人数据' : '这可能需要几秒钟时间，请耐心等待'}
                </p>
              </div>
            )}




        </div>





        {/* 重新测试确认对话框 */}
        {showRestartConfirm && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle className="text-center">确认重新测试</CardTitle>
                <CardDescription className="text-center">
                  这将清空您的所有评估数据，需要重新完成问卷。您确定要继续吗？
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowRestartConfirm(false)}
                    className="flex-1"
                  >
                    取消
                  </Button>
                  <Button
                    onClick={handleRestartQuestionnaire}
                    variant="destructive"
                    className="flex-1"
                    disabled={isLoadingProfile}
                  >
                    {isLoadingProfile ? '处理中...' : '确认重新测试'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
