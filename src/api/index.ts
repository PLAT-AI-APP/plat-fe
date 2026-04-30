import { useAuthStore } from "@/store/useAuthStore";
import { ApiErrorResponse } from "@/type/api";
import axios, { InternalAxiosRequestConfig } from "axios";

const BASE_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_BASE_URI,
  timeout: 5000,
  headers: { "Content-Type": "application/json", "X-Client-Type": "web" },
};

// 인스턴스 생성
export const axiosInstance = axios.create(BASE_CONFIG);
export const authAxios = axios.create({
  ...BASE_CONFIG,
  withCredentials: true,
});

// 요청 인터셉터 공통 로직
const onRequest = (config: InternalAxiosRequestConfig, addAuth = false) => {
  // if (typeof window === "undefined") return config;

  // Device ID 주입
  const deviceId =
    localStorage.getItem("plat_device_id") || crypto.randomUUID();
  if (!localStorage.getItem("plat_device_id"))
    localStorage.setItem("plat_device_id", deviceId);
  config.headers["X-Device-ID"] = deviceId;

  // 인증 토큰 주입 (선택적)
  const token = useAuthStore.getState().accessToken;
  if (addAuth && token) config.headers.Authorization = `Bearer ${token}`;

  return config;
};

axiosInstance.interceptors.request.use((c) => onRequest(c));
authAxios.interceptors.request.use((c) => onRequest(c, true));

// 응답 인터셉터 (authAxios 전용)
authAxios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    const { logout, setAccessToken } = useAuthStore.getState();

    // 토큰 갱신 로직
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          `${BASE_CONFIG.baseURL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        setAccessToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return authAxios(originalRequest);
      } catch {
        logout();
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    // 에러 포맷팅
    if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data) {
      const { code, data, message } = err.response.data;
      return Promise.reject({ code, fields: data?.fields || {}, message });
    }
    return Promise.reject(err);
  },
);
