import { useCallback, useRef, useState } from 'react';
import { message } from 'antd';
import type { UseFormReturn } from 'react-hook-form';
import type { MultiQuickCreateValues } from '../schemas/QuickCreateFormSchema';
import type { QuickCreateLanguageOption } from '../quickCreateLanguageUtils';
import { generateQuickCreateAudioAndTiming } from '@/pages/admin/historyAudio/services/quickCreateElevenLabsService';
import { uploadVideoToBackend } from '@/utils/cloudinary';

type AudioGenerationStage = 'generating' | 'uploading';

interface GenerateEntryAudioOptions {
  silent?: boolean;
  onStageChange?: (stage: AudioGenerationStage) => void;
}

interface BulkAudioProgressState {
  running: boolean;
  progress: number;
  subtitle: string;
  completed: number;
  total: number;
}

interface UseQuickCreateAudioGenerationOptions {
  form: UseFormReturn<MultiQuickCreateValues>;
  languageOptions: QuickCreateLanguageOption[];
  apiKey?: string;
  useMock?: boolean;
}

const INITIAL_BULK_PROGRESS: BulkAudioProgressState = {
  running: false,
  progress: 0,
  subtitle: '',
  completed: 0,
  total: 0,
};

function getLanguageLabel(languageOptions: QuickCreateLanguageOption[], languageCode: string) {
  return languageOptions.find((option) => option.code === languageCode)?.label ?? languageCode.toUpperCase();
}

