// components/Features.tsx
import { Clock, MessageCircle, MapPin } from "lucide-react";

const features = [
  {
    icon: <Clock className="w-8 h-8 text-emerald-600" />,
    title: "Đăng tin 30s",
    desc: "Chụp ảnh, định giá, xong! Nhanh hơn úp mì tôm."
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-emerald-600" />,
    title: "Chat trực tiếp",
    desc: "Thương lượng giá cả, chốt đơn ngay trong app."
  },
  {
    icon: <MapPin className="w-8 h-8 text-emerald-600" />,
    title: "Lọc theo KTX",
    desc: "Tìm đồ ngay tại trường/KTX của bạn. Free ship chạy bộ."
  }
];

export default function Features() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-brand-beige transition-colors cursor-default">
              <div className="bg-brand-mint/30 p-4 rounded-full mb-4">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-brand-dark">{f.title}</h3>
              <p className="text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}