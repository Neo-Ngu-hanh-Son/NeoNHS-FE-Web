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

export interface ForcedAlignmentResponse {
  words: ForcedAlignmentWord[];
  loss?: number;
}

// Google Gemini translation request / response types
export interface GeminiTranslationRequest {
  title: string;
  author: string;
  script: string;
  requiredLanguages: string[];
}

// Google Gemini translation response type
export interface GeminiTranslationObject {
  title: string;
  author: string;
  script: string;
  language: string;
}

//  Eleven lab generation responses
export interface ElevenLabsAudioGenerationResponse {
  audioUrl: string;
  audioBlob: Blob;
}
