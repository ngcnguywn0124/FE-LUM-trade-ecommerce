"use client";

import React, { useState } from 'react';
import { toast } from 'sonner';
import AuthInput from './AuthInput';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const ChangePasswordForm = () => {
  const { changePassword, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    const hasSpecial = /[@$!%*?&]/.test(pass);

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }

    const passwordValidation = validatePassword(formData.newPassword);
    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (!passwordValidation.isValid) {
      newErrors.newPassword = 'Mật khẩu mới không đủ mạnh';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        });
        toast.success('Đổi mật khẩu thành công!');
        setIsSubmitted(true);
      } catch {
        toast.error('Mật khẩu hiện tại không đúng hoặc có lỗi xảy ra');
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center text-center py-8 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <ShieldCheck size={40} />
        </div>
        <h3 className="text-3xl font-bold text-white mb-4">Đổi mật khẩu thành công!</h3>
        <p className="text-emerald-50 mb-10 max-w-md text-lg leading-relaxed opacity-90">
          Mật khẩu của bạn đã được cập nhật an toàn. Vui lòng sử dụng mật khẩu mới cho lần đăng nhập tiếp theo.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-gray-900 text-[#FFBA00] px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 group cursor-pointer"
        >
          Quay lại trang chủ
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  const passwordReqs = validatePassword(formData.newPassword);

  return (
    <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Đổi mật khẩu</h2>
        <p className="text-gray-500 text-sm mt-1">Vui lòng nhập mật khẩu mới để bảo mật tài khoản của bạn</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <AuthInput 
          id="current-password"
          label="Mật khẩu hiện tại"
          placeholder="••••••••"
          type="password"
          isPassword={true}
          value={formData.currentPassword}
          onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
          error={errors.currentPassword}
          required
        />

        <div className="space-y-2">
            <AuthInput 
            id="new-password"
            label="Mật khẩu mới"
            placeholder="••••••••"
            type="password"
            isPassword={true}
            value={formData.newPassword}
            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
            error={errors.newPassword}
            required
            />
            
            {/* Password Validation Hints */}
            <div className="grid grid-cols-2 gap-2 mt-2 px-1">
                <ValidationHint label="Ít nhất 8 ký tự" met={passwordReqs.minLength} />
                <ValidationHint label="Chữ hoa & Chữ thường" met={passwordReqs.hasUpper && passwordReqs.hasLower} />
                <ValidationHint label="Ít nhất 1 con số" met={passwordReqs.hasNumber} />
                <ValidationHint label="Ký tự đặc biệt (!@#...)" met={passwordReqs.hasSpecial} />
            </div>
        </div>

        <AuthInput 
          id="confirm-password"
          label="Xác nhận mật khẩu mới"
          placeholder="••••••••"
          type="password"
          isPassword={true}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          error={errors.confirmPassword}
          required
        />

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-900 hover:bg-emerald-700 text-[#FFBA00] font-bold py-4 rounded-xl transition-all shadow-md mt-4 text-base cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
        </button>
      </form>
    </div>
  );
};

const ValidationHint = ({ label, met }: { label: string, met: boolean }) => (
  <div className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${met ? 'text-emerald-600' : 'text-gray-400'}`}>
    <div className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-emerald-600' : 'bg-gray-300'}`} />
    {label}
  </div>
);

export default ChangePasswordForm;
