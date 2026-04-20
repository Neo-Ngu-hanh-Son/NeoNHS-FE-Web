import { useEffect, useState } from 'react';
import { Info, Loader2, Save } from 'lucide-react';
import { message } from 'antd';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

import {
  knowledgeApi,
  type KnowledgeDocument,
} from '@/services/api/knowledgeApi';
import { DEFAULT_SYSTEM_PROMPT_TITLE } from '../constants';

type AiSystemPromptTabProps = {
  systemPromptDoc: KnowledgeDocument | null;
  onRefresh: () => Promise<void>;
};

export function AiSystemPromptTab({ systemPromptDoc, onRefresh }: AiSystemPromptTabProps) {
  const [title, setTitle] = useState(DEFAULT_SYSTEM_PROMPT_TITLE);
  const [content, setContent] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (systemPromptDoc) {
      setTitle(systemPromptDoc.title || DEFAULT_SYSTEM_PROMPT_TITLE);
      setContent(systemPromptDoc.content ?? '');
      setIsActive(systemPromptDoc.isActive);
    } else {
      setTitle(DEFAULT_SYSTEM_PROMPT_TITLE);
      setContent('');
      setIsActive(true);
    }
  }, [systemPromptDoc]);

  const handleSave = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      message.warning('Nội dung System Prompt không được để trống');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: title.trim() || DEFAULT_SYSTEM_PROMPT_TITLE,
        content: trimmed,
        knowledgeType: 'SYSTEM_PROMPT' as const,
        isActive,
      };

      if (systemPromptDoc) {
        await knowledgeApi.updateDocument(systemPromptDoc.id, payload);
        message.success('Đã cập nhật System Prompt');
      } else {
        await knowledgeApi.createDocument(payload);
        message.success('Đã tạo System Prompt');
      }
      await onRefresh();
    } catch {
      message.error('Không thể lưu System Prompt');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Alert className="border-amber-200 bg-amber-50/90 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40">
        <Info className="h-4 w-4 text-amber-700 dark:text-amber-400" />
        <AlertTitle className="text-amber-900 dark:text-amber-100">
          Lưu ý quan trọng khi chỉnh System Prompt
        </AlertTitle>
        <AlertDescription className="text-amber-900/90 dark:text-amber-200/90">
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            <li>
              <strong>Không xóa</strong> thẻ{' '}
              <code className="rounded bg-amber-100 px-1 py-0.5 text-xs dark:bg-amber-900/80">
                [TRANSFER_TO_HUMAN]
              </code>{' '}
              nếu muốn giữ tính năng chuyển sang nhân viên hỗ trợ.
            </li>
            <li>
              Không đổi loại tài liệu (<code className="text-xs">knowledgeType</code>) của bản ghi này sau
              khi đã tạo — backend chỉ đọc document có loại{' '}
              <strong>SYSTEM_PROMPT</strong>.
            </li>
            <li>
              Thay đổi có hiệu lực cho các tin nhắn <strong>tiếp theo</strong>, không cần khởi động lại
              server.
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      <Alert className="border-indigo-200 bg-indigo-50/80 dark:border-indigo-900 dark:bg-indigo-950/30">
        <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <AlertTitle className="text-indigo-900 dark:text-indigo-100">System Prompt là gì?</AlertTitle>
        <AlertDescription className="text-indigo-800/95 dark:text-indigo-200/90">
          Đây là nơi cấu hình, đưa ra các quy tắc, hành vi để AI chatbot hoạt động. Sẽ định nghĩa được AI như thế nào khi trả lời các câu hỏi, các tác vụ.

        </AlertDescription>
      </Alert>

      <Card className="border-slate-200 shadow-sm dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg">Chỉnh sửa System Prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="sys-prompt-title">Tiêu đề (khuyến nghị giữ mặc định)</Label>
            <Input
              id="sys-prompt-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="max-w-xl border-slate-200"
            />
          </div>

          {/* <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/40">
            <div>
              <p className="text-sm font-medium">Kích hoạt System Prompt</p>
              <p className="text-xs text-muted-foreground">
                Khi tắt, backend có thể không áp dụng bản ghi này (tuỳ logic server).
              </p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div> */}

          <div className="grid gap-2">
            <Label htmlFor="sys-prompt-content">Nội dung prompt</Label>
            <Textarea
              id="sys-prompt-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập quy tắc, vai trò và hành vi mong muốn của AI..."
              className="min-h-[420px] border-slate-200 font-sans leading-relaxed"
            />
          </div>

          <div className="flex justify-end border-t pt-4">
            <Button
              className="min-w-[140px] bg-indigo-600 hover:bg-indigo-700"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu cấu hình
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
