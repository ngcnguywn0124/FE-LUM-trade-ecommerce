import React from 'react';
import AuthInput from './AuthInput';

const LoginForm = () => {
  return (
    <form className="flex flex-col gap-5 w-full mt-4" onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col gap-4">
        <AuthInput 
           id="login-email"
           label="Email"
           placeholder="Nhập email của bạn"
           type="email"
        />
        <AuthInput 
           id="login-password"
           label="Mật khẩu"
           placeholder="Nhập mật khẩu"
           isPassword
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

      <button className="w-full bg-gray-900 hover:bg-emerald-700 text-[#FFBA00] font-bold py-3 rounded-lg transition-colors shadow-md mt-2 text-base cursor-pointer">
          Đăng nhập
      </button>
    </form>
  );
};

export default LoginForm;
