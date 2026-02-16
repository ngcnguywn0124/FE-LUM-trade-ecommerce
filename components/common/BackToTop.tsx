"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed z-40 p-2.5 rounded-xl shadow-xl transition-all duration-500
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
        bg-emerald-600 text-white hover:bg-emerald-700 active:scale-90
        right-5 bottom-20 md:right-8 md:bottom-8 cursor-pointer
      `}
      aria-label="Back to top"
    >
      <ChevronUp size={24} strokeWidth={3} />
    </button>
  );
};

export default BackToTop;


