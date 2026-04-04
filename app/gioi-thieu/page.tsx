"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Recycle,
  ShieldCheck,
  Users,
  Zap,
  GraduationCap,
  Heart,
  Leaf,
  Target,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Star,
  TrendingUp,
  Globe,
  Sparkles,
} from "lucide-react";

/* ────────────────────────── Animation Variants ────────────────────────── */
const easeOutCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: easeOutCurve },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.12, duration: 0.45, ease: easeOutCurve },
  }),
};

/* ─────────────────────────── Data ─────────────────────────── */
const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: "An toàn & Tin cậy",
    description:
      "Mọi tài khoản đều được xác thực qua email trường. Hệ thống đánh giá giúp cộng đồng minh bạch, tạo niềm tin mỗi giao dịch.",
    color: "#FFBA00",
    bg: "bg-[#FFF8E1]",
  },
  {
    icon: Leaf,
    title: "Sống xanh",
    description:
      "Mua bán đồ cũ là cách đơn giản nhất để giảm rác thải. Mỗi món đồ được tái sử dụng là một bước hướng tới lối sống bền vững.",
    color: "#8cceae",
    bg: "bg-[#E8F5E9]",
  },
  {
    icon: Zap,
    title: "Nhanh chóng & Tiện lợi",
    description:
      "Đăng tin trong 30 giây, tìm kiếm theo trường-cơ sở, chat trực tiếp với người bán – tất cả chỉ trong một nền tảng duy nhất.",
    color: "#FF7675",
    bg: "bg-[#FFF0F0]",
  },
  {
    icon: Users,
    title: "Cộng đồng sinh viên",
    description:
      "Lụm.vn dành riêng cho sinh viên – nơi cùng chia sẻ, giúp đỡ lẫn nhau và lan tỏa tinh thần \"Cũ người mới ta\".",
    color: "#6C5CE7",
    bg: "bg-[#F3F0FF]",
  },
];

const STATS = [
  { value: "10,000+", label: "Sinh viên tin dùng", icon: GraduationCap },
  { value: "50,000+", label: "Tin đăng thành công", icon: TrendingUp },
  { value: "20+", label: "Trường đại học", icon: Globe },
  { value: "4.9/5", label: "Đánh giá trung bình", icon: Star },
];

const TEAM_MEMBERS = [
  {
    name: "Nguyễn Quý Ngọc",
    role: "UI/UX Designer & Frontend",
    avatar: "/user/ainz.jpg",
  },
  {
    name: "Thân Quang Tuân",
    role: "Fullstack Developer",
    avatar: "/user/solo.jpg",
  },
  {
    name: "Nguyễn Ái Bình",
    role: "Backend Developer",
    avatar: "/user/gojjo.png",
  },
];

const MILESTONES = [
  {
    year: "2024",
    title: "Ý tưởng ra đời",
    description: "Nhận thấy nhu cầu mua bán đồ cũ trong cộng đồng sinh viên, nhóm quyết định xây dựng Lụm.vn.",
  },
  {
    year: "2025",
    title: "Phiên bản Beta",
    description: "Ra mắt phiên bản thử nghiệm tại một số trường đại học TP.HCM, nhận phản hồi tích cực từ sinh viên.",
  },
  {
    year: "2026",
    title: "Chính thức ra mắt",
    description: "Mở rộng đến 20+ trường đại học trên toàn quốc với hơn 10,000 sinh viên tham gia.",
  },
];

