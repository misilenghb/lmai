"use client";

import React from 'react';
import { cn } from '@/lib/utils';

// 奢侈品级别的图标系统 - 基于世界顶级品牌设计规律
// 设计原则：极简、线性、功能性、高级感

interface LuxuryIconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

// 核心功能图标 - 采用细线条设计
export const LuxurySearch: React.FC<LuxuryIconProps> = ({ 
  size = 20, 
  className = "", 
  strokeWidth = 1.5 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("luxury-icon", className)}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export const LuxuryUser: React.FC<LuxuryIconProps> = ({ 
  size = 20, 
  className = "", 
  strokeWidth = 1.5 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("luxury-icon", className)}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const LuxuryMenu: React.FC<LuxuryIconProps> = ({ 
  size = 20, 
  className = "", 
  strokeWidth = 1.5 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("luxury-icon", className)}
  >
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

export const LuxurySettings: React.FC<LuxuryIconProps> = ({ 
  size = 20, 
  className = "", 
  strokeWidth = 1.5 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("luxury-icon", className)}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// 水晶系统专用图标 - 保持奢侈品美学
export const LuxuryCrystal: React.FC<LuxuryIconProps> = ({ 
  size = 20, 
  className = "", 
  strokeWidth = 1.5 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("luxury-icon", className)}
  >
    <path d="M6 3h12l4 6-10 13L2 9l4-6z" />
    <path d="M11 3 8 9l4 13 4-13-3-6" />
    <path d="M2 9h20" />
  </svg>
);

export const LuxuryEnergy: React.FC<LuxuryIconProps> = ({ 
  size = 20, 
  className = "", 
  strokeWidth = 1.5 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("luxury-icon", className)}
  >
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

export const LuxuryMeditation: React.FC<LuxuryIconProps> = ({ 
  size = 20, 
  className = "", 
  strokeWidth = 1.5 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("luxury-icon", className)}
  >
    <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    <circle cx="12" cy="12" r="1" />
  </svg>
);

export const LuxuryCalendar: React.FC<LuxuryIconProps> = ({ 
  size = 20, 
  className = "", 
  strokeWidth = 1.5 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("luxury-icon", className)}
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

export const LuxuryInsight: React.FC<LuxuryIconProps> = ({ 
  size = 20, 
  className = "", 
  strokeWidth = 1.5 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("luxury-icon", className)}
  >
    <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4" />
    <path d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
    <path d="M14 9c-1.5 1.5-3 3-3 4.5s1.5 3 3 4.5" />
    <path d="M10 9c1.5 1.5 3 3 3 4.5s-1.5 3-3 4.5" />
  </svg>
);

export const LuxuryGuidance: React.FC<LuxuryIconProps> = ({ 
  size = 20, 
  className = "", 
  strokeWidth = 1.5 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("luxury-icon", className)}
  >
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </svg>
);

// 状态指示图标
export const LuxurySuccess: React.FC<LuxuryIconProps> = ({ 
  size = 20, 
  className = "", 
  strokeWidth = 1.5 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("luxury-icon", className)}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

export const LuxuryWarning: React.FC<LuxuryIconProps> = ({
  size = 20,
  className = "",
  strokeWidth = 1.5
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("luxury-icon", className)}
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

// 扩展图标 - 更多奢侈品级图标
export const LuxuryTrend: React.FC<LuxuryIconProps> = ({
  size = 20,
  className = "",
  strokeWidth = 1.5
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("luxury-icon", className)}
  >
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
    <polyline points="16,7 22,7 22,13" />
  </svg>
);

export const LuxuryActivity: React.FC<LuxuryIconProps> = ({
  size = 20,
  className = "",
  strokeWidth = 1.5
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("luxury-icon", className)}
  >
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
  </svg>
);

export const LuxuryAward: React.FC<LuxuryIconProps> = ({
  size = 20,
  className = "",
  strokeWidth = 1.5
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("luxury-icon", className)}
  >
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

export const LuxuryCompass: React.FC<LuxuryIconProps> = ({
  size = 20,
  className = "",
  strokeWidth = 1.5
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("luxury-icon", className)}
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
  </svg>
);

export const LuxuryLayers: React.FC<LuxuryIconProps> = ({
  size = 20,
  className = "",
  strokeWidth = 1.5
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("luxury-icon", className)}
  >
    <polygon points="12,2 2,7 12,12 22,7" />
    <polyline points="2,17 12,22 22,17" />
    <polyline points="2,12 12,17 22,12" />
  </svg>
);

// 导出所有图标的映射
export const LuxuryIcons = {
  Search: LuxurySearch,
  User: LuxuryUser,
  Menu: LuxuryMenu,
  Settings: LuxurySettings,
  Crystal: LuxuryCrystal,
  Energy: LuxuryEnergy,
  Meditation: LuxuryMeditation,
  Calendar: LuxuryCalendar,
  Insight: LuxuryInsight,
  Guidance: LuxuryGuidance,
  Success: LuxurySuccess,
  Warning: LuxuryWarning,
  Trend: LuxuryTrend,
  Activity: LuxuryActivity,
  Award: LuxuryAward,
  Compass: LuxuryCompass,
  Layers: LuxuryLayers,
};

// 图标使用指南组件
export const LuxuryIconGuide: React.FC = () => (
  <div className="p-6 space-y-4">
    <h3 className="text-lg font-semibold">奢侈品级图标系统使用指南</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(LuxuryIcons).map(([name, Icon]) => (
        <div key={name} className="flex flex-col items-center p-3 border rounded-lg">
          <Icon size={24} className="mb-2" />
          <span className="text-sm text-muted-foreground">{name}</span>
        </div>
      ))}
    </div>
  </div>
);
