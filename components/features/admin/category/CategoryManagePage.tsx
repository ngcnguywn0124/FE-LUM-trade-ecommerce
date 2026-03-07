'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import { FolderTree, Loader2, Plus, RefreshCw, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import type { CategoryResponse } from '@/types/admin';
import * as categoryService from '@/services/categoryService';

import CategoryFormModal from './components/CategoryFormModal';
import CategoryTreeNode from './components/CategoryTreeNode';
import CategoryDeleteModal from './components/CategoryDeleteModal';

function apiErrMsg(err: unknown, fallback: string) {
  if (err instanceof AxiosError) return err.response?.data?.message ?? fallback;
  return fallback;
}

function flattenCategories(tree: CategoryResponse[]): CategoryResponse[] {
  const result: CategoryResponse[] = [];

  const walk = (items: CategoryResponse[]) => {
    items.forEach((item) => {
      result.push(item);
      if (item.children?.length) {
        walk(item.children);
      }
    });
  };

  walk(tree);
  return result;
}

export default function CategoryManagePage() {
  const [categoriesTree, setCategoriesTree] = useState<CategoryResponse[]>([]);
  const [flatCategories, setFlatCategories] = useState<CategoryResponse[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  const [formModal, setFormModal] = useState<{ open: boolean; data?: CategoryResponse | null }>({
    open: false,
  });
  const [deleteTarget, setDeleteTarget] = useState<CategoryResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadTree = useCallback(async () => {
    const tree = await categoryService.getCategoryTree();
    setCategoriesTree(tree);
    setFlatCategories(flattenCategories(tree));

    const nextExpanded = new Set<string>();
    tree.forEach((node) => {
      if (node.children?.length) {
        nextExpanded.add(node.categoryId);
      }
    });
    setExpandedIds(nextExpanded);
  }, []);

  const loadSearch = useCallback(async (searchKeyword: string) => {
    const data = await categoryService.getCategories(searchKeyword);
    setFlatCategories(data);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (keyword.trim()) {
        await loadSearch(keyword.trim());
      } else {
        await loadTree();
      }
    } catch {
      toast.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  }, [keyword, loadSearch, loadTree]);

  useEffect(() => {
    load();
  }, [load]);

  function handleToggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await categoryService.deleteCategory(deleteTarget.categoryId);
      toast.success('Xóa danh mục thành công');
      setDeleteTarget(null);
      await load();
    } catch (err) {
      toast.error(apiErrMsg(err, 'Xóa thất bại'));
    } finally {
      setDeleting(false);
    }
  }

  const hasKeyword = keyword.trim().length > 0;

  const searchResults = useMemo(() => {
    if (!hasKeyword) return [];
    return flatCategories;
  }, [flatCategories, hasKeyword]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-100">
            <FolderTree size={22} className="text-cyan-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Quản lý Danh mục</h1>
            <p className="text-sm text-gray-500">
              {hasKeyword ? `${searchResults.length} kết quả tìm kiếm` : `${flatCategories.length} danh mục`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setFormModal({ open: true, data: null })}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 text-white rounded-xl font-semibold text-sm hover:bg-cyan-600 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Thêm danh mục
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
          placeholder="Tìm theo tên danh mục..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {keyword && (
          <button
            onClick={() => setKeyword('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 gap-3 text-gray-400">
          <Loader2 size={22} className="animate-spin" />
          <span className="text-sm">Đang tải…</span>
        </div>
      ) : hasKeyword ? (
        searchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
            <p className="text-sm">Không tìm thấy danh mục phù hợp</p>
            <button
              onClick={load}
              className="flex items-center gap-1 text-xs text-cyan-600 hover:underline"
            >
              <RefreshCw size={12} /> Tải lại
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {searchResults.map((cat) => (
              <div key={cat.categoryId} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{cat.categoryName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Cha: {cat.parentCategoryName || 'Danh mục gốc'} • Order: {cat.displayOrder}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFormModal({ open: true, data: cat })}
                      className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : categoriesTree.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
          <p className="text-sm">Chưa có danh mục nào</p>
          <button
            onClick={load}
            className="flex items-center gap-1 text-xs text-cyan-600 hover:underline"
          >
            <RefreshCw size={12} /> Tải lại
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {categoriesTree.map((node) => (
            <CategoryTreeNode
              key={node.categoryId}
              node={node}
              expandedIds={expandedIds}
              onToggleExpand={handleToggleExpand}
              onEdit={(category) => setFormModal({ open: true, data: category })}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {formModal.open && (
        <CategoryFormModal
          initial={formModal.data ?? null}
          categories={categoriesTree}
          onClose={() => setFormModal({ open: false })}
          onSaved={async () => {
            setFormModal({ open: false });
            await load();
          }}
        />
      )}

      {deleteTarget && (
        <CategoryDeleteModal
          name={deleteTarget.categoryName}
          loading={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
