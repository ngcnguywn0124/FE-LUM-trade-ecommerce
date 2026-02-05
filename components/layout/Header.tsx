"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Menu, Search, MapPin, Bell, MessageCircle, 
  Heart, User, ChevronDown, PlusCircle, Laptop, BookOpen, Home, X
} from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Xử lý sticky header khi cuộn
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const categories = [
    { id: 'giaotrinh', label: 'Giáo trình', icon: <BookOpen size={16} /> },
    { id: 'dientu', label: 'Đồ điện tử', icon: <Laptop size={16} /> },
    { id: 'phongtro', label: 'Phòng trọ', icon: <Home size={16} /> },
  ];

  return (
    <div className="flex flex-col w-full font-sans">
      
      {/* =========================================================================
          PHẦN 1: TOP NAVIGATION (Thanh điều hướng trên cùng)
          - Luôn cố định (Sticky)
          - Màu Vàng đặc trưng giống ảnh
      ========================================================================= */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled ? "shadow-md bg-[#8cceae]" : "bg-[#b8f3d700]"
        } py-3`}
      >
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-10">
            
            {/* --- LEFT: Logo & Hamburger --- */}
            <div className="flex items-center gap-3 shrink-0 z-10">
              <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 text-gray-900 transition-colors lg:hidden">
                <Menu size={20} />
              </button>
              
              <Link href="/" className="flex items-center gap-1 group transition-transform duration-300 hover:scale-105 active:scale-95">
                 <Image 
                    src="/logo/lum-logo.png" 
                    alt="Lụm Logo" 
                    width={100} 
                    height={40} 
                    className="h-9 w-auto object-contain transition-transform duration-300 transform -rotate-2 group-hover:rotate-2"
                    priority
                 />
              </Link>

              <div className="hidden lg:flex items-center gap-1 text-sm font-bold text-gray-800 cursor-pointer hover:bg-black/10 px-4 py-2 rounded-lg transition-colors">
                <span>Danh mục</span>
                <ChevronDown size={14} />
              </div>
            </div>

            {/* --- CENTER: Danh mục nhanh (Chưa scroll) OR Thanh Search (Đã scroll) --- */}
            <div className="flex-1 flex justify-center items-center">
              {!isScrolled ? (
                /* CENTER: Danh mục nhanh (Khi ở Top) */
                <div className="hidden xl:flex items-center space-x-10 text-sm font-bold text-gray-800">
                  <a href="#" className="hover:text-white transition-colors">Lụm</a>
                  <a href="#" className="hover:text-white transition-colors">Về chúng tôi</a>
                  <a href="#" className="hover:text-white transition-colors">Xếp hạng</a>
                  <a href="#" className="hover:text-white transition-colors">Blog</a>
                </div>
              ) : (
                /* CENTER: THANH SEARCH (Khi cuộn xuống) */
                <div className="hidden md:flex flex-1 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="w-full flex items-center h-10 bg-white rounded-lg shadow-sm border border-transparent focus-within:border-black/20 focus-within:shadow-md transition-all">
                      
                      <button className="flex items-center gap-1 px-3 h-full border-r border-gray-100 hover:bg-gray-50 rounded-l-lg transition-colors group shrink-0">
                        <MapPin size={16} className="text-orange-600 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold text-gray-700 whitespace-nowrap">TP Hồ Chí Minh</span>
                        <ChevronDown size={14} className="text-gray-400" />
                      </button>

                      <div className="flex-1 flex items-center px-3 h-full">
                        <input 
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Tìm bàn học, giáo trình..."
                            className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 font-medium focus:outline-none"
                        />
                        {keyword && (
                            <button onClick={() => setKeyword("")} className="text-gray-400 hover:text-gray-600 p-1">
                              <X size={14} />
                            </button>
                        )}
                      </div>

                      <button className="h-8 w-8 mr-1 rounded-md bg-[#FFBA00] hover:bg-[#ffc82a] flex items-center justify-center text-black transition-colors shrink-0">
                        <Search size={18} strokeWidth={2.5} />
                      </button>
                  </div>
                </div>
              )}
            </div>

            {/* --- RIGHT: Actions --- */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 z-10">
              <div className="flex items-center gap-1 text-gray-800">
                 <button className="px-3 py-3 hover:bg-black/10 rounded-full transition-colors relative group">
                    <Heart size={20} strokeWidth={2.5} />
                 </button>
                 <button className="px-3 py-3 hover:bg-black/10 rounded-full transition-colors relative group">
                    <Bell size={20} strokeWidth={2.5} />
                    <span className="absolute top-2 right-4 w-2 h-2 bg-red-600 rounded-full border border-[#FFBA00]"></span>
                 </button>
                 <button className="hidden sm:flex items-center gap-2 px-4 py-2 hover:bg-black/10 rounded-lg font-bold text-sm transition-colors">
                    <MessageCircle size={20} strokeWidth={2.5} />
                    <span className="hidden xl:inline">Chat</span>
                 </button>
              </div>

              <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all">
                 <User size={18} />
                 <span>Tài khoản</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-[#FFBA00] rounded-lg font-bold text-sm hover:bg-gray-800 hover:scale-105 transition-all shadow-lg">
                 <PlusCircle size={18} />
                 <span className="hidden sm:inline">ĐĂNG TIN</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* =========================================================================
          PHẦN 2: HERO SECTION & SEARCH BAR (Khu vực Tìm kiếm lớn)
          - Nằm dưới Navbar
          - Có background vàng nối tiếp
      ========================================================================= */}
      <div className="pt-24 pb-16 bg-linear-to-b from-[#8cceae] to-[#b8f3d7]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
               
               {/* Slogan & Intro Text */}
               <div className="text-center lg:text-left space-y-2 max-w-lg">
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                    Cũ người mới ta, <br/>
                    <span className="text-orange-700">Sinh viên</span> chốt giá! 
                  </h1>
                  <p className="text-gray-800 font-medium">Sàn thương mại điện tử dành riêng cho HUTECH-ers</p>
               </div>

               {/* 3D Illustration Placeholder (Trang trí) */}
               {/* Bạn có thể thay thế bằng thẻ <img /> thật */}
               <div className="hidden lg:block absolute right-10 top-24 opacity-20 pointer-events-none">
                  <Laptop size={120} strokeWidth={1} />
               </div>

               {/* --- SEARCH BAR "SUPER APP" STYLE --- */}
               <div className="w-full lg:max-w-3xl">
                  {/* The White Box Container */}
                  <div className="bg-white p-1.5 rounded-xl shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                     
                     {/* 1. Category Dropdown */}
                     <div className="relative sm:w-40 shrink-0">
                        <button 
                           onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                           className="w-full h-10 sm:h-12 px-3 flex items-center justify-between hover:bg-gray-50 rounded-lg text-gray-700 font-bold text-sm transition-colors"
                        >
                           <span className="truncate">
                              {selectedCategories.length > 0 
                                 ? `Đã chọn (${selectedCategories.length})` 
                                 : "Danh mục"}
                           </span>
                           <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isCategoryOpen && (
                           <>
                              {/* Overlay đóng dropdown khi click ra ngoài */}
                              <div 
                                 className="fixed inset-0 z-30" 
                                 onClick={() => setIsCategoryOpen(false)}
                              ></div>
                              
                              <div className="absolute top-full left-0 w-64 bg-white shadow-2xl rounded-xl mt-2 p-3 border border-gray-100 z-40 animate-in fade-in zoom-in-95 duration-200">
                                 <div className="text-[10px] font-black text-gray-400 mb-2 px-2 uppercase tracking-widest">Lọc theo danh mục</div>
                                 <div className="space-y-0.5">
                                    {categories.map((cat) => (
                                       <label 
                                          key={cat.id}
                                          className="flex items-center gap-3 p-2 hover:bg-[#b8f3d7]/20 rounded-lg cursor-pointer transition-all group"
                                       >
                                          <div className="relative flex items-center h-5">
                                             <input 
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat.label)}
                                                onChange={() => toggleCategory(cat.label)}
                                                className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                                             />
                                          </div>
                                          <div className="flex items-center gap-2 text-gray-700 font-bold text-sm group-hover:text-emerald-700">
                                             <span className="text-gray-400 group-hover:text-emerald-600 transition-colors">
                                                {cat.icon}
                                             </span>
                                             <span>{cat.label}</span>
                                          </div>
                                       </label>
                                    ))}
                                 </div>
                                 
                                 {selectedCategories.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-50">
                                       <button 
                                          onClick={() => setSelectedCategories([])}
                                          className="w-full py-1.5 text-xs text-gray-500 hover:text-emerald-600 font-bold transition-colors"
                                       >
                                          Làm mới lựa chọn
                                       </button>
                                    </div>
                                 )}
                              </div>
                           </>
                        )}
                     </div>

                     {/* 2. Input Field */}
                     <div className="flex-1 flex items-center px-3 h-10 sm:h-12 bg-gray-50 sm:bg-white rounded-lg sm:rounded-none">
                        <Search size={18} className="text-gray-400 mr-2 shrink-0" />
                        <input 
                           type="text" 
                           placeholder="Tìm MacBook, sách Triết, tủ lạnh..." 
                           className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-500 text-sm font-medium"
                        />
                     </div>

                     {/* 3. Location Selector */}
                     <button className="hidden sm:flex items-center gap-1 px-4 h-12 text-gray-600 hover:text-orange-600 font-semibold text-sm transition-colors whitespace-nowrap shrink-0">
                        <MapPin size={16} />
                        <span>TP Hồ Chí Minh</span>
                     </button>

                     {/* 4. Search Button (Yellow) */}
                     <button className="bg-[#FFBA00] hover:bg-[#ffc82a] text-black font-bold h-10 sm:h-full px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95">
                        Tìm kiếm
                     </button>
                  </div>

                  {/* Quick Tags (Dưới thanh search) */}
                  <div className="mt-3 flex flex-wrap gap-2 justify-center lg:justify-start">
                     {['Mac Mini M4', 'Màn hình 24"', 'Bàn học', 'Quạt máy'].map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-white/60 hover:bg-white text-xs font-semibold text-gray-800 rounded-full cursor-pointer transition-colors backdrop-blur-sm">
                           ⏱ {tag}
                        </span>
                     ))}
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default Header;