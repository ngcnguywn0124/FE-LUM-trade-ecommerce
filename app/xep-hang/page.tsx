"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Trophy,
  Medal,
  Star,
  TrendingUp,
  Users,
  ShoppingBag,
  MessageCircle,
  Heart,
  Award,
  Crown,
  Zap,
  CheckCircle,
  ChevronUp,
  ChevronDown
} from "lucide-react";

const RankingPage = () => {
  const [activeTab, setActiveTab] = useState<"sellers" | "buyers">("sellers");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month");

  // Top 3 Sellers
  const topSellers = [
    {
      rank: 1,
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "/user/avatar-1.jpg",
      school: "HUTECH",
      campus: "Cơ sở 1",
      totalSales: 156,
      rating: 4.9,
      reviews: 142,
      responseTime: "5 phút",
      successRate: 98,
      badges: ["Người bán uy tín", "Phản hồi nhanh", "Top seller"],
      trend: "up",
      change: 2
    },
    {
      rank: 2,
      id: 2,
      name: "Trần Thị B",
      avatar: "/user/avatar-2.jpg",
      school: "HUTECH",
      campus: "Cơ sở 2",
      totalSales: 143,
      rating: 4.8,
      reviews: 128,
      responseTime: "8 phút",
      successRate: 96,
      badges: ["Người bán uy tín", "Hàng chất lượng"],
      trend: "up",
      change: 1
    },
    {
      rank: 3,
      id: 3,
      name: "Lê Văn C",
      avatar: "/user/avatar-3.jpg",
      school: "HUTECH",
      campus: "Cơ sở 1",
      totalSales: 138,
      rating: 4.8,
      reviews: 115,
      responseTime: "10 phút",
      successRate: 95,
      badges: ["Người bán uy tín"],
      trend: "same",
      change: 0
    }
  ];

  // Rankings 4-10
  const otherSellers = [
    {
      rank: 4,
      id: 4,
      name: "Phạm Thị D",
      avatar: "/user/avatar-4.jpg",
      school: "HUTECH",
      campus: "Cơ sở 3",
      totalSales: 125,
      rating: 4.7,
      reviews: 98,
      responseTime: "12 phút",
      successRate: 94,
      badges: ["Phản hồi nhanh"],
      trend: "down",
      change: -1
    },
    {
      rank: 5,
      id: 5,
      name: "Hoàng Văn E",
      avatar: "/user/avatar-1.jpg",
      school: "HUTECH",
      campus: "Cơ sở 1",
      totalSales: 118,
      rating: 4.7,
      reviews: 92,
      responseTime: "15 phút",
      successRate: 93,
      badges: ["Hàng chất lượng"],
      trend: "up",
      change: 2
    },
    {
      rank: 6,
      id: 6,
      name: "Vũ Thị F",
      avatar: "/user/avatar-2.jpg",
      school: "HUTECH",
      campus: "Cơ sở 2",
      totalSales: 112,
      rating: 4.6,
      reviews: 87,
      responseTime: "18 phút",
      successRate: 92,
      badges: [],
      trend: "same",
      change: 0
    },
    {
      rank: 7,
      id: 7,
      name: "Đỗ Văn G",
      avatar: "/user/avatar-3.jpg",
      school: "HUTECH",
      campus: "Cơ sở 1",
      totalSales: 105,
      rating: 4.6,
      reviews: 82,
      responseTime: "20 phút",
      successRate: 91,
      badges: [],
      trend: "up",
      change: 1
    },
    {
      rank: 8,
      id: 8,
      name: "Bùi Thị H",
      avatar: "/user/avatar-4.jpg",
      school: "HUTECH",
      campus: "Cơ sở 3",
      totalSales: 98,
      rating: 4.5,
      reviews: 76,
      responseTime: "22 phút",
      successRate: 90,
      badges: [],
      trend: "down",
      change: -2
    },
    {
      rank: 9,
      id: 9,
      name: "Ngô Văn I",
      avatar: "/user/avatar-1.jpg",
      school: "HUTECH",
      campus: "Cơ sở 2",
      totalSales: 92,
      rating: 4.5,
      reviews: 71,
      responseTime: "25 phút",
      successRate: 89,
      badges: [],
      trend: "up",
      change: 3
    },
    {
      rank: 10,
      id: 10,
      name: "Đinh Thị K",
      avatar: "/user/avatar-2.jpg",
      school: "HUTECH",
      campus: "Cơ sở 1",
      totalSales: 88,
      rating: 4.4,
      reviews: 68,
      responseTime: "28 phút",
      successRate: 88,
      badges: [],
      trend: "same",
      change: 0
    }
  ];

  // Top Buyers
  const topBuyers = [
    {
      rank: 1,
      id: 11,
      name: "Mai Văn L",
      avatar: "/user/avatar-3.jpg",
      school: "HUTECH",
      campus: "Cơ sở 1",
      totalPurchases: 89,
      rating: 5.0,
      reviews: 85,
      badges: ["Người mua uy tín", "Thanh toán nhanh"],
      trend: "up",
      change: 1
    },
    {
      rank: 2,
      id: 12,
      name: "Phan Thị M",
      avatar: "/user/avatar-4.jpg",
      school: "HUTECH",
      campus: "Cơ sở 2",
      totalPurchases: 82,
      rating: 4.9,
      reviews: 78,
      badges: ["Người mua uy tín"],
      trend: "down",
      change: -1
    },
    {
      rank: 3,
      id: 13,
      name: "Lý Văn N",
      avatar: "/user/avatar-1.jpg",
      school: "HUTECH",
      campus: "Cơ sở 3",
      totalPurchases: 76,
      rating: 4.9,
      reviews: 72,
      badges: ["Thanh toán nhanh"],
      trend: "up",
      change: 2
    }
  ];

  const criteria = [
    {
      icon: Star,
      title: "Đánh giá trung bình",
      description: "Điểm đánh giá từ người mua/bán",
      weight: "30%"
    },
    {
      icon: ShoppingBag,
      title: "Số lượng giao dịch",
      description: "Tổng số giao dịch thành công",
      weight: "25%"
    },
    {
      icon: Zap,
      title: "Tỷ lệ thành công",
      description: "% giao dịch hoàn thành",
      weight: "20%"
    },
    {
      icon: MessageCircle,
      title: "Thời gian phản hồi",
      description: "Tốc độ trả lời tin nhắn",
      weight: "15%"
    },
    {
      icon: Heart,
      title: "Độ tin cậy",
      description: "Từ đánh giá của cộng đồng",
      weight: "10%"
    }
  ];

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1:
        return <Crown className="text-[#FFD700]" size={32} />;
      case 2:
        return <Medal className="text-[#C0C0C0]" size={32} />;
      case 3:
        return <Medal className="text-[#CD7F32]" size={32} />;
      default:
        return <span className="text-2xl font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch(rank) {
      case 1:
        return "from-yellow-400 to-yellow-600";
      case 2:
        return "from-gray-300 to-gray-500";
      case 3:
        return "from-orange-400 to-orange-600";
      default:
        return "from-gray-200 to-gray-300";
    }
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === "up") {
      return (
        <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
          <ChevronUp size={16} />
          <span>+{change}</span>
        </div>
      );
    } else if (trend === "down") {
      return (
        <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
          <ChevronDown size={16} />
          <span>{change}</span>
        </div>
      );
    }
    return <div className="text-gray-400 text-sm">-</div>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf7] to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-2xl shadow-lg">
              <Trophy size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Bảng Xếp Hạng
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những người dùng uy tín và tích cực nhất trên nền tảng Lụm
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-xl shadow-md p-1 border-2 border-gray-100">
            <button
              onClick={() => setActiveTab("sellers")}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === "sellers"
                  ? "bg-gradient-to-r from-[#8cceae] to-[#6fb896] text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} />
                <span>Người Bán</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("buyers")}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === "buyers"
                  ? "bg-gradient-to-r from-[#8cceae] to-[#6fb896] text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span>Người Mua</span>
              </div>
            </button>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="flex justify-center gap-3 mb-12">
          {[
            { value: "week", label: "Tuần này" },
            { value: "month", label: "Tháng này" },
            { value: "all", label: "Mọi lúc" }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value as any)}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                timeRange === option.value
                  ? "bg-[#FFBA00] text-gray-900 shadow-lg"
                  : "bg-white text-gray-600 border-2 border-gray-200 hover:border-[#FFBA00]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {activeTab === "sellers" ? (
          <>
            {/* Top 3 Podium */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
              {/* Rank 2 */}
              <div className="md:order-1 md:mt-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-gray-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="bg-gradient-to-r from-gray-300 to-gray-500 p-4 text-center">
                    <Medal className="mx-auto text-white mb-2" size={32} />
                    <div className="text-white font-bold text-lg">Hạng 2</div>
                  </div>
                  <div className="p-6">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full"></div>
                      <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                        <Users size={40} className="text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-1">
                      {topSellers[1].name}
                    </h3>
                    <p className="text-sm text-gray-500 text-center mb-4">
                      {topSellers[1].school} - {topSellers[1].campus}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Giao dịch:</span>
                        <span className="font-bold text-gray-900">{topSellers[1].totalSales}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Đánh giá:</span>
                        <span className="font-bold text-yellow-500 flex items-center gap-1">
                          <Star size={14} className="fill-current" />
                          {topSellers[1].rating}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Thành công:</span>
                        <span className="font-bold text-green-600">{topSellers[1].successRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rank 1 */}
              <div className="md:order-2">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-yellow-400 hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-3 shadow-lg">
                      <Crown className="text-white" size={32} />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 pt-8 text-center">
                    <div className="text-white font-bold text-2xl">Quán Quân</div>
                  </div>
                  <div className="p-6">
                    <div className="relative w-28 h-28 mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full animate-pulse"></div>
                      <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                        <Users size={48} className="text-yellow-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 text-center mb-1">
                      {topSellers[0].name}
                    </h3>
                    <p className="text-sm text-gray-500 text-center mb-4">
                      {topSellers[0].school} - {topSellers[0].campus}
                    </p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Giao dịch:</span>
                        <span className="font-bold text-gray-900">{topSellers[0].totalSales}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Đánh giá:</span>
                        <span className="font-bold text-yellow-500 flex items-center gap-1">
                          <Star size={14} className="fill-current" />
                          {topSellers[0].rating}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Thành công:</span>
                        <span className="font-bold text-green-600">{topSellers[0].successRate}%</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {topSellers[0].badges.map((badge, idx) => (
                        <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rank 3 */}
              <div className="md:order-3 md:mt-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-orange-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-4 text-center">
                    <Medal className="mx-auto text-white mb-2" size={32} />
                    <div className="text-white font-bold text-lg">Hạng 3</div>
                  </div>
                  <div className="p-6">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full"></div>
                      <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                        <Users size={40} className="text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-1">
                      {topSellers[2].name}
                    </h3>
                    <p className="text-sm text-gray-500 text-center mb-4">
                      {topSellers[2].school} - {topSellers[2].campus}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Giao dịch:</span>
                        <span className="font-bold text-gray-900">{topSellers[2].totalSales}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Đánh giá:</span>
                        <span className="font-bold text-yellow-500 flex items-center gap-1">
                          <Star size={14} className="fill-current" />
                          {topSellers[2].rating}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Thành công:</span>
                        <span className="font-bold text-green-600">{topSellers[2].successRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rankings 4-10 */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Xếp hạng 4-10
              </h2>
              <div className="space-y-4">
                {otherSellers.map((seller) => (
                  <div
                    key={seller.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-sm">
                      <span className="text-xl font-bold text-gray-600">#{seller.rank}</span>
                    </div>
                    
                    <div className="w-12 h-12 bg-gradient-to-br from-[#8cceae] to-[#6fb896] rounded-full flex items-center justify-center flex-shrink-0">
                      <Users size={24} className="text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{seller.name}</h3>
                        {seller.badges.length > 0 && (
                          <CheckCircle size={16} className="text-[#8cceae]" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {seller.school} - {seller.campus}
                      </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-gray-900">{seller.totalSales}</div>
                        <div className="text-gray-500">Giao dịch</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-yellow-500 flex items-center gap-1">
                          <Star size={14} className="fill-current" />
                          {seller.rating}
                        </div>
                        <div className="text-gray-500">Đánh giá</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{seller.successRate}%</div>
                        <div className="text-gray-500">Thành công</div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {getTrendIcon(seller.trend, seller.change)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Top Buyers List */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Top Người Mua Uy Tín
              </h2>
              <div className="space-y-4">
                {topBuyers.map((buyer) => (
                  <div
                    key={buyer.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${getRankBadgeColor(buyer.rank)} rounded-lg shadow-lg`}>
                      {buyer.rank <= 3 ? (
                        getRankIcon(buyer.rank)
                      ) : (
                        <span className="text-xl font-bold text-white">#{buyer.rank}</span>
                      )}
                    </div>
                    
                    <div className="w-14 h-14 bg-gradient-to-br from-[#8cceae] to-[#6fb896] rounded-full flex items-center justify-center flex-shrink-0">
                      <Users size={28} className="text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-gray-900">{buyer.name}</h3>
                        {buyer.badges.length > 0 && (
                          <CheckCircle size={18} className="text-[#8cceae]" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {buyer.school} - {buyer.campus}
                      </p>
                      {buyer.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {buyer.badges.map((badge, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-[#8cceae]/20 text-[#8cceae] rounded-full text-xs font-medium">
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="hidden sm:flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-gray-900">{buyer.totalPurchases}</div>
                        <div className="text-gray-500">Mua hàng</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-yellow-500 flex items-center gap-1">
                          <Star size={14} className="fill-current" />
                          {buyer.rating}
                        </div>
                        <div className="text-gray-500">Đánh giá</div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {getTrendIcon(buyer.trend, buyer.change)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Ranking Criteria */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Award className="text-[#8cceae]" size={32} />
            Tiêu chí xếp hạng
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {criteria.map((criterion, index) => (
              <div key={index} className="text-center">
                <div className="p-4 bg-gradient-to-br from-[#8cceae]/20 to-[#FFBA00]/20 rounded-xl w-fit mx-auto mb-3">
                  <criterion.icon className="text-[#8cceae]" size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{criterion.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{criterion.description}</p>
                <span className="inline-block px-3 py-1 bg-[#FFBA00]/20 text-[#FFBA00] rounded-full text-sm font-bold">
                  {criterion.weight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-[#8cceae] to-[#6fb896] rounded-2xl shadow-xl p-8 text-white">
          <TrendingUp size={48} className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">
            Bạn cũng muốn lên top?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Tham gia giao dịch, đánh giá tốt và phản hồi nhanh để tăng thứ hạng của bạn trên bảng xếp hạng!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dang-tin"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-[#8cceae] rounded-lg font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
            >
              Đăng tin ngay
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 text-[#FFBA00] rounded-lg font-bold hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
            >
              Tìm kiếm sản phẩm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
