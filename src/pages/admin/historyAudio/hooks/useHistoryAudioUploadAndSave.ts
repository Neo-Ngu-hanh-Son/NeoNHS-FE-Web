import { useCallback, useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { uploadImageToCloudinary, uploadVideoToCloudinary } from '@/utils/cloudinary';
import { ELEVEN_LABS_VOICES } from '@/pages/admin/historyAudio/constants';
import type { ForcedAlignmentWord } from '@/pages/admin/historyAudio/types';
import type { CreateHistoryAudioRequest, HistoryAudioResponse } from '@/types/historyAudio';
import { clearEmtpyLines } from '../helpers';

interface UseHistoryAudioUploadAndSaveOptions {
  createAudio: (payload: CreateHistoryAudioRequest) => Promise<HistoryAudioResponse>;
  updateAudio: (audioId: string, payload: CreateHistoryAudioRequest) => Promise<HistoryAudioResponse>;
}

interface SaveHistoryAudioParams {
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
}

interface SaveHistoryAudioResult {
  success: boolean;
  createdId?: string;
}

export function useHistoryAudioUploadAndSave({
  createAudio,
  updateAudio,
}: UseHistoryAudioUploadAndSaveOptions) {
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState('');
  const [uploadedAudioBlob, setUploadedAudioBlob] = useState<Blob | null>(null);

  const uploadedUrlRef = useRef<string | null>(null);

  const revokeUploadedObjectUrl = useCallback(() => {
    if (uploadedUrlRef.current) {
      URL.revokeObjectURL(uploadedUrlRef.current);
      uploadedUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      revokeUploadedObjectUrl();
    };
  }, [revokeUploadedObjectUrl]);

  const setUploadedAudioFromUrl = useCallback(
    (url: string) => {
      revokeUploadedObjectUrl();
      setUploadedAudioBlob(null);
      setUploadedAudioUrl(url);
    },
    [revokeUploadedObjectUrl],
  );

  const clearUploadedAudio = useCallback(() => {
    revokeUploadedObjectUrl();
    setUploadedAudioBlob(null);
    setUploadedAudioUrl('');
  }, [revokeUploadedObjectUrl]);

  const handleUploadAudio = useCallback((file: File): boolean => {
    if (!file.type.startsWith('audio/')) {
      message.warning('File âm thanh không hợp lệ');
      return false;
    }

    const url = URL.createObjectURL(file);
    if (uploadedUrlRef.current) {
      URL.revokeObjectURL(uploadedUrlRef.current);
    }
    uploadedUrlRef.current = url;

    setUploadedAudioBlob(file);
    setUploadedAudioUrl(url);
    message.success('Đã tải lên âm thanh');
    return true;
  }, []);

  const handleUploadCoverImage = useCallback(async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) {
      message.warning('File ảnh không hợp lệ');
      return null;
    }

    setUploadingCoverImage(true);
    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      if (!uploadedUrl) {
        message.error('Tải ảnh bìa lên thất bại');
        return null;
      }

      message.success('Đã tải ảnh bìa lên');
      return uploadedUrl;
    } catch (error) {
      console.error(error);
      message.error('Tải ảnh bìa lên thất bại');
      return null;
    } finally {
      setUploadingCoverImage(false);
    }
  }, []);

  const handleSaveHistoryAudio = useCallback(
    async ({
      activeAudioId,
      selectedAudioUrl,
      selectedAudioBlob,
      hasAudio,
      text,
      title,
      artist,
      coverImage,
      alignedWords,
      mode,
      modelId,
      voiceId,
    }: SaveHistoryAudioParams): Promise<SaveHistoryAudioResult> => {
      if (!text.trim() && !hasAudio) {
        message.warning('Vui lòng nhập nội dung lịch sử hoặc âm thanh trước khi lưu');
        return { success: false };
      }

      try {
        let audioUrl: string | null = selectedAudioUrl || null;

        if (selectedAudioBlob) {
          const cloudinaryUrl = await uploadVideoToCloudinary(selectedAudioBlob);
          if (!cloudinaryUrl) {
            message.error('Tải âm thanh lên Cloudinary thất bại');
            return { success: false };
          }
          audioUrl = cloudinaryUrl;
        }

        const normalizedTitle = title.trim() || null;
        const normalizedArtist = artist.trim() || null;
        const normalizedCoverImage = coverImage.trim() || null;
        const shouldSendMetadata =
          hasAudio || Boolean(normalizedTitle) || Boolean(normalizedArtist) || Boolean(normalizedCoverImage);

        const payload: CreateHistoryAudioRequest = {
          audioUrl,
          historyText: clearEmtpyLines(text),
          words: hasAudio
            ? alignedWords.map((word) => ({
              text: word.text,
              start: word.start,
              end: word.end,
            }))
            : [],
          metadata: shouldSendMetadata
            ? {
              mode: hasAudio ? mode : null,
              modelId: hasAudio && mode === 'generate' ? modelId : null,
              voiceId: hasAudio && mode === 'generate' ? voiceId : null,
              language:
                hasAudio && mode === 'generate'
                  ? ELEVEN_LABS_VOICES.find((v) => v.id === voiceId)?.language?.slice(0, 2).toLowerCase() || 'en'
                  : hasAudio
                    ? 'en'
                    : null,
              title: normalizedTitle,
              artist: normalizedArtist,
              coverImage: normalizedCoverImage,
            }
            : null,
        };

        if (activeAudioId) {
          await updateAudio(activeAudioId, payload);
          message.success('Cập nhật âm thanh lịch sử thành công');
          return { success: true };
        }

        const created = await createAudio(payload);
        message.success('Tạo âm thanh lịch sử thành công');
        return { success: true, createdId: created.id };
      } catch (error) {
        console.error(error);
        message.error('Lưu âm thanh lịch sử thất bại');
        return { success: false };
      }
    },
    [createAudio, updateAudio],
  );

  return {
    uploadingCoverImage,
    uploadedAudioUrl,
    uploadedAudioBlob,
    setUploadedAudioFromUrl,
    clearUploadedAudio,
    handleUploadAudio,
    handleUploadCoverImage,
    handleSaveHistoryAudio,
  };
}
