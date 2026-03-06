import { LucideIcon } from 'lucide-react';

interface AdminStatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: 'emerald' | 'orange' | 'blue' | 'purple';
}

const TONE_CLASSES: Record<NonNullable<AdminStatCardProps['tone']>, string> = {
  emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
  orange: 'bg-orange-50 border-orange-100 text-orange-700',
  blue: 'bg-blue-50 border-blue-100 text-blue-700',
  purple: 'bg-purple-50 border-purple-100 text-purple-700',
};

export default function AdminStatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'emerald',
}: AdminStatCardProps) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{value}</p>
          {hint && <p className="text-xs text-gray-400 mt-2">{hint}</p>}
        </div>
        <div className={`p-2.5 rounded-xl border ${TONE_CLASSES[tone]}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}
