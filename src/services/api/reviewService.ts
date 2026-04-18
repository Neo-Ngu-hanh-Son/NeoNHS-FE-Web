import apiClient from './apiClient';

export interface UserReview {
  id: string;
  fullname: string;
  avatarUrl: string | null;
}

export interface ReviewResponse {
  id: string;
  user: UserReview;
  rating: number;
  comment: string;
  createdAt: string;
  imageUrls: string[];
}

export interface PagedReviewResponse {
  content: ReviewResponse[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

export const ReviewService = {
  async getWorkshopReviews(templateId: string, page = 0, size = 10): Promise<PagedReviewResponse> {
    const endpoint = `/reviews/workshops/${templateId}?page=${page}&size=${size}`;
    const res = await apiClient.get<ApiResponse<PagedReviewResponse>>(endpoint);
    const data = (res?.data ?? res) as PagedReviewResponse;
    return data;
  }
};
