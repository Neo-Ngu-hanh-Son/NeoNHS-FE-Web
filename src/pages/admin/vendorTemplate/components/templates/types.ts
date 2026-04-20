import { z } from "zod"
import { WorkshopStatus, WorkshopTemplateResponse } from "@/pages/vendor/WorkshopTemplates/types"

// Admin-specific template review types
export interface AdminTemplateReview {
  templateId: string
  reviewedBy: string | null
  reviewedAt: string | null
  status: WorkshopStatus
  adminNote: string | null
}

// Reject Template Request
export interface RejectTemplateRequest {
  adminNote: string
}

// Extended template with vendor info for admin view
export interface AdminWorkshopTemplateResponse extends WorkshopTemplateResponse {
  vendorEmail?: string
  vendorPhone?: string
  vendorVerified?: boolean
  submittedAt?: string
  reviewedBy: string
  reviewedAt: string
}

// Filter options for admin template list
export interface AdminTemplateFilterOptions {
  status?: WorkshopStatus
  vendorId?: string
  keyword?: string
  isVerified?: boolean // Filter by vendor verification
  sortBy?: "createdAt" | "updatedAt" | "name" | "vendorName"
  sortDirection?: "ASC" | "DESC"
}

// Template statistics for admin dashboard
export interface AdminTemplateStats {
  total: number
  pending: number
  approved: number
  rejected: number
  draft: number
}

// Zod validation schema
export const rejectTemplateSchema = z.object({
  adminNote: z.string().min(10, "Vui lòng nhập lý do chi tiết (tối thiểu 10 ký tự)."),
})

export type RejectTemplateFormData = z.infer<typeof rejectTemplateSchema>

// Re-export WorkshopStatus for convenience
export { WorkshopStatus }

