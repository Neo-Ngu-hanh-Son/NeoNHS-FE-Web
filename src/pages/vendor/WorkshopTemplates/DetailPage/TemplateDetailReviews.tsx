import { useEffect, useState } from "react"
import { ReviewService, ReviewResponse } from "@/services/api/reviewService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "antd"
import { StarFilled, StarOutlined, MessageOutlined, RightOutlined } from "@ant-design/icons"
import { formatDateTime } from "../utils/formatters"

interface TemplateDetailReviewsProps {
  templateId: string;
}

export const TemplateDetailReviews = ({ templateId }: TemplateDetailReviewsProps) => {
  const [reviews, setReviews] = useState<ReviewResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const data = await ReviewService.getWorkshopReviews(templateId, 0, 50)
        setReviews(data.content || [])
      } catch (error) {
        console.error("Failed to fetch reviews:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [templateId])

  if (loading) {
    return <div className="text-sm text-muted-foreground p-4">Đang tải đánh giá...</div>
  }

  if (reviews.length === 0) {
    return null
  }

  const displayReviews = reviews.slice(0, 3)

  return (
    <>
      <Card className="rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm mt-0">
        <CardHeader className="pb-4 flex flex-row justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/20 flex items-center justify-center">
              <MessageOutlined className="text-xl text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Đánh Giá ({reviews.length})</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayReviews.map((review) => (
          <div key={review.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/20">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 shrink-0 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100 flex items-center justify-center font-bold text-xs border border-emerald-200 dark:border-emerald-700 overflow-hidden">
                  {review.user.avatarUrl ? (
                    <img src={review.user.avatarUrl} alt={review.user.fullname} className="w-full h-full object-cover" />
                  ) : (
                     review.user.fullname?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{review.user.fullname}</h4>
                  <p className="text-xs text-muted-foreground">{formatDateTime(review.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-sm">
                    {review.rating >= star ? <StarFilled /> : <StarOutlined />}
                  </span>
                ))}
              </div>
            </div>
            
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 line-clamp-3">
              {review.comment}
            </p>

            {review.imageUrls && review.imageUrls.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {review.imageUrls.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="Review attachment"
                    className="w-12 h-12 rounded-md object-cover border border-slate-200 dark:border-slate-700"
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {reviews.length > 3 && (
          <Button 
            variant="ghost" 
            className="w-full text-primary mt-2 group" 
            onClick={() => setIsModalOpen(true)}
          >
            Xem tất cả {reviews.length} đánh giá <RightOutlined className="text-xs transition-transform group-hover:translate-x-1" />
          </Button>
        )}
      </CardContent>
    </Card>

    <Modal
      title={<div className="text-lg font-bold">Tất Cả Đánh Giá ({reviews.length})</div>}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      width={700}
      className="!p-0"
    >
      <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2 mt-4 custom-scrollbar">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/20">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100 flex items-center justify-center font-bold text-sm border border-emerald-200 dark:border-emerald-700 overflow-hidden">
                  {review.user.avatarUrl ? (
                    <img src={review.user.avatarUrl} alt={review.user.fullname} className="w-full h-full object-cover" />
                  ) : (
                     review.user.fullname?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{review.user.fullname}</h4>
                  <p className="text-xs text-muted-foreground">{formatDateTime(review.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-sm">
                    {review.rating >= star ? <StarFilled /> : <StarOutlined />}
                  </span>
                ))}
              </div>
            </div>
            
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
              {review.comment}
            </p>

            {review.imageUrls && review.imageUrls.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {review.imageUrls.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="Review attachment"
                    className="w-16 h-16 rounded-md object-cover border border-slate-200 dark:border-slate-700 cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  </>
  )
}
