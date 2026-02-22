import { z } from "zod"
import { WorkshopTemplateResponse, WTagResponse, WorkshopImageResponse } from "../WorkshopTemplates/types"

// Session Status
export enum SessionStatus {
  SCHEDULED = "SCHEDULED",   // Future session, bookable
  ONGOING = "ONGOING",       // Currently happening
  COMPLETED = "COMPLETED",   // Past session
  CANCELLED = "CANCELLED"    // Cancelled by vendor
}

// Workshop Session Response
export interface WorkshopSessionResponse {
  // Session-specific info
  id: string // UUID
  startTime: string // ISO DateTime
  endTime: string // ISO DateTime
  price: number // Can differ from template default
  maxParticipants: number
  currentEnrollments: number
  availableSlots: number // maxParticipants - currentEnrollments
  status: SessionStatus
  createdAt: string
  updatedAt: string
  
  // Template details (embedded)
  workshopTemplate: {
    id: string
    name: string
    shortDescription: string
    fullDescription: string
    estimatedDuration: number
    minParticipants: number
    averageRating: number | null
    totalReview: number
    images: WorkshopImageResponse[]
    tags: WTagResponse[]
  }
  
  // Vendor details
  vendor: {
    id: string
    name: string
    email: string
    avatar?: string
  }
}

// Create Session Request
export interface CreateWorkshopSessionRequest {
  workshopTemplateId: string // UUID, must be ACTIVE template
  startTime: string // ISO DateTime, must be in future
  endTime: string // ISO DateTime, must be after startTime
  price?: number // Optional, defaults to template's defaultPrice
  maxParticipants?: number // Optional, defaults to template's maxParticipants
}

// Update Session Request
export interface UpdateWorkshopSessionRequest {
  startTime?: string
  endTime?: string
  price?: number
  maxParticipants?: number
}

// Calendar Event (for display)
export interface CalendarEvent {
  id: string
  title: string // Workshop name
  start: Date
  end: Date
  status: SessionStatus
  availableSlots: number
  currentEnrollments: number
  maxParticipants: number
  price: number
  thumbnailUrl: string
  session: WorkshopSessionResponse // Full data
}

// Filter Options
export interface SessionFilterOptions {
  keyword?: string
  vendorId?: string
  tagId?: string
  status?: SessionStatus
  startDate?: string // ISO DateTime
  endDate?: string // ISO DateTime
  minPrice?: number
  maxPrice?: number
  availableOnly?: boolean
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
export const workshopSessionSchema = z.object({
  workshopTemplateId: z.string()
    .min(1, "Please select a workshop template"),
  
  startTime: z.date({
    required_error: "Start time is required",
  }),
  
  endTime: z.date({
    required_error: "End time is required",
  }),
  
  price: z.number()
    .positive("Price must be greater than 0")
    .optional(),
  
  maxParticipants: z.number()
    .positive("Must be at least 1")
    .int("Must be a whole number")
    .optional(),
}).refine((data) => data.endTime > data.startTime, {
  message: "End time must be after start time",
  path: ["endTime"],
})

export type WorkshopSessionFormData = z.infer<typeof workshopSessionSchema>
