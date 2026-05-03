/**
 * API Client Configuration
 * Cấu hình axios cho việc gọi API
 */

import axios, { AxiosError, AxiosResponse } from 'axios';

// Use relative URL in development to leverage Vite proxy and avoid CORS
// Or use environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
// const API_BASE_URL = "https://fwbgft4w-5173.asse.devtunnels.ms/api"

console.log('API Base URL:', API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle Errors & Data
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return the data directly to matching the previous fetch behavior (response.json())
    return response.data;
  },
  (error: AxiosError) => {
    let errorMessage = 'API request failed';
    let errorData: any = {};

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorData = error.response.data;
      errorMessage = (errorData as any).message || error.message;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }

    const customError: any = new Error(errorMessage);
    customError.response = error.response;
    customError.status = error.response?.status;

    return Promise.reject(customError);
  },
);

export const apiClient = {
  get: <T = any>(endpoint: string, config?: any) => axiosInstance.get<T, T>(endpoint, config),
  post: <T = any>(endpoint: string, data: any, config?: any) => axiosInstance.post<T, T>(endpoint, data, config),
  put: <T = any>(endpoint: string, data: any, config?: any) => axiosInstance.put<T, T>(endpoint, data, config),
  patch: <T = any>(endpoint: string, data?: any, config?: any) =>
    axiosInstance.patch<T, T>(endpoint, data ?? {}, config),
  delete: <T = any>(endpoint: string, config?: any) => axiosInstance.delete<T, T>(endpoint, config),
};

export default apiClient;
