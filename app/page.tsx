// app/page.tsx
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductSection from "@/components/ProductSection";

export default function Home() {
  return (
    <main className="min-h-screen font-sans">
      {/* Navbar có thể tách riêng */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-2xl font-black text-emerald-600 tracking-tighter">
            PassĐồ<span className="text-brand-dark">.vn</span>
          </div>
          {/* Menu items... */}
        </div>
      </nav>

      <Hero />
      <Features />
      <ProductSection />
      
      {/* Banner phụ: Kêu gọi tải App hoặc tham gia cộng đồng */}
      <section className="bg-brand-mint py-12 text-center">
         <h2 className="text-2xl font-bold text-brand-dark">Bạn có đồ không dùng?</h2>
         <p className="mb-6">Đăng bán ngay để dọn phòng đón đồ mới!</p>
         <button className="bg-white text-emerald-700 font-bold py-3 px-8 rounded-full shadow-lg">Đăng tin ngay</button>
      </section>
      
      {/* Footer... */}
    </main>
  );
}