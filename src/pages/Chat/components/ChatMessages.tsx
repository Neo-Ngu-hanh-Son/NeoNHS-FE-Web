import { RefObject } from 'react';
import { Image as AntImage } from 'antd';
import { ChatMessage } from '@/services/api/chatService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentUserId: string;
  currentUserAvatar: string;
  partnerAvatar: string;
  partnerName?: string;
  formatTime: (isoString?: string | null) => string;
  formatDateTime: (isoString?: string | null) => string;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export default function ChatMessages({
  messages,
  currentUserId,
  currentUserAvatar,
  partnerAvatar,
  partnerName,
  formatTime,
  formatDateTime,
  messagesEndRef
}: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col chat-scrollbar chat-bg">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl">
            👋
          </div>
          <p>Bắt đầu trò chuyện với {partnerName?.split(' ')[0]?.trim() || 'đối tác'}</p>
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

          // Filter out empty messages (Issue 3)
          if (!msg.content?.trim() && !msg.mediaUrl && !msg.metadata && msg.messageType !== 'IMAGE') {
            return null;
          }

          return (
            <div key={msg.id} className={`flex flex-col ${marginTopClass}`}>
              {/* Central Timestamp Header */}
              {showTimestampHeader && (
                <div className="flex justify-center mb-4 mt-2">
                  <span className="text-xs text-muted-foreground font-medium bg-muted/50 px-3 py-1 rounded-full">
                    {formatDateTime(msg.timestamp)}
                  </span>
                </div>
              )}

              {/* Message Row */}
              <div className={`flex w-full ${isSender ? 'justify-end' : 'justify-start'}`}>

                {/* Partner Avatar Placeholder / Icon */}
                {!isSender && (
                  <div className="w-8 shrink-0 mr-2 flex flex-col justify-end">
                    {showAvatar ? (
                      msg.senderId === 'AI_ASSISTANT' ? (
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm">
                          ✨
                        </div>
                      ) : (
                        <img src={partnerAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      )
                    ) : (
                      <div className="w-8 h-8" /> // Empty placeholder to align text
                    )}
                  </div>
                )}

                <div className={`flex flex-col max-w-[70%] ${isSender ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`${msg.messageType === 'IMAGE' ? 'p-1 bg-transparent border-0 shadow-none' : 'px-4 py-2.5'} rounded-2xl shadow-sm break-words text-[15px] leading-relaxed w-full ${isSender
                      ? `${msg.messageType === 'IMAGE' ? '' : 'bg-emerald-600 text-white'} ${showAvatar ? 'rounded-br-sm' : ''}`
                      : `${msg.messageType === 'IMAGE' ? '' : 'bg-[#f0f2f5] dark:bg-[#2a2d31] text-[#1c1e21] dark:text-white border border-black/5 dark:border-white/5'} ${showAvatar ? 'rounded-bl-sm' : ''}`
                      }`}
                  >
                    {msg.messageType === 'IMAGE' && (msg as any)._isUploading ? (
                      <div className="rounded-xl overflow-hidden shadow-sm relative" key="uploading">
                        <img
                          src={(msg as any)._localPreview}
                          alt="Đang tải lên..."
                          className="max-w-[200px] max-h-[300px] object-cover opacity-40 blur-[1px]"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                          <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                            <span className="text-white text-xs font-medium drop-shadow">Đang tải lên...</span>
                          </div>
                        </div>
                      </div>
                    ) : msg.messageType === 'IMAGE' && msg.mediaUrl ? (
                      <AntImage.PreviewGroup items={[msg.mediaUrl]}>
                        <div className="rounded-xl overflow-hidden shadow-sm flex" key={`image-${msg.id}`}>
                          <AntImage
                            src={msg.mediaUrl}
                            alt="Ảnh đã gửi"
                            rootClassName="max-w-[200px] max-h-[300px]"
                            className="object-cover"
                          />
                        </div>
                      </AntImage.PreviewGroup>
                    ) : msg.messageType === 'PRODUCT_SNIPPET' && msg.metadata ? (
                      <div className="flex flex-col gap-2" key={`product-${msg.id}`}>
                        <div className={`prose prose-sm max-w-none ${isSender ? 'prose-invert prose-p:text-white prose-p:m-0' : 'dark:prose-invert prose-p:m-0'}`}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>
                        <div
                          className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition ${isSender ? 'bg-primary-foreground/10 hover:bg-primary-foreground/20' : 'bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-sm border border-border'}`}
                          onClick={() => window.open(`/vendor/workshop-templates/${msg.metadata?.workshopId}`, '_blank')}
                        >
                          {msg.metadata.thumbnailUrl && (
                            <img src={msg.metadata.thumbnailUrl} alt="Ảnh thu nhỏ" className="w-12 h-12 rounded object-cover" />
                          )}
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm line-clamp-1">{msg.metadata.title}</span>
                            <span className="text-xs opacity-80">{msg.metadata.price?.toLocaleString()} ₫</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`prose prose-sm max-w-none ${isSender ? 'prose-invert prose-p:text-white prose-p:m-0' : 'dark:prose-invert prose-p:m-0'}`} key={`text-${msg.id}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                    )}
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
