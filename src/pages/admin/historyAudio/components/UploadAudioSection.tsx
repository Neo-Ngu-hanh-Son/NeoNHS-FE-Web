import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadAudioSectionProps {
  text: string;
  onTextChange: (value: string) => void;
  onUploadAudio: (file: File) => void;
}

export default function UploadAudioSection({
  text,
  onTextChange,
  onUploadAudio,
}: UploadAudioSectionProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onUploadAudio(file);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadAudio(file);
      setFileName(file.name);
    }
    e.target.value = "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tải lên âm thanh lịch sử và kịch bản</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          rows={8}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Nhập kịch bản thuyết minh lịch sử. Kịch bản này dùng cùng file âm thanh đã tải lên để căn chỉnh từng từ."
        />

        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={onFileChange}
        />

        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragOver(false);
          }}
          onDrop={onDrop}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={cn(
            "flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors",
            dragOver
              ? "border-primary bg-primary/10"
              : "border-gray-300 bg-gray-50/30 hover:border-gray-400",
            fileName && "border-green-500 bg-green-50 hover:border-green-500",
          )}
        >
          {dragOver ? (
            <Music2 className="h-10 w-10 text-primary" />
          ) : (
            <Upload className="h-10 w-10 text-gray-400" />
          )}

          {fileName ? (
            <>
              <p className="px-4 text-center text-sm text-muted-foreground">File đã chọn</p>
              <p className="text-xs px-4 text-center text-muted-foreground">{fileName}</p>
            </>
          ) : (
            <>
              <p className="px-4 text-center text-sm text-muted-foreground">
                Kéo thả file âm thanh vào đây, hoặc bấm để chọn
              </p>
              <p className="text-xs text-muted-foreground">MP3, WAV, M4A, OGG</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
