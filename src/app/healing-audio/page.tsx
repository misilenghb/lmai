'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music, Headphones, Waves, Zap, Gem, Brain, Heart, Eye, Crown, Search } from 'lucide-react';
import HealingAudioRecommendation, { HEALING_AUDIO_LIBRARY } from '@/components/HealingAudioRecommendation';
import { HealingAudioService } from '@/services/healingAudioService';

const HealingAudioPage = () => {
  const [selectedContext, setSelectedContext] = useState({
    meditationType: '',
    chakraFocus: '',
    emotionalState: '',
    timeOfDay: '',
    experience: ''
  });

  const [smartRecommendations, setSmartRecommendations] = useState(
    HealingAudioService.getRandomRecommendations(3)
  );

  // 更新智能推荐
  const updateRecommendations = () => {
    const context = {
      meditationType: selectedContext.meditationType || undefined,
      chakraFocus: selectedContext.chakraFocus || undefined,
      emotionalState: selectedContext.emotionalState || undefined,
      timeOfDay: selectedContext.timeOfDay as any || undefined,
      experience: selectedContext.experience as any || undefined
    };

    const recommendations = HealingAudioService.getRecommendations(context);
    setSmartRecommendations(recommendations.length > 0 ? recommendations : HealingAudioService.getRandomRecommendations(3));
  };

  // 获取脉轮图标
  const getChakraIcon = (chakra: string) => {
    const icons: Record<string, React.ReactNode> = {
      'root': <div className="w-4 h-4 bg-red-500 rounded-full" />,
      'sacral': <div className="w-4 h-4 bg-orange-500 rounded-full" />,
      'solarPlexus': <div className="w-4 h-4 bg-yellow-500 rounded-full" />,
      'heart': <Heart className="w-4 h-4 text-green-500" />,
      'throat': <div className="w-4 h-4 bg-blue-500 rounded-full" />,
      'thirdEye': <Eye className="w-4 h-4 text-indigo-500" />,
      'crown': <Crown className="w-4 h-4 text-purple-500" />
    };
    return icons[chakra] || <div className="w-4 h-4 bg-gray-400 rounded-full" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            疗愈音频推荐系统
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            基于科学研究的音频疗愈技术，结合Solfeggio频率、双耳节拍、水晶钵音疗和自然音效，为您的冥想和疗愈之旅提供个性化音频支持
          </p>
        </div>

        <Tabs defaultValue="smart" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="smart">智能推荐</TabsTrigger>
            <TabsTrigger value="library">音频库</TabsTrigger>
            <TabsTrigger value="types">分类浏览</TabsTrigger>
            <TabsTrigger value="science">科学原理</TabsTrigger>
          </TabsList>

          {/* 智能推荐 */}
          <TabsContent value="smart" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>个性化音频推荐</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">冥想类型</label>
                    <Select value={selectedContext.meditationType} onValueChange={(value) => 
                      setSelectedContext(prev => ({ ...prev, meditationType: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="选择冥想类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crystal_focus">水晶专注冥想</SelectItem>
                        <SelectItem value="chakra_balance">脉轮平衡冥想</SelectItem>
                        <SelectItem value="emotional_healing">情感疗愈冥想</SelectItem>
                        <SelectItem value="protection">能量保护冥想</SelectItem>
                        <SelectItem value="intuition-awakening">直觉觉醒冥想</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">脉轮焦点</label>
                    <Select value={selectedContext.chakraFocus} onValueChange={(value) => 
                      setSelectedContext(prev => ({ ...prev, chakraFocus: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="选择脉轮" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="root">根轮 (安全感)</SelectItem>
                        <SelectItem value="sacral">骶轮 (创造力)</SelectItem>
                        <SelectItem value="solarPlexus">太阳轮 (自信)</SelectItem>
                        <SelectItem value="heart">心轮 (爱与疗愈)</SelectItem>
                        <SelectItem value="throat">喉轮 (表达)</SelectItem>
                        <SelectItem value="thirdEye">眉心轮 (直觉)</SelectItem>
                        <SelectItem value="crown">顶轮 (灵性)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">情绪状态</label>
                    <Select value={selectedContext.emotionalState} onValueChange={(value) => 
                      setSelectedContext(prev => ({ ...prev, emotionalState: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="当前情绪" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stressed">压力大</SelectItem>
                        <SelectItem value="anxious">焦虑</SelectItem>
                        <SelectItem value="sad">悲伤</SelectItem>
                        <SelectItem value="angry">愤怒</SelectItem>
                        <SelectItem value="tired">疲惫</SelectItem>
                        <SelectItem value="peaceful">平静</SelectItem>
                        <SelectItem value="loving">充满爱</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">时间段</label>
                    <Select value={selectedContext.timeOfDay} onValueChange={(value) => 
                      setSelectedContext(prev => ({ ...prev, timeOfDay: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="选择时间" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">早晨</SelectItem>
                        <SelectItem value="afternoon">下午</SelectItem>
                        <SelectItem value="evening">傍晚</SelectItem>
                        <SelectItem value="night">夜晚</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">经验水平</label>
                    <Select value={selectedContext.experience} onValueChange={(value) => 
                      setSelectedContext(prev => ({ ...prev, experience: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="冥想经验" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">初学者</SelectItem>
                        <SelectItem value="intermediate">中级</SelectItem>
                        <SelectItem value="advanced">高级</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button onClick={updateRecommendations} className="w-full">
                      <Search className="h-4 w-4 mr-2" />
                      获取推荐
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <HealingAudioRecommendation 
              recommendedAudio={smartRecommendations}
              showTitle={true}
            />
          </TabsContent>

          {/* 音频库 */}
          <TabsContent value="library">
            <HealingAudioRecommendation 
              recommendedAudio={HEALING_AUDIO_LIBRARY}
              showTitle={true}
            />
          </TabsContent>

          {/* 分类浏览 */}
          <TabsContent value="types" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 频率疗愈 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span>频率疗愈</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HealingAudioRecommendation 
                    recommendedAudio={HealingAudioService.getAudioByType('frequency')}
                    showTitle={false}
                    compact={true}
                  />
                </CardContent>
              </Card>

              {/* 水晶钵 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gem className="h-5 w-5 text-purple-500" />
                    <span>水晶钵音疗</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HealingAudioRecommendation 
                    recommendedAudio={HealingAudioService.getAudioByType('crystal_bowl')}
                    showTitle={false}
                    compact={true}
                  />
                </CardContent>
              </Card>

              {/* 双耳节拍 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Headphones className="h-5 w-5 text-blue-500" />
                    <span>双耳节拍</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HealingAudioRecommendation 
                    recommendedAudio={HealingAudioService.getAudioByType('binaural')}
                    showTitle={false}
                    compact={true}
                  />
                </CardContent>
              </Card>

              {/* 自然音效 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Waves className="h-5 w-5 text-green-500" />
                    <span>自然音效</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HealingAudioRecommendation 
                    recommendedAudio={HealingAudioService.getAudioByType('nature')}
                    showTitle={false}
                    compact={true}
                  />
                </CardContent>
              </Card>

              {/* 环境音乐 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Music className="h-5 w-5 text-indigo-500" />
                    <span>环境音乐</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HealingAudioRecommendation 
                    recommendedAudio={HealingAudioService.getAudioByType('ambient')}
                    showTitle={false}
                    compact={true}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 科学原理 */}
          <TabsContent value="science" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Solfeggio频率</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Solfeggio频率是一组特定的音调频率，被认为具有疗愈和转化的特性。
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">528Hz</span>
                      <Badge variant="outline">DNA修复</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">432Hz</span>
                      <Badge variant="outline">自然和谐</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">639Hz</span>
                      <Badge variant="outline">关系疗愈</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>双耳节拍</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    通过左右耳播放略有不同的频率，大脑会产生第三个频率，引导脑波同步。
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Delta (0.5-4Hz)</span>
                      <Badge variant="outline">深度睡眠</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Theta (4-8Hz)</span>
                      <Badge variant="outline">深度冥想</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Alpha (8-12Hz)</span>
                      <Badge variant="outline">放松专注</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>水晶钵音疗</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    水晶唱钵产生纯净的频率振动，与人体脉轮系统共振，促进能量平衡和深度疗愈。
                    每个脉轮对应特定的频率，通过声音振动可以清理和激活相应的能量中心。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>自然音效疗愈</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    自然声音如海浪、雨声、森林音效等，能够激活副交感神经系统，降低皮质醇水平，
                    促进深度放松。这些声音模拟了人类进化环境中的安全信号。
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealingAudioPage;
