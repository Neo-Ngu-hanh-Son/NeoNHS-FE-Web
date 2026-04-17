import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const TemplateHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-gradient-to-b from-slate-50 to-white dark:from-white/5 dark:to-transparent p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Mẫu Workshop</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Tạo và quản lý các mẫu workshop của bạn</p>
        </div>
        <Button
          size="lg"
          onClick={() => navigate('/vendor/workshop-templates/new')}
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          Tạo mẫu mới
        </Button>
      </div>
    </div>
  );
};
