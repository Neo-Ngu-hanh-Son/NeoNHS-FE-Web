import { Alert } from "antd"

interface RejectionAlertProps {
  adminNote: string
  onDismiss?: () => void
}

export function RejectionAlert({ adminNote }: RejectionAlertProps) {
  return (
    <Alert
      message={<span className="text-lg font-semibold">Mẫu workshop của bạn đã bị từ chối</span>}
      description={
        <div className="mt-2 space-y-2">
          <p className="font-medium">{adminNote}</p>
          <p className="text-sm mt-3 text-muted-foreground">
            Vui lòng giải quyết các vấn đề được nêu trên và gửi lại mẫu workshop cho phê duyệt.
          </p>
        </div>
      }
      type="error"
      showIcon
      className="border-red-200 bg-red-50 dark:bg-red-950/20"
    />
  )
}
