import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  UniversityResponse,
  UniversityRequest,
  CampusResponse,
  CampusRequest,
} from '@/types/admin';

// ── Universities ──────────────────────────────────────────────────────────

export async function getUniversities(keyword?: string): Promise<UniversityResponse[]> {
  const params = keyword ? { keyword } : {};
  const res = await apiClient.get<ApiResponse<UniversityResponse[]>>('/universities', { params });
  return res.data.data;
}

export async function getUniversityById(id: number): Promise<UniversityResponse> {
  const res = await apiClient.get<ApiResponse<UniversityResponse>>(`/universities/${id}`);
  return res.data.data;
}

export async function createUniversity(data: UniversityRequest): Promise<UniversityResponse> {
  const res = await apiClient.post<ApiResponse<UniversityResponse>>('/universities', data);
  return res.data.data;
}

export async function updateUniversity(id: number, data: UniversityRequest): Promise<UniversityResponse> {
  const res = await apiClient.put<ApiResponse<UniversityResponse>>(`/universities/${id}`, data);
  return res.data.data;
}

export async function deleteUniversity(id: number): Promise<void> {
  await apiClient.delete(`/universities/${id}`);
}

// ── Campuses ──────────────────────────────────────────────────────────────

export async function getCampusesByUniversity(universityId: number): Promise<CampusResponse[]> {
  const res = await apiClient.get<ApiResponse<CampusResponse[]>>(
    `/universities/${universityId}/campuses`,
  );
  return res.data.data;
}

export async function getCampusById(id: number): Promise<CampusResponse> {
  const res = await apiClient.get<ApiResponse<CampusResponse>>(`/campuses/${id}`);
  return res.data.data;
}

export async function createCampus(data: CampusRequest): Promise<CampusResponse> {
  const res = await apiClient.post<ApiResponse<CampusResponse>>('/campuses', data);
  return res.data.data;
}

export async function updateCampus(id: number, data: CampusRequest): Promise<CampusResponse> {
  const res = await apiClient.put<ApiResponse<CampusResponse>>(`/campuses/${id}`, data);
  return res.data.data;
}

export async function deleteCampus(id: number): Promise<void> {
  await apiClient.delete(`/campuses/${id}`);
}