export function useQuickCreateAudioGeneration({
  form,
  languageOptions,
  apiKey,
  useMock = false,
}: UseQuickCreateAudioGenerationOptions) {
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
  const [bulkProgress, setBulkProgress] = useState<BulkAudioProgressState>(INITIAL_BULK_PROGRESS);
  const bulkRunningRef = useRef(false);

  const isBulkRunning = bulkProgress.running;
  const isAnyGenerating = generatingIndex !== null || isBulkRunning;

  const setEntryAudioStatus = useCallback(
    (index: number, status: 'idle' | 'generating' | 'uploading' | 'uploaded' | 'failed') => {
      form.setValue(`entries.${index}.metadata.audioStatus` as any, status, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [form],
  );

  const setEntryAudioError = useCallback(
    (index: number, value?: string) => {
      form.setValue(`entries.${index}.metadata.audioError` as any, value, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [form],
  );

  const setEntryAudioUrl = useCallback(
    (index: number, value?: string) => {
      form.setValue(`entries.${index}.metadata.audioUrl` as any, value, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [form],
  );

  const processEntryAudio = useCallback(
    async (index: number, options?: GenerateEntryAudioOptions): Promise<boolean> => {
      const entries = form.getValues('entries');
      const entry = entries[index];
      if (!entry) {
        return false;
      }

      const script = entry.script?.trim() ?? '';
      if (!script) {
        if (!options?.silent) {
          message.warning('Thiếu nội dung kịch bản để tạo audio');
        }
        setEntryAudioStatus(index, 'failed');
        setEntryAudioError(index, 'Thiếu kịch bản');
        return false;
      }

      setGeneratingIndex(index);
      setEntryAudioStatus(index, 'generating');
      setEntryAudioError(index, undefined);

      try {
        options?.onStageChange?.('generating');
        const generated = await generateQuickCreateAudioAndTiming({
          text: script,
          voiceId: entry.metadata.voiceId,
          languageCode: entry.metadata.language,
          modelId: entry.metadata.model,
          apiKey,
          useMock,
        });

        options?.onStageChange?.('uploading');
        setEntryAudioStatus(index, 'uploading');

        const uploadedAudioUrl = await uploadVideoToBackend(generated.audioBlob);
        if (!uploadedAudioUrl) {
          throw new Error('Tải audio lên backend thất bại');
        }

        form.setValue(`entries.${index}.words` as any, generated.words, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setEntryAudioUrl(index, uploadedAudioUrl);
        setEntryAudioStatus(index, 'uploaded');
        setEntryAudioError(index, undefined);

        return true;
      } catch (error) {
        console.error(error);

        const errorMessage = error instanceof Error ? error.message : 'Không thể tạo audio cho ngôn ngữ này';
        setEntryAudioStatus(index, 'failed');
        setEntryAudioError(index, errorMessage);

        if (!options?.silent) {
          message.error(errorMessage);
        }

        return false;
      } finally {
        setGeneratingIndex(null);
      }
    },
    [apiKey, form, setEntryAudioError, setEntryAudioStatus, setEntryAudioUrl, useMock],
  );

  const generateSingleAudio = useCallback(
    async (index: number) => {
      // Block single generation while bulk is running
      if (bulkRunningRef.current) {
        message.warning('Đang tạo audio hàng loạt, vui lòng đợi hoàn tất');
        return;
      }

      const entries = form.getValues('entries');
      const entry = entries[index];
      if (!entry) {
        return;
      }

      const languageLabel = getLanguageLabel(languageOptions, entry.metadata.language);
      const success = await processEntryAudio(index);

      if (success) {
        message.success(`Đã tạo và tải audio cho ${languageLabel}`);
      }
    },
    [form, languageOptions, processEntryAudio],
  );

  const generateAllAudio = useCallback(async () => {
    // Block bulk generation while single generation is running
    if (generatingIndex !== null) {
      message.warning('Đang tạo audio cho 1 ngôn ngữ, vui lòng đợi hoàn tất');
      return;
    }

    const entries = form.getValues('entries');
    if (!entries.length) {
      message.warning('Chưa có dữ liệu bản dịch để tạo audio');
      return;
    }

    const total = entries.length;
    const totalStages = total * 2;
    let succeeded = 0;

    bulkRunningRef.current = true;
    setBulkProgress({
      running: true,
      progress: 0,
      subtitle: 'Bắt đầu quy trình tạo audio hàng loạt...',
      completed: 0,
      total,
    });

    for (let index = 0; index < total; index += 1) {
      const currentEntries = form.getValues('entries');
      const entry = currentEntries[index];
      if (!entry) {
        // console.log(`[useQuickCreateAudioGeneration] Bỏ qua mục tại index ${index} do không tìm thấy dữ liệu entry`);
        continue;
      }

      const languageLabel = getLanguageLabel(languageOptions, entry.metadata.language);

      const success = await processEntryAudio(index, {
        silent: true,
        onStageChange: (stage) => {
          const stageNumber = index * 2 + (stage === 'generating' ? 1 : 2);
          setBulkProgress((prev) => ({
            ...prev,
            progress: Math.round((stageNumber / totalStages) * 100),
            subtitle:
              stage === 'generating'
                ? `Đang tạo audio + timing cho ${languageLabel} (${index + 1}/${total})`
                : `Đang tải audio ${languageLabel} lên backend (${index + 1}/${total})`,
            completed: index,
          }));
        },
      });

      if (success) {
        succeeded += 1;
      }

      setBulkProgress((prev) => ({
        ...prev,
        progress: Math.round((((index + 1) * 2) / totalStages) * 100),
        subtitle: success
          ? `Hoàn tất ${languageLabel} (${index + 1}/${total})`
          : `Không thể xử lý ${languageLabel} (${index + 1}/${total})`,
        completed: index + 1,
      }));
    }

    bulkRunningRef.current = false;
    setBulkProgress((prev) => ({
      ...prev,
      running: false,
      progress: 100,
      subtitle: `Hoàn tất: ${succeeded}/${total} ngôn ngữ đã có audio`,
    }));

    if (succeeded === total) {
      message.success('Đã tạo toàn bộ audio thành công');
      return;
    }

    message.warning(`Đã tạo audio cho ${succeeded}/${total} ngôn ngữ. Vui lòng kiểm tra các mục còn lỗi.`);
  }, [form, generatingIndex, languageOptions, processEntryAudio]);

  return {
    generatingIndex,
    bulkProgress,
    isBulkRunning,
    isAnyGenerating,
    generateSingleAudio,
    generateAllAudio,
  };
}
