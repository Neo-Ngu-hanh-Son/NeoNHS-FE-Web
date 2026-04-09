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
                    <DialogTitle>Edit Vendor Profile</DialogTitle>
                    <DialogDescription>
                        Update existing vendor and their business profile.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Account Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm border-b pb-1">Vendor Contact</h3>

                            <div className="space-y-2">
                                <Label htmlFor="edit-fullname">Vendor Full Name <span className="text-red-500">*</span></Label>
                                <Input
                                    id="edit-fullname"
                                    placeholder="e.g. John Doe"
                                    {...register("fullname")}
                                    className={errors.fullname ? "border-red-500" : ""}
                                />
                                {errors.fullname && <p className="text-xs text-red-500">{errors.fullname.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-phoneNumber">Phone Number</Label>
                                <Input
                                    id="edit-phoneNumber"
                                    placeholder="e.g. 0905123456"
                                    {...register("phoneNumber")}
                                />
                            </div>
                        </div>

                        {/* Business Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm border-b pb-1">Business Profile</h3>

                            <div className="space-y-2">
                                <Label htmlFor="edit-businessName">Business Name <span className="text-red-500">*</span></Label>
                                <Input
                                    id="edit-businessName"
                                    placeholder="e.g. NeoNHS Pottery Studio"
                                    {...register("businessName")}
                                    className={errors.businessName ? "border-red-500" : ""}
                                />
                                {errors.businessName && <p className="text-xs text-red-500">{errors.businessName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-taxCode">Tax Code</Label>
                                <Input
                                    id="edit-taxCode"
                                    placeholder="Optional"
                                    {...register("taxCode")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-address">Business Address</Label>
                                <Input
                                    id="edit-address"
                                    placeholder="e.g. 123 Marble Mt, Da Nang"
                                    {...register("address")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-bankName">Bank Name</Label>
                                <Input
                                    id="edit-bankName"
                                    placeholder="e.g. Vietcombank"
                                    {...register("bankName")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Business Description</Label>
                        <Textarea
                            id="edit-description"
                            placeholder="Briefly describe the vendor's products or services..."
                            {...register("description")}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-bankAccountNumber">Bank Account Number</Label>
                            <Input
                                id="edit-bankAccountNumber"
                                placeholder="Account digits"
                                {...register("bankAccountNumber")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-bankAccountName">Bank Account Holder Name</Label>
                            <Input
                                id="edit-bankAccountName"
                                placeholder="In ALL CAPS"
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
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
