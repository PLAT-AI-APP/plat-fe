import { useAuthStore } from "@/store/useAuthStore";
import { ApiErrorResponse } from "@/type/api";
import axios, { AxiosInstance } from "axios";

// 공통 설정 정의
const BASE_CONFIG = {
  baseURL: "http://localhost:3000",
  // baseURL: process.env.NEXT_PUBLIC_BASE_URI,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "X-Client-Type": "web",
  },
};

// 기본 인스턴스 (인증 불필요한 API용)
export const axiosInstance: AxiosInstance = axios.create(BASE_CONFIG);

// 인증 인스턴스 (쿠키 포함, 토큰 갱신 필요 API용)
export const authAxios: AxiosInstance = axios.create({
  ...BASE_CONFIG,
  withCredentials: true,
});

/**
 * 응답 인터셉터: 토큰 자동 갱신 로직
 */
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러: 토큰 갱신 로직 (태욱님 기존 코드 유지)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await authAxios.post("/auth/refresh");
        return authAxios(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // 서버가 정의한 에러 응답(FIELD_ERROR 등)이 있다면 가공해서 던짐
    if (axios.isAxiosError<ApiErrorResponse>(error) && error.response?.data) {
      const { code, data, message } = error.response.data;

      // 여기서 throw 대신 Promise.reject를 사용합니다.
      return Promise.reject({
        code: code,
        fields: data?.fields || {},
        message: message,
      });
    }

    // 그 외 시스템 에러 (네트워크 끊김 등)
    return Promise.reject(error);
  },
);

// 요청 인터셉터: 모든 API 호출 전에 실행됨
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    let deviceId = localStorage.getItem("plat_device_id");

    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("plat_device_id", deviceId);
    }

    // 모든 요청 헤더에 자동으로 주입
    config.headers["X-Device-ID"] = deviceId;
  }
  return config;
});
