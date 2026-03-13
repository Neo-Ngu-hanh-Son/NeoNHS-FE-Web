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
import { AlertTriangle } from "lucide-react"
import { WorkshopSessionService } from "@/services/api/workshopSessionService"
import { WorkshopTemplateService } from "@/services/api/workshopTemplateService"
import { WorkshopTemplateResponse } from "../../WorkshopTemplates/types"
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
      startTime: data.startTime.toISOString(),
      endTime: data.endTime.toISOString(),
      price: data.price,
      maxParticipants: data.maxParticipants,
    }
    
    try {
      setSubmitting(true)
      const updatedSession = await WorkshopSessionService.updateSession(session.id, updateRequest)
      
      notification.success({
        message: 'Session Updated',
        description: updatedSession?.workshopTemplate?.name
          ? `Session for "${updatedSession.workshopTemplate.name}" has been updated successfully.`
          : 'Workshop session has been updated successfully.'
      })
      
      // Close dialog and refresh
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error('Update failed:', error)
      notification.error({
        message: 'Update Failed',
        description: error.message || 'Failed to update session. Please try again.',
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
          <DialogTitle>Edit Workshop Session</DialogTitle>
          <DialogDescription>
            Update the schedule, pricing, or capacity for this session.
          </DialogDescription>
        </DialogHeader>
        
        {!canEdit ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Cannot Edit Session</AlertTitle>
            <AlertDescription>
              Only SCHEDULED sessions can be edited. This session is {session.status}.
            </AlertDescription>
          </Alert>
        ) : (
          <SessionForm
            defaultValues={session}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditing={true}
            submitting={submitting}
            template={template}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
