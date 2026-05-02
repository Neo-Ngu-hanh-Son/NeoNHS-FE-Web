import { WorkshopTemplateResponse, WorkshopStatus } from "../types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TemplateStatusBadge } from "./template-status-badge"
import { Edit2, Eye, Trash2, Send, Clock, Users, Star, Globe, EyeOff, StarHalf } from "lucide-react"
import { formatDuration, formatPrice, formatDate } from "../utils/formatters"

interface WorkshopTemplateCardProps {
  template: WorkshopTemplateResponse
  onEdit?: () => void
  onDelete?: () => void
  onSubmit?: () => void
  onView?: () => void
  onTogglePublish?: () => void
}

export function WorkshopTemplateCard({
  template,
  onEdit,
  onDelete,
  onSubmit,
  onView,
  onTogglePublish,
}: WorkshopTemplateCardProps) {
  const thumbnail = template.images.find(img => img.isThumbnail)?.imageUrl || template.images[0]?.imageUrl

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors shadow-sm cursor-pointer group">
      {/* Thumbnail Image */}
      {thumbnail && (
        <div
          className="relative h-48 shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700"
          onClick={onView}
        >
          <img
            src={thumbnail}
            alt={template.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/800x400?text=No+Image"
            }}
          />
          <div className="absolute top-3 right-3">
            <TemplateStatusBadge status={template.status} isPublished={template.isPublished} size="sm" />
          </div>
        </div>
      )}

      <CardHeader className="shrink-0 pb-3" onClick={onView}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {template.name}
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
          {template.shortDescription}
        </p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-3" onClick={onView}>
        {/* Price and Duration */}
        <div className="flex items-center justify-between text-sm border-t border-slate-100 dark:border-slate-700 pt-3">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
            <span className="text-base">{formatPrice(template.defaultPrice)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDuration(template.estimatedDuration)}</span>
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Users className="w-4 h-4 text-slate-400" />
          <span>{template.maxParticipants === 999999 ? 'Không giới hạn' : `${template.minParticipants} - ${template.maxParticipants} người tham gia`}</span>
        </div>

        {/* Tags */}
        {template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {template.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="text-[10px] uppercase font-bold tracking-wider rounded-md transition-colors"
                style={{
                  borderColor: tag.tagColor + "40",
                  backgroundColor: tag.tagColor + "10",
                  color: tag.tagColor,
                }}
              >
                <div className="flex items-center gap-1">
                  {tag.iconUrl && (
                    <img src={tag.iconUrl} alt={tag.name} className="w-3 h-3 object-contain rounded-sm" />
                  )}
                  <span>{tag.name}</span>
                </div>
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-md">
                +{template.tags.length - 3} nữa
              </Badge>
            )}
          </div>
        )}

        {/* Created/Updated Date */}
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-auto pt-2">
          Cập nhật: {formatDate(template.updatedAt)}
        </p>
        {template.averageRating != 0 && (
          <div className="w-full flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-1">
              <p className="text-sm text-slate-400 dark:text-slate-500">
                Đánh giá:
              </p>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-xs">
                  {template.averageRating! >= star ? (
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ) : template.averageRating! >= star - 0.5 ? (
                    <StarHalf className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ) : (
                    <Star className="w-3.5 h-3.5 fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700" />
                  )}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
                {template.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                ({template.totalRatings})
              </span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto flex shrink-0 flex-wrap gap-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-4">
        {/* Status-based action buttons */}
        {template.status === WorkshopStatus.DRAFT && (
          <>
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit} className="flex-1 gap-1.5 text-slate-600 dark:text-slate-300">
                <Edit2 className="w-3.5 h-3.5" />
                Sửa
              </Button>
            )}
            {onSubmit && (
              <Button size="sm" onClick={onSubmit} className="flex-1 gap-1.5">
                <Send className="w-3.5 h-3.5" />
                Gửi duyệt
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="destructive" onClick={onDelete} className="px-3">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </>
        )}

        {template.status === WorkshopStatus.PENDING && (
          <>
            {onView && (
              <Button size="sm" variant="outline" onClick={onView} className="flex-1 gap-1.5 text-slate-600 dark:text-slate-300">
                <Eye className="w-3.5 h-3.5" />
                Xem
              </Button>
            )}
            <div className="flex-1 flex items-center justify-center">
              <span className="text-xs font-medium text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-full">
                Đang chờ duyệt...
              </span>
            </div>
          </>
        )}

        {template.status === WorkshopStatus.ACTIVE && (
          <>
            {onView && (
              <Button size="sm" variant="outline" onClick={onView} className="flex-1 gap-1.5 text-slate-600 dark:text-slate-300">
                <Eye className="w-3.5 h-3.5" />
                Xem
              </Button>
            )}
            {onTogglePublish && (
              <Button
                size="sm"
                variant={template.isPublished ? "outline" : "default"}
                onClick={onTogglePublish}
                className="flex-1 gap-1.5"
              >
                {template.isPublished ? (
                  <><EyeOff className="w-3.5 h-3.5" /> Ẩn</>
                ) : (
                  <><Globe className="w-3.5 h-3.5" /> Xuất bản</>
                )}
              </Button>
            )}
          </>
        )}

        {template.status === WorkshopStatus.REJECTED && (
          <>
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit} className="flex-1 gap-1.5 text-slate-600 dark:text-slate-300">
                <Edit2 className="w-3.5 h-3.5" />
                Sửa
              </Button>
            )}
            {onView && (
              <Button size="sm" variant="outline" onClick={onView} className="flex-1 gap-1.5 text-slate-600 dark:text-slate-300">
                <Eye className="w-3.5 h-3.5" />
                Xem lý do
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="destructive" onClick={onDelete} className="px-3">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  )
}

