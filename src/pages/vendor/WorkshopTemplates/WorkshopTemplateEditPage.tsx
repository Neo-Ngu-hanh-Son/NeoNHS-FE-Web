import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeftOutlined, SendOutlined } from "@ant-design/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WorkshopTemplateForm } from "./components/workshop-template-form"
import { WorkshopTemplateFormData, UpdateWorkshopTemplateRequest, WorkshopStatus, WorkshopTemplateResponse } from "./types"
import { TemplateStatusBadge } from "./components/template-status-badge"
import { RejectionAlert } from "./components/rejection-alert"
import { SubmitApprovalDialog } from "./components/submit-approval-dialog"
import { WorkshopTemplateService } from "@/services/api/workshopTemplateService"
import { notification } from "antd"
import { Lightbulb } from "lucide-react"

export default function WorkshopTemplateEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [template, setTemplate] = useState<WorkshopTemplateResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitDialog, setSubmitDialog] = useState(false)

  useEffect(() => {
    if (id) {
      fetchTemplate()
    }
  }, [id])

  const fetchTemplate = async () => {
    if (!id) return

    try {
      setLoading(true)
      const data = await WorkshopTemplateService.getTemplateById(id)
      setTemplate(data)
    } catch (error: any) {
      console.error('Failed to fetch template:', error)
      notification.error({
        message: 'Failed to Load Template',
        description: error.message || 'Unable to fetch template details.',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <p className="text-muted-foreground">Loading template...</p>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-bold">Template Not Found</h2>
        <p className="text-muted-foreground">The workshop template you're trying to edit doesn't exist.</p>
        <Button onClick={() => navigate("/vendor/workshop-templates")}>
          Back to Templates
        </Button>
      </div>
    )
  }

  const canEdit = template.status === WorkshopStatus.DRAFT || template.status === WorkshopStatus.REJECTED

  if (!canEdit) {
    return (
      <div className="flex flex-col gap-6 max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/vendor/workshop-templates/${id}`)}
          >
            <ArrowLeftOutlined />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Cannot Edit Template</h1>
            <p className="text-muted-foreground">{template.name}</p>
          </div>
        </div>

        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="pt-6">
            <p className="font-medium">
              This template is currently <TemplateStatusBadge status={template.status} isPublished={template.isPublished} size="sm" /> and cannot be edited.
            </p>
            <p className="text-sm mt-2 text-muted-foreground">
              {template.status === WorkshopStatus.PENDING
                ? "The template is under admin review. Please wait for approval or rejection."
                : template.isPublished
                  ? "This template is active and published. Contact admin to make changes."
                  : "This template is approved. Contact admin to make changes."
              }
            </p>
            <Button
              className="mt-4"
              onClick={() => navigate(`/vendor/workshop-templates/${id}`)}
            >
              View Template Details
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (data: WorkshopTemplateFormData) => {
    if (!id) return

    const imageUrls = data.imageUrls.filter((url): url is string => typeof url === "string")

    const updateRequest: UpdateWorkshopTemplateRequest = {
      name: data.name,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      estimatedDuration: data.estimatedDuration,
      defaultPrice: data.defaultPrice,
      minParticipants: data.minParticipants,
      maxParticipants: data.maxParticipants,
      imageUrls,
      thumbnailIndex: data.thumbnailIndex,
      tagIds: data.tagIds,
    }

    try {
      setSubmitting(true)
      const updatedTemplate = await WorkshopTemplateService.updateTemplate(id, updateRequest)

      notification.success({
        message: 'Template Updated',
        description: `Template "${updatedTemplate.name}" has been updated successfully.`
      })

      navigate(`/vendor/workshop-templates/${id}`)
    } catch (error: any) {
      console.error('Update failed:', error)
      notification.error({
        message: 'Update Failed',
        description: error.message || 'Failed to update template. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate(`/vendor/workshop-templates/${id}`)
  }

  const handleSubmitForApproval = async () => {
    if (!id) return

    try {
      await WorkshopTemplateService.submitForApproval(id)

      notification.success({
        message: 'Submitted for Approval',
        description: 'Template has been submitted for admin review.'
      })

      navigate(`/vendor/workshop-templates/${id}`)
    } catch (error: any) {
      console.error('Submit failed:', error)
      notification.error({
        message: 'Submission Failed',
        description: error.message || 'Failed to submit template. Please try again.',
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={handleCancel}
          >
            <ArrowLeftOutlined />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">Edit Template</h1>
              <TemplateStatusBadge status={template.status} isPublished={template.isPublished} size="sm" />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{template.name}</p>
          </div>
        </div>

        <Button
          onClick={() => setSubmitDialog(true)}
          variant="default"
          className="gap-2"
        >
          <SendOutlined />
          Submit for Approval
        </Button>
      </div>

      {/* Rejection Alert */}
      {template.status === WorkshopStatus.REJECTED && template.adminNote && (
        <RejectionAlert adminNote={template.adminNote} />
      )}

      {/* Tip Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 px-4 py-3">
        <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Tip:</strong> After saving your changes, you can submit this template for admin approval.
          Once submitted, you won't be able to edit it until it's approved or rejected.
        </p>
      </div>

      {/* Form (contains its own section cards) */}
      <WorkshopTemplateForm
        defaultValues={template}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={true}
        submitting={submitting}
      />

      {/* Submit for Approval Dialog */}
      <SubmitApprovalDialog
        open={submitDialog}
        onOpenChange={setSubmitDialog}
        templateName={template.name}
        onConfirm={handleSubmitForApproval}
      />
    </div>
  )
}
