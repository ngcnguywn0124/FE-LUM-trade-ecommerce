"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Menu, Search, MapPin, Bell, MessageCircle, 
  Heart, User, ChevronDown, PlusCircle, Laptop, BookOpen, Home, X, ArrowLeft
} from "lucide-react";
import LocationSelector from "../shared/LocationSelector";
import CategorySelector from "../shared/CategorySelector";
import CategoryMegaMenu from "../shared/CategoryMegaMenu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // State cho Trường và Cơ sở
  const [selectedSchool, setSelectedSchool] = useState("HUTECH");
  const [selectedCampus, setSelectedCampus] = useState("");

  // Xử lý sticky header khi cuộn
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

              <CategoryMegaMenu />
            </div>

            {/* --- CENTER: Danh mục nhanh (Chưa scroll) OR Thanh Search (Đã scroll) --- */}
            <div className="flex-1 flex justify-center items-center">
              {!isScrolled ? (
                /* CENTER: Danh mục nhanh (Khi ở Top) */
                <div className="hidden xl:flex items-center space-x-10 text-sm font-heading font-bold text-gray-800">
                  <a href="#" className="hover:text-white transition-colors">Lụm</a>
                  <a href="#" className="hover:text-white transition-colors">Về chúng tôi</a>
                  <a href="#" className="hover:text-white transition-colors">Xếp hạng</a>
                  <a href="#" className="hover:text-white transition-colors">Blog</a>
                </div>
              ) : (
                /* CENTER: THANH SEARCH (Khi cuộn xuống) */
                <div className="hidden md:flex flex-1 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="w-full flex items-center h-10 bg-white rounded-lg shadow-sm border border-transparent focus-within:border-black/20 focus-within:shadow-md transition-all">
                      
                      <LocationSelector 
                        variant="sticky"
                        selectedSchool={selectedSchool}
                        setSelectedSchool={setSelectedSchool}
                        selectedCampus={selectedCampus}
                        setSelectedCampus={setSelectedCampus}
                      />

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
                    <span className="absolute top-2 right-3 w-2 h-2 bg-red-600 rounded-full border border-[#FFBA00]"></span>
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
                     <CategorySelector 
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                     />

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
                     <LocationSelector 
                        variant="hero"
                        selectedSchool={selectedSchool}
                        setSelectedSchool={setSelectedSchool}
                        selectedCampus={selectedCampus}
                        setSelectedCampus={setSelectedCampus}
                     />

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