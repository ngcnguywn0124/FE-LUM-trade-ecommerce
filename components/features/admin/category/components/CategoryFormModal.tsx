'use client';

import { useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import { FolderTree, ImagePlus, Loader2, X, LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { toast } from 'sonner';
import type { CategoryRequest, CategoryResponse } from '@/types/admin';
import * as categoryService from '@/services/categoryService';
import { FormInput } from '@/components/shared/FormInput';

interface CategoryFormModalProps {
  initial?: CategoryResponse | null;
  categories: CategoryResponse[];
  onClose: () => void;
  onSaved: (category: CategoryResponse) => void;
}

function apiErrMsg(err: unknown, fallback: string) {
  if (err instanceof AxiosError) return err.response?.data?.message ?? fallback;
  return fallback;
}

function flattenCategories(tree: CategoryResponse[]): CategoryResponse[] {
  const result: CategoryResponse[] = [];

  const walk = (nodes: CategoryResponse[]) => {
    nodes.forEach((node) => {
      result.push(node);
      if (node.children?.length) {
        walk(node.children);
      }
    });
  };

  walk(tree);
  return result;
}

function collectDescendantIds(node: CategoryResponse): Set<string> {
  const ids = new Set<string>();
  const walk = (children?: CategoryResponse[]) => {
    children?.forEach((child) => {
      ids.add(child.categoryId);
      walk(child.children);
    });
  };
  walk(node.children);
  return ids;
}

// ── Helper ─────────────────────────────────────────────────
function IconPreview({ iconName }: { iconName: string }) {
  const Icon = (LucideIcons as any)[iconName] as LucideIcon;
  if (!Icon) return null;
  return <Icon size={20} className="text-gray-600" />;
}

export default function CategoryFormModal({ initial, categories, onClose, onSaved }: CategoryFormModalProps) {
  const [form, setForm] = useState<CategoryRequest>({
    categoryName: initial?.categoryName ?? '',
    parentCategoryId: initial?.parentCategoryId ?? null,
    description: initial?.description ?? '',
    iconName: initial?.iconName ?? '',
    displayOrder: initial?.displayOrder ?? 0,
    isActive: initial?.isActive ?? true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const parentOptions = useMemo(() => {
    const flat = flattenCategories(categories);
    if (!initial) return flat;

    const self = flat.find((item) => item.categoryId === initial.categoryId);
    if (!self) return flat;

    const blocked = collectDescendantIds(self);
    blocked.add(initial.categoryId);
    return flat.filter((item) => !blocked.has(item.categoryId));
  }, [categories, initial]);

  const imagePreview = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return initial?.imageUrl ?? null;
  }, [file, initial?.imageUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.categoryName.trim()) {
      toast.error('Tên danh mục không được để trống');
      return;
    }

    setSaving(true);
    try {
      const payload: CategoryRequest = {
        ...form,
        categoryName: form.categoryName.trim(),
        parentCategoryId: form.parentCategoryId || null,
        description: form.description?.trim() || '',
      };

      const saved = initial
        ? await categoryService.updateCategory(initial.categoryId, payload, file)
        : await categoryService.createCategory(payload, file);

      toast.success(initial ? 'Cập nhật danh mục thành công' : 'Tạo danh mục thành công');
      onSaved(saved);
    } catch (err) {
      toast.error(apiErrMsg(err, initial ? 'Cập nhật thất bại' : 'Tạo mới thất bại'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <FolderTree size={18} className="text-cyan-600" />
            {initial ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormInput
            label="Tên danh mục"
            required
            placeholder="Ví dụ: Laptop"
            value={form.categoryName}
            onChange={(e) => setForm((prev) => ({ ...prev, categoryName: e.target.value }))}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục cha</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.parentCategoryId ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    parentCategoryId: e.target.value || null,
                  }))
                }
              >
                <option value="">-- Danh mục gốc --</option>
                {parentOptions.map((item) => (
                  <option key={item.categoryId} value={item.categoryId}>
                    {item.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <FormInput
              label="Thứ tự hiển thị"
              type="number"
              value={String(form.displayOrder ?? 0)}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  displayOrder: Number(e.target.value || 0),
                }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <FormInput
              label="Lucide Icon Name"
              placeholder="Vd: Laptop, Home, ShoppingBag..."
              value={form.iconName ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, iconName: e.target.value }))}
            />
            {form.iconName && (
              <div className="flex items-center gap-3 p-2.5 border border-gray-100 rounded-lg bg-gray-50 h-[42px]">
                <span className="text-xs text-gray-500">Xem trước:</span>
                <IconPreview iconName={form.iconName} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 min-h-[90px]"
              placeholder="Mô tả ngắn cho danh mục"
              value={form.description ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isActive"
              type="checkbox"
              checked={Boolean(form.isActive)}
              onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Kích hoạt danh mục
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ảnh danh mục</label>
            <label className="flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
              <ImagePlus size={16} />
              Chọn ảnh (tuỳ chọn)
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>

            {imagePreview && (
              <div className="mt-3">
                <img src={imagePreview} alt="Preview" className="w-28 h-28 rounded-lg object-cover border border-gray-200" />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm rounded-lg bg-cyan-500 text-white font-semibold hover:bg-cyan-600 disabled:opacity-60 transition-colors flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {initial ? 'Lưu thay đổi' : 'Tạo danh mục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
