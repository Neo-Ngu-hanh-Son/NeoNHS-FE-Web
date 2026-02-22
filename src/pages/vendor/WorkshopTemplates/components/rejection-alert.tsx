import { Alert } from "antd"

interface RejectionAlertProps {
  rejectReason: string
  onDismiss?: () => void
}

export function RejectionAlert({ rejectReason }: RejectionAlertProps) {
  return (
    <Alert
      message={<span className="text-lg font-semibold">Your template was rejected</span>}
      description={
        <div className="mt-2 space-y-2">
          <p className="font-medium">{rejectReason}</p>
          <p className="text-sm mt-3 text-muted-foreground">
            Please address the issues mentioned above and resubmit your template for approval.
          </p>
        </div>
      }
      type="error"
      showIcon
      className="border-red-200 bg-red-50 dark:bg-red-950/20"
    />
  )
}
