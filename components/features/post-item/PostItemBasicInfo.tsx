import { Plus, X, Info, BadgeCheck, Check } from 'lucide-react';
import { mockCategories, getSubcategoriesByCategory, getTechnicalSpecsByCategory, getBadgeInfoByCategory } from '@/lib/categoriesData';
import PostItemSection from './PostItemSection';
import { PostItemErrors, PostItemFormData } from '../../../types/post';
import { useMemo } from 'react';
import CustomSelect from '@/components/shared/CustomSelect';

interface PostItemBasicInfoProps {
  formData: PostItemFormData;
  errors: PostItemErrors;
  onFieldChange: <K extends keyof PostItemFormData>(field: K, value: PostItemFormData[K]) => void;
}

const conditionOptions = [
  { value: 'new', label: 'Mới 100%', sub: 'Chưa bóc hộp' },
  { value: 'like-new', label: 'Như mới 99%', sub: 'Cực đẹp' },
  { value: 'used', label: 'Đã qua sử dụng', sub: 'Bình thường' },
  { value: 'old', label: 'Cũ/vẫn dùng tốt', sub: 'Có trầy xước' },
  { value: 'broken', label: 'Hỏng / Lấy linh kiện', sub: 'Chỉ lấy xác' },
] as const;

const PostItemBasicInfo = ({ formData, errors, onFieldChange }: PostItemBasicInfoProps) => {
  const selectedCategory = mockCategories.find((category) => category.id === formData.categoryId);
  const subcategories = selectedCategory ? getSubcategoriesByCategory(selectedCategory.id) : [];
  const technicalSpecs = getTechnicalSpecsByCategory(formData.categoryId);
  const badgeInfo = getBadgeInfoByCategory(formData.categoryId);

  const subcategorySpecs = useMemo(() => 
    subcategories.map(s => ({ id: s.id, name: s.name })), 
    [subcategories]
  );

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

  const toggleBadgeInfo = (info: string) => {
    const isSelected = formData.tags.includes(info);
    if (isSelected) {
      onFieldChange('tags', formData.tags.filter(t => t !== info));
    } else if (formData.tags.length < 3) {
      onFieldChange('tags', [...formData.tags, info]);
    }
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
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            maxLength={120}
          />
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-red-500 font-medium">{errors.title}</span>
            <span className="text-gray-400">{formData.title.length}/120</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              value={formData.categoryId}
              options={mockCategories.map(c => ({ id: c.id, name: c.name }))}
              onChange={(value) => {
                onFieldChange('categoryId', value);
                onFieldChange('subcategoryId', '');
                onFieldChange('technicalSpecs', []);
              }}
              placeholder="Chọn danh mục"
              error={errors.categoryId}
            />
            {errors.categoryId && <p className="mt-1 text-xs text-red-500 font-medium">{errors.categoryId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục con <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              value={formData.subcategoryId}
              options={subcategorySpecs}
              onChange={(value) => onFieldChange('subcategoryId', value)}
              disabled={!formData.categoryId}
              placeholder="Chọn danh mục con"
              disabledPlaceholder="Chọn danh mục trước"
              error={errors.subcategoryId}
            />
            {errors.subcategoryId && <p className="mt-1 text-xs text-red-500 font-medium">{errors.subcategoryId}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 tracking-wider">
            Tình trạng sản phẩm <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-2.5">
            {conditionOptions.map((option) => {
              const isActive = formData.condition === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onFieldChange('condition', option.value)}
                  className={`relative flex flex-col items-center justify-center rounded-lg border py-3.5 px-2 transition-all cursor-pointer group ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-emerald-300 hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-[13px] font-bold tracking-tight ${isActive ? 'text-emerald-700' : 'text-gray-700 group-hover:text-emerald-600'}`}>
                    {option.label}
                  </span>
                  <span className={`mt-1 text-[10px] font-semibold opacity-60 ${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'}`}>
                    {option.sub}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.condition && <p className="mt-2 text-[12px] font-semibold text-red-500 flex items-center gap-1">
            <Info size={14} />
            {errors.condition}
          </p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center justify-between mb-3">
            <span className="tracking-wider font-medium">Thông tin highlight</span>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Tối đa 3</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {badgeInfo.map((info) => {
              const isSelected = formData.tags.includes(info);
              const isMax = formData.tags.length >= 3;
              return (
                <button
                  key={info}
                  type="button"
                  onClick={() => toggleBadgeInfo(info)}
                  disabled={!isSelected && isMax}
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {isSelected && <Check size={14} className="mr-1.5" />}
                  {info}
                </button>
              );
            })}
          </div>
          {formData.tags.length >= 3 && (
            <p className="mt-2 text-[11px] text-amber-600 font-medium flex items-center gap-1">
              <Info size={12} /> Đã chọn tối đa thông tin đính kèm
            </p>
          )}
        </div>

        {technicalSpecs.length > 0 ? (
          <div className="pt-2">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-2">
              <div>
                <p className="text-sm font-bold text-gray-800 uppercase tracking-tight">Thông số kỹ thuật</p>
                <p className="text-[11px] text-gray-500 mt-0.5 font-medium">Chọn các thông số quan trọng của sản phẩm</p>
              </div>
              {formData.technicalSpecs.length < technicalSpecs.length ? (
                <button
                  type="button"
                  onClick={addSpec}
                  className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3.5 py-2 text-xs text-[#FFBA00] hover:bg-emerald-600 cursor-pointer"
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
                  <div key={index} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50/50 rounded-lg border border-gray-100 animate-in fade-in slide-in-from-top-2">
                    <div className="w-[120px] sm:w-1/3 shrink-0">
                      <CustomSelect
                        value={item.key}
                        options={availableSpecs.map(s => ({ id: s.key, name: s.label }))}
                        onChange={(value) => updateSpec(index, "key", value)}
                        placeholder="Thông số"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        value={item.value}
                        onChange={(e) => updateSpec(index, "value", e.target.value)}
                        placeholder={currentField?.placeholder || "Nhập giá trị..."}
                        disabled={!item.key}
                        className="w-full rounded-lg border border-gray-200 px-2.5 sm:px-4 py-2.5 text-[13px] sm:text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:text-gray-400 transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="p-1.5 sm:p-2.5 text-red-500 hover:text-red-700 cursor-pointer transition-colors shrink-0"
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
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <div className="mt-1 flex items-center justify-between text-[11px] font-medium">
            <span className="text-red-500">{errors.description}</span>
            <span className={`px-2 py-0.5 rounded-full ${formData.description.length > 1000 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'}`}>
              {formData.description.length}/1200
            </span>
          </div>
        </div>
      </div>
    </PostItemSection>
  );
};

export default PostItemBasicInfo;
