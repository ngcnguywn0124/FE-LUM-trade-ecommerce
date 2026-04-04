'use client';

import { useState } from 'react';
import { Lock, Pencil, Trash2, KeyRound, ChevronUp, ChevronDown, Users } from 'lucide-react';
import type { RoleResponse } from '@/types/admin';

const ROLE_COLORS: Record<string, string> = {
  ROLE_USER: 'bg-blue-100 text-blue-700',
  ROLE_MODERATOR: 'bg-yellow-100 text-yellow-700',
  ROLE_ADMIN: 'bg-orange-100 text-orange-700',
  ROLE_SUPER_ADMIN: 'bg-red-100 text-red-700',
};

function roleBadge(name: string) {
  return ROLE_COLORS[name] ?? 'bg-gray-100 text-gray-600';
}

interface RoleCardProps {
  role: RoleResponse;
  isSuperAdmin: boolean;
  selected?: boolean;
  onSelect?: (checked: boolean) => void;
  onEdit: (r: RoleResponse) => void;
  onDelete: (r: RoleResponse) => void;
  onManagePermissions: (r: RoleResponse) => void;
  onManageUsers: (r: RoleResponse) => void;
}

export default function RoleCard({
  role,
  isSuperAdmin,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
  onManagePermissions,
  onManageUsers,
}: RoleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isSystemRole = [
    'ROLE_USER',
    'ROLE_ADMIN',
    'ROLE_MODERATOR',
    'ROLE_SUPER_ADMIN',
  ].includes(role.name);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        {isSuperAdmin && !isSystemRole && onSelect && (
          <div className="pt-1">
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => onSelect(e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
            />
          </div>
        )}
        <div className="flex-shrink-0 p-2 rounded-xl bg-orange-50 mt-0.5">
          <Lock size={16} className="text-orange-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${roleBadge(role.name)}`}
            >
              {role.name}
            </span>
            {isSystemRole && (
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs">
                Hệ thống
              </span>
            )}
          </div>
          {role.description && <p className="text-sm text-gray-600 mt-1">{role.description}</p>}
          <p className="text-xs text-gray-400 mt-1">{role.permissions.length} permissions</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onManageUsers(role)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Quản lý Users"
          >
            <Users size={15} />
          </button>
          <button
            onClick={() => onManagePermissions(role)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            title="Phân quyền"
          >
            <KeyRound size={15} />
          </button>
          <button
            onClick={() => onEdit(role)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            title="Chỉnh sửa"
          >
            <Pencil size={15} />
          </button>
          {isSuperAdmin && !isSystemRole && (
            <button
              onClick={() => onDelete(role)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Xóa role"
            >
              <Trash2 size={15} />
            </button>
          )}
          <button
            onClick={() => setExpanded((p) => !p)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Permissions list */}
      {expanded && (
        <div className="px-4 pb-4">
          {role.permissions.length === 0 ? (
            <p className="text-xs text-gray-400">Chưa có permission nào.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {role.permissions.map((p) => (
                <span
                  key={p.id}
                  className="px-2.5 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-medium"
                >
                  {p.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
