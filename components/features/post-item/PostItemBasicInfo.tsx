import { KeyboardEvent, useState } from 'react';
import { Plus, X, Info } from 'lucide-react';
import { mockCategories, getSubcategoriesByCategory, getTechnicalSpecsByCategory } from '@/lib/categoriesData';
import PostItemSection from './PostItemSection';
import { PostItemErrors, PostItemFormData } from '../../../types/post';

interface PostItemBasicInfoProps {
  formData: PostItemFormData;
  errors: PostItemErrors;
  onFieldChange: <K extends keyof PostItemFormData>(field: K, value: PostItemFormData[K]) => void;
}

const conditionOptions = [
  { value: 'new', label: 'Mới 100%' },
  { value: 'like-new', label: 'Như mới' },
  { value: 'used', label: 'Đã qua sử dụng' },
] as const;

const PostItemBasicInfo = ({ formData, errors, onFieldChange }: PostItemBasicInfoProps) => {
  const [tagInput, setTagInput] = useState('');
  const selectedCategory = mockCategories.find((category) => category.id === formData.categoryId);
  const subcategories = selectedCategory ? getSubcategoriesByCategory(selectedCategory.id) : [];
  const technicalSpecs = getTechnicalSpecsByCategory(formData.categoryId);

  const addSpec = () => {
    onFieldChange('technicalSpecs', [
      ...formData.technicalSpecs,
      { key: '', value: '' },
    ]);
  };

  const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
    const nextSpecs = [...formData.technicalSpecs];
    nextSpecs[index] = { ...nextSpecs[index], [field]: value };
    onFieldChange('technicalSpecs', nextSpecs);
  };

  const removeSpec = (index: number) => {
    onFieldChange(
      'technicalSpecs',
      formData.technicalSpecs.filter((_, i) => i !== index)
    );
  };

  const pushTag = (rawValue: string) => {
    const nextTag = rawValue.trim().replace(/\s+/g, ' ');
    if (!nextTag) return;
    if (formData.tags.some((tag) => tag.toLowerCase() === nextTag.toLowerCase())) {
      setTagInput('');
      return;
    }
    onFieldChange('tags', [...formData.tags, nextTag]);
    setTagInput('');
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' && event.key !== ',') return;
    event.preventDefault();
    pushTag(tagInput);
  };

  const onTagBlur = () => {
    pushTag(tagInput);
  };

  const removeTag = (tagToRemove: string) => {
    onFieldChange(
      'tags',
      formData.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <PostItemSection
      title="Thông tin sản phẩm"
      description="Điền chính xác để người mua dễ tìm thấy tin của bạn hơn"
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="post-title" className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề tin <span className="text-red-500">*</span>
          </label>
          <input
            id="post-title"
            value={formData.title}
            onChange={(event) => onFieldChange('title', event.target.value)}
            placeholder="Ví dụ: Laptop Dell Inspiron i5, RAM 8GB, còn bảo hành"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            maxLength={120}
          />
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-red-500">{errors.title}</span>
            <span className="text-gray-400">{formData.title.length}/120</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="post-category" className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              id="post-category"
              value={formData.categoryId}
              onChange={(event) => {
                onFieldChange('categoryId', event.target.value);
                onFieldChange('subcategoryId', '');
                onFieldChange('technicalSpecs', []);
              }}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="">Chọn danh mục</option>
              {mockCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>
          </div>

          <div>
            <label htmlFor="post-subcategory" className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục con <span className="text-red-500">*</span>
            </label>
            <select
              id="post-subcategory"
              value={formData.subcategoryId}
              onChange={(event) => onFieldChange('subcategoryId', event.target.value)}
              disabled={!formData.categoryId}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="">{formData.categoryId ? 'Chọn danh mục con' : 'Chọn danh mục trước'}</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-red-500">{errors.subcategoryId}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Tình trạng sản phẩm</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {conditionOptions.map((option) => {
              const isActive = formData.condition === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onFieldChange('condition', option.value)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-300 text-gray-700 hover:border-emerald-400'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="post-tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags nổi bật
          </label>
          <div className="rounded-xl border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
                    aria-label={`Xóa tag ${tag}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                id="post-tags"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={onTagBlur}
                placeholder="Ví dụ: kèm phụ kiện, còn hộp..."
                className="min-w-45 flex-1 border-none bg-transparent py-1 text-sm text-gray-900 outline-none"
                maxLength={30}
              />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">Nhấn Enter hoặc dấu phẩy để thêm tag.</p>
        </div>

        {technicalSpecs.length > 0 ? (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Thông số kỹ thuật</p>
                <p className="text-xs text-gray-400">Chọn và nhập thông số để người mua tin tưởng hơn</p>
              </div>
              {formData.technicalSpecs.length < technicalSpecs.length ? (
                <button
                  type="button"
                  onClick={addSpec}
                  className="flex items-center gap-1 rounded-lg border border-emerald-500 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-600 transition-all hover:bg-emerald-50 cursor-pointer"
                >
                  <Plus size={14} />
                  Thêm
                </button>
              ) : null}
            </div>

            <div className="space-y-4">
              {formData.technicalSpecs.map((item, index) => {
                const usedKeys = formData.technicalSpecs
                  .map((s, i) => (i === index ? "" : s.key))
                  .filter(Boolean);
                const availableSpecs = technicalSpecs.filter((s) => !usedKeys.includes(s.key));
                const currentField = technicalSpecs.find((f) => f.key === item.key);

                return (
                  <div key={index} className="flex flex-col sm:flex-row gap-3 items-start animate-in fade-in slide-in-from-top-2">
                    <div className="w-full sm:w-1/3">
                      <select
                        value={item.key}
                        onChange={(e) => updateSpec(index, "key", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer bg-gray-50 font-medium"
                      >
                        <option value="">Chọn thông số</option>
                        {availableSpecs.map((field) => (
                          <option key={field.key} value={field.key}>
                            {field.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="relative w-full sm:flex-1">
                      <input
                        value={item.value}
                        onChange={(e) => updateSpec(index, "value", e.target.value)}
                        placeholder={currentField?.placeholder || "Nhập giá trị..."}
                        disabled={!item.key}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:opacity-50"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="mt-2 sm:mt-0 p-3 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all cursor-pointer"
                      aria-label="Xóa"
                    >
                      <X size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        <div>
          <label htmlFor="post-description" className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả chi tiết <span className="text-red-500">*</span>
          </label>
          <textarea
            id="post-description"
            value={formData.description}
            onChange={(event) => onFieldChange('description', event.target.value)}
            placeholder="Mô tả rõ tình trạng, thông số, phụ kiện đi kèm, lý do bán..."
            rows={5}
            maxLength={1200}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-red-500">{errors.description}</span>
            <span className="text-gray-400">{formData.description.length}/1200</span>
          </div>
        </div>
      </div>
    </PostItemSection>
  );
};

export default PostItemBasicInfo;
