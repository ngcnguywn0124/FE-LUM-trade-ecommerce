import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth';
import type { CategoryRequest, CategoryResponse } from '@/types/admin';

function buildCategoryFormData(data: CategoryRequest, image?: File | null): FormData {
  const formData = new FormData();
  formData.append(
    'data',
    new Blob([JSON.stringify(data)], {
      type: 'application/json',
    }),
  );

  if (image) {
    formData.append('image', image);
  }

  return formData;
}

export async function getCategoryTree(): Promise<CategoryResponse[]> {
  const res = await apiClient.get<ApiResponse<CategoryResponse[]>>('/categories/tree');
  return res.data.data;
}

export async function getCategories(keyword?: string): Promise<CategoryResponse[]> {
  const params = keyword ? { keyword } : {};
  const res = await apiClient.get<ApiResponse<CategoryResponse[]>>('/categories', { params });
  return res.data.data;
}

export async function getCategoryById(id: string): Promise<CategoryResponse> {
  const res = await apiClient.get<ApiResponse<CategoryResponse>>(`/categories/${id}`);
  return res.data.data;
}

export async function createCategory(
  data: CategoryRequest,
  image?: File | null,
): Promise<CategoryResponse> {
  const res = await apiClient.post<ApiResponse<CategoryResponse>>(
    '/categories',
    buildCategoryFormData(data, image),
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return res.data.data;
}

export async function updateCategory(
  id: string,
  data: CategoryRequest,
  image?: File | null,
): Promise<CategoryResponse> {
  const res = await apiClient.put<ApiResponse<CategoryResponse>>(
    `/categories/${id}`,
    buildCategoryFormData(data, image),
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return res.data.data;
}

export async function updateCategoryImage(id: string, image: File): Promise<CategoryResponse> {
  const formData = new FormData();
  formData.append('image', image);

  const res = await apiClient.patch<ApiResponse<CategoryResponse>>(
    `/categories/${id}/image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return res.data.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}
