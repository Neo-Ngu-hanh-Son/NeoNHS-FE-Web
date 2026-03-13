import { useCallback, useEffect, useState } from "react";
import historyAudioService from "@/services/api/historyAudioService";
import type { CreateHistoryAudioRequest, HistoryAudioResponse } from "@/types/historyAudio";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export function useHistoryAudios(pointId: string) {
  const [audios, setAudios] = useState<HistoryAudioResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAudios = useCallback(async () => {
    if (!pointId) {
      setAudios([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await historyAudioService.getAllByPoint(pointId);
      setAudios(res.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load history audios"));
    } finally {
      setLoading(false);
    }
  }, [pointId]);

  useEffect(() => {
    fetchAudios();
  }, [fetchAudios]);

  const refetch = () => {
    fetchAudios();
  };

  const createAudio = async (data: CreateHistoryAudioRequest) => {
    const res = await historyAudioService.create(pointId, data);
    await fetchAudios();
    return res.data;
  };

  const updateAudio = async (id: string, data: CreateHistoryAudioRequest) => {
    const res = await historyAudioService.update(pointId, id, data);
    await fetchAudios();
    return res.data;
  };

  const deleteAudio = async (id: string) => {
    await historyAudioService.delete(pointId, id);
    await fetchAudios();
  };

  return {
    audios,
    loading,
    error,
    refetch,
    createAudio,
    updateAudio,
    deleteAudio,
  };
}
