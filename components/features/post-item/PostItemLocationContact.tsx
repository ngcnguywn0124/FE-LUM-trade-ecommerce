import { getCampusesBySchool, mockSchools } from '@/lib/categoriesData';
import PostItemSection from './PostItemSection';
import { PostItemErrors, PostItemFormData, TransactionType } from '../../../types/post';

interface PostItemLocationContactProps {
  formData: PostItemFormData;
  errors: PostItemErrors;
  onFieldChange: <K extends keyof PostItemFormData>(field: K, value: PostItemFormData[K]) => void;
}

const PostItemLocationContact = ({ formData, errors, onFieldChange }: PostItemLocationContactProps) => {
  const selectedSchool = mockSchools.find((school) => school.id === formData.schoolId);
  const campuses = selectedSchool ? getCampusesBySchool(selectedSchool.id) : [];
  const transactionTypeOptions: { value: TransactionType; label: string }[] = [
    { value: 'meetup', label: 'Gặp mặt trực tiếp' },
    { value: 'delivery', label: 'Giao hàng' },
    { value: 'both', label: 'Cả hai hình thức' },
  ];

  return (
    <PostItemSection
      title="Địa điểm & liên hệ"
      description="Thông tin rõ ràng giúp người mua yên tâm trao đổi và hẹn gặp"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="post-school" className="block text-sm font-medium text-gray-700 mb-2">
              Trường học <span className="text-red-500">*</span>
            </label>
            <select
              id="post-school"
              value={formData.schoolId}
              onChange={(event) => {
                onFieldChange('schoolId', event.target.value);
                onFieldChange('campusId', '');
              }}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer bg-white"
            >
              <option value="">Chọn trường học</option>
              {mockSchools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
            {errors.schoolId && <p className="mt-1 text-xs text-red-500 font-medium">{errors.schoolId}</p>}
          </div>

          <div>
            <label htmlFor="post-campus" className="block text-sm font-medium text-gray-700 mb-2">
              Cơ sở <span className="text-red-500">*</span>
            </label>
            <select
              id="post-campus"
              value={formData.campusId}
              onChange={(event) => onFieldChange('campusId', event.target.value)}
              disabled={!formData.schoolId}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 disabled:bg-gray-50 disabled:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer bg-white"
            >
              <option value="">{formData.schoolId ? 'Chọn cơ sở' : 'Chọn trường trước'}</option>
              {campuses.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
                </option>
              ))}
            </select>
            {errors.campusId && <p className="mt-1 text-xs text-red-500 font-medium">{errors.campusId}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="post-meeting-point" className="block text-sm font-medium text-gray-700 mb-2">
              Điểm hẹn giao dịch <span className="text-red-500">*</span>
            </label>
            <input
              id="post-meeting-point"
              value={formData.meetingPoint}
              onChange={(event) => onFieldChange('meetingPoint', event.target.value)}
              placeholder="Ví dụ: Cổng B thư viện, CS Ung Văn Khiêm"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            {errors.meetingPoint && <p className="mt-1 text-xs text-red-500 font-medium">{errors.meetingPoint}</p>}
          </div>

          <div>
            <label htmlFor="post-transaction-type" className="block text-sm font-medium text-gray-700 mb-2">
              Hình thức giao dịch <span className="text-red-500">*</span>
            </label>
            <select
              id="post-transaction-type"
              value={formData.transactionType}
              onChange={(event) => onFieldChange('transactionType', event.target.value as TransactionType)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer bg-white"
            >
              {transactionTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.transactionType && <p className="mt-1 text-xs text-red-500 font-medium">{errors.transactionType}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="post-contact-name" className="block text-sm font-medium text-gray-700 mb-2">
              Tên liên hệ <span className="text-red-500">*</span>
            </label>
            <input
              id="post-contact-name"
              value={formData.contactName}
              onChange={(event) => onFieldChange('contactName', event.target.value)}
              placeholder="Ví dụ: Nguyễn Văn A"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            {errors.contactName && <p className="mt-1 text-xs text-red-500 font-medium">{errors.contactName}</p>}
          </div>

          <div>
            <label htmlFor="post-contact-phone" className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              id="post-contact-phone"
              value={formData.contactPhone}
              onChange={(event) => onFieldChange('contactPhone', event.target.value.replace(/[^\d]/g, ''))}
              placeholder="Ví dụ: 0912345678"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              inputMode="numeric"
            />
            {errors.contactPhone && <p className="mt-1 text-xs text-red-500 font-medium">{errors.contactPhone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="post-zalo-link" className="block text-sm font-medium text-gray-700 mb-2">
              Link Zalo (tùy chọn)
            </label>
            <input
              id="post-zalo-link"
              value={formData.zaloLink}
              onChange={(event) => onFieldChange('zaloLink', event.target.value)}
              placeholder="Ví dụ: https://zalo.me/0909xxxxxx"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            {errors.zaloLink && <p className="mt-1 text-xs text-red-500 font-medium">{errors.zaloLink}</p>}
          </div>

          <div>
            <label htmlFor="post-facebook-link" className="block text-sm font-medium text-gray-700 mb-2">
              Link Facebook (tùy chọn)
            </label>
            <input
              id="post-facebook-link"
              value={formData.facebookLink}
              onChange={(event) => onFieldChange('facebookLink', event.target.value)}
              placeholder="Ví dụ: https://facebook.com/username"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            {errors.facebookLink && <p className="mt-1 text-xs text-red-500 font-medium">{errors.facebookLink}</p>}
          </div>
        </div>
      </div>
    </PostItemSection>
  );
};

export default PostItemLocationContact;
