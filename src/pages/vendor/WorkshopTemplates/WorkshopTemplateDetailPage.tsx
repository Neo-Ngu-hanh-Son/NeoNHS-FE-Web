import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { WorkshopStatus, WorkshopTemplateResponse } from "./types"
import { DeleteTemplateDialog } from "./components/delete-template-dialog"
import { SubmitApprovalDialog } from "./components/submit-approval-dialog"
import { WorkshopTemplateService } from "@/services/api/workshopTemplateService"
import { notification } from "antd"

import { TemplateDetailHeader } from "./DetailPage/TemplateDetailHeader"
import { TemplateDetailAlerts } from "./DetailPage/TemplateDetailAlerts"
import { TemplateDetailContent } from "./DetailPage/TemplateDetailContent"
import { TemplateDetailSidebar } from "./DetailPage/TemplateDetailSidebar"

export default function WorkshopTemplateDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [template, setTemplate] = useState<WorkshopTemplateResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const [deleteDialog, setDeleteDialog] = useState(false)
  const [submitDialog, setSubmitDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined)

  const displayImage = selectedImage
    ?? template?.images.find(img => img.isThumbnail)?.imageUrl
    ?? template?.images[0]?.imageUrl

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading template...</p>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-bold">Template Not Found</h2>
        <p className="text-muted-foreground">The workshop template you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/vendor/workshop-templates")}>
          Back to Templates
        </Button>
      </div>
    )
  }

  const canEdit = template.status === WorkshopStatus.DRAFT || template.status === WorkshopStatus.REJECTED
  const canDelete = template.status !== WorkshopStatus.ACTIVE
  const canSubmit = template.status === WorkshopStatus.DRAFT || template.status === WorkshopStatus.REJECTED

  const handleDelete = async () => {
    if (!template) return

    try {
      await WorkshopTemplateService.deleteTemplate(template.id)

      notification.success({
        message: 'Template Deleted',
        description: `Template "${template.name}" has been deleted successfully.`
      })

      navigate("/vendor/workshop-templates")
    } catch (error: any) {
      console.error('Delete failed:', error)
      notification.error({
        message: 'Delete Failed',
        description: error.message || 'Failed to delete template. Please try again.',
      })
    }
  }

  const handleSubmit = async () => {
    if (!template) return

    try {
      await WorkshopTemplateService.submitForApproval(template.id)

      notification.success({
        message: 'Submitted for Approval',
        description: `Template "${template.name}" has been submitted for admin review.`
      })

      // Refresh the template to show updated status
      await fetchTemplate()
    } catch (error: any) {
      console.error('Submit failed:', error)
      notification.error({
        message: 'Submission Failed',
        description: error.message || 'Failed to submit template. Please try again.',
      })
    }
  }

  const handleTogglePublish = async () => {
    if (!template) return

    try {
      await WorkshopTemplateService.togglePublish(template.id)

      notification.success({
        message: template.isPublished ? 'Template Unpublished' : 'Template Published',
        description: template.isPublished
          ? `Template "${template.name}" has been unpublished and is now hidden from the public catalog.`
          : `Template "${template.name}" is now published and visible to tourists!`
      })

      // Refresh the template to show updated status
      await fetchTemplate()
    } catch (error: any) {
      console.error('Toggle publish failed:', error)
      notification.error({
        message: 'Toggle Publish Failed',
        description: error.message || 'Failed to toggle publish status. Please try again.',
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <TemplateDetailHeader
        template={template}
        canEdit={canEdit}
        canSubmit={canSubmit}
        canDelete={canDelete}
        onEdit={() => navigate(`/vendor/workshop-templates/${id}/edit`)}
        onSubmit={() => setSubmitDialog(true)}
        onDelete={() => setDeleteDialog(true)}
        onTogglePublish={handleTogglePublish}
      />

      <TemplateDetailAlerts template={template} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TemplateDetailContent
          template={template}
          displayImage={displayImage}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />

        <TemplateDetailSidebar template={template} />
      </div>

      {/* Dialogs */}
      <DeleteTemplateDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        templateName={template.name}
        onConfirm={handleDelete}
      />

      <SubmitApprovalDialog
        open={submitDialog}
        onOpenChange={setSubmitDialog}
        templateName={template.name}
        onConfirm={handleSubmit}
      />
    </div>
  )
}
