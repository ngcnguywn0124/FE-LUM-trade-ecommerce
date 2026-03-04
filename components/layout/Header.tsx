"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Menu, Search, Bell, MessageCircle,
  Heart, User, PlusCircle, BookOpen, X
} from "lucide-react";
import LocationSelector from "../shared/LocationSelector";
import CategorySelector from "../shared/CategorySelector";
import CategoryMegaMenu from "../shared/CategoryMegaMenu";
import AuthModal from "../features/auth/AuthModal";
import NotificationsDropdown from "../features/notifications/NotificationsDropdown";
import { mockNotifications } from "@/lib/mockNotifications";
import { NotificationItemData } from "@/types/notifications";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItemData[]>(mockNotifications);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  // State cho Trường và Cơ sở
  const [selectedSchool, setSelectedSchool] = useState("HUTECH");
  const [selectedCampus, setSelectedCampus] = useState("");

  // Kiểm tra xem có đang ở trang chủ không
  const isHomePage = pathname === "/";

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  const previewNotifications = useMemo(
    () =>
      [...notifications]
        .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
        .slice(0, 5),
    [notifications]
  );

  // Xử lý sticky header khi cuộn
  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    
    // Kiểm tra ngay khi load trang
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!notificationsRef.current) return;
      if (!notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setIsNotificationsOpen(false);
  }, [pathname]);

  const handleMarkRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isRead: true,
            }
          : item
      )
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const handleBellClick = () => {
    if (window.innerWidth < 1024) {
      // lg breakpoint in Tailwind is 1024px
      router.push("/thong-bao");
    } else {
      setIsNotificationsOpen((prev) => !prev);
    }
  };

  return (
    <div className="flex flex-col w-full font-sans">
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            !isHomePage || isScrolled ? "shadow-md bg-[#8cceae]" : "bg-[#b8f3d700]"
        } py-3`}
      >
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4 h-12">
            
            {/* --- LEFT: Logo & Hamburger --- */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 z-10">
              <button className="p-1.5 sm:p-2 bg-white/20 rounded-full hover:bg-white/30 text-gray-900 transition-colors lg:hidden">
                <Menu size={20} />
              </button>
              
              <Link href="/" className={`${isScrolled ? "hidden sm:flex" : "flex"} items-center gap-1 group transition-transform duration-300 hover:scale-105 active:scale-95`}>
                 <Image 
                    src="/logo/lum-logo.png" 
                    alt="Lụm Logo" 
                    width={100} 
                    height={40} 
                    className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 transform -rotate-2 group-hover:rotate-2"
                    priority
                 />
              </Link>

              <div className={isScrolled ? "hidden md:block" : "block"}>
                <CategoryMegaMenu />
              </div>
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
                <div className="flex flex-1 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="w-full flex items-center h-10 sm:h-10 bg-white rounded-lg shadow-sm border border-transparent focus-within:border-black/20 focus-within:shadow-md transition-all">
                      
                      <LocationSelector 
                        variant="sticky"
                        selectedSchool={selectedSchool}
                        setSelectedSchool={setSelectedSchool}
                        selectedCampus={selectedCampus}
                        setSelectedCampus={setSelectedCampus}
                      />

                      <div className="flex-1 flex items-center px-3 h-full">
                        <Search size={16} className="text-gray-400 mr-2 md:hidden" />
                        <input 
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Tìm kiếm..."
                            className="w-full bg-transparent text-base sm:text-sm text-gray-800 placeholder-gray-400 font-medium focus:outline-none"
                        />
                        {keyword && (
                            <button onClick={() => setKeyword("")} className="text-gray-400 hover:text-gray-600 p-1">
                              <X size={14} />
                            </button>
                        )}
                      </div>

                      <button className="hidden sm:flex h-8 w-8 mr-1 rounded-md bg-[#FFBA00] hover:bg-[#ffc82a] items-center justify-center text-black transition-colors shrink-0">
                        <Search size={18} strokeWidth={2.5} />
                      </button>
                  </div>
                </div>
              )}
            </div>

            {/* --- RIGHT: Actions --- */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 z-10">
              <div className="flex items-center gap-0.5 sm:gap-1 text-gray-800">
                 <Link 
                   href="/tin-da-luu" 
                   className="p-2 sm:px-3 sm:py-3 hover:bg-black/10 rounded-full transition-colors relative group cursor-pointer"
                 >
                    <Heart size={20} strokeWidth={2.5} />
                 </Link>
                 <div className="relative" ref={notificationsRef}>
                   <button
                     type="button"
                     onClick={handleBellClick}
                     className="p-2 sm:px-3 sm:py-3 hover:bg-black/10 rounded-full transition-colors relative group cursor-pointer"
                   >
                      <Bell size={20} strokeWidth={2.5} />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 sm:right-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                   </button>

                   {isNotificationsOpen && (
                     <NotificationsDropdown
                       notifications={previewNotifications}
                       onMarkRead={handleMarkRead}
                       onMarkAllRead={handleMarkAllRead}
                       onClose={() => setIsNotificationsOpen(false)}
                     />
                   )}
                 </div>
                  <Link href="/tin-nhan" className="hidden sm:flex items-center gap-2 px-4 py-2 hover:bg-black/10 rounded-lg font-bold text-sm transition-colors text-gray-800 cursor-pointer">
                    <MessageCircle size={20} strokeWidth={2.5} />
                    <span className="hidden xl:inline">Chat</span>
                  </Link>
              </div>

              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                 <User size={18} />
                 <span>Tài khoản</span>
              </button>

              <Link
                href="/quan-ly-tin-dang"
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-gray-900 rounded-lg text-sm font-bold transition-all cursor-pointer"
              >
                <BookOpen size={18} />
                <span>Tin của tôi</span>
              </Link>

              <Link 
                href="/dang-tin"
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 bg-gray-900 text-[#FFBA00] rounded-lg font-bold hover:bg-gray-800 hover:scale-105 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                 <PlusCircle size={18} />
                 <span className="text-[10px] sm:text-sm whitespace-nowrap">ĐĂNG TIN</span>
              </Link>
            </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
