import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import type { HotSpotFormValues } from "../schema";

interface HotSpotListProps {
  hotSpots: HotSpotFormValues[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export default function HotSpotList({ hotSpots, onEdit, onDelete }: HotSpotListProps) {
  if (hotSpots.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Chưa có điểm Hot.
          <br />
          <span className="text-xs text-muted-foreground italic">
            *Đây là nơi để cấu hình các điểm thông tin cần chú ý trên panorama.
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {hotSpots.map((hs, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Grip icon (visual only for now) */}
          <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0 cursor-grab" />

          {/* Order badge */}
          <Badge variant="outline" className="flex-shrink-0 text-xs font-mono">
            #{index + 1}
          </Badge>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{hs.title}</p>
            <p className="text-xs text-muted-foreground truncate">
              {hs.tooltip} · yaw: {hs.yaw.toFixed(2)}, pitch: {hs.pitch.toFixed(2)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(index)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onDelete(index)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
