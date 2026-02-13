import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SessionForm } from "./session-form"
import { WorkshopSessionFormData, CreateWorkshopSessionRequest } from "../types"

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
  
  const handleSubmit = (data: WorkshopSessionFormData) => {
    // Transform form data to API request format
    const createRequest: CreateWorkshopSessionRequest = {
      workshopTemplateId: data.workshopTemplateId,
      startTime: data.startTime.toISOString(),
      endTime: data.endTime.toISOString(),
      price: data.price,
      maxParticipants: data.maxParticipants,
    }
    
    // TODO: Call API to create session
    console.log('Creating new session:', createRequest)
    // In real implementation:
    // const newSession = await workshopSessionApi.create(createRequest)
    // The session will be created with status: SCHEDULED
    
    // Close dialog and refresh
    onOpenChange(false)
    if (onSuccess) onSuccess()
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
        />
      </DialogContent>
    </Dialog>
  )
}
