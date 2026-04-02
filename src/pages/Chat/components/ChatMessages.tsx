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
    <div className="flex-1 overflow-y-auto p-6 flex flex-col chat-scrollbar chat-bg">
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

          // Sequential array iterating oldest to newest
          const prevMsg = messages[index - 1];
          const nextMsg = messages[index + 1];

          // Timestamp separator calculation
          let showTimestampHeader = false;
          if (!prevMsg) {
            showTimestampHeader = true;
          } else {
            const currentT = new Date(msg.timestamp).getTime();
            const prevT = new Date(prevMsg.timestamp).getTime();
            if ((currentT - prevT) / (1000 * 60) > 10) {
              showTimestampHeader = true;
            }
          }

          // Avatar calculation (Show on the LAST message of a continuous block)
          let showAvatar = false;
          if (!nextMsg) {
            showAvatar = true;
          } else {
            const currentT = new Date(msg.timestamp).getTime();
            const nextT = new Date(nextMsg.timestamp).getTime();
            if (nextMsg.senderId !== msg.senderId || (nextT - currentT) / (1000 * 60) > 30) {
              showAvatar = true;
            }
          }

          // Continuous spacing
          const isNewBlock = !prevMsg || prevMsg.senderId !== msg.senderId || showTimestampHeader;
          const marginTopClass = index === 0 ? '' : isNewBlock ? 'mt-6' : 'mt-1';

          return (
            <div key={msg.id} className={`flex flex-col ${marginTopClass}`}>
              {/* Central Timestamp Header */}
              {showTimestampHeader && (
                <div className="flex justify-center mb-4 mt-2">
                  <span className="text-xs text-muted-foreground font-medium bg-muted/50 px-3 py-1 rounded-full">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              )}

              {/* Message Row */}
              <div className={`flex w-full ${isSender ? 'justify-end' : 'justify-start'}`}>

                {/* Partner Avatar Placeholder / Icon */}
                {!isSender && (
                  <div className="w-8 shrink-0 mr-2 flex flex-col justify-end">
                    {showAvatar ? (
                      <img src={partnerAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8" /> // Empty placeholder to align text
                    )}
                  </div>
                )}

                <div className={`flex flex-col max-w-[70%] ${isSender ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl shadow-sm break-words text-[15px] leading-relaxed w-full ${isSender
                        ? `bg-primary text-primary-foreground ${showAvatar ? 'rounded-br-sm' : ''}`
                        : `bg-[#f0f2f5] dark:bg-[#2a2d31] text-[#1c1e21] dark:text-white border border-black/5 dark:border-white/5 ${showAvatar ? 'rounded-bl-sm' : ''}`
                      }`}
                  >
                    {msg.content}
                  </div>
                </div>

                {/* Self Avatar Placeholder / Icon */}
                {isSender && (
                  <div className="w-8 shrink-0 ml-2 flex flex-col justify-end">
                    {showAvatar ? (
                      <img src={currentUserAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8" /> // Empty placeholder
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
