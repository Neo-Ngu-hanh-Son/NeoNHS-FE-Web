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

interface DeleteTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  templateName: string
  onConfirm: () => void
}

export function DeleteTemplateDialog({
  open,
  onOpenChange,
  templateName,
  onConfirm,
}: DeleteTemplateDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa mẫu workshop này?</AlertDialogTitle>
          <AlertDialogDescription>
            Thao tác này không thể hoàn tác. Mẫu workshop này sẽ bị xóa{" "}
            <span className="font-semibold text-foreground">"{templateName}"</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
