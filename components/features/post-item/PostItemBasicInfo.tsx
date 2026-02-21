import { mockCategories, getSubcategoriesByCategory } from '@/lib/categoriesData';
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
  const selectedCategory = mockCategories.find((category) => category.id === formData.categoryId);
  const subcategories = selectedCategory ? getSubcategoriesByCategory(selectedCategory.id) : [];

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
