"use client";

import React from "react";
import { MessageCircle, Phone, ShoppingBag } from "lucide-react";

const StickyMobileBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-4 py-3 pb-safe md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3">
        {/* Chat Button */}
        <button className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white h-12 rounded-xl font-bold text-sm active:scale-95 transition-all">
          <MessageCircle size={20} />
          Chat ngay
        </button>

        {/* Call Button */}
        <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-emerald-600 text-emerald-600 h-12 rounded-xl font-bold text-sm active:scale-95 transition-all shadow-md shadow-emerald-100">
          <Phone size={20} />
          Gọi điện
        </button>
      </div>
    </div>
  );
};

export default StickyMobileBar;
