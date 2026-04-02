import { FormEvent } from 'react';
import { SendOutlined } from '@ant-design/icons';

interface ChatComposerProps {
  newMessage: string;
  onChange: (value: string) => void;
  onSend: (event: FormEvent) => void;
  isConnected: boolean;
}

export default function ChatComposer({
  newMessage,
  onChange,
  onSend,
  isConnected
}: ChatComposerProps) {
  return (
    <div className="p-4 border-t border-[#d3e4da] dark:border-white/10 bg-white dark:bg-background-dark shrink-0">
      <form onSubmit={onSend} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isConnected ? 'Type a message...' : 'Connecting...'}
          disabled={!isConnected}
          className="flex-1 bg-background-light dark:bg-white/5 border border-[#d3e4da] dark:border-white/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all dark:text-white disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || !isConnected}
          className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-none outline-none shadow-sm"
        >
          <SendOutlined className="text-lg ml-0.5" />
        </button>
      </form>
    </div>
  );
}
