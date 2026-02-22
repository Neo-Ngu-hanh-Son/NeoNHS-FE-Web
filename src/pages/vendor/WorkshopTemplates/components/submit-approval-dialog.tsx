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

interface SubmitApprovalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  templateName: string
  onConfirm: () => void
}

export function SubmitApprovalDialog({
  open,
  onOpenChange,
  templateName,
  onConfirm,
}: SubmitApprovalDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Submit template for approval?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              You are about to submit <span className="font-semibold text-foreground">"{templateName}"</span> for admin approval.
            </p>
            <p className="font-medium text-yellow-600 dark:text-yellow-500">
              ⚠️ Once submitted, you will not be able to edit this template until it is approved or rejected.
            </p>
            <p>Do you want to proceed?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Submit for Approval
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
