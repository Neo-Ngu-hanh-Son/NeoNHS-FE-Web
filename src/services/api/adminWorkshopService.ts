import apiClient from "./apiClient"
import type {
  PageResponse,
  ApiResponse,
  WorkshopTemplateResponse,
} from "@/pages/vendor/WorkshopTemplates/types"
import type { AdminWorkshopTemplateResponse } from "@/pages/admin/vendorTemplate/components/templates/types"
import type { VendorProfileResponse } from "@/pages/admin/vendors/types"

export interface AdminWorkshopTemplatesQuery {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: "asc" | "desc" | "ASC" | "DESC"
  status?: string
}

export interface AdminVendorSummary {
  id: string
  businessName: string
  fullname: string
  email: string
  isVerifiedVendor: boolean
}

const BASE_URL = "/admin/vendors/workshop-templates"

export const adminWorkshopService = {
  /**
   * Get all vendors for dropdown/select usage
   * GET /api/admin/vendors
   */
  async getAllVendors(): Promise<AdminVendorSummary[]> {
    const res = await apiClient.get<
      ApiResponse<PageResponse<AdminVendorSummary>>
    >("/admin/vendors?page=1&size=100&sortBy=businessName&sortDir=asc")
    const data = (res?.data ?? res) as PageResponse<AdminVendorSummary>
    return data.content
  },

  /**
   * Get all workshop templates across all vendors (paginated)
   * GET /api/admin/vendors/workshop-templates
   */
  async getAllWorkshopTemplates(
    params: AdminWorkshopTemplatesQuery = {},
  ): Promise<PageResponse<AdminWorkshopTemplateResponse>> {
    const query = new URLSearchParams()
    if (params.page !== undefined) query.append("page", params.page.toString())
    if (params.size !== undefined) query.append("size", params.size.toString())
    if (params.sortBy) query.append("sortBy", params.sortBy)
    if (params.sortDir) query.append("sortDir", params.sortDir)
    if (params.status) query.append("status", params.status)

    const endpoint = `${BASE_URL}${query.toString() ? `?${query.toString()}` : ""}`
    const res =
      await apiClient.get<ApiResponse<PageResponse<AdminWorkshopTemplateResponse>>>(
        endpoint,
      )

    const data = (res?.data ?? res) as PageResponse<AdminWorkshopTemplateResponse>
    return data
  },

  /**
   * Get a single vendor profile by ID
   * GET /api/admin/vendors/{id}
   */
  async getVendorById(vendorId: string): Promise<VendorProfileResponse> {
    const res = await apiClient.get<ApiResponse<VendorProfileResponse>>(
      `/admin/vendors/${vendorId}`,
    )
    const data = (res?.data ?? res) as VendorProfileResponse
    return data
  },

  /**
   * Approve a workshop template (PENDING -> ACTIVE)
   * POST /api/admin/vendors/workshop-templates/{id}/approve
   * No request body required
   */
  async approveTemplate(
    id: string,
    adminNote?: string,
  ): Promise<WorkshopTemplateResponse> {
    const payload = adminNote ? { adminNote } : undefined
    const res = await apiClient.post<ApiResponse<WorkshopTemplateResponse>>(
      `${BASE_URL}/${id}/approve`,
      payload,
    )
    const data = (res?.data ?? res) as WorkshopTemplateResponse
    return data
  },

  /**
   * Reject a workshop template (PENDING -> REJECTED)
   * POST /api/admin/vendors/workshop-templates/{id}/reject
   * @param adminNote - Required reason for rejection
   */
  async rejectTemplate(
    id: string,
    adminNote: string,
  ): Promise<WorkshopTemplateResponse> {
    const res = await apiClient.post<ApiResponse<WorkshopTemplateResponse>>(
      `${BASE_URL}/${id}/reject`,
      { adminNote },
    )
    const data = (res?.data ?? res) as WorkshopTemplateResponse
    return data
  },
}

export default adminWorkshopService

