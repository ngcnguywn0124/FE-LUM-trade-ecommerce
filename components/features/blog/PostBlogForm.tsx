"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Image as ImageIcon, 
  X, 
  Send, 
  Eye, 
  RotateCcw, 
  Sparkles, 
  Tag, 
  FileText, 
  Layout, 
  Search,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  ShoppingBag,
  Leaf,
  GraduationCap,
  TrendingUp,
  Lightbulb,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BlogFormData, BlogErrors } from "@/types/blog";
import { useAuthStore } from "@/stores/authStore";
import { createBlogPost, uploadBlogImage } from "@/services/blogService";
import { Loader2, Crop } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    // eslint-disable-next-line react/display-name
    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
  },
  { ssr: false }
);
import ImageCropModal from "./ImageCropModal";

/* ────────────────────────── Categories ────────────────────────── */
const CATEGORIES = [
  { name: "Mẹo mua bán", slug: "meo-mua-ban", icon: ShoppingBag, color: "#FFBA00" },
  { name: "Sống xanh", slug: "song-xanh", icon: Leaf, color: "#8cceae" },
  { name: "Đời sống SV", slug: "doi-song-sv", icon: GraduationCap, color: "#6C5CE7" },
  { name: "Xu hướng", slug: "xu-huong", icon: TrendingUp, color: "#FF7675" },
  { name: "Chia sẻ kinh nghiệm", slug: "chia-se", icon: Lightbulb, color: "#00B894" },
];

/* ────────────────────────── Animation Variants ────────────────────────── */
const easeOutCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: easeOutCurve },
  }),
};

interface PostBlogFormProps {
  blogId?: string;
  isEdit?: boolean;
}

