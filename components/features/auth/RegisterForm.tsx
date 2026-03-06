"use client";

import React, { useState } from 'react';
import { toast } from 'sonner';
import AuthInput from './AuthInput';
import { useAuthStore } from '@/stores/authStore';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const PHONE_REGEX = /^(\+84|0)[3-9]\d{8}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { register, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    acceptTerms: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      acceptTerms: '',
    };
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
      isValid = false;
    } else if (!PHONE_REGEX.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ (VD: 0912345678)';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    } else if (!PASSWORD_REGEX.test(formData.password)) {
      newErrors.password =
        'Mật khẩu phải có ít nhất 8 ký tự, bao gồm in hoa, thường, số và ký tự đặc biệt';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp';
      isValid = false;
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Bạn phải đồng ý với điều khoản và chính sách';
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    try {
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
        acceptTerms: formData.acceptTerms,
      });
      toast.success('Đăng ký tài khoản thành công!');
      onSuccess?.();
    } catch {
      toast.error('Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    const fieldMap: Record<string, keyof typeof formData> = {
      'register-fullName': 'fullName',
      'register-email': 'email',
      'register-phoneNumber': 'phoneNumber',
      'register-password': 'password',
      'register-confirm-password': 'confirmPassword',
      'terms': 'acceptTerms',
    };
    const key = fieldMap[id];
    if (key) {
      setFormData(prev => ({
        ...prev,
        [key]: type === 'checkbox' ? checked : value
      }));
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  return (
    <form className="flex flex-col gap-5 w-full mt-4" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-4">
        <AuthInput
          id="register-fullName"
          label="Họ và tên"
          placeholder="Nhập họ và tên của bạn"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AuthInput
            id="register-email"
            label="Email"
            placeholder="Nhập email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <AuthInput
            id="register-phoneNumber"
            label="Số điện thoại"
            placeholder="VD: 0912345678"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AuthInput
            id="register-password"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            isPassword
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          <AuthInput
            id="register-confirm-password"
            label="Nhập lại mật khẩu"
            placeholder="Nhập lại mật khẩu"
            isPassword
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="terms"
            className="w-4 h-4 rounded border-gray-300 accent-emerald-600 cursor-pointer"
            checked={formData.acceptTerms}
            onChange={handleChange}
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
            Tôi đồng ý với{' '}
            <a href="#" className="text-emerald-600 hover:underline">Điều khoản dịch vụ</a>{' '}
            &amp;{' '}
            <a href="#" className="text-emerald-600 hover:underline">Chính sách bảo mật</a>.
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-xs text-red-500 ml-6">{errors.acceptTerms}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gray-900 hover:bg-emerald-700 text-[#FFBA00] font-bold py-3 rounded-lg transition-colors shadow-md mt-2 text-base cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
      </button>
    </form>
  );
};

export default RegisterForm;
