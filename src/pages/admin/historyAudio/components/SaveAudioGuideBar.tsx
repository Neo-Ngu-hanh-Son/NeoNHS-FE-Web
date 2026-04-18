import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface SaveAudioGuideBarProps {
  disabled: boolean;
  saving: boolean;
  onSave: () => void;
}

export default function SaveAudioGuideBar({ disabled, saving, onSave }: SaveAudioGuideBarProps) {
  return (
    <div className="flex justify-end">
      <Button onClick={onSave} disabled={disabled || saving}>
        {saving ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Lưu
      </Button>
    </div>
  );
}
