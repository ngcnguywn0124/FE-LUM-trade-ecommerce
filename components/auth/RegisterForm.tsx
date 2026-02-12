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
            <input type="checkbox" id="terms" className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500 cursor-pointer" required />
            <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                Tôi đồng ý với <a href="#" className="text-teal-600 hover:underline">Điều khoản & Chính sách</a>
            </label>
        </div>

      <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-colors shadow-md mt-2 text-base">
          Đăng ký
      </button>
    </form>
  );
};

export default RegisterForm;
