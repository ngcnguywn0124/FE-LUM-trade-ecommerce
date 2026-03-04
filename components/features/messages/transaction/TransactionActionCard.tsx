'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  MapPin, Clock, CreditCard, Banknote, CheckCircle2,
  XCircle, Star, AlertCircle, Smartphone, Edit3, ThumbsUp
} from 'lucide-react';
import { ConversationTransaction, MessageRelatedPost, TransactionPaymentMethod } from '@/types/messages';
import TransactionStepTracker from './TransactionStepTracker';

interface TransactionActionCardProps {
  transaction: ConversationTransaction;
  relatedPost: MessageRelatedPost;
  isSeller: boolean;
  sellerName: string;
  buyerName: string;
  onSellerSetMeetup: (location: string, time: string) => void;
  onBuyerConfirmMeetup: (paymentMethod: TransactionPaymentMethod) => void;
  onBuyerConfirmPayment: () => void;
  onSellerConfirmPayment: () => void;
  onCancel: () => void;
}

// ─── Derived step from transaction status ───────────────────────────────────

function deriveStep(status: ConversationTransaction['status']): {
  currentStep: number;
  completedSteps: number[];
} {
  switch (status) {
    case 'seller_confirmed':
      return { currentStep: 0, completedSteps: [] };
    case 'meetup_confirmed':
    case 'payment_pending':
      return { currentStep: 1, completedSteps: [0] };
    case 'completed':
      return { currentStep: 2, completedSteps: [0, 1, 2] };
    default:
      return { currentStep: 0, completedSteps: [] };
  }
}

// ─── Sub-components ─────────────────────────────────────────────────────────

const CardSection = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-4 py-3 ${className}`}>{children}</div>
);

const ActionButton = ({
  onClick, variant, icon: Icon, children, disabled = false, loading = false,
}: {
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  icon?: React.ElementType;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}) => {
  const base = 'flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
  const styles = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200',
    secondary: 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-200',
    danger: 'bg-white text-red-500 border border-red-200 hover:bg-red-50',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100',
    outline: 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50',
  };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${base} ${styles[variant]}`}>
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon size={13} />
      )}
      {children}
    </button>
  );
};

// ─── Step 0: Hẹn gặp ────────────────────────────────────────────────────────

