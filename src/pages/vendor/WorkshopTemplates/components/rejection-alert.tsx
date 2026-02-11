import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface RejectionAlertProps {
  rejectReason: string
  onDismiss?: () => void
}

export function RejectionAlert({ rejectReason }: RejectionAlertProps) {
  return (
    <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/20">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="text-lg font-semibold">Your template was rejected</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p className="font-medium">{rejectReason}</p>
        <p className="text-sm mt-3 text-muted-foreground">
          Please address the issues mentioned above and resubmit your template for approval.
        </p>
      </AlertDescription>
    </Alert>
  )
}
