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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import type { AdminWorkshopTemplateResponse } from "./types"
import { CheckCircle, XCircle } from "lucide-react"

interface ApproveTemplateDialogProps {
  template: AdminWorkshopTemplateResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (adminNote?: string) => void
}

export function ApproveTemplateDialog({
  template,
  open,
  onOpenChange,
  onConfirm,
}: ApproveTemplateDialogProps) {
  const [adminNote, setAdminNote] = useState("")

  const handleConfirm = () => {
    onConfirm(adminNote.trim())
    setAdminNote("")
  }
  if (!template) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            Duyệt mẫu workshop
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-foreground">
              <p className="text-sm">
                Bạn sắp duyệt <strong>{template.name}</strong> của{" "}
                <strong>{template.vendorName}</strong>.
              </p>

              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm dark:border-green-800 dark:bg-green-950/20">
                <p className="mb-2 font-medium text-green-800 dark:text-green-200">
                  Thao tác này sẽ:
                </p>
                <ul className="list-disc space-y-1 pl-4 text-green-700 dark:text-green-300">
                  <li>
                    Cho phép mẫu workshop <strong>hiển thị</strong> theo quy tắc hệ thống
                  </li>
                  <li>
                    Cho phép Đối tác <strong>tạo phiên</strong> từ mẫu này
                  </li>
                  <li>
                    Cho phép khách hàng <strong>đặt / đăng ký</strong> phiên (khi đã mở bán)
                  </li>
                  <li>
                    Gửi <strong>email thông báo</strong> tới Đối tác (nếu hệ thống bật)
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm dark:border-blue-800 dark:bg-blue-950/20">
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  Thông tin mẫu:
                </p>
                <div className="mt-2 space-y-1 text-blue-700 dark:text-blue-300">
                  <p>
                    <strong>Thời lượng:</strong> {template.estimatedDuration} phút
                  </p>
                  <p>
                    <strong>Giá:</strong>{" "}
                    {template.defaultPrice.toLocaleString("vi-VN")} VND
                  </p>
                  <p>
                    <strong>Sức chứa:</strong> {template.minParticipants}–
                    {template.maxParticipants} người
                  </p>
                  <p>
                    <strong>Đối tác:</strong>{" "}
                    {template.vendorVerified ? "Đã xác minh" : "Chưa xác minh"}
                  </p>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-4">
          <Label htmlFor="approve-notes">Ghi chú quản trị (tuỳ chọn)</Label>
          <Textarea
            id="approve-notes"
            placeholder="Ghi chú nội bộ về lần duyệt này…"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Ghi chú là tuỳ chọn, chỉ phục vụ lưu hồ sơ nội bộ.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="transition-colors" onClick={() => setAdminNote("")}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-green-600 transition-colors hover:bg-green-700"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Duyệt mẫu
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface RejectTemplateDialogProps {
  template: AdminWorkshopTemplateResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string) => void
}

export function RejectTemplateDialog({
  template,
  open,
  onOpenChange,
  onConfirm,
}: RejectTemplateDialogProps) {
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  const handleConfirm = () => {
    if (reason.trim().length < 10) {
      setError("Vui lòng nhập lý do chi tiết (tối thiểu 10 ký tự).")
      return
    }
    onConfirm(reason)
    setReason("")
    setError("")
  }

  const handleCancel = () => {
    setReason("")
    setError("")
    onOpenChange(false)
  }

  if (!template) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <XCircle className="h-5 w-5" />
            Từ chối mẫu workshop
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-foreground">
              <p className="text-sm">
                Bạn sắp từ chối <strong>{template.name}</strong> của{" "}
                <strong>{template.vendorName}</strong>.
              </p>

              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm dark:border-red-800 dark:bg-red-950/20">
                <p className="mb-2 font-medium text-red-800 dark:text-red-200">
                  Thao tác này sẽ:
                </p>
                <ul className="list-disc space-y-1 pl-4 text-red-700 dark:text-red-300">
                  <li>
                    Đặt trạng thái mẫu thành <strong>REJECTED</strong>
                  </li>
                  <li>
                    Gửi lý do từ chối tới Đối tác qua <strong>email</strong>
                  </li>
                  <li>
                    Cho phép Đối tác <strong>chỉnh sửa và gửi lại</strong>
                  </li>
                  <li>
                    Giữ mẫu <strong>ẩn với khách hàng</strong>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950/20">
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Gợi ý phản hồi mang tính xây dựng:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-amber-700 dark:text-amber-300">
                  <li>
                    Giải thích <strong>vì sao</strong> mẫu bị từ chối
                  </li>
                  <li>
                    Nêu <strong>vấn đề cụ thể</strong> cần khắc phục
                  </li>
                  <li>
                    Gợi ý <strong>hướng chỉnh sửa</strong> rõ ràng
                  </li>
                  <li>Giữ <strong>thái độ chuyên nghiệp</strong></li>
                </ul>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-4">
          <Label htmlFor="reject-reason" className="text-red-600 dark:text-red-400">
            Lý do từ chối (bắt buộc) *
          </Label>
          <Textarea
            id="reject-reason"
            placeholder="Ví dụ: Hình ảnh độ phân giải thấp. Vui lòng tải ảnh rõ hơn thể hiện hoạt động workshop. Phần mô tả chi tiết cần bổ sung trang bị mang theo."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              setError("")
            }}
            rows={6}
            className={`resize-none ${error ? "border-red-500" : ""}`}
          />
          {error && (
            <p className="text-xs font-medium text-red-600">{error}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Lý do sẽ được gửi tới Đối tác và có thể hiển thị trên bảng điều khiển của họ. Hãy cụ thể và hữu ích.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="transition-colors" onClick={handleCancel}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 transition-colors hover:bg-red-700"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Từ chối mẫu
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
