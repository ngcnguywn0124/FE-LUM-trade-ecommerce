import { getCampusesBySchool, getCategoryById, getSchoolById, getSubcategoriesByCategory } from '@/lib/categoriesData';
import Image from 'next/image';
import { PostItemFormData } from '../../../types/post';

interface PostItemPreviewProps {
  formData: PostItemFormData;
}

const formatCurrency = (price: string) => {
  if (!price) return 'Thỏa thuận';
  return `${Number(price).toLocaleString('vi-VN')}đ`;
};

const PostItemPreview = ({ formData }: PostItemPreviewProps) => {
  const category = getCategoryById(formData.categoryId);
  const subcategory = getSubcategoriesByCategory(formData.categoryId).find((item) => item.id === formData.subcategoryId);
  const school = getSchoolById(formData.schoolId);
  const campus = getCampusesBySchool(formData.schoolId).find((item) => item.id === formData.campusId);

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-5 lg:sticky lg:top-24">
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
        <p className="text-xl font-bold text-emerald-700">{formatCurrency(formData.price)}</p>
        <p className="text-sm text-gray-500">
          {category?.name || 'Danh mục'}
          {subcategory ? ` • ${subcategory.name}` : ''}
        </p>
        <p className="text-sm text-gray-500">
          {school?.name || 'Trường học'}
          {campus ? ` • ${campus.name}` : ''}
        </p>
        <p className="text-sm text-gray-500">Liên hệ: {formData.contactName || 'Chưa cập nhật'}</p>
      </div>

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
