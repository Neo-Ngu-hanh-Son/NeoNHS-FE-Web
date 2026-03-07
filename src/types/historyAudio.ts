export interface WordTiming {
  text: string;
  start: number;
  end: number;
}

export interface AudioMetadata {
  mode: "generate" | "upload" | null;
  modelId: string | null;
  voiceId: string | null;
  language: string | null;
  title: string | null;
  artist: string | null;
  coverImage: string | null;
}

export interface CreateHistoryAudioRequest {
  audioUrl?: string | null;
  historyText?: string | null;
  words?: WordTiming[] | null;
  metadata?: AudioMetadata | null;
}

export interface HistoryAudioResponse {
  id: string;
  pointId: string;
  audioUrl?: string | null;
  historyText?: string | null;
  words?: WordTiming[] | null;
  metadata?: AudioMetadata | null;
  createdAt: string;
  updatedAt: string;
}
