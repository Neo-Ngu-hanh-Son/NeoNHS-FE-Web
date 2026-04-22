import { BookOpen } from 'lucide-react';

export function KnowledgeBasePageHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-600 p-2 text-white shadow-lg shadow-indigo-200">
            <BookOpen size={24} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Quản lý Tri thức AI
          </h1>
        </div>
        <p className="mt-2 max-w-2xl text-slate-500">
          Cấu hình hành vi AI và dữ liệu RAG để chatbot trả lời đúng chính sách, giá vé và thông tin khu di
          tích.
        </p>
      </div>
    </div>
  );
}
