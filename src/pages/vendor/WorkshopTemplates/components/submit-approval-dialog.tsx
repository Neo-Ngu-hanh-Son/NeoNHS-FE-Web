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
          <AlertDialogTitle>Gửi mẫu workshop cho phê duyệt?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Bạn đang chuẩn bị gửi mẫu workshop <span className="font-semibold text-foreground">"{templateName}"</span> cho admin phê duyệt.
            </p>
            <p className="font-medium text-yellow-600 dark:text-yellow-500">
              ⚠️ Sau khi gửi, bạn sẽ không thể chỉnh sửa mẫu này cho đến khi nó được phê duyệt hoặc bị từ chối.
            </p>
            <p>Bạn có muốn tiếp tục?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Gửi Cho Phê Duyệt
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
