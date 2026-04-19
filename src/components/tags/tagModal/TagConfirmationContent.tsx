import { TriangleAlert } from "lucide-react";
import type { TagConfirmationContentProps } from "./types";

export function TagConfirmationContent({ kind, mode, subtitle, tag }: TagConfirmationContentProps) {
  return (
    <div className="flex flex-col items-center text-center pt-2 pb-1">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <TriangleAlert className="h-7 w-7 text-destructive" />
      </div>

      <h3 className="text-lg font-bold text-foreground mb-1">
        {mode === "restore" ? "Khôi phục nhãn này?" : "Xóa nhãn này?"}
      </h3>
      <p className="text-sm text-muted-foreground mb-3">{subtitle}</p>

      <div className="w-full flex items-center gap-3 p-3 bg-destructive/5 rounded-lg border border-destructive/15">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-xs font-bold text-destructive">
          {tag.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-foreground">{tag.name}</p>
          <p className="text-xs text-muted-foreground">
            {tag.description || "Không có mô tả."}
          </p>
        </div>
      </div>

      {kind === "workshop" && mode === "delete" && (
        <p className="text-xs text-destructive mt-3">Không thể hoàn tác thao tác này.</p>
      )}
    </div>
  );
}

export default TagConfirmationContent;