export default function PostBlogForm({ blogId, isEdit = false }: PostBlogFormProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const quillRef = useRef<any>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    thumbnailPreview: "",
  });
  const [isFetchingData, setIsFetchingData] = useState(isEdit);

  const imageHandler = React.useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
             toast.error("Ảnh không được vượt quá 5MB");
             return;
        }
        const toastId = toast.loading("Đang tải ảnh lên...");
        try {
          const url = await uploadBlogImage(file);
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', url);
          quill.setSelection(range.index + 1);
          toast.success("Tải ảnh lên thành công", { id: toastId });
        } catch (error) {
          toast.error("Lỗi khi tải ảnh", { id: toastId });
        }
      }
    };
  }, []);

  const quillModules = React.useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), [imageHandler]);

  const [errors, setErrors] = useState<BlogErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Crop Modal states
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState("");

  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập để đăng bài viết");
        router.push(`/login?redirect=/admin/blog/${isEdit ? `edit/${blogId}` : 'create'}`);
      } else {
        const hasAdminRole = user?.roles?.some(role => 
          ["ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_MODERATOR"].includes(role)
        );
        if (!hasAdminRole) {
          toast.error("Chỉ quản trị viên mới có thể thực hiện thao tác này");
          router.push("/admin/blog");
        }
      }
    }
  }, [isAuthenticated, isAuthLoading, router, user, isEdit, blogId]);

  useEffect(() => {
    if (isEdit && blogId) {
      const fetchBlogData = async () => {
        try {
          const { getBlogPostById } = await import("@/services/blogService");
          const blog = await getBlogPostById(blogId);
          setFormData({
            title: blog.title,
            category: blog.category,
            excerpt: blog.excerpt,
            content: blog.content,
            thumbnailPreview: blog.thumbnail || (blog as any).thumbnailUrl || "",
          });
        } catch (error) {
          toast.error("Không thể tải thông tin bài viết");
          console.error(error);
        } finally {
          setIsFetchingData(false);
        }
      };
      fetchBlogData();
    }
  }, [isEdit, blogId]);

  const onFieldChange = (field: keyof BlogFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ảnh không được vượt quá 5MB");
        return;
      }
      const preview = URL.createObjectURL(file);
      setTempImageSrc(preview);
      setIsCropModalOpen(true);
      // reset input to allow re-upload if needed
      e.target.value = '';
    }
  };

  const handleCropConfirm = (blob: Blob) => {
    if (formData.thumbnailPreview) {
       URL.revokeObjectURL(formData.thumbnailPreview);
    }
    const finalPreview = URL.createObjectURL(blob);
    const croppedFile = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
    
    setFormData((prev) => ({ ...prev, thumbnail: croppedFile, thumbnailPreview: finalPreview }));
    setErrors((prev) => ({ ...prev, thumbnail: undefined }));
    setIsCropModalOpen(false);
    toast.success("Đã căn chỉnh ảnh bìa thành công!");
  };

  const removeImage = () => {
    if (formData.thumbnailPreview) {
      URL.revokeObjectURL(formData.thumbnailPreview);
    }
    setFormData((prev) => ({ ...prev, thumbnail: undefined, thumbnailPreview: "" }));
  };

  const validateForm = () => {
    const newErrors: BlogErrors = {};
    if (formData.title.trim().length < 10) newErrors.title = "Tiêu đề cần ít nhất 10 ký tự";
    if (!formData.category) newErrors.category = "Vui lòng chọn chuyên mục";
    if (formData.excerpt.trim().length < 20) newErrors.excerpt = "Mô tả ngắn cần ít nhất 20 ký tự";
    if (formData.content.trim().length < 100) newErrors.content = "Nội dung cần ít nhất 100 ký tự";
    if (!formData.thumbnailPreview) newErrors.thumbnail = "Vui lòng tải lên ảnh bìa";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Vui lòng điền đầy đủ thông tin hợp lệ");
      return;
    }

    setIsSubmitting(true);
    try {
      const { createBlogPost, updateBlogPost } = await import("@/services/blogService");
      if (isEdit && blogId) {
        await updateBlogPost(blogId, formData);
        toast.success("Cập nhật bài viết thành công!");
      } else {
        await createBlogPost(formData);
        toast.success("Đăng bài thành công!");
      }
      router.push("/admin/blog");
    } catch (error) {
      toast.error(isEdit ? "Cập nhật bài viết thất bại" : "Đăng bài viết thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || !isAuthenticated || isFetchingData) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#8cceae]" />
        <p className="text-gray-500 font-medium">{isFetchingData ? "Đang tải dữ liệu bài viết..." : "Đang kiểm tra quyền truy cập..."}</p>
      </div>
    );
  }

  const completionPercent = Math.round(
    ([
      formData.title.length >= 10,
      !!formData.category,
      formData.excerpt.length >= 20,
      formData.content.length >= 100,
      !!formData.thumbnailPreview,
    ].filter(Boolean).length / 5) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ────────── Header Section ────────── */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeUp} 
        custom={0}
        className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
            <span className="cursor-pointer hover:text-gray-900" onClick={() => router.push("/admin/blog")}>Quản lý Blog</span>
            <ChevronRight size={14} />
            <span className="text-[#8cceae]">{isEdit ? "Chỉnh sửa bài viết" : "Đăng bài viết mới"}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 flex items-center gap-3">
            {isEdit ? "Cập nhật" : "Sáng tạo"} <span className="text-[#8cceae]">Nội dung</span>
            <Sparkles className="text-[#FFBA00]" size={28} />
          </h1>
          <p className="text-gray-500 mt-2 max-w-xl">
            Chia sẻ kiến thức, kinh nghiệm và những điều thú vị của bạn với cộng đồng sinh viên Lụm.vn.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-full md:w-64">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
            <span>Hoàn thành</span>
            <span className={completionPercent === 100 ? "text-green-500" : "text-gray-900"}>{completionPercent}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#8cceae]" 
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              transition={{ duration: 0.5, ease: easeOutCurve }}
            />
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ────────── Main Editor (Left) ────────── */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeUp} 
          custom={1}
          className="lg:col-span-2 space-y-6"
        >
          {/* Title Input */}
          <div className="bg-white p-1 rounded-2xl border-2 border-transparent focus-within:border-[#8cceae]/30 transition-all shadow-sm">
            <input 
              type="text"
              placeholder="Tiêu đề bài viết ấn tượng..."
              className="w-full px-6 py-5 text-2xl md:text-3xl font-black text-gray-900 outline-none placeholder:text-gray-300"
              value={formData.title}
              onChange={(e) => onFieldChange("title", e.target.value)}
            />
            {errors.title && (
              <p className="px-6 pb-2 text-xs font-bold text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.title}
              </p>
            )}
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-100 [&_.ql-container]:border-none [&_.ql-container]:text-lg [&_.ql-container]:font-inter [&_.ql-editor]:text-gray-800 [&_.ql-editor]:min-h-[500px] [&_.ql-editor.ql-blank::before]:text-gray-400 [&_.ql-editor.ql-blank::before]:not-italic">
            <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 bg-gray-50/50">
              <span className="flex items-center gap-2 text-sm font-bold text-gray-500">
                <FileText size={16} /> Nội dung chi tiết
              </span>
            </div>
            <div className="flex-1 w-full relative">
              <ReactQuill 
                forwardedRef={quillRef}
                theme="snow" 
                value={formData.content} 
                onChange={(val: string) => onFieldChange("content", val)}
                modules={quillModules}
                placeholder="Viết nội dung bài viết và chèn hình ảnh mong muốn..." 
                className="h-[500px] mb-12"
              />
            </div>
            {errors.content && (
              <div className="px-8 py-3 bg-red-50 border-t border-red-100 mt-12">
                <p className="text-xs font-bold text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.content}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* ────────── Sidebar (Right) ────────── */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeUp} 
          custom={2}
          className="space-y-6"
        >
          {/* Cover Image Upload */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
              <ImageIcon size={16} className="text-[#8cceae]" />
              Ảnh bìa bài viết
            </h3>
            
            <div className="relative group">
              {formData.thumbnailPreview ? (
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden group">
                  <Image 
                    src={formData.thumbnailPreview} 
                    alt="Preview" 
                    fill 
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button 
                      onClick={() => {
                        setTempImageSrc(formData.thumbnailPreview || "");
                        setIsCropModalOpen(true);
                      }}
                      className="p-2 bg-white rounded-full text-emerald-600 hover:scale-110 transition-transform"
                      title="Căn chỉnh lại"
                    >
                      <Crop size={18} />
                    </button>
                    <button 
                      onClick={removeImage}
                      className="p-2 bg-red-500 rounded-full text-white hover:scale-110 transition-transform"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`aspect-[16/9] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                    errors.thumbnail ? "border-red-200 bg-red-50/30" : "border-gray-200 hover:border-[#8cceae] hover:bg-gray-50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <ImageIcon size={24} />
                  </div>
                  <p className="text-xs font-bold text-gray-500">Tải lên hoặc kéo thả ảnh</p>
                  <p className="text-[10px] text-gray-400">Định dạng JPG, PNG, WEBP (Max 5MB)</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
            </div>
            {errors.thumbnail && (
              <p className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.thumbnail}
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Tag size={16} className="text-[#8cceae]" />
              Chuyên mục
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = formData.category === cat.name;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => onFieldChange("category", cat.name)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-bold transition-all ${
                      isActive 
                        ? "bg-gray-900 border-gray-900 text-white shadow-md shadow-gray-200 scale-[1.02]" 
                        : "bg-white border-gray-100 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: isActive ? "#ffffff20" : cat.color + "15" }}
                    >
                      <cat.icon size={16} style={{ color: isActive ? "#fff" : cat.color }} />
                    </div>
                    {cat.name}
                    {isActive && <CheckCircle2 size={16} className="ml-auto text-[#8cceae]" />}
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p className="mt-3 text-xs font-bold text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.category}
              </p>
            )}
          </div>

          {/* Excerpt Input */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Layout size={16} className="text-[#8cceae]" />
              Mô tả ngắn
            </h3>
            <textarea 
              placeholder="Tóm tắt nội dung bài viết trong 1-2 câu để thu hút người đọc..."
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 outline-none focus:bg-white focus:border-[#8cceae] transition-all h-32 resize-none"
              value={formData.excerpt}
              onChange={(e) => onFieldChange("excerpt", e.target.value)}
            />
            {errors.excerpt && (
              <p className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.excerpt}
              </p>
            )}
            <p className="mt-2 text-[10px] font-bold text-gray-400 italic">
              * Phân đoạn này sẽ hiển thị ở trang danh sách bài viết.
            </p>
          </div>

          {/* Tips Section */}
          <div className="bg-gradient-to-br from-[#8cceae]/10 to-[#E8FFF0] p-6 rounded-2xl border border-[#8cceae]/20">
            <h4 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#8cceae]" />
              Mẹo bài viết hay
            </h4>
            <ul className="space-y-2">
              {[
                "Tiêu đề chứa từ khóa chính",
                "Nội dung chia thành nhiều đoạn",
                "Sử dụng hình ảnh chất lượng cao",
                "Viết đúng chính tả & văn phong SV"
              ].map((tip, i) => (
                <li key={i} className="text-[11px] font-medium text-gray-600 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#8cceae]" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* ────────── Sticky Action Bar (Bottom) ────────── */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-4 md:p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
               <RotateCcw size={18} />
             </div>
             <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Trạng thái</p>
               <p className="text-xs font-bold text-gray-900 leading-none">Nháp (Auto-saved)</p>
             </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              type="button"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50 transition-all active:scale-95"
            >
              <Eye size={18} />
              <span>Xem trước</span>
            </button>
            
            <motion.button 
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "#6abf96", // Đậm lên khi hover
                boxShadow: "0 10px 25px -5px rgba(140, 206, 174, 0.4)"
              }}
              whileTap={{ 
                scale: 0.95, 
                opacity: 0.7, // Nhạt dần khi giữ vào
                transition: { duration: 0.1 }
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-3.5 rounded-2xl bg-[#8cceae] text-white font-black transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
              <span>{isEdit ? "Cập nhật bài viết" : "Đăng bài viết ngay"}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Bottom spacing for sticky bar */}
      <div className="h-24 md:h-32" />

      {/* Image Crop Modal */}
      <ImageCropModal 
         imageSrc={tempImageSrc}
         isOpen={isCropModalOpen}
         onClose={() => setIsCropModalOpen(false)}
         onCrop={handleCropConfirm}
      />
    </div>
  );
}
