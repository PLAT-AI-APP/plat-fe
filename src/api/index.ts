import { useAuthStore } from "@/store/useAuthStore";
import axios, {
  InternalAxiosRequestConfig,
  AxiosInstance,
  AxiosError,
  AxiosResponse,
} from "axios";
import { postRefresh } from "./auth/postRefresh";

/** 1. Axios 모듈 확장: _retry 속성 정의 */
declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

/** 서버 공통 응답 규격 */
interface ApiErrorResponse {
  result: string;
  code: string;
  message: string;
  data?: {
    fields?: Record<string, string>;
  };
}

/** 최종 에러 객체 타입 */
export interface AppError {
  code: string;
  fields: Record<string, string>;
  message: string;
}

const BASE_CONFIG = {
  baseURL: "https://api-dev.plat.so",
  // baseURL: process.env.NEXT_PUBLIC_BASE_URI,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
};

// 인터셉터 없는 순수 axios
export const plainAxios = axios.create(BASE_CONFIG);

export const axiosInstance: AxiosInstance = axios.create(BASE_CONFIG);
export const authAxios: AxiosInstance = axios.create({
  ...BASE_CONFIG,
  withCredentials: true,
});

/** 요청 인터셉터 */
const onRequest = (
  config: InternalAxiosRequestConfig,
  addAuth = false,
): InternalAxiosRequestConfig => {
  if (typeof window !== "undefined") {
    const deviceId =
      localStorage.getItem("plat_device_id") || crypto.randomUUID();
    if (!localStorage.getItem("plat_device_id")) {
      localStorage.setItem("plat_device_id", deviceId);
    }
    config.headers["X-Device-ID"] = deviceId;
  }

  const token = useAuthStore.getState().accessToken;
  if (addAuth && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

/** 응답 에러 처리 (완전한 타입 지원) */
const onResponseError = async (
  err: AxiosError<ApiErrorResponse>,
  instance: AxiosInstance,
): Promise<AxiosResponse | never> => {
  const originalRequest = err.config;
  const { logout, setAccessToken } = useAuthStore.getState();

  // [A] 토큰 갱신 로직 (401 에러 시)
  if (
    err.response?.status === 401 &&
    originalRequest &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true;

    try {
      const data = await postRefresh();
      const newAccessToken = data.accessToken;

      setAccessToken(newAccessToken);
      // 기존 요청 재시도 (새 토큰 주입)
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // 인스턴스 재실행 시 타입 단언 없이 실행 가능
      return instance(originalRequest);
    } catch (refreshError) {
      logout();
      if (typeof window !== "undefined") {
        // window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    }
  }

  // [B] 에러 포맷팅
  if (err.response?.data) {
    const { code, data, message } = err.response.data;
    const formattedError: AppError = {
      code: code || "UNKNOWN_ERROR",
      fields: data?.fields || {},
      message: message || "알 수 없는 에러가 발생했습니다.",
    };

    if (code === "MESSAGE" || code === "ALERT") {
      alert(formattedError.message);
    }

    return Promise.reject(formattedError);
  }

  return Promise.reject(err);
};

// 인터셉터 연결
axiosInstance.interceptors.request.use((c) => onRequest(c));
axiosInstance.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiErrorResponse>) => {
    // 1. 콘솔에 백엔드 에러 출력
    if (err.response?.data) {
      const { code, data, message } = err.response.data;
      console.error(`❌ [axiosInstance Error] ${code}: ${message}`, data);
    }
    // 2. 기존 에러 처리 함수 실행
    return onResponseError(err, axiosInstance);
  },
);

// 인증이 필요한 API용 인터셉터
authAxios.interceptors.request.use((c) => onRequest(c, true));
authAxios.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiErrorResponse>) => {
    // 1. 콘솔에 백엔드 에러 출력
    if (err.response?.data) {
      const { code, data, message } = err.response.data;
      console.error(`🔒 [authAxios Error] ${code}: ${message}`, data);
    }
    // 2. 기존 에러 처리 함수 실행
    return onResponseError(err, authAxios);
  },
);
