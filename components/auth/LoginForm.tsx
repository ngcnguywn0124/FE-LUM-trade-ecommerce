import React, { useState } from 'react';
import AuthInput from './AuthInput';

interface LoginFormProps {
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    identifier: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
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

    if (isValid) {
      console.log('Login submitted:', formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const key = id === 'login-identifier' ? 'identifier' : 'password';
    setFormData(prev => ({ ...prev, [key]: value }));
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
             />
             <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Ghi nhớ đăng nhập</span>
         </label>
         <button 
           type="button"
           onClick={onForgotPassword}
           className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors font-medium cursor-pointer"
         >
             Quên mật khẩu?
         </button>
      </div>

      <button type="submit" className="w-full bg-gray-900 hover:bg-emerald-700 text-[#FFBA00] font-bold py-3 rounded-lg transition-colors shadow-md mt-2 text-base cursor-pointer">
          Đăng nhập
      </button>
    </form>
  );
};

export default LoginForm;
