import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign, AlertCircle, Building2, CheckCircle, FileText } from "lucide-react"
import { AdminWorkshopTemplateResponse, WorkshopStatus } from "./templates/types"
import { formatDate, formatDuration, formatPrice } from "@/pages/vendor/WorkshopTemplates/utils/formatters"

interface TemplatesTableProps {
  templates: AdminWorkshopTemplateResponse[]
  totalCount: number
  hasActiveFilters: boolean
  onView: (id: string) => void
  onApproveClick: (template: AdminWorkshopTemplateResponse) => void
  onRejectClick: (template: AdminWorkshopTemplateResponse) => void
  onClearFilters: () => void
}

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
          <AlertCircle className="w-3 h-3 mr-1" />
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

export function TemplatesTable({
  templates,
  totalCount,
  hasActiveFilters,
  onView,
  onApproveClick,
  onRejectClick,
  onClearFilters,
}: TemplatesTableProps) {
  const hasTemplates = templates.length > 0

  return (
    <div className="border rounded-lg overflow-hidden">
      {hasTemplates ? (
        <div className="max-h-[600px] overflow-auto">
          <table className="w-full">
            <thead className="bg-muted/50 sticky top-0 z-10">
              <tr className="border-b">
                <th className="text-left p-3 font-semibold text-sm">Template</th>
                <th className="text-left p-3 font-semibold text-sm">Vendor</th>
                <th className="text-left p-3 font-semibold text-sm">Duration</th>
                <th className="text-left p-3 font-semibold text-sm">Price</th>
                <th className="text-left p-3 font-semibold text-sm">Status</th>
                <th className="text-left p-3 font-semibold text-sm">Created</th>
                <th className="text-right p-3 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr
                  key={template.id}
                  className="border-b hover:bg-muted/30 transition-colors"
                >
                  <td className="p-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={
                          template.images[0]?.imageUrl ||
                          "https://via.placeholder.com/60x40?text=No+Image"
                        }
                        alt={template.name}
                        className="w-16 h-12 rounded object-cover shrink-0"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/60x40?text=No+Image"
                        }}
                      />
                      <div className="min-w-0">
                        <p className="font-medium line-clamp-1">
                          {template.name}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {template.shortDescription}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-sm">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-medium line-clamp-1">
                          {template.vendorName}
                        </span>
                        {template.vendorVerified && (
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{template.vendorEmail}</span>
                      </div>
                      {!template.vendorVerified && (
                        <Badge
                          variant="outline"
                          className="mt-1 text-xs bg-amber-50 text-amber-700 border-amber-300 inline-flex items-center gap-1 w-fit"
                        >
                          <AlertCircle className="w-3 h-3" />
                          Unverified Vendor
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{formatDuration(template.estimatedDuration)}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{formatPrice(template.defaultPrice)}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    {getStatusBadge(template.status)}
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{formatDate(template.createdAt)}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onView(template.id)}
                      >
                        View
                      </Button>
                      {template.status === WorkshopStatus.PENDING && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => onApproveClick(template)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onRejectClick(template)}
                          >
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
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <FileText className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-2">
            {hasActiveFilters
              ? "Try adjusting your filters"
              : "There are no templates to review yet"}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      )}

      <div className="border-t px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
        <span>
          Showing <strong>{templates.length}</strong> of{" "}
          <strong>{totalCount}</strong> templates
        </span>
      </div>
    </div>
  )
}
