/**
 * 硬编码颜色扫描工具
 * 用于检测和报告系统中剩余的硬编码颜色
 */

// 硬编码颜色模式
const HARDCODED_COLOR_PATTERNS = [
  // 十六进制颜色
  /#[0-9a-fA-F]{3,8}/g,
  // RGB/RGBA颜色
  /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+)?\s*\)/g,
  // HSL/HSLA颜色
  /hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+)?\s*\)/g,
  // Tailwind颜色类名
  /(?:text|bg|border|ring|shadow|from|to|via)-(?:red|blue|green|yellow|purple|pink|indigo|gray|grey|orange|teal|cyan|lime|emerald|violet|fuchsia|rose|amber|sky|slate|zinc|neutral|stone)-[0-9]{2,3}/g,
  // 命名颜色
  /\b(?:red|blue|green|yellow|purple|pink|orange|black|white|gray|grey|brown|cyan|magenta|lime|olive|navy|maroon|teal|silver|gold)\b/g
];

// 需要排除的文件和目录
const EXCLUDED_PATHS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  'coverage',
  'public/icons',
  'public/images',
  'src/lib/color-system.ts', // 颜色系统文件本身
  'src/lib/hardcoded-color-scanner.ts' // 扫描工具本身
];

// 需要排除的合法颜色使用
const EXCLUDED_PATTERNS = [
  // CSS变量
  /hsl\(var\(--[^)]+\)[^)]*\)/g,
  // 系统颜色类名
  /(?:text|bg|border)-(?:primary|secondary|accent|success|warning|destructive|muted|foreground|background|card)/g,
  // 透明度修饰符
  /\/[0-9]+/g,
  // 注释中的颜色
  /\/\*[\s\S]*?\*\//g,
  /\/\/.*$/gm
];

export interface ColorIssue {
  file: string;
  line: number;
  column: number;
  match: string;
  context: string;
  severity: 'high' | 'medium' | 'low';
  suggestion?: string;
}

export interface ScanResult {
  totalFiles: number;
  filesWithIssues: number;
  totalIssues: number;
  issues: ColorIssue[];
  summary: {
    high: number;
    medium: number;
    low: number;
  };
}

/**
 * 扫描文本中的硬编码颜色
 */
export function scanTextForHardcodedColors(
  text: string,
  filePath: string
): ColorIssue[] {
  const issues: ColorIssue[] = [];
  const lines = text.split('\n');

  // 移除排除的模式
  let cleanText = text;
  EXCLUDED_PATTERNS.forEach(pattern => {
    cleanText = cleanText.replace(pattern, '');
  });

  HARDCODED_COLOR_PATTERNS.forEach(pattern => {
    let match;
    while ((match = pattern.exec(cleanText)) !== null) {
      const matchText = match[0];
      const matchIndex = match.index;
      
      // 找到匹配的行号和列号
      let lineNumber = 1;
      let columnNumber = 1;
      let currentIndex = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const lineLength = lines[i].length + 1; // +1 for newline
        if (currentIndex + lineLength > matchIndex) {
          lineNumber = i + 1;
          columnNumber = matchIndex - currentIndex + 1;
          break;
        }
        currentIndex += lineLength;
      }

      // 获取上下文
      const contextStart = Math.max(0, lineNumber - 2);
      const contextEnd = Math.min(lines.length, lineNumber + 1);
      const context = lines.slice(contextStart, contextEnd).join('\n');

      // 确定严重程度
      let severity: 'high' | 'medium' | 'low' = 'medium';
      if (matchText.includes('#') || matchText.includes('rgb')) {
        severity = 'high';
      } else if (matchText.includes('hsl(') && !matchText.includes('var(')) {
        severity = 'high';
      } else if (matchText.match(/-(red|blue|green|yellow|purple|pink)-[0-9]/)) {
        severity = 'medium';
      } else {
        severity = 'low';
      }

      // 生成建议
      const suggestion = generateSuggestion(matchText);

      issues.push({
        file: filePath,
        line: lineNumber,
        column: columnNumber,
        match: matchText,
        context,
        severity,
        suggestion
      });
    }
  });

  return issues;
}

/**
 * 生成修复建议
 */
function generateSuggestion(colorMatch: string): string {
  if (colorMatch.startsWith('#')) {
    return '使用 hsl(var(--primary)) 等CSS变量替代十六进制颜色';
  }
  
  if (colorMatch.startsWith('rgb')) {
    return '使用 hsl(var(--primary)) 等CSS变量替代RGB颜色';
  }
  
  if (colorMatch.includes('text-red') || colorMatch.includes('bg-red')) {
    return '使用 text-destructive 或 bg-destructive/10 替代红色类名';
  }
  
  if (colorMatch.includes('text-blue') || colorMatch.includes('bg-blue')) {
    return '使用 text-primary 或 bg-primary/10 替代蓝色类名';
  }
  
  if (colorMatch.includes('text-green') || colorMatch.includes('bg-green')) {
    return '使用 text-success 或 bg-success/10 替代绿色类名';
  }
  
  if (colorMatch.includes('text-yellow') || colorMatch.includes('bg-yellow')) {
    return '使用 text-warning 或 bg-warning/10 替代黄色类名';
  }
  
  if (colorMatch.includes('text-purple') || colorMatch.includes('bg-purple')) {
    return '使用 text-secondary 或 bg-secondary/10 替代紫色类名';
  }
  
  return '考虑使用统一的颜色系统变量';
}

/**
 * 生成扫描报告
 */
export function generateScanReport(result: ScanResult): string {
  const { totalFiles, filesWithIssues, totalIssues, issues, summary } = result;
  
  let report = `# 硬编码颜色扫描报告\n\n`;
  report += `## 概览\n`;
  report += `- 扫描文件总数: ${totalFiles}\n`;
  report += `- 存在问题的文件: ${filesWithIssues}\n`;
  report += `- 问题总数: ${totalIssues}\n\n`;
  
  report += `## 问题分布\n`;
  report += `- 高优先级: ${summary.high}\n`;
  report += `- 中优先级: ${summary.medium}\n`;
  report += `- 低优先级: ${summary.low}\n\n`;
  
  if (issues.length > 0) {
    report += `## 详细问题列表\n\n`;
    
    // 按文件分组
    const issuesByFile = issues.reduce((acc, issue) => {
      if (!acc[issue.file]) {
        acc[issue.file] = [];
      }
      acc[issue.file].push(issue);
      return acc;
    }, {} as Record<string, ColorIssue[]>);
    
    Object.entries(issuesByFile).forEach(([file, fileIssues]) => {
      report += `### ${file}\n\n`;
      
      fileIssues.forEach((issue, index) => {
        report += `${index + 1}. **${issue.severity.toUpperCase()}** - 第${issue.line}行:${issue.column}列\n`;
        report += `   - 问题: \`${issue.match}\`\n`;
        if (issue.suggestion) {
          report += `   - 建议: ${issue.suggestion}\n`;
        }
        report += `\n`;
      });
    });
  }
  
  return report;
}

/**
 * 检查文件是否应该被排除
 */
export function shouldExcludeFile(filePath: string): boolean {
  return EXCLUDED_PATHS.some(excluded => filePath.includes(excluded));
}
