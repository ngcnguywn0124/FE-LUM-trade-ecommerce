"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function PromoBanner() {
  return (
    <section className="pt-2 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-linear-to-r from-[#a2e9c1] via-[#c7f4dc] to-[#b8f3d7] rounded-3xl overflow-hidden min-h-70 flex flex-col md:flex-row items-center px-8 md:px-16 py-8 shadow-sm">
          
          {/* Decorative floating elements */}
          <motion.div 
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-10 right-[40%] w-12 h-12 bg-orange-400/20 rounded-lg backdrop-blur-sm z-0"
          />
          <motion.div 
            animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute bottom-10 left-[30%] w-8 h-8 bg-emerald-500/20 rounded-full backdrop-blur-sm z-0"
          />

          {/* Left Content */}
          <div className="flex-1 text-center md:text-left z-10">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-6">
              Ưu đãi dành riêng <br className="hidden md:block" /> cho sinh viên
            </h2>
            <button className="bg-gray-900 hover:bg-black text-white font-bold px-8 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-gray-200 cursor-pointer">
              Khám phá ngay
            </button>
          </div>

          {/* Right Illustration */}
          <div className="flex-1 relative w-full h-60 md:h-75 mt-8 md:mt-0 z-10 flex justify-center md:justify-end">
             {/* Using a placeholder for now, but user can replace with student-marketplace.png if they prefer */}
            <Image
              src="/banners/promo-v4.png"
              alt="Student Promo"
              width={500}
              height={300}
              className="object-contain"
            />
          </div>

          {/* Additional Floating icons from the image */}
          <div className="absolute right-12 top-10 opacity-60">
             <div className="w-10 h-10 bg-red-400 rounded-lg flex items-center justify-center text-white font-bold text-xs rotate-12">KM</div>
          </div>
          <div className="absolute right-[25%] bottom-12 opacity-60 grayscale hover:grayscale-0 transition-all cursor-pointer">
             <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold text-xs shadow-md">SALE</div>
          </div>
        </div>
      </div>
    </section>
  );
}
