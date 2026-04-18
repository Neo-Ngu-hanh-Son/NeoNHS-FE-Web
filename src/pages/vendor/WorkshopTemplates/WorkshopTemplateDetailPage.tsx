import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { WorkshopStatus, WorkshopTemplateResponse } from "./types"
import { DeleteTemplateDialog } from "./components/delete-template-dialog"
import { SubmitApprovalDialog } from "./components/submit-approval-dialog"
import { WorkshopTemplateService } from "@/services/api/workshopTemplateService"
import { WorkshopSessionService } from "@/services/api/workshopSessionService"
import { notification } from "antd"
import { WorkshopSessionResponse } from "../WorkshopSessions/types"

import { TemplateDetailHeader } from "./DetailPage/TemplateDetailHeader"
import { TemplateDetailAlerts } from "./DetailPage/TemplateDetailAlerts"
import { TemplateDetailContent } from "./DetailPage/TemplateDetailContent"
import { TemplateDetailSidebar } from "./DetailPage/TemplateDetailSidebar"

export default function WorkshopTemplateDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [template, setTemplate] = useState<WorkshopTemplateResponse | null>(null)
  const [sessions, setSessions] = useState<WorkshopSessionResponse[]>([])
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

      // Get up to 10 upcoming sessions for this template
      try {
        const sessionData = await WorkshopSessionService.getSessionsByTemplate(id, { page: 0, size: 10 })
        setSessions(sessionData.content || [])
      } catch (e) {
        console.error('Failed to fetch sessions:', e)
      }
    } catch (error: any) {
      console.error('Failed to fetch template:', error)
      notification.error({
        message: 'Tải Mẫu Thất Bại',
        description: error.message || 'Không thể lấy thông tin chi tiết của mẫu.',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Đang tải mẫu...</p>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-bold">Không Tìm Thấy Mẫu</h2>
        <p className="text-muted-foreground">Mẫu workshop bạn đang tìm kiếm không tồn tại.</p>
        <Button onClick={() => navigate("/vendor/workshop-templates")}>
          Về Danh Sách Mẫu
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
        message: 'Đã Xóa Mẫu',
        description: `Mẫu "${template.name}" đã được xóa thành công.`
      })

      navigate("/vendor/workshop-templates")
    } catch (error: any) {
      console.error('Delete failed:', error)
      notification.error({
        message: 'Xóa Thất Bại',
        description: error.message || 'Không thể xóa mẫu. Vui lòng thử lại.',
      })
    }
  }

  const handleSubmit = async () => {
    if (!template) return

    try {
      await WorkshopTemplateService.submitForApproval(template.id)

      notification.success({
        message: 'Đã Gửi Phê Duyệt',
        description: `Mẫu "${template.name}" đã được gửi cho admin xem xét.`
      })

      // Refresh the template to show updated status
      await fetchTemplate()
    } catch (error: any) {
      console.error('Submit failed:', error)
      notification.error({
        message: 'Gửi Thất Bại',
        description: error.message || 'Không thể gửi mẫu. Vui lòng thử lại.',
      })
    }
  }

  const handleTogglePublish = async () => {
    if (!template) return

    try {
      await WorkshopTemplateService.togglePublish(template.id)

      notification.success({
        message: template.isPublished ? 'Đã Ẩn Khỏi Danh Mục' : 'Đã Xuất Bản',
        description: template.isPublished
          ? `Mẫu "${template.name}" đã bị ẩn và sẽ không hiển thị trên danh mục chung.`
          : `Mẫu "${template.name}" hiện đã được xuất bản và hiển thị cho khách du lịch!`
      })

      // Refresh the template to show updated status
      await fetchTemplate()
    } catch (error: any) {
      console.error('Toggle publish failed:', error)
      notification.error({
        message: 'Thay Đổi Liên Kết Thất Bại',
        description: error.message || 'Không thể thay đổi trạng thái xuất bản. Vui lòng thử lại.',
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto py-8 px-4">
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
          sessions={sessions}
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
