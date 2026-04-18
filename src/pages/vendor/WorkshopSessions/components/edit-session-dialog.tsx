import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SessionForm } from "./session-form"
import { WorkshopSessionFormData, UpdateWorkshopSessionRequest, WorkshopSessionResponse, SessionStatus } from "../types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Pencil } from "lucide-react"
import { WorkshopSessionService } from "@/services/api/workshopSessionService"
import { WorkshopTemplateService } from "@/services/api/workshopTemplateService"
import { WorkshopTemplateResponse } from "../../WorkshopTemplates/types"
import { formatDateForApi } from "../utils/formatters"
import { notification } from "antd"
import { useState, useEffect } from "react"

interface EditSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: WorkshopSessionResponse | null
  onSuccess?: () => void
}

export function EditSessionDialog({
  open,
  onOpenChange,
  session,
  onSuccess,
}: EditSessionDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  const [template, setTemplate] = useState<WorkshopTemplateResponse | undefined>()

  useEffect(() => {
    if (!session) return
    WorkshopTemplateService.getTemplateById(session.workshopTemplate.id)
      .then(setTemplate)
      .catch(() => setTemplate(undefined))
  }, [session?.workshopTemplate.id])

  if (!session) return null

  // Can only edit SCHEDULED sessions
  const canEdit = session.status === SessionStatus.SCHEDULED

  const handleSubmit = async (data: WorkshopSessionFormData) => {
    // Transform form data to API request format
    const updateRequest: UpdateWorkshopSessionRequest = {
      startTime: formatDateForApi(data.startTime),
      endTime: formatDateForApi(data.endTime),
      price: data.price,
      maxParticipants: data.maxParticipants,
    }
    
    try {
      setSubmitting(true)
      const updatedSession = await WorkshopSessionService.updateSession(session.id, updateRequest)
      
      notification.success({
        message: 'Cập Nhật Thành Công',
        description: updatedSession?.workshopTemplate?.name
          ? `Đã cập nhật phiên cho "${updatedSession.workshopTemplate.name}".`
          : 'Đã cập nhật phiên workshop thành công.'
      })
      
      // Close dialog and refresh
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error('Update failed:', error)
      notification.error({
        message: 'Cập Nhật Thất Bại',
        description: error.message || 'Không thể cập nhật phiên. Vui lòng thử lại.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto sm:rounded-2xl border-slate-100 p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center">
              <Pencil className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-xl">Chỉnh Sửa Phiên Workshop</DialogTitle>
              <DialogDescription className="text-xs pt-1">
                Cập nhật lịch trình, mức giá hoặc số lượng người tham gia của phiên này.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="px-6 pb-6 pt-4">
          {!canEdit ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Không Thể Chỉnh Sửa</AlertTitle>
              <AlertDescription>
                Chỉ những phiên có trạng thái "Đã lên lịch" (SCHEDULED) mới có thể chỉnh sửa. Phiên hiện tại đang ở trạng thái {session.status}.
              </AlertDescription>
            </Alert>
          ) : (
          <SessionForm
            key={session.id}
            defaultValues={session}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditing={true}
            submitting={submitting}
            template={template}
          />
        )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
