import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircleOutlined } from '@ant-design/icons';

export const TemplateHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Workshop Templates</h1>
        <p className="text-muted-foreground">Create and manage your workshop definitions</p>
      </div>
      <Button
        size="lg"
        onClick={() => navigate('/vendor/workshop-templates/new')}
        className="gap-2"
      >
        <PlusCircleOutlined className="text-lg" />
        Create New Template
      </Button>
    </div>
  );
};
