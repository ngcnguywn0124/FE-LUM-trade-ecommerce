import { BadgeCheck, Clock3, PackageCheck, Users } from "lucide-react";
import { UserProfile } from "@/lib/mockUserProfile";

interface UserTrustStatsProps {
  profile: UserProfile;
}

const UserTrustStats = ({ profile }: UserTrustStatsProps) => {
  const metrics = [
    {
      label: "Phản hồi tin nhắn",
      value: `${profile.responseRate}%`,
      icon: BadgeCheck,
      tone: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Phản hồi trung bình",
      value: profile.responseTime,
      icon: Clock3,
      tone: "text-blue-600 bg-blue-50",
    },
    {
      label: "Đã giao dịch",
      value: `${profile.totalSold} sản phẩm`,
      icon: PackageCheck,
      tone: "text-amber-600 bg-amber-50",
    },
    {
      label: "Bạn theo dõi",
      value: `${profile.followers}`,
      icon: Users,
      tone: "text-violet-600 bg-violet-50",
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-gray-900">Mức độ tin cậy trong cộng đồng</h2>
      <p className="mt-1 text-xs text-gray-500">Dựa trên lịch sử giao dịch và đánh giá từ sinh viên.</p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div key={metric.label} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div className="flex items-start gap-3">
                <div className={`rounded-lg p-2 ${metric.tone}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{metric.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-900">{metric.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default UserTrustStats;
