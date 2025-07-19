"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, 
  Clock, 
  Trash2, 
  Download, 
  Eye,
  MoreHorizontal,
  Search
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useCreativeWorkshop } from '@/contexts/CreativeWorkshopContext';
import { useToast } from '@/hooks/use-toast';
import type { DesignStateInput } from '@/types/design';

interface DesignHistoryItem {
  id: string;
  timestamp: number;
  designInput: DesignStateInput;
  prompt?: string;
  imageUrls?: string[];
  name?: string;
}

const DesignHistory: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<DesignHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<DesignHistoryItem[]>([]);
  const { setDesignInput, setPrompt } = useCreativeWorkshop();
  const { toast } = useToast();

  // 从localStorage加载历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('creative-workshop-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistoryItems(parsed);
      } catch (error) {
        console.error('Failed to parse design history:', error);
      }
    }
  }, []);

  // 保存历史记录到localStorage
  const saveHistory = (items: DesignHistoryItem[]) => {
    try {
      localStorage.setItem('creative-workshop-history', JSON.stringify(items));
      setHistoryItems(items);
    } catch (error) {
      console.error('Failed to save design history:', error);
    }
  };

  // 添加新的历史记录项
  const addHistoryItem = (designInput: DesignStateInput, prompt?: string, imageUrls?: string[]) => {
    const newItem: DesignHistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      designInput,
      prompt,
      imageUrls,
      name: `设计 ${new Date().toLocaleString()}`
    };

    const updatedItems = [newItem, ...historyItems].slice(0, 50); // 保留最近50个
    saveHistory(updatedItems);
  };

  // 删除历史记录项
  const deleteHistoryItem = (id: string) => {
    const updatedItems = historyItems.filter(item => item.id !== id);
    saveHistory(updatedItems);
    toast({
      title: '已删除',
      description: '设计历史记录已删除',
    });
  };

  // 清空所有历史记录
  const clearAllHistory = () => {
    saveHistory([]);
    toast({
      title: '已清空',
      description: '所有设计历史记录已清空',
    });
  };

  // 应用历史记录
  const applyHistoryItem = (item: DesignHistoryItem) => {
    setDesignInput(item.designInput);
    if (item.prompt) {
      setPrompt(item.prompt);
    }
    toast({
      title: '已应用设计',
      description: `已恢复到 "${item.name}" 的设计状态`,
    });
  };

  // 导出历史记录
  const exportHistory = () => {
    const dataStr = JSON.stringify(historyItems, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `design-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: '导出成功',
      description: '设计历史记录已导出到文件',
    });
  };

  // 搜索过滤
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(historyItems);
    } else {
      const filtered = historyItems.filter(item => 
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.prompt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.designInput.designCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.designInput.overallDesignStyle?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [historyItems, searchQuery]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="luxury-card h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 luxury-text-gradient">
            <History className="w-5 h-5" />
            设计历史
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportHistory}
              disabled={historyItems.length === 0}
              className="luxury-button-hover"
            >
              <Download className="w-4 h-4 mr-1" />
              导出
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="luxury-button-hover">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={clearAllHistory} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  清空所有记录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索设计历史..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 luxury-input"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{searchQuery ? '未找到匹配的设计记录' : '暂无设计历史记录'}</p>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="luxury-card p-4 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(item.timestamp)}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => applyHistoryItem(item)}>
                          <Eye className="w-4 h-4 mr-2" />
                          应用此设计
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteHistoryItem(item.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.designInput.designCategory && (
                      <Badge variant="secondary" className="text-xs">
                        {item.designInput.designCategory}
                      </Badge>
                    )}
                    {item.designInput.overallDesignStyle && (
                      <Badge variant="secondary" className="text-xs">
                        {item.designInput.overallDesignStyle}
                      </Badge>
                    )}
                    {item.designInput.mainStones?.[0]?.crystalType && (
                      <Badge variant="secondary" className="text-xs">
                        {item.designInput.mainStones[0].crystalType}
                      </Badge>
                    )}
                  </div>
                  
                  {item.prompt && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.prompt}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DesignHistory;
