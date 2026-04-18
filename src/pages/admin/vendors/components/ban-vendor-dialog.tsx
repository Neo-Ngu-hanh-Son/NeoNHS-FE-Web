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
import { VendorProfileResponse } from "../types"

interface BanVendorDialogProps {
  vendor: VendorProfileResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string) => void
}

export function BanVendorDialog({
  vendor,
  open,
  onOpenChange,
  onConfirm,
}: BanVendorDialogProps) {
  const [reason, setReason] = useState("")

  const handleConfirm = () => {
    onConfirm(reason)
    setReason("") // Reset reason after confirmation
  }

  if (!vendor) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            Cấm tài khoản Đối tác
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Bạn sắp cấm <strong>{vendor.businessName}</strong> ({vendor.fullname}).
            </p>
            <p className="text-sm text-amber-600 font-medium">
              ⚠️ Hành động này sẽ:
            </p>
            <ul className="text-sm space-y-1 pl-4 list-disc">
              <li>Ngăn Đối tác đăng nhập</li>
              <li>Ẩn tất cả mẫu thiết kế workshop của họ khỏi khách hàng</li>
              <li>Hủy tất cả các phiên workshop sắp tới</li>
              <li>Thông báo cho người tham gia đã đăng ký về việc hủy</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-4">
          <Label htmlFor="ban-reason">Lý do cấm (Tùy chọn)</Label>
          <Textarea
            id="ban-reason"
            placeholder="Ví dụ: Vi phạm điều khoản dịch vụ, hoạt động spam, hành vi gian lận..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Lý do này sẽ được ghi lại trong nhật ký hệ thống và có thể được chia sẻ với Đối tác.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setReason("")}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Xác nhận cấm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Unban Dialog
interface UnbanVendorDialogProps {
  vendor: VendorProfileResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function UnbanVendorDialog({
  vendor,
  open,
  onOpenChange,
  onConfirm,
}: UnbanVendorDialogProps) {
  if (!vendor) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-green-600">
            Khôi phục tài khoản Đối tác
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bạn sắp khôi phục quyền truy cập cho <strong>{vendor.businessName}</strong> ({vendor.fullname}).
            
            <p className="mt-3 text-sm">
              ✅ Điều này sẽ cho phép Đối tác:
            </p>
            <ul className="text-sm space-y-1 pl-4 list-disc mt-1">
              <li>Đăng nhập lại vào tài khoản của họ</li>
              <li>Tạo và quản lý các mẫu thiết kế workshop</li>
              <li>Lên lịch các phiên workshop</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700"
          >
            Xác nhận khôi phục
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
