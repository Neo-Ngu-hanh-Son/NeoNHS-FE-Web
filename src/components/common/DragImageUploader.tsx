import { useRef, useState, useCallback, type DragEvent, type ChangeEvent } from "react";
import { uploadImageToCloudinary, validateImageFile } from "@/utils/cloudinary";
import { Loader2, Upload, ImageIcon, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

interface DragImageUploaderProps {
  /** Current uploaded image URL (controlled) */
  value?: string;
  /** Called with the Cloudinary secure URL after successful upload */
  onUpload: (url: string) => void;
  /** Called when an upload error occurs */
  onError?: (message: string) => void;
  /** Max file size in MB (default: 5) */
  maxSizeMB?: number;
  /** Custom placeholder text */
  placeholder?: string;
  /** Additional class names for the root wrapper */
  className?: string;
  /** Whether the uploader is disabled */
  disabled?: boolean;
  /** Minimum height for the drop zone (default: 200) */
  minHeight?: number;
  /** CSS class applied to the <img> element in the uploaded state */
  imageClassName?: string;
}

export default function DragImageUploader({
  value,
  onUpload,
  onError,
  maxSizeMB = 5,
  placeholder = "Drag & drop an image here, or click to browse",
  className,
  disabled = false,
  minHeight = 200,
  imageClassName,
}: DragImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      // Validate
      const validationError = validateImageFile(file, maxSizeMB);
      if (validationError) {
        onError?.(validationError);
        return;
      }

      // Upload
      setUploading(true);
      setFileName(file.name);

      try {
        const url = await uploadImageToCloudinary(file);
        if (!url) throw new Error("Upload failed — no URL returned");
        onUpload(url);
      } catch (err: any) {
        onError?.(err?.message || "Failed to upload image. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [maxSizeMB, onUpload, onError],
  );

  // ─── Drop handlers ───
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (!disabled && !uploading) setDragOver(true);
  };
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled || uploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // ─── Click-to-browse ───
  const handleClick = () => {
    if (disabled || uploading) return;
    inputRef.current?.click();
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset so the same file can be re-selected
    e.target.value = "";
  };

  // ─── Hidden file input ───
  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/jpeg,image/png,image/gif,image/webp"
      className="hidden"
      onChange={handleFileChange}
      disabled={disabled}
    />
  );

  // ─── State: uploading ───
  if (uploading) {
    return (
      <div className={cn("space-y-1", className)}>
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-primary bg-primary/10"
          style={{ minHeight }}
        >
          <Spinner className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-primary font-medium">Uploading…</p>
          <p className="text-xs text-muted-foreground max-w-[80%] truncate text-center">
            {fileName}
          </p>
        </div>
        {fileInput}
      </div>
    );
  }

  // ─── State: image uploaded ───
  if (value) {
    return (
      <div className={cn("space-y-2", className)}>
        <div
          className="group relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center"
          style={{ minHeight }}
        >
          <img
            src={value}
            alt="Uploaded"
            className={cn("max-h-[400px] w-full object-contain", imageClassName)}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUpload("");
            }}
            disabled={disabled}
            className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80 disabled:cursor-not-allowed"
            title="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Click to change image
        </button>
        {fileInput}
      </div>
    );
  }

  // ─── State: empty (no image) ───
  return (
    <div className={cn("space-y-1", className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors cursor-pointer",
          dragOver
            ? "border-primary bg-primary/50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50/30",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        style={{ minHeight }}
      >
        {dragOver ? (
          <ImageIcon className="h-10 w-10 text-primary" />
        ) : (
          <Upload className="h-10 w-10 text-gray-400" />
        )}
        <p className="text-sm text-muted-foreground text-center px-4">{placeholder}</p>
        <p className="text-xs text-muted-foreground">JPG, PNG, GIF or WebP · max {maxSizeMB}MB</p>
      </div>
      {fileInput}
    </div>
  );
}
