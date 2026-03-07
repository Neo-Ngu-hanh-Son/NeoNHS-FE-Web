
export type TimingPhase = "idle" | "recording" | "paused" | "done";
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
