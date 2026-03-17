import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'api/proxy/api/v1'; // ← trỏ đến route proxy nội bộ

const BACKEND_AUTH_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8686/api/v1';

/**
 * Axios instance với withCredentials: true
 * → Browser tự gửi httpOnly cookie cùng mọi request, không cần đọc/lưu token thủ công.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    'Content-Type': 'application/json',
    //'ngrok-skip-browser-warning': 'true'
  },
  timeout: 15000,
  withCredentials: true, // ← gửi cookie theo mọi request
});

// ── Auto-refresh on 401 ────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token?: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // POST đến /auth/refresh-token − browser tự gửi refreshToken cookie (path=/api/v1/auth)
        await axios.post(
          `${BACKEND_AUTH_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );
        // Backend set cookie accessToken mới trong response
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;


