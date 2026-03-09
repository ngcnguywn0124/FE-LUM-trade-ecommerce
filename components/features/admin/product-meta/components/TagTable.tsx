import type { TagResponse } from '@/types/admin';

interface TagTableProps {
  data: TagResponse[];
  onEdit: (tag: TagResponse) => void;
  onDelete: (tag: TagResponse) => void;
}

export default function TagTable({ data, onEdit, onDelete }: TagTableProps) {
  if (data.length === 0) {
    return <p className="text-sm text-gray-500">Chưa có tags phù hợp.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-100">
            <th className="py-2 pr-3 font-semibold">Tên tag</th>
            <th className="py-2 pr-3 font-semibold">Slug</th>
            <th className="py-2 pr-3 font-semibold">Lượt dùng</th>
            <th className="py-2 font-semibold text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.map((tag) => (
            <tr key={tag.tagId} className="border-b border-gray-50 last:border-b-0">
              <td className="py-2.5 pr-3 font-medium text-gray-900">{tag.tagName}</td>
              <td className="py-2.5 pr-3 text-gray-600">{tag.slug || '-'}</td>
              <td className="py-2.5 pr-3 text-gray-600">{tag.usageCount}</td>
              <td className="py-2.5 text-right">
                <div className="inline-flex items-center gap-2">
                  <button
                    onClick={() => onEdit(tag)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => onDelete(tag)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
