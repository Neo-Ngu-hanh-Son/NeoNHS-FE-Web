export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
}

export interface ChatRoom {
  id: string;
  name: string | null;
  participants: string[];
  createdAt: string;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  lastMessageSenderId: string | null;
  // Extra fields for UI that would normally be fetched/populated by joining with user data
  otherUser?: {
    id: string;
    fullname: string;
    avatarUrl?: string;
  };
  unreadCount?: number;
}

// Current logged in user (matches the mock user in AuthContext for testing)
export const CURRENT_USER_ID = "1"; 

export const mockChatRooms: ChatRoom[] = [
  {
    id: "room-1",
    name: null,
    participants: ["1", "user-2"],
    createdAt: "2026-03-25T10:00:00",
    lastMessageAt: "2026-03-28T20:45:00",
    lastMessagePreview: "That sounds like a great plan. See you tomorrow!",
    lastMessageSenderId: "1",
    otherUser: {
      id: "user-2",
      fullname: "Alex Johnson",
      avatarUrl: "https://i.pravatar.cc/150?u=alex"
    },
    unreadCount: 0
  },
  {
    id: "room-2",
    name: null,
    participants: ["1", "user-3"],
    createdAt: "2026-03-27T14:30:00",
    lastMessageAt: "2026-03-28T21:00:00",
    lastMessagePreview: "Can we reschedule the workshop validation to next week?",
    lastMessageSenderId: "user-3",
    otherUser: {
      id: "user-3",
      fullname: "Elena Rodriguez",
      avatarUrl: "https://i.pravatar.cc/150?u=elena"
    },
    unreadCount: 2
  },
  {
    id: "room-3",
    name: null,
    participants: ["1", "user-4"],
    createdAt: "2026-03-20T09:15:00",
    lastMessageAt: "2026-03-26T11:20:00",
    lastMessagePreview: "Thanks for the help with the ticket verification, much appreciated.",
    lastMessageSenderId: "1",
    otherUser: {
      id: "user-4",
      fullname: "David Smith",
      avatarUrl: "https://i.pravatar.cc/150?u=david"
    },
    unreadCount: 0
  },
  {
    id: "room-4",
    name: null,
    participants: ["1", "user-5"],
    createdAt: "2026-03-15T16:45:00",
    lastMessageAt: "2026-03-21T08:10:00",
    lastMessagePreview: "I've uploaded the new branding assets for the platform.",
    lastMessageSenderId: "user-5",
    otherUser: {
      id: "user-5",
      fullname: "Sarah Williams",
      avatarUrl: "https://i.pravatar.cc/150?u=sarah"
    },
    unreadCount: 0
  }
];

