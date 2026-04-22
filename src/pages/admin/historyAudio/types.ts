export type TimingPhase = 'idle' | 'recording' | 'paused' | 'done';
export interface TimedSentence {
  text: string;
  startTime: number;
}

export interface ForcedAlignmentWord {
  text: string;
  start: number;
  end: number;
  loss?: number;
}

// Back end audio related APIs
export interface CreateTextToSpeechRequest {
  voiceId: string;
  text: string;
  modelId: string;
  outputFormat: string;
  languageCode: string;
}

export interface ForcedAlignmentResponse {
  words: ForcedAlignmentWord[];
  loss?: number;
}

export interface HistoryAudioTranslationRequest {
  title: string;
  author: string;
  script: string;
  requiredLanguages: string[];
}

export interface HistoryAudioTranslationObject {
  title: string;
  author: string;
  script: string;
  language: string;
}

export interface ElevenLabsAudioGenerationResponse {
  audioUrl: string;
  audioBlob: Blob;
}
