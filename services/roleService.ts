import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  RoleResponse,
  RoleRequest,
  PermissionResponse,
  AssignPermissionsRequest,
} from '@/types/admin';

// ── Roles ─────────────────────────────────────────────────────────────────

export async function getRoles(): Promise<RoleResponse[]> {
  const res = await apiClient.get<ApiResponse<RoleResponse[]>>('/roles');
  return res.data.data;
}

export async function getRoleById(id: string): Promise<RoleResponse> {
  const res = await apiClient.get<ApiResponse<RoleResponse>>(`/roles/${id}`);
  return res.data.data;
}

export async function createRole(data: RoleRequest): Promise<RoleResponse> {
  const res = await apiClient.post<ApiResponse<RoleResponse>>('/roles', data);
  return res.data.data;
}

export async function updateRole(id: string, data: RoleRequest): Promise<RoleResponse> {
  const res = await apiClient.put<ApiResponse<RoleResponse>>(`/roles/${id}`, data);
  return res.data.data;
}

export async function deleteRole(id: string): Promise<void> {
  await apiClient.delete(`/roles/${id}`);
}

export async function assignPermissions(
  roleId: string,
  data: AssignPermissionsRequest,
): Promise<RoleResponse> {
  const res = await apiClient.post<ApiResponse<RoleResponse>>(
    `/roles/${roleId}/permissions`,
    data,
  );
  return res.data.data;
}

export async function revokePermissions(
  roleId: string,
  data: AssignPermissionsRequest,
): Promise<RoleResponse> {
  const res = await apiClient.delete<ApiResponse<RoleResponse>>(
    `/roles/${roleId}/permissions`,
    { data },
  );
  return res.data.data;
}

// ── Permissions ──────────────────────────────────────────────────────────

export async function getPermissions(): Promise<PermissionResponse[]> {
  const res = await apiClient.get<ApiResponse<PermissionResponse[]>>('/permissions');
  return res.data.data;
}
