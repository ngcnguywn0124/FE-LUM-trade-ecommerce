import React, { useState } from 'react';
import AuthInput from './AuthInput';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const validatePassword = (pass: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pass);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { ...errors };
    let isValid = true;

    // Validate Name
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
      isValid = false;
    } else {
      newErrors.name = '';
    }

    // Validate Email
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
      isValid = false;
    } else {
      newErrors.email = '';
    }

    // Validate Phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
      isValid = false;
    } else {
      newErrors.phone = '';
    }

    // Validate Password
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm in hoa, thường, số và ký tự';
      isValid = false;
    } else {
      newErrors.password = '';
    }

    // Validate Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp';
      isValid = false;
    } else {
      newErrors.confirmPassword = '';
    }

    setErrors(newErrors);

    if (isValid) {
      console.log('Form submitted:', formData);
      // Proceed with registration logic
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Map ID to state key
    const fieldMap: { [key: string]: string } = {
      'register-name': 'name',
      'register-email': 'email',
      'register-phone': 'phone',
      'register-password': 'password',
      'register-confirm-password': 'confirmPassword',
    };
    
    setFormData(prev => ({ ...prev, [fieldMap[id]]: value }));
  };

  return (
    <form className="flex flex-col gap-5 w-full mt-4" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-4">
            <AuthInput 
               id="register-name"
               label="Họ và tên"
               placeholder="Nhập họ và tên của bạn"
               type="text"
               value={formData.name}
               onChange={handleChange}
               error={errors.name}
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
                   id="register-phone"
                   label="Số điện thoại"
                   placeholder="Nhập số điện thoại"
                   type="tel"
                   value={formData.phone}
                   onChange={handleChange}
                   error={errors.phone}
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

        <div className="flex items-center gap-2">
            <input type="checkbox" id="terms" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer" required />
            <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                Tôi đồng ý với <a href="#" className="text-emerald-600 hover:underline">Điều khoản dịch vụ</a> & <a href="#" className="text-emerald-600 hover:underline">Chính sách bảo mật</a>. 
            </label>
        </div>

      <button type="submit" className="w-full bg-gray-900 hover:bg-emerald-700 text-[#FFBA00] font-bold py-3 rounded-lg transition-colors shadow-md mt-2 text-base cursor-pointer">
          Đăng ký
      </button>
    </form>
  );
};

export default RegisterForm;
