import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CancelSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionName: string
  enrollmentCount: number
  onConfirm: () => void
}

export function CancelSessionDialog({
  open,
  onOpenChange,
  sessionName,
  enrollmentCount,
  onConfirm,
}: CancelSessionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this session?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              You are about to cancel <span className="font-semibold text-foreground">"{sessionName}"</span>.
            </p>
            {enrollmentCount > 0 && (
              <p className="font-medium text-destructive">
                ⚠️ Warning: This session has {enrollmentCount} enrolled participant{enrollmentCount !== 1 ? 's' : ''}. They will be notified of the cancellation.
              </p>
            )}
            <p>This action cannot be undone. Do you want to proceed?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Session</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Cancel Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
