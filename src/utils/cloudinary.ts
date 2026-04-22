import axios from 'axios';

// Point this to your Spring Boot Server
const BASE_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const UPLOAD_API = `${BASE_API_URL}/public/upload`;

export interface ImageUploadResponse {
  mediaUrl: string;
  publicId: string;
}

/**
 * Upload image to NeoNHS Backend (which then uploads to Cloudinary)
 */
export const uploadImageToBackend = async (file: File | Blob): Promise<ImageUploadResponse | null> => {
  const formData = new FormData();
  // Key must match @RequestParam in Spring Boot: "imageFile"
  formData.append('imageFile', file);

  try {
    const response = await axios.post(`${UPLOAD_API}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Your ApiResponse structure: response.data.data
    if (response.data.success) {
      console.log('Backend Upload Success:', response.data.data.mediaUrl);
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('Backend Image Upload failed:', error);
    return null;
  }
};

/**
 * Upload video to NeoNHS Backend
 */
export const uploadVideoToBackend = async (file: File | Blob): Promise<string | null> => {
  const formData = new FormData();
  // Key must match @RequestParam in Spring Boot: "videoFile"
  formData.append('videoFile', file);

  try {
    const response = await axios.post(`${UPLOAD_API}/video`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.success) {
      return response.data.data; // This is the string URL
    }
    return null;
  } catch (error) {
    console.error('Backend Video Upload failed:', error);
    return null;
  }
};

/**
 * Delete a resource from Cloudinary via Backend
 */
export const deleteResourceFromBackend = async (publicId: string): Promise<boolean> => {
  try {
    const response = await axios.delete(`${UPLOAD_API}/image/${publicId}`);
    return response.data.success;
  } catch (error) {
    console.error('Deletion failed:', error);
    return false;
  }
};

/**

 * Validate image file before upload
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5MB)
 * @returns Error message if invalid, null if valid
 */

export const validateImageFile = (file: File, maxSizeMB: number = 5): string | null => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return 'Please upload a valid image file (JPG, PNG, GIF, or WebP)';
  }
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `File size must be less than ${maxSizeMB}MB`;
  }
  return null;
};

// Shorten image url
export const uploadImageUrlToBackend = async (url: string): Promise<ImageUploadResponse | null> => {
  try {
    const response = await axios.post(`${UPLOAD_API}/image-url`, { url });
    return response.data.data;
  } catch (error) {
    return null;
  }
};
