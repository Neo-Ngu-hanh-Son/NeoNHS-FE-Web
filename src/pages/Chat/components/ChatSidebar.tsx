import { SearchOutlined } from '@ant-design/icons';
import { ChatRoom } from '@/services/api/chatService';

interface ChatSidebarProps {
  currentUserAvatar: string;
  isConnected: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isLoadingRooms: boolean;
  filteredRooms: ChatRoom[];
  activeRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  currentUserId: string;
  formatDate: (isoString?: string | null) => string;
}

export default function ChatSidebar({
  currentUserAvatar,
  isConnected,
  searchQuery,
  onSearchChange,
  isLoadingRooms,
  filteredRooms,
  activeRoomId,
  onSelectRoom,
  currentUserId,
  formatDate
}: ChatSidebarProps) {
  return (
    <div className="w-80 border-r border-[#d3e4da] dark:border-white/10 flex flex-col shrink-0 bg-background-light/30 dark:bg-black/20">
      <div className="p-4 border-b border-[#d3e4da] dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={currentUserAvatar} alt="Ảnh đại diện của bạn" className="w-10 h-10 rounded-full border-2 border-primary/20 object-cover" />
            <h2 className="text-xl font-bold text-[#101914] dark:text-white">Tin nhắn</h2>
          </div>
          <div
            className={`w-3 h-3 rounded-full ${isConnected ? 'bg-primary' : 'bg-red-400 opacity-50'} shadow-sm`}
            title={isConnected ? 'Đã kết nối' : 'Mất kết nối'}
          />
        </div>  

        <div className="relative">
          <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-[#588d70]" />
          <input
            type="text"
            placeholder="Tìm cuộc trò chuyện..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-white/5 border border-[#d3e4da] dark:border-white/10 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {isLoadingRooms ? (
          <div className="p-6 text-center text-muted-foreground flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p>Đang tải cuộc trò chuyện...</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
              <SearchOutlined className="text-xl" />
            </div>
            <p>Không tìm thấy cuộc trò chuyện</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredRooms.map(room => (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className={`flex items-start gap-3 p-4 transition-colors text-left border-b border-white/5 last:border-0 ${activeRoomId === room.id
                  ? 'bg-primary/5 border-l-4 border-l-primary'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 border-l-4 border-l-transparent'
                  }`}
              >
                <div className="relative shrink-0">
                  <img src={room.otherUser?.avatarUrl} alt={room.otherUser?.fullname} className="w-12 h-12 rounded-full object-cover" />
                  {(room.unreadCount && room.unreadCount > 0) ? (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white dark:border-background-dark">
                      {room.unreadCount}
                    </span>
                  ) : null}
                </div>

                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-sm truncate text-[#101914] dark:text-white">
                      {room.otherUser?.fullname}
                    </h3>
                    <span className={`text-xs shrink-0 ml-2 ${(room.unreadCount && room.unreadCount > 0) ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                      {formatDate(room.lastMessageAt)}
                    </span>
                  </div>
                  <p className={`text-sm truncate w-[190px] ${(room.unreadCount && room.unreadCount > 0) ? 'text-[#101914] dark:text-white font-medium' : 'text-muted-foreground'}`}>
                    {room.lastMessageSenderId === currentUserId ? 'Bạn: ' : ''}
                    {room.lastMessagePreview
                      ? room.lastMessagePreview
                      : room.lastMessageAt
                        ? "📷 Ảnh"
                        : "Chưa có tin nhắn"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
