import React, { useRef, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCcw,
  Upload,
  FileText,
  Search,
  Loader2,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { message } from 'antd';

import {
  Button,
  Input,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { knowledgeApi, type KnowledgeDocument } from '@/services/api/knowledgeApi';
import { cn } from '@/lib/utils';
import { KnowledgeDocumentDialog } from './KnowledgeDocumentDialog';

type KnowledgeArticlesTabProps = {
  articles: KnowledgeDocument[];
  loading: boolean;
  onRefresh: () => Promise<void>;
};

export function KnowledgeArticlesTab({ articles, loading, onRefresh }: KnowledgeArticlesTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<KnowledgeDocument | null>(null);
  const [syncingDocs, setSyncingDocs] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<KnowledgeDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocs = articles.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleToggleVisibility = async (id: string, isActive: boolean) => {
    try {
      setSyncingDocs((prev) => ({ ...prev, [id]: true }));
      await knowledgeApi.toggleVisibility(id, isActive);
      message.success(`Đã ${isActive ? 'kích hoạt' : 'ẩn'} tài liệu`);
      await onRefresh();
      setTimeout(() => setSyncingDocs((prev) => ({ ...prev, [id]: false })), 1500);
    } catch {
      message.error('Lỗi khi thay đổi trạng thái');
      setSyncingDocs((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await knowledgeApi.deleteDocument(deleteTarget.id);
      message.success('Đã xóa tài liệu');
      setDeleteTarget(null);
      await onRefresh();
    } catch {
      message.error('Lỗi khi xóa tài liệu');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await knowledgeApi.uploadDocument(file);
      message.success(`Đã tải lên và trích xuất text từ: ${file.name}`);
      setSyncingDocs((prev) => ({ ...prev, [res.id]: true }));
      setTimeout(() => setSyncingDocs((prev) => ({ ...prev, [res.id]: false })), 3000);
      await onRefresh();
    } catch {
      message.error('Lỗi khi tải lên tệp. Hãy chắc chắn tệp là PDF hoặc văn bản.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Alert className="border-indigo-200 bg-indigo-50/80 dark:border-indigo-900 dark:bg-indigo-950/30">
        <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <AlertTitle className="text-indigo-900 dark:text-indigo-100">Tri thức AI (RAG)</AlertTitle>
        <AlertDescription className="text-indigo-800/95 dark:text-indigo-200/90">
          Các bài viết ở đây cung cấp <strong>nguồn kiến thức</strong> để hệ thống tìm và trích đoạn liên
          quan trước khi gửi cho AI — khác với{' '}
          <strong>System Prompt</strong> ở tab &quot;Cấu hình AI&quot;. Chỉ bài{' '}
          <strong>đang hoạt động</strong> được đưa vào RAG.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            className="group flex items-center gap-2 border-slate-200 transition-all hover:bg-slate-100"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Upload size={18} className="transition-transform group-hover:-translate-y-1" />
            )}
            {uploading ? 'Đang xử lý...' : 'Tải tệp lên (.pdf, .txt)'}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.txt,.docx"
          />

          <Button
            className="bg-indigo-600 shadow-md shadow-indigo-100 transition-all hover:scale-105 hover:bg-indigo-700"
            onClick={() => {
              setEditingDoc(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus size={18} className="mr-2" />
            Thêm bài viết
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-none bg-white/80 shadow-sm backdrop-blur-sm">
        <CardHeader className="pb-0">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <CardTitle className="flex flex-col gap-3 text-lg font-semibold sm:flex-row sm:items-center">
              <div className="relative w-full md:w-80">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Tìm kiếm tiêu đề hoặc nội dung..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-none bg-slate-50 pl-10 pr-3 focus-visible:ring-indigo-500"
                />
              </div>
            </CardTitle>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <Badge
                  variant="secondary"
                  className="border-none bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                >
                  {articles.length}
                </Badge>
                Tổng số tài liệu
              </div>
              <div className="flex items-center gap-1.5">
                <Badge
                  variant="secondary"
                  className="border-none bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                >
                  {articles.filter((d) => d.isActive).length}
                </Badge>
                Đang hoạt động
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="mt-6 overflow-x-auto p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[400px]">Tiêu đề tài liệu</TableHead>
                <TableHead>Trạng thái AI (RAG)</TableHead>
                <TableHead>Cập nhật cuối</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredDocs.length > 0 ? (
                  filteredDocs.map((doc, index) => (
                    <TableRow key={doc.id} asChild>
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group border-slate-100 transition-colors hover:bg-indigo-50/30"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                              <FileText size={20} />
                            </div>
                            <span className="max-w-[320px] truncate">{doc.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {syncingDocs[doc.id] ? (
                            <div className="flex animate-pulse items-center gap-2 text-xs font-semibold text-indigo-600">
                              <RefreshCcw size={14} className="animate-spin" />
                              Đang đồng bộ AI...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={doc.isActive}
                                onCheckedChange={(checked) => handleToggleVisibility(doc.id, checked)}
                                className="data-[state=checked]:bg-emerald-500"
                              />
                              <span
                                className={cn(
                                  'text-xs font-medium',
                                  doc.isActive ? 'text-emerald-600' : 'text-slate-400',
                                )}
                              >
                                {doc.isActive ? 'Đang hoạt động' : 'Đã ẩn'}
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {format(new Date(doc.updatedAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                                    onClick={() => {
                                      setEditingDoc(doc);
                                      setIsDialogOpen(true);
                                    }}
                                  >
                                    <Pencil size={16} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Chỉnh sửa</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                              onClick={() => setDeleteTarget(doc)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      {loading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="animate-spin text-indigo-600" size={32} />
                          <span className="font-medium text-slate-400">Đang tải dữ liệu...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                            <Search size={32} />
                          </div>
                          <div className="font-medium text-slate-400">Không tìm thấy tài liệu tri thức nào</div>
                          <Button variant="outline" size="sm" onClick={() => void onRefresh()}>
                            Làm mới
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Alert className="border-indigo-100 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/20">
        <Info className="h-4 w-4 text-indigo-600" />
        <AlertTitle className="text-sm font-bold text-indigo-900 dark:text-indigo-100">
          Cách hoạt động của RAG
        </AlertTitle>
        <AlertDescription className="text-xs leading-relaxed text-indigo-800 dark:text-indigo-200/90">
          Khi tài liệu ở trạng thái <strong>Đang hoạt động</strong>, nó được đưa vào bộ nhớ tìm kiếm. Hệ
          thống dùng RAG (Retrieval-Augmented Generation) để trích các đoạn liên quan trước khi gửi cho
          model, giúp câu trả lời sát với nội dung bạn đã cung cấp.
        </AlertDescription>
      </Alert>

      <KnowledgeDocumentDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingDoc(null);
        }}
        editingDoc={editingDoc}
        onSaved={onRefresh}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tài liệu?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. AI sẽ không thể truy cập thông tin từ tài liệu này nữa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => void handleDelete()}
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
