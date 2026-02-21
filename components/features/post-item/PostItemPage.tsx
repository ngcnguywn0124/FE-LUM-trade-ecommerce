'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import PostItemBasicInfo from './PostItemBasicInfo';
import PostItemImagePicker from './PostItemImagePicker';
import PostItemLocationContact from './PostItemLocationContact';
import PostItemPreview from './PostItemPreview';
import PostItemPricing from './PostItemPricing';
import { PostItemErrors, PostItemFormData } from '../../../types/post';

const initialFormData: PostItemFormData = {
  title: '',
  categoryId: '',
  subcategoryId: '',
  condition: 'like-new',
  price: '',
  negotiable: false,
  description: '',
  schoolId: '',
  campusId: '',
  contactName: '',
  contactPhone: '',
  imagePreviews: [],
};

const PostItemPage = () => {
  const [formData, setFormData] = useState<PostItemFormData>(initialFormData);
  const [errors, setErrors] = useState<PostItemErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const previewUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    previewUrlsRef.current = formData.imagePreviews;
  }, [formData.imagePreviews]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  const completionPercent = useMemo(() => {
    const checks = [
      formData.title.trim().length >= 10,
      !!formData.categoryId,
      !!formData.subcategoryId,
      Number(formData.price) > 0,
      formData.description.trim().length >= 30,
      !!formData.schoolId,
      !!formData.campusId,
      formData.contactName.trim().length > 0,
      /^\d{10,11}$/.test(formData.contactPhone),
      formData.imagePreviews.length > 0,
    ];

    const passed = checks.filter(Boolean).length;
    return Math.round((passed / checks.length) * 100);
  }, [formData]);

  const onFieldChange = <K extends keyof PostItemFormData>(field: K, value: PostItemFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setIsSubmitted(false);
  };

  const onAddImages = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const availableSlots = 8 - formData.imagePreviews.length;
    const nextFiles = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, Math.max(availableSlots, 0));

    if (nextFiles.length === 0) {
      setErrors((prev) => ({ ...prev, imagePreviews: 'Bạn chỉ có thể đăng tối đa 8 ảnh.' }));
      return;
    }

    const nextPreviews = nextFiles.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      imagePreviews: [...prev.imagePreviews, ...nextPreviews],
    }));

    setErrors((prev) => ({ ...prev, imagePreviews: undefined }));
    setIsSubmitted(false);
  };

  const onRemoveImage = (index: number) => {
    setFormData((prev) => {
      const target = prev.imagePreviews[index];
      if (target) URL.revokeObjectURL(target);
      return {
        ...prev,
        imagePreviews: prev.imagePreviews.filter((_, currentIndex) => currentIndex !== index),
      };
    });
  };

  const validateForm = () => {
    const nextErrors: PostItemErrors = {};

    if (formData.title.trim().length < 10) nextErrors.title = 'Tiêu đề cần ít nhất 10 ký tự.';
    if (!formData.categoryId) nextErrors.categoryId = 'Vui lòng chọn danh mục.';
    if (!formData.subcategoryId) nextErrors.subcategoryId = 'Vui lòng chọn danh mục con.';

    const priceValue = Number(formData.price);
    if (!formData.price || Number.isNaN(priceValue) || priceValue <= 0) {
      nextErrors.price = 'Giá bán phải lớn hơn 0.';
    }

    if (formData.description.trim().length < 30) {
      nextErrors.description = 'Mô tả cần ít nhất 30 ký tự.';
    }

    if (!formData.schoolId) nextErrors.schoolId = 'Vui lòng chọn trường học.';
    if (!formData.campusId) nextErrors.campusId = 'Vui lòng chọn cơ sở.';
    if (!formData.contactName.trim()) nextErrors.contactName = 'Vui lòng nhập tên liên hệ.';
    if (!/^\d{10,11}$/.test(formData.contactPhone)) {
      nextErrors.contactPhone = 'Số điện thoại phải gồm 10-11 chữ số.';
    }

    if (formData.imagePreviews.length === 0) {
      nextErrors.imagePreviews = 'Bạn cần thêm ít nhất 1 ảnh.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      setIsSubmitted(false);
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Đăng tin' }]} />

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Đăng tin bán đồ</h1>
              <p className="mt-1 text-sm text-gray-500">
                Điền đầy đủ thông tin để bài đăng hiển thị đẹp và tăng tỷ lệ chốt đơn.
              </p>
            </div>
            <div className="w-full sm:w-64">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Mức độ hoàn thiện</span>
                <span>{completionPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${completionPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-2">
            <PostItemImagePicker
              imagePreviews={formData.imagePreviews}
              error={errors.imagePreviews}
              onAddImages={onAddImages}
              onRemoveImage={onRemoveImage}
            />
            <PostItemBasicInfo formData={formData} errors={errors} onFieldChange={onFieldChange} />
            <PostItemPricing formData={formData} errors={errors} onFieldChange={onFieldChange} />
            <PostItemLocationContact formData={formData} errors={errors} onFieldChange={onFieldChange} />

            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              {isSubmitted ? (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle2 size={18} />
                  Tin của bạn đã sẵn sàng để gửi lên hệ thống kiểm duyệt.
                </div>
              ) : null}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  className="px-5 py-3 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    formData.imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
                    setFormData(initialFormData);
                    setErrors({});
                    setIsSubmitted(false);
                  }}
                >
                  Đặt lại form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors cursor-pointer"
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Đăng tin ngay'}
                </button>
              </div>
            </div>
          </div>

          <div>
            <PostItemPreview formData={formData} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostItemPage;
