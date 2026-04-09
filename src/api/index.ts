import axios, { AxiosInstance } from "axios";

// 1. 공통 설정 정의
const BASE_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_BASE_URI,
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

    // 401 에러 발생 시 (Access Token 만료)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 1. 토큰 갱신 요청
        // 쿠키(Refresh Token)는 자동으로 전송됩니다.
        const res = await authAxios.post("/api/refresh");

        const newAccessToken = res.data.accessToken;

        // 2. 새 토큰 저장 및 헤더 갱신
        authAxios.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // 3. 원래 요청 재시도
        return authAxios(originalRequest);
      } catch (refreshError) {
        // 갱신 실패 시 (Refresh Token까지 만료) -> 로그아웃 처리
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
