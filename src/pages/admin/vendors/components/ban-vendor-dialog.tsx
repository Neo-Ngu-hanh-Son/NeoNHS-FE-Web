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
            Ban Vendor Account
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              You are about to ban <strong>{vendor.businessName}</strong> ({vendor.fullname}).
            </p>
            <p className="text-sm text-amber-600 font-medium">
              ⚠️ This action will:
            </p>
            <ul className="text-sm space-y-1 pl-4 list-disc">
              <li>Prevent the vendor from logging in</li>
              <li>Hide all their workshop templates from customers</li>
              <li>Cancel all upcoming workshop sessions</li>
              <li>Notify enrolled participants about cancellations</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-4">
          <Label htmlFor="ban-reason">Ban Reason (Optional)</Label>
          <Textarea
            id="ban-reason"
            placeholder="e.g., Violated terms of service, spam activity, fraudulent behavior..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            This reason will be recorded in the system logs and may be shared with the vendor.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setReason("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Confirm Ban
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
            Unban Vendor Account
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to restore access for <strong>{vendor.businessName}</strong> ({vendor.fullname}).
            
            <p className="mt-3 text-sm">
              ✅ This will allow the vendor to:
            </p>
            <ul className="text-sm space-y-1 pl-4 list-disc mt-1">
              <li>Log in to their account</li>
              <li>Create and manage workshop templates</li>
              <li>Schedule workshop sessions</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700"
          >
            Confirm Unban
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
