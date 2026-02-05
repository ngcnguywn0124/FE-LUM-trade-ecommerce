import React from 'react';
import { motion } from 'framer-motion';

// ==========================================
// Types & Interfaces
// ==========================================

export type ErrorType =
    | '400'  // Bad Request
    | '401'  // Unauthorized
    | '403'  // Forbidden
    | '404'  // Not Found
    | '500'  // Server Error
    | '502'  // Bad Gateway
    | '503'  // Service Unavailable
    | 'offline' // Network Error
    | 'empty'; // Empty State

interface ErrorComponentProps {
    type: ErrorType;
    title?: string;
    description?: string;
    onRetry?: () => void;
    onHome?: () => void;
    className?: string;
}

// ==========================================
// Configuration & Assets
// ==========================================

// Color Themes
const THEMES = {
    orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-500',
        button: 'hover:bg-orange-50',
        icon: (
            <svg className="w-12 h-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        )
    },
    red: {
        bg: 'bg-red-50',
        text: 'text-red-500',
        button: 'hover:bg-red-50',
        icon: (
            <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        )
    },
    blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-500',
        button: 'hover:bg-blue-50',
        icon: (
            <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        )
    },
    gray: {
        bg: 'bg-gray-50',
        text: 'text-gray-500',
        button: 'hover:bg-gray-50',
        icon: (
            <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
        )
    }
};

// Config Generator
const getConfig = (type: ErrorType) => {
    switch (type) {
        // 404 / NOT FOUND (Orange)
        case '404':
            return {
                theme: THEMES.orange,
                defaultTitle: 'Không tìm thấy trang',
                defaultDesc: 'Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.',
                icon: (
                    <svg className="w-12 h-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
            };

        // EMPTY STATE (Gray/Orange)
        case 'empty':
            return {
                theme: THEMES.orange,
                defaultTitle: 'Chưa có dữ liệu',
                defaultDesc: 'Hiện tại chưa có thông tin nào ở đây. Vui lòng quay lại sau.',
                icon: (
                    <svg className="w-12 h-12 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                    </svg>
                )
            };

        // AUTH / PERMISSION (Blue)
        case '401':
            return {
                theme: THEMES.blue,
                defaultTitle: 'Yêu cầu đăng nhập',
                defaultDesc: 'Vui lòng đăng nhập để tiếp tục truy cập vào nội dung này.',
            };
        case '403':
            return {
                theme: THEMES.blue,
                defaultTitle: 'Không có quyền truy cập',
                defaultDesc: 'Bạn không được phép xem trang này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.',
            };

        // CRITICAL / SERVER (Red)
        case '500':
            return {
                theme: THEMES.red,
                defaultTitle: 'Lỗi máy chủ',
                defaultDesc: 'Hệ thống đang gặp sự cố. Đội ngũ kỹ thuật đang khắc phục, vui lòng thử lại sau.',
                icon: (
                    <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                )
            };
        case '502':
        case '503':
            return {
                theme: THEMES.red,
                defaultTitle: 'Dịch vụ gián đoạn',
                defaultDesc: 'Máy chủ đang bảo trì hoặc quá tải. Vui lòng thử lại trong ít phút.',
            };
        case 'offline':
            return {
                theme: THEMES.red,
                defaultTitle: 'Mất kết nối Internet',
                defaultDesc: 'Vui lòng kiểm tra lại đường truyền mạng của bạn và thử lại.',
                icon: (
                    <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                    </svg>
                )
            };
        case '400':
        default:
            return {
                theme: THEMES.orange,
                defaultTitle: 'Đã xảy ra lỗi',
                defaultDesc: 'Yêu cầu không hợp lệ hoặc có lỗi không xác định xảy ra.',
            };
    }
};

// ==========================================
// Component Implementation
// ==========================================

export const ErrorComponent: React.FC<ErrorComponentProps> = ({
    type,
    title,
    description,
    onRetry,
    onHome,
    className = '',
}) => {
    const config = getConfig(type);
    const theme = config.theme;
    const displayTitle = title || config.defaultTitle;
    const displayDesc = description || config.defaultDesc;
    const DisplayIcon = config.icon || theme.icon;

    return (
        <div className={`min-h-[400px] flex items-center justify-center p-4 ${className}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 md:p-12 max-w-md w-full text-center border border-gray-100"
            >
                {/* Icon Circle */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className={`mx-auto w-24 h-24 ${theme.bg} rounded-full flex items-center justify-center mb-6`}
                >
                    {DisplayIcon}
                </motion.div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {displayTitle}
                </h2>

                <p className="text-gray-500 mb-8 leading-relaxed">
                    {displayDesc}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {onHome && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onHome}
                            className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
                        >
                            Quay lại trang chủ
                        </motion.button>
                    )}

                    {onRetry && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onRetry}
                            className={`px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium bg-white ${theme.button} transition-colors`}
                        >
                            Thử lại
                        </motion.button>
                    )}

                    {/* Default secondary action if neither provided but generic 'Go Back' is needed? 
              Display generic 'Report' or nothing depending on UX. 
              Per requirements, always show at least 2 buttons if possible. 
              If props are missing, we assume parent handles logic. */}
                </div>
            </motion.div>
        </div>
    );
};

export default ErrorComponent;
