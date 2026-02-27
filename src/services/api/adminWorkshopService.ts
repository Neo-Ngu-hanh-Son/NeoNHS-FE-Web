import apiClient from "./apiClient"
import type {
  PageResponse,
  ApiResponse,
  WorkshopTemplateResponse,
} from "@/pages/vendor/WorkshopTemplates/types"
import type { AdminWorkshopTemplateResponse } from "@/pages/admin/vendorTemplate/components/templates/types"

export interface AdminWorkshopTemplatesQuery {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: "asc" | "desc" | "ASC" | "DESC"
  status?: string
}

const BASE_URL = "/admin/vendors/workshop-templates"

export const adminWorkshopService = {
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
   * Get templates for a specific vendor (paginated)
   * GET /api/admin/vendors/{vendorId}/workshop-templates
   */
  async getVendorWorkshopTemplates(
    vendorId: string,
    params: AdminWorkshopTemplatesQuery = {},
  ): Promise<PageResponse<AdminWorkshopTemplateResponse>> {
    const query = new URLSearchParams()
    if (params.page !== undefined) query.append("page", params.page.toString())
    if (params.size !== undefined) query.append("size", params.size.toString())
    if (params.sortBy) query.append("sortBy", params.sortBy)
    if (params.sortDir) query.append("sortDir", params.sortDir)
    if (params.status) query.append("status", params.status)

    const endpoint = `/admin/vendors/${vendorId}/workshop-templates${
      query.toString() ? `?${query.toString()}` : ""
    }`
    const res =
      await apiClient.get<ApiResponse<PageResponse<AdminWorkshopTemplateResponse>>>(
        endpoint,
      )

    const data = (res?.data ?? res) as PageResponse<AdminWorkshopTemplateResponse>
    return data
  },

  /**
   * Approve a workshop template
   * POST /api/admin/vendors/workshop-templates/{id}/approve
   */
  async approveTemplate(
    id: string,
    notes?: string,
  ): Promise<WorkshopTemplateResponse> {
    const payload = notes ? { notes } : undefined
    const res =
      await apiClient.post<ApiResponse<WorkshopTemplateResponse>>(
        `${BASE_URL}/${id}/approve`,
        payload,
      )
    const data = (res?.data ?? res) as WorkshopTemplateResponse
    return data
  },

  /**
   * Reject a workshop template
   * POST /api/admin/vendors/workshop-templates/{id}/reject
   */
  async rejectTemplate(
    id: string,
    rejectReason: string,
  ): Promise<WorkshopTemplateResponse> {
    const res =
      await apiClient.post<ApiResponse<WorkshopTemplateResponse>>(
        `${BASE_URL}/${id}/reject`,
        { rejectReason },
      )
    const data = (res?.data ?? res) as WorkshopTemplateResponse
    return data
  },
}

export default adminWorkshopService

