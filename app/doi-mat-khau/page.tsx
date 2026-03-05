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
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-emerald-500/50 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto">
        {/* Breadcrumb Section - Hidden when success to focus on the message */}

        {/* Form Section */}
        <div className="flex flex-col items-center justify-center w-full">
             <div className="w-full max-w-lg">
                <ChangePasswordForm />
             </div>

             {/* Helpful Links/Tips */}
             <div className="mt-8 w-full max-w-lg">       
                <p className="text-center text-emerald-100/60 text-xs">
                    Mọi thắc mắc vui lòng liên hệ <a href="mailto:support@lum.vn" className="text-white hover:underline font-medium">Hỗ trợ kỹ thuật</a>
                </p>
             </div>
        </div>
      </div>
    </main>
  );
};

export default ChangePasswordPage;
