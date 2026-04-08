import apiClient from "@/lib/apiClient";
import { BlogPost, BlogFormData, BlogCategory, BlogCategoryPayload } from "@/types/blog";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface BlogListParams {
  categoryId?: string;
  query?: string;
  search?: string;
  isFeatured?: boolean;
  sort?: string;
  page?: number;
  size?: number;
}

export interface BlogListResponse {
  content: BlogPost[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const uploadBlogImage = async (file: File): Promise<string> => {
  const data = new FormData();
  data.append("file", file);
  const response = await apiClient.post<ApiResponse<string>>("/blogs/upload-image", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};

export const createBlogPost = async (formData: BlogFormData): Promise<BlogPost> => {
  const data = new FormData();
  data.append("title", formData.title);
  data.append("categoryId", formData.categoryId);
  data.append("excerpt", formData.excerpt);
  data.append("content", formData.content);
  if (formData.thumbnail) {
    data.append("thumbnail", formData.thumbnail);
  }

  const response = await apiClient.post<ApiResponse<BlogPost>>("/blogs", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

export const updateBlogPost = async (id: string, formData: BlogFormData): Promise<BlogPost> => {
  const data = new FormData();
  data.append("title", formData.title);
  data.append("categoryId", formData.categoryId);
  data.append("excerpt", formData.excerpt);
  data.append("content", formData.content);
  if (formData.thumbnail) {
    data.append("thumbnail", formData.thumbnail);
  }

  const response = await apiClient.put<ApiResponse<BlogPost>>(`/blogs/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};


export const getApprovedBlogs = async (params?: BlogListParams): Promise<BlogListResponse> => {
  const normalizedParams = {
    ...params,
    search: params?.query || params?.search,
    categoryId: params?.categoryId,
  };

  delete normalizedParams.query;

  const response = await apiClient.get<ApiResponse<BlogListResponse>>("/blogs", { params: normalizedParams });
  return response.data.data;
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost> => {
  const response = await apiClient.get<ApiResponse<BlogPost>>(`/blogs/slug/${slug}`);
  return response.data.data;
};

export const getBlogPostById = async (id: string): Promise<BlogPost> => {
  const response = await apiClient.get<ApiResponse<BlogPost>>(`/blogs/id/${id}`);
  return response.data.data;
};

export const toggleBlogLike = async (id: string): Promise<{ liked: boolean }> => {
  const response = await apiClient.post<ApiResponse<{ liked: boolean }>>(`/blogs/${id}/like`);
  return response.data.data;
};

export const checkBlogLikeStatus = async (id: string): Promise<{ liked: boolean }> => {
  const response = await apiClient.get<ApiResponse<{ liked: boolean }>>(`/blogs/${id}/like-status`);
  return response.data.data;
};


export const getAllBlogsForAdmin = async (status?: string, page = 0, size = 10): Promise<BlogListResponse> => {
  const response = await apiClient.get<ApiResponse<BlogListResponse>>("/blogs/admin", {
    params: { status, page, size }
  });
  return response.data.data;
};

export const updateBlogStatus = async (id: string, status: 'draft' | 'published' | 'archived'): Promise<BlogPost> => {
  const response = await apiClient.patch<ApiResponse<BlogPost>>(`/blogs/${id}/status`, {
    status
  });
  return response.data.data;
};

export const deleteBlog = async (id: string): Promise<void> => {
  await apiClient.delete(`/blogs/${id}`);
};

export const getBlogCategories = async (): Promise<BlogCategory[]> => {
  const response = await apiClient.get<ApiResponse<BlogCategory[]>>('/blog-categories');
  return response.data.data;
};

export const getBlogCategoriesForAdmin = async (params?: { keyword?: string; isActive?: boolean }): Promise<BlogCategory[]> => {
  const response = await apiClient.get<ApiResponse<BlogCategory[]>>('/blog-categories/admin/list', { params });
  return response.data.data;
};

export const createBlogCategory = async (payload: BlogCategoryPayload): Promise<BlogCategory> => {
  const response = await apiClient.post<ApiResponse<BlogCategory>>('/blog-categories', payload);
  return response.data.data;
};

export const updateBlogCategory = async (id: string, payload: BlogCategoryPayload): Promise<BlogCategory> => {
  const response = await apiClient.put<ApiResponse<BlogCategory>>(`/blog-categories/${id}`, payload);
  return response.data.data;
};

export const deleteBlogCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/blog-categories/${id}`);
};
