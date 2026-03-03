"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SearchX } from "lucide-react";
import UserProfileHeader from "@/components/features/user-profile/UserProfileHeader";
import UserReviewsSection from "@/components/features/user-profile/UserReviewsSection";
import UserListingsSection from "@/components/features/user-profile/UserListingsSection";
import { generateMockProducts } from "@/lib/mockData";
import { getUserProfileData } from "@/lib/mockUserProfile";

const PRODUCT_DATA = generateMockProducts(300);
const CURRENT_USER_ID = 1;

const UserProfilePage = () => {
  const params = useParams<{ id: string }>();
  const userId = Number(params.id);

  const userData = useMemo(
    () => getUserProfileData(userId, PRODUCT_DATA),
    [userId]
  );

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <SearchX size={48} className="text-orange-500" />
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Không tìm thấy tài khoản</h1>
            <p className="mt-2 max-w-md text-sm text-gray-600">
              Tài khoản sinh viên này có thể đã bị ẩn hoặc mã không hợp lệ.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/search"
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Quay lại tìm kiếm
              </Link>
              <Link
                href="/"
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { profile, listings, reviews } = userData;
  const isOwnProfile = userId === CURRENT_USER_ID;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <UserProfileHeader profile={profile} isOwnProfile={isOwnProfile} />

          <div className="space-y-4">
            <UserListingsSection listings={listings} />
            <UserReviewsSection reviews={reviews} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
