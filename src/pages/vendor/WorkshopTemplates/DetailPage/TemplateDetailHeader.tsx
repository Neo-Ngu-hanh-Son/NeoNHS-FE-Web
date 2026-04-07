import { useNavigate } from "react-router-dom"
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, SendOutlined, GlobalOutlined, EyeInvisibleOutlined } from "@ant-design/icons"
import { Button } from "@/components/ui/button"
import { WorkshopStatus, WorkshopTemplateResponse } from "../types"
import { TemplateStatusBadge } from "../components/template-status-badge"

interface TemplateDetailHeaderProps {
  template: WorkshopTemplateResponse;
  canEdit: boolean;
  canSubmit: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onSubmit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}

export const TemplateDetailHeader = ({
  template,
  canEdit,
  canSubmit,
  canDelete,
  onEdit,
  onSubmit,
  onDelete,
  onTogglePublish
}: TemplateDetailHeaderProps) => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/vendor/workshop-templates")}
        >
          <ArrowLeftOutlined />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{template.name}</h1>
            <TemplateStatusBadge status={template.status} isPublished={template.isPublished} />
          </div>
          <p className="text-muted-foreground">{template.shortDescription}</p>
        </div>
      </div>

      {/* Action Buttons based on status */}
      <div className="flex gap-2">
        {canEdit && (
          <Button onClick={onEdit} className="gap-2">
            <EditOutlined />
            Edit
          </Button>
        )}
        {canSubmit && (
          <Button onClick={onSubmit} variant="default" className="gap-2">
            <SendOutlined />
            Submit for Approval
          </Button>
        )}
        {template.status === WorkshopStatus.ACTIVE && (
          <Button
            onClick={onTogglePublish}
            variant={template.isPublished ? "outline" : "default"}
            className="gap-2"
          >
            {template.isPublished ? (
              <><EyeInvisibleOutlined /> Unpublish</>
            ) : (
              <><GlobalOutlined /> Publish</>
            )}
          </Button>
        )}
        {canDelete && (
          <Button onClick={onDelete} variant="destructive" className="gap-2">
            <DeleteOutlined />
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}
