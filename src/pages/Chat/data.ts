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
    lastMessagePreview: "Nghe có vẻ hay đấy. Mai gặp nhé!",
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
    lastMessagePreview: "Mình có thể dời lịch kiểm duyệt workshop sang tuần sau không?",
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
    lastMessagePreview: "Cảm ơn bạn đã hỗ trợ xác minh vé, rất biết ơn.",
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
    lastMessagePreview: "Mình đã tải lên bộ nhận diện thương hiệu mới cho nền tảng.",
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
      content: "Chào bạn! Mình đang xem mẫu workshop gốm mới của bạn.",
      timestamp: "2026-03-28T20:30:00",
      status: "READ"
    },
    {
      id: "msg-1-2",
      chatRoomId: "room-1",
      senderId: "1",
      content: "Chào Alex! Đúng rồi, hôm qua mình vừa gửi duyệt. Bạn có thắc mắc gì về mẫu không?",
      timestamp: "2026-03-28T20:32:00",
      status: "READ"
    },
    {
      id: "msg-1-3",
      chatRoomId: "room-1",
      senderId: "user-2",
      content: "Mình chỉ muốn hỏi vật liệu đã gồm hết trong giá chưa, hay người tham gia cần mang thêm gì không?",
      timestamp: "2026-03-28T20:35:00",
      status: "READ"
    },
    {
      id: "msg-1-4",
      chatRoomId: "room-1",
      senderId: "1",
      content: "Đã gồm hết nhé! Đất sét, dụng cụ, men và nung. Họ chỉ cần mang quần áo không ngại bẩn thôi.",
      timestamp: "2026-03-28T20:38:00",
      status: "READ"
    },
    {
      id: "msg-1-5",
      chatRoomId: "room-1",
      senderId: "user-2",
      content: "Tuyệt. Mình sẽ chuyển thông tin này cho team marketing để nhấn mạnh trong bản tin.",
      timestamp: "2026-03-28T20:42:00",
      status: "READ"
    },
    {
      id: "msg-1-6",
      chatRoomId: "room-1",
      senderId: "1",
      content: "Nghe có vẻ hay đấy. Mai gặp nhé!",
      timestamp: "2026-03-28T20:45:00",
      status: "READ"
    }
  ],
  "room-2": [
    {
      id: "msg-2-1",
      chatRoomId: "room-2",
      senderId: "user-3",
      content: "Bạn rảnh xem lịch phiên sắp tới giúp mình được không?",
      timestamp: "2026-03-28T19:15:00",
      status: "READ"
    },
    {
      id: "msg-2-2",
      chatRoomId: "room-2",
      senderId: "1",
      content: "Được, mình vừa xem. Có chuyện gì thế?",
      timestamp: "2026-03-28T19:20:00",
      status: "READ"
    },
    {
      id: "msg-2-3",
      chatRoomId: "room-2",
      senderId: "user-3",
      content: "Mình thấy chiều thứ Sáu lớp Nấu ăn và phiên Thử rượu bị trùng địa điểm.",
      timestamp: "2026-03-28T19:25:00",
      status: "READ"
    },
    {
      id: "msg-2-4",
      chatRoomId: "room-2",
      senderId: "1",
      content: "Ồ hay đấy! Phiên Thử rượu phải ở địa điểm B. Mình cập nhật ngay trong hệ thống.",
      timestamp: "2026-03-28T19:30:00",
      status: "READ"
    },
    {
      id: "msg-2-5",
      chatRoomId: "room-2",
      senderId: "user-3",
      content: "Cảm ơn nhé! À mà...",
      timestamp: "2026-03-28T20:58:00",
      status: "DELIVERED"
    },
    {
      id: "msg-2-6",
      chatRoomId: "room-2",
      senderId: "user-3",
      content: "Mình có thể dời lịch kiểm duyệt workshop sang tuần sau không?",
      timestamp: "2026-03-28T21:00:00",
      status: "DELIVERED"
    }
  ],
  "room-3": [
    {
      id: "msg-3-1",
      chatRoomId: "room-3",
      senderId: "user-4",
      content: "Mình gặp lỗi với máy quét QR trên máy tính bảng mới.",
      timestamp: "2026-03-26T10:05:00",
      status: "READ"
    },
    {
      id: "msg-3-2",
      chatRoomId: "room-3",
      senderId: "1",
      content: "Lỗi kiểu gì? Không đọc được mã hay báo lỗi?",
      timestamp: "2026-03-26T10:15:00",
      status: "READ"
    },
    {
      id: "msg-3-3",
      chatRoomId: "room-3",
      senderId: "user-4",
      content: "Camera không lấy nét được với cỡ vé nhỏ.",
      timestamp: "2026-03-26T10:20:00",
      status: "READ"
    },
    {
      id: "msg-3-4",
      chatRoomId: "room-3",
      senderId: "1",
      content: "À, vào cài đặt máy quét và bật 'Chế độ macro'. Hôm qua mình làm vậy là được.",
      timestamp: "2026-03-26T10:25:00",
      status: "READ"
    },
    {
      id: "msg-3-5",
      chatRoomId: "room-3",
      senderId: "user-4",
      content: "Giờ chạy ngon rồi. Cứu cả ca sáng đông!",
      timestamp: "2026-03-26T11:15:00",
      status: "READ"
    },
    {
      id: "msg-3-6",
      chatRoomId: "room-3",
      senderId: "1",
      content: "Cảm ơn bạn đã hỗ trợ xác minh vé, rất biết ơn.",
      timestamp: "2026-03-26T11:20:00",
      status: "READ"
    }
  ],
  "room-4": [
    {
      id: "msg-4-1",
      chatRoomId: "room-4",
      senderId: "1",
      content: "Mình có banner quảng cáo cho chiến dịch tháng tới chưa?",
      timestamp: "2026-03-20T14:20:00",
      status: "READ"
    },
    {
      id: "msg-4-2",
      chatRoomId: "room-4",
      senderId: "user-5",
      content: "Gần xong rồi, đang chờ duyệt nội dung cuối.",
      timestamp: "2026-03-20T15:10:00",
      status: "READ"
    },
    {
      id: "msg-4-3",
      chatRoomId: "room-4",
      senderId: "user-5",
      content: "Mình đã tải lên bộ nhận diện thương hiệu mới cho nền tảng.",
      timestamp: "2026-03-21T08:10:00",
      status: "READ"
    }
  ]
};
