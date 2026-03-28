import apiClient from "@/lib/apiClient";
import { BlogPost, BlogFormData } from "@/types/blog";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const createBlogPost = async (formData: BlogFormData): Promise<BlogPost> => {
  const data = new FormData();
  data.append("title", formData.title);
  data.append("category", formData.category);
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

export const getApprovedBlogs = async (params?: any): Promise<any> => {
  const response = await apiClient.get<ApiResponse<any>>("/blogs", { params });
  return response.data.data;
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost> => {
  const response = await apiClient.get<ApiResponse<BlogPost>>(`/blogs/slug/${slug}`);
  return response.data.data;
};

export const getAllBlogsForAdmin = async (status?: string, page = 0, size = 10): Promise<any> => {
  const response = await apiClient.get<ApiResponse<any>>("/blogs/admin", {
    params: { status, page, size }
  });
  return response.data.data;
};

export const updateBlogStatus = async (id: string, status: 'approved' | 'rejected', rejectionReason?: string): Promise<BlogPost> => {
  const response = await apiClient.patch<ApiResponse<BlogPost>>(`/blogs/${id}/status`, {
    status,
    rejectionReason
  });
  return response.data.data;
};

export const deleteBlog = async (id: string): Promise<void> => {
  await apiClient.delete(`/blogs/${id}`);
};
