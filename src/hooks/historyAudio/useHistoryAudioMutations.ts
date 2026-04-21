import { useCallback, useMemo, useState } from 'react';
import historyAudioService from '@/services/api/historyAudioService';
import type { CreateHistoryAudioRequest, HistoryAudioResponse } from '@/types/historyAudio';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

interface UseHistoryAudioMutationsOptions {
  onAfterMutation?: () => Promise<void> | void;
}

export interface BulkCreateHistoryAudioResult {
  created: HistoryAudioResponse[];
  failed: Array<{ index: number; error: string }>;
}

export function useHistoryAudioMutations(pointId: string, options?: UseHistoryAudioMutationsOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkCreating, setIsBulkCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAfterMutation = useCallback(async () => {
    if (options?.onAfterMutation) {
      await options.onAfterMutation();
    }
  }, [options]);

  const createAudio = useCallback(
    async (payload: CreateHistoryAudioRequest) => {
      if (!pointId) {
        throw new Error('Missing point id');
      }

      setError(null);
      setIsSaving(true);
      try {
        const res = await historyAudioService.create(pointId, payload);
        await runAfterMutation();
        return res.data;
      } catch (err) {
        const errorMessage = getApiErrorMessage(err, 'Create history audio failed');
        setError(errorMessage);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [pointId, runAfterMutation],
  );

  const updateAudio = useCallback(
    async (audioId: string, payload: CreateHistoryAudioRequest) => {
      if (!pointId) {
        throw new Error('Missing point id');
      }

      setError(null);
      setIsSaving(true);
      try {
        const res = await historyAudioService.update(pointId, audioId, payload);
        await runAfterMutation();
        return res.data;
      } catch (err) {
        const errorMessage = getApiErrorMessage(err, 'Update history audio failed');
        setError(errorMessage);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [pointId, runAfterMutation],
  );

  const deleteAudio = useCallback(
    async (audioId: string) => {
      if (!pointId) {
        throw new Error('Missing point id');
      }

      setError(null);
      setIsDeleting(true);
      try {
        await historyAudioService.delete(pointId, audioId);
        await runAfterMutation();
      } catch (err) {
        const errorMessage = getApiErrorMessage(err, 'Delete history audio failed');
        setError(errorMessage);
        throw err;
      } finally {
        setIsDeleting(false);
      }
    },
    [pointId, runAfterMutation],
  );

  const createManyAudios = useCallback(
    async (payloads: CreateHistoryAudioRequest[]): Promise<BulkCreateHistoryAudioResult> => {
      if (!pointId) {
        throw new Error('Missing point id');
      }

      if (!payloads.length) {
        return { created: [], failed: [] };
      }

      setError(null);
      setIsBulkCreating(true);
      try {
        const settled = await Promise.allSettled(
          payloads.map((payload) => historyAudioService.create(pointId, payload)),
        );

        const created: HistoryAudioResponse[] = [];
        const failed: Array<{ index: number; error: string }> = [];

        settled.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            created.push(result.value.data);
            return;
          }

          failed.push({
            index,
            error: getApiErrorMessage(result.reason, `Create history audio #${index + 1} failed`),
          });
        });

        if (created.length) {
          await runAfterMutation();
        }

        if (failed.length) {
          setError(`Failed to create ${failed.length} history audio item(s)`);
        }

        return { created, failed };
      } finally {
        setIsBulkCreating(false);
      }
    },
    [pointId, runAfterMutation],
  );

  const isMutating = useMemo(
    () => isSaving || isDeleting || isBulkCreating,
    [isBulkCreating, isDeleting, isSaving],
  );

  return {
    createAudio,
    updateAudio,
    deleteAudio,
    createManyAudios,
    isSaving,
    isDeleting,
    isBulkCreating,
    isMutating,
    error,
  };
}
