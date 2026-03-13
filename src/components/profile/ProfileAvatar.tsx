import { useRef, useState } from 'react';
import { UserOutlined, CameraOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

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

export function ProfileAvatar({
    src,
    alt = 'User avatar',
    size = 'md',
    onUpload,
    loading = false,
    className = ""
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
                className={`${sizeClasses[size]} rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-lg ${onUpload ? 'cursor-pointer group' : ''
                    }`}
                onClick={handleClick}
            >
                {src ? (
                    <img src={src} alt={alt} className="w-full h-full object-cover" />
                ) : (
                    <UserOutlined className="text-3xl text-slate-400" />
                )}

                {isLoading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                        <Spin size="small" />
                    </div>
                )}
            </div>

            {onUpload && !isLoading && (
                <button
                    type="button"
                    onClick={handleClick}
                    className="absolute bottom-1 right-0 bg-white dark:bg-slate-800 p-2 rounded-full shadow-md border border-slate-100 dark:border-slate-700 hover:text-primary transition-all active:scale-90"
                >
                    <CameraOutlined className="text-sm md:text-base flex" />
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
