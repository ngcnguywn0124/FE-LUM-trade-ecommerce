import Image from "next/image";
import { CalendarDays, Clock3, MapPin, Flag, Share2, SquarePen, Star, User, UserPlus } from "lucide-react";
import { UserProfile } from "@/lib/mockUserProfile";

interface UserProfileHeaderProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
}

const UserProfileHeader = ({ profile, isOwnProfile = false }: UserProfileHeaderProps) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white ">
      <div className="relative h-40 w-full bg-gray-100 sm:h-52">
        <Image
          src="/user/user-profile-default-cover.png"
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/5" />
        
        {!isOwnProfile && (
          <button 
            className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all cursor-pointer group"
            title="Báo cáo người dùng"
          >
            <Flag size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        )}
      </div>

      <div className="px-4 pb-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="-mt-12 flex flex-col items-center gap-3 text-center sm:-mt-14 sm:flex-row sm:items-end sm:gap-4 sm:text-left">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-sm sm:h-32 sm:w-32">
              <Image 
                src={profile.avatar || "/user/avatar-user-profile-default.png"} 
                alt={profile.name} 
                fill 
                className="object-cover" 
              />
            </div>

            <div className="min-w-0 pb-1">
              <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl">{profile.name}</h1>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-gray-600 sm:justify-start sm:text-sm">
                <span className="inline-flex items-center gap-1 text-amber-500">
                  <Star size={14} className="fill-amber-500" />
                  <strong className="text-gray-800">{profile.rating.toFixed(1)}</strong>
                  <span>({profile.reviewCount} đánh giá)</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} className="text-emerald-600" />
                  {profile.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:flex-none cursor-pointer">
              <Share2 size={16} />
              Chia sẻ
            </button>
            {isOwnProfile ? (
              <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-[#FFBA00] transition-colors hover:bg-gray-800 sm:flex-none cursor-pointer">
                <SquarePen size={16} />
                Chỉnh sửa hồ sơ
              </button>
            ) : (
              <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 sm:flex-none cursor-pointer">
                <UserPlus size={16} />
                Theo dõi
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-sm sm:grid-cols-4 sm:p-3">
          <div className="flex flex-col sm:block">
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest sm:text-xs">Tin đang đăng</p>
            <p className="mt-0.5 text-base font-bold text-gray-900 sm:text-sm">{profile.totalListings}</p>
          </div>
          <div className="flex flex-col sm:block">
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest sm:text-xs">Đã giao dịch</p>
            <p className="mt-0.5 text-base font-bold text-gray-900 sm:text-sm">{profile.totalSold}</p>
          </div>
          <div className="flex flex-col sm:block">
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest sm:text-xs">Tham gia</p>
            <p className="mt-0.5 inline-flex items-center gap-1.5 text-base font-bold text-gray-900 sm:text-sm">
              <CalendarDays size={14} className="text-gray-400" />
              {profile.joinDate}
            </p>
          </div>
          <div className="flex flex-col sm:block">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest sm:text-xs">Hoạt động</p>
            <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-bold text-gray-900">
              <Clock3 size={14} className="text-emerald-500" />
              {profile.lastActive}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfileHeader;
