import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface QuickCreateBulkGenerateConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  existingAudioCount: number;
  totalCount: number;
}

export default function QuickCreateBulkGenerateConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  existingAudioCount,
  totalCount,
}: QuickCreateBulkGenerateConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tạo lại toàn bộ audio?</AlertDialogTitle>
          <AlertDialogDescription>
            Hiện đã có <strong>{existingAudioCount}/{totalCount}</strong> ngôn ngữ đã được tạo audio.
            Thao tác này sẽ <strong>tạo lại toàn bộ audio</strong> cho tất cả ngôn ngữ, bao gồm cả các mục đã hoàn
            thành. Điều này sẽ tiêu tốn thêm quota ElevenLabs và thời gian xử lý.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Xác nhận tạo lại</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
