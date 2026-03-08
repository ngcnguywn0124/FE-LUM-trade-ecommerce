'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import { Loader2, Plus, SlidersHorizontal, Tags } from 'lucide-react';
import { toast } from 'sonner';

import type {
  CategoryResponse,
  ProductAttributeRequest,
  ProductAttributeResponse,
  TagRequest,
  TagResponse,
} from '@/types/admin';
import * as categoryService from '@/services/categoryService';
import * as tagService from '@/services/tagService';
import * as attributeService from '@/services/productAttributeService';

import SectionCard from './components/shared/SectionCard';
import SearchInput from './components/shared/SearchInput';
import ConfirmDeleteModal from './components/shared/ConfirmDeleteModal';
import TagTable from './components/TagTable';
import TagFormModal from './components/TagFormModal';
import AttributeTable from './components/AttributeTable';
import AttributeFormModal from './components/AttributeFormModal';

interface CategoryOption {
  categoryId: string;
  categoryName: string;
  depth: number;
}

function apiErrMsg(err: unknown, fallback: string) {
  if (err instanceof AxiosError) return err.response?.data?.message ?? fallback;
  return fallback;
}

function flattenCategories(tree: CategoryResponse[]): CategoryOption[] {
  const result: CategoryOption[] = [];

  const walk = (items: CategoryResponse[], depth = 0) => {
    items.forEach((item) => {
      result.push({
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        depth,
      });
      if (item.children?.length) {
        walk(item.children, depth + 1);
      }
    });
  };

  walk(tree);
  return result;
}

