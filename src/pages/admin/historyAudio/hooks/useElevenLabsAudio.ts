import { useCallback, useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { ELEVEN_LABS_MODELS, ELEVEN_LABS_VOICES } from '@/pages/admin/historyAudio/constants';
import type { ForcedAlignmentResponse, ForcedAlignmentWord } from '@/pages/admin/historyAudio/types';

interface UseElevenLabsAudioOptions {
  apiKey?: string;
  useMock?: boolean;
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

export function useElevenLabsAudio({ apiKey, useMock }: UseElevenLabsAudioOptions) {
  const [modelId, setModelId] = useState<string>(ELEVEN_LABS_MODELS[0].id);
  const [voiceId, setVoiceId] = useState<string>(ELEVEN_LABS_VOICES[0].id);
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [aligningWords, setAligningWords] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState('');
  const [generatedAudioBlob, setGeneratedAudioBlob] = useState<Blob | null>(null);
  const [alignedWords, setAlignedWords] = useState<ForcedAlignmentWord[]>([]);

  const mockModeEnabled = useMock ?? !apiKey;

  const generatedUrlRef = useRef<string | null>(null);

  const revokeGeneratedObjectUrl = useCallback(() => {
    if (generatedUrlRef.current) {
      URL.revokeObjectURL(generatedUrlRef.current);
      generatedUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      revokeGeneratedObjectUrl();
    };
  }, [revokeGeneratedObjectUrl]);

  const setGeneratedAudioFromUrl = useCallback(
    (url: string) => {
      revokeGeneratedObjectUrl();
      setGeneratedAudioBlob(null);
      setGeneratedAudioUrl(url);
    },
    [revokeGeneratedObjectUrl],
  );

  const clearGeneratedAudio = useCallback(() => {
    revokeGeneratedObjectUrl();
    setGeneratedAudioBlob(null);
    setGeneratedAudioUrl('');
  }, [revokeGeneratedObjectUrl]);

  const resetElevenLabsState = useCallback(() => {
    setModelId(ELEVEN_LABS_MODELS[0].id);
    setVoiceId(ELEVEN_LABS_VOICES[0].id);
    clearGeneratedAudio();
    setAlignedWords([]);
  }, [clearGeneratedAudio]);

  const handleGenerateAudio = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        message.warning('Vui lòng nhập nội dung trước');
        return false;
      }

      if (!mockModeEnabled && !apiKey) {
        message.error('Thiếu khóa API ElevenLabs');
        return false;
      }

      setGeneratingAudio(true);
      try {
        let blob: Blob;
        if (mockModeEnabled) {
          await sleep(700);
          const mockDuration = Math.max(2, Math.min(20, text.trim().length / 8));
          blob = createSilentWavBlob(mockDuration);
        } else {
          const elevenlabs = new ElevenLabsClient({ apiKey });
          const audio = await elevenlabs.textToSpeech.convert(voiceId, {
            text,
            modelId,
            outputFormat: 'mp3_44100_128',
          });

          blob = await new Response(audio).blob();
        }

        const url = URL.createObjectURL(blob);

        revokeGeneratedObjectUrl();
        generatedUrlRef.current = url;

        setGeneratedAudioBlob(blob);
        setGeneratedAudioUrl(url);
        setAlignedWords([]);
        message.success(mockModeEnabled ? 'Đã tạo âm thanh giả lập' : 'Đã tạo âm thanh');
        return true;
      } catch (error) {
        console.error(error);
        message.error('Tạo âm thanh thất bại');
        return false;
      } finally {
        setGeneratingAudio(false);
      }
    },
    [apiKey, mockModeEnabled, modelId, revokeGeneratedObjectUrl, voiceId],
  );

  const handleGenerateWordTiming = useCallback(
    async (audioBlob: Blob | null, text: string) => {
      if (!audioBlob) {
        message.warning('Vui lòng cung cấp file âm thanh trước');
        return false;
      }

      if (!text.trim()) {
        message.warning('Vui lòng nhập nội dung trước khi căn chỉnh từ');
        return false;
      }

      if (!mockModeEnabled && !apiKey) {
        message.error('Thiếu khóa API ElevenLabs');
        return false;
      }

      setAligningWords(true);
      try {
        let words: ForcedAlignmentWord[] = [];
        if (mockModeEnabled) {
          await sleep(500);
          words = buildMockAlignedWords(text);
        } else {
          const elevenlabs = new ElevenLabsClient({ apiKey });
          const response = (await elevenlabs.forcedAlignment.create({
            file: audioBlob,
            text,
          })) as ForcedAlignmentResponse;
          words = response.words ?? [];
        }

        if (!words.length) {
          message.warning('Không nhận được dữ liệu căn chỉnh từ');
          return false;
        }

        setAlignedWords(words);
        message.success(
          mockModeEnabled
            ? `Đã tạo mốc thời gian giả lập cho ${words.length} từ`
            : `Đã tạo thời điểm cho ${words.length} từ`,
        );
        return true;
      } catch (error) {
        console.error(error);
        message.error('Căn chỉnh thời điểm thất bại');
        return false;
      } finally {
        setAligningWords(false);
      }
    },
    [apiKey, mockModeEnabled],
  );

  return {
    modelId,
    setModelId,
    voiceId,
    setVoiceId,
    generatingAudio,
    aligningWords,
    generatedAudioUrl,
    generatedAudioBlob,
    alignedWords,
    setAlignedWords,
    setGeneratedAudioFromUrl,
    clearGeneratedAudio,
    resetElevenLabsState,
    handleGenerateAudio,
    handleGenerateWordTiming,
  };
}
