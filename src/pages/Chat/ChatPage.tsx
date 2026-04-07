import { FormEvent, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ChatRestService, ChatWebSocketService, ChatRoom, ChatMessage, ChatUserDTO } from '@/services/api/chatService';
import ChatSidebar from './components/ChatSidebar';
import ChatWindowHeader from './components/ChatWindowHeader';
import ChatMessages from './components/ChatMessages';
import ChatComposer from './components/ChatComposer';
import ChatEmptyState from './components/ChatEmptyState';
import { formatDate, formatTime, formatDateTime } from './components/chatFormatters';
import './ChatPage.css';

const createFallbackUser = (userId: string): ChatUserDTO => ({
  id: userId,
  fullname: `User ${userId.substring(0, 4)}`,
  avatarUrl: 'https://ui-avatars.com/api/?name=U&background=random',
  role: 'TOURIST'
});

const enrichRoomWithUserData = async (
  room: ChatRoom,
  currentUserId: string,
  userCache: Map<string, ChatUserDTO>
): Promise<ChatRoom> => {
  const otherParticipantId = room.participants.find(p => p !== currentUserId) || 'Unknown';

  let otherUser = userCache.get(otherParticipantId);

  if (!otherUser && otherParticipantId !== 'Unknown') {
    try {
      otherUser = await ChatRestService.getChatUserInfo(otherParticipantId);
      userCache.set(otherParticipantId, otherUser);
    } catch (error) {
      console.error(`Failed to fetch chat user info for ${otherParticipantId}:`, error);
      otherUser = createFallbackUser(otherParticipantId);
    }
  }

  return {
    ...room,
    otherUser: otherUser || createFallbackUser(otherParticipantId),
    unreadCount: 0
  };
};

export default function ChatPage() {
  const { user } = useAuth();

  const currentUserId = user?.id?.toString() || '';
  const currentUserAvatar = user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.fullname || 'U'}&background=random`;

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeRoomIdRef = useRef<string | null>(null);
  const userCacheRef = useRef<Map<string, ChatUserDTO>>(new Map());
  const wsServiceRef = useRef<ChatWebSocketService | null>(null);

  useEffect(() => {
    activeRoomIdRef.current = activeRoomId;
  }, [activeRoomId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !currentUserId) return;

    const loadRooms = async () => {
      try {
        setIsLoadingRooms(true);
        const serverRooms = await ChatRestService.getMyRooms();

        const enrichedRooms = await Promise.all(
          serverRooms.map((room) => enrichRoomWithUserData(room, currentUserId, userCacheRef.current))
        );
        setRooms(enrichedRooms);

        if (enrichedRooms.length > 0) {
          setActiveRoomId(enrichedRooms[0].id);
        }
      } catch (error) {
        console.error('Failed to load chat rooms:', error);
      } finally {
        setIsLoadingRooms(false);
      }
    };

    loadRooms();

    const ws = new ChatWebSocketService(token);
    wsServiceRef.current = ws;

    const handleIncomingMessage = (message: ChatMessage) => {
      setRooms(prevRooms => {
        const updatedRooms = prevRooms.map(room => {
          if (room.id === message.chatRoomId) {
            return {
              ...room,
              lastMessagePreview: message.content,
              lastMessageAt: message.timestamp,
              lastMessageSenderId: message.senderId,
              unreadCount: (activeRoomIdRef.current !== message.chatRoomId)
                ? (room.unreadCount || 0) + 1
                : 0
            };
          }
          return room;
        });

        return updatedRooms.sort((a, b) => {
          const timeA = new Date(a.lastMessageAt || 0).getTime();
          const timeB = new Date(b.lastMessageAt || 0).getTime();
          return timeB - timeA;
        });
      });

      setActiveRoomId(currentActiveId => {
        if (currentActiveId === message.chatRoomId) {
          setMessages(prevMsgs => {
            const exists = prevMsgs.some(m => m.id === message.id);
            if (exists) return prevMsgs;
            return [...prevMsgs, message];
          });
        }
        return currentActiveId;
      });
    };

    ws.connect(
      handleIncomingMessage,
      () => setIsConnected(true),
      (err) => console.error('Websocket Error', err)
    );

    return () => {
      ws.disconnect();
      wsServiceRef.current = null;
    };
  }, [currentUserId]);

  useEffect(() => {
    if (!activeRoomId) return;

    const loadMessageHistory = async () => {
      try {
        const response = await ChatRestService.getRoomMessages(activeRoomId, 0, 50);
        const chronoMessages = response.content.reverse();
        setMessages(chronoMessages);

        setRooms(prev => prev.map(room =>
          room.id === activeRoomId ? { ...room, unreadCount: 0 } : room
        ));
      } catch (error) {
        console.error(`Failed to fetch history for room ${activeRoomId}`, error);
      }
    };

    loadMessageHistory();
  }, [activeRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoomId || !wsServiceRef.current) return;

    const content = newMessage.trim();
    wsServiceRef.current.sendMessage(activeRoomId, content);

    setNewMessage('');
  };

  const handleImageSelect = async (file: File) => {
    if (!activeRoomId || !wsServiceRef.current) return;

    setIsUploadingImage(true);
    try {
      const response = await ChatRestService.uploadMedia(file);
      wsServiceRef.current.sendMessage(activeRoomId, '', 'IMAGE', response.mediaUrl);
    } catch (error) {
      console.error('Failed to upload and send image:', error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.otherUser?.fullname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeRoom = rooms.find(r => r.id === activeRoomId);
  const partnerAvatar = activeRoom?.otherUser?.avatarUrl || `https://ui-avatars.com/api/?name=${activeRoom?.otherUser?.fullname || '?'}`;

  return (
    <div className="chat-container bg-white dark:bg-background-dark rounded-xl border border-[#d3e4da] dark:border-white/10 shadow-sm overflow-hidden flex h-[calc(100vh-140px)] min-h-[500px]">
      <ChatSidebar
        currentUserAvatar={currentUserAvatar}
        isConnected={isConnected}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLoadingRooms={isLoadingRooms}
        filteredRooms={filteredRooms}
        activeRoomId={activeRoomId}
        onSelectRoom={setActiveRoomId}
        currentUserId={currentUserId}
        formatDate={formatDate}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-background-dark">
        {activeRoom ? (
          <>
            <ChatWindowHeader
              partnerAvatar={partnerAvatar}
              partnerName={activeRoom.otherUser?.fullname}
            />

            <ChatMessages
              messages={messages}
              currentUserId={currentUserId}
              currentUserAvatar={currentUserAvatar}
              partnerAvatar={partnerAvatar}
              partnerName={activeRoom.otherUser?.fullname}
              formatTime={formatTime}
              formatDateTime={formatDateTime}
              messagesEndRef={messagesEndRef}
            />

            <ChatComposer
              newMessage={newMessage}
              onChange={setNewMessage}
              onSend={handleSendMessage}
              onImageSelect={handleImageSelect}
              isConnected={isConnected}
              isUploadingImage={isUploadingImage}
            />
          </>
        ) : (
          <ChatEmptyState isLoadingRooms={isLoadingRooms} />
        )}
      </div>
    </div>
  );
}
