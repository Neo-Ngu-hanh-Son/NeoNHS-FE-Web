import { useEffect, useRef, useState } from "react";
import { message } from "antd";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { uploadImageToCloudinary, uploadVideoToCloudinary } from "@/utils/cloudinary";
import { ELEVEN_LABS_MODELS, ELEVEN_LABS_VOICES } from "@/pages/admin/historyAudio/constants";
import type {
  ForcedAlignmentResponse,
  ForcedAlignmentWord,
} from "@/pages/admin/historyAudio/types";
import { useAudioWordTracking } from "@/pages/admin/historyAudio/hooks/useAudioWordTracking";
import { useHistoryAudios } from "../../../../hooks/historyAudio/useHistoryAudios.ts";
import type { CreateHistoryAudioRequest } from "@/types/historyAudio";
import HistoryAudioDeleteDialog from "./HistoryAudioDeleteDialog";
import AudioSourceSection from "./AudioSourceSection.tsx";
import TimingSection from "../../destinations/components/historyAudio/TimingSection.tsx";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import HistoryAudiosTable from "./HistoryAudiosTable.tsx";
import HistoryTextSection from "./HistoryTextSection.tsx";
import { clearEmtpyLines } from "../helpers.ts";

interface HistoryAudioPanelProps {
  pointId: string;
  pointName?: string;
}

