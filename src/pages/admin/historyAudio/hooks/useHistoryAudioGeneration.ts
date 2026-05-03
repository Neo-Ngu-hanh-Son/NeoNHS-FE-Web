import { useCallback, useEffect, useRef, useState } from "react";
import { message } from "antd";
import { ELEVEN_LABS_MODELS, ELEVEN_LABS_VOICES } from "@/pages/admin/historyAudio/constants";
import type { ForcedAlignmentWord } from "@/pages/admin/historyAudio/types";
import adminHistoryAudioService from "@/services/api/adminHistoryAudioService";

interface UseHistoryAudioGenerationOptions {
  useMock?: boolean;
}

export function useHistoryAudioGeneration({
  useMock = false,
}: UseHistoryAudioGenerationOptions = {}) {
  const [modelId, setModelId] = useState<string>(ELEVEN_LABS_MODELS[0].id);
  const [voiceId, setVoiceId] = useState<string>(ELEVEN_LABS_VOICES[0].id);
  const [languageCode, setLanguageCode] = useState<string>(ELEVEN_LABS_VOICES[0].language || "en");
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [aligningWords, setAligningWords] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState("");
  const [generatedAudioBlob, setGeneratedAudioBlob] = useState<Blob | null>(null);
  const [alignedWords, setAlignedWords] = useState<ForcedAlignmentWord[]>([]);

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
    setGeneratedAudioUrl("");
  }, [revokeGeneratedObjectUrl]);

  const resetElevenLabsState = useCallback(() => {
    setModelId(ELEVEN_LABS_MODELS[0].id);
    setVoiceId(ELEVEN_LABS_VOICES[0].id);
    clearGeneratedAudio();
    setAlignedWords([]);
  }, [clearGeneratedAudio]);

  const handleGenerateAudio = useCallback(
    async (text: string, currentLanguageCode: string) => {
      if (!text.trim()) {
        message.warning("Vui lòng nhập nội dung trước");
        return false;
      }

      setGeneratingAudio(true);
      try {
        const audio = await adminHistoryAudioService.textToSpeech({
          voiceId: voiceId,
          text,
          modelId,
          outputFormat: "mp3_44100_128",
          languageCode: currentLanguageCode,
        });

        const blob = await new Response(audio).blob();
        const url = URL.createObjectURL(blob);

        revokeGeneratedObjectUrl();
        generatedUrlRef.current = url;

        setGeneratedAudioBlob(blob);
        setGeneratedAudioUrl(url);
        setAlignedWords([]);
        message.success("Đã tạo âm thanh");
        return true;
      } catch (error) {
        console.error(error);
        message.error("Tạo âm thanh thất bại");
        return false;
      } finally {
        setGeneratingAudio(false);
      }
    },
    [modelId, revokeGeneratedObjectUrl, voiceId],
  );

  const handleGenerateWordTiming = useCallback(async (audioBlob: Blob | null, text: string) => {
    if (!audioBlob) {
      message.warning("Vui lòng cung cấp file âm thanh trước");
      return false;
    }

    if (!text.trim()) {
      message.warning("Vui lòng nhập nội dung trước khi căn chỉnh từ");
      return false;
    }

    setAligningWords(true);
    try {
      const response = await adminHistoryAudioService.forcedAlignment({
        file: audioBlob,
        text,
      });

      const words: ForcedAlignmentWord[] = response.words ?? [];

      if (!words.length) {
        message.warning("Không nhận được dữ liệu căn chỉnh từ");
        return false;
      }

      setAlignedWords(words);
      message.success(`Đã tạo thời điểm cho ${words.length} từ`);
      return true;
    } catch (error) {
      console.error(error);
      message.error("Căn chỉnh thời điểm thất bại");
      return false;
    } finally {
      setAligningWords(false);
    }
  }, []);

  const handleVoiceChange = useCallback((newVoiceId: string) => {
    setVoiceId(newVoiceId);
    // Search for language code based on voice selection
    const voice = ELEVEN_LABS_VOICES.find((v) => v.id === newVoiceId);
    if (voice) {
      const code = voice.language || "en";
      setLanguageCode(code);
    }
  }, []);

  return {
    modelId,
    setModelId,
    voiceId,
    setVoiceId,
    languageCode,
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
    handleVoiceChange,
  };
}
