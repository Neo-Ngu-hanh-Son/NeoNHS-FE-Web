import { Pencil, RotateCcw, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { TagResponse } from "@/types/tag";

interface TagTableRowItemProps {
  kind: "event" | "workshop";
  tag: TagResponse;
  onEdit: (tag: TagResponse) => void;
  onDelete: (tag: TagResponse) => void;
  onRestore?: (tag: TagResponse) => void;
}

function isValidUrl(value?: string): boolean {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function TagTableRowItem({ kind, tag, onEdit, onDelete, onRestore }: TagTableRowItemProps) {
  const isDeleted = kind === "event" && !!tag.deletedAt;

  return (
    <TableRow key={tag.id} className="hover:bg-primary/5">
      <TableCell>
        <span className="text-sm font-semibold text-gray-800">{tag.name}</span>
      </TableCell>

      <TableCell>
        <span className="text-sm font-medium text-gray-600 line-clamp-2">
          {tag.description || "Không có mô tả."}
        </span>
      </TableCell>

      <TableCell>
        {tag.tagColor ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-1">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: tag.tagColor }}
            />
            <span className="text-xs text-muted-foreground">{tag.tagColor}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>

      <TableCell>
        {isValidUrl(tag.iconUrl) ? (
          <img
            src={tag.iconUrl}
            alt={`${tag.name} icon`}
            className="h-7 w-7 rounded object-cover border border-border"
          />
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>

      {kind === "event" && (
        <TableCell>
          <Badge
            variant={isDeleted ? "secondary" : "default"}
            className={
              isDeleted
                ? "bg-secondary text-muted-foreground hover:bg-secondary rounded-full whitespace-nowrap"
                : "bg-primary/15 text-primary hover:bg-primary/15 border-primary/20 rounded-full whitespace-nowrap"
            }
          >
            {isDeleted ? "Đã xóa" : "Hoạt động"}
          </Badge>
        </TableCell>
      )}

      <TableCell className="text-right">
        <TooltipProvider delayDuration={200}>
          <div className="flex items-center justify-end gap-1">
            {!isDeleted && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(tag)}
                    className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Sửa nhãn</TooltipContent>
              </Tooltip>
            )}

            {isDeleted ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onRestore?.(tag)}
                    className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Khôi phục nhãn</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(tag)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {kind === "event" ? "Xóa nhãn" : "Xóa nhãn vĩnh viễn"}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
}

export default TagTableRowItem;
