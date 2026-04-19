import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { ChatRoom } from '@/services/api/chatService';

type RoomFilter = 'ALL' | 'SYSTEM_SUPPORT' | 'VENDOR_CHAT' | 'AI_CHAT';

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

const FILTER_TABS: { key: RoomFilter; label: string }[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'SYSTEM_SUPPORT', label: 'Hỗ trợ' },
  { key: 'VENDOR_CHAT', label: 'Vendor' },
];

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
  const [activeFilter, setActiveFilter] = useState<RoomFilter>('ALL');

  const displayedRooms = filteredRooms.filter(room => {
    if (activeFilter === 'ALL') return true;
    const roomType = (room as any).roomType;
    if (activeFilter === 'SYSTEM_SUPPORT') {
      return roomType === 'SYSTEM_SUPPORT' || roomType === 'AI_CHAT';
    }
    return roomType === activeFilter;
  });

  const getPreviewIcon = (room: ChatRoom) => {
    if (!room.lastMessagePreview && room.lastMessageAt) return '📷 Image';
    return room.lastMessagePreview || 'No messages yet';
  };

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

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-3 bg-muted/50 rounded-lg p-1">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all border-none outline-none cursor-pointer ${activeFilter === tab.key
                ? 'bg-white dark:bg-zinc-700 text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {tab.label}
            </button>
          ))}
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
        ) : displayedRooms.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
              <SearchOutlined className="text-xl" />
            </div>
            <p>Không tìm thấy cuộc trò chuyện</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {displayedRooms.map(room => {
              const roomType = (room as any).roomType;
              return (
                <button
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  className={`flex items-start gap-3 p-4 transition-colors text-left border-b border-white/5 last:border-0 ${activeRoomId === room.id
                    ? 'bg-primary/5 border-l-4 border-l-primary'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 border-l-4 border-l-transparent'
                    }`}
                >
                  <div className="relative shrink-0">
                    {roomType === 'AI_CHAT' ? (
                      <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white text-lg">
                        ✨
                      </div>
                    ) : (
                      <img src={room.otherUser?.avatarUrl} alt={room.otherUser?.fullname} className="w-12 h-12 rounded-full object-cover" />
                    )}
                    {(room.unreadCount && room.unreadCount > 0) ? (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white dark:border-background-dark">
                        {room.unreadCount}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-sm truncate text-[#101914] dark:text-white">
                          {roomType === 'AI_CHAT' ? 'Trợ lý AI' : room.otherUser?.fullname}
                        </h3>
                        {roomType && roomType !== 'STANDARD' && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${roomType === 'AI_CHAT' || roomType === 'SYSTEM_SUPPORT'
                            ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'
                            : 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                            }`}>
                            {roomType === 'AI_CHAT' ? 'AI' : roomType === 'SYSTEM_SUPPORT' ? 'SUPPORT' : 'VENDOR'}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs shrink-0 ml-2 ${(room.unreadCount && room.unreadCount > 0) ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                        {formatDate(room.lastMessageAt)}
                      </span>
                    </div>
                    <p className={`text-sm truncate w-[180px] ${(room.unreadCount && room.unreadCount > 0) ? 'text-[#101914] dark:text-white font-medium' : 'text-muted-foreground'}`}>
                      {room.lastMessageSenderId === currentUserId ? 'You: ' : ''}
                      {getPreviewIcon(room)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
