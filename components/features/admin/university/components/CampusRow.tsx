'use client';

import { MapPin, Pencil, Trash2 } from 'lucide-react';
import type { CampusResponse } from '@/types/admin';

interface CampusRowProps {
  campus: CampusResponse;
  isSuperAdmin: boolean;
  onEdit: (c: CampusResponse) => void;
  onDelete: (c: CampusResponse) => void;
}

export default function CampusRow({
  campus,
  isSuperAdmin,
  onEdit,
  onDelete,
}: CampusRowProps) {
  return (
    <div className="flex items-center gap-3 py-2 px-4 rounded-xl bg-emerald-50 border border-emerald-100">
      <MapPin size={14} className="text-emerald-500 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{campus.campusName}</p>
        {campus.address && <p className="text-xs text-gray-500 truncate">{campus.address}</p>}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onEdit(campus)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-100 transition-colors"
        >
          <Pencil size={13} />
        </button>
        {isSuperAdmin && (
          <button
            onClick={() => onDelete(campus)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
