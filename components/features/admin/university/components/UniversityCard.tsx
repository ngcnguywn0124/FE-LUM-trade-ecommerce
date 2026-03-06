'use client';

import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react';
import type { UniversityResponse } from '@/types/admin';

interface UniversityCardProps {
  uni: UniversityResponse;
  isSuperAdmin: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onAddCampus: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}

export default function UniversityCard({
  uni,
  isSuperAdmin,
  isExpanded,
  onToggleExpand,
  onEdit,
  onAddCampus,
  onDelete,
  children,
}: UniversityCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* University Row */}
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={onToggleExpand}
          className="mt-0.5 flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
        >
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900 text-sm">{uni.universityName}</span>
            {uni.shortName && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                {uni.shortName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 flex-wrap">
            {uni.city && <span>📍 {uni.city}</span>}
            {uni.address && <span className="truncate max-w-xs">{uni.address}</span>}
            <span>{uni.campuses.length} cơ sở</span>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
            title="Chỉnh sửa"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={onAddCampus}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Thêm cơ sở"
          >
            <Plus size={15} />
          </button>
          {isSuperAdmin && (
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Xóa trường"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Campuses (expandable) */}
      {isExpanded && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
