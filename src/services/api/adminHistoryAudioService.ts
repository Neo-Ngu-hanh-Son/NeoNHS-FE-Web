import {
  CreateTextToSpeechRequest,
  HistoryAudioTranslationObject,
  HistoryAudioTranslationRequest,
} from '@/pages/admin/historyAudio/types';
import apiClient from './apiClient';
import type { CreateHistoryAudioRequest, HistoryAudioResponse, ApiResponse } from '@/types';

const BASE = (pointId: string) => `/admin/points/${pointId}/history-audios`;

export const adminHistoryAudioService = {
  create: (pointId: string, data: CreateHistoryAudioRequest) =>
    apiClient.post<ApiResponse<HistoryAudioResponse>>(BASE(pointId), data),

  update: (pointId: string, id: string, data: CreateHistoryAudioRequest) =>
    apiClient.put<ApiResponse<HistoryAudioResponse>>(`${BASE(pointId)}/${id}`, data),

  getById: (pointId: string, id: string) => apiClient.get<ApiResponse<HistoryAudioResponse>>(`${BASE(pointId)}/${id}`),

  getAllByPoint: (pointId: string) => apiClient.get<ApiResponse<HistoryAudioResponse[]>>(BASE(pointId)),

  delete: (pointId: string, id: string) => apiClient.delete<ApiResponse<null>>(`${BASE(pointId)}/${id}`),

  translate: (data: HistoryAudioTranslationRequest) =>
    apiClient.post<ApiResponse<HistoryAudioTranslationObject[]>>(`${BASE('-1')}/translate`, data),

  textToSpeech: (data: CreateTextToSpeechRequest): Promise<Blob> => {
    return apiClient.post(`${BASE('-1')}/text-to-speech`, data, {
      responseType: 'blob',
    });
  },

  forcedAlignment: (data: { file: Blob; text: string }) => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('text', data.text);

    return apiClient.post(`${BASE('-1')}/forced-alignment`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default adminHistoryAudioService;
