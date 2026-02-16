import React from 'react';
import ResetPasswordForm from '@/components/features/auth/ResetPasswordForm';

export const metadata = {
  title: 'Đặt lại mật khẩu',
  description: 'Thiết lập mật khẩu mới cho tài khoản của bạn tại Lụm.',
};

const ResetPasswordPage = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-emerald-500/50">
      <div className="w-full max-w-lg">
        {/* Reset Form */}
        <ResetPasswordForm />

        {/* Security Footer */}
        <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>Kết nối bảo mật 256-bit SSL</span>
            </div>
            
            <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400">
                <a href="#" className="hover:text-emerald-600 transition-colors">Điều khoản</a>
                <a href="#" className="hover:text-emerald-600 transition-colors">Bảo mật</a>
                <a href="#" className="hover:text-emerald-600 transition-colors">Trung tâm hỗ trợ</a>
            </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
