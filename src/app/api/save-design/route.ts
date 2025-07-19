import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 静态导出配置
export const dynamic = 'force-static';
export const revalidate = false;

export async function POST(request: NextRequest) {
  // 使用简单的 supabase 客户端，不依赖 cookies
  // 静态导出时不需要用户认证

  try {
    // 在静态导出模式下，跳过用户认证
    // 实际部署时可以通过其他方式验证用户身份

    const body = await request.json();

    const {
      title,
      description,
      mainStone,
      auxiliaryStones,
      style,
      occasion,
      preferences,
      imageUrl,
      aiAnalysis,
      isPublic = false // 默认不公开
    } = body;

    // 在静态导出模式下，使用默认用户ID
    const finalUserId = 'static-export-user';

    // 保存设计到数据库
    const { data, error } = await supabase
      .from('design_works')
      .insert([
        {
          user_id: finalUserId,
          title,
          description: JSON.stringify(description),
          main_stone: mainStone,
          auxiliary_stones: JSON.stringify(auxiliaryStones),
          style,
          occasion,
          preferences: JSON.stringify(preferences),
          image_url: imageUrl,
          ai_analysis: aiAnalysis,
          is_public: isPublic // 添加is_public字段
        }
      ])
      .select();

    if (error) {
      console.error('保存设计作品失败:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('处理请求时出错:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 