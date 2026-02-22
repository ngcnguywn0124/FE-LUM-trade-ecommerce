import { CircleDollarSign, Gift, Info, Check } from 'lucide-react';
import PostItemSection from './PostItemSection';
import { PostItemErrors, PostItemFormData } from '../../../types/post';

interface PostItemPricingProps {
  formData: PostItemFormData;
  errors: PostItemErrors;
  onFieldChange: <K extends keyof PostItemFormData>(field: K, value: PostItemFormData[K]) => void;
}

const PostItemPricing = ({ formData, errors, onFieldChange }: PostItemPricingProps) => {
  const onToggleFree = (free: boolean) => {
    onFieldChange('isFree', free);
    onFieldChange('price', free ? '0' : '');
    if (free) onFieldChange('negotiable', false);
  };

  return (
    <PostItemSection
      title="Giá bán"
      description="Đặt giá hợp lý giúp tin đăng nhận được nhiều quan tâm hơn"
    >
      <div className="space-y-6">
        {/* Hình thức đăng tin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 tracking-wider">
            Hình thức <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onToggleFree(false)}
              className={`flex items-center justify-center gap-2.5 rounded-lg border py-3.5 text-sm font-medium transition-all cursor-pointer ${
                !formData.isFree
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <CircleDollarSign size={18} className={!formData.isFree ? 'text-emerald-600' : 'text-gray-400'} />
              Đăng bán
            </button>
            <button
              type="button"
              onClick={() => onToggleFree(true)}
              className={`flex items-center justify-center gap-2.5 rounded-lg border py-3.5 text-sm font-medium transition-all cursor-pointer ${
                formData.isFree
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Gift size={18} className={formData.isFree ? 'text-emerald-600' : 'text-gray-400'} />
              Tặng miễn phí
            </button>
          </div>
        </div>

        {!formData.isFree ? (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="post-price" className="block text-sm font-medium text-gray-700 mb-2 tracking-wider">
                  Giá muốn bán <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    id="post-price"
                    value={formData.price}
                    onChange={(event) => {
                      const value = event.target.value.replace(/[^\d]/g, "");
                      onFieldChange("price", value);
                    }}
                    placeholder="Ví dụ: 50.000"
                    className={`w-full rounded-lg border bg-white px-4 py-3.5 text-base font-medium text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                      errors.price ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                    }`}
                    inputMode="numeric"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <span className="h-4 w-px bg-gray-200" />
                    <span className="text-sm font-bold text-gray-400 group-focus-within:text-emerald-600">VNĐ</span>
                  </div>
                </div>
                
                {errors.price && (
                  <p className="mt-2 text-[12px] text-red-500 font-bold flex items-center gap-1 px-0.5 animate-in fade-in">
                    <Info size={14} />
                    {errors.price}
                  </p>
                )}
              </div>

              <div className="flex flex-col justify-end">
                <label className={`flex h-[54px] items-center gap-3 rounded-lg border px-4 cursor-pointer transition-all ${
                  formData.negotiable 
                    ? 'border-emerald-500 bg-emerald-50/50' 
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}>
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.negotiable}
                      onChange={(event) => onFieldChange("negotiable", event.target.checked)}
                      className="peer h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer appearance-none checked:bg-emerald-600 checked:border-emerald-600 border-2"
                    />
                    <Check size={14} className="absolute left-0.75 top-0.75 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className={`text-sm font-semibold ${formData.negotiable ? 'text-emerald-700' : 'text-gray-600'}`}>
                    Có thương lượng (giá thương lượng)
                  </span>
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-4 animate-in fade-in slide-in-from-top-1">
            <div className="mt-0.5 rounded-full bg-emerald-100 p-1 text-emerald-600">
              <Info size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Chế độ Tặng miễn phí</p>
              <p className="text-xs text-emerald-600/80 mt-1 leading-relaxed">
                Hệ thống sẽ tự động đặt giá là <span className="font-bold">0đ</span> và hiển thị nhãn <span className="font-bold">"Cho tặng"</span> trên tin đăng của bạn.
              </p>
            </div>
          </div>
        )}
      </div>
    </PostItemSection>
  );
};

export default PostItemPricing;
