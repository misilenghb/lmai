// 水晶饰品AI绘画提示词系统
export interface CrystalPromptData {
  crystalTypes: Record<string, CrystalTypeData>;
  jewelryTypes: Record<string, JewelryTypeData>;
  styles: Record<string, StyleData>;
  settings: Record<string, SettingData>;
  artStyles: Record<string, ArtStyleData>;
  inclusions: Record<string, InclusionData>;
  metalTypes: Record<string, MetalData>;
  culturalStyles: Record<string, CulturalStyleData>;
  compositions: Record<string, CompositionData>;
  qualityModifiers: string[];
  lightingEffects: string[];
  backgroundOptions: string[];
  negativePrompts: string[];
  crystalShapes: string[]; // 添加水晶形状数组
  transparencyLevels: string[]; // 添加透明度级别数组
  qualityLevels: string[]; // 添加品质级别数组
  renderingLevels: string[]; // 添加渲染级别数组
}

export interface CrystalTypeData {
  name: string;
  chineseName: string;
  colors: string[];
  properties: string[];
  commonCuts: string[];
  promptKeywords: string[];
}

export interface JewelryTypeData {
  name: string;
  chineseName: string;
  commonSettings: string[];
  typicalSizes: string[];
  promptModifiers: string[];
}

export interface StyleData {
  name: string;
  chineseName: string;
  keywords: string[];
  qualityTerms: string[];
}

export interface SettingData {
  name: string;
  chineseName: string;
  description: string;
  promptTerms: string[];
}

export interface ArtStyleData {
  name: string;
  chineseName: string;
  description?: string; // 添加description属性
  medium: string;
  techniques: string[];
  qualityTerms: string[];
  colorHandling: string[];
}

export interface InclusionData {
  name: string;
  chineseName: string;
  colors: string[];
  patterns: string[];
  promptTerms: string[];
}

export interface MetalData {
  name: string;
  chineseName: string;
  finishes: string[];
  promptTerms: string[];
}

export interface CulturalStyleData {
  name: string;
  chineseName: string;
  description?: string; // 添加description属性
  characteristics: string[];
  promptTerms: string[];
}

export interface CompositionData {
  name: string;
  chineseName: string;
  principles: string[];
  promptTerms: string[];
}

