/**
 * Authentication Service
 * Xử lý các API liên quan đến authentication
 */

import apiClient from './apiClient';
import type { UserRole } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserInfo {
  id: string;
  email: string;
  fullname: string;
  role: UserRole;
  avatarUrl?: string;
  phoneNumber?: string;
  isActive: boolean;
  isVerified: boolean;
  isBanned: boolean;
}

export interface LoginResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    tokenType: string;
    userInfo: UserInfo;
  };
  timestamp: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return await apiClient.post('/auth/login', credentials);
  },

  logout: async (): Promise<void> => {
    return await apiClient.post('/auth/logout', {});
  },

  register: async (data: any): Promise<LoginResponse> => {
    return await apiClient.post('/auth/register', data);
  },

  loginGoogle: async (data: { idToken: string }): Promise<LoginResponse> => {
    return await apiClient.post(`/auth/google-login?idToken=${data.idToken}`, {});
  },

  refreshToken: async (): Promise<{ token: string }> => {
    return await apiClient.post('/auth/refresh', {});
  },

  getCurrentUser: async (): Promise<UserInfo> => {
    const response = await apiClient.get('/auth/me');
    // Handle different response structures
    // Backend might return: { data: {...} } or { status, success, message, data: {...}, timestamp }
    if (response?.data) {
      return response.data as UserInfo;
    }
    return response as UserInfo;
  },

  forgotPassword: async (email: string) => {
    return await apiClient.post('/auth/forgot-password', { email });
  },

  verifyOTP: async (email: string, otp: string) => {
    return await apiClient.post('/auth/verify', { email, otp });
  },

  resetPassword: async (email: string, newPassword: string, confirmPassword: string) => {
    return await apiClient.post('/auth/reset-password', { email, newPassword, confirmPassword });
  },

  // Registration OTP methods
  verifyRegistrationOTP: async (email: string, otp: string) => {
    return await apiClient.post('/auth/verify', { email, otp });
  },

  resendRegistrationOTP: async (email: string) => {
    return await apiClient.post('/auth/resend-verify-email', { email });
  },
}
