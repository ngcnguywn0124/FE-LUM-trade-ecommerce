import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  RoleResponse,
  RoleRequest,
  PermissionResponse,
  AssignPermissionsRequest,
  BulkIdsRequest,
  BulkUserIdsRequest,
  RoleUserResponse,
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

// ── Bulk Roles & Role Users ──────────────────────────────────────────────────

export async function bulkDeleteRoles(
  data: BulkIdsRequest,
): Promise<BulkIdsRequest> {
  const res = await apiClient.delete<ApiResponse<BulkIdsRequest>>('/roles/bulk', {
    data,
  });
  return res.data.data;
}

export async function getUsersByRole(
  roleId: string,
  params?: { page?: number; limit?: number; search?: string },
): Promise<{
  data: RoleUserResponse[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}> {
  const res = await apiClient.get<
    ApiResponse<{
      data: RoleUserResponse[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
    }>
  >(`/roles/${roleId}/users`, { params });
  return res.data.data;
}

export async function bulkAssignRoleToUsers(
  roleId: string,
  data: BulkUserIdsRequest,
): Promise<void> {
  await apiClient.post(`/roles/${roleId}/users/bulk`, data);
}

export async function bulkAssignRoleByEmails(
  roleId: string,
  data: { emails: string[] },
): Promise<void> {
  await apiClient.post(`/roles/${roleId}/users/bulk-by-email`, data);
}

export async function bulkRevokeRoleFromUsers(
  roleId: string,
  data: BulkUserIdsRequest,
): Promise<void> {
  await apiClient.delete(`/roles/${roleId}/users/bulk`, { data });
}

// ── User Roles Config ────────────────────────────────────────────────────────

export async function getUserRoles(userId: string): Promise<RoleResponse[]> {
  const res = await apiClient.get<ApiResponse<RoleResponse[]>>(`/users/${userId}/roles`);
  return res.data.data;
}

export async function setUserRoles(
  userId: string,
  data: BulkIdsRequest,
): Promise<void> {
  await apiClient.put(`/users/${userId}/roles`, data);
}

export async function addUserRole(userId: string, roleId: string): Promise<void> {
  await apiClient.post(`/users/${userId}/roles`, { roleId });
}

export async function removeUserRole(userId: string, roleId: string): Promise<void> {
  await apiClient.delete(`/users/${userId}/roles`, { data: { roleId } });
}

export async function getUserPermissions(userId: string): Promise<PermissionResponse[]> {
  const res = await apiClient.get<ApiResponse<PermissionResponse[]>>(
    `/users/${userId}/permissions`,
  );
  return res.data.data;
}

export async function checkUserPermission(
  userId: string,
  resource: string,
  action: string,
): Promise<{ hasPermission: boolean; permission: string }> {
  const res = await apiClient.get<
    ApiResponse<{ hasPermission: boolean; permission: string }>
  >(`/users/${userId}/permissions/check`, { params: { resource, action } });
  return res.data.data;
}
