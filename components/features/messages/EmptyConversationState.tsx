import { MessageCircleMore } from 'lucide-react';

const EmptyConversationState = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
        <MessageCircleMore size={26} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Chọn một cuộc trò chuyện</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">
        Tại đây bạn có thể trao đổi với người mua/bán để thương lượng, hẹn gặp và chốt đơn an toàn.
      </p>
    </div>
  );
};

export default EmptyConversationState;
