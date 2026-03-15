import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/auth";
import { ProductSummaryDto, SpringPage } from "@/types/product-api";

export interface FavoriteResponse {
  favoriteId: string;
  userId: string;
  product: ProductSummaryDto;
  createdAt: string;
}

export interface FavoriteStatusResponse {
  productId: string;
  isFavorited: boolean;
}

export const favoriteService = {
  /**
   * Save a product to favorites
   */
  async save(productId: string): Promise<ApiResponse<FavoriteResponse>> {
    const response = await apiClient.post<ApiResponse<FavoriteResponse>>(
      `/favorites/${productId}`
    );
    return response.data;
  },

  /**
   * Unsave a product from favorites
   */
  async unsave(productId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/favorites/${productId}`
    );
    return response.data;
  },

  /**
   * Get current user's favorite products
   */
  async getMyFavorites(
    page: number = 0,
    size: number = 20,
    statusFilter?: "active" | "sold"
  ): Promise<ApiResponse<SpringPage<FavoriteResponse>>> {
    const params: Record<string, any> = { page, size };
    if (statusFilter) {
      params.statusFilter = statusFilter;
    }
    const response = await apiClient.get<ApiResponse<SpringPage<FavoriteResponse>>>(
      "/favorites/my",
      { params }
    );
    return response.data;
  },

  /**
   * Check if a product is favorited by current user
   */
  async checkStatus(productId: string): Promise<ApiResponse<FavoriteStatusResponse>> {
    const response = await apiClient.get<ApiResponse<FavoriteStatusResponse>>(
      `/favorites/check/${productId}`
    );
    return response.data;
  },

  /**
   * Get count of active favorites for current user
   */
  async getCount(): Promise<ApiResponse<number>> {
    const response = await apiClient.get<ApiResponse<number>>("/favorites/count");
    return response.data;
  },
};
