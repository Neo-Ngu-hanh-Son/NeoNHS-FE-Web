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
import { updateVendorSchema, UpdateVendorFormData, VendorProfileResponse } from "../types"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface EditVendorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    vendor: VendorProfileResponse | null
    onSuccess: (id: string, data: UpdateVendorFormData) => Promise<void>
}

export function EditVendorDialog({
    open,
    onOpenChange,
    vendor,
    onSuccess,
}: EditVendorDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateVendorFormData>({
        resolver: zodResolver(updateVendorSchema),
        defaultValues: {
            fullname: "",
            phoneNumber: "",
            businessName: "",
            description: "",
            address: "",
            taxCode: "",
            bankName: "",
            bankAccountNumber: "",
            bankAccountName: "",
        }
    })

    useEffect(() => {
        if (vendor && open) {
            reset({
                fullname: vendor.fullname || "",
                phoneNumber: vendor.phoneNumber || "",
                businessName: vendor.businessName || "",
                description: vendor.description || "",
                address: vendor.address || "",
                taxCode: vendor.taxCode || "",
                bankName: vendor.bankName || "",
                bankAccountNumber: vendor.bankAccountNumber || "",
                bankAccountName: vendor.bankAccountName || "",
            })
        }
    }, [vendor, open, reset])

    const onSubmit = async (data: UpdateVendorFormData) => {
        if (!vendor) return
        setIsSubmitting(true)
        try {
            await onSuccess(vendor.id, data)
            onOpenChange(false)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Sửa hồ sơ Đối tác</DialogTitle>
                    <DialogDescription>
                        Cập nhật Đối tác hiện tại và hồ sơ doanh nghiệp của họ.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Account Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm border-b pb-1">Liên hệ Đối tác</h3>

                            <div className="space-y-2">
                                <Label htmlFor="edit-fullname">Họ tên Đối tác <span className="text-red-500">*</span></Label>
                                <Input
                                    id="edit-fullname"
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    {...register("fullname")}
                                    className={errors.fullname ? "border-red-500" : ""}
                                />
                                {errors.fullname && <p className="text-xs text-red-500">{errors.fullname.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-phoneNumber">Số điện thoại</Label>
                                <Input
                                    id="edit-phoneNumber"
                                    placeholder="Ví dụ: 0905123456"
                                    {...register("phoneNumber")}
                                />
                            </div>
                        </div>

                        {/* Business Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm border-b pb-1">Hồ sơ doanh nghiệp</h3>

                            <div className="space-y-2">
                                <Label htmlFor="edit-businessName">Tên doanh nghiệp <span className="text-red-500">*</span></Label>
                                <Input
                                    id="edit-businessName"
                                    placeholder="Ví dụ: Xưởng gốm NeoNHS"
                                    {...register("businessName")}
                                    className={errors.businessName ? "border-red-500" : ""}
                                />
                                {errors.businessName && <p className="text-xs text-red-500">{errors.businessName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-taxCode">Mã số thuế</Label>
                                <Input
                                    id="edit-taxCode"
                                    placeholder="Tùy chọn"
                                    {...register("taxCode")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-address">Địa chỉ doanh nghiệp</Label>
                                <Input
                                    id="edit-address"
                                    placeholder="Ví dụ: 123 Ngũ Hành Sơn, Đà Nẵng"
                                    {...register("address")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-bankName">Tên ngân hàng</Label>
                                <Input
                                    id="edit-bankName"
                                    placeholder="Ví dụ: Vietcombank"
                                    {...register("bankName")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Mô tả doanh nghiệp</Label>
                        <Textarea
                            id="edit-description"
                            placeholder="Mô tả ngắn gọn các sản phẩm hoặc dịch vụ của Đối tác..."
                            {...register("description")}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-bankAccountNumber">Số tài khoản ngân hàng</Label>
                            <Input
                                id="edit-bankAccountNumber"
                                placeholder="Các chữ số tài khoản"
                                {...register("bankAccountNumber")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-bankAccountName">Tên chủ tài khoản</Label>
                            <Input
                                id="edit-bankAccountName"
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
                                    Đang lưu...
                                </>
                            ) : (
                                "Lưu thay đổi"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
