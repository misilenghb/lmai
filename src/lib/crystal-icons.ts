// 统一的水晶图标系统配置
// 使用几何符号和Unicode字符，符合系统设计风格

export interface CrystalIconData {
  symbol: string;
  color: string;
  bgColor: string;
}

// 水晶图标映射 - 使用几何符号和系统主题色
export const CRYSTAL_ICONS: Record<string, CrystalIconData> = {
  // 石英族 - 使用菱形系列
  'Amethyst': { symbol: '◆', color: 'text-primary', bgColor: 'bg-primary/10' },
  'amethyst': { symbol: '◆', color: 'text-primary', bgColor: 'bg-primary/10' },
  'RoseQuartz': { symbol: '♦', color: 'text-secondary', bgColor: 'bg-secondary/10' },
  'rose_quartz': { symbol: '♦', color: 'text-secondary', bgColor: 'bg-secondary/10' },
  'ClearQuartz': { symbol: '◇', color: 'text-muted-foreground', bgColor: 'bg-muted/50' },
  'clear_quartz': { symbol: '◇', color: 'text-muted-foreground', bgColor: 'bg-muted/50' },
  'SmokyQuartz': { symbol: '◈', color: 'text-muted-foreground', bgColor: 'bg-muted' },
  'Citrine': { symbol: '◉', color: 'text-accent', bgColor: 'bg-accent/10' },
  'citrine': { symbol: '◉', color: 'text-accent', bgColor: 'bg-accent/10' },
  
  // 保护石 - 使用圆形和多边形
  'BlackTourmaline': { symbol: '●', color: 'text-foreground', bgColor: 'bg-muted' },
  'black_obsidian': { symbol: '●', color: 'text-foreground', bgColor: 'bg-muted' },
  'Obsidian': { symbol: '⬢', color: 'text-foreground', bgColor: 'bg-muted' },
  'Hematite': { symbol: '⬣', color: 'text-muted-foreground', bgColor: 'bg-muted/70' },
  'Onyx': { symbol: '⬛', color: 'text-foreground', bgColor: 'bg-muted' },
  
  // 海洋系 - 使用半圆和弧形
  'Aquamarine': { symbol: '◐', color: 'text-accent', bgColor: 'bg-accent/10' },
  'aquamarine': { symbol: '◐', color: 'text-accent', bgColor: 'bg-accent/10' },
  'Amazonite': { symbol: '◑', color: 'text-primary', bgColor: 'bg-primary/10' },
  'BlueLaceAgate': { symbol: '◒', color: 'text-secondary', bgColor: 'bg-secondary/10' },
  'Celestite': { symbol: '◓', color: 'text-accent', bgColor: 'bg-accent/10' },
  'Sodalite': { symbol: '◔', color: 'text-primary', bgColor: 'bg-primary/10' },
  'LapisLazuli': { symbol: '◕', color: 'text-primary', bgColor: 'bg-primary/10' },
  'Turquoise': { symbol: '◖', color: 'text-accent', bgColor: 'bg-accent/10' },
  
  // 绿色系 - 使用各种几何形状
  'Jade': { symbol: '◗', color: 'text-primary', bgColor: 'bg-primary/10' },
  'Malachite': { symbol: '◘', color: 'text-primary', bgColor: 'bg-primary/10' },
  'Peridot': { symbol: '◙', color: 'text-accent', bgColor: 'bg-accent/10' },
  'Unakite': { symbol: '◚', color: 'text-primary', bgColor: 'bg-primary/10' },
  'Chrysocolla': { symbol: '◛', color: 'text-accent', bgColor: 'bg-accent/10' },
  'green_aventurine': { symbol: '◉', color: 'text-primary', bgColor: 'bg-primary/10' },
  
  // 火系 - 使用弧形和特殊符号
  'Carnelian': { symbol: '◜', color: 'text-accent', bgColor: 'bg-accent/10' },
  'Garnet': { symbol: '◝', color: 'text-destructive', bgColor: 'bg-destructive/10' },
  'RedJasper': { symbol: '◞', color: 'text-destructive', bgColor: 'bg-destructive/10' },
  'Sunstone': { symbol: '◟', color: 'text-accent', bgColor: 'bg-accent/10' },
  'Bloodstone': { symbol: '◠', color: 'text-destructive', bgColor: 'bg-destructive/10' },
  'bloodstone': { symbol: '◠', color: 'text-destructive', bgColor: 'bg-destructive/10' },
  
  // 特殊系 - 使用独特符号
  'Fluorite': { symbol: '◡', color: 'text-primary', bgColor: 'bg-primary/10' },
  'Labradorite': { symbol: '◢', color: 'text-primary', bgColor: 'bg-primary/10' },
  'labradorite': { symbol: '◢', color: 'text-primary', bgColor: 'bg-primary/10' },
  'Moonstone': { symbol: '◣', color: 'text-muted-foreground', bgColor: 'bg-muted/50' },
  'Pyrite': { symbol: '◤', color: 'text-accent', bgColor: 'bg-accent/10' },
  'Selenite': { symbol: '◥', color: 'text-muted-foreground', bgColor: 'bg-muted/30' },
  'TigerEye': { symbol: '◦', color: 'text-accent', bgColor: 'bg-accent/10' },
  'Angelite': { symbol: '◧', color: 'text-secondary', bgColor: 'bg-secondary/10' },
  'angelite': { symbol: '◧', color: 'text-secondary', bgColor: 'bg-secondary/10' },
  'Auralite23': { symbol: '◨', color: 'text-primary', bgColor: 'bg-primary/10' },
  'BotswanaAgate': { symbol: '◩', color: 'text-muted-foreground', bgColor: 'bg-muted/50' },
  'Prehnite': { symbol: '◪', color: 'text-primary', bgColor: 'bg-primary/10' },
  'Moldavite': { symbol: '◫', color: 'text-primary', bgColor: 'bg-primary/10' },
  'Lepidolite': { symbol: '◬', color: 'text-secondary', bgColor: 'bg-secondary/10' },
  'Kyanite': { symbol: '◭', color: 'text-primary', bgColor: 'bg-primary/10' },
  'Iolite': { symbol: '◮', color: 'text-primary', bgColor: 'bg-primary/10' },
  'Howlite': { symbol: '◯', color: 'text-muted-foreground', bgColor: 'bg-muted/30' },
  
  // 默认图标
  'default': { symbol: '◇', color: 'text-muted-foreground', bgColor: 'bg-muted/50' }
};

