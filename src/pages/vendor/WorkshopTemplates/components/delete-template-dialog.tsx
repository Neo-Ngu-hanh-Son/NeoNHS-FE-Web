import { Modal } from "antd"

interface DeleteTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  templateName: string
  onConfirm: () => void
}

export function DeleteTemplateDialog({
  open,
  onOpenChange,
  templateName,
  onConfirm,
}: DeleteTemplateDialogProps) {
  return (
    <Modal
      title="Are you sure?"
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={onConfirm}
      okText="Delete"
      okButtonProps={{ danger: true }}
      cancelText="Cancel"
    >
      <p>
        This action cannot be undone. This will permanently delete the workshop template{" "}
        <span className="font-semibold text-foreground">"{templateName}"</span>.
      </p>
    </Modal>
  )
}
