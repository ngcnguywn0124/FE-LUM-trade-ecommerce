'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2, Search, ShieldAlert, XCircle, Filter } from 'lucide-react';
import { toast } from 'sonner';
import {
  getPendingStudentVerifications,
  reviewStudentVerification,
} from '@/services/verificationService';
import { getUniversities } from '@/services/universityService';
import type { PendingStudentVerificationResponse } from '@/types/profile';
import type { UniversityResponse } from '@/types/admin';

const StudentVerificationManagement = () => {
  const [requests, setRequests] = useState<PendingStudentVerificationResponse[]>([]);
  const [universities, setUniversities] = useState<UniversityResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  
  // States for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUniversityId, setFilterUniversityId] = useState<string>('');
  const [filterGraduationYear, setFilterGraduationYear] = useState<string>('');

  const graduationYears = useMemo(() => {
    // Lấy danh sách các năm tốt nghiệp duy nhất từ requests để hiển thị trong dropdown
    const years = requests
      .map((r) => r.graduationYear)
      .filter((y): y is number => !!y);
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [requests]);

  const filteredRequests = useMemo(() => {
    let result = requests;

    // Filter by search term
    if (searchTerm.trim()) {
      const keyword = searchTerm.toLowerCase();
      result = result.filter((item) =>
        [
          item.fullName,
          item.email,
          item.phoneNumber,
          item.studentId,
          item.universityName,
          item.campusName,
          item.faculty,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(keyword)),
      );
    }

    // Filter by university
    if (filterUniversityId) {
      result = result.filter((item) => item.universityId === filterUniversityId);
    }

    // Filter by graduation year
    if (filterGraduationYear) {
      result = result.filter((item) => String(item.graduationYear) === filterGraduationYear);
    }

    return result;
  }, [requests, searchTerm, filterUniversityId, filterGraduationYear]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [verificationData, universityData] = await Promise.all([
        getPendingStudentVerifications(),
        getUniversities(),
      ]);
      setRequests(verificationData);
      setUniversities(universityData);
    } catch {
      toast.error('Không thể tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReview = async (userId: string, approved: boolean) => {
    setProcessingUserId(userId);
    try {
      await reviewStudentVerification(userId, { approved });
      toast.success(approved ? 'Đã duyệt xác thực sinh viên' : 'Đã từ chối xác thực sinh viên');
      setRequests((prev) => prev.filter((item) => item.userId !== userId));
    } catch {
      toast.error('Xử lý yêu cầu xác thực thất bại');
    } finally {
      setProcessingUserId(null);
    }
  };

  return (
    <div className="space-y-5">

      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Duyệt xác thực sinh viên</h1>
            <p className="mt-1 text-sm text-gray-500">
              Danh sách các yêu cầu đang chờ admin duyệt.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchData}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Làm mới
          </button>
        </div>

        <div className="mb-4 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên, MSSV, email, trường, campus..."
                className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>
            <p className="hidden text-xs font-medium text-gray-500 sm:block">
              Hiển thị {filteredRequests.length} / {requests.length} yêu cầu
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Filter size={14} className="text-gray-400" />
              Lọc theo:
            </div>

            <select
              value={filterUniversityId}
              onChange={(e) => setFilterUniversityId(e.target.value)}
              className="rounded-lg border border-gray-200 py-1.5 pl-2 pr-8 text-sm text-gray-700 outline-none focus:border-emerald-500"
            >
              <option value="">Tất cả trường</option>
              {universities.map((uni) => (
                <option key={uni.universityId} value={uni.universityId}>
                  {uni.universityName}
                </option>
              ))}
            </select>

            <select
              value={filterGraduationYear}
              onChange={(e) => setFilterGraduationYear(e.target.value)}
              className="rounded-lg border border-gray-200 py-1.5 pl-2 pr-8 text-sm text-gray-700 outline-none focus:border-emerald-500"
            >
              <option value="">Năm tốt nghiệp</option>
              {graduationYears.map((year) => (
                <option key={year} value={String(year)}>
                  Năm {year}
                </option>
              ))}
            </select>

            {(filterUniversityId || filterGraduationYear || searchTerm) && (
              <button
                type="button"
                onClick={() => {
                  setFilterUniversityId('');
                  setFilterGraduationYear('');
                  setSearchTerm('');
                }}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
              >
                Xóa tất cả lọc
              </button>
            )}

            <p className="ml-auto text-xs font-medium text-gray-500 sm:hidden">
              Hiển thị {filteredRequests.length} / {requests.length}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-44 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex min-h-44 flex-col items-center justify-center gap-2 text-center text-gray-500">
            <ShieldAlert className="h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium">Không có yêu cầu xác thực đang chờ duyệt.</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex min-h-44 flex-col items-center justify-center gap-2 text-center text-gray-500">
            <ShieldAlert className="h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium">Không tìm thấy yêu cầu phù hợp với từ khóa.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr>
                  <th className="border-b border-gray-200 px-3 py-2 text-left font-semibold text-gray-600">Sinh viên</th>
                  <th className="border-b border-gray-200 px-3 py-2 text-left font-semibold text-gray-600">MSSV</th>
                  <th className="border-b border-gray-200 px-3 py-2 text-left font-semibold text-gray-600">Trường / Campus</th>
                  <th className="border-b border-gray-200 px-3 py-2 text-left font-semibold text-gray-600">Ngành / Năm TN</th>
                  <th className="border-b border-gray-200 px-3 py-2 text-left font-semibold text-gray-600">Thời gian gửi</th>
                  <th className="border-b border-gray-200 px-3 py-2 text-right font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((item) => {
                  const isProcessing = processingUserId === item.userId;
                  return (
                    <tr key={item.verificationId} className="hover:bg-gray-50">
                      <td className="border-b border-gray-100 px-3 py-3 align-top">
                        <p className="font-semibold text-gray-900">{item.fullName}</p>
                        <p className="text-xs text-gray-500">{item.email}</p>
                        <p className="text-xs text-gray-500">{item.phoneNumber || 'Chưa có SĐT'}</p>
                      </td>
                      <td className="border-b border-gray-100 px-3 py-3 align-top text-gray-700">
                        {item.studentId || '—'}
                      </td>
                      <td className="border-b border-gray-100 px-3 py-3 align-top text-gray-700">
                        <p>{item.universityName || item.universityId || '—'}</p>
                        <p className="text-xs text-gray-500">{item.campusName || item.campusId || '—'}</p>
                      </td>
                      <td className="border-b border-gray-100 px-3 py-3 align-top text-gray-700">
                        <p>{item.faculty || '—'}</p>
                        <p className="text-xs text-gray-500">{item.graduationYear || '—'}</p>
                      </td>
                      <td className="border-b border-gray-100 px-3 py-3 align-top text-gray-600">
                        {new Date(item.submittedAt).toLocaleString('vi-VN')}
                      </td>
                      <td className="border-b border-gray-100 px-3 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleReview(item.userId, false)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60"
                          >
                            {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle size={14} />}
                            Từ chối
                          </button>
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleReview(item.userId, true)}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
                          >
                            {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 size={14} />}
                            Duyệt
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentVerificationManagement;
