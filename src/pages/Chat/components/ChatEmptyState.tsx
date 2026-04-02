interface ChatEmptyStateProps {
  isLoadingRooms: boolean;
}

export default function ChatEmptyState({ isLoadingRooms }: ChatEmptyStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-background-light/30 dark:bg-black/20">
      <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-4xl opacity-50">chat</span>
      </div>
      <h3 className="text-xl font-medium text-[#101914] dark:text-white mb-2">Your Messages</h3>
      <p>
        {isLoadingRooms
          ? 'Loading your conversations...'
          : 'Select a conversation from the sidebar to start chatting'}
      </p>
    </div>
  );
}