export const crystalPromptSystem: CrystalPromptData = {
  crystalTypes: {
    'Amethyst': {
      name: 'Amethyst',
      chineseName: '紫水晶',
      colors: ['深紫色', '薰衣草色', '紫罗兰色', '皇家紫', '浅紫水晶色'],
      properties: ['translucent', 'crystalline', 'faceted', 'lustrous'],
      commonCuts: ['oval', 'round', 'emerald cut', 'pear', 'cushion'],
      promptKeywords: ['amethyst crystal', 'purple gemstone', 'violet stone', 'crystalline structure']
    },
    'RoseQuartz': {
      name: 'Rose Quartz',
      chineseName: '粉晶',
      colors: ['柔粉色', '玫瑰粉', '淡粉色', '腮红色', '灰玫瑰色'],
      properties: ['translucent', 'smooth', 'milky', 'gentle glow'],
      commonCuts: ['cabochon', 'round', 'heart', 'oval'],
      promptKeywords: ['rose quartz', 'pink crystal', 'soft pink stone', 'love stone']
    },
    'ClearQuartz': {
      name: 'Clear Quartz',
      chineseName: '白水晶',
      colors: ['水晶般透明', '透明', '冰白色', '纯净'],
      properties: ['transparent', 'brilliant', 'refractive', 'prismatic'],
      commonCuts: ['brilliant', 'emerald', 'round', 'princess'],
      promptKeywords: ['clear quartz', 'crystal clear', 'transparent gemstone', 'prismatic crystal']
    },
    'Citrine': {
      name: 'Citrine',
      chineseName: '黄水晶',
      colors: ['金黄色', '琥珀色', '蜂蜜色', '香槟色', '柠檬黄'],
      properties: ['transparent', 'warm glow', 'brilliant', 'sunny'],
      commonCuts: ['emerald', 'oval', 'round', 'cushion'],
      promptKeywords: ['citrine crystal', 'golden gemstone', 'yellow crystal', 'sunny stone']
    },
    'Aquamarine': {
      name: 'Aquamarine',
      chineseName: '海蓝宝',
      colors: ['海蓝色', '水蓝色', '淡蓝色', '海洋蓝', '天空蓝'],
      properties: ['transparent', 'cool tone', 'brilliant', 'oceanic'],
      commonCuts: ['emerald', 'oval', 'round', 'pear'],
      promptKeywords: ['aquamarine', 'sea blue crystal', 'ocean gemstone', 'blue beryl']
    },
    'GreenPhantom': {
      name: 'Green Phantom',
      chineseName: '绿幽灵',
      colors: ['森林绿', '祖母绿色', '薄荷绿', '鼠尾草绿'],
      properties: ['phantom inclusions', 'layered', 'mystical', 'translucent'],
      commonCuts: ['round', 'oval', 'cabochon', 'freeform'],
      promptKeywords: ['green phantom', 'phantom quartz', 'green inclusions', 'layered crystal']
    },
    'SmokyQuartz': {
      name: 'Smoky Quartz',
      chineseName: '茶晶',
      colors: ['烟熏棕', '干邑色', '巧克力色', '琥珀棕'],
      properties: ['translucent', 'grounding', 'protective', 'earthy'],
      commonCuts: ['emerald', 'round', 'oval', 'cushion'],
      promptKeywords: ['smoky quartz', 'brown crystal', 'earthy gemstone', 'grounding stone']
    },
    'Rutilated': {
      name: 'Rutilated Quartz',
      chineseName: '金发晶',
      colors: ['金色金红石', '银色金红石', '铜色金红石', '红色金红石'],
      properties: ['needle inclusions', 'brilliant', 'energetic', 'powerful'],
      commonCuts: ['round', 'oval', 'cabochon', 'freeform'],
      promptKeywords: ['rutilated quartz', 'golden hair crystal', 'needle inclusions', 'powerful stone']
    },
    'Tourmaline': {
      name: 'Tourmaline',
      chineseName: '碧玺',
      colors: ['pink tourmaline', 'green tourmaline', 'blue tourmaline', 'watermelon tourmaline'],
      properties: ['pleochroic', 'brilliant', 'colorful', 'energetic'],
      commonCuts: ['emerald', 'oval', 'round', 'cushion'],
      promptKeywords: ['tourmaline', 'colorful gemstone', 'brilliant crystal', 'rainbow stone']
    },
    'Moonstone': {
      name: 'Moonstone',
      chineseName: '月光石',
      colors: ['white moonstone', 'gray moonstone', 'peach moonstone', 'rainbow moonstone'],
      properties: ['adularescence', 'mystical', 'feminine', 'glowing'],
      commonCuts: ['cabochon', 'oval', 'round', 'cushion'],
      promptKeywords: ['moonstone', 'mystical glow', 'lunar stone', 'feminine energy']
    },
    'Obsidian': {
      name: 'Obsidian',
      chineseName: '黑曜石',
      colors: ['black obsidian', 'rainbow obsidian', 'snowflake obsidian', 'mahogany obsidian'],
      properties: ['volcanic glass', 'protective', 'grounding', 'reflective'],
      commonCuts: ['cabochon', 'sphere', 'freeform', 'carved'],
      promptKeywords: ['obsidian', 'volcanic glass', 'protective stone', 'black crystal']
    },
    'Labradorite': {
      name: 'Labradorite',
      chineseName: '拉长石',
      colors: ['blue flash', 'green flash', 'golden flash', 'rainbow flash'],
      properties: ['labradorescence', 'mystical', 'transformative', 'iridescent'],
      commonCuts: ['cabochon', 'freeform', 'oval', 'round'],
      promptKeywords: ['labradorite', 'flash stone', 'iridescent crystal', 'mystical glow']
    },
    'Fluorite': {
      name: 'Fluorite',
      chineseName: '萤石',
      colors: ['purple fluorite', 'green fluorite', 'blue fluorite', 'rainbow fluorite'],
      properties: ['fluorescent', 'transparent', 'cubic crystals', 'colorful'],
      commonCuts: ['octahedral', 'cubic', 'round', 'freeform'],
      promptKeywords: ['fluorite', 'fluorescent crystal', 'rainbow stone', 'cubic crystal']
    },
    'TigerEye': {
      name: 'Tiger Eye',
      chineseName: '虎眼石',
      colors: ['golden tiger eye', 'red tiger eye', 'blue tiger eye', 'green tiger eye'],
      properties: ['chatoyancy', 'silky luster', 'protective', 'grounding'],
      commonCuts: ['cabochon', 'round', 'oval', 'carved'],
      promptKeywords: ['tiger eye', 'chatoyant stone', 'golden bands', 'protective crystal']
    },
    'Malachite': {
      name: 'Malachite',
      chineseName: '孔雀石',
      colors: ['bright green', 'forest green', 'emerald green', 'banded green'],
      properties: ['banded patterns', 'opaque', 'copper mineral', 'vibrant'],
      commonCuts: ['cabochon', 'carved', 'polished', 'freeform'],
      promptKeywords: ['malachite', 'green bands', 'copper stone', 'vibrant patterns']
    },
    'Turquoise': {
      name: 'Turquoise',
      chineseName: '绿松石',
      colors: ['sky blue', 'robin egg blue', 'green turquoise', 'matrix turquoise'],
      properties: ['opaque', 'waxy luster', 'sacred stone', 'protective'],
      commonCuts: ['cabochon', 'carved', 'nugget', 'inlay'],
      promptKeywords: ['turquoise', 'sky blue stone', 'sacred crystal', 'southwestern style']
    },
    'LapisLazuli': {
      name: 'Lapis Lazuli',
      chineseName: '青金石',
      colors: ['deep blue', 'royal blue', 'ultramarine', 'gold flecked'],
      properties: ['opaque', 'gold pyrite', 'royal stone', 'spiritual'],
      commonCuts: ['cabochon', 'carved', 'beads', 'inlay'],
      promptKeywords: ['lapis lazuli', 'royal blue stone', 'gold flecks', 'ancient wisdom']
    },
    'Amazonite': {
      name: 'Amazonite',
      chineseName: '天河石',
      colors: ['blue-green', 'mint green', 'turquoise blue', 'seafoam'],
      properties: ['translucent', 'soothing', 'calming', 'feldspar'],
      commonCuts: ['cabochon', 'round', 'oval', 'carved'],
      promptKeywords: ['amazonite', 'blue-green stone', 'calming crystal', 'seafoam color']
    },
    'Sunstone': {
      name: 'Sunstone',
      chineseName: '日光石',
      colors: ['golden sunstone', 'orange sunstone', 'red sunstone', 'rainbow sunstone'],
      properties: ['aventurescence', 'sparkling', 'feldspar', 'energetic'],
      commonCuts: ['cabochon', 'faceted', 'round', 'oval'],
      promptKeywords: ['sunstone', 'golden sparkle', 'aventurescent', 'solar energy']
    },
    'Ruby': {
      name: 'Ruby',
      chineseName: '红宝石',
      colors: ['pigeon blood red', 'deep red', 'pinkish red', 'purplish red'],
      properties: ['corundum', 'brilliant', 'precious', 'durable'],
      commonCuts: ['oval', 'round', 'cushion', 'emerald cut'],
      promptKeywords: ['ruby', 'red corundum', 'precious gemstone', 'pigeon blood']
    },
    'Sapphire': {
      name: 'Sapphire',
      chineseName: '蓝宝石',
      colors: ['royal blue', 'cornflower blue', 'padparadscha', 'yellow sapphire'],
      properties: ['corundum', 'brilliant', 'precious', 'durable'],
      commonCuts: ['oval', 'round', 'cushion', 'emerald cut'],
      promptKeywords: ['sapphire', 'blue corundum', 'precious gemstone', 'royal blue']
    },
    'Emerald': {
      name: 'Emerald',
      chineseName: '祖母绿',
      colors: ['vivid green', 'bluish green', 'yellowish green', 'deep green'],
      properties: ['beryl', 'brilliant', 'precious', 'included'],
      commonCuts: ['emerald cut', 'oval', 'round', 'cushion'],
      promptKeywords: ['emerald', 'green beryl', 'precious gemstone', 'vivid green']
    },
    'Tanzanite': {
      name: 'Tanzanite',
      chineseName: '坦桑石',
      colors: ['violet blue', 'purplish blue', 'deep blue', 'lavender'],
      properties: ['pleochroic', 'brilliant', 'rare', 'zoisite'],
      commonCuts: ['oval', 'cushion', 'round', 'emerald cut'],
      promptKeywords: ['tanzanite', 'violet blue', 'rare gemstone', 'pleochroic crystal']
    },
    'Paraiba': {
      name: 'Paraiba Tourmaline',
      chineseName: '帕拉伊巴碧玺',
      colors: ['neon blue', 'electric green', 'turquoise', 'mint green'],
      properties: ['copper bearing', 'neon glow', 'rare', 'brilliant'],
      commonCuts: ['oval', 'round', 'cushion', 'pear'],
      promptKeywords: ['paraiba tourmaline', 'neon blue', 'electric glow', 'copper tourmaline']
    },
    'Tsavorite': {
      name: 'Tsavorite Garnet',
      chineseName: '沙弗莱石榴石',
      colors: ['vivid green', 'emerald green', 'mint green', 'forest green'],
      properties: ['garnet', 'brilliant', 'clean', 'durable'],
      commonCuts: ['round', 'oval', 'cushion', 'emerald cut'],
      promptKeywords: ['tsavorite garnet', 'green garnet', 'brilliant green', 'clean crystal']
    },
    'Spinel': {
      name: 'Spinel',
      chineseName: '尖晶石',
      colors: ['red spinel', 'pink spinel', 'blue spinel', 'lavender spinel'],
      properties: ['brilliant', 'durable', 'single refractive', 'pure'],
      commonCuts: ['oval', 'round', 'cushion', 'octagonal'],
      promptKeywords: ['spinel', 'brilliant crystal', 'pure gemstone', 'single refractive']
    }
  },

  jewelryTypes: {
    'necklace': {
      name: 'necklace',
      chineseName: '项链',
      commonSettings: ['pendant', 'chain', 'choker', 'statement', 'layered'],
      typicalSizes: ['delicate', 'medium', 'bold', 'statement'],
      promptModifiers: ['elegant necklace', 'pendant jewelry', 'chain design', 'neck accessory']
    },
    'bracelet': {
      name: 'bracelet',
      chineseName: '手链',
      commonSettings: ['tennis', 'charm', 'bangle', 'cuff', 'beaded'],
      typicalSizes: ['delicate', 'medium', 'chunky', 'statement'],
      promptModifiers: ['elegant bracelet', 'wrist jewelry', 'arm accessory', 'beaded bracelet']
    },
    'beaded_bracelet': {
      name: 'beaded_bracelet',
      chineseName: '手串',
      commonSettings: ['round_beads', 'mixed_crystals', 'metal_spacers', 'elastic_string', 'prayer_beads'],
      typicalSizes: ['6mm', '8mm', '10mm', '12mm', '14mm'],
      promptModifiers: ['crystal bead bracelet', 'beaded wrist mala', 'gemstone prayer beads', 'round crystal bracelet', 'meditation bracelet']
    },
    'ring': {
      name: 'ring',
      chineseName: '戒指',
      commonSettings: ['solitaire', 'halo', 'three-stone', 'eternity', 'cluster'],
      typicalSizes: ['delicate', 'classic', 'bold', 'cocktail'],
      promptModifiers: ['elegant ring', 'finger jewelry', 'gemstone ring', 'statement ring']
    },
    'earrings': {
      name: 'earrings',
      chineseName: '耳环',
      commonSettings: ['stud', 'drop', 'hoop', 'chandelier', 'huggie'],
      typicalSizes: ['petite', 'medium', 'statement', 'dramatic'],
      promptModifiers: ['elegant earrings', 'ear jewelry', 'drop earrings', 'statement earrings']
    },
    'pendant': {
      name: 'pendant',
      chineseName: '吊坠',
      commonSettings: ['solitaire', 'cluster', 'geometric', 'organic'],
      typicalSizes: ['small', 'medium', 'large', 'statement'],
      promptModifiers: ['crystal pendant', 'hanging jewelry', 'neck pendant', 'decorative charm']
    },
    'brooch': {
      name: 'brooch',
      chineseName: '胸针',
      commonSettings: ['floral', 'geometric', 'animal', 'abstract'],
      typicalSizes: ['small', 'medium', 'large', 'oversized'],
      promptModifiers: ['crystal brooch', 'decorative pin', 'lapel jewelry', 'ornamental brooch']
    },
    'anklet': {
      name: 'anklet',
      chineseName: '脚链',
      commonSettings: ['chain', 'beaded', 'charm', 'delicate'],
      typicalSizes: ['delicate', 'medium', 'bold'],
      promptModifiers: ['crystal anklet', 'ankle jewelry', 'foot accessory', 'beach jewelry']
    },
    'hair_accessory': {
      name: 'hair accessory',
      chineseName: '发饰',
      commonSettings: ['hairpin', 'hair_clip', 'headband', 'hair_comb'],
      typicalSizes: ['small', 'medium', 'large', 'dramatic'],
      promptModifiers: ['crystal hair accessory', 'hair jewelry', 'decorative hairpin', 'bridal hair piece']
    }
  },

  styles: {
    'photorealistic': {
      name: 'photorealistic',
      chineseName: '写实风格',
      keywords: ['photorealistic', 'hyper-realistic', 'ultra-detailed', 'high-resolution'],
      qualityTerms: ['8K', 'professional photography', 'studio lighting', 'macro lens']
    },
    'luxury': {
      name: 'luxury',
      chineseName: '奢华风格',
      keywords: ['luxury', 'premium', 'high-end', 'sophisticated'],
      qualityTerms: ['elegant', 'refined', 'opulent', 'prestigious']
    },
    'minimalist': {
      name: 'minimalist',
      chineseName: '简约风格',
      keywords: ['minimalist', 'clean', 'simple', 'modern'],
      qualityTerms: ['sleek', 'contemporary', 'understated', 'refined']
    },
    'vintage': {
      name: 'vintage',
      chineseName: '复古风格',
      keywords: ['vintage', 'antique', 'classic', 'timeless'],
      qualityTerms: ['ornate', 'detailed', 'traditional', 'heritage']
    },
    'art_nouveau': {
      name: 'art nouveau',
      chineseName: '新艺术运动',
      keywords: ['art nouveau', 'organic forms', 'flowing lines', 'nature inspired'],
      qualityTerms: ['elegant curves', 'botanical motifs', 'artistic', 'decorative']
    },
    'art_deco': {
      name: 'art deco',
      chineseName: '装饰艺术',
      keywords: ['art deco', 'geometric', 'angular', 'streamlined'],
      qualityTerms: ['bold patterns', 'symmetrical', 'glamorous', 'modern luxury']
    },
    'victorian': {
      name: 'victorian',
      chineseName: '维多利亚风格',
      keywords: ['victorian', 'ornate', 'romantic', 'elaborate'],
      qualityTerms: ['intricate details', 'sentimental', 'formal', 'traditional']
    },
    'edwardian': {
      name: 'edwardian',
      chineseName: '爱德华风格',
      keywords: ['edwardian', 'delicate', 'feminine', 'lace-like'],
      qualityTerms: ['filigree work', 'platinum', 'refined elegance', 'light and airy']
    },
    'modernist': {
      name: 'modernist',
      chineseName: '现代主义',
      keywords: ['modernist', 'functional', 'geometric', 'abstract'],
      qualityTerms: ['clean lines', 'innovative', 'sculptural', 'contemporary']
    },
    'bohemian': {
      name: 'bohemian',
      chineseName: '波西米亚风格',
      keywords: ['bohemian', 'free-spirited', 'eclectic', 'artistic'],
      qualityTerms: ['unconventional', 'colorful', 'textured', 'handcrafted']
    },
    'baroque': {
      name: 'baroque',
      chineseName: '巴洛克风格',
      keywords: ['baroque', 'ornate', 'dramatic', 'opulent'],
      qualityTerms: ['elaborate details', 'curved forms', 'rich decoration', 'grandeur']
    },
    'rococo': {
      name: 'rococo',
      chineseName: '洛可可风格',
      keywords: ['rococo', 'delicate', 'ornamental', 'asymmetrical'],
      qualityTerms: ['pastel colors', 'shell motifs', 'floral patterns', 'elegant curves']
    },
    'neoclassical': {
      name: 'neoclassical',
      chineseName: '新古典主义',
      keywords: ['neoclassical', 'classical', 'symmetrical', 'refined'],
      qualityTerms: ['Greek motifs', 'Roman elements', 'balanced proportions', 'noble simplicity']
    },
    'romantic': {
      name: 'romantic',
      chineseName: '浪漫主义',
      keywords: ['romantic', 'emotional', 'nature-inspired', 'sentimental'],
      qualityTerms: ['flowing forms', 'organic shapes', 'expressive', 'passionate']
    },
    'gothic_revival': {
      name: 'gothic revival',
      chineseName: '哥特复兴风格',
      keywords: ['gothic revival', 'medieval', 'pointed arches', 'religious'],
      qualityTerms: ['cathedral style', 'stone-like', 'vertical emphasis', 'spiritual']
    },
    'renaissance': {
      name: 'renaissance',
      chineseName: '文艺复兴',
      keywords: ['renaissance', 'classical revival', 'humanistic', 'balanced'],
      qualityTerms: ['perfect proportions', 'mythological themes', 'artistic mastery', 'cultural refinement']
    },
    'surrealism': {
      name: 'surrealism',
      chineseName: '超现实主义',
      keywords: ['surrealism', 'dreamlike', 'fantastical', 'subconscious'],
      qualityTerms: ['impossible forms', 'dream imagery', 'psychological', 'avant-garde']
    },
    'cubism': {
      name: 'cubism',
      chineseName: '立体主义',
      keywords: ['cubism', 'geometric', 'fragmented', 'abstract'],
      qualityTerms: ['angular forms', 'multiple perspectives', 'deconstructed', 'revolutionary']
    },
    'expressionism': {
      name: 'expressionism',
      chineseName: '表现主义',
      keywords: ['expressionism', 'emotional', 'distorted', 'intense'],
      qualityTerms: ['bold colors', 'exaggerated forms', 'psychological depth', 'raw emotion']
    },
    'fauvism': {
      name: 'fauvism',
      chineseName: '野兽派',
      keywords: ['fauvism', 'wild colors', 'bold', 'primitive'],
      qualityTerms: ['vivid palette', 'spontaneous', 'expressive brushwork', 'color liberation']
    },
    'bauhaus': {
      name: 'bauhaus',
      chineseName: '包豪斯',
      keywords: ['bauhaus', 'functional', 'geometric', 'industrial'],
      qualityTerms: ['form follows function', 'clean geometry', 'mass production', 'modern materials']
    },
    'postmodern': {
      name: 'postmodern',
      chineseName: '后现代主义',
      keywords: ['postmodern', 'eclectic', 'ironic', 'pluralistic'],
      qualityTerms: ['mixed styles', 'cultural references', 'playful', 'deconstructive']
    },
    'futurism': {
      name: 'futurism',
      chineseName: '未来主义',
      keywords: ['futurism', 'dynamic', 'speed', 'technology'],
      qualityTerms: ['motion blur', 'mechanical forms', 'energy lines', 'progressive']
    },
    'organic_modern': {
      name: 'organic modern',
      chineseName: '有机现代',
      keywords: ['organic modern', 'natural forms', 'flowing', 'biomorphic'],
      qualityTerms: ['nature-inspired', 'smooth curves', 'ergonomic', 'sustainable']
    }
  },

  settings: {
    'prong': {
      name: 'prong setting',
      chineseName: '爪镶',
      description: '用金属爪固定宝石，最大化展示宝石',
      promptTerms: ['prong setting', 'claw setting', 'four prong', 'six prong', 'secure mounting']
    },
    'bezel': {
      name: 'bezel setting',
      chineseName: '包镶',
      description: '用金属边框完全包围宝石',
      promptTerms: ['bezel setting', 'rim setting', 'full bezel', 'protective mounting']
    },
    'pave': {
      name: 'pave setting',
      chineseName: '密镶',
      description: '密集镶嵌小宝石形成连续表面',
      promptTerms: ['pave setting', 'micro pave', 'diamond pave', 'continuous sparkle']
    },
    'channel': {
      name: 'channel setting',
      chineseName: '槽镶',
      description: '宝石镶嵌在金属槽中',
      promptTerms: ['channel setting', 'groove setting', 'flush mounting', 'smooth surface']
    },
    'tension': {
      name: 'tension setting',
      chineseName: '张力镶嵌',
      description: '利用金属张力固定宝石',
      promptTerms: ['tension setting', 'pressure mounting', 'floating stone', 'modern design']
    },
    'invisible': {
      name: 'invisible setting',
      chineseName: '隐形镶嵌',
      description: '看不见金属固定结构的镶嵌',
      promptTerms: ['invisible setting', 'mystery setting', 'seamless mounting', 'continuous surface']
    },
    'cluster': {
      name: 'cluster setting',
      chineseName: '群镶',
      description: '多颗宝石聚集镶嵌',
      promptTerms: ['cluster setting', 'group setting', 'multiple stones', 'flower design']
    },
    'gypsy': {
      name: 'gypsy setting',
      chineseName: '吉普赛镶嵌',
      description: '宝石嵌入金属表面',
      promptTerms: ['gypsy setting', 'flush setting', 'embedded stone', 'smooth finish']
    },
    'bar': {
      name: 'bar setting',
      chineseName: '条镶',
      description: '用金属条固定宝石两侧',
      promptTerms: ['bar setting', 'rail setting', 'linear mounting', 'modern style']
    },
    'bead': {
      name: 'bead setting',
      chineseName: '珠镶',
      description: '用小金属珠固定宝石',
      promptTerms: ['bead setting', 'grain setting', 'milgrain detail', 'vintage style']
    }
  },

  artStyles: {
    'realistic': {
      name: 'realistic',
      chineseName: '写实风格',
      description: '高度逼真的视觉效果，精确还原水晶的真实质感、光泽和透明度',
      medium: 'photorealistic rendering',
      techniques: ['detailed rendering', 'precise lighting', 'texture mapping', 'realistic shadows'],
      qualityTerms: ['ultra realistic', 'lifelike', 'high definition', 'professional'],
      colorHandling: ['natural colors', 'accurate lighting', 'realistic reflections']
    },
    'cartoon': {
      name: 'cartoon',
      chineseName: '卡通风格',
      description: '可爱活泼的卡通表现，简化的造型和明亮的色彩，适合年轻时尚的水晶设计',
      medium: 'cartoon illustration',
      techniques: ['simplified forms', 'bold outlines', 'flat colors', 'exaggerated features'],
      qualityTerms: ['cute', 'vibrant', 'playful', 'stylized'],
      colorHandling: ['bright colors', 'high contrast', 'saturated tones']
    },
    'oil_painting': {
      name: 'oil painting',
      chineseName: '油画风格',
      description: '经典油画技法，色彩丰富饱满，笔触质感强烈，展现水晶的艺术美感',
      medium: 'oil painting',
      techniques: ['impasto', 'glazing', 'scumbling', 'brush strokes'],
      qualityTerms: ['artistic', 'classical', 'rich textures', 'masterpiece'],
      colorHandling: ['rich colors', 'deep saturation', 'layered tones']
    },
    'watercolor': {
      name: 'watercolor',
      chineseName: '水彩风格',
      description: '流动透明的水彩效果，轻盈灵动，完美展现水晶的晶莹剔透特质',
      medium: 'watercolor painting',
      techniques: ['wet-on-wet', 'wet-on-dry', 'glazing', 'color bleeding'],
      qualityTerms: ['transparent', 'fluid', 'delicate', 'artistic'],
      colorHandling: ['flowing colors', 'soft transitions', 'luminous effects']
    },
    'sketch': {
      name: 'sketch',
      chineseName: '素描风格',
      description: '简洁的线条勾勒，黑白灰调子，突出水晶的结构美和光影关系',
      medium: 'pencil sketch',
      techniques: ['line drawing', 'shading', 'cross-hatching', 'blending'],
      qualityTerms: ['minimalist', 'elegant', 'structural', 'artistic'],
      colorHandling: ['monochromatic', 'grayscale', 'subtle gradations']
    },
    'anime': {
      name: 'anime',
      chineseName: '动漫风格',
      description: '日式动漫画风，大眼睛、精致五官，色彩鲜艳，适合二次元风格的水晶饰品',
      medium: 'anime illustration',
      techniques: ['cel shading', 'clean lines', 'bright colors', 'stylized features'],
      qualityTerms: ['kawaii', 'vibrant', 'stylized', 'expressive'],
      colorHandling: ['saturated colors', 'high contrast', 'gradient effects']
    },
    'chinese_painting': {
      name: 'chinese painting',
      chineseName: '国画风格',
      description: '中国传统绘画艺术，水墨韵味，意境深远，体现东方美学的水晶设计',
      medium: 'traditional Chinese painting',
      techniques: ['ink wash', 'brush strokes', 'negative space', 'flowing lines'],
      qualityTerms: ['elegant', 'traditional', 'artistic', 'spiritual'],
      colorHandling: ['ink tones', 'subtle colors', 'natural gradations']
    },
    'digital_art': {
      name: 'digital art',
      chineseName: '数字艺术',
      description: '现代数字绘画技术，色彩精确控制，特效丰富，适合科技感水晶设计',
      medium: 'digital artwork',
      techniques: ['digital painting', 'photo manipulation', 'vector art', '3D rendering'],
      qualityTerms: ['high resolution', 'modern', 'precise', 'innovative'],
      colorHandling: ['vibrant colors', 'precise control', 'gradient effects']
    },
    'vintage': {
      name: 'vintage',
      chineseName: '复古风格',
      description: '怀旧复古美学，做旧质感，温暖色调，展现时光沉淀的水晶魅力',
      medium: 'vintage style',
      techniques: ['aged effects', 'texture overlay', 'sepia tones', 'distressed look'],
      qualityTerms: ['nostalgic', 'classic', 'timeless', 'warm'],
      colorHandling: ['muted tones', 'aged colors', 'warm palette']
    },
    'minimalist': {
      name: 'minimalist',
      chineseName: '极简风格',
      description: '简约至上的设计理念，去除多余装饰，突出水晶本身的纯净美感',
      medium: 'minimalist design',
      techniques: ['clean lines', 'simple forms', 'negative space', 'geometric shapes'],
      qualityTerms: ['clean', 'pure', 'sophisticated', 'modern'],
      colorHandling: ['monochromatic', 'neutral palette', 'subtle contrasts']
    },

    'fantasy': {
      name: 'fantasy',
      chineseName: '奇幻风格',
      description: '充满想象力的奇幻世界，魔法元素和梦幻色彩，打造神秘的水晶饰品',
      medium: 'fantasy art',
      techniques: ['magical effects', 'ethereal lighting', 'mystical elements', 'surreal composition'],
      qualityTerms: ['magical', 'ethereal', 'mystical', 'enchanting'],
      colorHandling: ['iridescent colors', 'magical glow', 'fantasy palette']
    },
    'cyberpunk': {
      name: 'cyberpunk',
      chineseName: '赛博朋克',
      description: '未来科技美学，霓虹色彩和金属质感，展现科幻感的水晶设计',
      medium: 'cyberpunk style',
      techniques: ['neon lighting', 'metallic textures', 'futuristic elements', 'high contrast'],
      qualityTerms: ['futuristic', 'high-tech', 'edgy', 'neon'],
      colorHandling: ['neon colors', 'electric blue', 'metallic accents']
    }
  },

  inclusions: {
    'rutile': {
      name: 'rutile needles',
      chineseName: '金红石针',
      colors: ['金色', '铜色', '银色', '红金色', '青铜色'],
      patterns: ['needle-like', 'hair-like', 'intersecting', 'radiating', 'star-like'],
      promptTerms: ['rutile inclusions', 'golden needles', 'rutilated', 'needle inclusions', 'hair crystal']
    },
    'tourmaline': {
      name: 'tourmaline inclusions',
      chineseName: '电气石包裹体',
      colors: ['黑色', '绿色', '粉色', '蓝色', '西瓜色'],
      patterns: ['rod-like', 'prismatic', 'scattered', 'linear'],
      promptTerms: ['tourmaline inclusions', 'colored inclusions', 'mineral inclusions', 'prismatic crystals']
    },
    'chlorite': {
      name: 'chlorite phantom',
      chineseName: '绿泥石幻影',
      colors: ['森林绿', '深绿色', '苔藓绿'],
      patterns: ['phantom layers', 'mountain-like', 'landscape', 'layered'],
      promptTerms: ['chlorite phantom', 'green phantom', 'phantom inclusions', 'landscape crystal']
    },
    'hematite': {
      name: 'hematite inclusions',
      chineseName: '赤铁矿包裹体',
      colors: ['金属灰', '银色', '深灰色', '铁色'],
      patterns: ['metallic flakes', 'scattered', 'reflective', 'mirror-like'],
      promptTerms: ['hematite inclusions', 'metallic inclusions', 'iron inclusions', 'reflective crystals']
    },
    'actinolite': {
      name: 'actinolite needles',
      chineseName: '阳起石针',
      colors: ['绿色', '深绿色', '森林绿'],
      patterns: ['needle-like', 'fibrous', 'radiating', 'fan-like'],
      promptTerms: ['actinolite inclusions', 'green needles', 'fibrous inclusions', 'mineral needles']
    },
    'epidote': {
      name: 'epidote inclusions',
      chineseName: '绿帘石包裹体',
      colors: ['开心果绿', '黄绿色', '橄榄绿'],
      patterns: ['crystalline', 'prismatic', 'scattered', 'cluster-like'],
      promptTerms: ['epidote inclusions', 'green mineral', 'crystalline inclusions', 'pistachio crystals']
    },
    'goethite': {
      name: 'goethite phantom',
      chineseName: '针铁矿幻影',
      colors: ['金棕色', '锈棕色', '琥珀棕'],
      patterns: ['phantom layers', 'feathery', 'dendritic', 'tree-like'],
      promptTerms: ['goethite phantom', 'brown phantom', 'feathery inclusions', 'dendritic patterns']
    }
  },

  metalTypes: {
    'sterling_silver': {
      name: 'sterling silver',
      chineseName: '925银',
      finishes: ['polished', 'matte', 'oxidized', 'brushed', 'antique'],
      promptTerms: ['sterling silver', '925 silver', 'silver metal', 'silver components']
    },
    '18k_yellow_gold': {
      name: '18K yellow gold',
      chineseName: '18K黄金',
      finishes: ['polished', 'brushed', 'hammered', 'satin'],
      promptTerms: ['18K yellow gold', 'golden metal', 'yellow gold components']
    },
    '18k_white_gold': {
      name: '18K white gold',
      chineseName: '18K白色金',
      finishes: ['polished', 'brushed', 'matte', 'rhodium plated'],
      promptTerms: ['18K white gold', 'white gold metal', 'platinum-like finish']
    },
    '18k_rose_gold': {
      name: '18K rose gold',
      chineseName: '18K玫瑰金',
      finishes: ['polished', 'brushed', 'matte', 'vintage'],
      promptTerms: ['18K rose gold', 'pink gold', 'rose gold metal', 'romantic tone']
    },
    'platinum': {
      name: 'platinum',
      chineseName: '铂金',
      finishes: ['polished', 'matte', 'brushed', 'hammered'],
      promptTerms: ['platinum', 'Pt950', 'precious metal', 'luxury finish']
    },
    'palladium': {
      name: 'palladium',
      chineseName: '钯金',
      finishes: ['polished', 'matte', 'brushed'],
      promptTerms: ['palladium', 'Pd950', 'white metal', 'hypoallergenic']
    },
    'titanium': {
      name: 'titanium',
      chineseName: '钛金',
      finishes: ['polished', 'brushed', 'anodized', 'matte'],
      promptTerms: ['titanium', 'lightweight metal', 'modern finish', 'durable']
    },
    '14k_gold': {
      name: '14K gold',
      chineseName: '14K金',
      finishes: ['polished', 'brushed', 'satin'],
      promptTerms: ['14K gold', 'gold alloy', 'durable gold', 'everyday wear']
    }
  },

  culturalStyles: {
    'chinese_traditional': {
      name: 'chinese traditional',
      chineseName: '中国传统风格',
      description: '经典中华文化元素，传统图案和东方美学，展现深厚文化底蕴',
      characteristics: ['ethnic patterns', 'traditional motifs', 'cultural elements', 'oriental design'],
      promptTerms: ['Chinese ethnic style', 'traditional Chinese', 'oriental design', 'cultural jewelry']
    },
    'han_tang': {
      name: 'han tang',
      chineseName: '汉唐风格',
      description: '汉唐盛世的帝王气派，金饰华贵，龙凤呈祥，展现皇家风范',
      characteristics: ['imperial elegance', 'golden ornaments', 'dragon phoenix motifs', 'court jewelry'],
      promptTerms: ['Han Tang style', 'imperial Chinese', 'court jewelry', 'golden ornaments']
    },
    'song_dynasty': {
      name: 'song dynasty',
      chineseName: '宋代风格',
      description: '宋代文人雅士的精致简约，清雅脱俗，体现文人墨客的审美情趣',
      characteristics: ['refined simplicity', 'scholarly elegance', 'subtle beauty', 'literati aesthetics'],
      promptTerms: ['Song dynasty style', 'scholarly elegance', 'refined Chinese', 'literati jewelry']
    },
    'ming_qing': {
      name: 'ming qing',
      chineseName: '明清古典', // 明清两朝的精工细作，珍贵材料和传统工艺，展现古典奢华
      characteristics: ['intricate craftsmanship', 'precious materials', 'imperial symbols', 'traditional techniques'],
      promptTerms: ['Ming Qing style', 'classical Chinese', 'imperial jewelry', 'traditional craftsmanship']
    },
    'republic_era': {
      name: 'republic era',
      chineseName: '民国风格', // 民国时期中西合璧的现代优雅，海派风情，东西方文化融合
      characteristics: ['east meets west', 'modern elegance', 'art deco influence', 'shanghai style'],
      promptTerms: ['Republic era style', 'Shanghai style', 'Chinese modern', 'east meets west']
    },
    'buddhist': {
      name: 'buddhist',
      chineseName: '佛教风格', // 佛教文化的莲花图案和念珠元素，体现宁静祥和的精神境界
      characteristics: ['lotus motifs', 'prayer beads', 'sacred symbols', 'spiritual elements'],
      promptTerms: ['Buddhist style', 'lotus jewelry', 'prayer beads', 'spiritual jewelry']
    },

    'jiangnan': {
      name: 'jiangnan',
      chineseName: '江南风格', // 江南水乡的温婉秀美，丝绸之路的精致优雅，展现南方文化韵味
      characteristics: ['water town aesthetics', 'gentle elegance', 'silk road influence', 'refined beauty'],
      promptTerms: ['Jiangnan style', 'water town jewelry', 'gentle elegance', 'southern Chinese']
    },
    'northern_china': {
      name: 'northern china',
      chineseName: '北方风格', // 北方文化的大气豪放，厚重质朴，展现帝王之都的强烈存在感
      characteristics: ['bold designs', 'robust forms', 'imperial heritage', 'strong presence'],
      promptTerms: ['Northern Chinese style', 'bold jewelry', 'imperial design', 'robust forms']
    },
    'tibetan': {
      name: 'tibetan',
      chineseName: '藏式风格', // 西藏高原的神秘宗教文化，绿松石珊瑚银饰，体现雪域高原特色
      characteristics: ['turquoise', 'coral', 'silver', 'prayer beads'],
      promptTerms: ['Tibetan style', 'prayer beads', 'ethnic jewelry']
    },
    'xinjiang': {
      name: 'xinjiang',
      chineseName: '新疆风格', // 丝绸之路的异域风情，多彩宝石和游牧文化，展现西域神秘魅力
      characteristics: ['silk road heritage', 'exotic patterns', 'colorful gems', 'nomadic influence'],
      promptTerms: ['Xinjiang style', 'silk road jewelry', 'exotic design', 'nomadic jewelry']
    },
    'yunnan': {
      name: 'yunnan',
      chineseName: '云南风格', // 云南多民族文化的绚烂多彩，自然材料和部落影响，展现彩云之南
      characteristics: ['ethnic diversity', 'natural materials', 'colorful designs', 'tribal influences'],
      promptTerms: ['Yunnan style', 'ethnic jewelry', 'tribal design', 'colorful gems']
    },

    'indian': {
      name: 'indian',
      chineseName: '印度风格', // 印度传统珠宝的昆丹工艺和庙宇珠宝，华丽精致的设计风格
      characteristics: ['kundan', 'meenakari', 'temple jewelry', 'elaborate designs'],
      promptTerms: ['Indian jewelry', 'kundan style', 'temple jewelry', 'traditional Indian']
    },
    'japanese': {
      name: 'japanese',
      chineseName: '日式风格', // 日本的极简美学和禅意设计，自然灵感和微妙之美，体现和风雅致
      characteristics: ['minimalist', 'nature inspired', 'zen aesthetics', 'subtle beauty'],
      promptTerms: ['Japanese style', 'zen design', 'minimalist Japanese', 'nature inspired']
    },
    'korean': {
      name: 'korean',
      chineseName: '韩式风格', // 韩国的优雅简约和现代美学，精致美感和当代设计，展现韩流时尚
      characteristics: ['elegant simplicity', 'modern aesthetics', 'refined beauty', 'contemporary design'],
      promptTerms: ['Korean style', 'elegant jewelry', 'modern Korean', 'refined design']
    },
    'middle_eastern': {
      name: 'middle eastern',
      chineseName: '中东风格', // 中东的几何图案和金银丝工艺，华丽设计和珍贵金属，展现阿拉伯风情
      characteristics: ['geometric patterns', 'filigree', 'ornate designs', 'precious metals'],
      promptTerms: ['Middle Eastern style', 'Islamic patterns', 'filigree work', 'ornate jewelry']
    },

    'scandinavian': {
      name: 'scandinavian',
      chineseName: '北欧风格',
      characteristics: ['clean lines', 'natural materials', 'functional beauty', 'minimalist'],
      promptTerms: ['Scandinavian style', 'Nordic design', 'clean minimalist', 'natural beauty']
    },
    'ancient_egyptian': {
      name: 'ancient egyptian',
      chineseName: '古埃及风格',
      characteristics: ['hieroglyphic motifs', 'scarab beetles', 'pharaoh symbols', 'gold and lapis'],
      promptTerms: ['ancient Egyptian style', 'pharaoh jewelry', 'hieroglyphic patterns', 'sacred symbols']
    },
    'ancient_greek': {
      name: 'ancient greek',
      chineseName: '古希腊风格',
      characteristics: ['laurel wreaths', 'mythological themes', 'geometric patterns', 'classical beauty'],
      promptTerms: ['ancient Greek style', 'classical mythology', 'Hellenic design', 'Olympic symbols']
    },
    'byzantine': {
      name: 'byzantine',
      chineseName: '拜占庭风格',
      characteristics: ['religious iconography', 'rich colors', 'imperial luxury', 'orthodox symbols'],
      promptTerms: ['Byzantine style', 'imperial jewelry', 'orthodox motifs', 'Constantinople luxury']
    },
    'persian': {
      name: 'persian',
      chineseName: '波斯风格',
      characteristics: ['intricate patterns', 'precious stones', 'royal motifs', 'Islamic geometry'],
      promptTerms: ['Persian style', 'royal Persian', 'Islamic patterns', 'oriental luxury']
    },
    'russian': {
      name: 'russian',
      chineseName: '俄罗斯风格',
      characteristics: ['Fabergé style', 'imperial luxury', 'orthodox crosses', 'enamel work'],
      promptTerms: ['Russian imperial', 'Fabergé style', 'Tsarist jewelry', 'orthodox design']
    },
    'turkish_ottoman': {
      name: 'turkish ottoman',
      chineseName: '土耳其奥斯曼风格',
      characteristics: ['tulip motifs', 'crescent moon', 'geometric tiles', 'sultan luxury'],
      promptTerms: ['Ottoman style', 'Turkish design', 'sultan jewelry', 'Islamic art']
    },
    'african_tribal': {
      name: 'african tribal',
      chineseName: '非洲部落风格',
      characteristics: ['tribal patterns', 'natural materials', 'earth tones', 'ancestral symbols'],
      promptTerms: ['African tribal', 'ethnic patterns', 'tribal jewelry', 'ancestral design']
    },
    'mayan_aztec': {
      name: 'mayan aztec',
      chineseName: '玛雅阿兹特克风格',
      characteristics: ['sun symbols', 'feathered serpent', 'jade and gold', 'calendar motifs'],
      promptTerms: ['Mayan style', 'Aztec design', 'pre-Columbian', 'ancient American']
    },
    'art_deco_egyptian': {
      name: 'art deco egyptian',
      chineseName: '装饰艺术风格埃及主题',
      characteristics: ['geometric pyramids', 'stylized hieroglyphs', 'modern pharaoh', 'streamlined ancient'],
      promptTerms: ['Art Deco Egyptian', 'modern pharaoh', 'geometric ancient', 'stylized Egypt']
    },
    'moorish': {
      name: 'moorish',
      chineseName: '摩尔风格',
      characteristics: ['horseshoe arches', 'geometric stars', 'Andalusian patterns', 'Islamic Spain'],
      promptTerms: ['Moorish style', 'Andalusian design', 'Islamic Spain', 'Alhambra patterns']
    },
    'victorian_mourning': {
      name: 'victorian mourning',
      chineseName: '维多利亚哀悼风格',
      characteristics: ['jet black', 'memorial symbols', 'hair jewelry', 'sentimental'],
      promptTerms: ['Victorian mourning', 'memorial jewelry', 'jet black', 'sentimental design']
    }
  },

  compositions: {
    'golden_ratio': {
      name: 'golden ratio',
      chineseName: '黄金分割',
      principles: ['1.618 ratio', 'fibonacci sequence', 'divine proportion'],
      promptTerms: ['golden ratio composition', 'divine proportion', 'perfect proportions', 'mathematical beauty']
    },
    'symmetrical': {
      name: 'symmetrical',
      chineseName: '对称构图',
      principles: ['bilateral symmetry', 'radial symmetry', 'balanced composition'],
      promptTerms: ['symmetrical composition', 'balanced design', 'mirror symmetry']
    }
  },

  qualityModifiers: [
    'masterpiece',
    'best quality',
    'ultra detailed',
    'extremely detailed',
    'high resolution',
    '8k',
    'professional photography',
    'studio lighting',
    'perfect composition',
    'sharp focus'
  ],

  lightingEffects: [
    'soft lighting',
    'dramatic lighting',
    'studio lighting',
    'natural light',
    'rim lighting',
    'sparkle effect',
    'brilliant reflection',
    'prismatic light',
    'crystal refraction',
    'diamond sparkle',
    'golden hour lighting',
    'blue hour lighting',
    'candlelight glow',
    'moonlight effect',
    'sunlight rays',
    'backlighting',
    'side lighting',
    'top lighting',
    'diffused lighting',
    'harsh lighting',
    'moody lighting',
    'cinematic lighting',
    'jewelry photography lighting',
    'macro lighting',
    'ring light effect',
    'spotlight effect',
    'ambient lighting',
    'color temperature warm',
    'color temperature cool',
    'high key lighting',
    'low key lighting',
    'chiaroscuro lighting'
  ],

  backgroundOptions: [
    '纯白背景',
    '黑色天鹅绒背景',
    '白色丝绸背景',
    '大理石表面',
    '木质桌面',
    '反射表面',
    '渐变背景',
    '柔焦背景',
    '奢华展示',
    '珠宝盒',
    '干净背景',
    '天然石材背景',
    '皮革纹理背景',
    '织物背景',
    '镜面表面',
    '玻璃表面',
    '水晶展示柜',
    '博物馆展示',
    '精品店环境',
    '工作室背景',
    '自然背景',
    '水面',
    'sand texture',
    'concrete surface',
    'metal surface',
    'vintage paper',
    'parchment background',
    'dark moody background',
    'bright studio lighting',
    'sunset lighting',
    'candlelight ambiance'
  ],

  // 水晶形状选项（基于专业宝石切割）
  crystalShapes: [
    '圆形',           // round
    '椭圆形',         // oval
    '祖母绿切割',     // emerald cut
    '公主方切割',     // princess cut
    '枕形切割',       // cushion
    '梨形',           // pear
    '心形',           // heart
    '马眼形',         // marquise
    '雷地恩切割',     // radiant
    '阿斯切切割',     // asscher
    '长阶梯形',       // baguette
    '三角形切割',     // trillion
    '弧面形',         // cabochon
    '自由形状',       // freeform
    '水滴刻面'        // briolette
  ],

  // 透明度选项
  transparencyLevels: [
    '透明',
    '半透明',
    '半透明状',
    '不透明',
    '水晶般透明'
  ],

  // 品质要求选项
  qualityLevels: [
    '高品质',
    '优质品质',
    '杰作品质',
    '专业级别',
    '艺术品质'
  ],

  // 表现精度选项（替代风格化程度，避免与艺术风格冲突）
  renderingLevels: [
    '超精细',      // 极致细节，每个细微纹理都清晰可见
    '精细',        // 高细节度，主要特征清晰
    '标准',        // 平衡的细节表现
    '简化',        // 突出主要特征，简化细节
    '极简'         // 最简化表现，突出核心元素
  ],

  negativePrompts: [
    'blurry',
    'low quality',
    'pixelated',
    'distorted',
    'ugly',
    'deformed',
    'bad anatomy',
    'poor lighting',
    'overexposed',
    'underexposed',
    'noise',
    'artifacts',
    'watermark',
    'text',
    'signature'
  ]
};

