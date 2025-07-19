/**
 * 统一的颜色系统工具
 * 将所有硬编码颜色映射到系统色彩变量
 */

// 基础颜色映射
export const colorMap = {
  // 功能色彩
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  error: 'hsl(var(--destructive))',
  destructive: 'hsl(var(--destructive))',
  info: 'hsl(var(--info))',
  
  // 主题色彩
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  
  // 中性色彩
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  muted: 'hsl(var(--muted))',
  'muted-foreground': 'hsl(var(--muted-foreground))',
  border: 'hsl(var(--border))',
  
  // 卡片色彩
  card: 'hsl(var(--card))',
  'card-foreground': 'hsl(var(--card-foreground))',
} as const;

// 颜色强度映射
export const colorIntensityMap = {
  // 成功色系
  'success-50': 'bg-success/5',
  'success-100': 'bg-success/10',
  'success-200': 'bg-success/20',
  'success-500': 'bg-success',
  'success-600': 'text-success',
  'success-700': 'text-success',
  'success-800': 'text-success',
  
  // 警告色系
  'warning-50': 'bg-warning/5',
  'warning-100': 'bg-warning/10',
  'warning-200': 'bg-warning/20',
  'warning-500': 'bg-warning',
  'warning-600': 'text-warning',
  'warning-700': 'text-warning',
  'warning-800': 'text-warning',
  
  // 错误色系
  'destructive-50': 'bg-destructive/5',
  'destructive-100': 'bg-destructive/10',
  'destructive-200': 'bg-destructive/20',
  'destructive-500': 'bg-destructive',
  'destructive-600': 'text-destructive',
  'destructive-700': 'text-destructive',
  'destructive-800': 'text-destructive',
  
  // 主色系
  'primary-50': 'bg-primary/5',
  'primary-100': 'bg-primary/10',
  'primary-200': 'bg-primary/20',
  'primary-500': 'bg-primary',
  'primary-600': 'text-primary',
  'primary-700': 'text-primary',
  'primary-800': 'text-primary',
  
  // 次要色系
  'secondary-50': 'bg-secondary/5',
  'secondary-100': 'bg-secondary/10',
  'secondary-200': 'bg-secondary/20',
  'secondary-500': 'bg-secondary',
  'secondary-600': 'text-secondary',
  'secondary-700': 'text-secondary',
  'secondary-800': 'text-secondary',
} as const;

// 替换硬编码颜色类名的映射
export const hardcodedColorReplacements: Record<string, string> = {
  // 绿色系
  'text-green-600': 'text-success',
  'text-green-700': 'text-success',
  'text-green-800': 'text-success',
  'bg-green-50': 'bg-success/5',
  'bg-green-100': 'bg-success/10',
  'border-green-200': 'border-success/20',
  'border-green-500': 'border-success',
  
  // 蓝色系
  'text-blue-600': 'text-primary',
  'text-blue-700': 'text-primary',
  'text-blue-800': 'text-primary',
  'bg-blue-50': 'bg-primary/5',
  'bg-blue-100': 'bg-primary/10',
  'border-blue-200': 'border-primary/20',
  'border-blue-500': 'border-primary',
  
  // 黄色系
  'text-yellow-500': 'text-warning',
  'text-yellow-600': 'text-warning',
  'text-yellow-700': 'text-warning',
  'text-yellow-800': 'text-warning',
  'bg-yellow-50': 'bg-warning/5',
  'bg-yellow-100': 'bg-warning/10',
  'border-yellow-200': 'border-warning/20',
  'border-yellow-500': 'border-warning',
  
  // 红色系
  'text-red-600': 'text-destructive',
  'text-red-700': 'text-destructive',
  'text-red-800': 'text-destructive',
  'bg-red-50': 'bg-destructive/5',
  'bg-red-100': 'bg-destructive/10',
  'border-red-200': 'border-destructive/20',
  'border-red-500': 'border-destructive',
  
  // 紫色系
  'text-purple-600': 'text-secondary',
  'text-purple-700': 'text-secondary',
  'text-purple-800': 'text-secondary',
  'bg-purple-50': 'bg-secondary/5',
  'bg-purple-100': 'bg-secondary/10',
  'border-purple-200': 'border-secondary/20',
  'border-purple-500': 'border-secondary',
  
  // 灰色系
  'text-gray-500': 'text-muted-foreground',
  'text-gray-600': 'text-muted-foreground',
  'text-gray-700': 'text-foreground',
  'text-gray-800': 'text-foreground',
  'bg-gray-50': 'bg-muted/50',
  'bg-gray-100': 'bg-muted',
  'border-gray-200': 'border-muted',
  'border-gray-300': 'border-border',
};

