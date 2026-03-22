"use client";

import React, { useState } from 'react';
import { toast } from 'sonner';
import AuthInput from './AuthInput';
import { useAuthStore } from '@/stores/authStore';

interface LoginFormProps {
  onForgotPassword: () => void;
  onSuccess?: () => void;
  onRequireVerifyEmail?: (email: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword, onSuccess, onRequireVerifyEmail }) => {
  const { login, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({
    identifier: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { identifier: '', password: '' };
    let isValid = true;

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Vui lòng nhập email hoặc số điện thoại';
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    try {
      await login({
        identifier: formData.identifier.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
      toast.success('Đăng nhập thành công!');
      onSuccess?.();
    } catch (error: unknown) {
      const maybeCode =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { code?: unknown } } }).response?.data?.code === 'number'
          ? ((error as { response?: { data?: { code?: number } } }).response?.data?.code as number)
          : null;

      const maybeMessage =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: unknown } } }).response?.data?.message === 'string'
          ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message as string)
          : '';

      if (maybeCode === 1013 || maybeMessage.toLowerCase().includes('xác thực email')) {
        const identifier = formData.identifier.trim();
        if (identifier.includes('@')) {
          toast.info('Tài khoản chưa xác thực email. Vui lòng nhập OTP để tiếp tục.');
          onRequireVerifyEmail?.(identifier);
          return;
        }
      }

      toast.error('Email/SĐT hoặc mật khẩu không chính xác');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, rememberMe: checked }));
      return;
    }
    const key = id === 'login-identifier' ? 'identifier' : 'password';
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  return (
    <form className="flex flex-col gap-5 w-full mt-4" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-4">
        <AuthInput
          id="login-identifier"
          label="Email hoặc Số điện thoại"
          placeholder="Nhập email hoặc số điện thoại của bạn"
          type="text"
          value={formData.identifier}
          onChange={handleChange}
          error={errors.identifier}
          required
        />
        <AuthInput
          id="login-password"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          isPassword
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
      </div>

      <div className="flex items-center justify-between w-full">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 accent-emerald-600 cursor-pointer"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
            Ghi nhớ đăng nhập
          </span>
        </label>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors font-medium cursor-pointer"
        >
          Quên mật khẩu?
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gray-900 hover:bg-emerald-700 text-[#FFBA00] font-bold py-3 rounded-lg transition-colors shadow-md mt-2 text-base cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
};

export default LoginForm;

