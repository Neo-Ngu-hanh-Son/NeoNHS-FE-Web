import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarOutlined, UserOutlined, ClockCircleOutlined, DollarOutlined, TeamOutlined, TagsOutlined, InfoCircleOutlined, StarFilled, StarOutlined } from "@ant-design/icons"
import { WorkshopStatus, WorkshopTemplateResponse } from "../types"
import { formatPrice, formatDuration, formatDate } from "../utils/formatters"
import { TemplateDetailReviews } from "./TemplateDetailReviews"

interface TemplateDetailSidebarProps {
  template: WorkshopTemplateResponse;
}

export const TemplateDetailSidebar = ({ template }: TemplateDetailSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Workshop Details Card */}
      <Card className="rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center">
              <InfoCircleOutlined className="text-xl text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Chi Tiết Workshop</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
              <ClockCircleOutlined /> Thời lượng
            </p>
            <p className="text-base font-semibold">{formatDuration(template.estimatedDuration)}</p>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
              <DollarOutlined /> Giá cơ bản
            </p>
            <p className="text-2xl font-bold text-primary">{formatPrice(template.defaultPrice)}</p>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
              <TeamOutlined /> Người tham gia
            </p>
            <p className="text-base font-semibold">
              {template.minParticipants} - {template.maxParticipants} người
            </p>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Đơn vị tổ chức</p>
            <div className="flex items-center gap-2">
              <UserOutlined />
              <p className="text-base font-medium">{template.vendorName}</p>
            </div>
          </div>

          {template.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <TagsOutlined /> Danh mục
                </p>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      style={{
                        borderColor: tag.tagColor + "40",
                        backgroundColor: tag.tagColor + "10",
                        color: tag.tagColor,
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        {tag.iconUrl && (
                          <img src={tag.iconUrl} alt={tag.name} className="w-3.5 h-3.5 object-contain rounded-sm" />
                        )}
                        <span>{tag.name}</span>
                      </div>
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Timeline Card */}
      <Card className="rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/20 flex items-center justify-center">
              <CalendarOutlined className="text-xl text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Thông Tin Trạng Thái Workshop</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <CalendarOutlined className="text-muted-foreground" />
            <div>
              <p className="font-medium">Ngày tạo</p>
              <p className="text-muted-foreground">{formatDate(template.createdAt)}</p>
            </div>
          </div>
          {template.reviewedAt && template.status === WorkshopStatus.ACTIVE && (
            <>
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <CalendarOutlined className="text-green-500" />
                <div>
                  <p className="font-medium text-green-600 dark:text-green-400">Đã phê duyệt</p>
                  <p className="text-muted-foreground">{formatDate(template.reviewedAt)}</p>
                </div>
              </div>
            </>
          )}
          <Separator />
          <div className="flex items-center gap-2 text-sm">
            <CalendarOutlined className="text-muted-foreground" />
            <div>
              <p className="font-medium">Cập nhật lần cuối</p>
              <p className="text-muted-foreground">{formatDate(template.updatedAt)}</p>
            </div>
          </div>

        </CardContent>
      </Card>
      {template.averageRating != 0 && (
        <>
          <Separator />
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Đánh Giá Trung Bình</p>
            <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 w-fit">
              <div className="flex items-center gap-0.5 mt-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-base">
                    {template.averageRating! >= star ? (
                      <StarFilled className="text-amber-500" />
                    ) : template.averageRating! >= star - 0.5 ? (
                      <StarFilled className="text-amber-300" />
                    ) : (
                      <StarOutlined className="text-gray-300 dark:text-gray-600" />
                    )}
                  </span>
                ))}
              </div>
              <span className="font-bold text-lg text-amber-700 dark:text-amber-400">
                {template.averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({template.totalRatings})
              </span>
            </div>
          </div>
        </>
      )}
      {/* User Reviews (Compact) */}
      <TemplateDetailReviews templateId={template.id} />
    </div>
  )
}
