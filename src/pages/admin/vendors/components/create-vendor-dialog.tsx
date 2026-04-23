import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createVendorSchema, CreateVendorFormData } from "../types"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface CreateVendorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: (data: CreateVendorFormData) => Promise<void>
}

export function CreateVendorDialog({
    open,
    onOpenChange,
    onSuccess,
}: CreateVendorDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateVendorFormData>({
        resolver: zodResolver(createVendorSchema),
        defaultValues: {
            email: "",
            fullname: "",
            businessName: "",
        }
    })

    const onSubmit = async (data: CreateVendorFormData) => {
        setIsSubmitting(true)
        try {
            await onSuccess(data)
            // Chỉ reset và đóng dialog khi tạo thành công
            reset()
            onOpenChange(false)
        } catch {
            // Giữ dialog mở để người dùng có thể xem/sửa thông tin
            // Lỗi đã được hiển thị từ handleCreateSuccess trong AdminVendorsPage
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tạo tài khoản Đối tác mới</DialogTitle>
                    <DialogDescription>
                        Đăng ký một Đối tác mới và hồ sơ doanh nghiệp của họ. Một liên kết thiết lập bảo mật sẽ được gửi đến email của họ để đặt mật khẩu.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Account Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm border-b pb-1">Thông tin tài khoản</h3>

                            <div className="space-y-2">
                                <Label htmlFor="email">Địa chỉ Email <span className="text-red-500">*</span></Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="vendor@example.com"
                                    {...register("email")}
                                    className={errors.email ? "border-red-500" : ""}
                                />
                                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fullname">Họ tên Đối tác <span className="text-red-500">*</span></Label>
                                <Input
                                    id="fullname"
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    {...register("fullname")}
                                    className={errors.fullname ? "border-red-500" : ""}
                                />
                                {errors.fullname && <p className="text-xs text-red-500">{errors.fullname.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                                <Input
                                    id="phoneNumber"
                                    placeholder="Ví dụ: 0905123456"
                                    {...register("phoneNumber")}
                                />
                            </div>
                        </div>

                        {/* Business Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm border-b pb-1">Hồ sơ doanh nghiệp</h3>

                            <div className="space-y-2">
                                <Label htmlFor="businessName">Tên doanh nghiệp <span className="text-red-500">*</span></Label>
                                <Input
                                    id="businessName"
                                    placeholder="Ví dụ: Xưởng gốm NeoNHS"
                                    {...register("businessName")}
                                    className={errors.businessName ? "border-red-500" : ""}
                                />
                                {errors.businessName && <p className="text-xs text-red-500">{errors.businessName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="taxCode">Mã số thuế</Label>
                                <Input
                                    id="taxCode"
                                    placeholder="Tùy chọn"
                                    {...register("taxCode")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Địa chỉ doanh nghiệp</Label>
                                <Input
                                    id="address"
                                    placeholder="Ví dụ: 123 Ngũ Hành Sơn, Đà Nẵng"
                                    {...register("address")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bankName">Tên ngân hàng</Label>
                                <Input
                                    id="bankName"
                                    placeholder="Ví dụ: Vietcombank"
                                    {...register("bankName")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả doanh nghiệp</Label>
                        <Textarea
                            id="description"
                            placeholder="Mô tả ngắn gọn các sản phẩm hoặc dịch vụ của Đối tác..."
                            {...register("description")}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bankAccountNumber">Số tài khoản ngân hàng</Label>
                            <Input
                                id="bankAccountNumber"
                                placeholder="Các chữ số tài khoản"
                                {...register("bankAccountNumber")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bankAccountName">Tên chủ tài khoản</Label>
                            <Input
                                id="bankAccountName"
                                placeholder="VIẾT IN HOA"
                                {...register("bankAccountName")}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang tạo...
                                </>
                            ) : (
                                "Tạo Đối tác"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
