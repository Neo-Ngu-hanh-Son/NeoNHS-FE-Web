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
            password: "",
            fullname: "",
            businessName: "",
        }
    })

    const onSubmit = async (data: CreateVendorFormData) => {
        setIsSubmitting(true)
        try {
            await onSuccess(data)
            reset()
            onOpenChange(false)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Vendor Account</DialogTitle>
                    <DialogDescription>
                        Register a new vendor and their business profile. They will use these credentials to log in.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Account Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm border-b pb-1">Account Credentials</h3>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
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
                                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Min. 8 chars, level 2 security"
                                    {...register("password")}
                                    className={errors.password ? "border-red-500" : ""}
                                />
                                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fullname">Vendor Full Name <span className="text-red-500">*</span></Label>
                                <Input
                                    id="fullname"
                                    placeholder="e.g. John Doe"
                                    {...register("fullname")}
                                    className={errors.fullname ? "border-red-500" : ""}
                                />
                                {errors.fullname && <p className="text-xs text-red-500">{errors.fullname.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    placeholder="e.g. 0905123456"
                                    {...register("phoneNumber")}
                                />
                            </div>
                        </div>

                        {/* Business Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm border-b pb-1">Business Profile</h3>

                            <div className="space-y-2">
                                <Label htmlFor="businessName">Business Name <span className="text-red-500">*</span></Label>
                                <Input
                                    id="businessName"
                                    placeholder="e.g. NeoNHS Pottery Studio"
                                    {...register("businessName")}
                                    className={errors.businessName ? "border-red-500" : ""}
                                />
                                {errors.businessName && <p className="text-xs text-red-500">{errors.businessName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="taxCode">Tax Code</Label>
                                <Input
                                    id="taxCode"
                                    placeholder="Optional"
                                    {...register("taxCode")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Business Address</Label>
                                <Input
                                    id="address"
                                    placeholder="e.g. 123 Marble Mt, Da Nang"
                                    {...register("address")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bankName">Bank Name</Label>
                                <Input
                                    id="bankName"
                                    placeholder="e.g. Vietcombank"
                                    {...register("bankName")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Business Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Briefly describe the vendor's products or services..."
                            {...register("description")}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                            <Input
                                id="bankAccountNumber"
                                placeholder="Account digits"
                                {...register("bankAccountNumber")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bankAccountName">Bank Account Holder Name</Label>
                            <Input
                                id="bankAccountName"
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
                                    Creating...
                                </>
                            ) : (
                                "Create Vendor"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