// 获取水晶图标数据的辅助函数
export function getCrystalIcon(crystalKey: string): CrystalIconData {
  return CRYSTAL_ICONS[crystalKey] || CRYSTAL_ICONS.default;
}

// 获取水晶图标符号
export function getCrystalSymbol(crystalKey: string): string {
  return getCrystalIcon(crystalKey).symbol;
}

// 获取水晶图标颜色
export function getCrystalColor(crystalKey: string): string {
  return getCrystalIcon(crystalKey).color;
}

// 获取水晶背景颜色
export function getCrystalBgColor(crystalKey: string): string {
  return getCrystalIcon(crystalKey).bgColor;
}

// 水晶图标的CSS类名生成器
export function generateCrystalIconClasses(crystalKey: string, size: 'sm' | 'md' | 'lg' = 'md'): string {
  const iconData = getCrystalIcon(crystalKey);
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-3xl'
  };
  
  return `${iconData.color} ${sizeClasses[size]}`;
}

// 水晶背景容器的CSS类名生成器
export function generateCrystalBgClasses(crystalKey: string, size: 'sm' | 'md' | 'lg' = 'md'): string {
  const iconData = getCrystalIcon(crystalKey);
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  return `${iconData.bgColor} ${sizeClasses[size]} rounded-full flex items-center justify-center`;
}
