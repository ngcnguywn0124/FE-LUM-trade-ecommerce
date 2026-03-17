import { create } from 'zustand';

interface ChatStore {
  totalUnreadCount: number;
  setTotalUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: (amount?: number) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  totalUnreadCount: 0,
  setTotalUnreadCount: (count) => set({ totalUnreadCount: count }),
  incrementUnreadCount: () => set((state) => ({ totalUnreadCount: state.totalUnreadCount + 1 })),
  decrementUnreadCount: (amount = 1) => 
    set((state) => ({ 
      totalUnreadCount: Math.max(0, state.totalUnreadCount - amount) 
    })),
}));
