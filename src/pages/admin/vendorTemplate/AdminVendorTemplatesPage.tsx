import { useEffect, useMemo, useState } from "react"
import { LayoutTemplate } from "lucide-react"
import { notification } from "antd"
import {
  AdminWorkshopTemplateResponse,
  WorkshopStatus,
} from "./components/templates/types"
import {
  TemplateFiltersToolbar,
  TemplatesSortBy,
  TemplatesSortDirection,
} from "./components/TemplateFiltersToolbar"
import { TemplatesTable } from "./components/TemplatesTable"
import { ApproveTemplateDialog, RejectTemplateDialog } from "./components/templates/approve-reject-dialogs"
import { TemplateDetailDialog } from "./components/templates/template-detail-dialog"
import { adminWorkshopService, type AdminVendorSummary } from "@/services/api/adminWorkshopService"

type SortBy = TemplatesSortBy
type SortDirection = TemplatesSortDirection

export default function AdminVendorTemplatesPage() {
  const [rawTemplates, setRawTemplates] = useState<AdminWorkshopTemplateResponse[]>([])
  const [vendors, setVendors] = useState<AdminVendorSummary[]>([])
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState("")
  const [vendorIdFilter, setVendorIdFilter] = useState("all")
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

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const apiSortDir = sortDirection === "ASC" ? "asc" : "desc"
        const statusParam = statusFilter !== "all" ? statusFilter : undefined

        const [templatesRes, vendorsRes] = await Promise.allSettled([
          adminWorkshopService.getAllWorkshopTemplates({
            page: 1,
            size: 10,
            sortBy,
            sortDir: apiSortDir,
            status: statusParam,
          }),
          vendors.length === 0
            ? adminWorkshopService.getAllVendors()
            : Promise.resolve(vendors),
        ])

        if (templatesRes.status === "fulfilled") {
          const visibleTemplates = (templatesRes.value.content || []).filter(
            (t) => t.status !== "DRAFT",
          )
          setRawTemplates(visibleTemplates)
        } else {
          //console.error("Failed to load templates", templatesRes.reason)
          notification.error({
            message: "Không tải được mẫu workshop",
            description: "Đã xảy ra lỗi khi tải danh sách mẫu workshop. Vui lòng thử lại.",
          })
        }

        if (vendorsRes.status === "fulfilled") {
          setVendors(vendorsRes.value)
        } else {
          //console.error("Failed to load vendors", vendorsRes.reason)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [sortBy, sortDirection, statusFilter])

  const templates = useMemo(() => {
    if (vendors.length === 0) return rawTemplates

    return rawTemplates.map((t) => {
      const vendor = vendors.find(
        (v) => v.id === t.vendorId || v.businessName === t.vendorName || v.fullname === t.vendorName,
      )
      if (!vendor) return t
      return {
        ...t,
        vendorVerified: vendor.isVerifiedVendor,
        vendorEmail: t.vendorEmail || vendor.email,
      }
    })
  }, [rawTemplates, vendors])


  const filteredTemplates = useMemo(() => {
    let filtered = templates

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((t) => {
        return (
          t.name.toLowerCase().includes(query) ||
          t.shortDescription?.toLowerCase().includes(query) ||
          t.vendorName.toLowerCase().includes(query) ||
          (t.vendorEmail ?? "").toLowerCase().includes(query)
        )
      })
    }

    if (vendorIdFilter !== "all") {
      const selectedVendor = vendors.find((v) => v.id === vendorIdFilter)
      filtered = filtered.filter((t) => {
        if (t.vendorId === vendorIdFilter) return true
        if (selectedVendor) {
          return t.vendorName === selectedVendor.businessName ||
                 t.vendorName === selectedVendor.fullname
        }
        return false
      })
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
  }, [templates, searchQuery, vendorIdFilter, vendors, verificationFilter, sortBy, sortDirection])

  const handleView = (id: string) => {
    const template = templates.find((t) => t.id === id)
    if (!template) return
    setDetailDialog({ open: true, template })
  }

  const handleApproveClick = (template: AdminWorkshopTemplateResponse) => {
    setApproveDialog({ open: true, template })
  }

  const handleApproveConfirm = async (adminNote?: string) => {
    if (!approveDialog.template) return
    const templateName = approveDialog.template.name
    const templateId = approveDialog.template.id

    try {
      setApproveDialog({ open: false, template: null })
      const approvedTemplate = await adminWorkshopService.approveTemplate(templateId, adminNote)
      //console.log("[approveTemplate] Response from BE:", approvedTemplate)

      setRawTemplates((prev) =>
        prev.map((t) =>
          t.id === templateId
            ? { ...t, status: "ACTIVE" as WorkshopStatus, adminNote: adminNote ?? null }
            : t,
        ),
      )

      notification.success({
        message: "Đã duyệt mẫu",
        description: `«${templateName}» đã được duyệt và đang hoạt động.`,
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định"
      notification.error({
        message: "Duyệt thất bại",
        description: message,
      })
    }
  }

  const handleRejectClick = (template: AdminWorkshopTemplateResponse) => {
    setRejectDialog({ open: true, template })
  }

  const handleRejectConfirm = async (adminNote: string) => {
    if (!rejectDialog.template) return
    const templateName = rejectDialog.template.name
    const templateId = rejectDialog.template.id

    try {
      setRejectDialog({ open: false, template: null })
      await adminWorkshopService.rejectTemplate(templateId, adminNote)

      setRawTemplates((prev) =>
        prev.map((t) =>
          t.id === templateId
            ? { ...t, status: "REJECTED" as WorkshopStatus, adminNote }
            : t,
        ),
      )

      notification.warning({
        message: "Đã từ chối mẫu",
        description: `«${templateName}» đã bị từ chối.`,
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định"
      notification.error({
        message: "Từ chối thất bại",
        description: message,
      })
    }
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setVendorIdFilter("all")
    setStatusFilter("all")
    setVerificationFilter("all")
    setSortBy("createdAt")
    setSortDirection("DESC")
  }

  return (
    <div className="mx-auto max-w-7xl space-y-2 p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 shadow-sm dark:border-white/10 dark:from-white/5 dark:to-transparent">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/20">
              <LayoutTemplate className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Mẫu workshop Đối tác
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Xem và quản lý mẫu workshop do Đối tác gửi lên.
              </p>
            </div>
          </div>
        </div>
      </div>

      <TemplateFiltersToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        vendorIdFilter={vendorIdFilter}
        onVendorIdFilterChange={setVendorIdFilter}
        vendors={vendors}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        verificationFilter={verificationFilter}
        onVerificationFilterChange={setVerificationFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
      />

      <TemplatesTable
        templates={filteredTemplates}
        totalCount={templates.length}
        loading={loading}
        hasActiveFilters={
          !!searchQuery ||
          vendorIdFilter !== "all" ||
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