export const mockMessages: Record<string, ChatMessage[]> = {
  "room-1": [
    {
      id: "msg-1-1",
      chatRoomId: "room-1",
      senderId: "user-2",
      content: "Hi there! I was looking at your new pottery workshop template.",
      timestamp: "2026-03-28T20:30:00",
      status: "READ"
    },
    {
      id: "msg-1-2",
      chatRoomId: "room-1",
      senderId: "1",
      content: "Hello Alex! Yes, we just submitted it for approval yesterday. Do you have any questions about it?",
      timestamp: "2026-03-28T20:32:00",
      status: "READ"
    },
    {
      id: "msg-1-3",
      chatRoomId: "room-1",
      senderId: "user-2",
      content: "Just wondering if materials are fully included in the price, or if participants need to bring anything?",
      timestamp: "2026-03-28T20:35:00",
      status: "READ"
    },
    {
      id: "msg-1-4",
      chatRoomId: "room-1",
      senderId: "1",
      content: "Everything is included! Clay, tools, glazing, and firing. They just need to bring clothes they don't mind getting a bit dirty.",
      timestamp: "2026-03-28T20:38:00",
      status: "READ"
    },
    {
      id: "msg-1-5",
      chatRoomId: "room-1",
      senderId: "user-2",
      content: "Perfect. I'll pass that info along to the marketing team to highlight in the newsletter.",
      timestamp: "2026-03-28T20:42:00",
      status: "READ"
    },
    {
      id: "msg-1-6",
      chatRoomId: "room-1",
      senderId: "1",
      content: "That sounds like a great plan. See you tomorrow!",
      timestamp: "2026-03-28T20:45:00",
      status: "READ"
    }
  ],
  "room-2": [
    {
      id: "msg-2-1",
      chatRoomId: "room-2",
      senderId: "user-3",
      content: "Hey, do you have a moment to review the upcoming session schedule?",
      timestamp: "2026-03-28T19:15:00",
      status: "READ"
    },
    {
      id: "msg-2-2",
      chatRoomId: "room-2",
      senderId: "1",
      content: "Sure, I was just looking at it. What's up?",
      timestamp: "2026-03-28T19:20:00",
      status: "READ"
    },
    {
      id: "msg-2-3",
      chatRoomId: "room-2",
      senderId: "user-3",
      content: "I noticed a clash on Friday afternoon between the Cooking class and the Wine Tasting session in the same venue.",
      timestamp: "2026-03-28T19:25:00",
      status: "READ"
    },
    {
      id: "msg-2-4",
      chatRoomId: "room-2",
      senderId: "1",
      content: "Oh! Good catch. The Wine Tasting should have been in Venue B. I'll update that right away in the system.",
      timestamp: "2026-03-28T19:30:00",
      status: "READ"
    },
    {
      id: "msg-2-5",
      chatRoomId: "room-2",
      senderId: "user-3",
      content: "Great, thanks! Also...",
      timestamp: "2026-03-28T20:58:00",
      status: "DELIVERED"
    },
    {
      id: "msg-2-6",
      chatRoomId: "room-2",
      senderId: "user-3",
      content: "Can we reschedule the workshop validation to next week?",
      timestamp: "2026-03-28T21:00:00",
      status: "DELIVERED"
    }
  ],
  "room-3": [
    {
      id: "msg-3-1",
      chatRoomId: "room-3",
      senderId: "user-4",
      content: "Hey, having some trouble with the QR scanner on the new tablets.",
      timestamp: "2026-03-26T10:05:00",
      status: "READ"
    },
    {
      id: "msg-3-2",
      chatRoomId: "room-3",
      senderId: "1",
      content: "What's the issue? Is it not reading the codes or throwing an error?",
      timestamp: "2026-03-26T10:15:00",
      status: "READ"
    },
    {
      id: "msg-3-3",
      chatRoomId: "room-3",
      senderId: "user-4",
      content: "Camera isn't focusing on the smaller ticket stub formats.",
      timestamp: "2026-03-26T10:20:00",
      status: "READ"
    },
    {
      id: "msg-3-4",
      chatRoomId: "room-3",
      senderId: "1",
      content: "Ah, go to the scanner settings and enable 'Macro mode'. That fixed it for me yesterday.",
      timestamp: "2026-03-26T10:25:00",
      status: "READ"
    },
    {
      id: "msg-3-5",
      chatRoomId: "room-3",
      senderId: "user-4",
      content: "Works perfectly now. You saved the morning rush!",
      timestamp: "2026-03-26T11:15:00",
      status: "READ"
    },
    {
      id: "msg-3-6",
      chatRoomId: "room-3",
      senderId: "1",
      content: "Thanks for the help with the ticket verification, much appreciated.",
      timestamp: "2026-03-26T11:20:00",
      status: "READ"
    }
  ],
  "room-4": [
    {
      id: "msg-4-1",
      chatRoomId: "room-4",
      senderId: "1",
      content: "Do we have the new promotional banners for next month's campaign?",
      timestamp: "2026-03-20T14:20:00",
      status: "READ"
    },
    {
      id: "msg-4-2",
      chatRoomId: "room-4",
      senderId: "user-5",
      content: "Almost done, just waiting on final approval for the copy.",
      timestamp: "2026-03-20T15:10:00",
      status: "READ"
    },
    {
      id: "msg-4-3",
      chatRoomId: "room-4",
      senderId: "user-5",
      content: "I've uploaded the new branding assets for the platform.",
      timestamp: "2026-03-21T08:10:00",
      status: "READ"
    }
  ]
};
