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
  const contactMethodLabel = {
    phone: 'Gọi điện thoại',
    zalo: 'Zalo',
    chat: 'Chat trong app',
  }[formData.contactMethod];
  const transactionTypeLabel = {
    meetup: 'Gặp mặt trực tiếp',
    delivery: 'Giao hàng',
    both: 'Cả gặp mặt & giao hàng',
  }[formData.transactionType];
  const specFields = getTechnicalSpecsByCategory(formData.categoryId);
  const technicalSpecEntries = formData.technicalSpecs
    .map((item) => {
      const field = specFields.find((f) => f.key === item.key);
      return { label: field?.label || item.key, value: item.value };
    })
    .filter((field) => field.value.trim().length > 0 && field.label);

  return (
    <aside className={`rounded-2xl border border-gray-200 bg-white p-5 ${inModal ? '' : 'lg:sticky lg:top-24'}`}>
      <h3 className="text-base font-bold text-gray-900">Xem trước tin đăng</h3>

      <div className="mt-4 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
        {formData.imagePreviews[0] ? (
          <Image
            src={formData.imagePreviews[0]}
            alt="Ảnh bìa sản phẩm"
            width={720}
            height={256}
            unoptimized
            className="h-64 w-full object-fill"
          />
        ) : (
          <div className="h-64 w-full flex items-center justify-center text-sm text-gray-500">
            Chưa có ảnh bìa
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {formData.title || 'Tiêu đề sản phẩm của bạn'}
        </h4>
        <p className="text-xl font-bold text-emerald-700">{formatCurrency(formData.price, formData.isFree)}</p>
        {formData.negotiable && !formData.isFree ? (
          <p className="text-xs font-medium text-emerald-600">Có thể thương lượng</p>
        ) : null}
        <p className="text-sm text-gray-500">
          {category?.name || 'Danh mục'}
          {subcategory ? ` • ${subcategory.name}` : ''}
        </p>
        <p className="text-sm text-gray-500">
          {school?.name || 'Trường học'}
          {campus ? ` • ${campus.name}` : ''}
        </p>
        <p className="text-sm text-gray-500">Điểm hẹn: {formData.meetingPoint || 'Chưa cập nhật'}</p>
        <p className="text-sm text-gray-500">Hình thức giao dịch: {transactionTypeLabel || 'Chưa cập nhật'}</p>
        <p className="text-sm text-gray-500">Liên hệ: {formData.contactName || 'Chưa cập nhật'}</p>
        <p className="text-sm text-gray-500">Ưu tiên: {contactMethodLabel || 'Chưa cập nhật'}</p>
        {formData.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {formData.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {technicalSpecEntries.length > 0 ? (
        <div className="mt-4 rounded-xl border border-gray-200 p-3">
          <p className="text-xs font-semibold text-gray-700">Thông số kỹ thuật</p>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {technicalSpecEntries.map((spec) => (
              <p key={spec.label} className="text-xs text-gray-600">
                <span className="font-medium text-gray-700">{spec.label}:</span> {spec.value}
              </p>
            ))}
          </div>
        </div>
      ) : null}

      {(formData.zaloLink || formData.facebookLink) && (
        <div className="mt-4 rounded-xl border border-gray-200 p-3 text-xs text-gray-600 space-y-1">
          <p className="font-semibold text-gray-700">Liên kết liên hệ</p>
          {formData.zaloLink ? <p>Zalo: {formData.zaloLink}</p> : null}
          {formData.facebookLink ? <p>Facebook: {formData.facebookLink}</p> : null}
        </div>
      )}

      <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
        <p className="text-xs font-medium text-emerald-800">Mẹo tăng tương tác</p>
        <ul className="mt-2 space-y-1 text-xs text-emerald-700">
          <li>• Ảnh đầu tiên nên chụp toàn bộ sản phẩm.</li>
          <li>• Tiêu đề nên có tên + tình trạng + thông số chính.</li>
          <li>• Mô tả rõ lỗi nhỏ giúp tăng độ tin cậy.</li>
        </ul>
      </div>
    </aside>
  );
};

export default PostItemPreview;
