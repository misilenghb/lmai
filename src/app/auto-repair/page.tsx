'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RepairStatusMonitor } from '@/components/repair-status-monitor';

interface RepairResult {
  category: string;
  name: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  details?: any;
  timestamp: string;
}

interface RepairSummary {
  totalChecks: number;
  successCount: number;
  errorCount: number;
  warningCount: number;
  repairsAttempted: number;
  repairsSuccessful: number;
}

export default function AutoRepairPage() {
  const [repairCompleted, setRepairCompleted] = useState(false);
  const [repairSuccess, setRepairSuccess] = useState(false);

  const handleRepairComplete = (success: boolean) => {
    setRepairCompleted(true);
    setRepairSuccess(success);
  };





  return (
    <div className="container mx-auto py-10 max-w-6xl">
      <div className="space-y-6">
        {/* 主修复监控 */}
        <RepairStatusMonitor
          onRepairComplete={handleRepairComplete}
          autoStart={true}
        />

        {/* 修复完成后的操作指南 */}
        {repairCompleted && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {repairSuccess ? '🎉 修复成功' : '⚠️ 需要手动处理'}
              </CardTitle>
              <CardDescription>
                {repairSuccess
                  ? '数据库连接问题已自动修复，系统现在应该可以正常工作了。'
                  : '自动修复完成，但仍有一些问题需要手动处理。'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {repairSuccess ? (
                <Alert>
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="font-semibold">✅ 修复成功！接下来您可以：</div>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>返回首页开始使用系统</li>
                        <li>测试用户注册和登录功能</li>
                        <li>验证数据保存和读取功能</li>
                        <li>如有问题，可以重新运行修复</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="font-semibold">⚠️ 需要手动处理的问题：</div>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>检查 Cloudflare Pages 环境变量配置</li>
                        <li>验证 Supabase 项目状态和权限</li>
                        <li>确认数据库表格创建成功</li>
                        <li>检查网络连接和防火墙设置</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                {repairSuccess && (
                  <Button
                    onClick={() => window.location.href = '/'}
                    variant="default"
                  >
                    🏠 返回首页
                  </Button>
                )}
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  🔄 重新修复
                </Button>
                <Button
                  onClick={() => window.location.href = '/deployment-check'}
                  variant="outline"
                >
                  📋 详细诊断
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 帮助信息 */}
        <Card>
          <CardHeader>
            <CardTitle>📚 修复说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">🔧 自动修复功能：</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>检查环境变量配置</li>
                  <li>验证数据库连接状态</li>
                  <li>自动创建缺失的表格</li>
                  <li>修复权限和安全策略</li>
                  <li>验证修复结果</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🆘 如果修复失败：</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>检查 Cloudflare Pages 环境变量</li>
                  <li>确认 Supabase 项目未暂停</li>
                  <li>验证 API 密钥有效性</li>
                  <li>查看详细错误日志</li>
                  <li>联系技术支持</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
