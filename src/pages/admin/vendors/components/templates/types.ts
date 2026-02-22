import { z } from "zod"
import { WorkshopStatus, WorkshopTemplateResponse } from "@/pages/vendor/WorkshopTemplates/types"

// Admin-specific template review types
export interface AdminTemplateReview {
  templateId: string
  reviewedBy: string | null // Admin ID
  reviewedAt: string | null
  status: WorkshopStatus
  rejectReason: string | null
}

// Approve Template Request
export interface ApproveTemplateRequest {
  templateId: string
  notes?: string // Optional admin notes
}

// Reject Template Request
export interface RejectTemplateRequest {
  templateId: string
  reason: string // Required rejection reason
}

// Extended template with vendor info for admin view
export interface AdminWorkshopTemplateResponse extends WorkshopTemplateResponse {
  vendorEmail?: string
  vendorPhone?: string
  vendorVerified?: boolean
  submittedAt?: string
  reviewedBy?: string
  reviewedAt?: string
}

// Filter options for admin template list
export interface AdminTemplateFilterOptions {
  status?: WorkshopStatus
  vendorId?: string
  keyword?: string
  isVerified?: boolean // Filter by vendor verification
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'vendorName'
  sortDirection?: 'ASC' | 'DESC'
}

// Template statistics for admin dashboard
export interface AdminTemplateStats {
  total: number
  pending: number
  approved: number
  rejected: number
  draft: number
}

// Zod validation schemas
export const approveTemplateSchema = z.object({
  notes: z.string().optional(),
})

export const rejectTemplateSchema = z.object({
  reason: z.string().min(10, "Please provide a detailed reason (minimum 10 characters)"),
})

export type ApproveTemplateFormData = z.infer<typeof approveTemplateSchema>
export type RejectTemplateFormData = z.infer<typeof rejectTemplateSchema>

// Re-export WorkshopStatus for convenience
export { WorkshopStatus }
