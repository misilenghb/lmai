"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Layers,
  Radar as RadarIcon,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

interface EnergyModel3D {
  physical: number;
  mental: number;
  spiritual: number;
  balance: number;
}

interface EnergyChartsProps {
  energyModel: EnergyModel3D;
  language: string;
}

const EnergyCharts: React.FC<EnergyChartsProps> = ({ energyModel, language }) => {
  const [chartType, setChartType] = React.useState<'cards' | 'radar' | 'bar' | 'pie'>('radar');

  // 准备图表数据
  const chartData = React.useMemo(() => {
    const radarData = [
      {
        subject: language === 'zh' ? '身体能量' : 'Physical',
        value: energyModel.physical || 0,
        fullMark: 100
      },
      {
        subject: language === 'zh' ? '心理能量' : 'Mental',
        value: energyModel.mental || 0,
        fullMark: 100
      },
      {
        subject: language === 'zh' ? '精神能量' : 'Spiritual',
        value: energyModel.spiritual || 0,
        fullMark: 100
      },
      {
        subject: language === 'zh' ? '平衡指数' : 'Balance',
        value: energyModel.balance || 0,
        fullMark: 100
      }
    ];

    const barData = [
      {
        name: language === 'zh' ? '身体能量' : 'Physical',
        value: energyModel.physical || 0,
        color: 'hsl(var(--destructive))'
      },
      {
        name: language === 'zh' ? '心理能量' : 'Mental',
        value: energyModel.mental || 0,
        color: 'hsl(var(--secondary))'
      },
      {
        name: language === 'zh' ? '精神能量' : 'Spiritual',
        value: energyModel.spiritual || 0,
        color: 'hsl(var(--primary))'
      },
      {
        name: language === 'zh' ? '平衡指数' : 'Balance',
        value: energyModel.balance || 0,
        color: 'hsl(var(--success))'
      }
    ];

    const pieData = [
      {
        name: language === 'zh' ? '身体能量' : 'Physical',
        value: energyModel.physical || 0,
        color: 'hsl(var(--destructive))'
      },
      {
        name: language === 'zh' ? '心理能量' : 'Mental',
        value: energyModel.mental || 0,
        color: 'hsl(var(--secondary))'
      },
      {
        name: language === 'zh' ? '精神能量' : 'Spiritual',
        value: energyModel.spiritual || 0,
        color: 'hsl(var(--primary))'
      }
    ];

    return { radarData, barData, pieData };
  }, [energyModel, language]);

  return (
    <div className="space-y-4">
      {/* 图表类型切换按钮 */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={chartType === 'cards' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setChartType('cards')}
          className="flex items-center gap-2"
        >
          <Layers className="h-4 w-4" />
          {language === 'zh' ? '卡片视图' : 'Card View'}
        </Button>
        <Button
          variant={chartType === 'radar' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setChartType('radar')}
          className="flex items-center gap-2"
        >
          <RadarIcon className="h-4 w-4" />
          {language === 'zh' ? '雷达图' : 'Radar Chart'}
        </Button>
        <Button
          variant={chartType === 'bar' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setChartType('bar')}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          {language === 'zh' ? '柱状图' : 'Bar Chart'}
        </Button>
        <Button
          variant={chartType === 'pie' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setChartType('pie')}
          className="flex items-center gap-2"
        >
          <PieChartIcon className="h-4 w-4" />
          {language === 'zh' ? '饼图' : 'Pie Chart'}
        </Button>
      </div>

      {/* 图表显示区域 */}
      {chartType === 'radar' && (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData.radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={false}
              />
              <Radar
                name="Energy Level"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip 
                formatter={(value: any) => [`${value}%`, language === 'zh' ? '能量值' : 'Energy Level']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartType === 'bar' && (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value: any) => [`${value}%`, language === 'zh' ? '能量值' : 'Energy Level']}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartType === 'pie' && (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="hsl(var(--primary))"
                dataKey="value"
              >
                {chartData.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [`${value}%`, language === 'zh' ? '能量值' : 'Energy Level']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default EnergyCharts;
