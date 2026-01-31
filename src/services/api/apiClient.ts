/**
 * API Client Configuration
 * Cấu hình axios hoặc fetch cho việc gọi API
 */

// Sử dụng với axios
// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
// Use relative URL in development to leverage Vite proxy and avoid CORS
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Ví dụ với fetch
export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      const text = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch {
        errorData = { message: text };
      }
      const error: any = new Error(errorData.message || text || 'API request failed');
      error.response = { data: errorData, status: response.status };
      throw error;
    }
    return response.json();
  },

  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const text = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch {
        errorData = { message: text };
      }
      const error: any = new Error(errorData.message || text || 'API request failed');
      error.response = { data: errorData, status: response.status };
      throw error;
    }
    return response.json();
  },

  put: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const text = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch {
        errorData = { message: text };
      }
      const error: any = new Error(errorData.message || text || 'API request failed');
      error.response = { data: errorData, status: response.status };
      throw error;
    }
    return response.json();
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const text = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch {
        errorData = { message: text };
      }
      const error: any = new Error(errorData.message || text || 'API request failed');
      error.response = { data: errorData, status: response.status };
      throw error;
    }
    return response.json();
  },
};

export default apiClient;
