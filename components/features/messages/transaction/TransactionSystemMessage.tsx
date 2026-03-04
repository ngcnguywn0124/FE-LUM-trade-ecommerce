'use client';

import { CheckCircle2, Clock, HandshakeIcon, XCircle, Banknote, Star } from 'lucide-react';
import { TransactionEventType } from '@/types/messages';

interface TransactionSystemMessageProps {
  event: TransactionEventType;
  actorName?: string;
  sentAt: string;
}

const EVENT_CONFIG: Record<
  TransactionEventType,
  {
    icon: React.ElementType;
    iconColor: string;
    bgColor: string;
    borderColor: string;
    label: (actor?: string) => string;
  }
> = {
  buyer_requested: {
    icon: Clock,
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    label: (actor) => `${actor ?? 'Người mua'} đã gửi yêu cầu mua · Chờ người bán xác nhận`,
  },
  seller_confirmed: {
    icon: HandshakeIcon,
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    label: (actor) => `${actor ?? 'Người bán'} đã xác nhận · Giao dịch bắt đầu!`,
  },
  meetup_confirmed: {
    icon: CheckCircle2,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: () => 'Hai bên đã xác nhận thông tin gặp mặt',
  },
  payment_confirmed: {
    icon: Banknote,
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    label: () => 'Đã xác nhận thanh toán · Sắp hoàn tất!',
  },
  completed: {
    icon: Star,
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    label: () => 'Giao dịch hoàn tất thành công 🎉',
  },
  cancelled: {
    icon: XCircle,
    iconColor: 'text-red-400',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: (actor) => `${actor ?? 'Một bên'} đã huỷ giao dịch`,
  },
};

const TransactionSystemMessage = ({ event, actorName, sentAt }: TransactionSystemMessageProps) => {
  const config = EVENT_CONFIG[event];
  const Icon = config.icon;

  const formattedTime = new Date(sentAt).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex justify-center my-3">
      <div
        className={`
          inline-flex items-center gap-2 px-3.5 py-2 rounded-full border
          ${config.bgColor} ${config.borderColor}
          text-[11px] font-medium text-gray-600 shadow-xs
          max-w-[85%] text-center
        `}
      >
        <Icon size={13} className={`shrink-0 ${config.iconColor}`} />
        <span className="leading-tight">{config.label(actorName)}</span>
        <span className="shrink-0 text-gray-400 text-[10px]">{formattedTime}</span>
      </div>
    </div>
  );
};

export default TransactionSystemMessage;
