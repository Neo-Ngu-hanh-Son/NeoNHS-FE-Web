import apiClient from './apiClient';
import type { VendorProfile } from '@/types';

/**
 * Vendor Service
 * Handles Vendor profile retrieval, updates, and manage info.
 */

export const VendorService = {
  async getVendorProfile(): Promise<VendorProfile> {
    try {
      // apiClient.get returns parsed JSON
      const res = await apiClient.get('/vendors/profile');
      console.log('getVendorProfile raw response:', res);
      // Normalize response: it may be either { data } or direct object
      const data = (res?.data ?? res) as VendorProfile;
      console.log('getVendorProfile normalized data:', data);
      return data;
    } catch (error) {
      console.error('getVendorProfile error:', error);
      throw error;
    }
  },

  /**
   * Update vendor profile
   * @param data - Vendor profile data to update
   * Note: Backend expects fullname, phoneNumber, avatarUrl (user fields) + business fields
   */
  async updateVendorProfile(data: Partial<VendorProfile>): Promise<VendorProfile> {
    try {
      // Prepare payload matching backend API schema
      const payload = {
        fullname: data.fullname,
        phoneNumber: data.phoneNumber,
        avatarUrl: data.avatarUrl,
        businessName: data.businessName,
        description: data.description,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        taxCode: data.taxCode,
        bankName: data.bankName,
        bankAccountNumber: data.bankAccountNumber,
        bankAccountName: data.bankAccountName,
      };

      console.log('Updating vendor profile with payload:', payload);
      const res = await apiClient.put(`/vendors/${data.id}`, payload);
      const updated = (res?.data ?? res) as VendorProfile;
      console.log('Vendor profile updated successfully:', updated);
      return updated;
    } catch (error) {
      console.error('updateVendorProfile error:', error);
      throw error;
    }
  },
};

export default VendorService;
