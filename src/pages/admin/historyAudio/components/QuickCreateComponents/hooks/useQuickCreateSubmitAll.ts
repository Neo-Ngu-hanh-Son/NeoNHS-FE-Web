import { useCallback, useState } from 'react';
import { message } from 'antd';
import type { UseFormReturn } from 'react-hook-form';
import type { ForcedAlignmentWord } from '@/pages/admin/historyAudio/types';
import type { MultiQuickCreateValues } from '../schemas/QuickCreateFormSchema';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'failed';

export interface QuickCreateSubmitStatusItem {
  language: string;
  title: string;
  status: SubmitStatus;
  message?: string;
}

export interface QuickCreateSubmitProgressState {
  running: boolean;
  progress: number;
  subtitle: string;
  completed: number;
  total: number;
}

interface SaveHistoryAudioResult {
  success: boolean;
  createdId?: string;
}

interface SaveHistoryAudioPayload {
  activeAudioId: string | null;
  selectedAudioUrl: string;
  selectedAudioBlob: Blob | null;
  hasAudio: boolean;
  text: string;
  title: string;
  artist: string;
  coverImage: string;
  alignedWords: ForcedAlignmentWord[];
  mode: 'generate' | 'upload' | null;
  modelId: string;
  voiceId: string;
  silent?: boolean;
}

interface UseQuickCreateSubmitAllOptions {
  form: UseFormReturn<MultiQuickCreateValues>;
  handleSaveHistoryAudio: (payload: SaveHistoryAudioPayload) => Promise<SaveHistoryAudioResult>;
  onCompleted?: () => Promise<void> | void;
}

const INITIAL_SUBMIT_PROGRESS: QuickCreateSubmitProgressState = {
  running: false,
  progress: 0,
  subtitle: '',
  completed: 0,
  total: 0,
};

export function useQuickCreateSubmitAll({ form, handleSaveHistoryAudio, onCompleted }: UseQuickCreateSubmitAllOptions) {
  const [submitStatuses, setSubmitStatuses] = useState<QuickCreateSubmitStatusItem[]>([]);
  const [submitProgress, setSubmitProgress] = useState<QuickCreateSubmitProgressState>(INITIAL_SUBMIT_PROGRESS);

  const updateSubmitStatus = useCallback((index: number, patch: Partial<QuickCreateSubmitStatusItem>) => {
    setSubmitStatuses((previous) =>
      previous.map((item, currentIndex) =>
        currentIndex === index
          ? {
              ...item,
              ...patch,
            }
          : item,
      ),
    );
  }, []);

  const submitAll = useCallback(async () => {
    const entries = form.getValues('entries');
    if (!entries.length) {
      message.warning('Chưa có dữ liệu bản dịch để lưu');
      return;
    }

    const total = entries.length;
    setSubmitStatuses(
      entries.map((entry) => ({
        language: entry.metadata.language,
        title: entry.title,
        status: 'idle',
      })),
    );

    setSubmitProgress({
      running: true,
      progress: 0,
      subtitle: 'Bắt đầu lưu toàn bộ bản ghi âm...',
      completed: 0,
      total,
    });

    let succeeded = 0;

    for (let index = 0; index < total; index += 1) {
      const currentEntries = form.getValues('entries');
      const entry = currentEntries[index];
      if (!entry) {
        continue;
      }

      const displayLanguage = entry.metadata.language.toUpperCase();
      updateSubmitStatus(index, {
        status: 'submitting',
        message: `Đang lưu bản ghi ${displayLanguage}`,
      });

      setSubmitProgress((previous) => ({
        ...previous,
        subtitle: `Đang lưu ${displayLanguage} (${index + 1}/${total})`,
      }));

      const audioUrl = entry.metadata.audioUrl ?? '';
      const hasAudio = Boolean(audioUrl);
      if (!hasAudio) {
        updateSubmitStatus(index, {
          status: 'failed',
          message: 'Thiếu audio URL, hãy tạo audio trước khi lưu',
        });

        setSubmitProgress((previous) => ({
          ...previous,
          progress: Math.round(((index + 1) / total) * 100),
          completed: index + 1,
        }));
        continue;
      }

      const result = await handleSaveHistoryAudio({
        activeAudioId: null,
        selectedAudioUrl: audioUrl,
        selectedAudioBlob: null,
        hasAudio,
        text: entry.script,
        title: entry.title,
        artist: entry.artist,
        coverImage: entry.coverImage ?? '',
        alignedWords: (entry.words ?? []) as ForcedAlignmentWord[],
        mode: 'generate',
        modelId: entry.metadata.model,
        voiceId: entry.metadata.voiceId,
        silent: true,
      });

      if (result.success) {
        succeeded += 1;
        updateSubmitStatus(index, {
          status: 'success',
          message: 'Đã lưu thành công',
        });
      } else {
        updateSubmitStatus(index, {
          status: 'failed',
          message: entry.metadata.audioError || 'Lưu thất bại',
        });
      }

      setSubmitProgress((previous) => ({
        ...previous,
        progress: Math.round(((index + 1) / total) * 100),
        completed: index + 1,
      }));
    }

    const allSucceeded = succeeded === total;
    setSubmitProgress((previous) => ({
      ...previous,
      running: false,
      progress: 100,
      subtitle: allSucceeded
        ? 'Hoàn tất: toàn bộ bản ghi đã được lưu lên hệ thống'
        : `Hoàn tất: ${succeeded}/${total} bản ghi lưu thành công`,
    }));

    if (allSucceeded) {
      message.success('Đã lưu toàn bộ bản ghi thành công');
      if (onCompleted) {
        await onCompleted();
      }
      return;
    }

    message.warning(`Đã lưu thành công ${succeeded}/${total} bản ghi. Vui lòng kiểm tra các mục lỗi.`);
  }, [form, handleSaveHistoryAudio, onCompleted, updateSubmitStatus]);

  return {
    submitStatuses,
    submitProgress,
    submitAll,
  };
}
