import { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { ELEVEN_LABS_MODELS, ELEVEN_LABS_VOICES } from '@/pages/admin/historyAudio/constants';
import type { ForcedAlignmentWord } from '@/pages/admin/historyAudio/types';
import { useAudioWordTracking } from '@/pages/admin/historyAudio/hooks/useAudioWordTracking';
import { useHistoryAudioGeneration } from '@/pages/admin/historyAudio/hooks/useHistoryAudioGeneration';
import { useHistoryAudioUploadAndSave } from '@/pages/admin/historyAudio/hooks/useHistoryAudioUploadAndSave';
import { useHistoryAudioMutations } from '@/hooks/historyAudio/useHistoryAudioMutations';
import { useHistoryAudios } from '../../../../hooks/historyAudio/useHistoryAudios.ts';
import HistoryAudioDeleteDialog from './HistoryAudioDeleteDialog';
import AudioSourceSection from './AudioSourceSection.tsx';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import HistoryAudiosTable from './HistoryAudiosTable.tsx';
import HistoryTextSection from './HistoryTextSection.tsx';
import TimingSection from './TimingSection.tsx';
import HistoryAudioActions from './HistoryAudioActions.tsx';
import { AITranslationService } from '@/services/api/aiTranslationService.ts';
import QuickCreateComponent from './QuickCreateComponents/QuickCreateComponent.tsx';

interface HistoryAudioPanelProps {
  pointId: string;
  pointName?: string;
  /** `embedded`: dùng trong modal POI — nút quay lại gọi onBackToParent thay vì navigate(-1) */
  variant?: 'page' | 'embedded';
  onBackToParent?: () => void;
}

export default function HistoryAudioPanel({
  pointId,
  pointName,
  variant = 'page',
  onBackToParent,
}: HistoryAudioPanelProps) {
  const navigate = useNavigate();
  const embedded = variant === 'embedded';

  const { audios, loading, refetch } = useHistoryAudios(pointId);
  const { createAudio, updateAudio, deleteAudio, isSaving, isDeleting } = useHistoryAudioMutations(pointId, {
    onAfterMutation: refetch,
  });

  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [mode, setMode] = useState<'generate' | 'upload' | null>('generate');

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [text, setText] = useState('');

  const [openDelete, setOpenDelete] = useState(false);
  const [quickCreateMode, setQuickCreateMode] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
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
  } = useHistoryAudioGeneration();

  const {
    uploadingCoverImage,
    uploadedAudioUrl,
    uploadedAudioBlob,
    setUploadedAudioFromUrl,
    clearUploadedAudio,
    handleUploadAudio,
    handleUploadCoverImage,
    handleSaveHistoryAudio,
  } = useHistoryAudioUploadAndSave({
    createAudio,
    updateAudio,
  });

  const selectedAudioUrl = mode === 'generate' ? generatedAudioUrl : uploadedAudioUrl;
  const selectedAudioBlob = mode === 'generate' ? generatedAudioBlob : uploadedAudioBlob;
  const hasAudio = Boolean(selectedAudioBlob || selectedAudioUrl);

  const { activeWordIndex, currentTime, resetTracking } = useAudioWordTracking({
    alignedWords,
    audioRef,
  });

  useEffect(() => {
    if (!audios.length) {
      setActiveAudioId(null);
      return;
    }

    // If the active entry was deleted or doesn't exist in fetched list, select the first one
    if (!activeAudioId || !audios.find((a) => a.id === activeAudioId)) {
      loadAudioEntry(audios[0].id);
    }
  }, [audios]);

  const loadAudioEntry = (id: string) => {
    const entry = audios.find((a) => a.id === id);
    if (!entry) return;

    setActiveAudioId(entry.id);
    setTitle(entry.metadata?.title ?? '');
    setArtist(entry.metadata?.artist ?? '');
    setCoverImage(entry.metadata?.coverImage ?? '');
    setText(entry.historyText ?? '');
    setAlignedWords((entry.words ?? []) as ForcedAlignmentWord[]);

    const metadataMode = entry.metadata?.mode ?? 'upload';
    setMode(metadataMode);

    if (metadataMode === 'generate') {
      setModelId(entry.metadata?.modelId ?? ELEVEN_LABS_MODELS[0].id);
      setVoiceId(entry.metadata?.voiceId ?? ELEVEN_LABS_VOICES[0].id);
      setGeneratedAudioFromUrl(entry.audioUrl ?? '');
      clearUploadedAudio();
    } else {
      setUploadedAudioFromUrl(entry.audioUrl ?? '');
      clearGeneratedAudio();
    }

    resetTracking();
  };

  const resetFormForNew = () => {
    setActiveAudioId(null);
    setMode('generate');
    setTitle('');
    setArtist('');
    setCoverImage('');
    setText('');
    resetElevenLabsState();
    clearUploadedAudio();
    resetTracking();
    setQuickCreateMode(false);
  };

  const onGenerateAudio = async () => {
    const generated = await handleGenerateAudio(text, languageCode);
    if (generated) {
      setMode('generate');
      resetTracking();
    }
  };

  const onUploadAudio = (file: File) => {
    const uploaded = handleUploadAudio(file);
    if (!uploaded) {
      return;
    }

    setMode('upload');
    setAlignedWords([]);
    resetTracking();
  };

  const onUploadCoverImage = async (file: File) => {
    const uploadedUrl = await handleUploadCoverImage(file);
    if (!uploadedUrl) {
      return;
    }

    setCoverImage(uploadedUrl);
  };

  const onGenerateWordTiming = async () => {
    if (!mode) {
      message.warning('Vui lòng chọn chế độ trước');
      return;
    }

    const generatedTiming = await handleGenerateWordTiming(selectedAudioBlob, text);
    if (generatedTiming) {
      resetTracking();
    }
  };

  const handleSave = async () => {
    const result = await handleSaveHistoryAudio({
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
    });

    if (result.createdId) {
      setActiveAudioId(result.createdId);
    }
  };

  const handleDelete = async () => {
    if (!activeAudioId) return;

    try {
      await deleteAudio(activeAudioId);
      resetFormForNew();
      setOpenDelete(false);
      message.success('Đã xóa âm thanh lịch sử');
    } catch (error) {
      console.error(error);
      message.error('Xóa âm thanh lịch sử thất bại');
    }
  };

  if (loading && !audios.length) {
    return (
      <div className={`flex flex-col items-center justify-center gap-4 ${embedded ? 'py-12' : 'py-32'}`}>
        <Spinner className="h-8 w-8 text-primary" />
        <p className="text-sm text-muted-foreground">Đang tải âm thanh lịch sử…</p>
      </div>
    );
  }

  const handleBack = () => {
    if (embedded && onBackToParent) {
      onBackToParent();
    } else {
      navigate(-1);
    }
  };

  const handleToggleQuickGenerating = (isGenerating: boolean) => {
    console.log('Toggling quick generating:', isGenerating);
    setQuickCreateMode(isGenerating);
  };

  return (
    <div className={embedded ? 'space-y-4' : 'space-y-6'}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            size={embedded ? 'sm' : 'icon'}
            className={embedded ? 'shrink-0 gap-2 px-2' : ''}
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
            {embedded ? <span className="text-sm font-medium">Về thông tin điểm</span> : null}
          </Button>
        </div>
      </div>

      <HistoryAudiosTable
        audios={audios}
        activeAudioId={activeAudioId}
        hasAudio={hasAudio}
        text={text}
        onNewAudio={resetFormForNew}
        isQuickGenerating={quickCreateMode}
        toggleQuickGenerating={handleToggleQuickGenerating}
        onSelectAudio={loadAudioEntry}
      />

      {!quickCreateMode ? (
        <>
          <HistoryAudioActions
            activeAudioId={activeAudioId}
            pointName={pointName || null}
            handleSave={handleSave}
            setOpenDelete={setOpenDelete}
            deletingGuide={isDeleting}
            savingGuide={isSaving}
            loading={loading}
            embedded={embedded}
          />

          <HistoryTextSection
            title={title}
            artist={artist}
            coverImage={coverImage}
            uploadingCoverImage={uploadingCoverImage}
            text={text}
            onTitleChange={setTitle}
            onArtistChange={setArtist}
            onCoverImageChange={setCoverImage}
            onUploadCoverImage={onUploadCoverImage}
            onTextChange={setText}
          />

          <AudioSourceSection
            text={text}
            mode={mode}
            hasAudio={hasAudio}
            modelId={modelId}
            voiceId={voiceId}
            generatingAudio={generatingAudio}
            onModelChange={setModelId}
            onVoiceChange={handleVoiceChange}
            onGenerateAudio={onGenerateAudio}
            onUploadAudio={onUploadAudio}
          />

          <TimingSection
            hasAudio={hasAudio}
            audioUrl={selectedAudioUrl}
            currentTime={currentTime}
            alignedWords={alignedWords}
            activeWordIndex={activeWordIndex}
            aligningWords={aligningWords}
            audioRef={audioRef}
            onGenerateWordTiming={onGenerateWordTiming}
          />

          <div className="flex items-center gap-2">
            <Button onClick={handleSave} disabled={isSaving || loading}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Đang lưu…' : activeAudioId ? 'Cập nhật' : 'Tạo mới'}
            </Button>
            {activeAudioId && (
              <Button variant="outline" onClick={() => setOpenDelete(true)} disabled={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </Button>
            )}
          </div>
        </>
      ) : (
        <QuickCreateComponent
          pointId={pointId}
          onSubmittedAll={async () => {
            refetch();
            setQuickCreateMode(false);
          }}
        />
      )}

      <HistoryAudioDeleteDialog
        open={openDelete}
        deleting={isDeleting}
        onOpenChange={setOpenDelete}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
}