const MeetupStep = ({
  transaction, isSeller, sellerName, buyerName,
  onSellerSetMeetup, onBuyerConfirmMeetup,
}: Pick<TransactionActionCardProps, 'transaction' | 'isSeller' | 'sellerName' | 'buyerName' | 'onSellerSetMeetup' | 'onBuyerConfirmMeetup'>) => {
  const [location, setLocation] = useState(transaction.meetupLocation ?? '');
  const [meetTime, setMeetTime] = useState(transaction.meetupTime ?? '');
  const [isEditing, setIsEditing] = useState(!transaction.meetupLocation);
  const [paymentMethod, setPaymentMethod] = useState<TransactionPaymentMethod>('cash');

  const hasMeetupProposal = !!transaction.meetupLocation;
  const buyerConfirmed = transaction.buyerConfirmedMeetup;

  if (isSeller) {
    /* ─── Seller view ─── */
    return (
      <div className="space-y-3">
        {/* Proposal form / display */}
        {isEditing ? (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Đề xuất địa điểm gặp mặt</p>
            <div className="relative">
              <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Địa điểm gặp mặt..."
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-[12px] text-gray-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
              />
            </div>
            <div className="relative">
              <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={meetTime}
                onChange={(e) => setMeetTime(e.target.value)}
                placeholder="Thời gian (VD: 14:00 ngày 10/3)"
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-[12px] text-gray-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
              />
            </div>
            <ActionButton
              onClick={() => {
                if (location.trim() && meetTime.trim()) {
                  onSellerSetMeetup(location.trim(), meetTime.trim());
                  setIsEditing(false);
                }
              }}
              variant="primary"
              icon={MapPin}
              disabled={!location.trim() || !meetTime.trim()}
            >
              Gửi đề xuất cho người mua
            </ActionButton>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <MapPin size={14} className="text-emerald-600 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-emerald-700 font-semibold">Đề xuất của bạn</p>
                <p className="text-[12px] text-gray-800 mt-0.5">{transaction.meetupLocation}</p>
                <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                  <Clock size={10} /> {transaction.meetupTime}
                </p>
              </div>
              <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-emerald-600 cursor-pointer">
                <Edit3 size={13} />
              </button>
            </div>

            {buyerConfirmed ? (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                <CheckCircle2 size={13} className="text-emerald-500" />
                {buyerName} đã xác nhận địa điểm
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] text-orange-600">
                <Clock size={12} />
                Chờ {buyerName} xác nhận địa điểm...
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  /* ─── Buyer view ─── */
  return (
    <div className="space-y-3">
      {!hasMeetupProposal ? (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-orange-50 border border-orange-100 text-[11px] text-orange-700">
          <Clock size={13} className="shrink-0" />
          Chờ {sellerName} đề xuất địa điểm gặp mặt...
        </div>
      ) : (
        <>
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
            <MapPin size={14} className="text-blue-500 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-blue-700 font-semibold">{sellerName} đề xuất</p>
              <p className="text-[12px] text-gray-800 mt-0.5">{transaction.meetupLocation}</p>
              <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                <Clock size={10} /> {transaction.meetupTime}
              </p>
            </div>
          </div>

          {/* Payment method selection */}
          {!buyerConfirmed && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Phương thức thanh toán</p>
              <div className="grid grid-cols-2 gap-2">
                {(['cash', 'transfer'] as const).map((method) => {
                  const Icon = method === 'cash' ? Banknote : Smartphone;
                  const label = method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản';
                  return (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-xl border text-[12px] font-medium transition-all cursor-pointer
                        ${paymentMethod === method
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon size={13} className={paymentMethod === method ? 'text-emerald-600' : 'text-gray-400'} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {buyerConfirmed ? (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
              <CheckCircle2 size={13} className="text-emerald-500" />
              Bạn đã xác nhận địa điểm
            </div>
          ) : (
            <ActionButton onClick={() => onBuyerConfirmMeetup(paymentMethod)} variant="primary" icon={CheckCircle2}>
              Xác nhận địa điểm & Phương thức
            </ActionButton>
          )}
        </>
      )}
    </div>
  );
};

// ─── Step 1: Thanh toán ──────────────────────────────────────────────────────

const PaymentStep = ({
  transaction, isSeller, sellerName, buyerName,
  onBuyerConfirmPayment, onSellerConfirmPayment,
}: Pick<TransactionActionCardProps, 'transaction' | 'isSeller' | 'sellerName' | 'buyerName' | 'onBuyerConfirmPayment' | 'onSellerConfirmPayment'>) => {
  const buyerConfirmed = transaction.buyerConfirmedPayment;
  const sellerConfirmed = transaction.sellerConfirmedPayment;
  const methodLabel = transaction.paymentMethod === 'transfer' ? 'chuyển khoản' : 'tiền mặt';
  const MethodIcon = transaction.paymentMethod === 'transfer' ? Smartphone : Banknote;

  return (
    <div className="space-y-3">
      {/* Payment method badge */}
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-100 w-fit">
        <MethodIcon size={12} className="text-blue-500" />
        <span className="text-[11px] font-semibold text-blue-700 capitalize">Thanh toán {methodLabel}</span>
      </div>

      {/* Confirmation status */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Người mua', icon: ThumbsUp, confirmed: buyerConfirmed, name: buyerName },
          { label: 'Người bán', icon: CheckCircle2, confirmed: sellerConfirmed, name: sellerName },
        ].map(({ label, icon: Icon, confirmed, name }) => (
          <div
            key={label}
            className={`flex items-center gap-1.5 p-2 rounded-lg border text-[11px] transition-colors
              ${confirmed ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-50 border-gray-200 text-gray-500'}
            `}
          >
            <Icon size={12} className={confirmed ? 'text-emerald-500' : 'text-gray-300'} />
            <span>{confirmed ? `${name} ✓` : `Chờ ${name}`}</span>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      {isSeller ? (
        sellerConfirmed ? (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
            <CheckCircle2 size={13} className="text-emerald-500" /> Bạn đã xác nhận nhận tiền
          </div>
        ) : (
          <ActionButton onClick={onSellerConfirmPayment} variant="primary" icon={CheckCircle2}>
            Xác nhận đã nhận tiền
          </ActionButton>
        )
      ) : (
        buyerConfirmed ? (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
            <CheckCircle2 size={13} className="text-emerald-500" /> Bạn đã xác nhận thanh toán
          </div>
        ) : (
          <ActionButton
            onClick={onBuyerConfirmPayment}
            variant="secondary"
            icon={MethodIcon}
          >
            {transaction.paymentMethod === 'transfer' ? 'Đã chuyển khoản' : 'Đã trả tiền mặt'}
          </ActionButton>
        )
      )}
    </div>
  );
};

// ─── Step 2: Hoàn tất ────────────────────────────────────────────────────────

const CompletedStep = ({ isSeller }: { isSeller: boolean }) => (
  <div className="flex flex-col items-center gap-2 py-2 text-center">
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200">
      <CheckCircle2 size={24} className="text-white" />
    </div>
    <div>
      <p className="text-[13px] font-bold text-gray-900">Giao dịch hoàn tất! 🎉</p>
      <p className="text-[11px] text-gray-500 mt-0.5">
        {isSeller ? 'Cảm ơn bạn đã đăng bán trên Lụm!' : 'Cảm ơn bạn đã mua sắm trên Lụm!'}
      </p>
    </div>
    <button className="flex items-center gap-1.5 px-4 py-2 mt-1 rounded-xl bg-yellow-50 border border-yellow-200 text-[12px] font-semibold text-yellow-700 hover:bg-yellow-100 transition-all cursor-pointer">
      <Star size={13} className="fill-yellow-400 text-yellow-400" />
      Đánh giá {isSeller ? 'người mua' : 'người bán'}
    </button>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const TransactionActionCard = ({
  transaction, relatedPost, isSeller, sellerName, buyerName,
  onSellerSetMeetup, onBuyerConfirmMeetup,
  onBuyerConfirmPayment, onSellerConfirmPayment,
  onCancel,
}: TransactionActionCardProps) => {
  const { currentStep, completedSteps } = deriveStep(transaction.status);
  const isCompleted = transaction.status === 'completed';
  const isCancelled = transaction.status === 'cancelled';

  if (isCancelled) {
    return (
      <div className="mx-2 my-3">
        <div className="rounded-2xl border border-red-100 bg-red-50/60 p-4 flex items-center gap-3">
          <XCircle size={20} className="text-red-400 shrink-0" />
          <div>
            <p className="text-[12px] font-semibold text-red-600">Giao dịch đã bị huỷ</p>
            <p className="text-[11px] text-red-400">Mọi thoả thuận đã được huỷ bỏ</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-2 my-3">
      {/* Card container */}
      <div className={`
        rounded-2xl border bg-white shadow-sm overflow-hidden
        ${isCompleted ? 'border-emerald-200 shadow-emerald-100' : 'border-emerald-200/60'}
      `}>
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
              <span className="text-[11px] font-bold text-white tracking-wider uppercase">
                {isCompleted ? 'Giao dịch hoàn tất' : 'Giao dịch đang diễn ra'}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-emerald-100/80">#{transaction.id}</span>
        </div>

        {/* ── Product summary ── */}
        <CardSection className="flex items-center gap-3 border-b border-gray-100">
          <div className="relative shrink-0 w-11 h-11 rounded-xl overflow-hidden border border-gray-100">
            <Image src={relatedPost.image} alt={relatedPost.title} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-gray-900 truncate">{relatedPost.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-gray-400 line-through">{relatedPost.price}</span>
              {transaction.agreedPrice && (
                <>
                  <span className="text-[10px] text-gray-300">→</span>
                  <span className="text-[13px] font-extrabold text-emerald-600">{transaction.agreedPrice}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full font-semibold">Đã thoả</span>
                </>
              )}
            </div>
          </div>
        </CardSection>

        {/* ── Step Tracker ── */}
        {!isCompleted && (
          <CardSection className="border-b border-gray-100">
            <TransactionStepTracker currentStep={currentStep} completedSteps={completedSteps} />
          </CardSection>
        )}

        {/* ── Step Content ── */}
        <CardSection>
          {isCompleted ? (
            <CompletedStep isSeller={isSeller} />
          ) : currentStep === 0 ? (
            <MeetupStep
              transaction={transaction}
              isSeller={isSeller}
              sellerName={sellerName}
              buyerName={buyerName}
              onSellerSetMeetup={onSellerSetMeetup}
              onBuyerConfirmMeetup={onBuyerConfirmMeetup}
            />
          ) : (
            <PaymentStep
              transaction={transaction}
              isSeller={isSeller}
              sellerName={sellerName}
              buyerName={buyerName}
              onBuyerConfirmPayment={onBuyerConfirmPayment}
              onSellerConfirmPayment={onSellerConfirmPayment}
            />
          )}
        </CardSection>

        {/* ── Cancel footer ── */}
        {!isCompleted && (
          <div className="px-4 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <AlertCircle size={10} />
              <span>Huỷ giao dịch nếu có vấn đề</span>
            </div>
            <button
              onClick={onCancel}
              className="flex items-center gap-1 text-[11px] font-medium text-red-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              <XCircle size={12} />
              Huỷ giao dịch
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionActionCard;
