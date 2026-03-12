// components/Hero.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Zap, ShieldCheck, Sparkles } from "lucide-react";


const banners = [
  {
    id: 1,
    title: "Săn Deal Sinh Viên",
    subtitle: "Laptop, giáo trình & đồ cứu trợ 24/7",
    image: "/banners/student-marketplace.png",
    icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
    color: "from-blue-500/20 to-purple-500/20",
  },
  {
    id: 2,
    title: "Pass Đồ Siêu Tốc",
    subtitle: "Dọn kho báu, nhận tiền tươi ngay",
    image: "/banners/deal-hunter.png",
    icon: <Zap className="w-5 h-5 text-orange-500" />,
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: 3,
    title: "Giao Dịch An Tâm",
    subtitle: "Kiểm định kỹ lưỡng, bảo vệ người mua",
    image: "/banners/safe-transaction.png",
    icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    color: "from-amber-500/20 to-orange-500/20",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <section className="relative bg-brand-beige overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-5">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-mint/30 border border-brand-mint text-brand-dark text-xs font-heading font-bold tracking-widest uppercase">
                #PassDo #SinhVien #DoCu
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-brand-dark leading-[1.1]">
                <span className="text-4xl md:text-4xl">Giao dịch nhanh chóng </span><br />
                <span className="text-emerald-600 relative inline-block">
                  Tiết kiệm tối đa!
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 6C50 2 150 2 200 6" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h2>
              <p className="text-gray-600 max-w-md font-medium text-lg leading-relaxed">
                Ký gửi, mua bán đồ cũ <span className="text-brand-dark font-bold">"chất - rẻ - gần"</span>. <br />
                Tìm deal hời ngay hôm nay!.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={() => {const element = document.getElementById("product-section");
            if (element) {
              const yOffset = -100; // Khoảng cách offset để không bị header che mất
              const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: "smooth" });}
            }}
                  className="group relative bg-brand-dark text-white px-8 py-4 rounded-lg font-heading font-bold hover:bg-black transition-all shadow-xl hover:shadow-2xl overflow-hidden cursor-pointer"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Săn đồ ngay <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <Link href="/ve-chung-toi" className="bg-emerald-600 text-brand-dark px-8 py-4 rounded-lg font-heading font-bold hover:bg-brand-mint hover:border-brand-mint transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center">
                  Tìm hiểu thêm
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Carousel banner */}
          <div className="relative group perspective-1000">
            <AnimatePresence mode="wait">
              <motion.div
                key={banners[current].id}
                initial={{ opacity: 0, rotateY: -10, scale: 0.95 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: 10, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="relative aspect-[4/3] md:aspect-square lg:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group-hover:shadow-brand-mint/30 transition-shadow duration-500"
              >
                {/* Background Overlay Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${banners[current].color} mix-blend-multiply z-10`} />

                <Image
                  src={banners[current].image}
                  alt={banners[current].title}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                  priority
                />

                {/* Glassmorphism Info Card */}
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/50 z-20 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                      {banners[current].icon}
                    </div>
                    <span className="text-brand-dark font-extrabold text-xl font-heading text-emerald-600">
                      {banners[current].title}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium pl-11">
                    {banners[current].subtitle}
                  </p>
                </div>

                {/* Progress Indicators */}
                <div className="absolute top-6 right-6 flex gap-2 z-20">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrent(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === current ? "w-8 bg-brand-dark" : "w-1.5 bg-brand-dark/20"
                        }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons (Hidden by default, shown on hover) */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 shadow-lg flex items-center justify-center text-brand-dark opacity-0 group-hover:opacity-100 transition-opacity z-30 hover:bg-brand-mint cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 shadow-lg flex items-center justify-center text-brand-dark opacity-0 group-hover:opacity-100 transition-opacity z-30 hover:bg-brand-mint cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Decor elements (Blobs) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-mint rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
    </section>
  );
}
