"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  BarChartBig,
  Sparkles,
  Brain,
  Heart,
  Calendar,
  Gem,
  Activity,
  Target
} from 'lucide-react';

import UserOnboarding from '@/components/UserOnboarding';
import { FadeIn, ScaleIn, Stagger, CardHover, CountUp } from '@/components/AnimationEnhancer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminEmail } from '@/lib/admin-auth';

export default function Home() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAdminEntry, setShowAdminEntry] = useState(false);

  useEffect(() => {
    // 检查是否是首次访问
    const hasSeenOnboarding = localStorage.getItem('onboarding-completed') || localStorage.getItem('onboarding-skipped');
    if (!hasSeenOnboarding) {
      // 延迟显示引导，让用户先看到主页
      setTimeout(() => setShowOnboarding(true), 2000);
    }

    // 检查是否为管理员用户
    if (isAuthenticated && user?.email && isAdminEmail(user.email)) {
      setShowAdminEntry(true);
    }
  }, [isAuthenticated, user]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
  };

  const features = [
    {
      icon: <Gem className="h-8 w-8 text-primary" />,
      title: t('homePage.features.crystalHealing.title'),
      description: t('homePage.features.crystalHealing.description'),
      stats: '6+',
      statsLabel: t('homePage.features.crystalHealing.statsLabel')
    },
    {
      icon: <Brain className="h-8 w-8 text-secondary" />,
      title: t('homePage.features.emotionRecognition.title'),
      description: t('homePage.features.emotionRecognition.description'),
      stats: '8',
      statsLabel: t('homePage.features.emotionRecognition.statsLabel')
    },
    {
      icon: <Heart className="h-8 w-8 text-accent" />,
      title: t('homePage.features.meditation.title'),
      description: t('homePage.features.meditation.description'),
      stats: '4',
      statsLabel: t('homePage.features.meditation.statsLabel')
    },
    {
      icon: <Activity className="h-8 w-8 text-secondary" />,
      title: t('homePage.features.emotionTracking.title'),
      description: t('homePage.features.emotionTracking.description'),
      stats: '24/7',
      statsLabel: t('homePage.features.emotionTracking.statsLabel')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* 英雄区域 */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full filter blur-3xl" />
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/20 rounded-full filter blur-3xl" />
          </div>

          <div className="relative z-10 container mx-auto px-4 py-20 text-center">
            <FadeIn direction="up" delay={0.2}>
              <div className="flex justify-center mb-6">
                <ScaleIn delay={0.5}>
                  <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-full">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                </ScaleIn>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.4}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 energy-gradient">
                {t('homePage.hero.title')}
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={0.6}>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
                {t('homePage.hero.subtitle')}
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.8}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
                {t('homePage.hero.description')}
              </p>
            </FadeIn>

            <Stagger staggerDelay={0.1}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <CardHover>
                  <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90" asChild>
                    <Link href="/crystal-healing">
                      <Gem className="mr-2 h-5 w-5" />
                      {t('homePage.hero.startJourney')}
                    </Link>
                  </Button>
                </CardHover>

                <CardHover>
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-primary/30 text-primary hover:bg-primary/10" asChild>
                    <Link href="/energy-exploration">
                      <BarChartBig className="mr-2 h-5 w-5" />
                      {t('homePage.hero.energyAnalysis')}
                    </Link>
                  </Button>
                </CardHover>
              </div>
            </Stagger>

            {/* 统计数据 */}
            <FadeIn direction="up" delay={1.0}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    <CountUp to={500} suffix="+" />
                  </div>
                  <div className="text-sm text-muted-foreground">{t('homePage.stats.activeUsers')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">
                    <CountUp to={6} />
                  </div>
                  <div className="text-sm text-muted-foreground">{t('homePage.stats.healingCrystals')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">
                    <CountUp to={8} />
                  </div>
                  <div className="text-sm text-muted-foreground">{t('homePage.stats.emotionStates')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">
                    <CountUp to={4} />
                  </div>
                  <div className="text-sm text-muted-foreground">{t('homePage.stats.meditationTypes')}</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 功能特色 */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <FadeIn direction="up">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4 heading-enhanced">{t('homePage.features.title')}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t('homePage.features.description')}
                </p>
              </div>
            </FadeIn>

            <Stagger staggerDelay={0.2}>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <CardHover key={index}>
                    <Card className="h-full quantum-card quantum-hover">
                      <CardContent className="p-6 text-center">
                        <div className="flex justify-center mb-4">
                          <div className="p-3 bg-muted/30 rounded-full">
                            {feature.icon}
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                        <p className="text-muted-foreground mb-4">{feature.description}</p>
                        <div className="text-center">
                          <div className="text-2xl font-bold energy-gradient">
                            {feature.stats}
                          </div>
                          <div className="text-sm text-muted-foreground">{feature.statsLabel}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardHover>
                ))}
              </div>
            </Stagger>
          </div>
        </section>

        {/* 快速开始 */}
        <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="container mx-auto px-4 text-center">
            <FadeIn direction="up">
              <h2 className="text-4xl font-bold mb-4">{t('homePage.cta.title')}</h2>
              <p className="text-xl mb-8 opacity-90">
                {t('homePage.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="px-8 py-4 text-lg bg-white text-primary hover:bg-white/90" asChild>
                  <Link href="/crystal-healing">
                    <Gem className="mr-2 h-5 w-5" />
                    {t('homePage.cta.startNow')}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-primary" asChild>
                  <Link href="/energy-exploration">
                    <Heart className="mr-2 h-5 w-5" />
                    {t('homePage.cta.energyAnalysis')}
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 管理员入口 */}
        {showAdminEntry && (
          <div className="fixed bottom-4 right-4 z-50">
            <Button
              variant="outline"
              size="sm"
              className="bg-background/80 backdrop-blur-sm border-primary/30 text-primary hover:bg-primary/10"
              asChild
            >
              <Link href="/admin">
                <Activity className="mr-2 h-4 w-4" />
                管理控制台
              </Link>
            </Button>
          </div>
        )}

        {/* 用户引导 */}
        {showOnboarding && (
          <UserOnboarding
            onComplete={handleOnboardingComplete}
            onSkip={handleOnboardingSkip}
          />
        )}
      </div>
    );
  }
