"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, Diamond, Crown, Heart, Gem, Sparkles, User, LogIn, Languages } from 'lucide-react';
import type { Theme } from '@/contexts/LanguageContext';
import Link from 'next/link';
import UserGalleryStats from '@/components/UserGalleryStats';

export default function SettingsPage() {
  const { language, setLanguage, theme, setTheme, t } = useLanguage();
  const { isAuthenticated, user } = useAuth();

  // AURA主题是唯一主题，无需选择器

  return (
    <div className="container-center space-section">
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold energy-gradient flex items-center justify-center mb-4">
          <SettingsIcon className="mr-3 h-10 w-10" />
          {t('settingsPage.title')}
        </h1>

      </header>

      <div className="max-w-md mx-auto space-content">
         <Card className="quantum-card">
          <CardHeader>
            <CardTitle className="flex items-center"><User className="mr-2 h-5 w-5 text-primary"/>{t('settingsPage.accountTitle')}</CardTitle>
            <CardDescription>{t('settingsPage.accountDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isAuthenticated ? (
               <div className="space-y-4">
                  <p>{t('settingsPage.loggedInAs', { email: user?.email })}</p>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/settings/membership">
                        <Crown className="mr-2 h-4 w-4 text-accent" />
                        {t('settingsPage.membershipButton')}
                    </Link>
                  </Button>
               </div>
            ) : (
                <div className="space-y-4 text-center">
                    <p className="text-muted-foreground">{t('settingsPage.notLoggedIn')}</p>
                    <Button asChild className="w-full">
                        <Link href="/login">
                            <LogIn className="mr-2 h-4 w-4" />
                            {t('settingsPage.loginButton')}
                        </Link>
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>

        {/* {t('settingsPage.userGalleryStats')} - 仅在用户登录时显示 */}
        {isAuthenticated && <UserGalleryStats />}

        <Card className="quantum-card">
          <CardHeader>
            <CardTitle className="flex items-center"><Languages className="mr-2 h-5 w-5 text-primary"/>{t('settingsPage.language')}</CardTitle>
            <CardDescription>{t('settingsPage.selectLanguage')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="language-select">{t('settingsPage.language')}</Label>
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value as 'en' | 'zh')}
              >
                <SelectTrigger id="language-select">
                  <SelectValue placeholder={t('settingsPage.selectLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t('settingsPage.english')}</SelectItem>
                  <SelectItem value="zh">{t('settingsPage.chinese')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="aura-card aura-glow">
          <CardHeader>
            <CardTitle className="flex items-center aura-text-gradient">
              <Diamond className="mr-2 h-5 w-5"/>
              AURA主题系统
            </CardTitle>
            <CardDescription>
              您正在使用AURA主题 - 深蓝紫色背景配粉红色强调的现代设计
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary aura-pulse"></div>
                <div>
                  <p className="font-medium">AURA主题</p>
                  <p className="text-sm text-muted-foreground">深蓝紫 + 粉红强调</p>
                </div>
              </div>
              <div className="text-sm text-primary font-medium">已激活</div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
