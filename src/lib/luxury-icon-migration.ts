/**
 * 奢侈品级图标系统迁移工具
 * 基于世界顶级奢侈品网站设计规律优化的图标系统
 */

import { LuxuryIcons } from '@/components/icons/LuxuryIconSystem';

// 图标映射表 - 从Lucide图标到奢侈品级图标的映射
export const iconMigrationMap = {
  // 核心功能图标
  'Search': 'Search',
  'User': 'User', 
  'Menu': 'Menu',
  'Settings': 'Settings',
  
  // 水晶系统图标
  'Gem': 'Crystal',
  'Diamond': 'Crystal',
  'Sparkles': 'Crystal',
  
  // 能量系统图标
  'Zap': 'Energy',
  'Lightning': 'Energy',
  'Bolt': 'Energy',
  'Activity': 'Energy',
  
  // 冥想和洞察图标
  'Brain': 'Meditation',
  'Eye': 'Insight',
  'Lightbulb': 'Insight',
  'Target': 'Guidance',
  
  // 日历和时间图标
  'Calendar': 'Calendar',
  'CalendarDays': 'Calendar',
  'Clock': 'Calendar',
  
  // 状态图标
  'CheckCircle': 'Success',
  'Check': 'Success',
  'AlertTriangle': 'Warning',
  'AlertCircle': 'Warning',

  // 扩展图标
  'TrendingUp': 'Trend',
  'Award': 'Award',
  'Compass': 'Compass',
  'Layers': 'Layers',
  'BarChart3': 'Insight',
  'Radar': 'Insight',
  'Atom': 'Energy',
} as const;

// 图标尺寸映射 - 基于奢侈品网站的尺寸规范
export const luxurySizeMap = {
  'sm': 16,    // 小尺寸 - 用于内联文本
  'md': 20,    // 中等尺寸 - 标准按钮和导航
  'lg': 24,    // 大尺寸 - 重要功能
  'xl': 32,    // 超大尺寸 - 主要操作
} as const;

// 奢侈品级图标使用指南
export const luxuryIconGuidelines = {
  // 使用原则
  principles: {
    minimalism: '每个页面图标数量不超过8个',
    consistency: '同一功能区域使用相同尺寸',
    hierarchy: '重要功能使用更大尺寸',
    elegance: '优先使用线性图标，避免填充图标',
  },
  
  // 颜色使用规范
  colors: {
    default: 'text-muted-foreground', // 默认状态
    hover: 'hover:text-foreground',   // 悬停状态
    active: 'text-primary',           // 激活状态
    disabled: 'text-muted-foreground/50', // 禁用状态
  },
  
  // 动画效果规范
  animations: {
    subtle: 'transition-colors duration-200', // 微妙过渡
    interactive: 'hover:scale-105 transition-transform duration-200', // 交互反馈
    loading: 'animate-spin', // 加载状态
  },
  
  // 间距规范
  spacing: {
    iconText: 'gap-2',     // 图标与文字间距
    iconGroup: 'gap-3',    // 图标组间距
    iconButton: 'p-2',     // 图标按钮内边距
  },
} as const;

// 获取奢侈品级图标组件
export function getLuxuryIcon(iconName: string) {
  const mappedName = iconMigrationMap[iconName as keyof typeof iconMigrationMap];
  return mappedName ? LuxuryIcons[mappedName] : null;
}

