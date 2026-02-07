// components/ProductSection.tsx
import { MapPin } from "lucide-react";

// Mock data giả lập
const products = [
  { id: 1, name: "Giáo trình C++ cũ", price: "45.000đ", school: "HUTECH - Khu E", image: "/p1.jpg", tag: "Sách" },
  { id: 2, name: "Bàn phím cơ Keychron", price: "850.000đ", school: "FPT Edu", image: "/p2.jpg", tag: "Tech" },
  { id: 3, name: "Áo Hoodie Local Brand", price: "120.000đ", school: "KTX ĐHQG", image: "/p3.jpg", tag: "Thời trang" },
  { id: 4, name: "Tủ vải đựng quần áo", price: "90.000đ", school: "UEH", image: "/p4.jpg", tag: "Gia dụng" },
];

export default function ProductSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-brand-dark">Mới lên kệ 🔥</h2>
            <p className="text-gray-500 mt-1">Đồ ngon giá hời vừa được đăng bán</p>
          </div>
          <button className="text-emerald-600 font-semibold hover:underline">Xem tất cả &rarr;</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
              {/* Image Container */}
              <div className="relative aspect-square bg-gray-200 overflow-hidden">
                <span className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white text-xs font-heading px-2 py-1 rounded-md z-10">
                  {product.tag}
                </span>
                {/* Thay bằng component Image của Next.js */}
                <div className="w-full h-full bg-gray-300 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                    
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-heading font-bold text-gray-800 truncate">{product.name}</h3>
                <div className="text-brand-accent font-heading font-extrabold text-lg mt-1">{product.price}</div>
                
                <div className="flex items-center mt-3 text-xs text-gray-500 bg-gray-100 py-1 px-2 rounded-lg w-fit">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate max-w-25">{product.school}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}