/**
 * BlogCategoryToolbar
 * Filter & search bar for the blog category list.
 * Uses shadcn/ui Input, Select, Button + Lucide icons.
 */

import { Search, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { BlogCategoryStatus } from "@/types/blog";
import { BLOG_CATEGORY_STATUS_OPTIONS, BLOG_CATEGORY_SORT_OPTIONS } from "@/constants/blogCategory";
import { useState } from "react";

interface BlogCategoryToolbarProps {
  onSearchApply: (query: string) => void;
  statusFilter: BlogCategoryStatus | "";
  onStatusChange: (value: BlogCategoryStatus | "") => void;
  sortIndex: number;
  onSortChange: (index: number) => void;
  onExport: () => void;
  onAdd: () => void;
}

export function BlogCategoryToolbar({
  onSearchApply,
  statusFilter,
  onStatusChange,
  sortIndex,
  onSortChange,
  onExport,
  onAdd,
}: BlogCategoryToolbarProps) {
  const [query, setQuery] = useState("");

  return (
    <div className="w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Search & Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative max-w-[250px]">
          <Input
            id="search-input"
            icon={<Search className="h-4 w-4" />}
            placeholder="Search categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e?.key === "Enter") {
                onSearchApply(query);
              }
            }}
            maxLength={200}
            className="h-9"
          />
        </div>

        <Select
          value={statusFilter || "_all"}
          onValueChange={(val) => onStatusChange(val === "_all" ? "" : (val as BlogCategoryStatus))}
        >
          <SelectTrigger id="status-filter" className="w-[160px] h-9">
            <SelectValue placeholder="Status: All" />
          </SelectTrigger>
          <SelectContent>
            {BLOG_CATEGORY_STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value || "_all"} value={o.value || "_all"}>
                Status: {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={String(sortIndex)} onValueChange={(val) => onSortChange(Number(val))}>
          <SelectTrigger id="sort-filter" className="w-[170px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {BLOG_CATEGORY_SORT_OPTIONS.map((o, i) => (
              <SelectItem key={i} value={String(i)}>
                Sort: {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button size="default" onClick={() => onSearchApply(query)} className="h-9">
          <Search className="h-3.5 w-3.5" />
          Search
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button size="default" onClick={onAdd} className="h-9">
          <Plus className="h-3.5 w-3.5" />
          Add Category
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
            <TooltipContent>Export categories to CSV</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
