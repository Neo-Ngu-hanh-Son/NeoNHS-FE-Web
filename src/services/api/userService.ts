import apiClient from './apiClient';
import type { User } from '@/types';

/**
 * User Service
 * Handles user profile retrieval, updates, and avatar uploads.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const userService = {
  /**
   * Get current user's profile
   */
  async getProfile(): Promise<User> {
    // apiClient.get returns parsed JSON
    const res = await apiClient.get('/user/profile');
    // Normalize response: it may be either { data } or direct object
    const data = (res?.data ?? res) as User;
    return data;
  },

  /**
   * Update current user's profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const res = await apiClient.put('/user/profile', data);
    const updated = (res?.data ?? res) as User;
    return updated;
  },

  /**
   * Upload avatar and return the new URL
   * Uses direct fetch with FormData because apiClient is configured for JSON bodies.
   */
  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/user/avatar`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(text || 'Avatar upload failed');
    }

    const resJson = await response.json();
    const url: string = resJson?.avatarUrl ?? resJson?.data?.avatarUrl;
    if (!url) {
      throw new Error('Avatar URL not returned from server');
    }
    return url;
  },
};

export default userService;
