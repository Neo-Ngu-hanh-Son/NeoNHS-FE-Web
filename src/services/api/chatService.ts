import apiClient from './apiClient';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// ---- Types ----
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

  // Custom frontend fields not from BE directly (can be populated if we fetch user names)
  otherUser?: ChatUserDTO;
  unreadCount?: number;
}

export interface ChatUserDTO {
  id: string;
  fullname: string;
  avatarUrl: string;
  role: 'TOURIST' | 'VENDOR' | 'ADMIN';
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// Ensure the endpoint matches your actual WS setup.
// If API_BASE_URL is 'http://localhost:8080/api', the socket is usually 'http://localhost:8080/ws'.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const SOCKET_URL = API_BASE_URL.replace('/api', '/ws');

// ---- REST API Methods ----
export const ChatRestService = {
  createRoom: async (participantIds: string[], name: string | null = null): Promise<ChatRoom> => {
    return apiClient.post('/chat/rooms', { name, participantIds });
  },

  getMyRooms: async (): Promise<ChatRoom[]> => {
    return apiClient.get('/chat/rooms');
  },

  getRoomMessages: async (roomId: string, page = 0, size = 20): Promise<PageResponse<ChatMessage>> => {
    return apiClient.get(`/chat/rooms/${roomId}/messages?page=${page}&size=${size}`);
  },

  getChatUserInfo: async (userId: string): Promise<ChatUserDTO> => {
    return apiClient.get(`/chat/users/${userId}`);
  }
};

// ---- WebSocket Service ----
export class ChatWebSocketService {
  private stompClient: Client | null = null;
  private token: string;
  private subscription: any | null = null;
  private isConnected = false;

  constructor(token: string) {
    this.token = token;
  }

  connect(
    onMessageReceived: (message: ChatMessage) => void,
    onConnected?: () => void,
    onError?: (error: any) => void
  ) {
    if (this.isConnected) return;

    // Use legacy Stomp.over(new SockJS) due to the @stomp/stompjs compatibility layer with SockJS
    // StompJS v5+ handles configurations gracefully. We must pass the token in URL query as per BE guide.
    const socketUrlWithToken = `${SOCKET_URL}?token=${encodeURIComponent(this.token)}`;

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrlWithToken),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        // console.log(str); 
      },
    });

    this.stompClient.onConnect = (frame) => {
      this.isConnected = true;
      if (onConnected) onConnected();

      // Subscribe to the unified user queue
      this.subscription = this.stompClient!.subscribe('/user/queue/messages', (messagePayload) => {
        const message = JSON.parse(messagePayload.body) as ChatMessage;
        onMessageReceived(message);
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP Broker Error:', frame.headers['message'], frame.body);
      if (onError) onError(frame);
    };

    this.stompClient.activate();
  }

  sendMessage(chatRoomId: string, content: string) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/chat.send',
        body: JSON.stringify({ chatRoomId, content })
      });
    } else {
      console.error('Cannot send message: STOMP client is not connected');
      // Potential fail-safe: queue message or alert user
    }
  }

  disconnect() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    this.isConnected = false;
  }
}
