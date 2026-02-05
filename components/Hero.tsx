// components/Hero.tsx
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-brand-beige overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
        {/* Text Content */}
        <div className="space-y-6 z-10">
          <span className="inline-block px-4 py-1 rounded-full bg-brand-mint text-brand-dark text-sm font-bold tracking-wide">
            #PassDoHUTECH #SinhVien
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark leading-tight">
            Cũ người mới ta <br />
            <span className="text-emerald-600">Deal hời bao la!</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            Nền tảng ký gửi, mua bán đồ cũ "chất - rẻ - gần" dành riêng cho cộng đồng sinh viên.
          </p>
          
          <div className="flex gap-4">
            <Link href="/explore" className="bg-brand-dark text-white px-8 py-3 rounded-xl font-semibold hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Săn đồ ngay
            </Link>
            <Link href="/post" className="bg-white border-2 border-brand-dark text-brand-dark px-8 py-3 rounded-xl font-semibold hover:bg-brand-mint transition-all">
              Đăng tin (30s)
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-[300px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-brand-mint transform rotate-2 hover:rotate-0 transition-all duration-500">
          {/* Thay bằng ảnh thật của bạn */}
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
             
          </div>
        </div>
      </div>
      
      {/* Decor elements (Blobs) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-mint rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    </section>
  );
}