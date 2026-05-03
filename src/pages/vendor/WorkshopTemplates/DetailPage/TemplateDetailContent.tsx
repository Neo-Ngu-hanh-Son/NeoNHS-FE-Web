import { StarFilled, StarOutlined, PictureOutlined } from "@ant-design/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Image as AntImage, Tag } from "antd"
import { WorkshopTemplateResponse } from "../types"
import { WorkshopSessionResponse } from "../../WorkshopSessions/types"
import { formatPrice } from "../utils/formatters"
import { CalendarOutlined, ClockCircleOutlined, InfoCircleOutlined, TeamOutlined, RightOutlined } from "@ant-design/icons"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface TemplateDetailContentProps {
  template: WorkshopTemplateResponse;
  sessions?: WorkshopSessionResponse[];
  displayImage?: string;
  selectedImage: string | undefined;
  setSelectedImage: (val: string) => void;
}

export const TemplateDetailContent = ({
  template,
  sessions = [],
  displayImage,
  selectedImage,
  setSelectedImage
}: TemplateDetailContentProps) => {
  const navigate = useNavigate()

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Image Gallery */}
      {template.images.length > 0 && (
        <Card className="rounded-2xl border-[#d3e4da] dark:border-white/10 shadow-sm overflow-hidden">
          <AntImage.PreviewGroup items={template.images.map(img => img.imageUrl)}>
            <div className="relative [&>.ant-image]:w-full">
              <AntImage
                src={displayImage}
                alt={template.name}
                className="!w-full !h-[400px] object-cover"
                fallback="https://via.placeholder.com/800x400?text=No+Image"
              />
            </div>
          </AntImage.PreviewGroup>
          {template.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 p-4">
              {template.images.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative cursor-pointer group"
                  onClick={() => setSelectedImage(img.imageUrl)}
                >
                  <img
                    src={img.imageUrl}
                    alt={`Workshop image ${idx + 1}`}
                    className={`w-full h-20 object-cover rounded-md transition-all ${displayImage === img.imageUrl
                      ? "ring-2 ring-primary opacity-100"
                      : "opacity-70 group-hover:opacity-100"
                      }`}
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/200x200?text=Image"
                    }}
                  />
                  {img.isThumbnail && (
                    <Tag
                      color="blue"
                      className="!absolute top-1 left-1 !m-0 !text-[10px] !px-1 !leading-4"
                      icon={<PictureOutlined />}
                    >
                      Ảnh bìa
                    </Tag>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Full Description */}
      <Card className="rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center">
              <InfoCircleOutlined className="text-xl text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Mô Tả Chi Tiết</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {template.fullDescription || template.shortDescription}
          </p>
        </CardContent>
      </Card>

      {/* Workshop Sessions */}
      {sessions.length > 0 && (
        <Card className="rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center">
                <CalendarOutlined className="text-xl text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Các Phiên Workshop Sắp Tới</CardTitle>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="gap-2 text-primary" onClick={() => navigate("/vendor/workshop-sessions")}>
              Xem tất cả <RightOutlined className="text-xs" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="group relative flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700">
                    <img
                      src={session.workshopTemplate?.images?.find(img => img.isThumbnail)?.imageUrl || session.workshopTemplate?.images?.[0]?.imageUrl || displayImage}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image" }}
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-primary transition-colors">
                      {template.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <CalendarOutlined />
                        {new Date(session.startTime).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ClockCircleOutlined />
                        {new Date(session.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <TeamOutlined />
                        {session.currentEnrollments}/{session.maxParticipants === 999999 ? 'Không giới hạn' : session.maxParticipants + ' chỗ'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                  <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-semibold">
                    Workshop
                  </div>
                  <div className="font-bold text-primary">
                    {formatPrice(session.price)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
