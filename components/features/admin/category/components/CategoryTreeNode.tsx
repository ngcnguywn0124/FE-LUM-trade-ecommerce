'use client';

import { ChevronDown, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import type { CategoryResponse } from '@/types/admin';

interface CategoryTreeNodeProps {
  node: CategoryResponse;
  level?: number;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onEdit: (category: CategoryResponse) => void;
  onDelete: (category: CategoryResponse) => void;
}

export default function CategoryTreeNode({
  node,
  level = 0,
  expandedIds,
  onToggleExpand,
  onEdit,
  onDelete,
}: CategoryTreeNodeProps) {
  const hasChildren = Boolean(node.children?.length);
  const expanded = expandedIds.has(node.categoryId);

  return (
    <div>
      <div
        className="rounded-xl border border-gray-200 bg-white px-4 py-3"
        style={{ marginLeft: `${level * 16}px` }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <button
              type="button"
              onClick={() => hasChildren && onToggleExpand(node.categoryId)}
              className="mt-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-40"
              disabled={!hasChildren}
            >
              {hasChildren ? (
                expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
              ) : (
                <ChevronRight size={16} className="opacity-0" />
              )}
            </button>

            {node.imageUrl ? (
              <img
                src={node.imageUrl}
                alt={node.categoryName}
                className="w-11 h-11 rounded-lg object-cover border border-gray-200"
              />
            ) : (
              <div className="w-11 h-11 rounded-lg border border-dashed border-gray-300 bg-gray-50" />
            )}

            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{node.categoryName}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 flex-wrap">
                <span>Slug: {node.slug || '-'}</span>
                <span>•</span>
                <span>Order: {node.displayOrder}</span>
                <span>•</span>
                <span className={node.isActive ? 'text-emerald-600' : 'text-amber-600'}>
                  {node.isActive ? 'Đang bật' : 'Đang tắt'}
                </span>
              </div>
              {node.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{node.description}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(node)}
              className="p-2 rounded-lg text-gray-500 hover:text-cyan-700 hover:bg-cyan-50 transition-colors"
              aria-label="Sửa danh mục"
            >
              <Pencil size={15} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(node)}
              className="p-2 rounded-lg text-gray-500 hover:text-red-700 hover:bg-red-50 transition-colors"
              aria-label="Xóa danh mục"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {hasChildren && expanded && (
        <div className="space-y-2 mt-2">
          {node.children!.map((child) => (
            <CategoryTreeNode
              key={child.categoryId}
              node={child}
              level={level + 1}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
