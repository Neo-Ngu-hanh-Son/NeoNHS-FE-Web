import { useRef, useState } from 'react';
import { UserOutlined, CameraOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

interface ProfileAvatarProps {
    src?: string;
    alt?: string;
    size?: 'sm' | 'md' | 'lg';
    onUpload?: (file: File) => Promise<void>;
    loading?: boolean;
}

const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
};

export function ProfileAvatar({
    src,
    alt = 'User avatar',
    size = 'md',
    onUpload,
    loading = false
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
        <div className="relative inline-block">
            <div
                className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center ring-4 ring-white shadow-2xl ${onUpload ? 'cursor-pointer group' : ''
                    } transform hover:scale-105 transition-transform duration-300`}
                onClick={handleClick}
            >
                {src ? (
                    <img src={src} alt={alt} className="w-full h-full object-cover" />
                ) : (
                    <UserOutlined className="text-5xl text-gray-400" />
                )}

                {onUpload && !isLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-1">
                            <CameraOutlined className="text-white text-3xl" />
                            <span className="text-white text-xs font-medium">Change</span>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
                        <Spin />
                    </div>
                )}
            </div>

            {onUpload && (
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            )}
        </div>
    );
}
