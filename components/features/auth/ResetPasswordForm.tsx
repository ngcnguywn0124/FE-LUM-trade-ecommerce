"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import AuthInput from './AuthInput';
import { Lock, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    password: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu mới';
    } else if (!passwordValidation.isValid) {
      newErrors.password = 'Mật khẩu chưa đủ mạnh';
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Logic call API reset password với token từ URL ở đây
      setIsSubmitted(true);
      console.log('Password reset successfully');
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center text-center py-8 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <ShieldCheck size={40} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Đặt lại mật khẩu thành công!</h3>
        <p className="text-gray-500 mb-8 max-w-sm">
          Mật khẩu của bạn đã được thay đổi. Bây giờ bạn có thể đăng nhập vào hệ thống bằng mật khẩu mới.
        </p>
        <button 
          onClick={() => window.location.href = '/'} // Hoặc mở modal đăng nhập
          className="bg-gray-900 text-[#FFBA00] px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 group cursor-pointer"
        >
          Đăng nhập ngay
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  const passwordReqs = validatePassword(formData.password);

  return (
    <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image 
            src="/logo/lum-logo.png" 
            alt="Lụm Logo" 
            width={120} 
            height={48} 
            className="h-10 w-auto object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Đặt lại mật khẩu</h2>
        <p className="text-gray-500 text-sm mt-1">Sử dụng mật khẩu mới mà bạn chưa từng dùng trước đây</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="space-y-2">
            <AuthInput 
              id="reset-password"
              label="Mật khẩu mới"
              placeholder="••••••••"
              type="password"
              isPassword={true}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              error={errors.password}
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
          id="reset-confirm-password"
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
          className="w-full bg-gray-900 hover:bg-emerald-700 text-[#FFBA00] font-bold py-4 rounded-xl transition-all shadow-md mt-4 text-base cursor-pointer active:scale-[0.98]"
        >
          Xác nhận đặt lại mật khẩu
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

export default ResetPasswordForm;
