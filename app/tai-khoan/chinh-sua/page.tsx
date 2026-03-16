"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Camera,
  MapPin,
  GraduationCap,
  Building2,
  User,
  Phone,
  Calendar,
  Info,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Home,
  ChevronRight,
  Pencil,
  Shield,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { getUniversities, getCampusesByUniversity } from "@/services/universityService";
import CustomSelect from "@/components/shared/CustomSelect";
import type { UniversityResponse, CampusResponse } from "@/types/admin";
import type { UpdateProfileRequest } from "@/types/profile";

/* ─────────────────────────────────────────────
   Shared style strings
───────────────────────────────────────────── */
const inputBase =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

const inputWithIcon = `${inputBase} pl-9`;

/* ─────────────────────────────────────────────
   Reusable sub-components
───────────────────────────────────────────── */
const SectionCard = ({
  title,
  icon: Icon,
  children,
  badge,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  badge?: React.ReactNode;
}) => (
  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
        <Icon size={14} />
      </span>
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">{title}</h2>
      {badge && <span className="ml-auto">{badge}</span>}
    </div>
    <div className="flex flex-col gap-4 p-5">{children}</div>
  </div>
);

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-600">{label}</label>
    {children}
    {hint && <p className="text-[11px] italic text-gray-400">{hint}</p>}
  </div>
);

