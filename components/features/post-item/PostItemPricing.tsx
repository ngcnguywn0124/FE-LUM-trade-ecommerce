import PostItemSection from './PostItemSection';
import { PostItemErrors, PostItemFormData } from '../../../types/post';

interface PostItemPricingProps {
  formData: PostItemFormData;
  errors: PostItemErrors;
  onFieldChange: <K extends keyof PostItemFormData>(field: K, value: PostItemFormData[K]) => void;
}

const PostItemPricing = ({ formData, errors, onFieldChange }: PostItemPricingProps) => {
  return (
    <PostItemSection
      title="Giá bán"
      description="Đặt giá hợp lý giúp tin đăng nhận được nhiều quan tâm hơn"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="post-price" className="block text-sm font-medium text-gray-700 mb-2">
            Giá mong muốn <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="post-price"
              value={formData.price}
              onChange={(event) => {
                const value = event.target.value.replace(/[^\d]/g, '');
                onFieldChange('price', value);
              }}
              placeholder="Ví dụ: 2500000"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              inputMode="numeric"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">VNĐ</span>
          </div>
          <p className="mt-1 text-xs text-red-500">{errors.price}</p>
        </div>

        <div className="flex items-end">
          <label className="flex w-full items-center gap-3 rounded-xl border border-gray-300 px-4 py-3 cursor-pointer hover:border-emerald-400 transition-colors">
            <input
              type="checkbox"
              checked={formData.negotiable}
              onChange={(event) => onFieldChange('negotiable', event.target.checked)}
              className="h-4 w-4 accent-emerald-600"
            />
            <span className="text-sm text-gray-700">Có thể thương lượng</span>
          </label>
        </div>
      </div>
    </PostItemSection>
  );
};

export default PostItemPricing;
