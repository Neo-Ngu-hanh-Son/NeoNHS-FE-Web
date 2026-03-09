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

// Approve Template Dialog
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
    onConfirm(adminNote.trim() || undefined)
    setAdminNote("")
  }

  if (!template) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-green-600 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Approve Workshop Template
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              You are about to approve <strong>{template.name}</strong> by{" "}
              <strong>{template.vendorName}</strong>.
            </p>

            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm">
              <p className="text-green-800 dark:text-green-200 font-medium mb-2">
                ✓ This action will:
              </p>
              <ul className="space-y-1 pl-4 list-disc text-green-700 dark:text-green-300">
                <li>
                  Make the workshop template <strong>publicly visible</strong>
                </li>
                <li>
                  Allow the vendor to <strong>schedule sessions</strong> for this workshop
                </li>
                <li>
                  Enable customers to <strong>book and enroll</strong> in sessions
                </li>
                <li>
                  Send a <strong>notification email</strong> to the vendor
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                📋 Template Details:
              </p>
              <div className="mt-2 space-y-1 text-blue-700 dark:text-blue-300">
                <p>
                  <strong>Duration:</strong> {template.estimatedDuration} minutes
                </p>
                <p>
                  <strong>Price:</strong>{" "}
                  {template.defaultPrice.toLocaleString("vi-VN")} VND
                </p>
                <p>
                  <strong>Capacity:</strong> {template.minParticipants}-
                  {template.maxParticipants} participants
                </p>
                <p>
                  <strong>Vendor Status:</strong>{" "}
                  {template.vendorVerified ? "✓ Verified" : "⚠ Not Verified"}
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-4">
          <Label htmlFor="approve-notes">Admin Note (Optional)</Label>
          <Textarea
            id="approve-notes"
            placeholder="Add any notes about this approval..."
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            This note is optional and for record-keeping purposes.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setAdminNote("")}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve Template
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Reject Template Dialog
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
      setError("Please provide a detailed reason (minimum 10 characters)")
      return
    }
    onConfirm(reason)
    setReason("") // Reset reason after confirmation
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
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Reject Workshop Template
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              You are about to reject <strong>{template.name}</strong> by{" "}
              <strong>{template.vendorName}</strong>.
            </p>

            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm">
              <p className="text-red-800 dark:text-red-200 font-medium mb-2">
                ⚠ This action will:
              </p>
              <ul className="space-y-1 pl-4 list-disc text-red-700 dark:text-red-300">
                <li>
                  Set the template status to <strong>REJECTED</strong>
                </li>
                <li>
                  Send your rejection reason to the vendor via <strong>email</strong>
                </li>
                <li>
                  Allow the vendor to <strong>edit and resubmit</strong> the template
                </li>
                <li>
                  Keep the template <strong>hidden from customers</strong>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm">
              <p className="text-amber-800 dark:text-amber-200 font-medium">
                💡 Please provide constructive feedback:
              </p>
              <ul className="mt-2 space-y-1 pl-4 list-disc text-amber-700 dark:text-amber-300 text-xs">
                <li>
                  Explain <strong>why</strong> the template is being rejected
                </li>
                <li>
                  List <strong>specific issues</strong> that need to be addressed
                </li>
                <li>
                  Provide <strong>guidance</strong> on how to improve the template
                </li>
                <li>Be <strong>professional and constructive</strong></li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-4">
          <Label htmlFor="reject-reason" className="text-red-600">
            Rejection Reason (Required) *
          </Label>
          <Textarea
            id="reject-reason"
            placeholder="Example: The images provided are low quality. Please upload higher resolution images showing the workshop activities clearly. Also, the full description needs more detail about what equipment participants need to bring."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              setError("")
            }}
            rows={6}
            className={`resize-none ${error ? "border-red-500" : ""}`}
          />
          {error && (
            <p className="text-xs text-red-600 font-medium">{error}</p>
          )}
          <p className="text-xs text-muted-foreground">
            This reason will be sent to the vendor and displayed in their dashboard. Be
            specific and helpful.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject Template
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