// 提示词生成函数
export function generateCrystalJewelryPrompt(params: {
  crystalType?: string;
  jewelryType?: string;
  style?: string;
  setting?: string;
  customKeywords?: string[];
}): string {
  const { crystalType, jewelryType, style, setting, customKeywords = [] } = params;
  
  let promptParts: string[] = [];
  
  // 添加质量修饰符
  promptParts.push('(masterpiece, best quality, ultra detailed:1.2)');
  
  // 添加风格
  if (style && crystalPromptSystem.styles[style]) {
    promptParts.push(...crystalPromptSystem.styles[style].keywords);
    promptParts.push(...crystalPromptSystem.styles[style].qualityTerms);
  }
  
  // 添加珠宝类型
  if (jewelryType && crystalPromptSystem.jewelryTypes[jewelryType]) {
    promptParts.push(...crystalPromptSystem.jewelryTypes[jewelryType].promptModifiers);
  }
  
  // 添加水晶类型
  if (crystalType && crystalPromptSystem.crystalTypes[crystalType]) {
    const crystal = crystalPromptSystem.crystalTypes[crystalType];
    promptParts.push(...crystal.promptKeywords);
    promptParts.push(...crystal.properties);
    if (crystal.colors.length > 0) {
      promptParts.push(crystal.colors[0]); // 使用第一个颜色作为默认
    }
  }
  
  // 添加镶嵌方式
  if (setting && crystalPromptSystem.settings[setting]) {
    promptParts.push(...crystalPromptSystem.settings[setting].promptTerms);
  }
  
  // 添加光效
  promptParts.push('brilliant sparkle', 'crystal refraction');
  
  // 添加背景
  promptParts.push('black velvet background');
  
  // 添加自定义关键词
  promptParts.push(...customKeywords);
  
  return promptParts.join(', ');
}

