import { useEffect, useMemo, useState } from "react"
import { notification } from "antd"
import {
  AdminWorkshopTemplateResponse,
  AdminTemplateStats,
} from "./components/templates/types"
import { calculateAdminTemplateStats } from "./components/templates/data"
import { TemplateStatsCards } from "./components/TemplateStatsCards"
import {
  TemplateFiltersToolbar,
  TemplatesSortBy,
  TemplatesSortDirection,
} from "./components/TemplateFiltersToolbar"
import { TemplatesTable } from "./components/TemplatesTable"
import { ApproveTemplateDialog, RejectTemplateDialog } from "./components/templates/approve-reject-dialogs"
import { TemplateDetailDialog } from "./components/templates/template-detail-dialog"
import { adminWorkshopService } from "@/services/api/adminWorkshopService"

type SortBy = TemplatesSortBy
type SortDirection = TemplatesSortDirection

export default function AdminVendorTemplatesPage() {
  const [templates, setTemplates] = useState<AdminWorkshopTemplateResponse[]>([])
  const [stats, setStats] = useState<AdminTemplateStats | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [vendorIdFilter, setVendorIdFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [verificationFilter, setVerificationFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortBy>("createdAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("DESC")

  const [approveDialog, setApproveDialog] = useState<{
    open: boolean
    template: AdminWorkshopTemplateResponse | null
  }>({
    open: false,
    template: null,
  })

  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean
    template: AdminWorkshopTemplateResponse | null
  }>({
    open: false,
    template: null,
  })

  const [detailDialog, setDetailDialog] = useState<{
    open: boolean
    template: AdminWorkshopTemplateResponse | null
  }>({
    open: false,
    template: null,
  })

  // Fetch templates from admin API (optionally filtered by vendorId)
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const apiSortDir = sortDirection === "ASC" ? "asc" : "desc"
        const statusParam = statusFilter !== "all" ? statusFilter : undefined

        const params = {
          page: 1,
          size: 10,
          sortBy,
          sortDir: apiSortDir,
          status: statusParam,
        } as const

        let page
        if (vendorIdFilter) {
          page = await adminWorkshopService.getVendorWorkshopTemplates(
            vendorIdFilter,
            params,
          )
        } else {
          page = await adminWorkshopService.getAllWorkshopTemplates(params)
        }

        setTemplates(page.content)
        setStats(calculateAdminTemplateStats(page.content))
      } catch (error) {
        console.error("Failed to load admin workshop templates", error)
        notification.error({
          message: "Failed to load templates",
          description:
            "An error occurred while loading workshop templates. Please try again.",
        })
      } finally {
      }
    }

    fetchTemplates()
  }, [vendorIdFilter, sortBy, sortDirection, statusFilter])

  const filteredTemplates = useMemo(() => {
    let filtered = templates

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((t) => {
        return (
          t.name.toLowerCase().includes(query) ||
          t.shortDescription.toLowerCase().includes(query) ||
          t.vendorName.toLowerCase().includes(query) ||
          (t.vendorEmail ?? "").toLowerCase().includes(query)
        )
      })
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter)
    }

    if (verificationFilter !== "all") {
      if (verificationFilter === "verified") {
        filtered = filtered.filter((t) => t.vendorVerified)
      } else if (verificationFilter === "unverified") {
        filtered = filtered.filter((t) => !t.vendorVerified)
      }
    }

    const sorted = [...filtered].sort((a, b) => {
      let compare = 0

      switch (sortBy) {
        case "name":
          compare = a.name.localeCompare(b.name)
          break
        case "vendorName":
          compare = a.vendorName.localeCompare(b.vendorName)
          break
        case "createdAt":
          compare =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case "updatedAt":
        default:
          compare =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
      }

      return sortDirection === "ASC" ? compare : -compare
    })

    return sorted
  }, [templates, searchQuery, statusFilter, verificationFilter, sortBy, sortDirection])

  const handleView = (id: string) => {
    const template = templates.find((t) => t.id === id)
    if (!template) return
    setDetailDialog({ open: true, template })
  }

  const handleApproveClick = (template: AdminWorkshopTemplateResponse) => {
    setApproveDialog({ open: true, template })
  }

  const handleApproveConfirm = (notes: string) => {
    if (approveDialog.template) {
      console.log("Approving template:", approveDialog.template.id, "Notes:", notes)
      setApproveDialog({ open: false, template: null })
      notification.success({
        message: "Template Approved",
        description: `"${approveDialog.template.name}" has been approved.`,
      })
    }
  }

  const handleRejectClick = (template: AdminWorkshopTemplateResponse) => {
    setRejectDialog({ open: true, template })
  }

  const handleRejectConfirm = (reason: string) => {
    if (rejectDialog.template) {
      console.log("Rejecting template:", rejectDialog.template.id, "Reason:", reason)
      setRejectDialog({ open: false, template: null })
      notification.warning({
        message: "Template Rejected",
        description: `"${rejectDialog.template.name}" has been rejected.`,
      })
    }
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setVendorIdFilter("")
    setStatusFilter("all")
    setVerificationFilter("all")
    setSortBy("createdAt")
    setSortDirection("DESC")
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vendor Workshop Templates</h1>
          <p className="text-muted-foreground">
            Review and manage all workshop templates submitted by vendors
          </p>
        </div>
      </div>

      {/* Stats */}
      <TemplateStatsCards
        stats={
          stats ?? {
            total: templates.length,
            pending: templates.filter((t) => t.status === "PENDING").length,
            approved: templates.filter((t) => t.status === "ACTIVE").length,
            rejected: templates.filter((t) => t.status === "REJECTED").length,
            draft: templates.filter((t) => t.status === "DRAFT").length,
          }
        }
      />

      {/* Filters */}
      <TemplateFiltersToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        vendorIdFilter={vendorIdFilter}
        onVendorIdFilterChange={setVendorIdFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        verificationFilter={verificationFilter}
        onVerificationFilterChange={setVerificationFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
      />

      {/* Table */}
      <TemplatesTable
        templates={filteredTemplates}
        totalCount={templates.length}
        hasActiveFilters={
          !!searchQuery ||
          statusFilter !== "all" ||
          verificationFilter !== "all" ||
          sortBy !== "createdAt" ||
          sortDirection !== "DESC"
        }
        onView={handleView}
        onApproveClick={handleApproveClick}
        onRejectClick={handleRejectClick}
        onClearFilters={handleClearFilters}
      />

      {/* Approve / Reject Dialogs */}
      <ApproveTemplateDialog
        template={approveDialog.template}
        open={approveDialog.open}
        onOpenChange={(open) =>
          setApproveDialog({ open, template: open ? approveDialog.template : null })
        }
        onConfirm={handleApproveConfirm}
      />

      <RejectTemplateDialog
        template={rejectDialog.template}
        open={rejectDialog.open}
        onOpenChange={(open) =>
          setRejectDialog({ open, template: open ? rejectDialog.template : null })
        }
        onConfirm={handleRejectConfirm}
      />

      <TemplateDetailDialog
        template={detailDialog.template}
        open={detailDialog.open}
        onOpenChange={(open) =>
          setDetailDialog({ open, template: open ? detailDialog.template : null })
        }
      />
    </div>
  )
}