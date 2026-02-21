import { getCampusesBySchool, mockSchools } from '@/lib/categoriesData';
import PostItemSection from './PostItemSection';
import { PostItemErrors, PostItemFormData } from '../../../types/post';

interface PostItemLocationContactProps {
  formData: PostItemFormData;
  errors: PostItemErrors;
  onFieldChange: <K extends keyof PostItemFormData>(field: K, value: PostItemFormData[K]) => void;
}

const PostItemLocationContact = ({ formData, errors, onFieldChange }: PostItemLocationContactProps) => {
  const selectedSchool = mockSchools.find((school) => school.id === formData.schoolId);
  const campuses = selectedSchool ? getCampusesBySchool(selectedSchool.id) : [];

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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="">Chọn trường học</option>
              {mockSchools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-red-500">{errors.schoolId}</p>
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="">{formData.schoolId ? 'Chọn cơ sở' : 'Chọn trường trước'}</option>
              {campuses.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-red-500">{errors.campusId}</p>
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="mt-1 text-xs text-red-500">{errors.contactName}</p>
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              inputMode="numeric"
            />
            <p className="mt-1 text-xs text-red-500">{errors.contactPhone}</p>
          </div>
        </div>
      </div>
    </PostItemSection>
  );
};

export default PostItemLocationContact;
