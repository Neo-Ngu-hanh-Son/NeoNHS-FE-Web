import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, WandSparkles } from "lucide-react";
import { ELEVEN_LABS_MODELS, ELEVEN_LABS_VOICES } from "@/pages/admin/historyAudio/constants";

interface AudioSourceSectionProps {
  text: string;
  mode: "generate" | "upload" | null;
  hasAudio: boolean;
  modelId: string;
  voiceId: string;
  generatingAudio: boolean;
  onModelChange: (value: string) => void;
  onVoiceChange: (value: string) => void;
  onGenerateAudio: () => void;
  onUploadAudio: (file: File) => void;
}

export default function AudioSourceSection({
  text,
  mode,
  hasAudio,
  modelId,
  voiceId,
  generatingAudio,
  onModelChange,
  onVoiceChange,
  onGenerateAudio,
  onUploadAudio,
}: AudioSourceSectionProps) {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadAudio(file);
    }
    event.target.value = "";
  };

  const sourceLabel = hasAudio
    ? mode === "generate"
      ? "Đã tạo từ văn bản"
      : "Đã tải lên"
    : "Chưa có";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">2. Nguồn âm thanh</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <WandSparkles className="h-4 w-4 text-primary" />
              Tạo từ văn bản
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Mô hình</Label>
              <Select value={modelId} onValueChange={onModelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mô hình" />
                </SelectTrigger>
                <SelectContent>
                  {ELEVEN_LABS_MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Giọng</Label>
              <Select value={voiceId} onValueChange={onVoiceChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giọng" />
                </SelectTrigger>
                <SelectContent>
                  {ELEVEN_LABS_VOICES.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={onGenerateAudio} disabled={generatingAudio || !text.trim()}>
              <WandSparkles className="mr-2 h-4 w-4" />
              {generatingAudio ? "Đang tạo…" : "Tạo âm thanh"}
            </Button>
          </div>

          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Upload className="h-4 w-4 text-primary" />
              Tải lên âm thanh
            </div>
            <p className="text-xs text-muted-foreground">
              Tải lên file thuyết minh của bạn cho nội dung lịch sử này.
            </p>

            <input
              ref={uploadInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleUploadInputChange}
            />
            <Button variant="outline" onClick={() => uploadInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Chọn file âm thanh
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">Nguồn hiện tại: {sourceLabel}</div>
      </CardContent>
    </Card>
  );
}
