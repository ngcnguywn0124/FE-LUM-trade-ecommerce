import {
  getCampusesBySchool,
  getCategoryById,
  getSchoolById,
  getSubcategoriesByCategory,
  getTechnicalSpecsByCategory,
} from '@/lib/categoriesData';
import Image from 'next/image';
import { PostItemFormData } from '../../../types/post';

interface PostItemPreviewProps {
  formData: PostItemFormData;
  inModal?: boolean;
}

const formatCurrency = (price: string, isFree: boolean) => {
  if (isFree) return 'Cho tặng miễn phí';
  if (!price) return 'Thỏa thuận';
  return `${Number(price).toLocaleString('vi-VN')}đ`;
};

const PostItemPreview = ({ formData, inModal = false }: PostItemPreviewProps) => {
  const category = getCategoryById(formData.categoryId);
  const subcategory = getSubcategoriesByCategory(formData.categoryId).find((item) => item.id === formData.subcategoryId);
  const school = getSchoolById(formData.schoolId);
  const campus = getCampusesBySchool(formData.schoolId).find((item) => item.id === formData.campusId);

  const conditionLabel = {
    new: 'Mới 100%',
    'like_new': 'Như mới 99%',
    used: 'Đã qua sử dụng',
    old: 'Cũ - vẫn tốt',
    broken: 'Hỏng / Linh kiện',
  }[formData.condition] || 'Chưa chọn';

  const transactionTypeLabel = {
    meetup: 'Gặp mặt trực tiếp',
    delivery: 'Giao hàng',
    both: 'Cả gặp mặt & giao hàng',
  }[formData.transactionType] || 'Chưa cập nhật';

  const specFields = getTechnicalSpecsByCategory(formData.categoryId);
  const technicalSpecEntries = formData.technicalSpecs
    .map((item) => {
      const field = specFields.find((f) => f.key === item.key);
      return { label: field?.label || item.key, value: item.value };
    })
    .filter((field) => field.value.trim().length > 0 && field.label);

  return (
    <aside className={`${inModal ? 'px-4 py-5' : 'rounded-2xl border border-gray-200 bg-white flex flex-col lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)]'}`}>
      {!inModal && (
        <div className="p-5 border-b border-gray-100 shrink-0">
          <h3 className="text-base font-bold text-gray-900">Xem trước tin đăng</h3>
        </div>
      )}

      <div className={`[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full ${inModal ? '' : 'overflow-y-auto p-5 pt-4'}`}>
        <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200 aspect-video relative">
          {formData.imagePreviews[0] ? (
            <>
              <Image
                src={formData.imagePreviews[0]}
                alt="Ảnh bìa sản phẩm"
                fill
                unoptimized
                className="object-contain"
              />
              {formData.imagePreviews.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full font-medium">
                  +{formData.imagePreviews.length - 1} ảnh khác
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
              Chưa có ảnh bìa
            </div>
          )}
        </div>

        <div className="mt-4 space-y-1.5">
          <h4 className="text-base font-semibold text-gray-900 line-clamp-2">
            {formData.title || 'Tiêu đề sản phẩm của bạn'}
          </h4>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold text-emerald-700">{formatCurrency(formData.price, formData.isFree)}</p>
            {formData.negotiable && !formData.isFree && (
              <span className="text-xs font-medium text-gray-500">· Có thể thương lượng</span>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-gray-200 p-3">
          <p className="text-xs font-semibold text-gray-700 mb-2.5">Thông tin sản phẩm</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
            <InfoItem label="Danh mục" value={category?.name} />
            <InfoItem label="Danh mục con" value={subcategory?.name} />
            <InfoItem label="Trường" value={school?.name} />
            <InfoItem label="Cơ sở" value={campus?.name} />
            <InfoItem label="Tình trạng" value={conditionLabel} />
            <InfoItem label="Giao dịch" value={transactionTypeLabel} />
            <InfoItem label="Thời hạn tin" value={`${formData.expiryDays} ngày`} />
          </div>
        </div>

        {technicalSpecEntries.length > 0 && (
          <div className="mt-4 rounded-xl border border-gray-200 p-3">
            <p className="text-xs font-semibold text-gray-700 mb-2.5">Thông số kỹ thuật</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
              {technicalSpecEntries.map((spec) => (
                <InfoItem key={spec.label} label={spec.label} value={spec.value} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-gray-200 p-3">
          <p className="text-xs font-semibold text-gray-700 mb-2.5">Thông tin liên hệ</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
            <div className="col-span-2">
              <InfoItem label="Điểm hẹn" value={formData.meetingPoint} />
            </div>
            <InfoItem label="Người đăng" value={formData.contactName} />
            <InfoItem label="Số điện thoại" value={formData.contactPhone} />
            <InfoItem label="Zalo" value={formData.zaloLink} />
            <InfoItem label="Facebook" value={formData.facebookLink} />
          </div>
        </div>

        {formData.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {formData.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600 border border-gray-200">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-700 mb-1.5">Mô tả chi tiết</p>
          <div className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 rounded-lg p-3 border border-gray-100 min-h-[60px]">
            {formData.description || 'Chưa có mô tả chi tiết...'}
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
          <p className="text-xs font-medium text-emerald-800">Mẹo tăng tương tác</p>
          <ul className="mt-1.5 space-y-1 text-xs text-emerald-700">
            <li>• Ảnh đầu tiên nên chụp toàn bộ sản phẩm.</li>
            <li>• Tiêu đề nên có tên + tình trạng + thông số chính.</li>
            <li>• Mô tả rõ lỗi nhỏ giúp tăng độ tin cậy.</li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

const InfoItem = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-gray-500 mb-0.5">{label}</p>
    <p className="font-medium text-gray-700 break-words line-clamp-2" title={value}>{value || 'Chưa cập nhật'}</p>
  </div>
);

export default PostItemPreview;
