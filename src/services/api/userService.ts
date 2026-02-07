import apiClient from './apiClient';
import type { User } from '@/types';

/**
 * User Service
 * Handles user profile retrieval, updates, and avatar uploads.
 */

export const userService = {
  /**
   * Get current user's profile
   */
  async getProfile(): Promise<User> {
    try {
      const res = await apiClient.get('/users/profile');
      console.log('getProfile raw response:', res);

      const data = (res?.data ?? res) as User;
      console.log('getProfile normalized data:', data);
      return data;
    } catch (error) {
      console.error('getProfile error:', error);
      throw error;
    }
  },

  /**
   * Update current user's profile
   * @param data - Profile data to update (including avatarUrl if changed)
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const userId = data.id;

      const payload = {
        fullname: data.fullname,
        email: data.email,
        phoneNumber: data.phoneNumber,
        avatarUrl: data.avatarUrl,
      };

      Object.keys(payload).forEach(key =>
        (payload as any)[key] === undefined && delete (payload as any)[key]
      );

      const res = await apiClient.put(`/users/update-profile/${userId}`, payload);
      return (res?.data ?? res) as User;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
