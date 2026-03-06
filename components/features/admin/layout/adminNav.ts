import { LayoutDashboard, School, ShieldCheck } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/truong-dai-hoc',
    label: 'Trường & Cơ sở',
    icon: School,
  },
  {
    href: '/admin/phan-quyen',
    label: 'Roles & Quyền',
    icon: ShieldCheck,
  },
];
