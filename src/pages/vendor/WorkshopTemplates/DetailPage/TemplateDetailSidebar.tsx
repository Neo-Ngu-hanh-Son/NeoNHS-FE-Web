import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarOutlined, UserOutlined } from "@ant-design/icons"
import { WorkshopStatus, WorkshopTemplateResponse } from "../types"
import { formatPrice, formatDuration, formatDate } from "../utils/formatters"

interface TemplateDetailSidebarProps {
  template: WorkshopTemplateResponse;
}

export const TemplateDetailSidebar = ({ template }: TemplateDetailSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Workshop Details Card */}
      <Card className="rounded-2xl border-[#d3e4da] dark:border-white/10 shadow-sm">
        <CardHeader>
          <CardTitle>Workshop Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Duration</p>
            <p className="text-base font-semibold">{formatDuration(template.estimatedDuration)}</p>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Base Price</p>
            <p className="text-2xl font-bold text-primary">{formatPrice(template.defaultPrice)}</p>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Participants</p>
            <p className="text-base font-semibold">
              {template.minParticipants} - {template.maxParticipants} people
            </p>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Vendor</p>
            <div className="flex items-center gap-2">
              <UserOutlined />
              <p className="text-base">{template.vendorName}</p>
            </div>
          </div>

          {template.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Tags</p>
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
      <Card className="rounded-2xl border-[#d3e4da] dark:border-white/10 shadow-sm">
        <CardHeader>
          <CardTitle>Approval Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <CalendarOutlined className="text-muted-foreground" />
            <div>
              <p className="font-medium">Created</p>
              <p className="text-muted-foreground">{formatDate(template.createdAt)}</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-2 text-sm">
            <CalendarOutlined className="text-muted-foreground" />
            <div>
              <p className="font-medium">Last Updated</p>
              <p className="text-muted-foreground">{formatDate(template.updatedAt)}</p>
            </div>
          </div>
          {template.reviewedAt && template.status === WorkshopStatus.ACTIVE && (
            <>
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <CalendarOutlined className="text-green-500" />
                <div>
                  <p className="font-medium text-green-600 dark:text-green-400">Approved</p>
                  <p className="text-muted-foreground">{formatDate(template.reviewedAt)}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
