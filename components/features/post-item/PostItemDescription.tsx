import { Info } from 'lucide-react';
import PostItemSection from './PostItemSection';
import { PostItemErrors, PostItemFormData } from '../../../types/post';
import RichTextEditor from '@/components/shared/RichTextEditor';

interface PostItemDescriptionProps {
  formData: PostItemFormData;
  errors: PostItemErrors;
  onFieldChange: <K extends keyof PostItemFormData>(field: K, value: PostItemFormData[K]) => void;
}

const PostItemDescription = ({ formData, errors, onFieldChange }: PostItemDescriptionProps) => {
  return (
    <PostItemSection
      title="Mô tả chi tiết"
      description="Mô tả càng chi tiết, người mua càng tin tưởng và ít đặt câu hỏi hơn"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="post-description" className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung mô tả <span className="text-red-500">*</span>
          </label>
          
          <RichTextEditor
            value={formData.description}
            onChange={(val) => onFieldChange('description', val)}
            placeholder="Ví dụ: Sản phẩm mình mua từ tháng 1, còn đầy đủ hộp và bảo hành. Máy dùng mượt, không lỗi lầm, có xước dăm nhẹ ở mặt lưng..."
            error={errors.description}
          />

          <div className="mt-2 flex items-center justify-between text-xs">
            {errors.description ? (
              <span className="text-red-500 font-medium flex items-center gap-1 leading-none">
                <Info size={14} />
                {errors.description}
              </span>
            ) : (
                <span className="text-gray-400">Tối thiểu 30 ký tự, tối đa 3000 ký tự</span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-blue-50 bg-blue-50/50 p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Gợi ý nội dung</p>
              <ul className="mt-1.5 space-y-1 text-xs text-blue-600/80 list-disc list-inside leading-relaxed">
                <li>Tình trạng sử dụng (mới dùng, dùng lâu, hỏng nhẹ...)</li>
                <li>Lý do bán (không dùng tới, lên đời máy mới...)</li>
                <li>Thời gian bảo hành, phụ kiện đi kèm</li>
                <li>Ưu tiên giao dịch ở đâu, lúc nào</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PostItemSection>
  );
};

export default PostItemDescription;
