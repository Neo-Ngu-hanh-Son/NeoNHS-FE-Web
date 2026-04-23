import { Search, Plus, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { BlogStatus } from "@/types/blog";
import { BLOG_STATUS_OPTIONS, BLOG_SORT_OPTIONS } from "@/constants/blog";
import { useState } from "react";

interface BlogToolbarProps {
  onSearchApply: (query: string) => void;
  statusFilter: BlogStatus | "";
  onStatusChange: (value: BlogStatus | "") => void;
  sortIndex: number;
  onSortChange: (index: number) => void;
  onExport: () => void;
  onSearch: (query: string) => void;
}

export function BlogToolbar({
  statusFilter,
  onStatusChange,
  sortIndex,
  onSortChange,
  onExport,
  onSearch,
}: BlogToolbarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <div className="w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Search & Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative max-w-[250px]">
          <Input
            id="blog-search-input"
            icon={<Search className="h-4 w-4" />}
            placeholder="Tìm kiếm bài viết..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch(query)}
            className="h-9"
          />
        </div>

        <Select
          value={statusFilter || "_all"}
          onValueChange={(val) => onStatusChange(val === "_all" ? "" : (val as BlogStatus))}
        >
          <SelectTrigger id="blog-status-filter" className="w-[160px] h-9">
            <SelectValue placeholder="Trạng thái: Tất cả" />
          </SelectTrigger>
          <SelectContent>
            {BLOG_STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value || "_all"} value={o.value || "_all"}>
                Trạng thái: {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={String(sortIndex)} onValueChange={(val) => onSortChange(Number(val))}>
          <SelectTrigger id="blog-sort-filter" className="w-[170px] h-9">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            {BLOG_SORT_OPTIONS.map((o, i) => (
              <SelectItem key={i} value={String(i)}>
                Sắp xếp: {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button size="default" onClick={() => onSearch(query)} className="h-9">
          <Search className="h-3.5 w-3.5" />
          Tìm kiếm
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button size="default" onClick={() => navigate("/admin/blog/create")} className="h-9">
          <Plus className="h-3.5 w-3.5" />
          Bài viết mới
        </Button>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="default"
                onClick={onExport}
                className="h-9 w-9 border-primary/30 text-primary hover:bg-primary/10"
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Xuất danh sách blog ra CSV</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