// 生成负面提示词
export function generateNegativePrompt(): string {
  return crystalPromptSystem.negativePrompts.join(', ');
}

// 生成高级提示词（包含权重和结构）
export function generateAdvancedPrompt(params: {
  crystalType?: string;
  jewelryType?: string;
  style?: string;
  setting?: string;
  lighting?: string;
  background?: string;
  customKeywords?: string[];
  useWeights?: boolean;
}): string {
  const {
    crystalType,
    jewelryType,
    style,
    setting,
    lighting,
    background,
    customKeywords = [],
    useWeights = true
  } = params;

  let promptParts: string[] = [];

  // 高质量修饰符（高权重）
  if (useWeights) {
    promptParts.push('(masterpiece:1.3), (best quality:1.2), (ultra detailed:1.2)');
  } else {
    promptParts.push('masterpiece, best quality, ultra detailed');
  }

  // 添加风格（中等权重）
  if (style && crystalPromptSystem.styles[style]) {
    const styleData = crystalPromptSystem.styles[style];
    if (useWeights) {
      promptParts.push(`(${styleData.keywords[0]}:1.1)`);
    } else {
      promptParts.push(...styleData.keywords.slice(0, 2));
    }
    promptParts.push(...styleData.qualityTerms.slice(0, 2));
  }

  // 添加珠宝类型（高权重）
  if (jewelryType && crystalPromptSystem.jewelryTypes[jewelryType]) {
    const jewelry = crystalPromptSystem.jewelryTypes[jewelryType];
    if (useWeights) {
      promptParts.push(`(elegant ${jewelryType}:1.2)`);
    } else {
      promptParts.push(`elegant ${jewelryType}`);
    }
    promptParts.push(...jewelry.promptModifiers.slice(0, 1));
  }

  // 添加水晶类型（最高权重）
  if (crystalType && crystalPromptSystem.crystalTypes[crystalType]) {
    const crystal = crystalPromptSystem.crystalTypes[crystalType];
    if (useWeights) {
      promptParts.push(`(${crystal.promptKeywords[0]}:1.3)`);
    } else {
      promptParts.push(...crystal.promptKeywords.slice(0, 2));
    }
    promptParts.push(...crystal.properties.slice(0, 2));

    // 添加颜色
    if (crystal.colors.length > 0) {
      if (useWeights) {
        promptParts.push(`(${crystal.colors[0]}:1.1)`);
      } else {
        promptParts.push(crystal.colors[0]);
      }
    }
  }

  // 添加镶嵌方式
  if (setting && crystalPromptSystem.settings[setting]) {
    promptParts.push(...crystalPromptSystem.settings[setting].promptTerms.slice(0, 1));
  }

  // 添加光效
  const lightingEffect = lighting || 'brilliant sparkle';
  if (useWeights) {
    promptParts.push(`(${lightingEffect}:1.1)`);
  } else {
    promptParts.push(lightingEffect);
  }
  promptParts.push('crystal refraction', 'prismatic light');

  // 添加背景
  const bgOption = background || 'black velvet background';
  promptParts.push(bgOption);

  // 添加摄影术语
  promptParts.push('professional photography', 'studio lighting', 'macro lens', 'sharp focus');

  // 添加自定义关键词
  promptParts.push(...customKeywords);

  return promptParts.join(', ');
}

