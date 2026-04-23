import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TAG_SORT_OPTIONS } from "@/constants/tag";

interface TagToolbarProps {
  title: string;
  sortIndex: number;
  onSortChange: (index: number) => void;
  onAdd: () => void;
}

export function TagToolbar({ title, sortIndex, onSortChange, onAdd }: TagToolbarProps) {
  return (
    <div className="w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>

      <div className="flex items-center gap-2 flex-wrap">
        <Select value={String(sortIndex)} onValueChange={(value) => onSortChange(Number(value))}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            {TAG_SORT_OPTIONS.map((option, index) => (
              <SelectItem key={option.label} value={String(index)}>
                Sắp xếp theo: {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button size="default" onClick={onAdd} className="h-9">
          <Plus className="h-3.5 w-3.5" />
          Thêm nhãn
        </Button>
      </div>
    </div>
  );
}

export default TagToolbar;
