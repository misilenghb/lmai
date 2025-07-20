'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Save, AlertCircle } from 'lucide-react';

interface SecurityQuestion {
  question: string;
  answer: string;
}

interface SecurityQuestionsSetupProps {
  onSave?: (questions: SecurityQuestion[]) => void;
  initialQuestions?: SecurityQuestion[];
}

const PREDEFINED_QUESTIONS = [
  '您的第一只宠物叫什么名字？',
  '您的出生城市是哪里？',
  '您最喜欢的颜色是什么？',
  '您的小学校名是什么？',
  '您母亲的姓名是什么？',
  '您最喜欢的电影是什么？',
  '您的第一个老师叫什么名字？',
  '您最喜欢的食物是什么？',
  '您的童年昵称是什么？',
  '您第一次旅行去了哪里？'
];

export default function SecurityQuestionsSetup({ 
  onSave, 
  initialQuestions = [
    { question: '', answer: '' },
    { question: '', answer: '' },
    { question: '', answer: '' }
  ]
}: SecurityQuestionsSetupProps) {
  const [questions, setQuestions] = useState<SecurityQuestion[]>(initialQuestions);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const updateQuestion = (index: number, field: 'question' | 'answer', value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');

    // 验证所有问题和答案都已填写
    const emptyFields = questions.some(q => !q.question.trim() || !q.answer.trim());
    if (emptyFields) {
      setError('请填写所有安全问题和答案');
      setIsLoading(false);
      return;
    }

    // 检查问题是否重复
    const questionTexts = questions.map(q => q.question);
    const uniqueQuestions = new Set(questionTexts);
    if (uniqueQuestions.size !== questionTexts.length) {
      setError('请选择不同的安全问题');
      setIsLoading(false);
      return;
    }

    try {
      if (onSave) {
        await onSave(questions);
        setMessage('安全问题设置成功！');
      }
    } catch (error) {
      setError('保存失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <CardTitle>设置安全问题</CardTitle>
        </div>
        <CardDescription>
          设置3个安全问题，用于密码找回。请选择您能够记住答案的问题。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                安全问题 {index + 1}
              </span>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`question-${index}`}>选择问题</Label>
              <Select
                value={question.question}
                onValueChange={(value) => updateQuestion(index, 'question', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择一个安全问题" />
                </SelectTrigger>
                <SelectContent>
                  {PREDEFINED_QUESTIONS.map((q, qIndex) => (
                    <SelectItem key={qIndex} value={q}>
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`answer-${index}`}>您的答案</Label>
              <Input
                id={`answer-${index}`}
                type="text"
                value={question.answer}
                onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
                placeholder="请输入您的答案"
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                答案不区分大小写，但请确保您能够准确记住
              </p>
            </div>
          </div>
        ))}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isLoading ? '保存中...' : '保存安全问题'}
          </Button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">安全提示：</p>
              <ul className="space-y-1 text-xs">
                <li>• 请选择您能够确定记住答案的问题</li>
                <li>• 答案验证时不区分大小写</li>
                <li>• 密码找回时需要正确回答至少2个问题</li>
                <li>• 请定期检查和更新您的安全问题</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
