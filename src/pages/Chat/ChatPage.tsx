import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  SearchOutlined, 
  SendOutlined, 
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
import { mockChatRooms, mockMessages, ChatRoom, ChatMessage, CURRENT_USER_ID } from './data';
import './ChatPage.css';

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const now = new Date();
  
  // If today, return time
  if (date.toDateString() === now.toDateString()) {
    return formatTime(isoString);
  }
  
  // If yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  // Else date
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export default function ChatPage() {
  const { user } = useAuth();
  
  // Current user info (fallback to mock CURRENT_USER_ID if context not ready)
  const currentUserId = user?.id?.toString() || CURRENT_USER_ID;
  const currentUserAvatar = user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.fullname || 'U'}&background=random`;
  
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load initial data
  useEffect(() => {
    // In real app, this would be an API call
    setRooms(mockChatRooms);
    if (mockChatRooms.length > 0) {
      setActiveRoomId(mockChatRooms[0].id);
    }
  }, []);

  // Load messages when room changes
  useEffect(() => {
    if (activeRoomId) {
      // In real app, API call: GET /api/chat/rooms/{activeRoomId}/messages
      const roomMsgs = mockMessages[activeRoomId] || [];
      setMessages([...roomMsgs]);
      
      // Clear unread count locally
      setRooms(prev => prev.map(room => 
        room.id === activeRoomId ? { ...room, unreadCount: 0 } : room
      ));
    }
  }, [activeRoomId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoomId) return;

    const newMsg: ChatMessage = {
      id: `new-msg-${Date.now()}`,
      chatRoomId: activeRoomId,
      senderId: currentUserId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      status: 'SENT'
    };

    setMessages(prev => [...prev, newMsg]);
    
    // Update room preview
    setRooms(prev => prev.map(room => {
      if (room.id === activeRoomId) {
        return {
          ...room,
          lastMessagePreview: newMsg.content,
          lastMessageAt: newMsg.timestamp,
          lastMessageSenderId: currentUserId
        };
      }
      return room;
    }));
    
    setNewMessage('');
    
    // In real app: WebSocket send implementation
    // stompClient.send('/app/chat.send', {}, JSON.stringify({ chatRoomId: activeRoomId, content: newMsg.content }));
  };

  const filteredRooms = rooms.filter(room => 
    room.otherUser?.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeRoom = rooms.find(r => r.id === activeRoomId);
  const partnerAvatar = activeRoom?.otherUser?.avatarUrl || `https://ui-avatars.com/api/?name=${activeRoom?.otherUser?.fullname || '?'}`;

  return (
    <div className="chat-container bg-white dark:bg-background-dark rounded-xl border border-[#d3e4da] dark:border-white/10 shadow-sm overflow-hidden flex h-[calc(100vh-140px)] min-h-[500px]">
      
      {/* LEFT PANEL - CONVERSATION LIST */}
      <div className="w-80 border-r border-[#d3e4da] dark:border-white/10 flex flex-col shrink-0 bg-background-light/30 dark:bg-black/20">
        
        <div className="p-4 border-b border-[#d3e4da] dark:border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <img src={currentUserAvatar} alt="Current User" className="w-10 h-10 rounded-full border-2 border-primary/20 object-cover" />
            <h2 className="text-xl font-bold text-[#101914] dark:text-white">Messages</h2>
          </div>
          
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-[#588d70]" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-white/5 border border-[#d3e4da] dark:border-white/10 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto chat-scrollbar">
          {filteredRooms.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                <SearchOutlined className="text-xl" />
              </div>
              <p>No conversations found</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredRooms.map(room => (
                <button 
                  key={room.id}
                  onClick={() => setActiveRoomId(room.id)}
                  className={`flex items-start gap-3 p-4 transition-colors text-left border-b border-white/5 last:border-0 ${
                    activeRoomId === room.id 
                      ? 'bg-primary/5 border-l-4 border-l-primary' 
                      : 'hover:bg-black/5 dark:hover:bg-white/5 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={room.otherUser?.avatarUrl} alt={room.otherUser?.fullname} className="w-12 h-12 rounded-full object-cover" />
                    {room.unreadCount ? (
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
                      <span className={`text-xs shrink-0 ml-2 ${room.unreadCount ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                        {room.lastMessageAt ? formatDate(room.lastMessageAt) : ''}
                      </span>
                    </div>
                    <p className={`text-sm truncate w-[190px] ${room.unreadCount ? 'text-[#101914] dark:text-white font-medium' : 'text-muted-foreground'}`}>
                      {room.lastMessageSenderId === currentUserId ? 'You: ' : ''}
                      {room.lastMessagePreview || 'No messages yet'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* RIGHT PANEL - CHAT WINDOW */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-background-dark">
        {activeRoom ? (
          <>
            {/* Chat Window Header */}
            <div className="px-6 py-4 border-b border-[#d3e4da] dark:border-white/10 flex items-center justify-between bg-white dark:bg-background-dark shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-10 shrink-0">
              <div className="flex items-center gap-3">
                <img src={partnerAvatar} alt={activeRoom.otherUser?.fullname} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                <div>
                  <h2 className="font-bold text-[#101914] dark:text-white">{activeRoom.otherUser?.fullname}</h2>
                  <p className="text-xs text-primary font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary inline-block"></span> Active now
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
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 chat-scrollbar chat-bg">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-3">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl">
                    👋
                  </div>
                  <p>Start the conversation with {activeRoom.otherUser?.fullname.split(' ')[0]}</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isSender = msg.senderId === currentUserId;
                  const showAvatar = !isSender && (index === messages.length - 1 || messages[index + 1]?.senderId === currentUserId);
                  
                  return (
                    <div key={msg.id} className={`flex max-w-[80%] ${isSender ? 'ml-auto' : 'mr-auto'}`}>
                      
                      {!isSender && (
                        <div className="w-8 shrink-0 mr-2 flex flex-col justify-end">
                          {showAvatar && (
                            <img src={partnerAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                          )}
                        </div>
                      )}
                      
                      <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
                        <div 
                          className={`px-4 py-2.5 rounded-2xl shadow-sm max-w-xl break-words text-[15px] leading-relaxed ${
                            isSender 
                              ? 'bg-primary text-primary-foreground rounded-br-sm' 
                              : 'bg-[#f0f2f5] dark:bg-[#2a2d31] text-[#1c1e21] dark:text-white rounded-bl-sm border border-black/5 dark:border-white/5'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[11px] text-muted-foreground mt-1 mx-1.5 font-medium tracking-wide">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      
                      {isSender && (
                        <div className="w-8 shrink-0 ml-2 flex flex-col justify-end">
                          <img src={currentUserAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Footer Input Area */}
            <div className="p-4 border-t border-[#d3e4da] dark:border-white/10 bg-white dark:bg-background-dark shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-background-light dark:bg-white/5 border border-[#d3e4da] dark:border-white/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all dark:text-white"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-none outline-none shadow-sm"
                >
                  <SendOutlined className="text-lg ml-0.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-background-light/30 dark:bg-black/20">
            <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl opacity-50">chat</span>
            </div>
            <h3 className="text-xl font-medium text-[#101914] dark:text-white mb-2">Your Messages</h3>
            <p>Select a conversation from the sidebar to start chatting</p>
          </div>
        )}
      </div>
      
    </div>
  );
}