/* ═══════════════════════════ COMPONENT ═══════════════════════════ */
export default function AboutPage() {
  return (
    <main className="min-h-screen font-sans bg-white">
      {/* ────────── SEO-Friendly Hero ────────── */}
      <section
        id="about-hero"
        className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8cceae] via-[#b8f3d7] to-[#E8FFF0]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgOHYtMmgydjJoLTJ6bTItMTBoMnYyaC0ydi0yem0tNC00aDJ2MmgtMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Text */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/30 backdrop-blur-sm rounded-full text-sm font-bold text-gray-800 mb-6">
                <Sparkles size={16} className="text-[#FFBA00]" />
                Về Lụm.vn
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
                Cũ người mới ta,<br></br>{" "}
                <span className="text-orange-700">Sinh viên</span> chốt giá!
              </h1>
              <p className="text-lg md:text-xl text-gray-800 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                <strong>Lụm.vn</strong> là sàn thương mại điện tử đồ cũ đầu
                tiên dành riêng cho <strong>sinh viên Việt Nam</strong>. Chúng
                tôi kết nối cộng đồng, lan tỏa giá trị xanh và giúp mỗi giao
                dịch trở nên an toàn, nhanh chóng và tiết kiệm.
              </p>
            </motion.div>

            {/* Logo / Illustration */}
            <motion.div
              className="flex-shrink-0"
              initial="hidden"
              animate="visible"
              variants={scaleIn}
              custom={2}
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 bg-white/20 rounded-3xl rotate-6 backdrop-blur-sm" />
                <div className="absolute inset-0 bg-white/30 rounded-3xl -rotate-3 backdrop-blur-sm" />
                <div className="relative h-full flex items-center justify-center bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/50">
                  <Image
                    src="/banners/promo-v3.jpg"
                    alt="Logo Lụm.vn - Sàn thương mại điện tử đồ cũ dành cho sinh viên"
                    width={220}
                    height={88}
                    className="w-auto h-auto max-w-full"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────── Stats ────────── */}
      <section id="about-stats" className="relative -mt-10 z-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                custom={i}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100 text-center transition-all hover:-translate-y-1 group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#8cceae]/15 rounded-xl mb-3 group-hover:bg-[#8cceae]/25 transition-colors">
                  <stat.icon size={24} className="text-[#2D3436]" />
                </div>
                <p className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ────────── Mission & Vision ────────── */}
      <section id="about-mission" className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFF8E1] rounded-full text-sm font-bold text-[#B8860B] mb-4">
              <Target size={16} />
              Sứ mệnh & Tầm nhìn
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Vì một cộng đồng sinh viên{" "}
              <span className="text-[#8cceae]">bền vững</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <motion.article
              className="relative bg-gradient-to-br from-[#8cceae]/10 to-[#b8f3d7]/20 rounded-3xl p-8 md:p-10 border border-[#8cceae]/20 overflow-hidden group"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8cceae]/10 rounded-bl-full" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#8cceae]/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                  <Recycle size={28} className="text-[#2D3436]" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">
                  Sứ mệnh
                </h3>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  Biến việc mua bán đồ cũ trong cộng đồng sinh viên trở nên{" "}
                  <strong>dễ dàng, an toàn và hiệu quả</strong>. Chúng tôi tin
                  rằng mỗi món đồ đều có giá trị – hãy để nó tiếp tục phục
                  vụ ai đó cần, thay vì bị bỏ phí.
                </p>
              </div>
            </motion.article>

            <motion.article
              className="relative bg-gradient-to-br from-[#FFF8E1] to-[#FFFDE7] rounded-3xl p-8 md:p-10 border border-[#FFBA00]/20 overflow-hidden group"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFBA00]/10 rounded-bl-full" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FFBA00]/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                  <Heart size={28} className="text-[#B8860B]" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">
                  Tầm nhìn
                </h3>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  Trở thành nền tảng mua bán đồ cũ <strong>số 1</strong> trong
                  cộng đồng sinh viên Việt Nam. Nơi mà mọi sinh viên đều có
                  thể tiết kiệm chi phí học tập và sinh hoạt, đồng thời{" "}
                  <strong>lan tỏa lối sống xanh</strong> cho thế hệ trẻ.
                </p>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* ────────── Core Values ────────── */}
      <section
        id="about-values"
        className="py-20 md:py-28 bg-gray-50/50 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8F5E9] rounded-full text-sm font-bold text-emerald-700 mb-4">
              <Star size={16} />
              Giá trị cốt lõi
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Những giá trị chúng tôi{" "}
              <span className="text-[#8cceae]">theo đuổi</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Mỗi tính năng, mỗi dòng code đều được xây dựng dựa trên 4 trụ cột
              giá trị – hướng tới trải nghiệm tốt nhất cho sinh viên.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {CORE_VALUES.map((value, i) => (
              <motion.article
                key={value.title}
                variants={scaleIn}
                custom={i}
                className={`${value.bg} rounded-2xl p-6 border border-transparent hover:border-gray-200 hover:shadow-lg transition-all group cursor-default`}
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: value.color + "25" }}
                >
                  <value.icon size={24} style={{ color: value.color }} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ────────── Timeline / Milestones ────────── */}
      <section id="about-timeline" className="py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F3F0FF] rounded-full text-sm font-bold text-[#6C5CE7] mb-4">
              <TrendingUp size={16} />
              Hành trình phát triển
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Từ ý tưởng đến{" "}
              <span className="text-[#6C5CE7]">hiện thực</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#8cceae] via-[#FFBA00] to-[#6C5CE7]" />

            <div className="space-y-12">
              {MILESTONES.map((milestone, i) => (
                <motion.div
                  key={milestone.year}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className={`relative flex flex-col md:flex-row items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                >
                  {/* Year Bubble */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-[#8cceae] rounded-full flex items-center justify-center z-10 shadow-md">
                    <span className="text-sm font-black text-gray-900">
                      {milestone.year}
                    </span>
                  </div>

                  {/* Content Card */}
                  <div
                    className={`ml-20 md:ml-0 md:w-5/12 ${i % 2 === 0 ? "md:pr-12" : "md:pl-12"
                      }`}
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden md:block md:w-5/12" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────── Team ────────── */}
      <section
        id="about-team"
        className="py-20 md:py-28 bg-gray-50/50 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFF0F0] rounded-full text-sm font-bold text-[#FF7675] mb-4">
              <Users size={16} />
              Đội ngũ phát triển
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Những con người đứng sau{" "}
              <span className="text-[#FF7675]">Lụm.vn</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Chúng tôi là nhóm sinh viên đam mê công nghệ, cùng chung tay xây
              dựng nền tảng phục vụ cộng đồng sinh viên.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-6 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {TEAM_MEMBERS.map((member, i) => (
              <motion.div
                key={member.name}
                variants={scaleIn}
                custom={i}
                className="group text-center w-[calc(50%-12px)] md:w-40 lg:w-48"
              >
                <div className="relative w-28 h-28 md:w-36 md:h-36 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8cceae] to-[#FFBA00] rounded-2xl rotate-3 group-hover:rotate-6 transition-transform" />
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-white shadow-md">
                    <Image
                      src={member.avatar}
                      alt={`Ảnh đại diện của ${member.name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base">
                  {member.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mt-1 font-medium">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ────────── How It Works ────────── */}
      <section id="about-how-it-works" className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8F5E9] rounded-full text-sm font-bold text-emerald-700 mb-4">
              <Zap size={16} />
              Cách hoạt động
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Đơn giản chỉ với{" "}
              <span className="text-[#8cceae]">3 bước</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {[
              {
                step: "01",
                title: "Đăng ký tài khoản",
                desc: "Tạo tài khoản miễn phí bằng email sinh viên. Xác thực nhanh chóng, an toàn.",
                gradient: "from-[#8cceae] to-[#6abf96]",
              },
              {
                step: "02",
                title: "Đăng tin hoặc Tìm kiếm",
                desc: "Đăng tin bán đồ cũ trong 30 giây hoặc tìm kiếm theo danh mục, trường, khu vực.",
                gradient: "from-[#FFBA00] to-[#FFA000]",
              },
              {
                step: "03",
                title: "Chat & Giao dịch",
                desc: "Nhắn tin trực tiếp, thỏa thuận giá cả và hẹn giao hàng ngay tại trường.",
                gradient: "from-[#FF7675] to-[#e05858]",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                custom={i}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl text-white font-black text-lg mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
                {/* Arrow connector */}
                {i < 2 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight size={24} className="text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ────────── CTA + Contact ────────── */}
      <section
        id="contact"
        className="py-20 md:py-28 bg-gradient-to-br from-[#111111] to-[#1A1A1A] text-white px-4"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Hãy cùng <span className="text-[#FFBA00]">Lụm.vn</span> lan tỏa
              giá trị!
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Bạn có câu hỏi, góp ý hay muốn hợp tác? Đừng ngại liên hệ với
              chúng tôi – đội ngũ Lụm luôn sẵn sàng lắng nghe.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {[
              {
                icon: MapPin,
                title: "Địa chỉ",
                info: "Khu Công nghệ cao, TP. Thủ Đức, TP. Hồ Chí Minh",
              },
              {
                icon: Phone,
                title: "Hotline",
                info: "1900 1234",
              },
              {
                icon: Mail,
                title: "Email",
                info: "hello@lum.vn",
              },
            ].map((contact, i) => (
              <motion.div
                key={contact.title}
                variants={scaleIn}
                custom={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FFBA00]/15 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <contact.icon size={24} className="text-[#FFBA00]" />
                </div>
                <h3 className="font-bold text-white mb-2">{contact.title}</h3>
                <p className="text-gray-400 text-sm">{contact.info}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
