import { StarFilled, StarOutlined, PictureOutlined } from "@ant-design/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Image as AntImage, Tag } from "antd"
import { WorkshopStatus, WorkshopTemplateResponse } from "../types"
import { formatDateTime } from "../utils/formatters"

interface TemplateDetailContentProps {
  template: WorkshopTemplateResponse;
  displayImage?: string;
  selectedImage: string | undefined;
  setSelectedImage: (val: string) => void;
}

export const TemplateDetailContent = ({
  template,
  displayImage,
  selectedImage,
  setSelectedImage
}: TemplateDetailContentProps) => {
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
                      Thumbnail
                    </Tag>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Full Description */}
      <Card className="rounded-2xl border-[#d3e4da] dark:border-white/10 shadow-sm">
        <CardHeader>
          <CardTitle>Full Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {template.fullDescription || template.shortDescription}
          </p>
        </CardContent>
      </Card>

      {/* Approval Info for ACTIVE templates */}
      {template.status === WorkshopStatus.ACTIVE && template.reviewedAt && (
        <Card className="rounded-2xl border-green-200 bg-green-50 dark:bg-green-950/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-400">Approval Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Approved at:</span> {formatDateTime(template.reviewedAt)}
            </p>
            {template.averageRating != null && (
              <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                <div className="flex items-center gap-0.5">
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
                  ({template.totalReview} reviews)
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
