import apiClient from "./apiClient";
import type {
  CreateHistoryAudioRequest,
  HistoryAudioResponse,
  ApiResponse,
} from "@/types";

const BASE = (pointId: string) => `/admin/points/${pointId}/history-audios`;

export const historyAudioService = {
  create: (pointId: string, data: CreateHistoryAudioRequest) =>
    apiClient.post<ApiResponse<HistoryAudioResponse>>(BASE(pointId), data),

  update: (pointId: string, id: string, data: CreateHistoryAudioRequest) =>
    apiClient.put<ApiResponse<HistoryAudioResponse>>(`${BASE(pointId)}/${id}`, data),

  getById: (pointId: string, id: string) =>
    apiClient.get<ApiResponse<HistoryAudioResponse>>(`${BASE(pointId)}/${id}`),

  getAllByPoint: (pointId: string) =>
    apiClient.get<ApiResponse<HistoryAudioResponse[]>>(BASE(pointId)),

  delete: (pointId: string, id: string) =>
    apiClient.delete<ApiResponse<null>>(`${BASE(pointId)}/${id}`),
};

export default historyAudioService;
