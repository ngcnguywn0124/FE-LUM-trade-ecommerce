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
  iconName: string | null;
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
  iconName?: string;
  displayOrder?: number;
  isActive?: boolean;
}

// ── Product Attribute & Tag ────────────────────────────────

export type AttributeType = 'text' | 'number' | 'boolean' | 'select';

export interface ProductAttributeResponse {
  attributeId: string;
  categoryId: string;
  categoryName: string;
  attributeName: string;
  attributeType: AttributeType;
  isRequired: boolean;
  options: string[] | null;
  displayOrder: number;
}

export interface ProductAttributeRequest {
  categoryId: string;
  attributeName: string;
  attributeType: AttributeType;
  isRequired?: boolean;
  options?: string[];
  displayOrder?: number;
}

export interface TagResponse {
  tagId: string;
  tagName: string;
  slug: string | null;
  usageCount: number;
  createdAt: string;
}

export interface TagRequest {
  tagName: string;
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
