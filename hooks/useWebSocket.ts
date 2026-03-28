'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useAuthStore } from '@/stores/authStore';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8686/api/v1/ws';

export interface ProductStatusEvent {
  type: 'PRODUCT_STATUS_CHANGED';
  productId: string;
  newStatus: string;
  message: string;
}

/**
 * Hook WebSocket dùng chung.
 * - onMessageReceived: nhận mọi tin nhắn riêng tư (/user/.../queue/notifications) hoặc admin
 * - watchProductId: subscribe thêm kênh công khai /topic/products/{watchProductId}
 * - onProductStatusChanged: callback khi nhận event từ topic sản phẩm
 * - onBlogEvent: callback khi có tin blog mới hoặc thay đổi trạng thái blog
 */
export const useWebSocket = (
  onMessageReceived?: (message: string) => void,
  watchProductId?: string,
  onProductStatusChanged?: (event: ProductStatusEvent) => void,
  onBlogEvent?: (message: string) => void,
) => {
  const { user } = useAuthStore();
  const stompClientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    // Cho phép kết nối ngay cả khi chưa đăng nhập để nghe các topic công khai (như Blog)
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      setIsConnected(true);
      console.log('WebSocket connected: ' + frame);

      // 1. Kênh cá nhân (nếu đã đăng nhập)
      if (user?.userId) {
        client.subscribe(`/topic/user-${user.userId}`, (message) => {
          if (onProductStatusChanged && message.body.startsWith('{')) {
            try {
              const event = JSON.parse(message.body) as ProductStatusEvent;
              if (event.type === 'PRODUCT_STATUS_CHANGED') {
                onProductStatusChanged(event);
                return;
              }
            } catch { /* ignore parse errors */ }
          }
          if (onMessageReceived) {
            onMessageReceived(message.body);
          }
        });
      }

      // 2. Kênh Admin (nếu là admin/mod)
      const isAdmin = user?.roles?.some((r: any) => 
        ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_MODERATOR'].includes(r)
      );
      
      if (isAdmin) {
        // Thông báo sản phẩm admin
        client.subscribe('/topic/admin/products', (message) => {
          if (onMessageReceived) onMessageReceived(message.body);
        });
        
        // Thông báo Blog/Hệ thống cho admin
        client.subscribe('/topic/admin/notifications', (message) => {
            if (onMessageReceived) onMessageReceived(message.body);
        });
      }

      // 3. Theo dõi sản phẩm cụ thể
      if (watchProductId && onProductStatusChanged) {
        client.subscribe(`/topic/products/${watchProductId}`, (message) => {
          try {
            const event = JSON.parse(message.body) as ProductStatusEvent;
            if (event.type === 'PRODUCT_STATUS_CHANGED') {
              onProductStatusChanged(event);
            }
          } catch { /* ignore parse errors */ }
        });
      }

      // 4. Tuyến tin Blog công khai (Realtime cho cả khách xem)
      client.subscribe('/topic/blogs', (message) => {
          if (onBlogEvent) {
              onBlogEvent(message.body);
          }
      });
    };

    client.onDisconnect = () => {
      setIsConnected(false);
    };

    client.onStompError = (frame) => {
      console.error('STOMP error: ' + frame.headers['message']);
    };

    client.activate();
    stompClientRef.current = client;
  }, [user?.userId, user?.roles, onMessageReceived, watchProductId, onProductStatusChanged, onBlogEvent]);

  const disconnect = useCallback(() => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    stompClient: stompClientRef.current,
    isConnected,
  };
};
