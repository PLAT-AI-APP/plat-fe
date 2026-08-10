import { useAuthStore } from "@/store/useAuthStore";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
import { showAppToast } from "@/lib/toast";
import axios, {
  InternalAxiosRequestConfig,
  AxiosInstance,
  AxiosError,
  AxiosResponse,
} from "axios";
import { refreshAccessToken } from "./auth/postRefresh";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/type/api";

/** 1. Axios 모듈 확장: _retry 속성 정의 */
declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

/** 최종 에러 객체 타입 */
export interface AppError {
  code: string;
  fields: Record<string, string>;
  message: string;
  /** 인터셉터가 AxiosError를 가공한 뒤에도 상태 코드로 인증 만료를 판별하기 위해 보존합니다. */
  status?: number;
}

const DEFAULT_API_ERROR_MESSAGE = "알 수 없는 에러가 발생했습니다.";
const API_ERROR_TOAST_COOLDOWN_MS = 1_000;

let lastApiErrorToast:
  | {
      message: string;
      shownAt: number;
    }
  | undefined;

const BASE_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_BASE_URI,
  headers: { "Content-Type": "application/json" },
};

const isAuthExpiredStatus = (status?: number) =>
  status === 401 || status === 403;

/** 가공 전(AxiosError)·가공 후(AppError) 모두에서 인증 만료를 판별합니다. */
export const isAuthExpiredError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return isAuthExpiredStatus(error.response?.status);
  }

  if (typeof error === "object" && error !== null && "status" in error) {
    return isAuthExpiredStatus((error as AppError).status);
  }

  return false;
};

/** 만료 응답이 여러 요청에서 동시에 와도 안내는 한 번만 노출합니다. */
let isSessionExpiredHandled = false;

/**
 * 클라이언트는 로그인 상태인데 서버가 401을 준 경우의 공통 처리.
 * 저장된 인증 상태를 비우고 다시 로그인하도록 안내합니다.
 */
const handleSessionExpired = () => {
  const { isLoggedIn, logout } = useAuthStore.getState();

  logout();

  if (typeof window === "undefined" || isSessionExpiredHandled) return;

  // 애초에 로그아웃 상태였다면 만료 안내가 아니라 일반 권한 에러이므로 건너뜁니다.
  if (!isLoggedIn) return;

  isSessionExpiredHandled = true;

  const { clearModals, openModal } = useModalStore.getState();
  clearModals();

  useDialogStore.getState().openDialog("LOGIN_REQUIRED", {
    label: "dialog.sessionExpired.title",
    description: "dialog.sessionExpired.description",
    confirmText: "dialog.loginRequired.confirm",
    onConfirm: () => {
      isSessionExpiredHandled = false;
      openModal("LOGIN", { triggerRef: undefined });
    },
  });
};

/** 재로그인 이후 만료 안내를 다시 띄울 수 있도록 초기화합니다. */
export const resetSessionExpiredNotice = () => {
  isSessionExpiredHandled = false;
};

// 안내를 닫고 헤더에서 로그인한 경우에도 플래그가 남지 않도록 로그인 전환을 감시합니다.
useAuthStore.subscribe((state, prevState) => {
  if (!prevState.isLoggedIn && state.isLoggedIn) {
    resetSessionExpiredNotice();
  }
});

const showGlobalApiErrorToast = (message?: string) => {
  if (typeof window === "undefined") return;

  const normalizedMessage = message?.trim();
  if (!normalizedMessage) return;

  const now = Date.now();
  if (
    lastApiErrorToast?.message === normalizedMessage &&
    now - lastApiErrorToast.shownAt < API_ERROR_TOAST_COOLDOWN_MS
  ) {
    return;
  }

  lastApiErrorToast = {
    message: normalizedMessage,
    shownAt: now,
  };

  showAppToast("error", normalizedMessage, { size: "s" });
};

/** 기존 공통 응답 봉투만 골라내는 가드입니다. */
const isLegacyApiSuccessEnvelope = <T>(
  responseData: ApiSuccessResponse<T>,
): responseData is { data: T; result?: "OK" } =>
  Boolean(
    responseData &&
      typeof responseData === "object" &&
      "result" in responseData &&
      responseData.result === "OK" &&
      "data" in responseData,
  );

/** 신규 DTO 응답과 기존 { result: "OK", data } 봉투 응답을 함께 해석합니다. */
export const unwrapApiData = <T>(responseData: ApiSuccessResponse<T>): T => {
  if (isLegacyApiSuccessEnvelope(responseData)) return responseData.data;

  return responseData as T;
};