// 生成图标类名 - 基于奢侈品设计规范
export function generateLuxuryIconClasses(options: {
  size?: keyof typeof luxurySizeMap;
  variant?: 'default' | 'nav' | 'button' | 'interactive';
  state?: 'default' | 'active' | 'disabled';
  animation?: 'none' | 'pulse' | 'spin' | 'bounce';
} = {}) {
  const {
    size = 'md',
    variant = 'default',
    state = 'default',
    animation = 'none'
  } = options;

  const classes = ['luxury-icon'];

  // 尺寸类
  classes.push(`luxury-icon-${size === 'sm' ? 'small' : size === 'md' ? 'medium' : size === 'lg' ? 'large' : 'xl'}`);

  // 变体类
  switch (variant) {
    case 'nav':
      classes.push('luxury-icon-nav');
      break;
    case 'button':
      classes.push('luxury-icon-button');
      break;
    case 'interactive':
      classes.push('luxury-icon-interactive');
      break;
  }

  // 状态类
  switch (state) {
    case 'active':
      classes.push('luxury-icon-active');
      break;
    case 'disabled':
      classes.push('luxury-icon-disabled');
      break;
  }

  // 动画类
  if (animation !== 'none') {
    classes.push(`luxury-icon-${animation}`);
  }

  return classes.join(' ');
}

// 图标使用建议生成器
export function generateIconUsageRecommendations(context: {
  pageType: 'dashboard' | 'navigation' | 'form' | 'content';
  importance: 'primary' | 'secondary' | 'tertiary';
  functionality: 'action' | 'status' | 'decoration';
}) {
  const { pageType, importance, functionality } = context;

  const recommendations = {
    size: 'md' as keyof typeof luxurySizeMap,
    strokeWidth: 1.5,
    variant: 'default' as const,
    maxCount: 8,
  };

  // 根据页面类型调整
  switch (pageType) {
    case 'dashboard':
      recommendations.size = importance === 'primary' ? 'lg' : 'md';
      recommendations.maxCount = 6;
      break;
    case 'navigation':
      recommendations.size = 'md';
      recommendations.variant = 'default';
      recommendations.maxCount = 5;
      break;
    case 'form':
      recommendations.size = 'sm';
      recommendations.maxCount = 4;
      break;
    case 'content':
      recommendations.size = importance === 'primary' ? 'md' : 'sm';
      recommendations.maxCount = 10;
      break;
  }

  // 根据功能调整
  switch (functionality) {
    case 'action':
      recommendations.strokeWidth = 1.5;
      break;
    case 'status':
      recommendations.strokeWidth = 2;
      break;
    case 'decoration':
      recommendations.strokeWidth = 1;
      break;
  }

  return recommendations;
}

// 图标可访问性检查
export function checkIconAccessibility(iconProps: {
  hasLabel?: boolean;
  hasAriaLabel?: boolean;
  isDecorative?: boolean;
  context: string;
}) {
  const issues: string[] = [];
  const { hasLabel, hasAriaLabel, isDecorative, context } = iconProps;

  if (!isDecorative && !hasLabel && !hasAriaLabel) {
    issues.push(`图标在${context}中缺少可访问性标签`);
  }

  if (isDecorative && (hasLabel || hasAriaLabel)) {
    issues.push(`装饰性图标在${context}中不应有标签`);
  }

  return {
    isAccessible: issues.length === 0,
    issues,
    recommendations: issues.length > 0 ? [
      '为功能性图标添加aria-label或配套文字',
      '为装饰性图标添加aria-hidden="true"',
      '确保图标与文字的对比度符合WCAG标准'
    ] : []
  };
}

// 导出奢侈品图标系统配置
export const luxuryIconSystemConfig = {
  defaultSize: luxurySizeMap.md,
  defaultStrokeWidth: 1.5,
  maxIconsPerPage: 8,
  preferredStyle: 'linear',
  animationDuration: 200,
  hoverScale: 1.05,
  guidelines: luxuryIconGuidelines,
} as const;

// 图标性能优化建议
export const iconPerformanceOptimizations = {
  // 懒加载大图标
  lazyLoadThreshold: 32,
  
  // 图标缓存策略
  cacheStrategy: 'memory',
  
  // SVG优化
  svgOptimization: {
    removeComments: true,
    removeMetadata: true,
    optimizePaths: true,
    minifyStyles: true,
  },
  
  // 批量加载
  batchLoading: true,
  
  // 预加载关键图标
  preloadCritical: ['Search', 'User', 'Menu', 'Settings'],
} as const;
