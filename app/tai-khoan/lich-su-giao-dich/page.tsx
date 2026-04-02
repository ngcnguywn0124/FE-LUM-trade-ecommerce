'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { transactionService, ApiTransactionResponse, SpringPage } from '@/services/transactionService';
import { useAuthStore } from '@/stores/authStore';
import { PackageOpen, Clock, AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Pagination from '@/components/shared/Pagination';
import { useRouter } from 'next/navigation';
import { chatService } from '@/services/chatService';

const TransactionHistoryPage = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<SpringPage<ApiTransactionResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [statusTab, setStatusTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  const fetchTransactions = useCallback(async (pageIndex: number) => {
    if (!user?.userId) return;
    setIsLoading(true);
    try {
      // pageIndex là 0-based (backend), Pagination component dùng 1-based
      const result = await transactionService.getMyTransactions(user.userId, pageIndex, 10);
      setData(result);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId]);

  const router = useRouter();

  const handleChatNavigation = async (tx: ApiTransactionResponse) => {
    if (!user) return;
    const isSeller = tx.sellerId === user.userId;
    const otherUserId = isSeller ? tx.buyerId : tx.sellerId;
    try {
      const conv = await chatService.createOrGetConversation(user.userId, { 
        targetUserId: otherUserId, 
        productId: tx.productId 
      });
      router.push(`/tin-nhan?id=${conv.conversationId}`);
    } catch (e) {
      console.error('Failed to get conversation:', e);
      router.push('/tin-nhan');
    }
  };

  const filtered = useMemo(() => {
    if (!data) return [] as ApiTransactionResponse[];
    return data.content.filter((tx) => {
      const tabOk = statusTab === 'all' ? true : tx.status === statusTab;
      const filterOk = statusFilter === 'all' ? true : tx.status === statusFilter;
      if (!tabOk || !filterOk) return false;

      const created = new Date(tx.createdAt);
      if (fromDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);
        if (created < from) return false;
      }
      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        if (created > to) return false;
      }

      return true;
    });
  }, [data, statusTab, statusFilter, fromDate, toDate]);

  const grouped = useMemo(() => {
    const selling: ApiTransactionResponse[] = [];
    const buying: ApiTransactionResponse[] = [];
    filtered.forEach((tx) => {
      if (tx.sellerId === user?.userId) selling.push(tx);
      else buying.push(tx);
    });
    return { selling, buying };
  }, [filtered, user?.userId]);

  useEffect(() => {
    fetchTransactions(page);
  }, [page, fetchTransactions]);

  // Khi Pagination gọi onPageChange với số 1-based, ta phải convert sang 0-based
  const handlePageChange = useCallback((oneBased: number) => {
    setPage(oneBased - 1);
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Breadcrumb items={[
          { label: 'Tài khoản', href: `/tai-khoan/${user.userId}` },
          { label: 'Lịch sử giao dịch' }
        ]} />
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lịch sử giao dịch</h1>
          <p className="text-gray-500 mt-1">Theo dõi các giao dịch mua/bán của bạn</p>
        </div>
      </div>

      {isLoading && !data ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data?.content.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-12 text-center text-gray-500 flex flex-col items-center gap-4">
          <PackageOpen size={48} className="text-gray-300" />
          <p>Bạn chưa có giao dịch nào.</p>
          <Link href="/" className="mt-2 text-emerald-600 font-semibold hover:underline">
            Khám phá các món đồ thú vị ngay
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Từ:</label>
              <input type="date" className="border rounded-md text-gray-700 px-2 py-1" value={fromDate ?? ''} onChange={(e) => setFromDate(e.target.value || null)} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Đến:</label>
              <input type="date" className="border rounded-md text-gray-700 px-2 py-1" value={toDate ?? ''} onChange={(e) => setToDate(e.target.value || null)} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Trạng thái:</label>
              <select className="border rounded-md text-gray-700 px-2 py-1" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="completed">Hoàn tất</option>
                <option value="cancelled">Đã huỷ</option>
                <option value="buyer_requested">Đã gửi yêu cầu</option>
                <option value="seller_confirmed">Người bán xác nhận</option>
                <option value="meetup_confirmed">Đã chốt hẹn</option>
                <option value="payment_pending">Chờ thanh toán</option>
                <option value="disputed">Đang tranh chấp</option>
              </select>
            </div>
            <div>
              <button className="text-sm text-gray-500 hover:underline cursor-pointer" onClick={() => { setFromDate(null); setToDate(null); setStatusFilter('all'); setStatusTab('all'); }}>Reset bộ lọc</button>
            </div>
          </div>

          <div className="space-y-6">
            {grouped.selling.length > 0 && (
              <div>
                <h3 className="text-gray-700 font-semibold mb-3">Bạn Bán ({grouped.selling.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {grouped.selling.map((tx) => {
                    const isSeller = tx.sellerId === user.userId;
                    const statusConfig = getStatusConfig(tx.status);
                    return (
                      <div
                        key={tx.transactionId}
                        onClick={() => handleChatNavigation(tx)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleChatNavigation(tx); }}
                        className={`bg-white rounded-2xl border border-gray-100 p-5 transition-colors ${tx.status === 'completed' ? 'ring-2 ring-emerald-50 shadow' : ''} ${tx.status === 'cancelled' ? 'opacity-50' : 'shadow-sm hover:border-emerald-200'} cursor-pointer`}
                      >
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold bg-gray-100 px-2 py-1 rounded-lg text-gray-700 uppercase tracking-wide">{isSeller ? 'Bạn Bán' : 'Bạn Mua'}</span>
                            <span className="text-xs text-gray-400">Ngày tạo: {new Date(tx.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.className}`}>
                            <statusConfig.icon size={14} />
                            {statusConfig.label}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                            <Image src={tx.productImageUrl || '/template.png'} alt={tx.productTitle} fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="block group cursor-pointer" onClick={(e) => { e.stopPropagation(); handleChatNavigation(tx); }}>
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{tx.productTitle}</h3>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex flex-col">
                                <span className="text-xs text-gray-400 font-medium">Người mua</span>
                                <Link href={`/tai-khoan/${tx.buyerId}`} className="font-semibold text-gray-800 hover:text-emerald-600" onClick={(e) => e.stopPropagation()}>{tx.buyerName}</Link>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs text-gray-400 font-medium">Giá chốt</span>
                                <span className="font-bold text-emerald-600">{tx.agreedPrice != null ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tx.agreedPrice) : 'Chưa chốt'}</span>
                              </div>
                              {tx.meetupLocation && (
                                <div className="flex flex-col">
                                  <span className="text-xs text-gray-400 font-medium">Điểm hẹn</span>
                                  <span className="font-medium text-gray-700">{tx.meetupLocation}</span>
                                </div>
                              )}
                              {tx.meetupTime && (
                                <div className="flex flex-col">
                                  <span className="text-xs text-gray-400 font-medium">Thời gian</span>
                                  <span className="font-medium text-gray-700">{new Date(tx.meetupTime).toLocaleString('vi-VN')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {grouped.buying.length > 0 && (
              <div>
                <h3 className="text-gray-700 font-semibold mb-3">Bạn Mua ({grouped.buying.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {grouped.buying.map((tx) => {
                    const isSeller = tx.sellerId === user.userId;
                    const statusConfig = getStatusConfig(tx.status);
                    return (
                      <div
                        key={tx.transactionId}
                        onClick={() => handleChatNavigation(tx)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleChatNavigation(tx); }}
                        className={`bg-white rounded-2xl border border-gray-100 p-5 transition-colors ${tx.status === 'completed' ? 'ring-2 ring-emerald-50 shadow' : ''} ${tx.status === 'cancelled' ? 'opacity-50' : 'shadow-sm hover:border-emerald-200'} cursor-pointer`}
                      >
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold bg-gray-100 px-2 py-1 rounded-lg text-gray-700 uppercase tracking-wide">{isSeller ? 'Bạn Bán' : 'Bạn Mua'}</span>
                            <span className="text-xs text-gray-400">Ngày tạo: {new Date(tx.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.className}`}>
                            <statusConfig.icon size={14} />
                            {statusConfig.label}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                            <Image src={tx.productImageUrl || '/template.png'} alt={tx.productTitle} fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="block group cursor-pointer" onClick={(e) => { e.stopPropagation(); handleChatNavigation(tx); }}>
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{tx.productTitle}</h3>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex flex-col">
                                <span className="text-xs text-gray-400 font-medium">{isSeller ? "Người mua" : "Người bán"}</span>
                                <Link href={`/tai-khoan/${isSeller ? tx.buyerId : tx.sellerId}`} className="font-semibold text-gray-800 hover:text-emerald-600" onClick={(e) => e.stopPropagation()}>
                                  {isSeller ? tx.buyerName : tx.sellerName}
                                </Link>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs text-gray-400 font-medium">Giá chốt</span>
                                <span className="font-bold text-emerald-600">{tx.agreedPrice != null ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tx.agreedPrice) : 'Chưa chốt'}</span>
                              </div>
                              {tx.meetupLocation && (
                                <div className="flex flex-col">
                                  <span className="text-xs text-gray-400 font-medium">Điểm hẹn</span>
                                  <span className="font-medium text-gray-700">{tx.meetupLocation}</span>
                                </div>
                              )}
                              {tx.meetupTime && (
                                <div className="flex flex-col">
                                  <span className="text-xs text-gray-400 font-medium">Thời gian</span>
                                  <span className="font-medium text-gray-700">{new Date(tx.meetupTime).toLocaleString('vi-VN')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {data && data.totalPages > 1 && (
              <Pagination 
                currentPage={data.number + 1}  // convert 0-based → 1-based cho Pagination
                totalPages={data.totalPages} 
                onPageChange={handlePageChange} 
              />
            )}
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default TransactionHistoryPage;

function getStatusConfig(status: string) {
  switch (status) {
    case 'buyer_requested': return { label: 'Đã gửi yêu cầu', className: 'text-blue-700 border-blue-200 bg-blue-50', icon: Clock };
    case 'seller_confirmed': return { label: 'Người bán xác nhận', className: 'text-indigo-700 border-indigo-200 bg-indigo-50', icon: CheckCircle2 };
    case 'meetup_confirmed': return { label: 'Đã chốt hẹn', className: 'text-amber-700 border-amber-200 bg-amber-50', icon: Clock };
    case 'payment_pending': return { label: 'Chờ thanh toán', className: 'text-orange-700 border-orange-200 bg-orange-50', icon: AlertCircle };
    case 'completed': return { label: 'Hoàn tất', className: 'text-emerald-700 border-emerald-200 bg-emerald-50', icon: CheckCircle2 };
    case 'cancelled': return { label: 'Đã huỷ', className: 'text-rose-700 border-rose-200 bg-rose-50', icon: XCircle };
    case 'disputed': return { label: 'Đang tranh chấp', className: 'text-red-700 border-red-200 bg-red-50', icon: AlertCircle };
    default: return { label: 'Trạng thái khác', className: 'text-gray-700 border-gray-200 bg-gray-50', icon: Clock };
  }
}
