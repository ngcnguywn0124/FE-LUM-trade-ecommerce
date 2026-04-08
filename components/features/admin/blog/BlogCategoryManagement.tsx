'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Edit3, Plus, Search, ShieldCheck, Tag, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import Breadcrumb from '@/components/shared/Breadcrumb';
import {
  createBlogCategory,
  deleteBlogCategory,
  getBlogCategoriesForAdmin,
  updateBlogCategory,
} from '@/services/blogService';
import { BlogCategory, BlogCategoryPayload } from '@/types/blog';

const initialPayload: BlogCategoryPayload = {
  name: '',
  description: '',
  isActive: true,
};

export default function BlogCategoryManagement() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [formData, setFormData] = useState<BlogCategoryPayload>(initialPayload);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBlogCategoriesForAdmin({ keyword: keyword || undefined });
      setCategories(data);
    } catch (error) {
      toast.error('Không thể tải danh mục blog');
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchCategories]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData(initialPayload);
    setIsModalOpen(true);
  };

  const openEditModal = (category: BlogCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData(initialPayload);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name?.trim()) {
      toast.error('Tên danh mục blog là bắt buộc');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
      };

      if (editingCategory?.blogCategoryId) {
        await updateBlogCategory(editingCategory.blogCategoryId, payload);
        toast.success('Cập nhật danh mục blog thành công');
      } else {
        await createBlogCategory(payload);
        toast.success('Tạo danh mục blog thành công');
      }

      closeModal();
      await fetchCategories();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lưu danh mục blog thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category: BlogCategory) => {
    if (!window.confirm(`Bạn có chắc muốn xóa danh mục "${category.name}"?`)) return;

    try {
      await deleteBlogCategory(category.blogCategoryId);
      toast.success('Xóa danh mục blog thành công');
      await fetchCategories();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Xóa danh mục blog thất bại');
    }
  };

  const stats = useMemo(() => {
    const total = categories.length;
    const active = categories.filter((item) => item.isActive).length;
    return { total, active };
  }, [categories]);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto min-h-screen font-inter">
      <Breadcrumb
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Quản lý Blog', href: '/admin/blog' },
          { label: 'Danh mục Blog', href: '/admin/blog/categories' },
        ]}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={26} />
            Quản lý Danh mục Blog
          </h1>
          <p className="text-sm text-gray-500 mt-1">Tạo và quản lý chuyên mục cho bài viết Blog</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl text-emerald-700 flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">{stats.active}/{stats.total} đang hoạt động</span>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-emerald-600 border border-emerald-600 px-4 py-2 rounded-xl text-white flex items-center gap-2 hover:bg-emerald-700 transition shadow-sm"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">Thêm danh mục</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm theo tên danh mục..."
          className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {keyword && (
          <button
            onClick={() => setKeyword('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Tên danh mục</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td colSpan={4} className="px-6 py-6"><div className="h-8 bg-gray-100 rounded-lg" /></td>
                </tr>
              ))
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">Không có danh mục blog</td>
              </tr>
            ) : (
              categories.map((item) => (
                <tr key={item.blogCategoryId} className="hover:bg-gray-50/70">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-emerald-500" />
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description || 'Không có mô tả'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {item.isActive ? 'Hoạt động' : 'Ẩn'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                        title="Sửa"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingCategory ? 'Cập nhật danh mục blog' : 'Tạo danh mục blog'}
              </h3>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên danh mục</label>
                <input
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Ví dụ: Chia sẻ kinh nghiệm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Mô tả ngắn cho danh mục"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={!!formData.isActive}
                  onChange={(event) => setFormData((prev) => ({ ...prev, isActive: event.target.checked }))}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                Kích hoạt danh mục
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {submitting ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