export default function HistoryAudioPanel({ pointId, pointName }: HistoryAudioPanelProps) {
  const ELEVEN_LABS_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const navigate = useNavigate();

  const { audios, loading, createAudio, updateAudio, deleteAudio, refetch } =
    useHistoryAudios(pointId);

  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [mode, setMode] = useState<"generate" | "upload" | null>("generate");

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [text, setText] = useState("");
  const [modelId, setModelId] = useState<string>(ELEVEN_LABS_MODELS[0].id);
  const [voiceId, setVoiceId] = useState<string>(ELEVEN_LABS_VOICES[0].id);

  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);
  const [aligningWords, setAligningWords] = useState(false);
  const [savingGuide, setSavingGuide] = useState(false);
  const [deletingGuide, setDeletingGuide] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [generatedAudioUrl, setGeneratedAudioUrl] = useState("");
  const [generatedAudioBlob, setGeneratedAudioBlob] = useState<Blob | null>(null);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState("");
  const [uploadedAudioBlob, setUploadedAudioBlob] = useState<Blob | null>(null);

  const [alignedWords, setAlignedWords] = useState<ForcedAlignmentWord[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const generatedUrlRef = useRef<string | null>(null);
  const uploadedUrlRef = useRef<string | null>(null);

  const selectedAudioUrl = mode === "generate" ? generatedAudioUrl : uploadedAudioUrl;
  const selectedAudioBlob = mode === "generate" ? generatedAudioBlob : uploadedAudioBlob;
  const hasAudio = Boolean(selectedAudioBlob || selectedAudioUrl);

  const { activeWordIndex, currentTime, resetTracking } = useAudioWordTracking({
    alignedWords,
    audioRef,
  });

  useEffect(() => {
    return () => {
      if (generatedUrlRef.current) URL.revokeObjectURL(generatedUrlRef.current);
      if (uploadedUrlRef.current) URL.revokeObjectURL(uploadedUrlRef.current);
    };
  }, []);

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
    setTitle(entry.metadata?.title ?? "");
    setArtist(entry.metadata?.artist ?? "");
    setCoverImage(entry.metadata?.coverImage ?? "");
    setText(entry.historyText ?? "");
    setAlignedWords((entry.words ?? []) as ForcedAlignmentWord[]);

    const metadataMode = entry.metadata?.mode ?? "upload";
    setMode(metadataMode);

    if (metadataMode === "generate") {
      setModelId(entry.metadata?.modelId ?? ELEVEN_LABS_MODELS[0].id);
      setVoiceId(entry.metadata?.voiceId ?? ELEVEN_LABS_VOICES[0].id);
      setGeneratedAudioUrl(entry.audioUrl ?? "");
      setGeneratedAudioBlob(null);
      setUploadedAudioUrl("");
      setUploadedAudioBlob(null);
    } else {
      setUploadedAudioUrl(entry.audioUrl ?? "");
      setUploadedAudioBlob(null);
      setGeneratedAudioUrl("");
      setGeneratedAudioBlob(null);
    }

    resetTracking();
  };

  const resetFormForNew = () => {
    setActiveAudioId(null);
    setMode("generate");
    setTitle("");
    setArtist("");
    setCoverImage("");
    setText("");
    setModelId(ELEVEN_LABS_MODELS[0].id);
    setVoiceId(ELEVEN_LABS_VOICES[0].id);
    setGeneratedAudioUrl("");
    setGeneratedAudioBlob(null);
    setUploadedAudioUrl("");
    setUploadedAudioBlob(null);
    setAlignedWords([]);
    resetTracking();
  };

  const handleGenerateAudio = async () => {
    if (!text.trim()) {
      message.warning("Enter text first");
      return;
    }
    if (!ELEVEN_LABS_KEY) {
      message.error("Missing ElevenLabs API key");
      return;
    }

    setGeneratingAudio(true);
    try {
      const elevenlabs = new ElevenLabsClient({ apiKey: ELEVEN_LABS_KEY });
      const audio = await elevenlabs.textToSpeech.convert(voiceId, {
        text,
        modelId,
        outputFormat: "mp3_44100_128",
      });

      const blob = await new Response(audio).blob();
      const url = URL.createObjectURL(blob);

      if (generatedUrlRef.current) URL.revokeObjectURL(generatedUrlRef.current);
      generatedUrlRef.current = url;

      setGeneratedAudioBlob(blob);
      setGeneratedAudioUrl(url);
      setMode("generate");
      setAlignedWords([]);
      resetTracking();

      message.success("Audio generated");
    } catch (error) {
      console.error(error);
      message.error("Audio generation failed");
    } finally {
      setGeneratingAudio(false);
    }
  };

  const handleUploadAudio = (file: File) => {
    if (!file.type.startsWith("audio/")) {
      message.warning("Invalid audio file");
      return;
    }

    const url = URL.createObjectURL(file);
    if (uploadedUrlRef.current) URL.revokeObjectURL(uploadedUrlRef.current);
    uploadedUrlRef.current = url;

    setUploadedAudioBlob(file);
    setUploadedAudioUrl(url);
    setMode("upload");
    setAlignedWords([]);
    resetTracking();

    message.success("Audio uploaded");
  };

  const handleUploadCoverImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      message.warning("Invalid image file");
      return;
    }

    setUploadingCoverImage(true);
    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      if (!uploadedUrl) {
        message.error("Failed to upload cover image");
        return;
      }

      setCoverImage(uploadedUrl);
      message.success("Cover image uploaded");
    } catch (error) {
      console.error(error);
      message.error("Failed to upload cover image");
    } finally {
      setUploadingCoverImage(false);
    }
  };

  const handleGenerateWordTiming = async () => {
    if (!mode) {
      message.warning("Choose a mode first");
      return;
    }
    if (!selectedAudioBlob) {
      message.warning("Provide an audio file first");
      return;
    }

    setAligningWords(true);
    try {
      const elevenlabs = new ElevenLabsClient({ apiKey: ELEVEN_LABS_KEY });
      const response = (await elevenlabs.forcedAlignment.create({
        file: selectedAudioBlob,
        text,
      })) as ForcedAlignmentResponse;

      const words = response.words ?? [];
      if (!words.length) {
        message.warning("No alignment returned");
        return;
      }

      setAlignedWords(words);
      resetTracking();
      message.success(`Generated timing for ${words.length} words`);
    } catch (error) {
      console.error(error);
      message.error("Forced alignment failed");
    } finally {
      setAligningWords(false);
    }
  };

  const handleSave = async () => {
    if (!text.trim() && !hasAudio) {
      message.warning("Provide history text or audio before saving");
      return;
    }

    setSavingGuide(true);
    try {
      let audioUrl: string | null = selectedAudioUrl || null;

      if (selectedAudioBlob) {
        const cloudinaryUrl = await uploadVideoToCloudinary(selectedAudioBlob);
        if (!cloudinaryUrl) {
          message.error("Failed to upload audio to Cloudinary");
          return;
        }
        audioUrl = cloudinaryUrl;
      }

      const normalizedTitle = title.trim() || null;
      const normalizedArtist = artist.trim() || null;
      const normalizedCoverImage = coverImage.trim() || null;
      const shouldSendMetadata =
        hasAudio ||
        Boolean(normalizedTitle) ||
        Boolean(normalizedArtist) ||
        Boolean(normalizedCoverImage);

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
              modelId: hasAudio && mode === "generate" ? modelId : null,
              voiceId: hasAudio && mode === "generate" ? voiceId : null,
              language:
                hasAudio && mode === "generate"
                  ? ELEVEN_LABS_VOICES.find((v) => v.id === voiceId)
                      ?.language?.slice(0, 2)
                      .toLowerCase() || "en"
                  : hasAudio
                    ? "en"
                    : null,
              title: normalizedTitle,
              artist: normalizedArtist,
              coverImage: normalizedCoverImage,
            }
          : null,
      };

      if (activeAudioId) {
        await updateAudio(activeAudioId, payload);
        message.success("History audio updated successfully");
      } else {
        const created = await createAudio(payload);
        setActiveAudioId(created.id);
        message.success("History audio created successfully");
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to save history audio");
    } finally {
      setSavingGuide(false);
      // Trigger a refetch to get the latest data, including any server-generated fields
      refetch();
    }
  };

  const handleDelete = async () => {
    if (!activeAudioId) return;
    setDeletingGuide(true);
    try {
      await deleteAudio(activeAudioId);
      resetFormForNew();
      setOpenDelete(false);
      message.success("History audio deleted");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete history audio");
    } finally {
      setDeletingGuide(false);
      refetch();
    }
  };

  if (loading && !audios.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32">
        <Spinner className="h-8 w-8 text-primary" />
        <p className="text-sm text-muted-foreground">Loading history audio…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-3 items-center">
          <Button variant={"ghost"} size={"icon"} onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">Manage History Audios</h2>
            <span className="text-sm text-muted-foreground">{pointName && pointName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeAudioId && (
            <Button variant="outline" onClick={() => setOpenDelete(true)} disabled={deletingGuide}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          <Button onClick={handleSave} disabled={savingGuide || loading}>
            <Save className="mr-2 h-4 w-4" />
            {savingGuide ? "Saving..." : activeAudioId ? "Update" : "Create"}
          </Button>
        </div>
      </div>

      <HistoryAudiosTable
        audios={audios}
        activeAudioId={activeAudioId}
        hasAudio={hasAudio}
        text={text}
        onNewAudio={resetFormForNew}
        onSelectAudio={loadAudioEntry}
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
        onUploadCoverImage={handleUploadCoverImage}
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
        onVoiceChange={setVoiceId}
        onGenerateAudio={handleGenerateAudio}
        onUploadAudio={handleUploadAudio}
      />

      <TimingSection
        hasAudio={hasAudio}
        audioUrl={selectedAudioUrl}
        currentTime={currentTime}
        alignedWords={alignedWords}
        activeWordIndex={activeWordIndex}
        aligningWords={aligningWords}
        audioRef={audioRef}
        onGenerateWordTiming={handleGenerateWordTiming}
      />

      <div className="flex items-center gap-2">
        <Button onClick={handleSave} disabled={savingGuide || loading}>
          <Save className="mr-2 h-4 w-4" />
          {savingGuide ? "Saving..." : activeAudioId ? "Update" : "Create"}
        </Button>
        {activeAudioId && (
          <Button variant="outline" onClick={() => setOpenDelete(true)} disabled={deletingGuide}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </div>

      <HistoryAudioDeleteDialog
        open={openDelete}
        deleting={deletingGuide}
        onOpenChange={setOpenDelete}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
}
