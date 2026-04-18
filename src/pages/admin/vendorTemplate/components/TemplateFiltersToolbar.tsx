import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal, Search } from "lucide-react"
import { WorkshopStatus } from "./templates/types"
import type { AdminVendorSummary } from "@/services/api/adminWorkshopService"

export type TemplatesSortBy = "createdAt" | "updatedAt" | "name" | "vendorName"
export type TemplatesSortDirection = "ASC" | "DESC"

interface TemplateFiltersToolbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  vendorIdFilter: string
  onVendorIdFilterChange: (value: string) => void
  vendors: AdminVendorSummary[]
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  verificationFilter: string
  onVerificationFilterChange: (value: string) => void
  sortBy: TemplatesSortBy
  onSortByChange: (value: TemplatesSortBy) => void
  sortDirection: TemplatesSortDirection
  onSortDirectionChange: (value: TemplatesSortDirection) => void
}

export function TemplateFiltersToolbar({
  searchQuery,
  onSearchChange,
  vendorIdFilter,
  onVendorIdFilterChange,
  vendors,
  statusFilter,
  onStatusFilterChange,
  verificationFilter,
  onVerificationFilterChange,
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionChange,
}: TemplateFiltersToolbarProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-900/30">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <SlidersHorizontal className="h-4 w-4" />
        Bộ lọc
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-[490px]">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên mẫu, mô tả, Đối tác, email…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 pl-8"
          />
        </div>

        <Select value={vendorIdFilter} onValueChange={onVendorIdFilterChange}>
          <SelectTrigger className="h-9 w-[150px] rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <SelectValue placeholder="Tất cả Đối tác" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả Đối tác</SelectItem>
            {vendors.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.businessName || v.fullname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-9 w-[150px] rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Mọi trạng thái</SelectItem>
            <SelectItem value={WorkshopStatus.PENDING}>Chờ duyệt</SelectItem>
            <SelectItem value={WorkshopStatus.ACTIVE}>Đã duyệt</SelectItem>
            <SelectItem value={WorkshopStatus.REJECTED}>Đã từ chối</SelectItem>
          </SelectContent>
        </Select>

        <Select value={verificationFilter} onValueChange={onVerificationFilterChange}>
          <SelectTrigger className="h-9 w-[150px] rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <SelectValue placeholder="Xác minh" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Mọi mức xác minh</SelectItem>
            <SelectItem value="verified">Đã xác minh</SelectItem>
            <SelectItem value="unverified">Chưa xác minh</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => onSortByChange(value as TemplatesSortBy)}
        >
          <SelectTrigger className="h-9 w-[150px] rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Ngày tạo</SelectItem>
            <SelectItem value="updatedAt">Ngày cập nhật</SelectItem>
            <SelectItem value="name">Tên mẫu</SelectItem>
            <SelectItem value="vendorName">Tên Đối tác</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortDirection}
          onValueChange={(value) => onSortDirectionChange(value as TemplatesSortDirection)}
        >
          <SelectTrigger className="h-9 w-[150px] rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <SelectValue placeholder="Thứ tự" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DESC">Mới nhất trước</SelectItem>
            <SelectItem value="ASC">Cũ nhất trước</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