// 提示词优化建议
export function getPromptSuggestions(crystalType?: string, jewelryType?: string): string[] {
  const suggestions: string[] = [];

  if (crystalType && crystalPromptSystem.crystalTypes[crystalType]) {
    const crystal = crystalPromptSystem.crystalTypes[crystalType];
    suggestions.push(`尝试添加: ${crystal.colors.slice(1, 3).join(', ')}`);
    suggestions.push(`推荐切割: ${crystal.commonCuts.slice(0, 2).join(', ')}`);
  }

  if (jewelryType && crystalPromptSystem.jewelryTypes[jewelryType]) {
    const jewelry = crystalPromptSystem.jewelryTypes[jewelryType];
    suggestions.push(`推荐设置: ${jewelry.commonSettings.slice(0, 2).join(', ')}`);
    suggestions.push(`推荐尺寸: ${jewelry.typicalSizes.slice(0, 2).join(', ')}`);
  }

  // 通用建议
  suggestions.push('添加光效: sparkle, brilliance, refraction');
  suggestions.push('背景选择: velvet, marble, silk');

  return suggestions;
}

// 提示词质量评分
export function evaluatePromptQuality(prompt: string): {
  score: number;
  feedback: string[];
  suggestions: string[];
} {
  const feedback: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  // 检查基础质量词
  const qualityTerms = ['masterpiece', 'best quality', 'ultra detailed', 'high resolution'];
  const hasQualityTerms = qualityTerms.some(term => prompt.toLowerCase().includes(term));
  if (hasQualityTerms) {
    score += 20;
    feedback.push('✓ 包含质量修饰符');
  } else {
    suggestions.push('添加质量修饰符: masterpiece, best quality');
  }

  // 检查水晶相关词汇
  const crystalTerms = Object.values(crystalPromptSystem.crystalTypes)
    .flatMap(crystal => crystal.promptKeywords);
  const hasCrystalTerms = crystalTerms.some(term =>
    prompt.toLowerCase().includes(term.toLowerCase())
  );
  if (hasCrystalTerms) {
    score += 25;
    feedback.push('✓ 包含水晶相关词汇');
  } else {
    suggestions.push('添加具体的水晶类型');
  }

  // 检查珠宝类型
  const jewelryTerms = Object.keys(crystalPromptSystem.jewelryTypes);
  const hasJewelryTerms = jewelryTerms.some(term =>
    prompt.toLowerCase().includes(term)
  );
  if (hasJewelryTerms) {
    score += 20;
    feedback.push('✓ 包含珠宝类型');
  } else {
    suggestions.push('指定珠宝类型: necklace, ring, bracelet');
  }

  // 检查风格词汇
  const styleTerms = Object.values(crystalPromptSystem.styles)
    .flatMap(style => style.keywords);
  const hasStyleTerms = styleTerms.some(term =>
    prompt.toLowerCase().includes(term)
  );
  if (hasStyleTerms) {
    score += 15;
    feedback.push('✓ 包含风格描述');
  } else {
    suggestions.push('添加风格描述: photorealistic, luxury, minimalist');
  }

  // 检查光效词汇
  const lightingTerms = crystalPromptSystem.lightingEffects;
  const hasLightingTerms = lightingTerms.some(term =>
    prompt.toLowerCase().includes(term.toLowerCase())
  );
  if (hasLightingTerms) {
    score += 10;
    feedback.push('✓ 包含光效描述');
  } else {
    suggestions.push('添加光效: sparkle, brilliant reflection');
  }

  // 检查背景描述
  const backgroundTerms = crystalPromptSystem.backgroundOptions;
  const hasBackgroundTerms = backgroundTerms.some(term =>
    prompt.toLowerCase().includes(term.toLowerCase())
  );
  if (hasBackgroundTerms) {
    score += 10;
    feedback.push('✓ 包含背景描述');
  } else {
    suggestions.push('添加背景: black velvet background, marble surface');
  }

  return { score, feedback, suggestions };
}

