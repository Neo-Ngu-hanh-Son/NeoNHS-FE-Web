import { z } from "zod"

// Vendor Profile Response (extends User)
export interface VendorProfileResponse {
  // User fields (inherited)
  id: string // UUID
  email: string
  fullname: string
  phoneNumber: string
  avatarUrl: string | null
  role: string // "VENDOR"

  // Vendor-specific fields
  userId: string // UUID - reference to User entity
  businessName: string
  description: string | null
  address: string | null
  latitude: string | null
  longitude: string | null
  taxCode: string | null
  bankName: string | null
  bankAccountNumber: string | null
  bankAccountName: string | null
  isVerifiedVendor: boolean
  isActive: boolean
  isBanned: boolean

  // Metadata
  createdAt: string // ISO DateTime
  updatedAt: string // ISO DateTime

  // Additional stats
  totalTemplates?: number
  activeTemplates?: number
  totalSessions?: number
}

export interface CreateVendorRequest {
  // User credentials
  email: string // Valid email format
  fullname: string // Required
  phoneNumber?: string

  // Vendor profile
  businessName: string // Required
  description?: string
  address?: string
  taxCode?: string
  bankName?: string
  bankAccountNumber?: string
  bankAccountName?: string
}

// Update Vendor Request
export interface UpdateVendorRequest {
  fullname?: string
  phoneNumber?: string
  businessName?: string
  description?: string
  address?: string
  latitude?: string
  longitude?: string
  taxCode?: string
  bankName?: string
  bankAccountNumber?: string
  bankAccountName?: string
  isVerifiedVendor?: boolean // Admin can verify vendors
  isActive?: boolean // Admin can activate/deactivate
}

// Ban Vendor Request
export interface BanVendorRequest {
  reason?: string // Optional ban reason
}

// Paginated Response
export interface PageResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  totalPages: number
  totalElements: number
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  first: boolean
  numberOfElements: number
  empty: boolean
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean
  status: number
  message: string
  data: T
  timestamp: string
}

// Filter Options
export interface VendorFilterOptions {
  keyword?: string // Search in name, email, business name
  isVerified?: boolean
  isBanned?: boolean
  isActive?: boolean
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

// Vendor Stats
export interface VendorStats {
  total: number
  active: number
  banned: number
  pendingVerification: number
  verified: number
}

// Zod Validation Schemas
export const createVendorSchema = z.object({
  email: z.string().email("Invalid email format"),
  fullname: z.string().min(1, "Full name is required"),
  phoneNumber: z.string().optional(),
  businessName: z.string().min(1, "Business name is required"),
  description: z.string().optional(),
  address: z.string().optional(),
  taxCode: z.string().optional(),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountName: z.string().optional(),
})

export const updateVendorSchema = z.object({
  fullname: z.string().min(1, "Full name is required").optional(),
  phoneNumber: z.string().optional(),
  businessName: z.string().min(1, "Business name is required").optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  taxCode: z.string().optional(),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountName: z.string().optional(),
  isVerifiedVendor: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

export const banVendorSchema = z.object({
  reason: z.string().optional(),
})

export type CreateVendorFormData = z.infer<typeof createVendorSchema>
export type UpdateVendorFormData = z.infer<typeof updateVendorSchema>
export type BanVendorFormData = z.infer<typeof banVendorSchema>
