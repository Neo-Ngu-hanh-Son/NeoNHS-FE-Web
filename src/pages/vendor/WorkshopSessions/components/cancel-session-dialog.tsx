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
      <AlertDialogContent className="sm:rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Hủy phiên này?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p className="text-sm">
              Bạn đang yêu cầu hủy bỏ <span className="font-semibold text-foreground">"{sessionName}"</span>.
            </p>
            {enrollmentCount > 0 && (
              <p className="font-medium text-destructive">
                ⚠️ Lưu ý: Phiên này đã có {enrollmentCount} học viên đăng ký. Hệ thống sẽ tự động gửi thông báo hủy đến tất cả học viên.
              </p>
            )}
            <p className="text-sm">Hành động này không thể hoàn tác. Bạn có chắc chắn muốn tiếp tục?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">Giữ Lại Phiên</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
          >
            Xác Nhận Hủy
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
