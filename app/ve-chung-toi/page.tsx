"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Shield, 
  Zap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  MessageCircle,
  Instagram
} from "lucide-react";

const AboutPage = () => {
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    posts: 0,
    schools: 0,
    transactions: 0
  });
  const features = [
    {
      icon: Shield,
      title: "An toàn & Tin cậy",
      description: "Hệ thống xác thực người dùng và kiểm duyệt tin đăng nghiêm ngặt"
    },
    {
      icon: Zap,
      title: "Nhanh chóng & Tiện lợi",
      description: "Đăng tin và tìm kiếm sản phẩm chỉ trong vài phút"
    },
    {
      icon: Users,
      title: "Cộng đồng sinh viên",
      description: "Kết nối hàng nghìn sinh viên trên khắp các trường"
    },
    {
      icon: Heart,
      title: "Hoàn toàn miễn phí",
      description: "Không mất phí đăng tin, không phí giao dịch"
    }
  ];

  const team = [
    {
      name: "Nguyễn Quý Ngọc",
      role: "Team Leader",
      image: "/profile/Avatar2.jpeg",
      description: "Sinh viên năm 4 - Khoa Công nghệ Thông tin"
    },
    {
      name: "Thân Quang Tuân",
      role: "Developer",
      image: "/profile/Avatar1.jpeg",
      description: "Sinh viên năm 4 - Khoa Công nghệ Thông tin"
    },
    {
      name: "Lê Huỳnh Công Vinh",
      role: "Developer",
      image: "/profile/Avatar3.png",
      description: "Sinh viên năm 4 - Khoa Công nghệ Thông tin"
    }
  ];

  const stats = [
    { number: 10000, label: "Người dùng", key: "users" },
    { number: 50000, label: "Tin đăng", key: "posts" },
    { number: 15, label: "Trường học", key: "schools" },
    { number: 100000, label: "Giao dịch thành công", key: "transactions" }
  ];

  // Intersection Observer để phát hiện khi stats section hiển thị
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isStatsVisible) {
            setIsStatsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [isStatsVisible]);

  // Animation cho số liệu thống kê
  useEffect(() => {
    if (!isStatsVisible) return;

    const duration = 2000; // 2 giây
    const frameDuration = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameDuration);

    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedStats({
        users: Math.floor(10000 * easeOutQuart),
        posts: Math.floor(50000 * easeOutQuart),
        schools: Math.floor(15 * easeOutQuart),
        transactions: Math.floor(100000 * easeOutQuart)
      });

      if (frame === totalFrames) {
        clearInterval(counter);
        setAnimatedStats({
          users: 10000,
          posts: 50000,
          schools: 15,
          transactions: 100000
        });
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [isStatsVisible]);

  const formatNumber = (num: number, key: string) => {
    if (key === "schools") {
      return `${num}+`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1).replace('.0', '')}K+`;
    }
    return `${num}+`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf7] to-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Image 
                src="/logo/lum-logo.png" 
                alt="Lụm Logo" 
                width={180} 
                height={72}
                className="transform hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Về chúng tôi
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Nền tảng mua bán, trao đổi hàng hoá dành riêng cho sinh viên - 
            Nơi kết nối cộng đồng sinh viên thông qua việc chia sẻ và tái sử dụng
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-[#8cceae]/20 hover:border-[#8cceae] transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#8cceae]/20 rounded-xl">
                <Target className="text-[#8cceae]" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Sứ mệnh</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Tạo ra một không gian an toàn, tiện lợi và miễn phí để sinh viên có thể 
              mua bán, trao đổi đồ dùng học tập, sách vở, đồ điện tử và các vật dụng cá nhân. 
              Chúng tôi tin rằng việc tái sử dụng không chỉ giúp tiết kiệm chi phí mà còn 
              góp phần bảo vệ môi trường.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-[#FFBA00]/20 hover:border-[#FFBA00] transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#FFBA00]/20 rounded-xl">
                <Eye className="text-[#FFBA00]" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Tầm nhìn</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Trở thành nền tảng mua bán số 1 dành cho sinh viên Việt Nam, 
              kết nối hàng triệu sinh viên trên toàn quốc. Xây dựng một cộng đồng 
              nơi mọi người có thể chia sẻ, giúp đỡ lẫn nhau và tạo nên những giá trị 
              bền vững cho xã hội.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            Tại sao chọn Lụm?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="p-3 bg-gradient-to-br from-[#8cceae]/20 to-[#FFBA00]/20 rounded-xl w-fit mb-4">
                  <feature.icon className="text-gray-900" size={24} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="bg-gradient-to-r from-[#8cceae] to-[#6fb896] rounded-2xl shadow-xl p-8 sm:p-12 mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-10">
            Lụm trong con số
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {formatNumber(animatedStats[stat.key as keyof typeof animatedStats], stat.key)}
                </div>
                <div className="text-white/90 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Đội ngũ của chúng tôi
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Chúng tôi là nhóm sinh viên đam mê công nghệ và mong muốn tạo ra 
            giá trị cho cộng đồng sinh viên
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-square bg-gradient-to-br from-[#8cceae]/20 to-[#FFBA00]/20 flex items-center justify-center relative overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#8cceae] font-medium text-sm mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border-2 border-gray-100">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Liên hệ với chúng tôi
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <a 
              href="mailto:support@lumtrade.vn"
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-[#8cceae]/10 transition-colors group"
            >
              <div className="p-3 bg-[#8cceae]/20 rounded-lg group-hover:bg-[#8cceae]/30 transition-colors">
                <Mail className="text-[#8cceae]" size={24} />
              </div>
              <div>
                <div className="font-bold text-gray-900">Email</div>
                <div className="text-sm text-gray-600">support@lumtrade.vn</div>
              </div>
            </a>

            <a 
              href="tel:0123456789"
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-[#8cceae]/10 transition-colors group"
            >
              <div className="p-3 bg-[#8cceae]/20 rounded-lg group-hover:bg-[#8cceae]/30 transition-colors">
                <Phone className="text-[#8cceae]" size={24} />
              </div>
              <div>
                <div className="font-bold text-gray-900">Hotline</div>
                <div className="text-sm text-gray-600">0123 456 789</div>
              </div>
            </a>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
              <div className="p-3 bg-[#8cceae]/20 rounded-lg">
                <MapPin className="text-[#8cceae]" size={24} />
              </div>
              <div>
                <div className="font-bold text-gray-900">Địa chỉ</div>
                <div className="text-sm text-gray-600">HUTECH, TP.HCM</div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="text-center">
            <h3 className="font-bold text-gray-900 mb-4">Theo dõi chúng tôi</h3>
            <div className="flex justify-center gap-4">
              <a 
                href="#" 
                className="p-3 bg-[#1877f2]/10 hover:bg-[#1877f2] text-[#1877f2] hover:text-white rounded-lg transition-all hover:scale-110"
              >
                <Facebook size={24} />
              </a>
              <a 
                href="#" 
                className="p-3 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white rounded-lg transition-all hover:scale-110"
              >
                <MessageCircle size={24} />
              </a>
              <a 
                href="#" 
                className="p-3 bg-[#E4405F]/10 hover:bg-[#E4405F] text-[#E4405F] hover:text-white rounded-lg transition-all hover:scale-110"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Sẵn sàng tham gia cộng đồng Lụm?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dang-tin"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 text-[#FFBA00] rounded-lg font-bold hover:bg-gray-800 hover:scale-105 transition-all shadow-lg"
            >
              Đăng tin ngay
            </Link>
            <Link 
              href="/search"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-lg font-bold hover:bg-gray-50 hover:scale-105 transition-all"
            >
              Khám phá ngay
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