// 获取洞察类别颜色
export const getInsightColor = (category: string): string => {
  switch (category) {
    case 'positive':
      return 'border-success/20 bg-success/5 text-success';
    case 'warning':
      return 'border-warning/20 bg-warning/5 text-warning';
    case 'opportunity':
      return 'border-primary/20 bg-primary/5 text-primary';
    case 'error':
    case 'negative':
      return 'border-destructive/20 bg-destructive/5 text-destructive';
    default:
      return 'border-muted bg-muted/50 text-muted-foreground';
  }
};

// 获取能量等级颜色
export const getEnergyLevelColor = (level: number): string => {
  if (level >= 4) return 'text-success bg-success/10';
  if (level >= 3) return 'text-primary bg-primary/10';
  if (level >= 2) return 'text-warning bg-warning/10';
  return 'text-destructive bg-destructive/10';
};

// 获取能量等级渐变颜色
export const getEnergyGradientColor = (level: number): string => {
  if (level >= 4) return 'bg-gradient-to-r from-success to-success/80';
  if (level >= 3) return 'bg-gradient-to-r from-primary to-primary/80';
  if (level >= 2) return 'bg-gradient-to-r from-warning to-warning/80';
  return 'bg-gradient-to-r from-destructive to-destructive/80';
};

// 获取任务类别颜色
export const getCategoryColor = (category: string): string => {
  const categoryColors: Record<string, string> = {
    'work': 'border-primary/20 bg-primary/5',
    'rest': 'border-success/20 bg-success/5',
    'personal': 'border-secondary/20 bg-secondary/5',
    'energy': 'border-warning/20 bg-warning/5',
    'social': 'border-accent/20 bg-accent/5',
    'health': 'border-success/20 bg-success/5',
    'learning': 'border-primary/20 bg-primary/5',
    'creative': 'border-secondary/20 bg-secondary/5',
  };
  
  return categoryColors[category] || 'border-muted bg-muted/50';
};

// 获取优先级颜色
export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
    case 'urgent':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'medium':
    case 'normal':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'low':
      return 'bg-success/10 text-success border-success/20';
    default:
      return 'bg-muted text-muted-foreground border-muted';
  }
};

// 获取难度等级颜色
export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy':
      return 'text-success';
    case 'medium':
      return 'text-warning';
    case 'hard':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
};

