import { z } from "zod"

// Workshop Template Status
export enum WorkshopStatus {
  DRAFT = "DRAFT",       // Created but not submitted
  PENDING = "PENDING",   // Submitted, awaiting approval
  ACTIVE = "ACTIVE",     // Approved and published
  REJECTED = "REJECTED"  // Rejected by admin
}

// Workshop Tag
export interface WTagResponse {
  id: string // UUID
  name: string
  description: string
  tagColor: string // hex color
  iconUrl: string | null
}

// Workshop Image
export interface WorkshopImageResponse {
  id: string // UUID
  imageUrl: string
  isThumbnail: boolean
}

// Workshop Template Response
export interface WorkshopTemplateResponse {
  id: string // UUID
  name: string
  shortDescription: string
  fullDescription: string
  estimatedDuration: number // in minutes
  defaultPrice: number // BigDecimal
  minParticipants: number
  maxParticipants: number
  status: WorkshopStatus
  averageRating: number | null
  totalReview: number
  vendorId: string // UUID
  vendorName: string
  createdAt: string // ISO DateTime
  updatedAt: string // ISO DateTime
  
  // Approval tracking
  rejectReason: string | null
  approvedBy: string | null // UUID
  approvedAt: string | null // ISO DateTime
  
  images: WorkshopImageResponse[]
  tags: WTagResponse[]
}

// Create Template Request
export interface CreateWorkshopTemplateRequest {
  name: string // max 255 chars, required
  shortDescription: string // max 500 chars, optional
  fullDescription: string // optional
  estimatedDuration: number // positive, required
  defaultPrice: number // > 0, required
  minParticipants: number // positive, required
  maxParticipants: number // positive, required
  imageUrls: string[] // at least 1 image required
  thumbnailIndex: number // default 0, must be valid index
  tagIds: string[] // UUID[], at least 1 required
}

// Update Template Request (all fields optional)
export interface UpdateWorkshopTemplateRequest {
  name?: string
  shortDescription?: string
  fullDescription?: string
  estimatedDuration?: number
  defaultPrice?: number
  minParticipants?: number
  maxParticipants?: number
  imageUrls?: string[]
  thumbnailIndex?: number
  tagIds?: string[]
}

// Pagination Response
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number // current page
  first: boolean
  last: boolean
}

// API Response Wrapper
export interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

// Form validation schema
export const workshopTemplateSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(255, "Name must not exceed 255 characters"),
  
  shortDescription: z.string()
    .max(500, "Short description must not exceed 500 characters")
    .optional(),
  
  fullDescription: z.string().optional(),
  
  estimatedDuration: z.number()
    .positive("Duration must be positive")
    .int("Duration must be a whole number"),
  
  defaultPrice: z.number()
    .positive("Price must be greater than 0")
    .min(0.01, "Price must be at least $0.01"),
  
  minParticipants: z.number()
    .positive("Must be at least 1")
    .int("Must be a whole number"),
  
  maxParticipants: z.number()
    .positive("Must be at least 1")
    .int("Must be a whole number"),
  
  imageUrls: z.array(z.string().url("Must be a valid URL"))
    .min(1, "At least one image is required"),
  
  thumbnailIndex: z.number()
    .min(0, "Invalid thumbnail index"),
  
  tagIds: z.array(z.string())
    .min(1, "At least one tag is required")
})

export type WorkshopTemplateFormData = z.infer<typeof workshopTemplateSchema>
