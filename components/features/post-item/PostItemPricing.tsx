import { CircleDollarSign, Gift, Info } from 'lucide-react';
import PostItemSection from './PostItemSection';
import { PostItemErrors, PostItemFormData } from '../../../types/post';

interface PostItemPricingProps {
  formData: PostItemFormData;
  errors: PostItemErrors;
  onFieldChange: <K extends keyof PostItemFormData>(field: K, value: PostItemFormData[K]) => void;
}

const PostItemPricing = ({ formData, errors, onFieldChange }: PostItemPricingProps) => {
  const onToggleFree = (checked: boolean) => {
    onFieldChange('isFree', checked);
    onFieldChange('price', checked ? '0' : '');
    if (checked) onFieldChange('negotiable', false);
  };

  return (
    <PostItemSection
      title="Giá bán"
      description="Đặt giá hợp lý giúp tin đăng nhận được nhiều quan tâm hơn"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => onToggleFree(false)}
            className={`flex-1 flex items-center justify-center gap-3 rounded-xl border-2 px-6 py-3.5 transition-all text-sm font-bold cursor-pointer ${
              !formData.isFree
                ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm"
                : "border-gray-100 bg-white text-gray-400 hover:border-emerald-200 hover:bg-emerald-50/30"
            }`}
          >
            <CircleDollarSign size={20} className={!formData.isFree ? "text-emerald-600" : "text-gray-300"} />
            Đăng bán
          </button>
          <button
            type="button"
            onClick={() => onToggleFree(true)}
            className={`flex-1 flex items-center justify-center gap-3 rounded-xl border-2 px-6 py-3.5 transition-all text-sm font-bold cursor-pointer ${
              formData.isFree
                ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm"
                : "border-gray-100 bg-white text-gray-400 hover:border-emerald-200 hover:bg-emerald-50/30"
            }`}
          >
            <Gift size={20} className={formData.isFree ? "text-emerald-600" : "text-gray-300"} />
            Cho tặng / Miễn phí
          </button>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all ${formData.isFree ? "opacity-50 grayscale pointer-events-none" : ""}`}>
          <div className="space-y-2">
            <label htmlFor="post-price" className="text-sm font-semibold text-gray-700">
              Giá bán <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <input
                id="post-price"
                value={formData.isFree ? "0" : formData.price}
                onChange={(event) => {
                  const value = event.target.value.replace(/[^\d]/g, "");
                  onFieldChange("price", value);
                }}
                placeholder="Ví dụ: 2500000"
                className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 pr-16 text-lg font-bold text-gray-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 group-hover:border-emerald-400"
                inputMode="numeric"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 select-none">VNĐ</span>
            </div>
            {errors.price && <p className="text-xs font-medium text-red-500 pl-1">{errors.price}</p>}
          </div>

          <div className="flex items-center pt-2 sm:pt-8">
            <label className="relative flex cursor-pointer select-none items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 transition-all hover:bg-gray-50 hover:border-emerald-200">
              <div className="relative h-5 w-5 rounded-md border border-gray-300 transition-colors flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={formData.negotiable}
                  onChange={(event) => onFieldChange("negotiable", event.target.checked)}
                  className="peer absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="h-3 w-3 rounded-xs bg-emerald-600 opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm font-medium text-gray-700">Có thể thương lượng thêm</span>
            </label>
          </div>
        </div>

        {formData.isFree && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-xs text-emerald-700 animate-in fade-in slide-in-from-top-2">
            <Info size={16} />
            Hệ thống sẽ mặc định giá bài đăng là "Cho tặng".
          </div>
        )}
      </div>
    </PostItemSection>
  );
};

export default PostItemPricing;
