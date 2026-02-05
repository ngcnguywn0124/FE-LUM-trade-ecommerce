'use client';

import React, { useState } from 'react';
import ErrorComponent, { ErrorType } from '@/components/ErrorComponent';

export default function TestErrorPage() {
    const [lastAction, setLastAction] = useState<string>('None');
    const [selectedType, setSelectedType] = useState<ErrorType>('404');

    const errorTypes: ErrorType[] = [
        '400', '401', '403', '404', '500', '502', '503', 'offline', 'empty'
    ];

    const handleRetry = () => {
        setLastAction('Retry Button Clicked');
        console.log('Retrying...');
    };

    const handleHome = () => {
        setLastAction('Home Button Clicked');
        console.log('Navigating Home...');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">ErrorComponent Demo</h1>
                    <p className="text-gray-600">Kiểm tra các trạng thái lỗi và tính năng của component</p>
                    <div className="mt-4 p-3 bg-white rounded-lg shadow-sm inline-block border border-blue-100">
                        <span className="font-semibold text-blue-600">Last Action: </span>
                        <span className="text-gray-700">{lastAction}</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Controls */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold mb-4 text-gray-800">Chọn loại lỗi:</h3>
                            <div className="flex flex-wrap gap-2 lg:flex-col">
                                {errorTypes.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            selectedType === type
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        Lỗi {type.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 italic text-sm text-orange-800">
                            Tip: Bạn có thể thay đổi state để xem hiệu ứng Hover và Animation của Framer Motion.
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="lg:col-span-3 space-y-12">
                        {/* Interactive Preview */}
                        <section>
                            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-l-4 border-blue-600 pl-4">Interactive Preview</h2>
                            <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-8 flex items-center justify-center">
                                <ErrorComponent 
                                    type={selectedType}
                                    onRetry={handleRetry}
                                    onHome={handleHome}
                                />
                            </div>
                        </section>

                        {/* Custom Content Example */}
                        <section>
                            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-l-4 border-orange-500 pl-4">Custom Content Example</h2>
                            <div className="bg-white rounded-3xl border border-gray-100 p-8">
                                <ErrorComponent 
                                    type="empty"
                                    title="Giỏ hàng đang trống"
                                    description="Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá và chọn cho mình sản phẩm ưng ý nhé!"
                                    onHome={handleHome}
                                />
                            </div>
                        </section>

                        {/* Grid of All Themes */}
                        <section>
                            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-l-4 border-red-500 pl-4">Visual Themes Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm scale-90 origin-top">
                                    <p className="text-center text-xs font-bold text-gray-400 mb-2">THEME: ORANGE (Generic/404)</p>
                                    <ErrorComponent type="404" />
                                </div>
                                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm scale-90 origin-top">
                                    <p className="text-center text-xs font-bold text-gray-400 mb-2">THEME: RED (Critical/500/Offline)</p>
                                    <ErrorComponent type="500" />
                                </div>
                                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm scale-90 origin-top">
                                    <p className="text-center text-xs font-bold text-gray-400 mb-2">THEME: BLUE (Auth/401)</p>
                                    <ErrorComponent type="401" />
                                </div>
                                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm scale-90 origin-top">
                                    <p className="text-center text-xs font-bold text-gray-400 mb-2">THEME: GRAY (Empty State)</p>
                                    <ErrorComponent type="empty" />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
