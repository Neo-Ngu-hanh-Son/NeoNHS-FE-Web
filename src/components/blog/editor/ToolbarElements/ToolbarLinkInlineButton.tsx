import { Button, Input } from "@/components/ui";
import { Check, X } from "lucide-react";

type LinkInlineEditorProps = {
  isEditMode: boolean;
  editUrl: string;
  setEditUrl: (url: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function LinkInlineEditor({
  isEditMode,
  editUrl,
  setEditUrl,
  onConfirm,
  onCancel,
}: LinkInlineEditorProps) {
  if (!isEditMode) return null;

  return (
    <div className="flex items-center gap-1 rounded-md h-9">
      <Input
        type="url"
        value={editUrl}
        onChange={(e) => setEditUrl(e.target.value)}
        placeholder="Enter URL..."
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") onConfirm()
          if (e.key === "Escape") onCancel()
        }}
        className='h-9'
      />

      <Button
        type="button"
        size="icon"
        variant="default"
        onClick={onConfirm}
        title="Apply link"
        className="h-9 w-9"
      >
        <Check className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={onCancel}
        title="Cancel"
        className="h-9 w-9"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}