import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  AlertCircle,
  FileText,
} from "lucide-react"
import { useState, useMemo } from "react"
import { notification } from "antd"
import { mockAdminTemplates } from "./templates/data"
import { AdminWorkshopTemplateResponse, WorkshopStatus } from "./templates/types"
import { formatDate, formatPrice, formatDuration } from "@/pages/vendor/WorkshopTemplates/utils/formatters"
import { ApproveTemplateDialog, RejectTemplateDialog } from "./templates/approve-reject-dialogs"

interface VendorTemplatesModalProps {
  vendorId: string | null
  vendorName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VendorTemplatesModal({
  vendorId,
  vendorName,
  open,
  onOpenChange,
}: VendorTemplatesModalProps) {
  const [templates] = useState<AdminWorkshopTemplateResponse[]>(mockAdminTemplates)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const [approveDialog, setApproveDialog] = useState<{ open: boolean; template: AdminWorkshopTemplateResponse | null }>({
    open: false,
    template: null,
  })

  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; template: AdminWorkshopTemplateResponse | null }>({
    open: false,
    template: null,
  })

  // Filter templates by vendor
  const vendorTemplates = useMemo(() => {
    if (!vendorId) return []
    
    let filtered = templates.filter(t => t.vendorId === vendorId)

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.shortDescription.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter)
    }

    return filtered
  }, [vendorId, templates, searchQuery, statusFilter])

  const getStatusBadge = (status: WorkshopStatus) => {
    switch (status) {
      case WorkshopStatus.PENDING:
        return (
          <Badge className="bg-amber-500 text-white">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case WorkshopStatus.ACTIVE:
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case WorkshopStatus.REJECTED:
        return (
          <Badge className="bg-red-500 text-white">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      case WorkshopStatus.DRAFT:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700">
            Draft
          </Badge>
        )
    }
  }

  const handleView = (id: string) => {
    console.log('View template:', id)
    notification.info({
      message: 'View Template',
      description: 'Template detail view will be implemented',
    })
  }

  const handleApproveClick = (template: AdminWorkshopTemplateResponse) => {
    setApproveDialog({ open: true, template })
  }

  const handleApproveConfirm = (notes: string) => {
    if (approveDialog.template) {
      console.log('Approving template:', approveDialog.template.id, 'Notes:', notes)
      setApproveDialog({ open: false, template: null })
      notification.success({
        message: 'Template Approved',
        description: `"${approveDialog.template.name}" has been approved.`,
      })
    }
  }

  const handleRejectClick = (template: AdminWorkshopTemplateResponse) => {
    setRejectDialog({ open: true, template })
  }

  const handleRejectConfirm = (reason: string) => {
    if (rejectDialog.template) {
      console.log('Rejecting template:', rejectDialog.template.id, 'Reason:', reason)
      setRejectDialog({ open: false, template: null })
      notification.warning({
        message: 'Template Rejected',
        description: `"${rejectDialog.template.name}" has been rejected.`,
      })
    }
  }

  if (!vendorId) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">Workshop Templates</DialogTitle>
            <DialogDescription>
              All templates registered by <strong>{vendorName}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            {/* Filters */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
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
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              Showing <strong>{vendorTemplates.length}</strong> template{vendorTemplates.length !== 1 ? 's' : ''}
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto border rounded-lg">
              {vendorTemplates.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold text-sm">Template Name</th>
                      <th className="text-left p-3 font-semibold text-sm">Duration</th>
                      <th className="text-left p-3 font-semibold text-sm">Price</th>
                      <th className="text-left p-3 font-semibold text-sm">Capacity</th>
                      <th className="text-left p-3 font-semibold text-sm">Status</th>
                      <th className="text-left p-3 font-semibold text-sm">Created</th>
                      <th className="text-right p-3 font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorTemplates.map((template) => (
                      <tr key={template.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <div className="flex items-start gap-3">
                            <img
                              src={template.images[0]?.imageUrl || "https://via.placeholder.com/60x40?text=No+Image"}
                              alt={template.name}
                              className="w-16 h-12 rounded object-cover shrink-0"
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/60x40?text=No+Image"
                              }}
                            />
                            <div className="min-w-0">
                              <p className="font-medium line-clamp-1">{template.name}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {template.shortDescription}
                              </p>
                              {!template.vendorVerified && (
                                <Badge variant="outline" className="mt-1 text-xs bg-amber-50 text-amber-700 border-amber-300">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Unverified Vendor
                                </Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm">
                          {formatDuration(template.estimatedDuration)}
                        </td>
                        <td className="p-3 text-sm font-medium">
                          {formatPrice(template.defaultPrice)}
                        </td>
                        <td className="p-3 text-sm">
                          {template.minParticipants}-{template.maxParticipants}
                        </td>
                        <td className="p-3">
                          {getStatusBadge(template.status)}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {formatDate(template.createdAt)}
                        </td>
                        <td className="p-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleView(template.id)}
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              View
                            </Button>
                            {template.status === WorkshopStatus.PENDING && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveClick(template)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRejectClick(template)}
                                >
                                  <XCircle className="w-3.5 h-3.5 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || statusFilter !== 'all'
                      ? "Try adjusting your filters"
                      : "This vendor hasn't created any templates yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve/Reject Dialogs */}
      <ApproveTemplateDialog
        template={approveDialog.template}
        open={approveDialog.open}
        onOpenChange={(open) => setApproveDialog({ open, template: open ? approveDialog.template : null })}
        onConfirm={handleApproveConfirm}
      />

      <RejectTemplateDialog
        template={rejectDialog.template}
        open={rejectDialog.open}
        onOpenChange={(open) => setRejectDialog({ open, template: open ? rejectDialog.template : null })}
        onConfirm={handleRejectConfirm}
      />
    </>
  )
}
