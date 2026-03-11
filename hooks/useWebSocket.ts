'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useAuthStore } from '@/stores/authStore';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8686/api/v1/ws';

export const useWebSocket = (onMessageReceived?: (message: string) => void) => {
  const { user } = useAuthStore();
  const stompClientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (!user?.userId) return;

    // Khởi tạo Client từ @stomp/stompjs
    const client = new Client({
      // Vì chúng ta dùng SockJS, chúng ta config qua webSocketFactory
      webSocketFactory: () => new SockJS(WS_URL),
      debug: (str) => {
        // console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      setIsConnected(true);
      console.log('Connected: ' + frame);
      
      // Đăng ký nhận thông báo cá nhân (notifications queue)
      client.subscribe(`/user/${user.userId}/queue/notifications`, (message) => {
        if (onMessageReceived) {
          onMessageReceived(message.body);
        }
      });
    };

    client.onDisconnect = () => {
      setIsConnected(false);
      console.log('Disconnected');
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();
    stompClientRef.current = client;
  }, [user?.userId, onMessageReceived]);

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
