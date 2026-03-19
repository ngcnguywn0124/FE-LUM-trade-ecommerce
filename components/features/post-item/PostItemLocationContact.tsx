import { useEffect, useMemo, useState } from 'react';
import PostItemSection from './PostItemSection';
import { PostItemErrors, PostItemFormData, TransactionType } from '../../../types/post';
import CustomSelect from '@/components/shared/CustomSelect';
import { getUniversities } from '@/services/universityService';
import type { UniversityResponse } from '@/types/admin';

interface PostItemLocationContactProps {
  formData: PostItemFormData;
  errors: PostItemErrors;
  onFieldChange: <K extends keyof PostItemFormData>(field: K, value: PostItemFormData[K]) => void;
}

const PostItemLocationContact = ({ formData, errors, onFieldChange }: PostItemLocationContactProps) => {
  const [universities, setUniversities] = useState<UniversityResponse[]>([]);

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const data = await getUniversities();
        setUniversities(data);
      } catch {
        setUniversities([]);
      }
    };

    loadUniversities();
  }, []);

  const selectedSchool = useMemo(
    () => universities.find((school) => school.universityId === formData.schoolId),
    [universities, formData.schoolId],
  );
  const campuses = selectedSchool?.campuses || [];
  const transactionTypeOptions = [
    { id: 'meetup', name: 'Gặp mặt trực tiếp' },
    { id: 'delivery', name: 'Giao hàng (Đang phát triển)' },
    { id: 'both', name: 'Cả hai hình thức (Đang phát triển)' },
  ];
  // Note: CustomSelect should respect disabled options or filter selectable to 'meetup' only
  // For now, only 'meetup' will be selectable due to prefill, others shown as info

  return (
    <PostItemSection
      title="Địa điểm & liên hệ"
      description="Thông tin rõ ràng giúp người mua yên tâm trao đổi và hẹn gặp"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trường học <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              value={formData.schoolId}
              options={universities.map((s) => ({
                id: s.universityId,
                name: s.shortName || s.universityName,
              }))}
              onChange={(value) => {
                onFieldChange('schoolId', value);
                onFieldChange('campusId', '');
              }}
              placeholder="Chọn trường học"
              error={errors.schoolId}
            />
            {errors.schoolId && <p className="mt-1 text-xs text-red-500 font-medium">{errors.schoolId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cơ sở <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              value={formData.campusId}
              options={campuses.map((c) => ({ id: c.campusId, name: c.campusName }))}
              onChange={(value) => onFieldChange('campusId', value)}
              disabled={!formData.schoolId}
              placeholder="Chọn cơ sở"
              disabledPlaceholder="Chọn trường trước"
              error={errors.campusId}
            />
            {errors.campusId && <p className="mt-1 text-xs text-red-500 font-medium">{errors.campusId}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình thức giao dịch <span className="text-red-500">*</span>
            </label>
            <div className="space-y-1">
              <CustomSelect
                value={formData.transactionType}
                options={[{ id: 'meetup', name: 'Gặp mặt trực tiếp' }]}
                onChange={(value) => {
                  onFieldChange('transactionType', value as TransactionType);
                }}
                placeholder="Chọn hình thức"
                error={errors.transactionType}
              />
              <p className="text-xs text-gray-500 italic">
                📢 Tạm thời chỉ hỗ trợ giao dịch trực tiếp. Giao hàng &amp; kết hợp đang phát triển.
              </p>
            </div>
            {errors.transactionType && <p className="mt-1 text-xs text-red-500 font-medium">{errors.transactionType}</p>}
          </div>

          <div className={formData.transactionType === 'delivery' ? 'opacity-50 pointer-events-none' : ''}>
            <label htmlFor="post-meeting-point" className="block text-sm font-medium text-gray-700 mb-2">
              Điểm hẹn giao dịch <span className="text-red-500">*</span>
            </label>
            <input
              id="post-meeting-point"
              value={formData.meetingPoint}
              onChange={(event) => onFieldChange('meetingPoint', event.target.value)}
              disabled={formData.transactionType === 'delivery'}
              placeholder={formData.transactionType === 'delivery' ? "Không cần điểm hẹn khi giao hàng" : "Ví dụ: Cổng B thư viện, CS Ung Văn Khiêm"}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
            />
            {errors.meetingPoint && formData.transactionType !== 'delivery' && (
              <p className="mt-1 text-xs text-red-500 font-medium">{errors.meetingPoint}</p>
            )}
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
