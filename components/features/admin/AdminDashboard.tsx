'use client';

import Link from 'next/link';
import {
  School,
  ShieldCheck,
  Users,
  Settings,
  Activity,
  ArrowUpRight,
  Clock3,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import AdminStatCard from './dashboard/AdminStatCard';
import AdminQuickActionCard from './dashboard/AdminQuickActionCard';

const ADMIN_CARDS = [
  {
    title: 'Quản lý Trường & Cơ sở',
    description: 'Thêm, sửa, xóa trường đại học và các cơ sở/campus trực thuộc.',
    href: '/admin/truong-dai-hoc',
    icon: School,
    color: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-600 bg-emerald-100',
    badge: 'Universities',
  },
  {
    title: 'Quản lý Roles & Quyền hạn',
    description: 'Tạo, chỉnh sửa roles và phân quyền truy cập cho từng role.',
    href: '/admin/phan-quyen',
    icon: ShieldCheck,
    color: 'bg-orange-50 border-orange-200',
    iconColor: 'text-orange-600 bg-orange-100',
    badge: 'Roles & Permissions',
  },
];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const roles = user?.roles ?? [];
  const isSuperAdmin = roles.includes('ROLE_SUPER_ADMIN');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-gray-900 shadow-sm">
              <Settings size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-extrabold text-gray-900">Bảng điều khiển quản trị</h2>
              <p className="text-sm text-gray-500 mt-1">
                Xin chào <strong>{user?.fullName ?? 'Admin'}</strong>, quản lý hệ thống nhanh từ một nơi.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Vai trò hiện tại</p>
            <p className="text-sm font-bold text-gray-800 mt-1">{roles.join(', ') || 'N/A'}</p>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatCard
          label="Module quản trị"
          value={2}
          hint="Trường/Cơ sở và Phân quyền"
          icon={Activity}
          tone="blue"
        />
        <AdminStatCard
          label="Vai trò của bạn"
          value={roles.length}
          hint={isSuperAdmin ? 'Toàn quyền hệ thống' : 'Phạm vi theo role'}
          icon={Users}
          tone="purple"
        />
        <AdminStatCard
          label="Mức truy cập"
          value={isSuperAdmin ? 'Super Admin' : 'Admin'}
          hint="Được kiểm soát bởi backend authorization"
          icon={ShieldCheck}
          tone="orange"
        />
        <AdminStatCard
          label="Trạng thái"
          value="Online"
          hint="Phiên quản trị đang hoạt động"
          icon={Clock3}
          tone="emerald"
        />
      </section>

      <section className="grid lg:grid-cols-3 gap-4">
        {ADMIN_CARDS.map(card => (
          <AdminQuickActionCard
            key={card.href}
            title={card.title}
            description={card.description}
            href={card.href}
            icon={card.icon}
          />
        ))}

        <Link
          href="/"
          className="group rounded-2xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <School size={18} />
            </div>
            <ArrowUpRight size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
          </div>
          <h3 className="mt-4 text-base font-bold text-gray-900">Về trang người dùng</h3>
          <p className="mt-1 text-sm text-gray-500 leading-relaxed">
            Quay về trang chính để kiểm tra trải nghiệm từ góc nhìn người dùng cuối.
          </p>
        </Link>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-3">Gợi ý vận hành</h3>
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="font-semibold text-gray-800">1. Quản lý dữ liệu nền</p>
            <p className="text-gray-500 mt-1">Cập nhật trường và cơ sở trước khi mở rộng danh mục đăng tin.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="font-semibold text-gray-800">2. Kiểm soát quyền</p>
            <p className="text-gray-500 mt-1">Role mới nên được cấp quyền theo từng nhóm resource để dễ audit.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="font-semibold text-gray-800">3. Tách nhiệm vụ</p>
            <p className="text-gray-500 mt-1">Admin thao tác hàng ngày, SUPER_ADMIN xử lý thay đổi nhạy cảm.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
