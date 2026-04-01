'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { X, Loader2, UserMinus, UserPlus, Search } from 'lucide-react';
import * as roleService from '@/services/roleService';
import type { RoleResponse, RoleUserResponse } from '@/types/admin';

interface Props {
  role: RoleResponse;
  onClose: () => void;
}

export default function RoleUsersModal({ role, onClose }: Props) {
  const [users, setUsers] = useState<RoleUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  // Bulk add/remove states
  const [userIdInput, setUserIdInput] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await roleService.getUsersByRole(role.id, { page, limit: 10, search });
      setUsers(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch {
      toast.error('Không thể tải người dùng cho role này');
    } finally {
      setLoading(false);
    }
  }, [role.id, page, search]);

  useEffect(() => {
    const delay = setTimeout(() => {
        fetchUsers();
    }, 300);
    return () => clearTimeout(delay);
  }, [fetchUsers, search]);

  async function handleAssignUser(e: React.FormEvent) {
    e.preventDefault();
    if (!userIdInput.trim()) return;
    setProcessing(true);
    try {
      // Input now accepts comma separated emails
      const emails = userIdInput.split(',').map(email => email.trim()).filter(Boolean);
      await roleService.bulkAssignRoleByEmails(role.id, { emails });
      toast.success('Gán role thành công');
      setUserIdInput('');
      fetchUsers();
    } catch {
      toast.error('Gán role thất bại. Kiểm tra lại danh sách Email.');
    } finally {
      setProcessing(false);
    }
  }

  async function handleRevokeUser(userId: string) {
    if (!confirm('Bạn có chắc chắn muốn gỡ role này khỏi người dùng?')) return;
    try {
      await roleService.bulkRevokeRoleFromUsers(role.id, { userIds: [userId] });
      toast.success('Đã gỡ role');
      fetchUsers();
    } catch {
      toast.error('Gỡ role thất bại');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Người dùng Role: {role.name}</h2>
            <p className="text-sm text-gray-500">Quản lý người dùng được gán role này</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Add User form */}
          <form onSubmit={handleAssignUser} className="flex gap-2">
            <input
              type="text"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              placeholder="Nhập Email (cách nhau bởi dấu phẩy)..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm text-gray-700"
              disabled={processing}
            />
            <button
              type="submit"
              disabled={processing || !userIdInput.trim()}
              className="px-4 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              {processing ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              Thêm User
            </button>
          </form>

          {/* Search form */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Tìm kiếm email, số điện thoại, tên..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm transition-all text-gray-700"
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden min-h-[200px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Loader2 size={24} className="animate-spin mb-2 text-orange-500" />
                <p className="text-sm">Đang tải...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <p className="text-sm">Không tìm thấy người dùng nào.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Họ tên</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium w-20 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.userId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-900 font-medium">{u.fullName}</td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleRevokeUser(u.userId)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Gỡ Role"
                        >
                          <UserMinus size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Trước
              </button>
              <span className="text-sm text-gray-600">Trang {page} / {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Tiếp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
