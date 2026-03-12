import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
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
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative w-[490px]">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-9"
        />
      </div>

      <Select value={vendorIdFilter} onValueChange={onVendorIdFilterChange}>
        <SelectTrigger className="w-[150px] h-9">
          <SelectValue placeholder="All Vendors" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Vendors</SelectItem>
          {vendors.map((v) => (
            <SelectItem key={v.id} value={v.id}>
              {v.businessName || v.fullname}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[150px] h-9">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value={WorkshopStatus.PENDING}>Pending</SelectItem>
          <SelectItem value={WorkshopStatus.ACTIVE}>Approved</SelectItem>
          <SelectItem value={WorkshopStatus.REJECTED}>Rejected</SelectItem>
        </SelectContent>
      </Select>

      <Select value={verificationFilter} onValueChange={onVerificationFilterChange}>
        <SelectTrigger className="w-[150px] h-9">
          <SelectValue placeholder="Verification" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Verification</SelectItem>
          <SelectItem value="verified">Verified</SelectItem>
          <SelectItem value="unverified">Unverified</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={sortBy}
        onValueChange={(value) => onSortByChange(value as TemplatesSortBy)}
      >
        <SelectTrigger className="w-[150px] h-9">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Created Date</SelectItem>
          <SelectItem value="updatedAt">Updated Date</SelectItem>
          <SelectItem value="name">Template Name</SelectItem>
          <SelectItem value="vendorName">Vendor Name</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={sortDirection}
        onValueChange={(value) => onSortDirectionChange(value as TemplatesSortDirection)}
      >
        <SelectTrigger className="w-[150px] h-9">
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="DESC">Newest First</SelectItem>
          <SelectItem value="ASC">Oldest First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
