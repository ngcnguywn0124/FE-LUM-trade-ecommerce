import {
  FolderTree,
  LayoutDashboard,
  School,
  ShieldCheck,
  UserCheck,
  SlidersHorizontal,
  FileText,
  Newspaper,
} from 'lucide-react';
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
    href: '/admin/tin-dang',
    label: 'Tin đăng',
    icon: FileText,
  },
  {
    href: '/admin/truong-dai-hoc',
    label: 'Trường & Cơ sở',
    icon: School,
  },
  {
    href: '/admin/danh-muc',
    label: 'Danh mục',
    icon: FolderTree,
  },
  {
    href: '/admin/thong-so-thuoc-tinh-tags',
    label: 'Thông số & Tags',
    icon: SlidersHorizontal,
  },
  {
    href: '/admin/phan-quyen',
    label: 'Roles & Quyền',
    icon: ShieldCheck,
  },
  {
    href: '/admin/xac-thuc-sinh-vien',
    label: 'Xác thực sinh viên',
    icon: UserCheck,
  },
  {
    href: '/admin/blog',
    label: 'Quản lý Blog',
    icon: Newspaper,
  },
];
