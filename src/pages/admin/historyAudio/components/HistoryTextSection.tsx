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
        <CardTitle className="text-lg">1. History Text</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="history-title">Title</Label>
            <Input
              id="history-title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. Linh Ung Story"
            />
            <br />
            <Label htmlFor="history-artist">Artist</Label>
            <Input
              id="history-artist"
              value={artist}
              onChange={(e) => onArtistChange(e.target.value)}
              placeholder="e.g. NeoNHS Narrator"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="history-cover-image">Cover Image</Label>
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
                    {uploadingCoverImage ? "Uploading..." : "Upload Cover"}
                  </span>
                </Button>
              </label>

              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="h-32 w-32 rounded border object-cover"
                />
              ) : (
                <p className="text-xs text-muted-foreground">
                  If empty, backend will default to the point thumbnail.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="history-text">Narration Script</Label>
          <Textarea
            id="history-text"
            rows={8}
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Enter history text for this point. Text-only entries are supported."
          />
        </div>
      </CardContent>
    </Card>
  );
}