// 生成复杂场景提示词
export function generateComplexScenePrompt(params: {
  artStyle?: string;
  qualityLevel?: string;
  renderingLevel?: string;
  crystalType?: string; // 保持向后兼容
  crystalShape?: string;
  transparency?: string;
  inclusion?: string;
  inclusionColor?: string;
  inclusionDistribution?: string;
  crystalProcessing?: string;
  crystalConfigs?: Array<{
    crystalType?: string;
    crystalShape?: string;
    transparency?: string;
    inclusion?: string;
    inclusionColor?: string;
    inclusionDistribution?: string;
    crystalProcessing?: string;
  }>; // 新的多水晶配置
  metalType?: string;
  culturalStyle?: string;
  composition?: string;
  structuralAesthetics?: string;
  overallLayout?: string;
  visualFocus?: string;
  jewelryType?: string;
  background?: string;
  accessories?: string[];
  accessoryQuantity?: string;
  accessoryArrangement?: string;
  customKeywords?: string[];
}): string {
  return generateChinesePrompt(params);
}

// 生成中文结构化提示词
function generateChinesePrompt(params: {
  artStyle?: string;
  qualityLevel?: string;
  renderingLevel?: string;
  crystalType?: string;
  crystalShape?: string;
  transparency?: string;
  inclusion?: string;
  inclusionColor?: string;
  inclusionDistribution?: string;
  crystalProcessing?: string;
  crystalConfigs?: Array<{
    crystalType?: string;
    crystalShape?: string;
    transparency?: string;
    inclusion?: string;
    inclusionColor?: string;
    inclusionDistribution?: string;
    crystalProcessing?: string;
  }>;
  metalType?: string;
  culturalStyle?: string;
  composition?: string;
  structuralAesthetics?: string;
  overallLayout?: string;
  visualFocus?: string;
  jewelryType?: string;
  background?: string;
  accessories?: string[];
  accessoryQuantity?: string;
  accessoryArrangement?: string;
  customKeywords?: string[];
}): string {
  const {
    artStyle,
    qualityLevel,
    renderingLevel,
    crystalType,
    crystalShape,
    transparency,
    inclusion,
    inclusionColor,
    inclusionDistribution,
    crystalProcessing,
    crystalConfigs,
    metalType,
    culturalStyle,
    composition,
    structuralAesthetics,
    overallLayout,
    visualFocus,
    jewelryType,
    background,
    accessories = [],
    accessoryQuantity,
    accessoryArrangement,
    customKeywords = []
  } = params;

  // 构建中文提示词结构
  let promptParts: string[] = [];

  // 1. 开头：生成一幅...
  promptParts.push('生成一幅');

  // 2. 质量和精度描述
  const qualityDesc = getQualityDescription(qualityLevel, renderingLevel);
  if (qualityDesc) {
    promptParts.push(qualityDesc);
  }

  // 3. 艺术风格描述
  const artStyleDesc = getArtStyleDescription(artStyle);
  if (artStyleDesc) {
    promptParts.push(artStyleDesc);
  }

  // 4. 画作内容描述开始
  promptParts.push('，画作内容展示了：');

  // 5. 水晶主体描述
  let crystalDesc = '';
  if (crystalConfigs && crystalConfigs.length > 0) {
    // 使用新的多水晶配置
    const crystalDescriptions = crystalConfigs
      .filter(config => config.crystalType) // 只处理有水晶类型的配置
      .map(config => getCrystalDescription(config));

    if (crystalDescriptions.length > 0) {
      if (crystalDescriptions.length === 1) {
        crystalDesc = crystalDescriptions[0];
      } else {
        // 多个水晶的描述
        crystalDesc = crystalDescriptions.join('与') + '组合而成的';
      }
    }
  } else {
    // 向后兼容：使用旧的单水晶配置
    crystalDesc = getCrystalDescription({
      crystalType,
      crystalShape,
      transparency,
      inclusion,
      inclusionColor,
      inclusionDistribution,
      crystalProcessing
    });
  }

  if (crystalDesc) {
    promptParts.push(crystalDesc);
  }

  // 6. 配件描述
  const accessoryDesc = getAccessoryDescription(metalType, accessories);
  if (accessoryDesc) {
    promptParts.push(accessoryDesc);
  }

  // 7. 珠宝类型和文化风格
  const jewelryStyleDesc = getJewelryStyleDescription(jewelryType, culturalStyle);
  if (jewelryStyleDesc) {
    promptParts.push(jewelryStyleDesc);
  }

  // 8. 构图和美学描述
  const compositionDesc = getCompositionDescription(composition, structuralAesthetics);
  if (compositionDesc) {
    promptParts.push('，画作中的' + (getJewelryTypeName(jewelryType) || '饰品') + compositionDesc);
  }

  // 9. 色彩处理描述
  const colorDesc = getColorDescription(customKeywords);
  if (colorDesc) {
    promptParts.push('，画作' + colorDesc);
  }

  // 10. 背景描述
  const backgroundDesc = getBackgroundDescription(background);
  if (backgroundDesc) {
    promptParts.push('，背景' + backgroundDesc);
  }

  // 11. 结尾
  promptParts.push('。');

  return promptParts.join('');

  // 艺术风格
  if (artStyle && typeof artStyle === 'string' && (artStyle as string) in crystalPromptSystem.artStyles) {
    const art = crystalPromptSystem.artStyles[artStyle as keyof typeof crystalPromptSystem.artStyles];
    promptParts.push(`(${art.medium}:1.2)`);
    promptParts.push(...art.qualityTerms);
    promptParts.push(...art.colorHandling);
  }

  // 文化风格
  if (culturalStyle && typeof culturalStyle === 'string' && (culturalStyle as string) in crystalPromptSystem.culturalStyles) {
    const culture = crystalPromptSystem.culturalStyles[culturalStyle as keyof typeof crystalPromptSystem.culturalStyles];
    promptParts.push(`(${culture.promptTerms?.[0] || culturalStyle}:1.1)`);
    promptParts.push(...(culture.characteristics?.slice(0, 2) || []));
  }

  // 珠宝类型
  if (jewelryType && typeof jewelryType === 'string' && (jewelryType as string) in crystalPromptSystem.jewelryTypes) {
    const jewelry = crystalPromptSystem.jewelryTypes[jewelryType as keyof typeof crystalPromptSystem.jewelryTypes];
    promptParts.push(`(${jewelryType}:1.2)`);
  }

  // 水晶类型和详细参数
  if (crystalType && typeof crystalType === 'string' && (crystalType as string) in crystalPromptSystem.crystalTypes) {
    const crystal = crystalPromptSystem.crystalTypes[crystalType as keyof typeof crystalPromptSystem.crystalTypes];
    promptParts.push(`(${crystal.promptKeywords[0]}:1.3)`);

    // 水晶形状
    if (crystalShape) {
      promptParts.push(`${crystalShape} crystal beads`);
    } else {
      promptParts.push('round crystal beads');
    }

    // 透明度
    if (transparency) {
      promptParts.push(`(${transparency}:1.1)`);
    }

    // 水晶加工
    if (crystalProcessing) {
      promptParts.push(`crystal ${crystalProcessing}`);
    }

    // 内含物
    if (inclusion && typeof inclusion === 'string' && (inclusion as string) in crystalPromptSystem.inclusions) {
      const inc = crystalPromptSystem.inclusions[inclusion as keyof typeof crystalPromptSystem.inclusions];
      const color = inclusionColor || inc.colors[0];
      promptParts.push(`(${color} ${inc.promptTerms?.[0] || inclusion}:1.2)`);

      // 内含物分布
      if (inclusionDistribution && typeof inclusionDistribution === 'string' && inclusionDistribution!.trim()) {
        promptParts.push(inclusionDistribution!.trim());
      } else {
        promptParts.push('internal inclusions', 'wrapped inside');
      }
    }
  }

  // 金属材质
  if (metalType && typeof metalType === 'string' && (metalType as string) in crystalPromptSystem.metalTypes) {
    const metal = crystalPromptSystem.metalTypes[metalType as keyof typeof crystalPromptSystem.metalTypes];
    promptParts.push(`(${metal.promptTerms?.[0] || metalType}:1.1)`);
  }

  // 配件
  if (accessories.length > 0) {
    // 配件数量
    if (accessoryQuantity) {
      promptParts.push(`${accessoryQuantity} accessories`);
    }

    // 配件类型
    promptParts.push(...accessories.map(acc => `${acc} accessories`));

    // 搭配方式
    if (accessoryArrangement && typeof accessoryArrangement === 'string' && accessoryArrangement!.trim()) {
      promptParts.push(accessoryArrangement!.trim());
    }
  }

  // 构图
  if (composition && typeof composition === 'string' && (composition as string) in crystalPromptSystem.compositions) {
    const comp = crystalPromptSystem.compositions[composition as keyof typeof crystalPromptSystem.compositions];
    promptParts.push(`(${comp.promptTerms?.[0] || composition}:1.1)`);
  }

  // 结构美学
  if (structuralAesthetics && typeof structuralAesthetics === 'string' && structuralAesthetics!.trim()) {
    promptParts.push(structuralAesthetics!.trim());
  }

  // 整体布局
  if (overallLayout && typeof overallLayout === 'string' && overallLayout!.trim()) {
    promptParts.push(overallLayout!.trim());
  }

  // 视觉重点
  if (visualFocus && typeof visualFocus === 'string' && visualFocus!.trim()) {
    promptParts.push(visualFocus!.trim());
  }

  // 背景
  if (background) {
    promptParts.push(`(${background}:1.1)`);
  }

  // 自定义关键词
  promptParts.push(...customKeywords);

  // 通用质量术语
  promptParts.push('detailed artwork', 'fine craftsmanship', 'elegant design');

  return promptParts.join(', ');
}

