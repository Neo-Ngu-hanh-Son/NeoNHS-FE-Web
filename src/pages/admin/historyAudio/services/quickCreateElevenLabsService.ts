import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import type { ForcedAlignmentResponse, ForcedAlignmentWord } from '@/pages/admin/historyAudio/types';

interface GenerateQuickCreateAudioAndTimingOptions {
  text: string;
  voiceId: string;
  languageCode: string;
  apiKey?: string;
  modelId?: string;
  useMock?: boolean;
}

export interface GenerateQuickCreateAudioAndTimingResult {
  audioBlob: Blob;
  words: ForcedAlignmentWord[];
}

const MOCK_SAMPLE_RATE = 16_000;
const MOCK_BYTES_PER_SAMPLE = 2;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createSilentWavBlob(durationSeconds: number) {
  const safeDurationSeconds = Math.max(1, Math.min(durationSeconds, 30));
  const sampleCount = Math.floor(MOCK_SAMPLE_RATE * safeDurationSeconds);
  const dataSize = sampleCount * MOCK_BYTES_PER_SAMPLE;
  const wavBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(wavBuffer);

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, MOCK_SAMPLE_RATE, true);
  view.setUint32(28, MOCK_SAMPLE_RATE * MOCK_BYTES_PER_SAMPLE, true);
  view.setUint16(32, MOCK_BYTES_PER_SAMPLE, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  return new Blob([wavBuffer], { type: 'audio/wav' });
}

function buildMockAlignedWords(text: string): ForcedAlignmentWord[] {
  const tokens = text.trim().split(/\s+/).filter(Boolean);

  let cursor = 0;
  return tokens.map((token) => {
    const duration = Math.max(0.25, Math.min(0.75, 0.2 + token.length * 0.03));
    const word: ForcedAlignmentWord = {
      text: token,
      start: Number(cursor.toFixed(3)),
      end: Number((cursor + duration).toFixed(3)),
      loss: 0,
    };
    cursor += duration;
    return word;
  });
}

export async function generateQuickCreateAudioAndTiming({
  text,
  voiceId,
  languageCode,
  apiKey,
  modelId,
  useMock = false,
}: GenerateQuickCreateAudioAndTimingOptions): Promise<GenerateQuickCreateAudioAndTimingResult> {
  const normalizedText = text.trim();
  if (!normalizedText) {
    throw new Error('Thiếu nội dung kịch bản để tạo audio');
  }

  if (!useMock && !apiKey) {
    throw new Error('Thiếu khóa API ElevenLabs');
  }

  const mockModeEnabled = useMock;
  if (mockModeEnabled) {
    await sleep(700);
    const mockDuration = Math.max(2, Math.min(20, normalizedText.length / 8));
    const audioBlob = createSilentWavBlob(mockDuration);

    await sleep(450);
    const words = buildMockAlignedWords(normalizedText);

    return {
      audioBlob,
      words,
    };
  }

  const elevenlabs = new ElevenLabsClient({ apiKey });
  const audio = await elevenlabs.textToSpeech.convert(voiceId, {
    text: normalizedText,
    modelId: modelId || 'eleven_multilingual_v2',
    outputFormat: 'mp3_44100_128',
    languageCode: languageCode,
  });

  const audioBlob = await new Response(audio).blob();

  const response = (await elevenlabs.forcedAlignment.create({
    file: audioBlob,
    text: normalizedText,
  })) as ForcedAlignmentResponse;

  const words = response.words ?? [];
  if (!words.length) {
    throw new Error('Không nhận được dữ liệu căn chỉnh từ ElevenLabs');
  }

  return {
    audioBlob,
    words,
  };
}
