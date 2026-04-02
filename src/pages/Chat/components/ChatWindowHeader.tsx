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
}

export default function ChatWindowHeader({ partnerAvatar, partnerName }: ChatWindowHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-[#d3e4da] dark:border-white/10 flex items-center justify-between bg-white dark:bg-background-dark shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-10 shrink-0">
      <div className="flex items-center gap-3">
        <img src={partnerAvatar} alt={partnerName} className="w-10 h-10 rounded-full object-cover shadow-sm" />
        <div>
          <h2 className="font-bold text-[#101914] dark:text-white">{partnerName}</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Participant
          </p>
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
            <DeleteOutlined className="mr-2" /> Delete conversation
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <StopOutlined className="mr-2" /> Block user
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <WarningOutlined className="mr-2" /> Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
