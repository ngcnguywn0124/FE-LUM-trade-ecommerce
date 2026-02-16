import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Facebook, Instagram, Youtube, Send, 
  MapPin, Phone, Mail, ShieldCheck, Heart, Star 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#111111] text-white pt-16 pb-8 font-sans border-t-4 border-[#8cceae]">
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- PHẦN 1: CALL TO ACTION & NEWSLETTER --- */}
        <div className="flex flex-col lg:flex-row items-center justify-between bg-[#1A1A1A] p-8 rounded-2xl mb-16 shadow-2xl border border-[#8cceae]">
            <div className="mb-6 lg:mb-0 text-center lg:text-left">
                <h3 className="text-2xl font-bold mb-2">Đăng ký nhận tin từ Lụm.vn</h3>
                <p className="text-gray-400">Nhận thông báo về deal hời, giáo trình free và sự kiện sinh viên.</p>
            </div>
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                <div className="relative">
                    <input 
                        type="email" 
                        placeholder="Email của bạn..." 
                        className="w-full sm:w-80 bg-[#2A2A2A] border border-[#8cceae]/90 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#FFBA00] transition-colors"
                    />
                    <Mail className="absolute right-3 top-3.5 text-gray-500" size={20} />
                </div>
                <button className="bg-[#FFBA00] text-black font-bold px-6 py-3 rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <Send size={18} />
                    <span>Đăng ký</span>
                </button>
            </div>
        </div>

        {/* --- PHẦN 2: MAIN LINKS GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 border-b border-gray-800 pb-10 md:pb-16">
          
          {/* Cột 1: Brand Info (Full width on mobile) */}
          <div className="col-span-2 lg:col-span-4 space-y-6">
            <h4 className="text-lg font-bold text-[#FFBA00] uppercase tracking-wider">Về chúng tôi</h4>
            <p className="text-gray-400 leading-relaxed pr-4 text-sm md:text-base">
              Lụm.vn là nền tảng kết nối cộng đồng sinh viên, giúp việc mua bán đồ cũ trở nên an toàn, nhanh chóng và tiết kiệm. "Cũ người mới ta" - Lan tỏa giá trị xanh trong môi trường đại học.
            </p>
            <div className="flex gap-4">
               {/* Các chỉ số uy tín */}
               <div className="flex items-center gap-2 bg-[#222] px-3 py-2 rounded-lg border border-gray-800">
                  <ShieldCheck className="text-[#FFBA00]" size={20}/>
                  <div className="text-xs">
                     <div className="font-bold text-white">100%</div>
                     <div className="text-gray-500">Xác thực SV</div>
                  </div>
               </div>
               <div className="flex items-center gap-2 bg-[#222] px-3 py-2 rounded-lg border border-gray-800">
                  <Star className="text-[#FFBA00]" size={20}/>
                  <div className="text-xs">
                     <div className="font-bold text-white">4.9/5</div>
                     <div className="text-gray-500">Đánh giá</div>
                  </div>
               </div>
            </div>
          </div>

          {/* Cột 2: Links (Half width on mobile) */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <h4 className="text-lg font-bold text-white">Khám phá</h4>
            <ul className="space-y-3 text-gray-400 text-sm md:text-base">
              <li><Link href="#" className="hover:text-[#FFBA00] transition-colors">Giáo trình</Link></li>
              <li><Link href="#" className="hover:text-[#FFBA00] transition-colors">Đồ công nghệ</Link></li>
              <li><Link href="#" className="hover:text-[#FFBA00] transition-colors">Xe cộ</Link></li>
              <li><Link href="#" className="hover:text-[#FFBA00] transition-colors">Thời trang</Link></li>
              <li><Link href="#" className="hover:text-[#FFBA00] transition-colors">Phụ kiện</Link></li>
            </ul>
          </div>

          {/* Cột 3: Links (Half width on mobile) */}
          <div className="col-span-1 lg:col-span-3 space-y-6">
            <h4 className="text-lg font-bold text-white">Chính sách & Hỗ trợ</h4>
            <ul className="space-y-3 text-gray-400 text-sm md:text-base">
              <li><Link href="#" className="hover:text-[#FFBA00] transition-colors">Trung tâm trợ giúp</Link></li>
              <li><Link href="#" className="hover:text-[#FFBA00] transition-colors">Quy chế hoạt động</Link></li>
              <li><Link href="#" className="hover:text-[#FFBA00] transition-colors">Bảo mật thông tin</Link></li>
              <li><Link href="#" className="hover:text-[#FFBA00] transition-colors">Giải quyết khiếu nại</Link></li>
            </ul>
          </div>

          {/* Cột 4: Contact (Full width on mobile) */}
          <div className="col-span-2 lg:col-span-3 space-y-6">
            <h4 className="text-lg font-bold text-white">Liên hệ</h4>
            <ul className="space-y-4 text-gray-400 text-sm md:text-base">
              <li className="flex items-start gap-3">
                <MapPin className="text-[#FFBA00] mt-1 shrink-0" size={18} />
                <span>Trụ sở chính: Khu Công nghệ cao, TP. Thủ Đức, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-[#FFBA00] shrink-0" size={18} />
                <span className="text-lg font-bold text-white">1900 1234</span>
              </li>
              <li className="flex gap-4 mt-4">
                 <SocialIcon icon={<Facebook size={18}/>} />
                 <SocialIcon icon={<Instagram size={18}/>} />
                 <SocialIcon icon={<Youtube size={18}/>} />
              </li>
            </ul>
          </div>
        </div>

        {/* --- COPYRIGHT --- */}
        <div className="pt-12 pb-8 flex flex-col md:flex-row items-center justify-center gap-2 text-gray-500 text-sm font-medium">
            <span>© 2026 Công ty TNHH mụt thành viên Hehehe.</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1">
                Design <Heart size={12} className="text-red-500 fill-red-500" /> by nguyenquyngoc
            </span>
        </div>

      </div>
    </footer>
  );
};

// Sub-component cho nút Social
const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
    <a href="#" className="w-10 h-10 rounded-full bg-[#2A2A2A] text-white flex items-center justify-center hover:bg-[#FFBA00] hover:text-black hover:-translate-y-1 transition-all duration-300">
        {icon}
    </a>
);

export default Footer;