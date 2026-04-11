import axios, { AxiosInstance } from "axios";

// 공통 설정 정의
const BASE_CONFIG = {
  baseURL: "http://localhost:3000",
  // baseURL: process.env.NEXT_PUBLIC_BASE_URI,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
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

    // 401 에러: Access Token 만료 상황
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 요청
        // 서버는 쿠키의 Refresh Token을 확인하고 새 Access Token을 다시 '쿠키'에 구워줍니다.
        await authAxios.post("/api/refresh");

        // 새 토큰을 꺼낼 필요가 없음 (이미 쿠키에 들어있음)
        // 원래 요청 재시도 (쿠키가 알아서 포함됨)
        return authAxios(originalRequest);
      } catch (refreshError) {
        // Refresh Token까지 만료된 경우
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
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
