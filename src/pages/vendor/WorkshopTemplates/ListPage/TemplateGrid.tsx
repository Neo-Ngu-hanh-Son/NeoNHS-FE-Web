import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
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
          <p className="text-muted-foreground">Loading templates...</p>
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
    <div className="text-center py-12 border-2 border-dashed rounded-lg">
      <div className="mb-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <SearchOutlined className="text-3xl text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No templates found</h3>
        <p className="text-muted-foreground mb-4">
          {keyword || statusFilter !== 'all'
            ? "No templates match your current filters. Try adjusting your search criteria."
            : "Get started by creating your first workshop template to offer sessions to customers."
          }
        </p>
      </div>
      {!keyword && statusFilter === 'all' && (
        <Button onClick={() => navigate('/vendor/workshop-templates/new')} size="lg">
          <PlusCircleOutlined className="mr-2" />
          Create Your First Template
        </Button>
      )}
    </div>
  );
};
