import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth';
import type { TagRequest, TagResponse } from '@/types/admin';

export async function getTags(keyword?: string): Promise<TagResponse[]> {
  const params = keyword?.trim() ? { keyword: keyword.trim() } : {};
  const res = await apiClient.get<ApiResponse<TagResponse[]>>('/tags', { params });
  return res.data.data;
}

export async function getTagById(id: string): Promise<TagResponse> {
  const res = await apiClient.get<ApiResponse<TagResponse>>(`/tags/${id}`);
  return res.data.data;
}

export async function createTag(data: TagRequest): Promise<TagResponse> {
  const res = await apiClient.post<ApiResponse<TagResponse>>('/tags', data);
  return res.data.data;
}

export async function updateTag(id: string, data: TagRequest): Promise<TagResponse> {
  const res = await apiClient.put<ApiResponse<TagResponse>>(`/tags/${id}`, data);
  return res.data.data;
}

export async function deleteTag(id: string): Promise<void> {
  await apiClient.delete(`/tags/${id}`);
}
