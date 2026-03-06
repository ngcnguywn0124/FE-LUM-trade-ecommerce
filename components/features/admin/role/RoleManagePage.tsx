'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { Plus, Loader2, ShieldCheck } from 'lucide-react';
import * as roleService from '@/services/roleService';
import type { RoleResponse, PermissionResponse } from '@/types/admin';
import { useAuthStore } from '@/stores/authStore';

// Components
import RoleModal from './components/RoleModal';
import AssignPermissionsModal from './components/AssignPermissionsModal';
import ConfirmRoleDelete from './components/ConfirmRoleDelete';
import RoleCard from './components/RoleCard';

function apiErrMsg(err: unknown, fallback: string) {
  if (err instanceof AxiosError) return err.response?.data?.message ?? fallback;
  return fallback;
}

export default function RoleManagePage() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.roles?.includes('ROLE_SUPER_ADMIN') ?? false;

  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [allPermissions, setAllPermissions] = useState<PermissionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [roleModal, setRoleModal] = useState<{ open: boolean; data?: RoleResponse | null }>({
    open: false,
  });
  const [permModal, setPermModal] = useState<RoleResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoleResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesData, permsData] = await Promise.all([
        roleService.getRoles(),
        roleService.getPermissions(),
      ]);
      setRoles(rolesData);
      setAllPermissions(permsData);
    } catch {
      toast.error('Không thể tải dữ liệu phân quyền');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleRoleSaved(saved: RoleResponse) {
    setRoles((prev) => {
      const idx = prev.findIndex((r) => r.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setRoleModal({ open: false });
  }

  function handlePermSaved(updated: RoleResponse) {
    setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setPermModal(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await roleService.deleteRole(deleteTarget.id);
      setRoles((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      toast.success('Đã xóa role');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(apiErrMsg(err, 'Xóa thất bại'));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-100">
            <ShieldCheck size={22} className="text-orange-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Quản lý Roles & Quyền hạn</h1>
            <p className="text-sm text-gray-500">
              {roles.length} roles · {allPermissions.length} permissions
            </p>
          </div>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setRoleModal({ open: true, data: null })}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Tạo role mới
          </button>
        )}
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center h-48 gap-3 text-gray-400">
          <Loader2 size={22} className="animate-spin" />
          <span className="text-sm">Đang tải…</span>
        </div>
      ) : (
        <div className="space-y-3">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              isSuperAdmin={isSuperAdmin}
              onEdit={(r) => setRoleModal({ open: true, data: r })}
              onDelete={setDeleteTarget}
              onManagePermissions={setPermModal}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {roleModal.open && (
        <RoleModal
          initial={roleModal.data}
          onClose={() => setRoleModal({ open: false })}
          onSaved={handleRoleSaved}
        />
      )}

      {permModal && (
        <AssignPermissionsModal
          role={permModal}
          allPermissions={allPermissions}
          onClose={() => setPermModal(null)}
          onSaved={handlePermSaved}
        />
      )}

      {deleteTarget && (
        <ConfirmRoleDelete
          name={deleteTarget.name}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
