import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, DollarSign, AlertCircle, Building2, CheckCircle, FileText } from "lucide-react"
import { AdminWorkshopTemplateResponse, WorkshopStatus } from "./templates/types"
import { formatDate, formatDuration, formatPrice } from "@/pages/vendor/WorkshopTemplates/utils/formatters"

interface TemplatesTableProps {
  templates: AdminWorkshopTemplateResponse[]
  totalCount: number
  loading?: boolean
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
          <Clock className="mr-1 h-3 w-3" />
          Chờ duyệt
        </Badge>
      )
    case WorkshopStatus.ACTIVE:
      return (
        <Badge className="bg-green-500 text-white">
          <CheckCircle className="mr-1 h-3 w-3" />
          Đã duyệt
        </Badge>
      )
    case WorkshopStatus.REJECTED:
      return (
        <Badge className="bg-red-500 text-white">
          <AlertCircle className="mr-1 h-3 w-3" />
          Đã từ chối
        </Badge>
      )
    case WorkshopStatus.DRAFT:
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-700">
          Bản nháp
        </Badge>
      )
  }
}

/** Cột «Mẫu workshop» rộng nhất bảng; các % cộng lại = 100% (table-fixed). */
const colTemplate = "w-[28%] min-w-[14rem] p-3 align-top"
const colVendor = "w-[18%] min-w-0 p-3 align-top"
const colDuration = "w-[12%] min-w-[5.5rem] whitespace-nowrap p-3 align-top"
const colPrice = "w-[10%] min-w-[6.5rem] whitespace-nowrap p-3 align-top"
const colStatus = "w-[11%] min-w-[7.5rem] p-3 align-top"
const colDate = "w-[12%] min-w-[6.5rem] whitespace-nowrap p-3 align-top"
const colActions = "w-[9%] min-w-[10.5rem] p-3 align-top"

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800">
      <td className={colTemplate}>
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-16 shrink-0 rounded" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 max-w-[14rem]" />
            <Skeleton className="h-3 w-1/2 max-w-[12rem]" />
          </div>
        </div>
      </td>
      <td className={colVendor}>
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-52" />
        </div>
      </td>
      <td className={colDuration}><Skeleton className="h-4 w-14" /></td>
      <td className={colPrice}><Skeleton className="h-4 w-20" /></td>
      <td className={colStatus}><Skeleton className="h-6 w-20 rounded-full" /></td>
      <td className={colDate}><Skeleton className="h-4 w-24" /></td>
      <td className={colActions}>
        <div className="flex justify-end gap-2">
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </td>
    </tr>
  )
}

export function TemplatesTable({
  templates,
  totalCount,
  loading = false,
  hasActiveFilters,
  onView,
  onApproveClick,
  onRejectClick,
  onClearFilters,
}: TemplatesTableProps) {
  const hasTemplates = templates.length > 0

  const tableShell = (
    <div className="max-h-[600px] overflow-auto">
      <table className="w-full table-fixed">
        <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/90 dark:border-slate-700 dark:bg-slate-900/50">
          <tr>
            <th className={`${colTemplate} text-left text-sm font-semibold text-slate-600 dark:text-slate-300`}>
              Mẫu workshop
            </th>
            <th className={`${colVendor} text-left text-sm font-semibold text-slate-600 dark:text-slate-300`}>
              Đối tác
            </th>
            <th className={`${colDuration} text-left text-sm font-semibold text-slate-600 dark:text-slate-300`}>
              Thời lượng
            </th>
            <th className={`${colPrice} text-left text-sm font-semibold text-slate-600 dark:text-slate-300`}>
              Giá
            </th>
            <th className={`${colStatus} text-left text-sm font-semibold text-slate-600 dark:text-slate-300`}>
              Trạng thái
            </th>
            <th className={`${colDate} text-left text-sm font-semibold text-slate-600 dark:text-slate-300`}>
              Ngày tạo
            </th>
            <th className={`${colActions} text-right text-sm font-semibold text-slate-600 dark:text-slate-300`}>
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            : hasTemplates
              ? templates.map((template) => (
                <tr
                  key={template.id}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-900/40"
                >
                  <td className={colTemplate}>
                    <div className="flex items-start gap-3">
                      <img
                        src={
                          template.images[0]?.imageUrl ||
                          "https://via.placeholder.com/60x40?text=No+Image"
                        }
                        alt={template.name}
                        className="h-12 w-16 shrink-0 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/60x40?text=No+Image"
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 font-medium">
                          {template.name}
                        </p>
                        <p className="line-clamp-1 text-sm text-muted-foreground">
                          {template.shortDescription}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={`${colVendor} text-sm`}>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="line-clamp-1 font-medium">
                          {template.vendorName}
                        </span>
                        {template.vendorVerified === true && (
                          <CheckCircle className="h-3 w-3 shrink-0 text-green-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{template.vendorEmail}</span>
                      </div>
                      {template.vendorVerified === false && (
                        <Badge
                          variant="outline"
                          className="mt-1 inline-flex w-fit items-center gap-1 border-amber-300 bg-amber-50 text-xs text-amber-700"
                        >
                          <AlertCircle className="h-3 w-3" />
                          Chưa xác minh
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className={`${colDuration} text-sm`}>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">{formatDuration(template.estimatedDuration)}</span>
                    </div>
                  </td>
                  <td className={`${colPrice} text-sm font-medium`}>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">{formatPrice(template.defaultPrice)}</span>
                    </div>
                  </td>
                  <td className={colStatus}>
                    {getStatusBadge(template.status)}
                  </td>
                  <td className={`${colDate} text-sm text-muted-foreground`}>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">{formatDate(template.createdAt)}</span>
                    </div>
                  </td>
                  <td className={colActions}>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="transition-colors"
                        onClick={() => onView(template.id)}
                      >
                        Xem
                      </Button>
                      {template.status === WorkshopStatus.PENDING && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 transition-colors hover:bg-green-700"
                            onClick={() => onApproveClick(template)}
                          >
                            Duyệt
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="transition-colors"
                            onClick={() => onRejectClick(template)}
                          >
                            Từ chối
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
              : null}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {loading ? (
        tableShell
      ) : hasTemplates ? (
        tableShell
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <FileText className="mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">Không có mẫu</h3>
          <p className="mb-2 text-muted-foreground">
            {hasActiveFilters
              ? "Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm."
              : "Hiện chưa có mẫu workshop để xem."}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" className="transition-colors" onClick={onClearFilters}>
              Xóa bộ lọc
            </Button>
          )}
        </div>
      )}

      {!loading && (
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-xs text-muted-foreground dark:border-slate-700">
          <span>
            Hiển thị <strong>{templates.length}</strong> / <strong>{totalCount}</strong> mẫu
          </span>
        </div>
      )}
    </div>
  )
}
