import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface AdminQuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export default function AdminQuickActionCard({
  title,
  description,
  href,
  icon: Icon,
}: AdminQuickActionCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="p-2.5 rounded-xl bg-gray-100 text-gray-700">
          <Icon size={18} />
        </div>
        <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
      </div>
      <h3 className="mt-4 text-base font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 leading-relaxed">{description}</p>
    </Link>
  );
}
