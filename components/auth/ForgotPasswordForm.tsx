import React, { useState } from 'react';
import AuthInput from './AuthInput';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Vui lòng nhập email của bạn');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email không hợp lệ');
      return;
    }
    
    setError('');
    // Simulate sending reset link
    setIsSubmitted(true);
    console.log('Reset link sent to:', email);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center text-center py-4 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Kiểm tra email của bạn</h3>
        <p className="text-gray-500 text-sm mb-6 px-4">
          Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến <strong>{email}</strong>. Vui lòng kiểm tra hộp thư đến (hoặc thư rác).
        </p>
        <button 
          onClick={onBack}
          className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors cursor-pointer"
        >
          Quay lại đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors group cursor-pointer"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Quay lại</span>
      </button>

      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Quên mật khẩu?</h2>
        <p className="text-gray-500 text-sm mt-1">Nhập email của bạn để nhận liên kết đặt lại mật khẩu</p>
      </div>

      <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit} noValidate>
        <AuthInput 
          id="forgot-email"
          label="Email"
          placeholder="Nhập email đã đăng ký"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          required
        />

        <button 
          type="submit" 
          className="w-full bg-gray-900 hover:bg-emerald-700 text-[#FFBA00] font-bold py-3.5 rounded-xl transition-all shadow-md mt-2 text-base cursor-pointer active:scale-[0.98]"
        >
          Gửi liên kết khôi phục
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