/** 응답 data를 API 함수들이 바로 사용할 DTO 형태로 정규화합니다. */
const onResponseSuccess = (response: AxiosResponse): AxiosResponse => {
  response.data = unwrapApiData(response.data);

  return response;
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

  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
  }

  return config;
};

/** 응답 에러 처리 (완전한 타입 지원) */
const onResponseError = async (
  err: AxiosError<ApiErrorResponse>,
  instance: AxiosInstance,
): Promise<AxiosResponse | never> => {
  const originalRequest = err.config;
  const { setAccessToken, setLoggedIn } = useAuthStore.getState();

  // 현재 에러가 발생한 API의 URL 경로를 추출합니다.
  const requestUrl = originalRequest?.url || "";
  const isAuthEndpoint =
    requestUrl.includes("/auth/login") || requestUrl.includes("/auth/refresh");

  // [A] 토큰 갱신 로직 (401 에러 시)
  if (
    err.response?.status === 401 &&
    originalRequest &&
    !originalRequest._retry &&
    // ✨ [수정 포인트] 로그인 실패(/auth/login) 시에는 토큰 재발급(리프레시) 루프를 타지 않고 즉시 에러를 반환합니다.
    !requestUrl.includes("/auth/login") &&
    !requestUrl.includes("/auth/refresh")
  ) {
    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();

      if (!newAccessToken) {
        handleSessionExpired();
        return Promise.reject(err);
      }

      // 2. Zustand 스토어 업데이트
      setAccessToken(newAccessToken);
      setLoggedIn(true);
      resetSessionExpiredNotice();

      // 3. 실패했던 기존 요청의 헤더를 새 토큰으로 교체
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // 4. 원래의 요청 재시도
      return instance(originalRequest);
    } catch (refreshError) {
      // 재발급까지 실패하면 서버 세션이 끊긴 상태이므로 클라이언트 인증 상태도 비웁니다.
      if (isAuthExpiredError(refreshError)) {
        handleSessionExpired();
      }
      return Promise.reject(refreshError);
    }
  }

  // [A-1] 재시도 후에도 남은 401은 더 이상 복구할 수 없는 만료 상태입니다.
  if (err.response?.status === 401 && !isAuthEndpoint) {
    handleSessionExpired();
  }

  // [B] 에러 포맷팅
  if (err.response?.data) {
    const { code, fields, message } = err.response.data;
    const errorMessage = message || DEFAULT_API_ERROR_MESSAGE;
    const formattedError: AppError = {
      code: code || "UNKNOWN_ERROR",
      fields: fields || {},
      message: errorMessage,
      status: err.response.status,
    };

    // 세션 만료 안내는 Dialog로 보여주므로 토스트까지 겹치지 않게 합니다.
    // 로그인 실패(/auth/login) 401은 사유를 알려야 하므로 그대로 노출합니다.
    const isSessionExpired = err.response.status === 401 && !isAuthEndpoint;
    if (!isSessionExpired) {
      showGlobalApiErrorToast(errorMessage);
    }

    return Promise.reject(formattedError);
  }

  return Promise.reject(err);
};

// 인터셉터 연결
const onPlainResponseError = (
  err: AxiosError<ApiErrorResponse>,
): Promise<never> => {
  if (err.response?.data) {
    const requestUrl = err.config?.url || "";
    const { code, fields, message } = err.response.data;
    const errorMessage = message || DEFAULT_API_ERROR_MESSAGE;
    const formattedError: AppError = {
      code: code || "UNKNOWN_ERROR",
      fields: fields || {},
      message: errorMessage,
      // 재발급 실패를 호출부에서 인증 만료로 판별할 수 있도록 상태 코드를 남깁니다.
      status: err.response.status,
    };

    if (!requestUrl.includes("/auth/refresh")) {
      showGlobalApiErrorToast(errorMessage);
    }

    return Promise.reject(formattedError);
  }

  return Promise.reject(err);
};

plainAxios.interceptors.response.use(onResponseSuccess, onPlainResponseError);

axiosInstance.interceptors.request.use((c) => onRequest(c));
axiosInstance.interceptors.response.use(
  onResponseSuccess,
  (err: AxiosError<ApiErrorResponse>) => {
    // 2. 기존 에러 처리 함수 실행
    return onResponseError(err, axiosInstance);
  },
);

// 인증이 필요한 API용 인터셉터
authAxios.interceptors.request.use((c) => onRequest(c, true));
authAxios.interceptors.response.use(
  onResponseSuccess,
  (err: AxiosError<ApiErrorResponse>) => {
    // 1. 콘솔에 백엔드 에러 출력
    if (err.response?.data) {
      // console.error(`🔒 [authAxios Error] ${code}: ${message}`, data);
    }
    // 2. 기존 에러 처리 함수 실행
    return onResponseError(err, authAxios);
  },
);
