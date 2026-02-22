'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Eye, X } from 'lucide-react';
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
  isFree: false,
  negotiable: false,
  tags: [],
  description: '',
  technicalSpecs: [],
  schoolId: '',
  campusId: '',
  meetingPoint: '',
  transactionType: 'meetup',
  contactName: '',
  contactPhone: '',
  zaloLink: '',
  facebookLink: '',
  imagePreviews: [],
};

const PostItemPage = () => {
  const [formData, setFormData] = useState<PostItemFormData>(initialFormData);
  const [errors, setErrors] = useState<PostItemErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const previewUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    previewUrlsRef.current = formData.imagePreviews;
  }, [formData.imagePreviews]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isPreviewOpen ? 'hidden' : 'unset';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPreviewOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPreviewOpen(false);
      }
    };

    if (isPreviewOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isPreviewOpen]);

  const completionPercent = useMemo(() => {
    const checks = [
      formData.title.trim().length >= 10,
      !!formData.categoryId,
      !!formData.subcategoryId,
      formData.isFree || Number(formData.price) > 0,
      formData.description.trim().length >= 30,
      !!formData.schoolId,
      !!formData.campusId,
      formData.meetingPoint.trim().length >= 5,
      !!formData.transactionType,
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
    if (!formData.isFree && (!formData.price || Number.isNaN(priceValue) || priceValue <= 0)) {
      nextErrors.price = 'Giá bán phải lớn hơn 0.';
    }

    if (!formData.transactionType) {
      nextErrors.transactionType = 'Vui lòng chọn hình thức giao dịch.';
    }

    if (formData.description.trim().length < 30) {
      nextErrors.description = 'Mô tả cần ít nhất 30 ký tự.';
    }

    if (!formData.schoolId) nextErrors.schoolId = 'Vui lòng chọn trường học.';
    if (!formData.campusId) nextErrors.campusId = 'Vui lòng chọn cơ sở.';
    if (formData.meetingPoint.trim().length < 5) {
      nextErrors.meetingPoint = 'Vui lòng nhập điểm hẹn cụ thể (ít nhất 5 ký tự).';
    }
    if (!formData.contactName.trim()) nextErrors.contactName = 'Vui lòng nhập tên liên hệ.';
    if (!/^\d{10,11}$/.test(formData.contactPhone)) {
      nextErrors.contactPhone = 'Số điện thoại phải gồm 10-11 chữ số.';
    }

    if (formData.zaloLink && !/^https?:\/\/.+/.test(formData.zaloLink.trim())) {
      nextErrors.zaloLink = 'Link Zalo phải bắt đầu bằng http:// hoặc https://';
    }

    if (formData.facebookLink && !/^https?:\/\/.+/.test(formData.facebookLink.trim())) {
      nextErrors.facebookLink = 'Link Facebook phải bắt đầu bằng http:// hoặc https://';
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

        <form onSubmit={onSubmit} className="mx-auto max-w-4xl space-y-6">
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
                  onClick={() => setIsPreviewOpen(true)}
                  className="px-6 py-3.5 rounded-lg border border-emerald-500 text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-sm active:scale-95"
                >
                  <Eye size={18} />
                  Xem trước tin đăng
                </button>
                <button
                  type="button"
                  className="px-6 py-3.5 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer shadow-sm active:scale-95"
                  onClick={() => {
                    formData.imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
                    setFormData(initialFormData);
                    setErrors({});
                    setIsSubmitted(false);
                  }}
                >
                  Xóa hết làm lại
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-3.5 rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 transition-all cursor-pointer shadow-md shadow-emerald-200 active:scale-95"
                >
                  {isSubmitting ? 'Đang xử lý...' : 'ĐĂNG TIN NGAY'}
                </button>
              </div>
            </div>
        </form>
      </div>

      {isPreviewOpen ? (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsPreviewOpen(false)} />
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              aria-label="Đóng xem trước"
            >
              <X size={18} />
            </button>
            <PostItemPreview formData={formData} inModal />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PostItemPage;
