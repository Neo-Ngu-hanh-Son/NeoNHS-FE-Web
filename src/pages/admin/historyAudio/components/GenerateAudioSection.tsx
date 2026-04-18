import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Volume2 } from "lucide-react";
import { ELEVEN_LABS_MODELS, ELEVEN_LABS_VOICES } from "../constants";

interface GenerateAudioSectionProps {
  text: string;
  modelId: string;
  voiceId: string;
  generatingAudio: boolean;
  onTextChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onVoiceChange: (value: string) => void;
  onGenerateAudio: () => void;
}

export default function GenerateAudioSection({
  text,
  modelId,
  voiceId,
  generatingAudio,
  onTextChange,
  onModelChange,
  onVoiceChange,
  onGenerateAudio,
}: GenerateAudioSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo âm thanh từ văn bản (AI)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          rows={8}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Nhập kịch bản thuyết minh lịch sử tại đây. Nội dung này dùng để tạo âm thanh và căn chỉnh từng từ."
        />

        <div className="flex flex-col items-start gap-2">
          <p className="text-sm font-medium">Chọn loại giọng</p>
          <div className="flex justify-between w-full gap-4">
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
        </div>

        <Button onClick={onGenerateAudio} disabled={generatingAudio}>
          {generatingAudio ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Volume2 className="mr-2 h-4 w-4" />
          )}
          Tạo âm thanh
        </Button>
      </CardContent>
    </Card>
  );
}
