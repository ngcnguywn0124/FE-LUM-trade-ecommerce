'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Eye, RotateCcw, Send, X } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import PostItemBasicInfo from './PostItemBasicInfo';
import PostItemImagePicker from './PostItemImagePicker';
import PostItemLocationContact from './PostItemLocationContact';
import PostItemPreview from './PostItemPreview';
import PostItemPricing from './PostItemPricing';
import { PostItemErrors, PostItemFormData } from '../../../types/post';
import { createProduct, getProductById, updateProduct } from '@/services/productService';
import { getCategoryById } from '@/services/categoryService';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const initialFormData: PostItemFormData = {
  title: '',
  categoryId: '',
  subcategoryId: '',
  condition: 'like_new',
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
  expiryDays: 30,
};

interface PostItemPageProps {
  productId?: string;
}

const PostItemPage = ({ productId }: PostItemPageProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<PostItemFormData>(initialFormData);
  const [errors, setErrors] = useState<PostItemErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(!!productId);
  const previewUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!productId) return;

    const loadProductData = async () => {
      setIsLoading(true);
      try {
        const data: any = await getProductById(productId);

        if (data.status === 'expired') {
          toast.error('Tin đăng đã hết hạn, vui lòng gia hạn để chỉnh sửa');
          router.push('/quan-ly-tin-dang');
          return;
        }

        // Xác định category cha và con
        let finalCategoryId = '';
        let finalSubcategoryId = '';

        if (data.categoryId) {
          try {
            const categoryDetail = await getCategoryById(data.categoryId);
            if (categoryDetail.parentCategoryId) {
              // Nếu category này có cha, thì nó là subcategory
              finalCategoryId = categoryDetail.parentCategoryId;
              finalSubcategoryId = data.categoryId;
            } else {
              // Nếu category này không có cha, nó là category chính
              finalCategoryId = data.categoryId;
              finalSubcategoryId = '';
            }
          } catch (err) {
            console.error('Failed to fetch category detail:', err);
            finalCategoryId = data.categoryId;
          }
        }

        setFormData({
          title: data.title,
          categoryId: finalCategoryId,
          subcategoryId: finalSubcategoryId,
          condition: data.condition,
          price: data.price?.toString() || '',
          isFree: data.isFree,
          negotiable: data.isNegotiable,
          tags: data.tags?.map((t: any) => t.tagName) || [],
          description: data.description,
          technicalSpecs:
            data.attributeValues?.map((av: any) => ({
              key: av.attributeId,
              value: av.value,
            })) || [],
          schoolId: data.universityId || '',
          campusId: data.campusId || '',
          meetingPoint: data.meetingPoint || '',
          transactionType: data.transactionType || 'meetup',
          contactName: data.contactName || '',
          contactPhone: data.contactPhone || '',
          zaloLink: data.zaloLink || '',
          facebookLink: data.facebookLink || '',
          imagePreviews: data.images.map((img: any) => img.imageUrl),
          expiryDays: data.expiryDays || 30,
        });
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [productId]);

  useEffect(() => {
    previewUrlsRef.current = formData.imagePreviews;
  }, [formData.imagePreviews]);

  useEffect(() => {
    return () => {
      // Chỉ revoke những blob do chúng ta tạo ra (ko phải từ API)
      previewUrlsRef.current.forEach((preview) => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
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
      !!formData.subcategoryId || !!productId, // Cho mẫu chỉnh sửa thì có thể ko chọn lại subcat
      formData.isFree || Number(formData.price) > 0,
      formData.description.trim().length >= 30,
      !!formData.schoolId,
      !!formData.campusId,
      formData.transactionType === 'delivery' || formData.meetingPoint.trim().length >= 5,
      !!formData.transactionType,
      formData.contactName.trim().length > 0,
      /^\d{10,11}$/.test(formData.contactPhone),
      formData.imagePreviews.length > 0,
    ];

    const passed = checks.filter(Boolean).length;
    return Math.round((passed / checks.length) * 100);
  }, [formData, productId]);

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
    setImageFiles((prev) => [...prev, ...nextFiles]);

    setErrors((prev) => ({ ...prev, imagePreviews: undefined }));
    setIsSubmitted(false);
  };

  const onRemoveImage = (index: number) => {
    setFormData((prev) => {
      const target = prev.imagePreviews[index];
      if (target && target.startsWith('blob:')) {
        URL.revokeObjectURL(target);
      }
      return {
        ...prev,
        imagePreviews: prev.imagePreviews.filter((_, currentIndex) => currentIndex !== index),
      };
    });
    // Nếu imageFiles có file ở index tương ứng thì xóa, nhưng cẩn thận logic index vì imageFiles 
    // không chứa danh sách ảnh cũ từ server.
    // Tạm thời chỉ xóa imageFiles nếu index khớp với phần ảnh mới (phụ thuộc vào logic ghép mảng)
    // Nhưng thiết kế hiện tại imagePreviews chứa cả cũ và mới. 
    // Cho đơn giản, khi chỉnh sửa bài đăng, nếu họ xóa ảnh cũ, chúng ta cần cơ chế báo backend xóa.
    // TODO: Cải thiện logic sync ảnh cũ/mới
    setImageFiles((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const validateForm = () => {
    const nextErrors: PostItemErrors = {};

    if (formData.title.trim().length < 10) nextErrors.title = 'Tiêu đề cần ít nhất 10 ký tự.';
    if (!formData.categoryId) nextErrors.categoryId = 'Vui lòng chọn danh mục.';
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

    // Only validate meeting point if it's not strictly 'delivery'
    if (formData.transactionType !== 'delivery') {
      if (formData.meetingPoint.trim().length < 5) {
        nextErrors.meetingPoint = 'Vui lòng nhập điểm hẹn cụ thể (ít nhất 5 ký tự).';
      }
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
    try {
      const payload: any = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        categoryId: formData.subcategoryId || formData.categoryId,
        condition: formData.condition,
        price: formData.isFree ? undefined : Number(formData.price),
        isFree: formData.isFree,
        isNegotiable: formData.negotiable,
        listingType: formData.isFree ? 'exchange' : 'sell',
        transactionType: formData.transactionType,
        meetingPoint: formData.transactionType === 'delivery' ? undefined : formData.meetingPoint,
        universityId: formData.schoolId,
        campusId: formData.campusId,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        expireDays: formData.expiryDays,
        zaloLink: formData.zaloLink || undefined,
        facebookLink: formData.facebookLink || undefined,
        newTagNames: formData.tags,
        attributeValues: formData.technicalSpecs
          .filter((s) => s.key && s.value)
          .map((s) => ({
            attributeId: s.key,
            value: s.value,
          })),
      };

      if (productId) {
        await updateProduct(productId, payload, imageFiles);
      } else {
        await createProduct(payload, imageFiles);
      }

      setIsSubmitted(true);
    } catch {
      setErrors((prev) => ({
        ...prev,
        title: `Không thể ${productId ? 'cập nhật' : 'đăng'} tin. Vui lòng kiểm tra lại dữ liệu và thử lại.`,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Đăng tin' }]} />

        <div className="mx-auto max-w-4xl mb-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {productId ? 'Chỉnh sửa tin đăng' : 'Đăng tin bán đồ'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {productId 
                  ? 'Cập nhật thông tin chi tiết để sản phẩm của bạn thu hút hơn.' 
                  : 'Điền đầy đủ thông tin để bài đăng hiển thị đẹp và tăng tỷ lệ chốt đơn.'}
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

              <div className="grid grid-cols-3 gap-2 sm:flex sm:justify-end sm:gap-4">
                <button
                  type="button"
                  onClick={() => {
                    formData.imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
                    setFormData(initialFormData);
                    setImageFiles([]);
                    setErrors({});
                    setIsSubmitted(false);
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-gray-200 bg-white text-gray-500 sm:flex-row sm:px-6 sm:py-3.5 cursor-pointer"
                >
                  <RotateCcw size={16} />
                  <span className="text-[10px] font-bold sm:text-sm">Đặt lại</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 sm:flex-row sm:px-6 sm:py-3.5 cursor-pointer"
                >
                  <Eye size={16} />
                  <span className="text-[10px] font-bold sm:text-sm">Xem trước</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl bg-emerald-600 text-white disabled:bg-emerald-300 sm:flex-row sm:px-10 sm:py-3.5 cursor-pointer"
                >
                  <Send size={16} />
                  <span className="text-[10px] font-bold sm:text-sm">
                    {isSubmitting 
                      ? (productId ? 'Đang cập nhật' : 'Đang gửi') 
                      : (productId ? 'Cập nhật tin' : 'Đăng tin')}
                  </span>
                </button>
              </div>
            </div>
        </form>
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-white/80">
          <div className="flex flex-col items-center gap-3">
             <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-sm font-medium text-gray-600">Đang tải dữ liệu tin đăng...</p>
          </div>
        </div>
      )}

      {isPreviewOpen ? (
        <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsPreviewOpen(false)} />
          <div className="relative w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl bg-white border border-gray-200 flex flex-col max-h-[92vh] sm:max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 shrink-0">
              <h2 className="text-base font-bold text-gray-900">Xem trước tin đăng</h2>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer transition-colors"
                aria-label="Đóng"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <PostItemPreview formData={formData} inModal />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PostItemPage;
