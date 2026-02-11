import { Modal } from "antd"

interface SubmitApprovalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  templateName: string
  onConfirm: () => void
}

export function SubmitApprovalDialog({
  open,
  onOpenChange,
  templateName,
  onConfirm,
}: SubmitApprovalDialogProps) {
  return (
    <Modal
      title="Submit template for approval?"
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={onConfirm}
      okText="Submit for Approval"
      cancelText="Cancel"
    >
      <div className="space-y-2">
        <p>
          You are about to submit <span className="font-semibold text-foreground">"{templateName}"</span> for admin approval.
        </p>
        <p className="font-medium text-yellow-600 dark:text-yellow-500">
          ⚠️ Once submitted, you will not be able to edit this template until it is approved or rejected.
        </p>
        <p>Do you want to proceed?</p>
      </div>
    </Modal>
  )
}