export default function ProductMetaManagePage() {
  const [loading, setLoading] = useState(true);

  // Categories / attributes state
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [attributes, setAttributes] = useState<ProductAttributeResponse[]>([]);
  const [attributesLoading, setAttributesLoading] = useState(false);

  // Tags state
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [tagKeyword, setTagKeyword] = useState('');
  const [tagsLoading, setTagsLoading] = useState(false);

  // Modal state
  const [tagModal, setTagModal] = useState<{ open: boolean; data: TagResponse | null }>({
    open: false,
    data: null,
  });
  const [attributeModal, setAttributeModal] = useState<{
    open: boolean;
    data: ProductAttributeResponse | null;
  }>({
    open: false,
    data: null,
  });

  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteState, setDeleteState] = useState<
    | { type: 'tag'; data: TagResponse }
    | { type: 'attribute'; data: ProductAttributeResponse }
    | null
  >(null);

  const selectedCategoryName = useMemo(() => {
    if (!selectedCategoryId) return '';
    return categoryOptions.find((c) => c.categoryId === selectedCategoryId)?.categoryName ?? '';
  }, [categoryOptions, selectedCategoryId]);

  const loadTags = useCallback(async (keyword?: string) => {
    setTagsLoading(true);
    try {
      const data = await tagService.getTags(keyword);
      setTags(data);
    } catch {
      toast.error('Không thể tải danh sách tags');
    } finally {
      setTagsLoading(false);
    }
  }, []);

  const loadAttributes = useCallback(async (categoryId: string) => {
    if (!categoryId) {
      setAttributes([]);
      return;
    }
    setAttributesLoading(true);
    try {
      const data = await attributeService.getAttributesByCategory(categoryId);
      setAttributes(data);
    } catch {
      toast.error('Không thể tải danh sách thuộc tính');
    } finally {
      setAttributesLoading(false);
    }
  }, []);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    try {
      const [tree, initialTags] = await Promise.all([
        categoryService.getCategoryTree(),
        tagService.getTags(),
      ]);

      const options = flattenCategories(tree);
      setCategoryOptions(options);
      setTags(initialTags);

      if (options.length > 0) {
        const firstCategoryId = options[0].categoryId;
        setSelectedCategoryId(firstCategoryId);
        const attrs = await attributeService.getAttributesByCategory(firstCategoryId);
        setAttributes(attrs);
      }
    } catch {
      toast.error('Không thể tải dữ liệu quản trị thông số / tags');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  useEffect(() => {
    const trimmed = tagKeyword.trim();
    const timeout = setTimeout(() => {
      loadTags(trimmed || undefined);
    }, 300);

    return () => clearTimeout(timeout);
  }, [tagKeyword, loadTags]);

  async function handleSaveTag(payload: TagRequest) {
    setSaving(true);
    try {
      if (tagModal.data) {
        await tagService.updateTag(tagModal.data.tagId, payload);
        toast.success('Cập nhật tag thành công');
      } else {
        await tagService.createTag(payload);
        toast.success('Tạo tag thành công');
      }
      setTagModal({ open: false, data: null });
      await loadTags(tagKeyword.trim() || undefined);
    } catch (err) {
      toast.error(apiErrMsg(err, 'Lưu tag thất bại'));
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAttribute(payload: ProductAttributeRequest) {
    setSaving(true);
    try {
      if (attributeModal.data) {
        await attributeService.updateAttribute(attributeModal.data.attributeId, payload);
        toast.success('Cập nhật thuộc tính thành công');
      } else {
        await attributeService.createAttribute(payload);
        toast.success('Tạo thuộc tính thành công');
      }
      setAttributeModal({ open: false, data: null });
      await loadAttributes(selectedCategoryId);
    } catch (err) {
      toast.error(apiErrMsg(err, 'Lưu thuộc tính thất bại'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteState) return;
    setDeleteLoading(true);
    try {
      if (deleteState.type === 'tag') {
        await tagService.deleteTag(deleteState.data.tagId);
        toast.success('Xóa tag thành công');
        await loadTags(tagKeyword.trim() || undefined);
      } else {
        await attributeService.deleteAttribute(deleteState.data.attributeId);
        toast.success('Xóa thuộc tính thành công');
        await loadAttributes(selectedCategoryId);
      }
      setDeleteState(null);
    } catch (err) {
      toast.error(apiErrMsg(err, 'Xóa thất bại'));
    } finally {
      setDeleteLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center gap-3 text-gray-500">
        <Loader2 size={22} className="animate-spin" />
        <span className="text-sm">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <SectionCard
        title="Quản lý Tags"
        subtitle="Từ khóa gắn cho bài đăng, hỗ trợ tìm kiếm và gợi ý nhanh"
        action={
          <button
            onClick={() => setTagModal({ open: true, data: null })}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold bg-cyan-600 text-white hover:bg-cyan-700"
          >
            <Plus size={15} />
            Thêm tag
          </button>
        }
      >
        <div className="space-y-4">
          <SearchInput
            placeholder="Tìm theo tên tag..."
            value={tagKeyword}
            onChange={setTagKeyword}
          />

          {tagsLoading ? (
            <div className="h-24 flex items-center justify-center text-gray-500 gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Đang tải tags...</span>
            </div>
          ) : (
            <TagTable
              data={tags}
              onEdit={(tag) => setTagModal({ open: true, data: tag })}
              onDelete={(tag) => setDeleteState({ type: 'tag', data: tag })}
            />
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Quản lý Thuộc tính theo Danh mục"
        subtitle="Định nghĩa trường động cho form đăng sản phẩm"
        action={
          <button
            onClick={() => setAttributeModal({ open: true, data: null })}
            disabled={!selectedCategoryId}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            <Plus size={15} />
            Thêm thuộc tính
          </button>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-3 items-center">
            <select
              value={selectedCategoryId}
              onChange={async (e) => {
                const nextId = e.target.value;
                setSelectedCategoryId(nextId);
                await loadAttributes(nextId);
              }}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {categoryOptions.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {'— '.repeat(cat.depth)}{cat.categoryName}
                </option>
              ))}
            </select>

            <div className="text-sm text-gray-500 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-emerald-600" />
              {selectedCategoryName || 'Chọn danh mục để quản lý thuộc tính'}
            </div>
          </div>

          {attributesLoading ? (
            <div className="h-24 flex items-center justify-center text-gray-500 gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Đang tải thuộc tính...</span>
            </div>
          ) : (
            <AttributeTable
              data={attributes}
              onEdit={(item) => setAttributeModal({ open: true, data: item })}
              onDelete={(item) => setDeleteState({ type: 'attribute', data: item })}
            />
          )}
        </div>
      </SectionCard>

      {tagModal.open ? (
        <TagFormModal
          initial={tagModal.data}
          loading={saving}
          onClose={() => setTagModal({ open: false, data: null })}
          onSubmit={handleSaveTag}
        />
      ) : null}

      {attributeModal.open ? (
        <AttributeFormModal
          initial={attributeModal.data}
          categories={categoryOptions}
          fixedCategoryId={!attributeModal.data ? selectedCategoryId : undefined}
          loading={saving}
          onClose={() => setAttributeModal({ open: false, data: null })}
          onSubmit={handleSaveAttribute}
        />
      ) : null}

      {deleteState ? (
        <ConfirmDeleteModal
          title={
            deleteState.type === 'tag'
              ? 'Xóa tag'
              : 'Xóa thuộc tính'
          }
          description={
            deleteState.type === 'tag'
              ? `Bạn có chắc muốn xóa tag "${deleteState.data.tagName}"?`
              : `Bạn có chắc muốn xóa thuộc tính "${deleteState.data.attributeName}"?`
          }
          loading={deleteLoading}
          onCancel={() => setDeleteState(null)}
          onConfirm={handleDelete}
        />
      ) : null}
    </div>
  );
}
