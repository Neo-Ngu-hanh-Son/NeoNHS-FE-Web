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
        message: 'Session Created',
        description: newSession?.workshopTemplate?.name 
          ? `Session for "${newSession.workshopTemplate.name}" has been created successfully.`
          : 'Workshop session has been created successfully.'
      })
      
      // Close dialog and refresh
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error('Create failed:', error)
      notification.error({
        message: 'Creation Failed',
        description: error.message || 'Failed to create session. Please try again.',
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Workshop Session</DialogTitle>
          <DialogDescription>
            Schedule a new session for your workshop. Select a template and set the date, time, and capacity.
          </DialogDescription>
        </DialogHeader>
        
        <SessionForm
          preselectedDate={preselectedDate}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={false}
          submitting={submitting}
        />
      </DialogContent>
    </Dialog>
  )
}
