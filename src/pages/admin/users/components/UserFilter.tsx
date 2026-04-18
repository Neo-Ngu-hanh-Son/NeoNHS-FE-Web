import { useState, useEffect } from "react";
import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface UserFilterProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onReset: () => void;
}

export function UserFilter({
  searchText,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  onReset,
}: UserFilterProps) {
  const [inputValue, setInputValue] = useState(searchText);

  useEffect(() => {
    setInputValue(searchText);
  }, [searchText]);

  const triggerSearch = () => {
    onSearchChange(inputValue);
  };

  const handleReset = () => {
    setInputValue("");
    onReset();
  };

  return (
    <Card className="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <CardHeader className="pb-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/20">
              <SlidersHorizontal className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                Bộ lọc
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                Tìm theo tên hoặc email, lọc theo vai trò và trạng thái tài khoản.
              </CardDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="hidden shrink-0 gap-2 transition-colors md:inline-flex"
          >
            <RotateCcw className="size-4" />
            Đặt lại
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="relative flex items-center lg:col-span-2">
            <Input
              className="h-10 rounded-xl border-slate-200 pr-10 text-sm transition-colors focus-visible:ring-1 dark:border-slate-700 dark:bg-slate-900"
              placeholder="Tìm tên hoặc email… (Enter để tìm)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
            />
            <button
              type="button"
              className="absolute right-1.5 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
              onClick={triggerSearch}
              title="Tìm kiếm"
            >
              <Search className="size-4" />
            </button>
          </div>

          <Select value={roleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger className="h-10 rounded-xl border-slate-200 text-sm dark:border-slate-700 dark:bg-slate-900">
              <SelectValue placeholder="Tất cả vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="ADMIN">Quản trị</SelectItem>
              <SelectItem value="VENDOR">Nhà cung cấp</SelectItem>
              <SelectItem value="TOURIST">Du khách</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-10 rounded-xl border-slate-200 text-sm dark:border-slate-700 dark:bg-slate-900">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
              <SelectItem value="BANNED">Đã cấm</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="flex h-10 items-center justify-center gap-2 transition-colors md:hidden"
          >
            <RotateCcw className="size-4" />
            Đặt lại bộ lọc
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
