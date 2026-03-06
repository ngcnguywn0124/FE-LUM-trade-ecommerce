'use client';

import { useState } from 'react';
import { X, CheckSquare, Square, KeyRound, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import * as roleService from '@/services/roleService';
import type { RoleResponse, PermissionResponse, AssignPermissionsRequest } from '@/types/admin';

function apiErrMsg(err: unknown, fallback: string) {
  if (err instanceof AxiosError) return err.response?.data?.message ?? fallback;
  return fallback;
}

const ROLE_COLORS: Record<string, string> = {
  ROLE_USER: 'bg-blue-100 text-blue-700',
  ROLE_MODERATOR: 'bg-yellow-100 text-yellow-700',
  ROLE_ADMIN: 'bg-orange-100 text-orange-700',
  ROLE_SUPER_ADMIN: 'bg-red-100 text-red-700',
};

function roleBadge(name: string) {
  return ROLE_COLORS[name] ?? 'bg-gray-100 text-gray-600';
}

interface AssignPermissionsModalProps {
  role: RoleResponse;
  allPermissions: PermissionResponse[];
  onClose: () => void;
  onSaved: (r: RoleResponse) => void;
}

export default function AssignPermissionsModal({
  role,
  allPermissions,
  onClose,
  onSaved,
}: AssignPermissionsModalProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(role.permissions.map((p) => p.id))
  );
  const [saving, setSaving] = useState(false);

  // Group permissions by resource
  const grouped = allPermissions.reduce<Record<string, PermissionResponse[]>>((acc, p) => {
    (acc[p.resource] = acc[p.resource] ?? []).push(p);
    return acc;
  }, {});

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleGroup(perms: PermissionResponse[]) {
    const ids = perms.map((p) => p.id);
    const allSelected = ids.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    const currentIds = new Set(role.permissions.map((p) => p.id));

    const toGrant = [...selected].filter((id) => !currentIds.has(id));
    const toRevoke = [...currentIds].filter((id) => !selected.has(id));

    try {
      let updated = role;
      if (toGrant.length > 0) {
        updated = await roleService.assignPermissions(role.id, {
          permissionIds: toGrant,
        } as AssignPermissionsRequest);
      }
      if (toRevoke.length > 0) {
        updated = await roleService.revokePermissions(role.id, {
          permissionIds: toRevoke,
        } as AssignPermissionsRequest);
      }
      toast.success('Cập nhật permissions thành công');
      onSaved(updated);
    } catch (err) {
      toast.error(apiErrMsg(err, 'Cập nhật thất bại'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <KeyRound size={18} className="text-purple-600" />
            Phân quyền cho{' '}
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${roleBadge(role.name)}`}
            >
              {role.name}
            </span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {Object.entries(grouped).map(([resource, perms]) => {
            const allSelected = perms.every((p) => selected.has(p.id));
            const someSelected = perms.some((p) => selected.has(p.id));
            return (
              <div key={resource} className="border rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleGroup(perms)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  {allSelected ? (
                    <CheckSquare size={16} className="text-purple-600 flex-shrink-0" />
                  ) : someSelected ? (
                    <div className="w-4 h-4 border-2 border-purple-400 rounded bg-purple-100 flex-shrink-0" />
                  ) : (
                    <Square size={16} className="text-gray-300 flex-shrink-0" />
                  )}
                  <span className="font-bold text-sm text-gray-700">{resource}</span>
                  <span className="ml-auto text-xs text-gray-400">
                    {perms.filter((p) => selected.has(p.id)).length}/{perms.length} được chọn
                  </span>
                </button>
                <div className="divide-y">
                  {perms.map((perm) => (
                    <button
                      key={perm.id}
                      type="button"
                      onClick={() => toggle(perm.id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors text-left"
                    >
                      {selected.has(perm.id) ? (
                        <CheckSquare size={15} className="text-purple-600 flex-shrink-0" />
                      ) : (
                        <Square size={15} className="text-gray-300 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{perm.name}</p>
                        {perm.description && (
                          <p className="text-xs text-gray-500">{perm.description}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 bg-gray-100 px-2 py-0.5 rounded-full">
                        {perm.action}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {allPermissions.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-8">
              Chưa có permission nào trong hệ thống.
            </p>
          )}
        </div>

        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
          <p className="text-sm text-gray-500">
            {selected.size} / {allPermissions.length} permissions được chọn
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 text-sm rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-60 transition-colors flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              Lưu phân quyền
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
