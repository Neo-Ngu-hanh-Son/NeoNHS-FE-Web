/**
 * Global Type Definitions
 * Định nghĩa các types/interfaces chung cho toàn dự án
 */

export const UserRole = {
  TOURIST: "TOURIST",
  ADMIN: "ADMIN",
  VENDOR: "VENDOR",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  fullname: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  isBanned: boolean;
}

export interface VendorProfile {
  id: string;
  userId: string;
  fullname?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  businessName: string;
  description?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  taxCode?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VendorStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
}

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationParams;
}

// Re-export domain types
export * from './tag';
export * from './ticketCatalog';
export * from './event';
export * from './panorama';
export * from './voucher';
export * from './historyAudio';

// Add more global types as needed
