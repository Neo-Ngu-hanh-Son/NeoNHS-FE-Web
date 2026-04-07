import { FormEvent, useRef } from 'react';
import { SendOutlined, PictureOutlined, LoadingOutlined } from '@ant-design/icons';

interface ChatComposerProps {
  newMessage: string;
  onChange: (value: string) => void;
  onSend: (event: FormEvent) => void;
  onImageSelect: (file: File) => void;
  isConnected: boolean;
  isUploadingImage?: boolean;
}

export default function ChatComposer({
  newMessage,
  onChange,
  onSend,
  onImageSelect,
  isConnected,
  isUploadingImage
}: ChatComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelect(e.target.files[0]);
      e.target.value = ''; // Reset so the same file can be selected again
    }
  };

  return (
    <div className="p-4 border-t border-[#d3e4da] dark:border-white/10 bg-white dark:bg-background-dark shrink-0">
      <form onSubmit={onSend} className="flex gap-2 items-center">
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange} 
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={!isConnected || isUploadingImage}
          className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none outline-none"
          title="Send image"
        >
          {isUploadingImage ? <LoadingOutlined className="text-xl" /> : <PictureOutlined className="text-xl" />}
        </button>

        <input
          type="text"
          value={newMessage}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isConnected ? 'Type a message...' : 'Connecting...'}
          disabled={!isConnected || isUploadingImage}
          className="flex-1 bg-background-light dark:bg-white/5 border border-[#d3e4da] dark:border-white/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all dark:text-white disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || !isConnected || isUploadingImage}
          className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-none outline-none shadow-sm"
        >
          <SendOutlined className="text-lg ml-0.5" />
        </button>
      </form>
    </div>
  );
}
