// components/ProductSection.tsx
"use client";

import React, { useState } from "react";
import ProductCard from "./product/ProductCard";
import { Sparkles } from "lucide-react";

// Mock data giả lập mở rộng (25 sản phẩm)
const allProducts = [
  { id: 1, name: "Giáo trình C++ cũ", price: "45.000đ", school: "HUTECH", image: "/p1.jpg", tag: "Sách", time: "5 ngày trước", imageCount: 2 },
  { id: 2, name: "Bàn phím cơ Keychron", price: "850.000đ", school: "FPT Edu", image: "/p2.jpg", tag: "Tech", time: "1 tuần trước", imageCount: 6 },
  { id: 3, name: "Áo Hoodie Local Brand", price: "120.000đ", school: "KTX ĐHQG", image: "/p3.jpg", tag: "Thời trang", time: "1 tuần trước", imageCount: 5 },
  { id: 4, name: "Tủ vải đựng quần áo", price: "90.000đ", school: "UEH", image: "/p4.jpg", tag: "Gia dụng", time: "1 tuần trước", imageCount: 3 },
  { id: 5, name: "iPhone 13 Pro Max", price: "15.500.000đ", school: "HUTECH", image: "/p5.jpg", tag: "Điện thoại", time: "2 ngày trước", imageCount: 4 },
  { id: 6, name: "Sách Giải tích 1", price: "35.000đ", school: "HUTECH", image: "/p6.jpg", tag: "Sách", time: "1 giờ trước", imageCount: 1 },
  { id: 7, name: "Chuột không dây Logitech", price: "150.000đ", school: "ĐH Công Nghiệp", image: "/p7.jpg", tag: "Tech", time: "3 giờ trước", imageCount: 2 },
  { id: 8, name: "Quạt sạc mini", price: "55.000đ", school: "HUTECH", image: "/p8.jpg", tag: "Gia dụng", time: "6 giờ trước", imageCount: 3 },
  { id: 9, name: "Bình giữ nhiệt Lock&Lock", price: "110.000đ", school: "HUTECH", image: "/p9.jpg", tag: "Gia dụng", time: "12 giờ trước", imageCount: 4 },
  { id: 10, name: "Túi xách nữ Canvas", price: "45.000đ", school: "ĐH Mở", image: "/p10.jpg", tag: "Thời trang", time: "1 ngày trước", imageCount: 5 },
  { id: 11, name: "Máy tính Casio 580VNX", price: "350.000đ", school: "HUTECH", image: "/p11.jpg", tag: "Sách", time: "1 ngày trước", imageCount: 2 },
  { id: 12, name: "Đèn bàn học chống cận", price: "85.000đ", school: "HUTECH", image: "/p12.jpg", tag: "Gia dụng", time: "2 ngày trước", imageCount: 1 },
  { id: 13, name: "Loa Bluetooth Sony", price: "450.000đ", school: "FPT Edu", image: "/p13.jpg", tag: "Tech", time: "2 ngày trước", imageCount: 4 },
  { id: 14, name: "Giá treo quần áo gỗ", price: "150.000đ", school: "KTX ĐHQG", image: "/p14.jpg", tag: "Gia dụng", time: "3 ngày trước", imageCount: 3 },
  { id: 15, name: "Sách TOEIC Economy", price: "60.000đ", school: "HUTECH", image: "/p15.jpg", tag: "Sách", time: "3 ngày trước", imageCount: 2 },
  { id: 16, name: "Thảm yoga định tuyến", price: "95.000đ", school: "ĐH Tôn Đức Thắng", image: "/p16.jpg", tag: "Gia dụng", time: "4 ngày trước", imageCount: 2 },
  { id: 17, name: "Tai nghe Marshall", price: "1.200.000đ", school: "HUTECH", image: "/p17.jpg", tag: "Tech", time: "4 ngày trước", imageCount: 5 },
  { id: 18, name: "Chảo chống dính Sunhouse", price: "50.000đ", school: "HUTECH", image: "/p18.jpg", tag: "Gia dụng", time: "5 ngày trước", imageCount: 1 },
  { id: 19, name: "Áo khoác dù Unisex", price: "85.000đ", school: "UEH", image: "/p19.jpg", tag: "Thời trang", time: "5 ngày trước", imageCount: 4 },
  { id: 20, name: "Bàn học gấp gọn", price: "45.000đ", school: "HUTECH", image: "/p20.jpg", tag: "Gia dụng", time: "6 ngày trước", imageCount: 2 },
  { id: 21, name: "Ram Laptop 8GB DDR4", price: "300.000đ", school: "ĐH Công Nghệ", image: "/p21.jpg", tag: "Tech", time: "6 ngày trước", imageCount: 1 },
  { id: 22, name: "Chân váy caro", price: "40.000đ", school: "HUTECH", image: "/p22.jpg", tag: "Thời trang", time: "1 tuần trước", imageCount: 3 },
  { id: 23, name: "Ấm siêu tốc Kim Cương", price: "75.000đ", school: "KTX ĐHQG", image: "/p23.jpg", tag: "Gia dụng", time: "1 tuần trước", imageCount: 2 },
  { id: 24, name: "Bút vẽ Wacom cũ", price: "950.000đ", school: "HUTECH", image: "/p24.jpg", tag: "Tech", time: "1 tuần trước", imageCount: 4 },
  { id: 25, name: "Kệ giày dép 5 tầng", price: "65.000đ", school: "HUTECH", image: "/p25.jpg", tag: "Gia dụng", time: "1 tuần trước", imageCount: 3 },
  { id: 26, name: "Sách Cấu trúc dữ liệu", price: "40.000đ", school: "HUTECH", image: "/p26.jpg", tag: "Sách", time: "8 ngày trước", imageCount: 2 },
  { id: 27, name: "Tai nghe Bluetooth Havit", price: "250.000đ", school: "UEH", image: "/p27.jpg", tag: "Tech", time: "8 ngày trước", imageCount: 4 },
  { id: 28, name: "Váy hoa nhí Vintage", price: "110.000đ", school: "HUTECH", image: "/p28.jpg", tag: "Thời trang", time: "9 ngày trước", imageCount: 3 },
  { id: 29, name: "Máy sấy tóc Panasonic", price: "75.000đ", school: "KTX ĐHQG", image: "/p29.jpg", tag: "Gia dụng", time: "9 ngày trước", imageCount: 1 },
  { id: 30, name: "Macbook Air M1 2020", price: "14.500.000đ", school: "FPT Edu", image: "/p30.jpg", tag: "Tech", time: "10 ngày trước", imageCount: 5 },
  { id: 31, name: "Giáo trình Marketing", price: "35.000đ", school: "UEH", image: "/p31.jpg", tag: "Sách", time: "10 ngày trước", imageCount: 2 },
  { id: 32, name: "Sạc dự phòng 20000mAh", price: "280.000đ", school: "HUTECH", image: "/p32.jpg", tag: "Tech", time: "11 ngày trước", imageCount: 3 },
  { id: 33, name: "Giày Sneaker trắng", price: "150.000đ", school: "ĐH Công Nghiệp", image: "/p33.jpg", tag: "Thời trang", time: "11 ngày trước", imageCount: 6 },
  { id: 34, name: "Kệ máy tính gỗ", price: "95.000đ", school: "HUTECH", image: "/p34.jpg", tag: "Gia dụng", time: "12 ngày trước", imageCount: 2 },
  { id: 35, name: "Nồi cơm điện mini", price: "180.000đ", school: "KTX ĐHQG", image: "/p35.jpg", tag: "Gia dụng", time: "12 ngày trước", imageCount: 4 },
  { id: 36, name: "Sách luyện thi IELTS", price: "120.000đ", school: "ĐH Ngoại Thương", image: "/p36.jpg", tag: "Sách", time: "13 ngày trước", imageCount: 3 },
  { id: 37, name: "Bàn phím Logitech K380", price: "450.000đ", school: "HUTECH", image: "/p37.jpg", tag: "Tech", time: "13 ngày trước", imageCount: 2 },
  { id: 38, name: "Quần Jeans xanh", price: "135.000đ", school: "UEH", image: "/p38.jpg", tag: "Thời trang", time: "2 tuần trước", imageCount: 4 },
  { id: 39, name: "Đèn học kẹp bàn", price: "65.000đ", school: "HUTECH", image: "/p39.jpg", tag: "Gia dụng", time: "2 tuần trước", imageCount: 1 },
  { id: 40, name: "Samsung Galaxy S22", price: "8.500.000đ", school: "ĐH Bách Khoa", image: "/p40.jpg", tag: "Điện thoại", time: "2 tuần trước", imageCount: 5 },
  { id: 41, name: "Sách Tâm lý học", price: "45.000đ", school: "HUTECH", image: "/p41.jpg", tag: "Sách", time: "3 tuần trước", imageCount: 2 },
  { id: 42, name: "Chuột gaming Dareu", price: "190.000đ", school: "FPT Edu", image: "/p42.jpg", tag: "Tech", time: "3 tuần trước", imageCount: 3 },
  { id: 43, name: "Túi đeo chéo Local", price: "85.000đ", school: "ĐH Mở", image: "/p43.jpg", tag: "Thời trang", time: "3 tuần trước", imageCount: 4 },
  { id: 44, name: "Thớt gỗ Decor", price: "35.000đ", school: "HUTECH", image: "/p44.jpg", tag: "Gia dụng", time: "1 tháng trước", imageCount: 2 },
  { id: 45, name: "Box đựng đồ đa năng", price: "25.000đ", school: "KTX ĐHQG", image: "/p45.jpg", tag: "Gia dụng", time: "1 tháng trước", imageCount: 3 },
];

const tabs = [
  { id: "foryou", label: "Dành cho bạn", extra: null },
  { id: "newest", label: "Mới nhất", extra: null },
  { id: "video", label: "Video", extra: <Sparkles size={14} className="text-blue-400 fill-blue-400" /> },
];

export default function ProductSection() {
  const [activeTab, setActiveTab] = useState("foryou");
  const [visibleCount, setVisibleCount] = useState(25);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs Header */}
        <div className="flex items-center gap-8 border-b border-gray-100 mb-8 pb-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-3 text-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id 
                ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900" 
                : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
              {tab.extra}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
          {allProducts.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < allProducts.length && (
          <div className="mt-12 text-center">
            <button 
              onClick={loadMore}
              className="px-10 py-3 rounded-full border-2 border-slate-100 font-bold text-gray-700 hover:bg-slate-50 transition-all hover:border-emerald-500 hover:text-emerald-600 cursor-pointer"
            >
              Xem Thêm
            </button>
          </div>
        )}
      </div>
    </section>
  );
}