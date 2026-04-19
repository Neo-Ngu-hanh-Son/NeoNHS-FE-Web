import React, { useState, useEffect, useRef } from 'react';
import {
    Plus,
    Pencil,
    Trash2,
    BookOpen,
    RefreshCcw,
    Upload,
    FileText,
    Search,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import {
    Button,
    Input,
    Textarea,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Badge,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Label,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui';

import { knowledgeApi, KnowledgeDocument } from '../../../services/api/knowledgeApi';
import { message } from 'antd'; // Keeping antd message for simple notifications for now, or use a custom toast if available
import { cn } from '@/lib/utils';

export default function KnowledgeBasePage() {
    const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState<KnowledgeDocument | null>(null);
    const [syncingDocs, setSyncingDocs] = useState<Record<string, boolean>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [uploading, setUploading] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const res = await knowledgeApi.getDocuments(0, 100);
            // Handle Spring Page object or direct array
            const data = Array.isArray(res) ? res : (res.content || []);
            setDocuments(data);
        } catch (error) {
            message.error('Không thể tải cơ sở dữ liệu tri thức');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        if (editingDoc) {
            setTitle(editingDoc.title);
            setContent(editingDoc.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [editingDoc]);

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            message.warning('Vui lòng nhập đầy đủ tiêu đề và nội dung');
            return;
        }

        try {
            setLoading(true);
            let res: KnowledgeDocument;
            if (editingDoc) {
                res = await knowledgeApi.updateDocument(editingDoc.id, { title, content });
                setSyncingDocs(prev => ({ ...prev, [res.id || editingDoc.id]: true }));
                setTimeout(() => setSyncingDocs(prev => ({ ...prev, [res.id || editingDoc.id]: false })), 2000);
            } else {
                res = await knowledgeApi.createDocument({ title, content });
                setSyncingDocs(prev => ({ ...prev, [res.id]: true }));
                setTimeout(() => setSyncingDocs(prev => ({ ...prev, [res.id]: false })), 2000);
            }
            message.success('Đã lưu tài liệu thành công');
            setIsDialogOpen(false);
            fetchDocuments();
        } catch (error) {
            message.error('Lỗi khi lưu tài liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await knowledgeApi.deleteDocument(id);
            message.success('Đã xóa tài liệu');
            fetchDocuments();
        } catch (error) {
            message.error('Lỗi khi xóa tài liệu');
        }
    };

    const handleToggleVisibility = async (id: string, isActive: boolean) => {
        try {
            setSyncingDocs(prev => ({ ...prev, [id]: true }));
            await knowledgeApi.toggleVisibility(id, isActive);

            // Update local state for immediate feedback
            setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, isActive } : doc));

            message.success(`Đã ${isActive ? 'kích hoạt' : 'ẩn'} tài liệu`);
            setTimeout(() => setSyncingDocs(prev => ({ ...prev, [id]: false })), 1500);
        } catch (error) {
            message.error('Lỗi khi thay đổi trạng thái');
            setSyncingDocs(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const res = await knowledgeApi.uploadDocument(file);
            message.success(`Đã tải lên và trích xuất text từ: ${file.name}`);
            setSyncingDocs(prev => ({ ...prev, [res.id]: true }));
            setTimeout(() => setSyncingDocs(prev => ({ ...prev, [res.id]: false })), 3000);
            fetchDocuments();
        } catch (error) {
            message.error('Lỗi khi tải lên tệp. Hãy chắc chắn tệp là PDF hoặc văn bản.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const filteredDocs = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto space-y-6"
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-indigo-600 rounded-lg shadow-indigo-200 shadow-lg text-white">
                                <BookOpen size={24} />
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                Quản lý Tri thức AI
                            </h1>
                        </div>
                        <p className="text-slate-500 mt-2 max-w-2xl">
                            Cung cấp dữ liệu để AI (RAG) có thể trả lời các câu hỏi về chính sách, giá vé và thông tin chi tiết của khu di tích.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="border-slate-200 hover:bg-slate-100 transition-all flex items-center gap-2 group"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} className="group-hover:-translate-y-1 transition-transform" />}
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
                            className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all hover:scale-105"
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

                {/* Stats & Search */}
                <Card className="border-none shadow-sm overflow-hidden bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Search size={18} className="text-slate-400" />
                                <div className="relative w-full md:w-80">
                                    <Input
                                        placeholder="Tìm kiếm tiêu đề hoặc nội dung..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-slate-50 border-none focus-visible:ring-indigo-500"
                                    />
                                </div>
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none">
                                        {documents.length}
                                    </Badge>
                                    Tổng số tài liệu
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none">
                                        {documents.filter(d => d.isActive).length}
                                    </Badge>
                                    Đang hoạt động
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="mt-6 p-0 overflow-x-auto">
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
                                            <TableRow
                                                key={doc.id}
                                                asChild
                                            >
                                                <motion.tr
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="group hover:bg-indigo-50/30 transition-colors border-slate-100"
                                                >
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                                                <FileText size={20} />
                                                            </div>
                                                            <span className="truncate max-w-[320px]">{doc.title}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {syncingDocs[doc.id] ? (
                                                            <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold animate-pulse">
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
                                                                <span className={cn(
                                                                    "text-xs font-medium",
                                                                    doc.isActive ? "text-emerald-600" : "text-slate-400"
                                                                )}>
                                                                    {doc.isActive ? 'Đang hoạt động' : 'Đã ẩn'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-slate-500 text-sm">
                                                        {format(new Date(doc.updatedAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
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

                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Xác nhận xóa tài liệu?</DialogTitle>
                                                                        <DialogDescription>
                                                                            Hành động này không thể hoàn tác. AI sẽ không thể truy cập thông tin từ tài liệu này nữa.
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <DialogFooter>
                                                                        <Button variant="outline" onClick={() => { }}>Hủy</Button>
                                                                        <Button variant="destructive" onClick={() => handleDelete(doc.id)}>Xác nhận xóa</Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
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
                                                        <span className="text-slate-400 font-medium">Đang tải dữ liệu...</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                            <Search size={32} />
                                                        </div>
                                                        <div className="text-slate-400 font-medium">Không tìm thấy tài liệu tri thức nào</div>
                                                        <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); fetchDocuments(); }}>
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

                {/* Dialog for Add/Edit */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[800px] gap-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                {editingDoc ? (
                                    <>
                                        <Pencil size={20} className="text-indigo-600" />
                                        Chỉnh sửa Tài liệu
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} className="text-indigo-600" />
                                        Thêm Tài liệu mới
                                    </>
                                )}
                            </DialogTitle>
                            <DialogDescription>
                                Điền thông tin chi tiết bên dưới. AI sẽ tự động phân tích và học nội dung này.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title" className="text-sm font-semibold">Tiêu đề bài viết</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="VD: Chính sách hoàn hủy vé tại Ngũ Hành Sơn"
                                    className="border-slate-200 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="content" className="text-sm font-semibold">Nội dung chi tiết</Label>
                                <Textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Nhập nội dung mà bạn muốn AI ghi nhớ..."
                                    className="min-h-[400px] border-slate-200 focus:ring-indigo-500 font-sans leading-relaxed p-4"
                                />
                                <p className="text-xs text-slate-400 italic">
                                    * Bạn có thể sử dụng định dạng văn bản thô hoặc Markdown.
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="sm:justify-between border-t pt-4">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                {editingDoc && `Cập nhật lần cuối: ${format(new Date(editingDoc.updatedAt), 'HH:mm dd/MM/yyyy')}`}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy bỏ</Button>
                                <Button
                                    className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : (editingDoc ? 'Cập nhật AI' : 'Lưu & Đồng bộ')}
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Info Alert */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-4 items-start">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <AlertCircle size={18} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-indigo-900">Cách hoạt động của RAG</h4>
                        <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
                            Khi tài liệu ở trạng thái <strong>Đang hoạt động</strong>, nó sẽ được đưa vào bộ nhớ của AI.
                            Hệ thống sử dụng kỹ thuật RAG (Retrieval-Augmented Generation) để trích xuất những đoạn văn bản liên quan nhất
                            trước khi gửi cho model Gemini, giúp câu trả lời cực kỳ chính xác với thực tế của khu di tích.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
