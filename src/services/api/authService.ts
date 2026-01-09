/**
 * Authentication Service
 * Xử lý các API liên quan đến authentication
 */

import apiClient from './apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
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

  refreshToken: async (): Promise<{ token: string }> => {
    return await apiClient.post('/auth/refresh', {});
  },

  getCurrentUser: async () => {
    return await apiClient.get('/auth/me');
  },
};

export default authService;