// 获取质量和精度描述
function getQualityDescription(qualityLevel?: string, renderingLevel?: string): string {
  const qualityMap: { [key: string]: string } = {
    '高品质': '高品质',
    '专业级别': '专业级',
    '艺术品质': '艺术级'
  };

  const renderingMap: { [key: string]: string } = {
    '超精细': '超精细',
    '精细': '精细',
    '标准': '',
    '简化': '简化',
    '极简': '极简'
  };

  const quality = qualityMap[qualityLevel || ''] || '高品质';
  const rendering = renderingMap[renderingLevel || ''] || '';

  if (rendering && rendering !== '') {
    return `${quality}、${rendering}的`;
  }
  return `${quality}的`;
}

// 获取艺术风格描述
function getArtStyleDescription(artStyle?: string): string {
  if (!artStyle || !crystalPromptSystem.artStyles[artStyle]) {
    return '写实风格';
  }

  const style = crystalPromptSystem.artStyles[artStyle];
  return style.chineseName;
}

// 获取水晶描述
function getCrystalDescription(params: {
  crystalType?: string;
  crystalShape?: string;
  transparency?: string;
  inclusion?: string;
  inclusionColor?: string;
  inclusionDistribution?: string;
  crystalProcessing?: string;
}): string {
  const {
    crystalType,
    crystalShape,
    transparency,
    inclusion,
    inclusionColor,
    inclusionDistribution,
    crystalProcessing
  } = params;

  let parts: string[] = [];

  // 内含物描述
  if (inclusion && inclusion !== 'none' && inclusionColor) {
    const inclusionMap: { [key: string]: string } = {
      'rutile': '金红石针',
      'tourmaline': '电气石',
      'mica': '云母片',
      'chlorite': '绿泥石'
    };

    const inclusionName = inclusionMap[inclusion] || inclusion;
    const distributionMap: { [key: string]: string } = {
      'internal inclusions': '内部包裹着',
      'surface inclusions': '表面附着',
      'scattered': '散布着',
      'concentrated': '集中分布着'
    };

    const distribution = distributionMap[inclusionDistribution || ''] || '内部包裹着';
    parts.push(`由${distribution}${inclusionColor}${inclusionName}的`);
  }

  // 形状和透明度
  const shapeMap: { [key: string]: string } = {
    'round': '圆形',
    'oval': '椭圆形',
    'square': '方形',
    'heart': '心形',
    'teardrop': '水滴形'
  };

  const transparencyMap: { [key: string]: string } = {
    'transparent': '透明',
    'translucent': '半透明',
    'opaque': '不透明'
  };

  const shape = shapeMap[crystalShape || ''] || '圆形';
  const trans = transparencyMap[transparency || ''] || '透明';

  // 水晶类型
  const crystalName = crystalType && crystalPromptSystem.crystalTypes[crystalType]
    ? crystalPromptSystem.crystalTypes[crystalType].chineseName
    : '白水晶';

  // 加工方式
  const processingMap: { [key: string]: string } = {
    'beads': '珠',
    'cabochon': '蛋面',
    'faceted': '刻面',
    'rough': '原石'
  };

  const processing = processingMap[crystalProcessing || ''] || '珠';

  parts.push(`${shape}${trans}${crystalName}${processing}`);

  return parts.join('');
}

