import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-[#8cceae] text-gray-900 pt-20 pb-10 overflow-hidden font-sans">
      
      {/* --- Decoration: Đường cong mềm mại nối giữa nội dung và Footer --- */}
      <div className="absolute top-0 left-0 right-0 -mt-1">
        <svg viewBox="0 0 1440 320" className="w-full h-auto block text-white fill-current transform rotate-180">
          <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* --- Phần 1: Grid Links & Thông tin --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-20">
          
          {/* Cột 1: Giới thiệu */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black uppercase tracking-tighter">Về Lụm.vn</h3>
            <p className="font-medium text-gray-800 leading-relaxed">
              Sàn thương mại điện tử dành riêng cho sinh viên. Nơi mua bán, trao đổi giáo trình, đồ dùng học tập và trọ giá rẻ uy tín nhất.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialButton icon={<Facebook size={20} />} href="#" />
              <SocialButton icon={<Instagram size={20} />} href="#" />
              <SocialButton icon={<Youtube size={20} />} href="#" />
            </div>
          </div>

          {/* Cột 2: Hỗ trợ */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold uppercase">Hỗ trợ sinh viên</h3>
            <ul className="space-y-2 font-medium text-gray-800">
              <li><FooterLink href="#">Quy chế hoạt động</FooterLink></li>
              <li><FooterLink href="#">Chính sách bảo mật</FooterLink></li>
              <li><FooterLink href="#">Giải quyết tranh chấp</FooterLink></li>
              <li><FooterLink href="#">Câu hỏi thường gặp (FAQ)</FooterLink></li>
            </ul>
          </div>

          {/* Cột 3: Danh mục hot */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold uppercase">Khám phá</h3>
            <ul className="space-y-2 font-medium text-gray-800">
              <li><FooterLink href="#">Giáo trình cũ</FooterLink></li>
              <li><FooterLink href="#">Laptop sinh viên</FooterLink></li>
              <li><FooterLink href="#">Xe máy đi học</FooterLink></li>
              <li><FooterLink href="#">Tìm người ở ghép</FooterLink></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold uppercase">Liên hệ</h3>
            <ul className="space-y-3 font-medium text-gray-800">
              <li className="flex items-start gap-3">
                <MapPin className="shrink-0 mt-1" size={18} />
                <span>Khu Công nghệ cao, TP. Thủ Đức, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="shrink-0" size={18} />
                <span>0909.999.999 (Hotline 24/7)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="shrink-0" size={18} />
                <span>cskh@lum.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* --- Phần 2: BIG LOGO AREA (Điểm nhấn) --- */}
        <div className="flex flex-col items-center justify-center border-t border-black/10 pt-16 pb-8">
          <p className="text-sm font-bold tracking-widest uppercase mb-6 opacity-60">Sản phẩm của sinh viên HUTECH</p>
          
          {/* Logo to ở đây */}
          <div className="relative w-64 md:w-96 transition-transform duration-500 hover:scale-105">
             <Image 
                src="/logo/lum-logo.png" 
                alt="Lụm.vn Logo Footer" 
                width={500} 
                height={200} 
                className="w-full h-auto drop-shadow-2xl"
             />
          </div>

          <p className="mt-8 text-sm font-semibold opacity-70">
            © 2025 Lụm.vn. All rights reserved. Design by nguyenquyngoc.
          </p>
        </div>

      </div>

      {/* Background Pattern trang trí mờ mờ */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

    </footer>
  );
};

// Component con cho Link
const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link href={href} className="flex items-center gap-1 hover:gap-2 hover:text-black transition-all group">
    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    {children}
  </Link>
);

// Component con cho Social Button
const SocialButton = ({ icon, href }: { icon: React.ReactNode, href: string }) => (
  <a href={href} className="w-10 h-10 bg-black text-[#8cceae] rounded-full flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all shadow-lg">
    {icon}
  </a>
);

export default Footer;