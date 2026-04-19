import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SessionForm } from "./session-form"
import { WorkshopSessionFormData, CreateWorkshopSessionRequest } from "../types"
import { WorkshopSessionService } from "@/services/api/workshopSessionService"
import { formatDateForApi } from "../utils/formatters"
import { notification } from "antd"
import { useState } from "react"
import { CalendarPlus } from "lucide-react"

interface CreateSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preselectedDate?: Date
  onSuccess?: () => void
}

export function CreateSessionDialog({
  open,
  onOpenChange,
  preselectedDate,
  onSuccess,
}: CreateSessionDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  
  const handleSubmit = async (data: WorkshopSessionFormData) => {
    // Transform form data to API request format
    const createRequest: CreateWorkshopSessionRequest = {
      workshopTemplateId: data.workshopTemplateId,
      startTime: formatDateForApi(data.startTime),
      endTime: formatDateForApi(data.endTime),
      price: data.price,
      maxParticipants: data.maxParticipants,
    }
    
    try {
      setSubmitting(true)
      const newSession = await WorkshopSessionService.createSession(createRequest)
      
      notification.success({
        message: 'Tạo Thành Công',
        description: newSession?.workshopTemplate?.name 
          ? `Phiên workshop "${newSession.workshopTemplate.name}" đã được tạo.`
          : 'Phiên workshop đã được tạo thành công.'
      })
      
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error: any) {
      //console.error('Create failed:', error)
      notification.error({
        message: 'Tạo Thất Bại',
        description: error.message || 'Không thể tạo phiên workshop. Vui lòng thử lại.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleBatchSubmit = async (batchRequests: CreateWorkshopSessionRequest[]) => {
    try {
      setSubmitting(true)
      await WorkshopSessionService.createBatchSessions(batchRequests)
      
      notification.success({
        message: 'Tạo Thành Công',
        description: `Đã tạo thành công ${batchRequests.length} phiên workshop liên tiếp.`
      })
      
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error: any) {
      //console.error('Batch create failed:', error)
      notification.error({
        message: 'Tạo Thất Bại',
        description: error.message || 'Không thể tạo danh sách phiên workshop. Vui lòng thử lại.',
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
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center">
              <CalendarPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <DialogTitle className="text-xl">Lên Lịch Workshop</DialogTitle>
              <DialogDescription className="text-xs pt-1">
                Chọn mẫu, thiết lập thời gian và theo dõi lịch trình liên tiếp.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="px-6 pb-6 pt-4">
          <SessionForm
            preselectedDate={preselectedDate}
            onSubmit={handleSubmit}
            onBatchSubmit={handleBatchSubmit}
            onCancel={handleCancel}
            isEditing={false}
            submitting={submitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
