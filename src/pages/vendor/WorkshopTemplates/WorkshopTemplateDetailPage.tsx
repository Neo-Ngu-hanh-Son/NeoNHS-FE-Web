import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, SendOutlined, CalendarOutlined, UserOutlined, StarFilled, StarOutlined, GlobalOutlined, EyeInvisibleOutlined } from "@ant-design/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { WorkshopStatus, WorkshopTemplateResponse } from "./types"
import { TemplateStatusBadge } from "./components/template-status-badge"
import { RejectionAlert } from "./components/rejection-alert"
import { DeleteTemplateDialog } from "./components/delete-template-dialog"
import { SubmitApprovalDialog } from "./components/submit-approval-dialog"
import { formatPrice, formatDuration, formatDate, formatDateTime } from "./utils/formatters"
import { WorkshopTemplateService } from "@/services/api/workshopTemplateService"
import { notification } from "antd"

export default function WorkshopTemplateDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [template, setTemplate] = useState<WorkshopTemplateResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const [deleteDialog, setDeleteDialog] = useState(false)
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
  const thumbnail = template.images.find(img => img.isThumbnail)?.imageUrl || template.images[0]?.imageUrl

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
      {/* Header */}
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
            <Button onClick={() => navigate(`/vendor/workshop-templates/${id}/edit`)} className="gap-2">
              <EditOutlined />
              Edit
            </Button>
          )}
          {canSubmit && (
            <Button onClick={() => setSubmitDialog(true)} variant="default" className="gap-2">
              <SendOutlined />
              Submit for Approval
            </Button>
          )}
          {template.status === WorkshopStatus.ACTIVE && (
            <Button
              onClick={handleTogglePublish}
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
            <Button onClick={() => setDeleteDialog(true)} variant="destructive" className="gap-2">
              <DeleteOutlined />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Rejection Alert */}
      {template.status === WorkshopStatus.REJECTED && template.adminNote && (
        <RejectionAlert adminNote={template.adminNote} />
      )}

      {/* Locked Message for PENDING/ACTIVE */}
      {template.status === WorkshopStatus.PENDING && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="pt-6">
            <p className="text-sm font-medium">
              ⏳ This template is currently under review and cannot be edited.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Published / Unpublished banner for ACTIVE */}
      {template.status === WorkshopStatus.ACTIVE && (
        <Card className={template.isPublished
          ? "border-green-200 bg-green-50 dark:bg-green-950/20"
          : "border-blue-200 bg-blue-50 dark:bg-blue-950/20"
        }>
          <CardContent className="pt-6">
            <p className="text-sm font-medium">
              {template.isPublished
                ? "🟢 This template is published and visible to tourists in the public catalog."
                : "ℹ️ This template is approved but not yet published. Click 'Publish' to make it visible to tourists."
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          {template.images.length > 0 && (
            <Card className="rounded-2xl border-[#d3e4da] dark:border-white/10 shadow-sm overflow-hidden">
              <div className="relative">
                <img
                  src={thumbnail}
                  alt={template.name}
                  className="w-full h-[400px] object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/800x400?text=No+Image"
                  }}
                />
              </div>
              {template.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4">
                  {template.images.map((img, idx) => (
                    <img
                      key={img.id}
                      src={img.imageUrl}
                      alt={`Workshop image ${idx + 1}`}
                      className={`w-full h-20 object-cover rounded-md cursor-pointer ${img.isThumbnail ? "ring-2 ring-primary" : ""
                        }`}
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/200x200?text=Image"
                      }}
                    />
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Full Description */}
          <Card className="rounded-2xl border-[#d3e4da] dark:border-white/10 shadow-sm">
            <CardHeader>
              <CardTitle>Full Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {template.fullDescription || template.shortDescription}
              </p>
            </CardContent>
          </Card>

          {/* Approval Info for ACTIVE templates */}
          {template.status === WorkshopStatus.ACTIVE && template.reviewedAt && (
            <Card className="rounded-2xl border-green-200 bg-green-50 dark:bg-green-950/20 shadow-sm">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400">Approval Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Approved at:</span> {formatDateTime(template.reviewedAt)}
                </p>
                {template.averageRating != null && (
                  <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-base">
                          {template.averageRating! >= star ? (
                            <StarFilled className="text-amber-500" />
                          ) : template.averageRating! >= star - 0.5 ? (
                            <StarFilled className="text-amber-300" />
                          ) : (
                            <StarOutlined className="text-gray-300 dark:text-gray-600" />
                          )}
                        </span>
                      ))}
                    </div>
                    <span className="font-bold text-lg text-amber-700 dark:text-amber-400">
                      {template.averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({template.totalReview} reviews)
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Workshop Details Card */}
          <Card className="rounded-2xl border-[#d3e4da] dark:border-white/10 shadow-sm">
            <CardHeader>
              <CardTitle>Workshop Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Duration</p>
                <p className="text-base font-semibold">{formatDuration(template.estimatedDuration)}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Base Price</p>
                <p className="text-2xl font-bold text-primary">{formatPrice(template.defaultPrice)}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Participants</p>
                <p className="text-base font-semibold">
                  {template.minParticipants} - {template.maxParticipants} people
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Vendor</p>
                <div className="flex items-center gap-2">
                  <UserOutlined />
                  <p className="text-base">{template.vendorName}</p>
                </div>
              </div>

              {template.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {template.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          style={{
                            borderColor: tag.tagColor + "40",
                            backgroundColor: tag.tagColor + "10",
                            color: tag.tagColor,
                          }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card className="rounded-2xl border-[#d3e4da] dark:border-white/10 shadow-sm">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CalendarOutlined className="text-muted-foreground" />
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-muted-foreground">{formatDate(template.createdAt)}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <CalendarOutlined className="text-muted-foreground" />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-muted-foreground">{formatDate(template.updatedAt)}</p>
                </div>
              </div>
              {template.reviewedAt && template.status === WorkshopStatus.ACTIVE && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarOutlined className="text-green-500" />
                    <div>
                      <p className="font-medium text-green-600 dark:text-green-400">Approved</p>
                      <p className="text-muted-foreground">{formatDate(template.reviewedAt)}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
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
