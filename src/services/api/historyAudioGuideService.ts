import { apiClient } from "./apiClient";
import type { ApiResponse } from "@/types";
import type { ForcedAlignmentWord } from "@/pages/admin/historyAudio/types";

export interface SaveHistoryAudioPayload {
  pointId: string;
  audioUrl: string;
  historyText: string;
  words: ForcedAlignmentWord[];
  metadata?: {
    mode: "generate" | "upload";
    modelId?: string;
    voiceId?: string;
    language?: string;
  };
}

export interface HistoryAudioGuideResponse {
  id: string;
  audioUrl: string;
  historyText: string;
  words: ForcedAlignmentWord[];
}

export const historyAudioGuideService = {
  saveGuide: async (
    payload: SaveHistoryAudioPayload,
  ): Promise<HistoryAudioGuideResponse> => {
    const res = await apiClient.post<ApiResponse<HistoryAudioGuideResponse>>(
      "/admin/audio-history-guides",
      payload,
    );
    return res.data;
  },
};

export default historyAudioGuideService;
