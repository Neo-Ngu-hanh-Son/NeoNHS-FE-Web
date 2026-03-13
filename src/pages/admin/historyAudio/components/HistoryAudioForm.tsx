import AudioModeSelector from "@/pages/admin/historyAudio/components/AudioModeSelector";
import GenerateAudioSection from "@/pages/admin/historyAudio/components/GenerateAudioSection";
import UploadAudioSection from "@/pages/admin/historyAudio/components/UploadAudioSection";

interface HistoryAudioFormProps {
  mode: "generate" | "upload" | null;
  text: string;
  modelId: string;
  voiceId: string;
  generatingAudio: boolean;
  onChooseGenerate: () => void;
  onChooseUpload: () => void;
  onTextChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onVoiceChange: (value: string) => void;
  onGenerateAudio: () => void;
  onUploadAudio: (file: File) => void;
}

export default function HistoryAudioForm({
  mode,
  text,
  modelId,
  voiceId,
  generatingAudio,
  onChooseGenerate,
  onChooseUpload,
  onTextChange,
  onModelChange,
  onVoiceChange,
  onGenerateAudio,
  onUploadAudio,
}: HistoryAudioFormProps) {
  return (
    <div className="space-y-4">
      <AudioModeSelector
        currentMode={mode}
        onChooseGenerate={onChooseGenerate}
        onChooseUpload={onChooseUpload}
      />

      {mode === "generate" ? (
        <GenerateAudioSection
          text={text}
          modelId={modelId}
          voiceId={voiceId}
          generatingAudio={generatingAudio}
          onTextChange={onTextChange}
          onModelChange={onModelChange}
          onVoiceChange={onVoiceChange}
          onGenerateAudio={onGenerateAudio}
        />
      ) : (
        <UploadAudioSection text={text} onTextChange={onTextChange} onUploadAudio={onUploadAudio} />
      )}
    </div>
  );
}
