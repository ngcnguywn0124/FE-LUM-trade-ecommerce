// ============================================================
// Admin Types — University / Campus / Role / Permission
// ============================================================

import type { ApiResponse } from './auth';
export type { ApiResponse };

// ── Campus ───────────────────────────────────────────────────

export interface CampusResponse {
  campusId: string;
  universityId: string;
  universityName: string;
  campusName: string;
  slug: string | null;
  address: string | null;
  createdAt: string;
}

export interface CampusRequest {
  universityId: string;
  campusName: string;
  address?: string;
}

// ── University ───────────────────────────────────────────────

export interface UniversityResponse {
  universityId: string;
  universityName: string;
  shortName: string | null;
  slug: string | null;
  city: string | null;
  address: string | null;
  createdAt: string;
  campuses: CampusResponse[];
}

export interface UniversityRequest {
  universityName: string;
  shortName?: string;
  city?: string;
  address?: string;
}

// ── Category ─────────────────────────────────────────────────

export interface CategoryResponse {
  categoryId: string;
  categoryName: string;
  slug: string | null;
  description: string | null;
  imageUrl: string | null;
  imageCloudId: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  parentCategoryId: string | null;
  parentCategoryName: string | null;
  children?: CategoryResponse[];
}

export interface CategoryRequest {
  categoryName: string;
  parentCategoryId: string | null;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}

// ── Permission ───────────────────────────────────────────────

export interface PermissionResponse {
  id: string;
  name: string;
  description: string | null;
  resource: string;
  action: string;
  createdAt: string;
}

// ── Role ─────────────────────────────────────────────────────

export interface RoleResponse {
  id: string;
  name: string;
  description: string | null;
  permissions: PermissionResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleRequest {
  name: string;
  description?: string;
}

export interface AssignPermissionsRequest {
  permissionIds: string[];
}
