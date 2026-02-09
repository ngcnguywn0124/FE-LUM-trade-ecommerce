"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const keywords = [
  { text: "Mac Mini M4", trending: true },
  { text: "Giáo trình Luật", trending: false },
  { text: "Ký túc xá Khu B", trending: true },
  { text: "Áo khoác Local Brand", trending: false },
  { text: "Bàn phím cơ", trending: true },
  { text: "Tai nghe chống ồn", trending: false },
  { text: "iPhone cũ giá rẻ", trending: true },
  { text: "Nồi cơm điện mini", trending: false },
  { text: "Bình giữ nhiệt", trending: false },
  { text: "Sách TOEIC 800+", trending: true },
  { text: "Máy tính Casio 580", trending: true },
  { text: "Pass đồ decor phòng", trending: false },
  { text: "Màn hình 24 inch", trending: true },
  { text: "Vga 1660s", trending: false },
  { text: "Tủ lạnh mini", trending: true },
  { text: "Xe máy cũ", trending: false },
  { text: "Giày Sneaker", trending: false },
  { text: "Loa bluetooth", trending: true },
  { text: "Bàn học gấp gọn", trending: false },
  { text: "Quạt tích điện", trending: true },
];

export default function PopularKeywords() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-black text-gray-900 mb-6">Từ khoá phổ biến</h3>
        <div className="flex flex-wrap gap-x-10 gap-y-6">
          {keywords.map((kw, index) => (
            <motion.button
              key={kw.text + index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.02 }}
              className="group flex items-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <span className="text-gray-300 font-black group-hover:text-emerald-500 transition-colors select-none">#</span>
              <span className={`text-[15px] font-bold transition-colors ${
                kw.trending ? "text-emerald-600 group-hover:text-emerald-500" : "text-slate-600 group-hover:text-gray-900"
              }`}>
                {kw.text}
              </span>
              {kw.trending && (
                <div className="flex items-center gap-1 bg-orange-50 px-1.5 py-0.5 rounded-md">
                   <TrendingUp size={10} className="text-orange-600" />
                   <span className="text-[9px] font-black text-orange-600 uppercase tracking-tighter">Hot</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