const IconInput = ({
  icon: Icon,
  ...props
}: { icon: React.ElementType } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
    <input className={inputWithIcon} {...props} />
  </div>
);

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const EditProfilePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const {
    user,
    updateProfile,
    submitStudentVerification,
    updateAvatar,
    updateCover,
    isLoading,
    error,
    clearError,
    fetchCurrentUser,
  } = useAuthStore();

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    fullName: "",
    phoneNumber: "",
    avatarUrl: "",
    coverUrl: "",
    dateOfBirth: "",
    gender: "other",
    studentId: "",
    universityId: "",
    campusId: "",
    faculty: "",
    graduationYear: new Date().getFullYear(),
    bio: "",
    location: "",
  });

  const [universities, setUniversities] = useState<UniversityResponse[]>([]);
  const [campuses, setCampuses] = useState<CampusResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingStudent, setIsVerifyingStudent] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const completionFields = [
    formData.fullName,
    formData.phoneNumber,
    formData.dateOfBirth,
    formData.bio,
    formData.location,
    formData.universityId,
    formData.faculty,
    formData.studentId,
  ];
  const completionPct = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100
  );

  const handleAvatarClick = () => avatarInputRef.current?.click();
  const handleCoverClick = () => coverInputRef.current?.click();

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File quá lớn. Vui lòng chọn file dưới 5MB");
      return;
    }
    try {
      setIsSubmitting(true);
      if (type === "avatar") await updateAvatar(file);
      else await updateCover(file);
      setSuccessMessage(
        `Cập nhật ${type === "avatar" ? "ảnh đại diện" : "ảnh bìa"} thành công!`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(`Failed to upload ${type}`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const data = await getUniversities();
        setUniversities(data);
      } catch (err) {
        console.error("Failed to load universities", err);
      }
    };
    loadUniversities();
    
    // Luôn fetch lại profile mới nhất để đảm bảo có đầy đủ dateOfBirth, gender
    const loadProfile = async () => {
      try {
        await fetchCurrentUser();
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    loadProfile();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (user) {
      console.log("Raw user data from store:", user);
      
      // Đảm bảo định dạng ngày yyyy-MM-dd cho input type="date"
      let formattedDOB = "";
      // Thử lấy từ user.dateOfBirth
      const rawDate = user.dateOfBirth;

      if (rawDate) {
        try {
          // Xử lý cả mảng [yyyy, mm, dd] (từ Jackson LocalDate) hoặc chuỗi
          if (Array.isArray(rawDate) && rawDate.length >= 3) {
            const [y, m, d] = rawDate;
            formattedDOB = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          } else {
            const dateStr = String(rawDate);
            if (dateStr.includes("-")) {
              const parts = dateStr.split("T")[0].split("-");
              if (parts.length === 3) {
                formattedDOB = `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
              }
            } else {
              const date = new Date(dateStr);
              if (!isNaN(date.getTime())) {
                formattedDOB = date.toISOString().split("T")[0];
              }
            }
          }
        } catch (e) {
          console.error("Error formatting date:", e);
        }
      }

      console.log("Final formatted DOB for input:", formattedDOB);

      // Chuẩn hóa giới tính về lowercase để khớp với CustomSelect options
      const genderValue = (user.gender?.toLowerCase() as UpdateProfileRequest["gender"]) || "other";

      setFormData({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        avatarUrl: user.avatarUrl || "",
        coverUrl: user.coverUrl || "",
        dateOfBirth: formattedDOB,
        gender: genderValue,
        studentId: user.studentId || "",
        universityId: user.universityId || "",
        campusId: user.campusId || "",
        faculty: user.faculty || "",
        graduationYear: user.graduationYear || new Date().getFullYear(),
        bio: user.bio || "",
        location: user.location || "",
      });
      if (user.universityId)
        getCampusesByUniversity(user.universityId).then(setCampuses);
    }
  }, [user]);

  const handleUniversityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const universityId = e.target.value;
    setFormData((p) => ({ ...p, universityId, campusId: "" }));
    if (universityId) {
      const data = await getCampusesByUniversity(universityId);
      setCampuses(data);
    } else {
      setCampuses([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    clearError();
    try {
      await updateProfile(formData);
      setSuccessMessage("Cập nhật thông tin thành công!");
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      // Nếu có redirect path (ví dụ từ trang đăng tin), chuyển hướng sau 1.5s
      if (redirectPath) {
        setTimeout(() => {
          router.push(redirectPath);
        }, 1500);
      } else {
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentVerification = async () => {
    if (
      !formData.studentId ||
      !formData.universityId ||
      !formData.campusId ||
      !formData.graduationYear
    ) {
      alert("Vui lòng nhập đầy đủ MSSV, Trường, Campus và Năm tốt nghiệp trước khi xác thực.");
      return;
    }

    setIsVerifyingStudent(true);
    clearError();

    try {
      await updateProfile(formData);
      await submitStudentVerification({
        studentId: formData.studentId,
        universityId: formData.universityId,
        campusId: formData.campusId,
        faculty: formData.faculty || null,
        graduationYear: formData.graduationYear,
      });

      setSuccessMessage("Đã gửi yêu cầu xác thực sinh viên. Vui lòng chờ quản trị viên duyệt.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setSuccessMessage(""), 4000);
      await fetchCurrentUser();
    } catch (err) {
      console.error("Student verification submit failed", err);
    } finally {
      setIsVerifyingStudent(false);
    }
  };

  if (!user && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* ── Breadcrumb ── */}
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-gray-500">
          <Link
            href="/"
            className="flex items-center gap-1 transition-colors hover:text-emerald-600"
          >
            <Home size={14} />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight size={14} />
          <Link
            href={`/tai-khoan/${user?.userId}`}
            className="transition-colors hover:text-emerald-600"
          >
            Hồ sơ
          </Link>
          <ChevronRight size={14} />
          <span className="font-semibold text-gray-700">Chỉnh sửa</span>
        </nav>

        {/* ── Banners ── */}
        {successMessage && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={16} className="shrink-0" />
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* ── Hero: Cover + Avatar ── */}
          <div className="mb-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Cover area */}
            <div
              className="group relative h-44 cursor-pointer overflow-hidden"
              onClick={handleCoverClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleCoverClick()}
            >
              {formData.coverUrl ? (
                <Image src={formData.coverUrl} alt="Cover" fill className="object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100" />
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-end justify-end bg-black/0 p-3 transition-all duration-200 group-hover:bg-black/20">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleCoverClick(); }}
                  disabled={isSubmitting}
                  className="flex translate-y-2 items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-800 opacity-0 shadow backdrop-blur-sm transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-white disabled:opacity-50 cursor-pointer"
                >
                  <Camera size={12} />
                  {isSubmitting ? "Đang tải..." : "Đổi ảnh bìa"}
                </button>
              </div>
              <input
                ref={coverInputRef}
                type="file"
                onChange={(e) => handleFileChange(e, "cover")}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Avatar + name */}
            <div className="px-6 pb-5">
              <div className="flex items-end gap-4">
                {/* Avatar */}
                <div
                  className="group relative -mt-11 h-[84px] w-[84px] shrink-0 cursor-pointer overflow-hidden rounded-full border-[3px] border-white bg-emerald-50 shadow-md"
                  onClick={handleAvatarClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleAvatarClick()}
                >
                  {formData.avatarUrl ? (
                    <Image src={formData.avatarUrl} alt="Avatar" fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-emerald-400">
                      <User size={32} />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/35 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Camera size={18} />
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    onChange={(e) => handleFileChange(e, "avatar")}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Identity */}
                <div className="mb-1 mt-3">
                  <p className="text-[15px] font-bold text-gray-900">
                    {formData.fullName || "Tên của bạn"}
                  </p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Main 2-column grid ── */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[7fr_5fr]">

            {/* Left: forms */}
            <div className="flex flex-col gap-6">

              {/* Basic info */}
              <SectionCard title="Thông tin cơ bản" icon={User}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Họ và tên">
                    <IconInput
                      icon={User}
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                      placeholder="Nhập họ và tên"
                    />
                  </Field>

                  <Field label="Số điện thoại">
                    <IconInput
                      icon={Phone}
                      type="text"
                      value={formData.phoneNumber || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, phoneNumber: e.target.value }))}
                      placeholder="Nhập số điện thoại"
                    />
                  </Field>

                  <Field label="Ngày sinh">
                    <IconInput
                      icon={Calendar}
                      type="date"
                      value={formData.dateOfBirth || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, dateOfBirth: e.target.value }))}
                    />
                  </Field>

                  <Field label="Giới tính">
                    <CustomSelect
                      value={formData.gender || "other"}
                      options={[
                        { id: "male", name: "Nam" },
                        { id: "female", name: "Nữ" },
                        { id: "other", name: "Khác" },
                      ]}
                      onChange={(val) =>
                        setFormData((p) => ({
                          ...p,
                          gender: val as UpdateProfileRequest["gender"],
                        }))
                      }
                    />
                  </Field>
                </div>

                <Field label="Giới thiệu bản thân">
                  <textarea
                    rows={4}
                    value={formData.bio || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Hãy viết vài dòng về bản thân bạn..."
                    className={`${inputBase} resize-none leading-relaxed`}
                  />
                </Field>
              </SectionCard>

              {/* Location */}
              <SectionCard title="Địa chỉ & Liên hệ" icon={MapPin}>
                <Field
                  label="Khu vực sinh sống"
                  hint="* Nếu để trống, hệ thống sẽ lấy địa chỉ từ Trường & Cơ sở bạn học."
                >
                  <IconInput
                    icon={MapPin}
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                    placeholder="Ví dụ: Quận 9, TP. Thủ Đức"
                  />
                </Field>
              </SectionCard>

            </div>

            {/* Right: sidebar */}
            <div className="flex flex-col gap-6">

              {/* Profile completeness card */}
              <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-5 text-white shadow-sm">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest opacity-70">
                  Độ hoàn thiện hồ sơ
                </p>
                <p className="mb-3 text-3xl font-extrabold tracking-tight">{completionPct}%</p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/25">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
                <p className="mt-2.5 text-[11px] leading-snug opacity-60">
                  Hồ sơ đầy đủ giúp tăng độ tin cậy khi giao dịch
                </p>
              </div>

              {/* Student info */}
              <SectionCard
                title="Thông tin sinh viên"
                icon={GraduationCap}
                badge={
                  user?.isStudentVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      <CheckCircle2 size={9} />
                      Đã xác thực
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                      <Shield size={9} />
                      Chưa xác thực
                    </span>
                  )
                }
              >
                <Field label="Trường đại học">
                  <CustomSelect
                    value={formData.universityId || ""}
                    options={universities.map((u) => ({
                      id: u.universityId,
                      name: u.universityName,
                    }))}
                    placeholder="Chọn trường đại học"
                    onChange={(val) => {
                      handleUniversityChange({
                        target: { value: val },
                      } as React.ChangeEvent<HTMLSelectElement>);
                    }}
                  />
                </Field>

                <Field label="Cơ sở / Campus">
                  <CustomSelect
                    value={formData.campusId || ""}
                    options={campuses.map((c) => ({
                      id: c.campusId,
                      name: c.campusName,
                    }))}
                    placeholder="Chọn cơ sở"
                    disabled={!formData.universityId}
                    disabledPlaceholder="Vui lòng chọn trường trước"
                    onChange={(val) =>
                      setFormData((p) => ({ ...p, campusId: val }))
                    }
                  />
                </Field>

                <Field label="Khoa / Ngành">
                  <input
                    type="text"
                    value={formData.faculty || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, faculty: e.target.value }))}
                    placeholder="Công nghệ thông tin..."
                    className={inputBase}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Mã sinh viên">
                    <input
                      type="text"
                      value={formData.studentId || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, studentId: e.target.value }))}
                      placeholder="MSSV"
                      className={inputBase}
                    />
                  </Field>
                  <Field label="Năm tốt nghiệp">
                    <input
                      type="number"
                      min={2000}
                      max={2100}
                      value={formData.graduationYear || ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          graduationYear: parseInt(e.target.value),
                        }))
                      }
                      className={inputBase}
                    />
                  </Field>
                </div>

                {!user?.isStudentVerified && (
                  <div className="flex flex-col items-center space-y-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-center">
                    <div className="flex flex-col items-center gap-2 text-[11.5px] leading-snug text-blue-600">
                      <Info size={16} className="shrink-0" />
                      <span>
                        Cập nhật thông tin sinh viên chính xác để được xác thực và tăng độ tin cậy
                        trong giao dịch.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleStudentVerification}
                      disabled={isVerifyingStudent || isSubmitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-xs font-semibold text-blue-700 shadow-sm transition-all hover:bg-blue-100 hover:shadow disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto cursor-pointer"
                    >
                      {isVerifyingStudent ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          Đang gửi xác thực...
                        </>
                      ) : (
                        <>
                          <Shield size={13} />
                          Gửi xác thực sinh viên
                        </>
                      )}
                    </button>
                  </div>
                )}
              </SectionCard>

              {/* Sticky action buttons */}
              <div className="sticky top-24 flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-bold text-amber-400 transition-all hover:-translate-y-px hover:bg-gray-800 active:translate-y-0 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-white cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Lưu thay đổi
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;