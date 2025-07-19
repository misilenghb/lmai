"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, UserPlus, LogIn, Loader2 } from 'lucide-react';
import { LuxuryIcons } from '@/components/icons/LuxuryIconSystem';
import { generateLuxuryIconClasses } from '@/lib/luxury-icon-migration';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';

const Header = () => {
  const { t } = useLanguage();
  const { isAuthenticated, logout, isAuthLoading } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const navLinks = [
    { href: "/", label: t('header.home') },
    { href: "/crystal-healing", label: t('header.crystalHealing') },
    // { href: "/crystal-database", label: t('header.crystalDatabase') }, // 隐藏水晶数据库
    { href: "/energy-exploration", label: t('header.energyExploration') },
    { href: "/simple-design", label: t('header.simpleDesign') },
    { href: "/creative-workshop", label: t('header.creativeWorkshop') },
  ];

  const handleLogout = () => {
    logout();
    setIsSheetOpen(false); // Close sheet on logout
  };

  return (
    <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm header-optimized">
      <div className="container mx-auto px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 text-xl lg:text-2xl font-bold energy-gradient header-logo">
            <LuxuryIcons.Crystal
              size={28}
              className={generateLuxuryIconClasses({
                size: 'lg',
                variant: 'interactive'
              })}
            />
            <span className="hidden sm:block">{t('header.title')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Button key={link.href} variant="ghost" size="sm" className="text-sm font-medium header-nav-item" asChild>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:block h-6 border-l border-border mx-3"></div>
            {/* Auth Actions */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isAuthenticated ? (
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="hidden lg:inline">{t('header.logout')}</span>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">
                      <LuxuryIcons.User
                        size={16}
                        className={generateLuxuryIconClasses({
                          size: 'sm',
                          variant: 'button'
                        })}
                      />
                      <span className="ml-2 hidden lg:inline">{t('header.login')}</span>
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">
                      <LuxuryIcons.User
                        size={16}
                        className={generateLuxuryIconClasses({
                          size: 'sm',
                          variant: 'button'
                        })}
                      />
                      <span className="ml-2 hidden lg:inline">{t('header.register')}</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Settings */}
            <Button variant="ghost" size="icon" className="hidden md:flex" asChild title={t('header.settings')}>
              <Link href="/settings" aria-label={t('header.settings')}>
                <LuxuryIcons.Settings
                  size={20}
                  className={generateLuxuryIconClasses({
                    size: 'md',
                    variant: 'nav'
                  })}
                />
              </Link>
            </Button>

            {/* Mobile Navigation */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Mobile Settings */}
              <Button variant="ghost" size="icon" asChild title={t('header.settings')}>
                <Link href="/settings" aria-label={t('header.settings')}>
                  <LuxuryIcons.Settings
                    size={20}
                    className={generateLuxuryIconClasses({
                      size: 'md',
                      variant: 'nav'
                    })}
                  />
                </Link>
              </Button>

              {/* Mobile Menu */}
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <LuxuryIcons.Menu
                      size={24}
                      className={generateLuxuryIconClasses({
                        size: 'lg',
                        variant: 'button'
                      })}
                    />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
            <SheetContent side="right" className="w-[250px] p-4 flex flex-col">
              <SheetHeader className="text-left">
                <SheetTitle>{t('header.mobileMenuTitle')}</SheetTitle>
              </SheetHeader>
              <Separator className="my-4" />
              <nav className="flex flex-col gap-2">
                {navLinks.map(link => (
                  <SheetClose key={link.href} asChild>
                    <Link href={link.href} className="text-lg py-2 hover:bg-accent rounded-md px-2 -mx-2 flex items-center">
                      {link.href === '/crystal-healing' && (
                        <LuxuryIcons.Crystal
                          size={20}
                          className={generateLuxuryIconClasses({
                            size: 'md',
                            variant: 'nav'
                          })}
                        />
                      )}
                      <span className={link.href === '/daily-focus' || link.href === '/crystal-healing' ? 'ml-2' : ''}>{link.label}</span>
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              
              <div className="mt-auto pt-4 border-t space-y-2">
                {isAuthLoading ? (
                  <div className="flex justify-center p-2"><Loader2 className="h-5 w-5 animate-spin" /></div>
                ) : isAuthenticated ? (
                  <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('header.logout')}
                  </Button>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Button variant="ghost" asChild className="w-full justify-start">
                        <Link href="/login">
                          <LuxuryIcons.User
                            size={16}
                            className={generateLuxuryIconClasses({
                              size: 'sm',
                              variant: 'button'
                            })}
                          />
                          <span className="ml-2">{t('header.login')}</span>
                        </Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button asChild className="w-full justify-start">
                        <Link href="/register">
                          <LuxuryIcons.User
                            size={16}
                            className={generateLuxuryIconClasses({
                              size: 'sm',
                              variant: 'button'
                            })}
                          />
                          <span className="ml-2">{t('header.register')}</span>
                        </Link>
                      </Button>
                    </SheetClose>
                  </>
                )}
                <SheetClose asChild>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/settings">
                      <LuxuryIcons.Settings
                        size={16}
                        className={generateLuxuryIconClasses({
                          size: 'sm',
                          variant: 'button'
                        })}
                      />
                      <span className="ml-2">{t('header.settings')}</span>
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
