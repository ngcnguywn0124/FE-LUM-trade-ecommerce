import React from 'react';
import AuthInput from './AuthInput';

const RegisterForm = () => {
  return (
    <form className="flex flex-col gap-5 w-full mt-4" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-4">
            <AuthInput 
               id="register-name"
               label="Họ và tên"
               placeholder="Nhập họ và tên của bạn"
               type="text"
            />
            <AuthInput 
               id="register-email"
               label="Email"
               placeholder="Nhập email của bạn"
               type="email"
            />
            <AuthInput 
               id="register-password"
               label="Mật khẩu"
               placeholder="Nhập mật khẩu"
               isPassword
            />
             <AuthInput 
               id="register-confirm-password"
               label="Nhập lại mật khẩu"
               placeholder="Nhập lại mật khẩu"
               isPassword
            />
        </div>

        <div className="flex items-center gap-2">
            <input type="checkbox" id="terms" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer" required />
            <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                Tôi đồng ý với <a href="#" className="text-emerald-600 hover:underline">Điều khoản & Chính sách</a>
            </label>
        </div>

      <button className="w-full bg-gray-900 hover:bg-emerald-700 text-[#FFBA00] font-bold py-3 rounded-lg transition-colors shadow-md mt-2 text-base cursor-pointer">
          Đăng ký
      </button>
    </form>
  );
};

export default RegisterForm;
