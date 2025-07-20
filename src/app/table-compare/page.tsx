'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Database, CheckCircle, XCircle, AlertTriangle, Plus, Minus } from 'lucide-react';

interface FieldComparison {
  fieldName: string;
  localType?: string;
  dbType?: string;
  status: 'match' | 'missing_in_db' | 'missing_in_local' | 'type_mismatch';
  localDefinition?: string;
  dbDefinition?: string;
}

interface TableComparison {
  tableName: string;
  existsInLocal: boolean;
  existsInDb: boolean;
  fields: FieldComparison[];
}

export default function TableComparePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [comparisons, setComparisons] = useState<TableComparison[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const executeComparison = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/table-compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'compare' })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setComparisons(result.comparisons);
        setSummary(result.summary);
      } else {
        console.error('对比失败:', result.error);
      }
    } catch (error) {
      console.error('对比异常:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFixSQL = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/table-compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generateSQL' })
      });
      
      const result = await response.json();
      
      if (result.success && result.sql) {
        // 下载 SQL 文件
        const blob = new Blob([result.sql], { type: 'text/sql' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'table-fix.sql';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('生成 SQL 失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'match':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'missing_in_db':
        return <Plus className="h-4 w-4 text-blue-600" />;
      case 'missing_in_local':
        return <Minus className="h-4 w-4 text-orange-600" />;
      case 'type_mismatch':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: any } = {
      match: { variant: "default", text: "匹配" },
      missing_in_db: { variant: "secondary", text: "数据库缺失" },
      missing_in_local: { variant: "outline", text: "本地缺失" },
      type_mismatch: { variant: "destructive", text: "类型不匹配" }
    };
    
    const config = variants[status] || { variant: "outline", text: "未知" };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-blue-600" />
              <CardTitle>表格字段对比工具</CardTitle>
            </div>
            <CardDescription>
              对比本地表格定义与数据库实际表格字段，识别差异并生成修复 SQL
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={executeComparison} 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                <Database className="h-4 w-4" />
                开始对比
              </Button>
              
              {comparisons.length > 0 && (
                <Button 
                  onClick={generateFixSQL} 
                  disabled={isLoading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  生成修复 SQL
                </Button>
              )}
            </div>

            {summary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">{summary.totalTables}</div>
                    <div className="text-sm text-gray-600">总表格数</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">{summary.missingTables}</div>
                    <div className="text-sm text-gray-600">缺失表格</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-600">{summary.missingFields}</div>
                    <div className="text-sm text-gray-600">缺失字段</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">{summary.typeMismatches}</div>
                    <div className="text-sm text-gray-600">类型不匹配</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {comparisons.length > 0 && (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="details">详细对比</TabsTrigger>
              <TabsTrigger value="missing">缺失项</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>表格概览</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>表格名称</TableHead>
                        <TableHead>本地存在</TableHead>
                        <TableHead>数据库存在</TableHead>
                        <TableHead>字段总数</TableHead>
                        <TableHead>问题字段</TableHead>
                        <TableHead>状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisons.map((table) => {
                        const problemFields = table.fields.filter(f => f.status !== 'match').length;
                        const isHealthy = table.existsInLocal && table.existsInDb && problemFields === 0;
                        
                        return (
                          <TableRow key={table.tableName}>
                            <TableCell className="font-medium">{table.tableName}</TableCell>
                            <TableCell>
                              {table.existsInLocal ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                            </TableCell>
                            <TableCell>
                              {table.existsInDb ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                            </TableCell>
                            <TableCell>{table.fields.length}</TableCell>
                            <TableCell>
                              {problemFields > 0 && (
                                <Badge variant="destructive">{problemFields}</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {isHealthy ? (
                                <Badge variant="default">正常</Badge>
                              ) : (
                                <Badge variant="destructive">需要修复</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              {comparisons.map((table) => (
                <Card key={table.tableName}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      {table.tableName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>字段名称</TableHead>
                          <TableHead>本地类型</TableHead>
                          <TableHead>数据库类型</TableHead>
                          <TableHead>状态</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {table.fields.map((field) => (
                          <TableRow key={field.fieldName}>
                            <TableCell className="font-medium">{field.fieldName}</TableCell>
                            <TableCell>{field.localType || '-'}</TableCell>
                            <TableCell>{field.dbType || '-'}</TableCell>
                            <TableCell className="flex items-center gap-2">
                              {getStatusIcon(field.status)}
                              {getStatusBadge(field.status)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="missing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>需要修复的项目</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comparisons.map((table) => {
                      const problemFields = table.fields.filter(f => f.status !== 'match');
                      if (problemFields.length === 0) return null;
                      
                      return (
                        <div key={table.tableName} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">{table.tableName}</h4>
                          <div className="space-y-2">
                            {problemFields.map((field) => (
                              <div key={field.fieldName} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(field.status)}
                                  <span className="font-medium">{field.fieldName}</span>
                                </div>
                                {getStatusBadge(field.status)}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
