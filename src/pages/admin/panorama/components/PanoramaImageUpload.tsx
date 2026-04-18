import { message } from "antd";
import DragImageUploader from "@/components/common/DragImageUploader";

interface PanoramaImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

export default function PanoramaImageUpload({ value, onChange, error }: PanoramaImageUploadProps) {
  return (
    <div className="space-y-1">
      <DragImageUploader
        value={value}
        onUpload={onChange}
        onError={(msg) => message.error(msg)}
        maxSizeMB={10}
        placeholder="Kéo thả ảnh panorama 360°, hoặc bấm để chọn"
        minHeight={160}
        imageClassName="object-cover h-[160px]"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
