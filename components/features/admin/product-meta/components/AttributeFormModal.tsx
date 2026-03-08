'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, SlidersHorizontal } from 'lucide-react';
import type {
  AttributeType,
  ProductAttributeRequest,
  ProductAttributeResponse,
} from '@/types/admin';

interface CategoryOption {
  categoryId: string;
  categoryName: string;
  depth: number;
}

interface AttributeFormModalProps {
  initial: ProductAttributeResponse | null;
  categories: CategoryOption[];
  fixedCategoryId?: string;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: ProductAttributeRequest) => Promise<void>;
}

const ATTRIBUTE_TYPES: Array<{ value: AttributeType; label: string }> = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'select', label: 'Select' },
];

export default function AttributeFormModal({
  initial,
  categories,
  fixedCategoryId,
  loading = false,
  onClose,
  onSubmit,
}: AttributeFormModalProps) {
  const [categoryId, setCategoryId] = useState('');
  const [attributeName, setAttributeName] = useState('');
  const [attributeType, setAttributeType] = useState<AttributeType>('text');
  const [isRequired, setIsRequired] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [optionsText, setOptionsText] = useState('');

  useEffect(() => {
    setCategoryId(initial?.categoryId ?? fixedCategoryId ?? categories[0]?.categoryId ?? '');
    setAttributeName(initial?.attributeName ?? '');
    setAttributeType(initial?.attributeType ?? 'text');
    setIsRequired(initial?.isRequired ?? false);
    setDisplayOrder(initial?.displayOrder ?? 0);
    setOptionsText(initial?.options?.join('\n') ?? '');
  }, [categories, fixedCategoryId, initial]);

  const isSelect = attributeType === 'select';

  const parsedOptions = useMemo(
    () =>
      optionsText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    [optionsText],
  );

  const canSubmit = useMemo(() => {
    if (!categoryId || !attributeName.trim()) return false;
    if (isSelect && parsedOptions.length < 2) return false;
    return true;
  }, [attributeName, categoryId, isSelect, parsedOptions.length]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    await onSubmit({
      categoryId,
      attributeName: attributeName.trim(),
      attributeType,
      isRequired,
      displayOrder,
      options: isSelect ? parsedOptions : undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <SlidersHorizontal size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {initial ? 'Cập nhật thuộc tính' : 'Tạo thuộc tính mới'}
            </h3>
            <p className="text-sm text-gray-500">Thiết kế form nhập liệu động theo danh mục.</p>
          </div>
        </div>

        <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={Boolean(fixedCategoryId)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-gray-100"
              required
            >
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {'— '.repeat(cat.depth)}{cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tên thuộc tính <span className="text-red-500">*</span>
            </label>
            <input
              value={attributeName}
              onChange={(e) => setAttributeName(e.target.value)}
              maxLength={100}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Ví dụ: RAM, Màu sắc..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Kiểu dữ liệu <span className="text-red-500">*</span>
            </label>
            <select
              value={attributeType}
              onChange={(e) => setAttributeType(e.target.value as AttributeType)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            >
              {ATTRIBUTE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự hiển thị</label>
            <input
              type="number"
              min={0}
              max={9999}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value || 0))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="rounded border-gray-300"
              />
              Bắt buộc nhập
            </label>
          </div>

          {isSelect ? (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Danh sách lựa chọn (mỗi dòng 1 giá trị, tối thiểu 2 dòng)
              </label>
              <textarea
                rows={5}
                value={optionsText}
                onChange={(e) => setOptionsText(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder={'Mới\nNhư mới\nĐã dùng'}
              />
              <p className="text-xs mt-1.5 text-gray-500">
                Đã nhận diện: <span className="font-semibold">{parsedOptions.length}</span> lựa chọn
              </p>
            </div>
          ) : null}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-60"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            {initial ? 'Lưu thay đổi' : 'Tạo mới'}
          </button>
        </div>
      </form>
    </div>
  );
}
