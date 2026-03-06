'use client';

import { useState } from 'react';
import { ShieldCheck, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import * as roleService from '@/services/roleService';
import type { RoleResponse, RoleRequest } from '@/types/admin';
import { FormInput } from '@/components/shared/FormInput';

function apiErrMsg(err: unknown, fallback: string) {
  if (err instanceof AxiosError) return err.response?.data?.message ?? fallback;
  return fallback;
}

interface RoleModalProps {
  initial?: RoleResponse | null;
  onClose: () => void;
  onSaved: (r: RoleResponse) => void;
}

export default function RoleModal({ initial, onClose, onSaved }: RoleModalProps) {
  const [form, setForm] = useState<RoleRequest>({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Tên role không được để trống');
      return;
    }
    setSaving(true);
    try {
      const result = initial
        ? await roleService.updateRole(initial.id, form)
        : await roleService.createRole(form);
      toast.success(initial ? 'Cập nhật role thành công' : 'Tạo role thành công');
      onSaved(result);
    } catch (err) {
      toast.error(apiErrMsg(err, 'Thao tác thất bại'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheck size={18} className="text-orange-500" />
            {initial ? 'Chỉnh sửa role' : 'Tạo role mới'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormInput
            label="Tên role"
            required
            placeholder="ROLE_MODERATOR"
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                name: e.target.value.toUpperCase().replace(/\s+/g, '_'),
              }))
            }
          />
          <p className="-mt-3 text-xs text-gray-400">
            Tên role phải bắt đầu bằng ROLE_ (ví dụ: ROLE_MODERATOR)
          </p>

          <FormInput
            label="Mô tả"
            placeholder="Mô tả ngắn về quyền hạn của role này"
            value={form.description ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-60 transition-colors flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {initial ? 'Lưu thay đổi' : 'Tạo role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
