import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface HistoryTextSectionProps {
  title: string;
  artist: string;
  coverImage: string;
  uploadingCoverImage: boolean;
  text: string;
  onTitleChange: (value: string) => void;
  onArtistChange: (value: string) => void;
  onCoverImageChange: (value: string) => void;
  onUploadCoverImage: (file: File) => void;
  onTextChange: (value: string) => void;
}

export default function HistoryTextSection({
  title,
  artist,
  coverImage,
  uploadingCoverImage,
  text,
  onTitleChange,
  onArtistChange,
  onCoverImageChange,
  onUploadCoverImage,
  onTextChange,
}: HistoryTextSectionProps) {
  const handleCoverFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadCoverImage(file);
    }
    event.target.value = "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">1. Nội dung lịch sử</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="history-title">Tiêu đề</Label>
            <Input
              id="history-title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Ví dụ: Câu chuyện Linh Ứng"
            />
            <br />
            <Label htmlFor="history-artist">Tác giả</Label>
            <Input
              id="history-artist"
              value={artist}
              onChange={(e) => onArtistChange(e.target.value)}
              placeholder="Ví dụ: Nghệ sĩ NeoNHS "
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="history-cover-image">Ảnh bìa</Label>
            <div className="flex gap-3 items-center">
              <label className="cursor-pointer self-start">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverFileChange}
                  disabled={uploadingCoverImage}
                />
                <Button type="button" variant="outline" asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadingCoverImage ? "Đang tải lên…" : "Tải ảnh bìa"}
                  </span>
                </Button>
              </label>

              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Xem trước ảnh bìa"
                  className="h-32 w-32 rounded border object-cover"
                />
              ) : (
                <p className="text-xs text-muted-foreground">
                  Nếu để trống, hệ thống sẽ dùng ảnh đại diện của điểm làm mặc định.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="history-text">Kịch bản thuyết minh</Label>
          <Textarea
            id="history-text"
            rows={8}
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Nhập nội dung lịch sử cho điểm này. Có thể chỉ lưu văn bản, không bắt buộc có âm thanh."
          />
        </div>
      </CardContent>
    </Card>
  );
}
