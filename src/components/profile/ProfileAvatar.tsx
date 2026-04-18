import { useRef, useState } from 'react';
import { Spin } from 'antd';
import { User, Camera } from 'lucide-react';

interface ProfileAvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onUpload?: (file: File) => Promise<void>;
  loading?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
};

export function ProfileAvatar({
  src,
  alt = 'Ảnh đại diện',
  size = 'md',
  onUpload,
  loading = false,
  className = '',
}: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleClick = () => {
    if (onUpload && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;

    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const isLoading = loading || uploading;

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-sm ${
          onUpload ? 'cursor-pointer' : ''
        }`}
        onClick={handleClick}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <User className={`${iconSizeClasses[size]} text-slate-400 dark:text-slate-500`} />
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
            <Spin size="small" />
          </div>
        )}
      </div>

      {onUpload && !isLoading && (
        <button
          type="button"
          onClick={handleClick}
          className="absolute bottom-0.5 right-0 bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <Camera className="w-3.5 h-3.5" />
        </button>
      )}

      {onUpload && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
}
