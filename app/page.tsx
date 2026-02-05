// app/page.tsx
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductSection from "@/components/ProductSection";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen font-sans">
      <Header />

      <Hero />
      <Features />
      <ProductSection />
      
      {/* Banner phụ: Kêu gọi tải App hoặc tham gia cộng đồng */}
      <section className="bg-brand-mint py-12 text-center">
         <h2 className="text-2xl font-bold text-brand-dark">Bạn có đồ không dùng?</h2>
         <p className="mb-6">Đăng bán ngay để dọn phòng đón đồ mới!</p>
         <button className="bg-white text-emerald-700 font-bold py-3 px-8 rounded-full shadow-lg">Đăng tin ngay</button>
      </section>
      
      <Footer />
    </main>
  );
}