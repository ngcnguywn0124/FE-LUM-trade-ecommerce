"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import SocialLogin from './SocialLogin';
import ForgotPasswordForm from './ForgotPasswordForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>(defaultTab);

  // Reset tab when modal opens/closes or defaultTab changes
  useEffect(() => {
    if (isOpen) {
        setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors z-10 cursor-pointer"
        >
            <X size={24} />
        </button>

        <div className="p-6 sm:p-8">
            {/* Tabs - Hidden in forgot password mode */}
            {activeTab !== 'forgot' && (
                <div className="flex w-full border-b border-gray-100 mb-6">
                    <button
                        onClick={() => setActiveTab('login')}
                        className={`flex-1 pb-3 text-center text-lg font-bold transition-all relative cursor-pointer ${
                            activeTab === 'login' 
                            ? 'text-emerald-600' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        Đăng nhập
                        <AnimatePresence>
                            {activeTab === 'login' && (
                                <motion.span 
                                    key="login-underline"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    exit={{ scaleX: 0 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    style={{ originX: 0 }}
                                    className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full" 
                                />
                            )}
                        </AnimatePresence>
                    </button>
                    <button
                        onClick={() => setActiveTab('register')}
                        className={`flex-1 pb-3 text-center text-lg font-bold transition-all relative cursor-pointer ${
                            activeTab === 'register' 
                            ? 'text-emerald-600' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        Đăng ký
                        <AnimatePresence>
                            {activeTab === 'register' && (
                                <motion.span 
                                    key="register-underline"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    exit={{ scaleX: 0 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    style={{ originX: 0 }}
                                    className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full" 
                                />
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            )}

            {activeTab === 'forgot' ? (
                <ForgotPasswordForm onBack={() => setActiveTab('login')} />
            ) : (
                <>
                    {/* Header Title */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
                        </h2>
                        {activeTab === 'login' && (
                            <p className="text-gray-500 text-sm mt-1">Chào mừng bạn trở lại! Vui lòng đăng nhập để tiếp tục.</p>
                        )}
                        {activeTab === 'register' && (
                            <p className="text-gray-500 text-sm mt-1">Tạo tài khoản để khám phá nhiều tính năng hơn</p>
                        )}
                    </div>

                    {/* Forms */}
                    {activeTab === 'login' ? (
                        <LoginForm onForgotPassword={() => setActiveTab('forgot')} onSuccess={onClose} />
                    ) : (
                        <RegisterForm onSuccess={onClose} />
                    )}

                    {/* Social Login */}
                    <div className="mt-6">
                        <SocialLogin />
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
