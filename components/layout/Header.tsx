"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { toast } from "sonner";
import { 
  Menu, Search, Bell, MessageCircle,
  Heart, User, PlusCircle, BookOpen, X, Settings
} from "lucide-react";
import LocationSelector from "../shared/LocationSelector";
import CategorySelector from "../shared/CategorySelector";
import CategoryMegaMenu from "../shared/CategoryMegaMenu";
import AuthModal from "../features/auth/AuthModal";
import NotificationsDropdown from "../features/notifications/NotificationsDropdown";

import { NotificationItemData } from "@/types/notifications";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { useLocation } from "@/providers/LocationProvider";
import { getUniversities } from "@/services/universityService";
import { chatService } from "@/services/chatService";
import { UniversityResponse } from "@/types/admin";
import { buildSearchHref } from "@/lib/searchUrl";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { favoriteService } from "@/services/favoriteService";

const CHAT_WS_URL = process.env.NEXT_PUBLIC_CHAT_WS_URL || process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8686/ws';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { addToHistory } = useSearchHistory();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { totalUnreadCount, setTotalUnreadCount } = useChatStore();
  const { selectedSchool, setSelectedSchool, selectedCampus, setSelectedCampus } = useLocation();

  const wsClientRef = useRef<Client | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Sync keyword with URL search param 'q'
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  
  useEffect(() => {
    if (q !== null) {
      setKeyword(q);
    } else {
      setKeyword("");
    }
  }, [q]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItemData[]>([]);
  const [universities, setUniversities] = useState<UniversityResponse[]>([]);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Kiểm tra query param require_login từ middleware
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('require_login') === 'true' && !isAuthenticated) {
      setIsAuthModalOpen(true);
      toast.info('Vui lòng đăng nhập để tiếp tục.');
      
      // Xóa query param để tránh hiện lại khi reload
      const newParams = new URLSearchParams(window.location.search);
      newParams.delete('require_login');
      const search = newParams.toString();
      const query = search ? `?${search}` : "";
      window.history.replaceState({}, '', `${window.location.pathname}${query}`);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavoriteCount(0);
      return;
    }

    const loadFavoriteCount = async () => {
      try {
        const response = await favoriteService.getCount();
        if (response.code === 200 || response.code === 1000) {
          setFavoriteCount(response.data);
        }
      } catch (error) {
        console.error("Failed to load favorite count:", error);
      }
    };

    loadFavoriteCount();
    
    // Refresh count when custom event or focus happens
    const handleSync = () => loadFavoriteCount();
    window.addEventListener("focus", handleSync);
    window.addEventListener("favorite-count-sync", handleSync);
    return () => {
      window.removeEventListener("focus", handleSync);
      window.removeEventListener("favorite-count-sync", handleSync);
    };
  }, [isAuthenticated]);

  // Sync Unread Chat Count via REST + WebSocket
  useEffect(() => {
    if (!isAuthenticated || !user?.userId) {
      setTotalUnreadCount(0);
      return;
    }

    const userId = String(user.userId);

    // Initial load through REST
    const fetchCount = async () => {
      try {
        const count = await chatService.getTotalUnreadCount(userId);
        setTotalUnreadCount(count || 0);
      } catch (err) {
        console.warn("Could not sync initial unread count:", err);
        setTotalUnreadCount(0);
      }
    };
    fetchCount();

    // Setup WebSocket listener for real-time updates
    const client = new Client({
      webSocketFactory: () => new SockJS(CHAT_WS_URL),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      // Listener for direct messages
      client.subscribe('/user/queue/messages', (message) => {
        try {
          const msg = JSON.parse(message.body);
          // Only increment if message is from someone else and user is NOT on the chat page of that conversation
          if (String(msg.senderId) !== userId && !window.location.pathname.includes('/tin-nhan')) {
            useChatStore.getState().incrementUnreadCount();
          }
        } catch (e) { /* ignore */ }
      });

      // Listener for global unread count updates (if backend sends it)
      client.subscribe('/user/queue/unread-count-sync', (message) => {
        try {
          const count = Number(message.body);
          if (!isNaN(count)) setTotalUnreadCount(count);
        } catch (e) { /* ignore */ }
      });
    };

    client.activate();
    wsClientRef.current = client;

    // Listen to local events (e.g. from MessagesPage when marking as read)
    const handleReadSync = (e: any) => {
      if (e.detail?.count !== undefined) {
        setTotalUnreadCount(e.detail.count);
      } else {
        fetchCount();
      }
    };
    window.addEventListener('chat-unread-sync', handleReadSync);

    return () => {
      if (wsClientRef.current) wsClientRef.current.deactivate();
      window.removeEventListener('chat-unread-sync', handleReadSync);
    };
  }, [isAuthenticated, user?.userId, setTotalUnreadCount]);

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
    const loadSearchMeta = async () => {
      try {
        const universitiesData = await getUniversities();
        setUniversities(universitiesData);
      } catch (error) {
        console.error("Failed to load search metadata:", error);
      }
    };

    loadSearchMeta();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Đóng notifications dropdown
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      
      // Đóng mobile menu
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }

      // Đóng user menu
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
        setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
    router.push('/');
  };

  const handleMarkRead = (id: string) => {
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
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    if (window.innerWidth < 1024) {
      // lg breakpoint in Tailwind is 1024px
      router.push("/thong-bao");
    } else {
      setIsNotificationsOpen((prev) => !prev);
    }
  };

  const handleProtectedAction = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      router.push(path);
    }
  };

  const handleSearchSubmit = useCallback(() => {
    const normalizedKeyword = keyword.trim();
    const normalizedSchool = selectedSchool.trim();
    const normalizedCampus = selectedCampus.trim();

    const selectedUniversity = universities.find(
      (university) =>
        university.slug === normalizedSchool ||
        university.shortName === normalizedSchool ||
        university.universityName === normalizedSchool
    );

    const selectedCampusItem = universities
      .flatMap((university) =>
        (university.campuses || []).map((campus) => campus)
      )
      .find((campus) => campus.slug === normalizedCampus || campus.campusName === normalizedCampus);

    const href = buildSearchHref({
      itemSlug: undefined,
      universitySlug: selectedUniversity?.slug || undefined,
      campusSlug: selectedCampusItem?.slug || undefined,
      keyword: normalizedKeyword || undefined,
    });

    if (normalizedKeyword) {
      addToHistory(normalizedKeyword);
    }
    router.push(href);
  }, [keyword, selectedSchool, selectedCampus, universities, router, addToHistory]);

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
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 sm:p-2 bg-white/20 rounded-full hover:bg-white/30 text-gray-900 transition-colors lg:hidden cursor-pointer"
              >
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
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                handleSearchSubmit();
                              }
                            }}
                            placeholder="Tìm kiếm..."
                            className="w-full bg-transparent text-base sm:text-sm text-gray-800 placeholder-gray-400 font-medium focus:outline-none"
                        />
                        {keyword && (
                            <button onClick={() => setKeyword("")} className="text-gray-400 hover:text-gray-600 p-1">
                              <X size={14} />
                            </button>
                        )}
                      </div>

                      <button
                        onClick={handleSearchSubmit}
                        className="hidden sm:flex h-8 w-8 mr-1 rounded-md bg-[#FFBA00] hover:bg-[#ffc82a] items-center justify-center text-black transition-colors shrink-0 cursor-pointer"
                      >
                        <Search size={18} strokeWidth={2.5} />
                      </button>
                  </div>
                </div>
              )}
            </div>

            {/* --- RIGHT: Actions --- */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 z-10">
              <div className="flex items-center gap-0.5 sm:gap-1 text-gray-800">
                   <button 
                     onClick={(e) => handleProtectedAction(e, "/tin-da-luu")}
                     className="p-2 sm:px-3 sm:py-3 hover:bg-black/10 rounded-full transition-colors relative group cursor-pointer"
                   >
                      <Heart size={20} strokeWidth={2.5} />
                      {isAuthenticated && favoriteCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 sm:right-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white">
                          {favoriteCount > 99 ? '99+' : favoriteCount}
                        </span>
                      )}
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        Tin đã lưu
                      </span>
                   </button>
                 <div className="relative" ref={notificationsRef}>
                   <button
                     type="button"
                     onClick={handleBellClick}
                     className="p-2 sm:px-3 sm:py-3 hover:bg-black/10 rounded-full transition-colors relative group cursor-pointer"
                   >
                      <Bell size={20} strokeWidth={2.5} />
                      {isAuthenticated && unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 sm:right-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                   </button>

                   {isAuthenticated && isNotificationsOpen && (
                     <NotificationsDropdown
                       notifications={previewNotifications}
                       onMarkRead={handleMarkRead}
                       onMarkAllRead={handleMarkAllRead}
                       onClose={() => setIsNotificationsOpen(false)}
                     />
                   )}
                 </div>
                  <button 
                    onClick={(e) => handleProtectedAction(e, "/tin-nhan")}
                    className="group relative hidden sm:flex items-center gap-2 px-4 py-2 hover:bg-black/10 rounded-lg font-bold text-sm transition-colors text-gray-800 cursor-pointer"
                  >
                    <MessageCircle size={20} strokeWidth={2.5} />
                    {totalUnreadCount > 0 && (
                      <span className="absolute top-0.5 left-1.5 sm:left-6 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white">
                        {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                      </span>
                    )}
                    <span className="hidden xl:inline">Chat</span>
                  </button>
              </div>

              {isAuthenticated && (
                <Link
                  href="/quan-ly-tin-dang"
                  className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-gray-900 rounded-lg text-sm font-bold transition-all cursor-pointer"
                >
                  <BookOpen size={18} />
                  <span>Tin của tôi</span>
                </Link>
              )}

              <button 
                onClick={(e) => handleProtectedAction(e, "/dang-tin")}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 bg-gray-900 text-[#FFBA00] rounded-lg font-bold hover:bg-gray-800 hover:scale-105 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <PlusCircle size={18} />
                <span className="text-[10px] sm:text-sm whitespace-nowrap">ĐĂNG TIN</span>
              </button>
              {isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="hidden lg:flex items-center p-1 bg-white text-black rounded-full border border-emerald-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden ring-2 ring-transparent hover:ring-[#FFBA00]/30"
                  >
                    <Image
                      src={user.avatarUrl || "/user/avatar-user-profile-default.png"}
                      alt="avatar"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Tài khoản</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user.fullName}</p>
                      </div>
                      <Link
                        href={`/tai-khoan/${user.userId}`}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User size={16} className="text-gray-400" />
                        Hồ sơ của tôi
                      </Link>
                      <Link
                        href="/doi-mat-khau"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        Đổi mật khẩu
                      </Link>
                      {/* Admin links — chỉ hiển thị với admin */}
                      {user.roles?.some(r => ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'].includes(r)) && (
                        <>
                          <hr className="my-1 border-gray-100" />
                          <div className="px-4 py-1.5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quản trị</p>
                          </div>
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 font-medium transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings size={16} className="text-orange-500" />
                            Admin Dashboard
                          </Link>
                        </>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium cursor-pointer transition-colors text-left"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <User size={18} />
                  <span>Tài khoản</span>
                </button>
              )}
            </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {/* --- MOBILE SIDEBAR MENU --- */}
      <div 
        className={`fixed inset-0 z-60 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        
        {/* Sidebar Content */}
        <div 
          ref={mobileMenuRef}
          className={`absolute top-0 left-0 bottom-0 w-70 bg-white transition-transform duration-300 ease-out shadow-2xl flex flex-col ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header Sidebar */}
          <div className="p-5 flex flex-col gap-4 border-b border-gray-100 bg-[#8cceae]">
            <div className="flex items-center justify-between">
              <Image src="/logo/lum-logo.png" alt="Logo" width={80} height={32} />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 bg-white/20 rounded-full text-gray-900 hover:bg-white/30"
              >
                <X size={20} />
              </button>
            </div>

            {isAuthenticated && user && (
              <div className="flex items-center gap-3 p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Image 
                  src={user.avatarUrl || "/user/avatar-user-profile-default.png"} 
                  alt="Avatar" 
                  width={44} 
                  height={44} 
                  className="w-11 h-11 rounded-full border-2 border-white object-cover"
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-medium text-gray-800 tracking-wide uppercase">Xin chào,</span>
                  <span className="text-base font-bold text-gray-900 truncate">{user.fullName}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Quick Links */}
            <div className="space-y-1">
              <Link href="/dang-tin" className="flex items-center gap-3 p-3 rounded-xl bg-gray-900 text-[#FFBA00] font-bold">
                <PlusCircle size={20} />
                <span>ĐĂNG TIN NGAY</span>
              </Link>
            </div>

            {/* Main Navigation */}
            <div className="space-y-4">
               <div>
                 <h3 className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Cá nhân</h3>
                 <div className="space-y-1">
                    {isAuthenticated && (
                      <Link href={`/tai-khoan/${user?.userId}`} className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors">
                        <User size={20} className="text-gray-400" />
                        <span>Hồ sơ của tôi</span>
                      </Link>
                    )}
                    <button 
                      onClick={(e) => { setIsMobileMenuOpen(false); handleProtectedAction(e, "/quan-ly-tin-dang"); }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors text-left"
                    >
                      <BookOpen size={20} className="text-gray-400" />
                      <span>Tin của tôi</span>
                    </button>
                    <button 
                      onClick={(e) => { setIsMobileMenuOpen(false); handleProtectedAction(e, "/tin-nhan"); }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors text-left"
                    >
                      <MessageCircle size={20} className="text-gray-400" />
                      <span>Tin nhắn</span>
                    </button>
                    <button 
                      onClick={(e) => { setIsMobileMenuOpen(false); handleProtectedAction(e, "/tin-da-luu"); }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors text-left"
                    >
                      <Heart size={20} className="text-gray-400" />
                      <span>Tin đã lưu</span>
                    </button>
                 </div>
               </div>

               <div>
                 <h3 className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Hệ thống</h3>
                 <div className="space-y-1">
                    <button 
                      onClick={(e) => { setIsMobileMenuOpen(false); handleProtectedAction(e, "/thong-bao"); }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors text-left"
                    >
                      <Bell size={20} className="text-gray-400" />
                      <span>Thông báo</span>
                    </button>
                    
                    {!isAuthenticated && (
                      <button 
                        onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors text-left"
                      >
                        <User size={20} className="text-gray-400" />
                        <span>Tài khoản</span>
                      </button>
                    )}
                    {isAuthenticated && user?.roles?.some(r => ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'].includes(r)) && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-orange-50 font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings size={20} className="text-orange-500" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                 </div>
               </div>
            </div>

            {/* Other Links */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <a href="#" className="block px-3 py-2 text-sm text-gray-500 hover:text-gray-900">Về chúng tôi</a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-500 hover:text-gray-900">Quy định đăng tin</a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-500 hover:text-gray-900">Blog sinh viên</a>
            </div>
          </div>

          {/* Bottom Action: Logout */}
          {isAuthenticated && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 font-bold transition-all border border-red-100 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
