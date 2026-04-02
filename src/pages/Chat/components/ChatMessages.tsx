import { RefObject } from 'react';
import { ChatMessage } from '@/services/api/chatService';

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentUserId: string;
  currentUserAvatar: string;
  partnerAvatar: string;
  partnerName?: string;
  formatTime: (isoString?: string | null) => string;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export default function ChatMessages({
  messages,
  currentUserId,
  currentUserAvatar,
  partnerAvatar,
  partnerName,
  formatTime,
  messagesEndRef
}: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 chat-scrollbar chat-bg">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl">
            👋
          </div>
          <p>Start the conversation with {partnerName?.split(' ')[0]}</p>
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
                  className={`px-4 py-2.5 rounded-2xl shadow-sm max-w-xl break-words text-[15px] leading-relaxed ${isSender
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
  );
}
