import React from 'react';
import ChangePasswordForm from '@/components/features/auth/ChangePasswordForm';
import Breadcrumb from '@/components/shared/Breadcrumb';

export const metadata = {
  title: 'Đổi mật khẩu',
  description: 'Cập nhật mật khẩu để bảo vệ tài khoản của bạn tại Lụm.',
};

const ChangePasswordPage = () => {
  const breadcrumbItems = [
    { label: 'Tài khoản', href: '#' },
    { label: 'Bảo mật', href: '#' },
    { label: 'Đổi mật khẩu' }
  ];

  return (
    <main className="min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Section */}
        <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Form Section */}
        <div className="flex flex-col items-center justify-center">
             <div className="w-full max-w-lg">
                <ChangePasswordForm />
             </div>

             {/* Helpful Links/Tips */}
             <div className="mt-12 w-full max-w-lg">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                    <h4 className="flex items-center gap-2 text-blue-800 font-bold mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        Mẹo bảo mật mật khẩu
                    </h4>
                    <ul className="space-y-2 text-sm text-blue-700/80">
                        <li className="flex gap-2">
                            <span className="shrink-0">•</span>
                            <span>Không sử dụng lại mật khẩu cũ hoặc mật khẩu từ các trang web khác.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="shrink-0">•</span>
                            <span>Mật khẩu nên có sự kết hợp giữa chữ cái, chữ số và ký tự đặc biệt.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="shrink-0">•</span>
                            <span>Cập nhật mật khẩu định kỳ 3-6 tháng một lần để đảm bảo an toàn.</span>
                        </li>
                    </ul>
                </div>
                
                <p className="text-center text-gray-400 text-xs mt-6">
                    Mọi thắc mắc vui lòng liên hệ <a href="mailto:support@lum.vn" className="text-emerald-600 hover:underline">Hỗ trợ kỹ thuật</a>
                </p>
             </div>
        </div>
      </div>
    </main>
  );
};

export default ChangePasswordPage;