// 获取配件描述
function getAccessoryDescription(metalType?: string, accessories?: string[]): string {
  if (!accessories || accessories.length === 0) {
    return '';
  }

  let parts: string[] = [];

  // 金属类型
  const metalMap: { [key: string]: string } = {
    'silver': '银',
    'gold': '金',
    'rose_gold': '玫瑰金',
    'platinum': '铂金',
    'stainless_steel': '不锈钢'
  };

  const metal = metalMap[metalType || ''] || '银';

  // 配件类型
  const accessoryMap: { [key: string]: string } = {
    'tassels': '流苏',
    'beads': '珠子',
    'charms': '吊坠',
    'spacers': '间隔珠',
    'spacer_beads': '间隔珠', // 保持向后兼容
    'clasps': '扣环',
    'chains': '链条'
  };

  const accessoryNames = accessories.map(acc => accessoryMap[acc] || acc).filter(name => name);

  if (accessoryNames.length > 0) {
    parts.push(`、${metal}的配件和${accessoryNames.join('、')}搭配组成的`);
  } else {
    parts.push(`、一些${metal}的配件搭配组成的`);
  }

  return parts.join('');
}

// 获取珠宝风格描述
function getJewelryStyleDescription(jewelryType?: string, culturalStyle?: string): string {
  const jewelryMap: { [key: string]: string } = {
    'bracelet': '手链',
    'beaded_bracelet': '手串',
    'necklace': '项链',
    'earrings': '耳环',
    'ring': '戒指',
    'pendant': '吊坠'
  };

  const culturalMap: { [key: string]: string } = {
    'chinese_traditional': '中国传统风格',
    'han_tang': '汉唐风格',
    'song_dynasty': '宋代风格',
    'ming_qing': '明清古典',
    'republic_era': '民国风格',
    'buddhist': '佛教风格',
    'jiangnan': '江南风格',
    'northern_china': '北方风格',
    'tibetan': '藏式风格',
    'xinjiang': '新疆风格',
    'yunnan': '云南风格',
    'indian': '印度风格',
    'japanese': '日式风格',
    'korean': '韩式风格',
    'middle_eastern': '中东风格'
  };

  const jewelry = jewelryMap[jewelryType || ''] || '饰品';
  const cultural = culturalMap[culturalStyle || ''] || '中国民族风格';

  return `${cultural}的${jewelry}`;
}

// 获取珠宝类型名称
function getJewelryTypeName(jewelryType?: string): string {
  const jewelryMap: { [key: string]: string } = {
    'bracelet': '手链',
    'beaded_bracelet': '手串',
    'necklace': '项链',
    'earrings': '耳环',
    'ring': '戒指',
    'pendant': '吊坠'
  };

  return jewelryMap[jewelryType || ''] || '饰品';
}

// 获取构图描述
function getCompositionDescription(composition?: string, structuralAesthetics?: string): string {
  const compositionMap: { [key: string]: string } = {
    'golden_ratio': '充分展示了黄金分割的结构美',
    'symmetrical': '呈现完美的对称美感',
    'asymmetrical': '展现自然的不对称美',
    'centered': '突出中心焦点的平衡美',
    'spiral': '体现螺旋式的动态美感',
    'linear': '展示线性排列的秩序美'
  };

  return compositionMap[composition || ''] || '充分展示了结构美';
}

// 获取色彩描述
function getColorDescription(customKeywords?: string[]): string {
  if (!customKeywords || customKeywords.length === 0) {
    return '用色克制过渡自然';
  }

  // 检查是否包含色彩相关关键词
  const colorKeywords = customKeywords.filter(keyword =>
    keyword.includes('色彩') ||
    keyword.includes('颜色') ||
    keyword.includes('过渡') ||
    keyword.includes('克制') ||
    keyword.includes('自然')
  );

  if (colorKeywords.length > 0) {
    return colorKeywords.join('，');
  }

  return '用色克制过渡自然';
}

// 获取背景描述
function getBackgroundDescription(background?: string): string {
  const backgroundMap: { [key: string]: string } = {
    'pure white background': '纯白色',
    'soft gradient background': '柔和渐变',
    'natural light background': '自然光线',
    'studio lighting': '工作室灯光',
    'dark background': '深色背景',
    'transparent background': '透明背景'
  };

  return backgroundMap[background || ''] || '纯白色';
}
