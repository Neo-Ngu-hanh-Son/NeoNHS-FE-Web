import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import DebouncedSearchInput from "@/components/common/DebouncedSearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ParentPointOption } from "@/types/checkinPoint";

interface CheckinPointFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  includeDeleted: boolean;
  onIncludeDeletedChange: (value: boolean) => void;
  sortDir: "asc" | "desc";
  onSortDirChange: (value: "asc" | "desc") => void;
  selectedParentPointId: string;
  onSelectedParentPointIdChange: (value: string) => void;
  parentPoints: ParentPointOption[];
  parentPointsLoading: boolean;
  onCreate: () => void;
  createDisabled: boolean;
}

export function CheckinPointFilters({
  search,
  onSearchChange,
  includeDeleted,
  onIncludeDeletedChange,
  sortDir,
  onSortDirChange,
  selectedParentPointId,
  onSelectedParentPointIdChange,
  parentPoints,
  parentPointsLoading,
  onCreate,
  createDisabled,
}: CheckinPointFiltersProps) {
  return (
    <div className="space-y-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-1.5 lg:col-span-7">
          <Label className="text-slate-900 dark:text-white">Tìm kiếm theo tên</Label>
          <DebouncedSearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="Nhập tên điểm check-in..."
            delayMs={1000}
          />
        </div>

        <div className="flex items-end lg:col-span-2">
          <div className="flex h-10 items-center gap-2">
            <Label htmlFor="includeDeleted" className="text-sm font-medium text-slate-900 dark:text-white">
              Bao gồm đã xóa
            </Label>
            <Switch
              id="includeDeleted"
              checked={includeDeleted}
              onCheckedChange={onIncludeDeletedChange}
            />
          </div>
        </div>

        <div className="space-y-1.5 lg:col-span-3">
          <Label className="text-sm font-medium text-slate-900 dark:text-white">Sắp xếp</Label>
          <Select
            value={sortDir}
            onValueChange={(value) => onSortDirChange(value as "asc" | "desc")}
          >
            <SelectTrigger className="border-slate-200 dark:border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Ngày tạo giảm dần</SelectItem>
              <SelectItem value="asc">Ngày tạo tăng dần</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5 sm:min-w-[300px] sm:flex-1 sm:max-w-md">
          <Label className="text-slate-900 dark:text-white">Địa điểm chính (Bắt buộc để tạo mới gốc)</Label>
          <Select value={selectedParentPointId} onValueChange={onSelectedParentPointIdChange}>
            <SelectTrigger className="border-slate-200 dark:border-slate-700">
              <SelectValue
                placeholder={parentPointsLoading ? "Đang tải điểm..." : "Chọn địa điểm chính"}
              />
            </SelectTrigger>
            <SelectContent>
              {parentPoints.map((point) => (
                <SelectItem key={point.id} value={point.id}>
                  {point.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={onCreate} disabled={createDisabled} className="sm:self-end bg-primary shadow-sm hover:bg-primary/90 transition-colors text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Thêm điểm Check-in
        </Button>
      </div>
    </div>
  );
}

export default CheckinPointFilters;
