import { NextRequest, NextResponse } from 'next/server';
import { getDailyGuidance } from '@/ai/flows/daily-guidance-flow';

// 静态导出配置
export const dynamic = 'force-static';
export const revalidate = false;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile, targetDate, language } = body;

    // 验证必需的参数
    if (!userProfile || !targetDate) {
      return NextResponse.json(
        { error: '缺少必需的参数: userProfile 和 targetDate' },
        { status: 400 }
      );
    }

    // 调用AI流程获取每日指导
    const result = await getDailyGuidance({
      userProfile,
      targetDate,
      language: language || 'zh'
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Daily guidance API error:', error);
    
    // 返回备用内容而不是错误，确保用户体验
    const fallbackResult = {
      guidance: '今日能量建议：保持内心平静，专注当下的美好。相信自己拥有无限的潜能和力量。',
      meditationPrompt: '闭上眼睛，深呼吸三次，感受内心的宁静与力量。让正能量充满整个身体。',
      date: new Date().toISOString().split('T')[0],
      language: 'zh'
    };

    return NextResponse.json({
      success: true,
      data: fallbackResult,
      fallback: true
    });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const targetDate = searchParams.get('targetDate');
  const language = searchParams.get('language') || 'zh';

  if (!targetDate) {
    return NextResponse.json(
      { error: '缺少必需的参数: targetDate' },
      { status: 400 }
    );
  }

  try {
    // 对于GET请求，使用默认的用户配置
    const defaultProfile = {
      name: '用户',
      coreEnergyInsights: '平衡的能量状态',
      inferredZodiac: '处女座',
      inferredElement: '土',
      mbtiLikeType: 'ISFJ'
    };

    const result = await getDailyGuidance({
      userProfile: defaultProfile,
      targetDate,
      language
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Daily guidance GET API error:', error);
    
    const fallbackResult = {
      guidance: '今日能量建议：保持内心平静，专注当下的美好。',
      meditationPrompt: '深呼吸，让心灵与宇宙能量连接，感受当下的和谐。',
      date: targetDate,
      language: language || 'zh'
    };

    return NextResponse.json({
      success: true,
      data: fallbackResult,
      fallback: true
    });
  }
}
