import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { useCallback } from 'react';
import { ElevenLabsAudioGenerationResponse, ForcedAlignmentResponse } from '../../pages/admin/historyAudio/types';
import adminHistoryAudioService from './adminHistoryAudioService';

const API_KEY = process.env.REACT_APP_ELEVENLABS_API_KEY || '';

const handleGenerateAudio = async ({
  text,
  voiceId,
  modelId,
  languageCode,
}: {
  text: string;
  voiceId: string;
  modelId: string;
  languageCode: string;
}): Promise<ElevenLabsAudioGenerationResponse> => {
  if (!text.trim()) {
    throw new Error('Vui lòng nhập nội dung trước');
  }
  if (!API_KEY) {
    throw new Error('Thiếu khóa API ElevenLabs');
  }

  try {
    // const elevenlabs = new ElevenLabsClient({ apiKey: API_KEY });
    // const audio = await elevenlabs.textToSpeech.convert(voiceId, {
    //   text,
    //   modelId,
    //   outputFormat: 'mp3_44100_128',
    // });
    const audio = await adminHistoryAudioService.textToSpeech({
      voiceId,
      text,
      modelId,
      outputFormat: 'mp3_44100_128',
      languageCode: languageCode,
    });

    const blob = await new Response(audio).blob();
    const url = URL.createObjectURL(blob);

    return {
      audioBlob: blob,
      audioUrl: url,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Tạo âm thanh thất bại');
  }
};

const handleGenerateWordTiming = useCallback(
  async (audioBlob: Blob | null, text: string) => {
    if (!audioBlob) {
      throw new Error('Vui lòng cung cấp file âm thanh trước');
    }
    if (!API_KEY) {
      throw new Error('Thiếu khóa API ElevenLabs');
    }

    try {
      // const elevenlabs = new ElevenLabsClient({ apiKey: API_KEY });
      // const response = (await elevenlabs.forcedAlignment.create({
      //   file: audioBlob,
      //   text,
      // })) as ForcedAlignmentResponse;

      const response = await adminHistoryAudioService.forcedAlignment({
        file: audioBlob,
        text,
      });

      const words = response.words ?? [];
      if (!words.length) {
        throw new Error('Không nhận được dữ liệu căn chỉnh từ ElevenLabs');
      }

      return true;
    } catch (error) {
      console.error(error);
      throw new Error('Căn chỉnh thời điểm thất bại');
    }
  },
  [API_KEY],
);

export const ElevenLabAudioService = {
  generateAudio: handleGenerateAudio,
  generateWordTiming: handleGenerateWordTiming,
};
