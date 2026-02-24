import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { WorkshopStatus } from "./templates/types"

export type TemplatesSortBy = "createdAt" | "updatedAt" | "name" | "vendorName"
export type TemplatesSortDirection = "ASC" | "DESC"

interface TemplateFiltersToolbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
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
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by template name, vendor, or email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value={WorkshopStatus.PENDING}>Pending</SelectItem>
          <SelectItem value={WorkshopStatus.ACTIVE}>Approved</SelectItem>
          <SelectItem value={WorkshopStatus.REJECTED}>Rejected</SelectItem>
          <SelectItem value={WorkshopStatus.DRAFT}>Draft</SelectItem>
        </SelectContent>
      </Select>

      <Select value={verificationFilter} onValueChange={onVerificationFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Vendor Verification" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Vendors</SelectItem>
          <SelectItem value="verified">Verified Vendors</SelectItem>
          <SelectItem value="unverified">Unverified Vendors</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={sortBy}
        onValueChange={(value) => onSortByChange(value as TemplatesSortBy)}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
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
        <SelectTrigger className="w-full sm:w-[150px]">
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