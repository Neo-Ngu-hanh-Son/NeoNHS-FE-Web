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
  
  if (!session) return null

  // Can only edit SCHEDULED sessions
  const canEdit = session.status === SessionStatus.SCHEDULED

  const handleSubmit = (data: WorkshopSessionFormData) => {
    // Transform form data to API request format
    const updateRequest: UpdateWorkshopSessionRequest = {
      startTime: data.startTime.toISOString(),
      endTime: data.endTime.toISOString(),
      price: data.price,
      maxParticipants: data.maxParticipants,
    }
    
    // TODO: Call API to update session
    console.log('Updating session:', session.id, updateRequest)
    // In real implementation:
    // const updatedSession = await workshopSessionApi.update(session.id, updateRequest)
    
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
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
