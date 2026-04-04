'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { transactionService, ApiTransactionResponse, SpringPage } from '@/services/transactionService';
import { useAuthStore } from '@/stores/authStore';
import { PackageOpen, Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Pagination from '@/components/shared/Pagination';
import { useRouter } from 'next/navigation';
import { chatService } from '@/services/chatService';

type TransactionTab = 'selling' | 'buying';
type TimeFilterDays = 7 | 30 | 60 | 90;

const TIME_OPTIONS: TimeFilterDays[] = [7, 30, 60, 90];

const formatDateYMD = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const TransactionHistoryPage = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<SpringPage<ApiTransactionResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState<TransactionTab>('selling');
  const [timeFilterDays, setTimeFilterDays] = useState<TimeFilterDays>(30);
  const [historyTotal, setHistoryTotal] = useState<number>(0);

  const router = useRouter();

  const fetchHistoryTotal = useCallback(async () => {
    if (!user?.userId) return;

    try {
      const overview = await transactionService.getMyTransactions(user.userId, {
        page: 0,
        size: 1,
      });
      setHistoryTotal(overview.totalElements || 0);
    } catch (error) {
      console.error('Failed to fetch history total', error);
      setHistoryTotal(0);
    }
  }, [user?.userId]);

  const fetchTransactions = useCallback(async (pageIndex: number) => {
    if (!user?.userId) return;

    setIsLoading(true);
    try {
      const today = new Date();
      const fromDate = new Date(today);
      fromDate.setDate(today.getDate() - (timeFilterDays - 1));

      const result = await transactionService.getMyTransactions(user.userId, {
        page: pageIndex,
        size: 10,
        role: activeTab === 'selling' ? 'seller' : 'buyer',
        fromDate: formatDateYMD(fromDate),
        toDate: formatDateYMD(today),
      });
      setData(result);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, timeFilterDays, user?.userId]);

  const handleChatNavigation = async (tx: ApiTransactionResponse) => {
    if (!user) return;

    const isSeller = tx.sellerId === user.userId;
    const otherUserId = isSeller ? tx.buyerId : tx.sellerId;

    try {
      const conv = await chatService.createOrGetConversation(user.userId, {
        targetUserId: otherUserId,
        productId: tx.productId,
      });
      router.push(`/tin-nhan?id=${conv.conversationId}`);
    } catch (error) {
      console.error('Failed to get conversation:', error);
      router.push('/tin-nhan');
    }
  };

  useEffect(() => {
    fetchHistoryTotal();
  }, [fetchHistoryTotal]);

  useEffect(() => {
    fetchTransactions(page);
  }, [page, fetchTransactions]);

  useEffect(() => {
    setPage(0);
  }, [activeTab, timeFilterDays]);

  const handlePageChange = useCallback((oneBased: number) => {
    setPage(oneBased - 1);
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Breadcrumb
          items={[
            { label: 'Tài khoản', href: `/tai-khoan/${user.userId}` },
            { label: 'Lịch sử giao dịch' },
          ]}
        />

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lịch sử giao dịch</h1>
            <p className="mt-1 text-gray-500">Theo dõi các giao dịch mua/bán của bạn</p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setActiveTab('selling')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'selling'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Bạn bán
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('buying')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'buying'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Bạn mua
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <select
              id="time-filter"
              value={timeFilterDays}
              onChange={(event) => setTimeFilterDays(Number(event.target.value) as TimeFilterDays)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 cursor-pointer"
            >
              {TIME_OPTIONS.map((day) => (
                <option key={day} value={day}>{day} ngày gần đây</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading && !data ? (
          <div className="flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          </div>
        ) : historyTotal === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white p-12 text-center text-gray-500">
            <PackageOpen size={48} className="text-gray-300" />
            <p>Bạn chưa có lịch sử giao dịch nào.</p>
            <Link href="/" className="mt-2 font-semibold text-emerald-600 hover:underline">
              Khám phá các món đồ thú vị ngay
            </Link>
          </div>
        ) : !data || data.content.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white p-12 text-center text-gray-500">
            <AlertCircle size={48} className="text-gray-300" />
            <p>Không tìm thấy giao dịch nào với bộ lọc hiện tại.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.content.map((tx) => {
                const isSeller = tx.sellerId === user.userId;
                const statusConfig = getStatusConfig(tx.status);

                return (
                  <div
                    key={tx.transactionId}
                    onClick={() => handleChatNavigation(tx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        handleChatNavigation(tx);
                      }
                    }}
                    className={`cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 transition-colors ${
                      tx.status === 'completed' ? 'ring-2 ring-emerald-50 shadow' : ''
                    } ${tx.status === 'cancelled' ? 'opacity-50' : 'shadow-sm hover:border-emerald-200'}`}
                  >
                    <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-gray-100 px-2 py-1 text-sm font-bold uppercase tracking-wide text-gray-700">
                          {isSeller ? 'Bạn Bán' : 'Bạn Mua'}
                        </span>
                        <span className="text-xs text-gray-400">
                          Ngày tạo: {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusConfig.className}`}>
                        <statusConfig.icon size={14} />
                        {statusConfig.label}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                        <Image
                          src={tx.productImageUrl || '/template.png'}
                          alt={tx.productTitle}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div
                          className="group block cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleChatNavigation(tx);
                          }}
                        >
                          <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-emerald-600">
                            {tx.productTitle}
                          </h3>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-400">
                              {isSeller ? 'Người mua' : 'Người bán'}
                            </span>
                            <Link
                              href={`/tai-khoan/${isSeller ? tx.buyerId : tx.sellerId}`}
                              className="font-semibold text-gray-800 hover:text-emerald-600"
                              onClick={(event) => event.stopPropagation()}
                            >
                              {isSeller ? tx.buyerName : tx.sellerName}
                            </Link>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-400">Giá chốt</span>
                            <span className="font-bold text-emerald-600">
                              {tx.agreedPrice != null
                                ? new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                }).format(tx.agreedPrice)
                                : 'Chưa chốt'}
                            </span>
                          </div>

                          {tx.meetupLocation && (
                            <div className="flex flex-col">
                              <span className="text-xs font-medium text-gray-400">Điểm hẹn</span>
                              <span className="font-medium text-gray-700">{tx.meetupLocation}</span>
                            </div>
                          )}

                          {tx.meetupTime && (
                            <div className="flex flex-col">
                              <span className="text-xs font-medium text-gray-400">Thời gian</span>
                              <span className="font-medium text-gray-700">
                                {new Date(tx.meetupTime).toLocaleString('vi-VN')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {data && data.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={data.number + 1}
                  totalPages={data.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryPage;

function getStatusConfig(status: string) {
  switch (status) {
    case 'buyer_requested':
      return { label: 'Đã gửi yêu cầu', className: 'text-blue-700 border-blue-200 bg-blue-50', icon: Clock };
    case 'seller_confirmed':
      return { label: 'Người bán xác nhận', className: 'text-indigo-700 border-indigo-200 bg-indigo-50', icon: CheckCircle2 };
    case 'meetup_confirmed':
      return { label: 'Đã chốt hẹn', className: 'text-amber-700 border-amber-200 bg-amber-50', icon: Clock };
    case 'payment_pending':
      return { label: 'Chờ thanh toán', className: 'text-orange-700 border-orange-200 bg-orange-50', icon: AlertCircle };
    case 'completed':
      return { label: 'Hoàn tất', className: 'text-emerald-700 border-emerald-200 bg-emerald-50', icon: CheckCircle2 };
    case 'cancelled':
      return { label: 'Đã huỷ', className: 'text-rose-700 border-rose-200 bg-rose-50', icon: XCircle };
    case 'disputed':
      return { label: 'Đang tranh chấp', className: 'text-red-700 border-red-200 bg-red-50', icon: AlertCircle };
    default:
      return { label: 'Trạng thái khác', className: 'text-gray-700 border-gray-200 bg-gray-50', icon: Clock };
  }
}
