import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Loader2, Pencil, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { message } from 'antd';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
} from '@/components/ui';

import { knowledgeApi, type KnowledgeDocument } from '@/services/api/knowledgeApi';

type KnowledgeDocumentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingDoc: KnowledgeDocument | null;
  onSaved: () => void;
};

export function KnowledgeDocumentDialog({
  open,
  onOpenChange,
  editingDoc,
  onSaved,
}: KnowledgeDocumentDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingDoc) {
      setTitle(editingDoc.title);
      setContent(editingDoc.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [editingDoc, open]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      message.warning('Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }

    try {
      setLoading(true);
      if (editingDoc) {
        await knowledgeApi.updateDocument(editingDoc.id, {
          title,
          content,
          knowledgeType: 'INFORMATION',
          isActive: editingDoc.isActive,
        });
      } else {
        await knowledgeApi.createDocument({
          title,
          content,
          knowledgeType: 'INFORMATION',
          isActive: true,
        });
      }
      message.success('Đã lưu tài liệu thành công');
      onOpenChange(false);
      onSaved();
    } catch {
      message.error('Lỗi khi lưu tài liệu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            {editingDoc ? (
              <>
                <Pencil size={20} className="text-indigo-600" />
                Chỉnh sửa tài liệu
              </>
            ) : (
              <>
                <Plus size={20} className="text-indigo-600" />
                Thêm tài liệu mới
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết bên dưới. AI sẽ tự động phân tích và học nội dung này (RAG).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="kb-title" className="text-sm font-semibold">
              Tiêu đề bài viết
            </Label>
            <Input
              id="kb-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Chính sách hoàn hủy vé tại Ngũ Hành Sơn"
              className="border-slate-200 focus:ring-indigo-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="kb-content" className="text-sm font-semibold">
              Nội dung chi tiết
            </Label>
            <Textarea
              id="kb-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung mà bạn muốn AI ghi nhớ..."
              className="min-h-[400px] border-slate-200 p-4 font-sans leading-relaxed focus:ring-indigo-500"
            />
            <p className="text-xs italic text-slate-400">* Có thể dùng văn bản thuần hoặc Markdown.</p>
          </div>
        </div>

        <DialogFooter className="border-t pt-4 sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {editingDoc &&
              `Cập nhật lần cuối: ${format(new Date(editingDoc.updatedAt), 'HH:mm dd/MM/yyyy', { locale: vi })}`}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy bỏ
            </Button>
            <Button
              className="min-w-[120px] bg-indigo-600 hover:bg-indigo-700"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : editingDoc ? (
                'Cập nhật AI'
              ) : (
                'Lưu & Đồng bộ'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