// 获取证据等级颜色
export const getEvidenceColor = (level: string): string => {
  switch (level) {
    case '高':
      return 'bg-success/10 text-success';
    case '较高':
      return 'bg-primary/10 text-primary';
    case '中等':
      return 'bg-warning/10 text-warning';
    case '理论支持':
      return 'bg-secondary/10 text-secondary';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

// 获取图表颜色
export const getChartColor = (index: number): string => {
  const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  return chartColors[index % chartColors.length];
};

// 获取能量图表颜色
export const getEnergyChartColor = (type: string): string => {
  switch (type) {
    case 'physical':
      return 'hsl(var(--chart-energy-physical))';
    case 'mental':
      return 'hsl(var(--chart-energy-mental))';
    case 'spiritual':
      return 'hsl(var(--chart-energy-spiritual))';
    case 'balance':
      return 'hsl(var(--chart-energy-balance))';
    default:
      return 'hsl(var(--chart-1))';
  }
};

// 获取趋势图表颜色
export const getTrendChartColor = (trend: string): string => {
  switch (trend) {
    case 'up':
    case 'rising':
    case 'positive':
      return 'hsl(var(--chart-trend-up))';
    case 'down':
    case 'declining':
    case 'negative':
      return 'hsl(var(--chart-trend-down))';
    case 'stable':
    case 'neutral':
      return 'hsl(var(--chart-trend-stable))';
    default:
      return 'hsl(var(--chart-1))';
  }
};

// 获取数据可视化颜色组合
export const getDataVisualizationColors = (): string[] => {
  return [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    'hsl(var(--success))',
    'hsl(var(--warning))',
  ];
};

// 获取水晶颜色映射
export const getCrystalColor = (crystalName: string): string => {
  const crystalColors: Record<string, string> = {
    '紫水晶': 'hsl(var(--secondary))',
    '黄水晶': 'hsl(var(--warning))',
    '月光石': 'hsl(var(--muted-foreground))',
    '红碧玺': 'hsl(var(--destructive))',
    '粉水晶': 'hsl(var(--accent))',
    '绿幽灵': 'hsl(var(--success))',
    '蓝宝石': 'hsl(var(--primary))',
    '白水晶': 'hsl(var(--background))',
    '黑曜石': 'hsl(var(--foreground))',
  };

  return crystalColors[crystalName] || 'hsl(var(--muted))';
};

// 获取能量类型颜色
export const getEnergyTypeColor = (type: string): string => {
  const energyColors: Record<string, string> = {
    'physical': 'hsl(var(--destructive))',
    'mental': 'hsl(var(--primary))',
    'emotional': 'hsl(var(--accent))',
    'spiritual': 'hsl(var(--secondary))',
    'creative': 'hsl(var(--warning))',
    'social': 'hsl(var(--success))',
  };

  return energyColors[type] || 'hsl(var(--muted))';
};

// 获取能量影响图标颜色
export const getEnergyImpactColor = (impact: string): string => {
  switch (impact) {
    case 'high':
      return 'text-warning';
    case 'medium':
      return 'text-primary';
    case 'low':
      return 'text-success';
    case 'restorative':
      return 'text-secondary';
    default:
      return 'text-muted-foreground';
  }
};

// 获取时间段能量颜色
export const getTimeEnergyColor = (timeOfDay: string): string => {
  switch (timeOfDay) {
    case 'morning':
      return 'bg-gradient-to-r from-warning to-warning/80';
    case 'afternoon':
      return 'bg-gradient-to-r from-primary to-primary/80';
    case 'evening':
      return 'bg-gradient-to-r from-secondary to-secondary/80';
    case 'night':
      return 'bg-gradient-to-r from-muted to-muted/80';
    default:
      return 'bg-gradient-to-r from-muted to-muted/80';
  }
};

// 脉轮颜色系统映射
export const chakraColorSystem = {
  root: {
    light: 'hsl(var(--destructive))',
    dark: 'hsl(var(--destructive) / 0.8)',
    bg: 'hsl(var(--destructive) / 0.1)',
    border: 'hsl(var(--destructive) / 0.2)'
  },
  sacral: {
    light: 'hsl(var(--warning))',
    dark: 'hsl(var(--warning) / 0.8)',
    bg: 'hsl(var(--warning) / 0.1)',
    border: 'hsl(var(--warning) / 0.2)'
  },
  solarPlexus: {
    light: 'hsl(var(--warning) / 1.2)',
    dark: 'hsl(var(--warning))',
    bg: 'hsl(var(--warning) / 0.1)',
    border: 'hsl(var(--warning) / 0.2)'
  },
  heart: {
    light: 'hsl(var(--success))',
    dark: 'hsl(var(--success) / 0.8)',
    bg: 'hsl(var(--success) / 0.1)',
    border: 'hsl(var(--success) / 0.2)'
  },
  throat: {
    light: 'hsl(var(--primary))',
    dark: 'hsl(var(--primary) / 0.8)',
    bg: 'hsl(var(--primary) / 0.1)',
    border: 'hsl(var(--primary) / 0.2)'
  },
  thirdEye: {
    light: 'hsl(var(--secondary))',
    dark: 'hsl(var(--secondary) / 0.8)',
    bg: 'hsl(var(--secondary) / 0.1)',
    border: 'hsl(var(--secondary) / 0.2)'
  },
  crown: {
    light: 'hsl(var(--secondary) / 1.2)',
    dark: 'hsl(var(--secondary))',
    bg: 'hsl(var(--secondary) / 0.1)',
    border: 'hsl(var(--secondary) / 0.2)'
  }
};

// 元素颜色系统映射
export const elementColorSystem = {
  fire: {
    light: 'hsl(var(--destructive))',
    dark: 'hsl(var(--destructive) / 0.8)',
    bg: 'hsl(var(--destructive) / 0.1)',
    border: 'hsl(var(--destructive) / 0.2)'
  },
  water: {
    light: 'hsl(var(--primary))',
    dark: 'hsl(var(--primary) / 0.8)',
    bg: 'hsl(var(--primary) / 0.1)',
    border: 'hsl(var(--primary) / 0.2)'
  },
  earth: {
    light: 'hsl(var(--success))',
    dark: 'hsl(var(--success) / 0.8)',
    bg: 'hsl(var(--success) / 0.1)',
    border: 'hsl(var(--success) / 0.2)'
  },
  air: {
    light: 'hsl(var(--warning))',
    dark: 'hsl(var(--warning) / 0.8)',
    bg: 'hsl(var(--warning) / 0.1)',
    border: 'hsl(var(--warning) / 0.2)'
  }
};

// 替换硬编码颜色类名的工具函数
export const replaceHardcodedColors = (className: string): string => {
  let result = className;

  Object.entries(hardcodedColorReplacements).forEach(([oldColor, newColor]) => {
    result = result.replace(new RegExp(`\\b${oldColor}\\b`, 'g'), newColor);
  });

  return result;
};

// 获取主题感知的阴影颜色
export const getThemeShadowColor = (type: 'crystal' | 'energy' | 'primary' | 'secondary' = 'primary'): string => {
  switch (type) {
    case 'crystal':
      return 'hsl(var(--secondary) / 0.15)';
    case 'energy':
      return 'hsl(var(--success) / 0.15)';
    case 'primary':
      return 'hsl(var(--primary) / 0.15)';
    case 'secondary':
      return 'hsl(var(--secondary) / 0.15)';
    default:
      return 'hsl(var(--primary) / 0.15)';
  }
};

// 获取文本阴影颜色
export const getTextShadowColor = (intensity: 'light' | 'medium' | 'strong' = 'medium'): string => {
  switch (intensity) {
    case 'light':
      return 'hsl(var(--foreground) / 0.2)';
    case 'medium':
      return 'hsl(var(--foreground) / 0.3)';
    case 'strong':
      return 'hsl(var(--foreground) / 0.5)';
    default:
      return 'hsl(var(--foreground) / 0.3)';
  }
};

// 获取边框颜色
export const getBorderColor = (variant: 'default' | 'muted' | 'accent' = 'default'): string => {
  switch (variant) {
    case 'muted':
      return 'hsl(var(--muted) / 0.5)';
    case 'accent':
      return 'hsl(var(--accent) / 0.3)';
    default:
      return 'hsl(var(--border))';
  }
};

// 获取背景颜色变体
export const getBackgroundVariant = (variant: 'card' | 'muted' | 'accent' | 'primary' = 'card'): string => {
  switch (variant) {
    case 'muted':
      return 'hsl(var(--muted) / 0.5)';
    case 'accent':
      return 'hsl(var(--accent) / 0.1)';
    case 'primary':
      return 'hsl(var(--primary) / 0.05)';
    default:
      return 'hsl(var(--card))';
  }
};

// 获取渐变背景
export const getGradientBackground = (type: 'primary' | 'secondary' | 'warm' | 'cool' = 'primary'): string => {
  switch (type) {
    case 'secondary':
      return 'linear-gradient(to bottom right, hsl(var(--secondary) / 0.05), hsl(var(--accent) / 0.05))';
    case 'warm':
      return 'linear-gradient(to bottom right, hsl(var(--warning) / 0.05), hsl(var(--accent) / 0.05))';
    case 'cool':
      return 'linear-gradient(to bottom right, hsl(var(--primary) / 0.05), hsl(var(--secondary) / 0.05))';
    default:
      return 'linear-gradient(to bottom right, hsl(var(--primary) / 0.05), hsl(var(--secondary) / 0.05))';
  }
};

// 获取状态指示器颜色
export const getStatusColor = (status: 'online' | 'offline' | 'busy' | 'away' = 'offline'): string => {
  switch (status) {
    case 'online':
      return 'hsl(var(--success))';
    case 'busy':
      return 'hsl(var(--destructive))';
    case 'away':
      return 'hsl(var(--warning))';
    default:
      return 'hsl(var(--muted-foreground))';
  }
};

// 获取进度条颜色
export const getProgressColor = (progress: number): string => {
  if (progress >= 80) return 'hsl(var(--success))';
  if (progress >= 60) return 'hsl(var(--primary))';
  if (progress >= 40) return 'hsl(var(--warning))';
  return 'hsl(var(--destructive))';
};

// 获取评分颜色
export const getRatingColor = (rating: number, maxRating: number = 5): string => {
  const percentage = (rating / maxRating) * 100;
  if (percentage >= 80) return 'hsl(var(--success))';
  if (percentage >= 60) return 'hsl(var(--primary))';
  if (percentage >= 40) return 'hsl(var(--warning))';
  return 'hsl(var(--destructive))';
};
