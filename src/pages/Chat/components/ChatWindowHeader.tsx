import {
  MoreOutlined,
  DeleteOutlined,
  StopOutlined,
  WarningOutlined
} from '@ant-design/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface ChatWindowHeaderProps {
  partnerAvatar: string;
  partnerName?: string;
  isTyping?: boolean;
  roomType?: string;
}

export default function ChatWindowHeader({ partnerAvatar, partnerName, isTyping, roomType }: ChatWindowHeaderProps) {
  const isAiRoom = roomType === 'AI_CHAT';
  const isSupportRoom = roomType === 'SYSTEM_SUPPORT';

  return (
    <div className="px-6 py-4 border-b border-[#d3e4da] dark:border-white/10 flex items-center justify-between bg-white dark:bg-background-dark shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-10 shrink-0">
      <div className="flex items-center gap-3">
        {isAiRoom ? (
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-lg shadow-sm">
            ✨
          </div>
        ) : (
          <img src={partnerAvatar} alt={partnerName} className="w-10 h-10 rounded-full object-cover shadow-sm" />
        )}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-[#101914] dark:text-white">
              {isAiRoom ? 'Trợ lý AI NeoNHS' : (isSupportRoom ? `${partnerName} (Hỗ trợ)` : partnerName)}
            </h2>
            {roomType && roomType !== 'STANDARD' && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isAiRoom || isSupportRoom
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'
                : 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                }`}>
                {isAiRoom ? 'AI Assistant' : isSupportRoom ? 'Support Chat' : 'Vendor Chat'}
              </span>
            )}
          </div>
          {isTyping ? (
            <p className="text-xs text-primary flex items-center gap-1.5 animate-pulse">
              <span className="flex gap-0.5">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              typing...
            </p>
          ) : (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {isAiRoom ? 'Trợ lý ảo NeoNHS' : 'Người tham gia'}
            </p>
          )}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-muted-foreground border-none outline-none">
            <MoreOutlined className="text-xl rotate-90" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="text-red-500 hover:text-red-600 focus:text-red-600 cursor-pointer">
            <DeleteOutlined className="mr-2" /> Xóa cuộc trò chuyện
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <StopOutlined className="mr-2" /> Chặn người dùng
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <WarningOutlined className="mr-2" /> Báo cáo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
