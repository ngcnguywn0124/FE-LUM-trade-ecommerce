'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { ADMIN_NAV_ITEMS } from './adminNav';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  mobile?: boolean;
}

export default function AdminSidebar({
  isOpen = true,
  onClose,
  mobile = false,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const containerClass = mobile
    ? `fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-xl transform transition-transform duration-200 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`
    : 'hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:z-50 bg-white border-r border-gray-200';

  return (
    <aside className={containerClass}>
      <div className="flex-shrink-0 h-16 flex items-center justify-between px-5 border-b border-gray-100 bg-white">
        <div>
          <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Lụm</p>
          <h2 className="text-base font-bold text-gray-900">Admin Console</h2>
        </div>
        {mobile && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Đóng sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {ADMIN_NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group flex items-start gap-3 rounded-xl px-3 py-3 transition-all ${
                active
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
              }`}
            >
              <item.icon
                size={18}
                className={active ? 'text-emerald-600 mt-0.5' : 'text-gray-400 group-hover:text-gray-700 mt-0.5'}
              />
              <div className="min-w-0">
                <p className={`text-sm font-semibold ${active ? 'text-emerald-700' : 'text-gray-800'}`}>
                  {item.label}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
