import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { WorkshopTemplateResponse, WorkshopStatus } from '../types';
import { WorkshopTemplateCard } from '../components/workshop-template-card';

interface TemplateGridProps {
  loading: boolean;
  templates: WorkshopTemplateResponse[];
  handleView: (id: string) => void;
  handleEdit: (id: string) => void;
  handleDeleteClick: (template: WorkshopTemplateResponse) => void;
  handleSubmitClick: (template: WorkshopTemplateResponse) => void;
  handleTogglePublish: (template: WorkshopTemplateResponse) => void;
  keyword: string;
  statusFilter: string;
}

export const TemplateGrid = ({
  loading,
  templates,
  handleView,
  handleEdit,
  handleDeleteClick,
  handleSubmitClick,
  handleTogglePublish,
  keyword,
  statusFilter
}: TemplateGridProps) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải mẫu...</p>
        </div>
      </div>
    );
  }

  if (templates.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {templates.map((template) => (
          <div key={template.id} className="flex h-full min-h-0 w-full">
          <WorkshopTemplateCard
            template={template}
            onView={() => handleView(template.id)}
            onEdit={
              (template.status === WorkshopStatus.DRAFT || template.status === WorkshopStatus.REJECTED)
                ? () => handleEdit(template.id)
                : undefined
            }
            onDelete={
              template.status !== WorkshopStatus.ACTIVE
                ? () => handleDeleteClick(template)
                : undefined
            }
            onSubmit={
              (template.status === WorkshopStatus.DRAFT || template.status === WorkshopStatus.REJECTED)
                ? () => handleSubmitClick(template)
                : undefined
            }
            onTogglePublish={
              template.status === WorkshopStatus.ACTIVE
                ? () => handleTogglePublish(template)
                : undefined
            }
          />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
      <div className="mb-4">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <Search className="w-6 h-6 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Không tìm thấy mẫu nào</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
          {keyword || statusFilter !== 'all'
            ? "Không có mẫu nào khớp với bộ lọc hiện tại của bạn. Vui lòng thử điều chỉnh các tiêu chí tìm kiếm."
            : "Bắt đầu bằng cách tạo mẫu workshop đầu tiên của bạn để cung cấp các phiên cho khách hàng."
          }
        </p>
      </div>
      {!keyword && statusFilter === 'all' && (
        <Button onClick={() => navigate('/vendor/workshop-templates/new')} size="lg" className="rounded-xl">
          <PlusCircle className="mr-2 w-5 h-5" />
          Tạo mẫu đầu tiên của bạn
        </Button>
      )}
    </div>
  );
};
