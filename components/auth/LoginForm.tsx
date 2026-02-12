import React, { useState } from 'react';
import AuthInput from './AuthInput';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      console.log('Login submitted:', formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const key = id === 'login-email' ? 'email' : 'password';
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <form className="flex flex-col gap-5 w-full mt-4" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-4">
        <AuthInput 
           id="login-email"
           label="Email"
           placeholder="Nhập email của bạn"
           type="email"
           value={formData.email}
           onChange={handleChange}
           error={errors.email}
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
             <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
             <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Ghi nhớ đăng nhập</span>
         </label>
         <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors font-medium">
             Quên mật khẩu?
         </a>
      </div>

      <button type="submit" className="w-full bg-gray-900 hover:bg-emerald-700 text-[#FFBA00] font-bold py-3 rounded-lg transition-colors shadow-md mt-2 text-base cursor-pointer">
          Đăng nhập
      </button>
    </form>
  );
};

export default LoginForm;
