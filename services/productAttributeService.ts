import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth';
import type {
  ProductAttributeRequest,
  ProductAttributeResponse,
} from '@/types/admin';

export async function getAttributesByCategory(
  categoryId: string,
): Promise<ProductAttributeResponse[]> {
  const res = await apiClient.get<ApiResponse<ProductAttributeResponse[]>>(
    '/product-attributes',
    { params: { categoryId } },
  );
  return res.data.data;
}

export async function getAttributeById(id: string): Promise<ProductAttributeResponse> {
  const res = await apiClient.get<ApiResponse<ProductAttributeResponse>>(
    `/product-attributes/${id}`,
  );
  return res.data.data;
}

export async function createAttribute(
  data: ProductAttributeRequest,
): Promise<ProductAttributeResponse> {
  const res = await apiClient.post<ApiResponse<ProductAttributeResponse>>(
    '/product-attributes',
    data,
  );
  return res.data.data;
}

export async function updateAttribute(
  id: string,
  data: ProductAttributeRequest,
): Promise<ProductAttributeResponse> {
  const res = await apiClient.put<ApiResponse<ProductAttributeResponse>>(
    `/product-attributes/${id}`,
    data,
  );
  return res.data.data;
}

export async function deleteAttribute(id: string): Promise<void> {
  await apiClient.delete(`/product-attributes/${id}`);
}
