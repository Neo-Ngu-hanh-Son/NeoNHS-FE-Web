/**
 * Global Type Definitions
 * Định nghĩa các types/interfaces chung cho toàn dự án
 */

export interface User {
  id: string;
  email: string;
  fullname: string;
  role?: string;
  avatarUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
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

// Add more global types as needed
