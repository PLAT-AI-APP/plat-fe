import { useAuthStore } from "@/store/useAuthStore";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
import { showAppToast } from "@/lib/toast";
import {
  NETWORK_ERROR_CODE,
  TIMEOUT_ERROR_CODE,
  UNKNOWN_ERROR_CODE,
  formatErrorDetail,
} from "@/lib/apiError";
import axios, {
  InternalAxiosRequestConfig,
  AxiosInstance,
  AxiosError,
  AxiosResponse,
} from "axios";
import { refreshAccessToken } from "./auth/postRefresh";
import { useLocaleStore } from "@/store/useLocaleStore";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/type/api";

/** 1. Axios 모듈 확장: _retry 속성 정의 */
declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

/**
 * 최종 에러 객체 타입.
 *
 * 화면과 로그가 "어디에서 무엇이 실패했는지"를 말할 수 있어야 하므로,
 * 서버가 준 code/message 뿐 아니라 요청 자체의 정보도 함께 싣는다.
 */
export interface AppError {
  code: string;
  fields: Record<string, string>;
  message: string;
  /** 인터셉터가 AxiosError를 가공한 뒤에도 상태 코드로 인증 만료를 판별하기 위해 보존합니다. */
  status?: number;
  /** 실패한 요청 경로(baseURL 제외). 예: /home/today-pick */
  requestUrl?: string;
  /** 실패한 요청 메서드. 예: GET */
  requestMethod?: string;
  /** 세션 만료처럼 이미 Dialog 등 다른 UI로 안내한 에러라 전역 토스트를 건너뛰어야 함을 표시합니다. */
  suppressToast?: boolean;
}


const DEFAULT_API_ERROR_MESSAGE = "요청을 처리하지 못했습니다.";
const NETWORK_ERROR_MESSAGE = "네트워크 연결을 확인해 주세요.";
const TIMEOUT_ERROR_MESSAGE = "서버 응답이 너무 늦어 요청을 중단했습니다.";
/** 응답 없는 실패를 하염없이 기다리지 않도록 상한을 둡니다. */
const REQUEST_TIMEOUT_MS = 20_000;
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
  timeout: REQUEST_TIMEOUT_MS,
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

const showGlobalApiErrorToast = (message?: string, detail?: string) => {
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

  showAppToast("error", normalizedMessage, { description: detail });
};

const isAppError = (error: unknown): error is AppError =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  "fields" in error &&
  "message" in error;

/**
 * react-query의 QueryCache/MutationCache onError에 연결합니다.
 * 인터셉터가 아니라 여기서 토스트를 띄워야, 실패한 요청이 자동 재시도되는 동안에는
 * 조용히 있다가 재시도를 모두 마치고 최종 실패가 확정된 시점에 딱 한 번만 노출됩니다.
 * (인터셉터에서 바로 띄우면 재시도 횟수만큼 같은 에러 토스트가 중복으로 뜹니다.)
 */
export const notifyApiError = (error: unknown) => {
  if (!isAppError(error) || error.suppressToast) return;

  // 개발 모드에서는 어느 요청이 왜 깨졌는지 한 줄로 함께 남긴다.
  const detail = formatErrorDetail(error);
  if (detail) console.error(`[API] ${detail}`, error);

  showGlobalApiErrorToast(error.message, detail);
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

/** 실패한 요청 자체의 정보. 어느 화면의 어떤 호출이 깨졌는지 추적하는 근거가 됩니다. */
const describeRequest = (err: AxiosError) => ({
  requestUrl: err.config?.url,
  requestMethod: err.config?.method?.toUpperCase(),
});

/**
 * AxiosError를 항상 AppError로 변환합니다.
 *
 * 예전에는 응답 본문이 없으면 undefined를 반환했는데, 그러면 네트워크 단절·CORS·타임아웃처럼
 * "서버에 닿지도 못한" 실패가 AppError가 아니게 되어 전역 토스트 가드(isAppError)에 걸러졌다.
 * 사용자 입장에서는 아무 일도 일어나지 않은 것처럼 보였다 — 가장 자주 겪는 실패가 가장 조용했다.
 * 이제 응답 유무와 무관하게 항상 AppError를 만든다.
 */
const buildAppError = (err: AxiosError<ApiErrorResponse>): AppError => {
  const request = describeRequest(err);

  if (!err.response) {
    const isTimeout =
      err.code === "ECONNABORTED" || err.code === "ETIMEDOUT";

    return {
      code: isTimeout ? TIMEOUT_ERROR_CODE : NETWORK_ERROR_CODE,
      fields: {},
      message: isTimeout ? TIMEOUT_ERROR_MESSAGE : NETWORK_ERROR_MESSAGE,
      ...request,
    };
  }

  const { code, fields, message } = err.response.data ?? {};

  return {
    code: code || UNKNOWN_ERROR_CODE,
    fields: fields || {},
    message: message || DEFAULT_API_ERROR_MESSAGE,
    status: err.response.status,
    ...request,
  };
};

/** 인터셉터 없는 순수 axios. 토큰 재발급(refresh) 등 401 재시도 루프를 타면 안 되는 요청에 사용합니다. */
export const plainAxios = axios.create(BASE_CONFIG);

/** 로그인 여부와 무관한 일반 API용. 요청 시 X-Device-ID는 붙이지만 Authorization 헤더는 붙이지 않으며, 애초에 인증 토큰을 싣지 않으므로 401도 재발급 대상이 아닌 일반 에러로 처리합니다. */
export const axiosInstance: AxiosInstance = axios.create(BASE_CONFIG);

/** 로그인이 필요한 API용. Authorization 헤더를 자동으로 싣고 withCredentials로 쿠키를 함께 보내며, 401 시 재발급 후 재시도합니다. */
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

    // 데이터 언어는 body/queryParam이 아닌 Accept-Language 헤더로만 전달합니다.
    config.headers["Accept-Language"] = useLocaleStore.getState().locale;
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
    !isAuthEndpoint
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
  const formattedError = buildAppError(err);

  // 세션 만료 안내는 Dialog로 보여주므로 토스트까지 겹치지 않게 합니다.
  // 로그인 실패(/auth/login) 401은 사유를 알려야 하므로 그대로 노출합니다.
  const isSessionExpired = err.response?.status === 401 && !isAuthEndpoint;

  return Promise.reject({
    ...formattedError,
    suppressToast: isSessionExpired,
  });
};

// 인터셉터 연결
const onPlainResponseError = (
  err: AxiosError<ApiErrorResponse>,
): Promise<never> => {
  const formattedError = buildAppError(err);
  const requestUrl = err.config?.url || "";

  return Promise.reject({
    ...formattedError,
    suppressToast: requestUrl.includes("/auth/refresh"),
  });
};

// plainAxios는 재시도 로직은 타지 않지만, 에러 메시지 언어는 다른 인스턴스와 동일하게 맞춥니다.
plainAxios.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    config.headers["Accept-Language"] = useLocaleStore.getState().locale;
  }
  return config;
});
plainAxios.interceptors.response.use(onResponseSuccess, onPlainResponseError);

axiosInstance.interceptors.request.use(onRequest);
// axiosInstance는 Authorization을 싣지 않으므로 401도 세션 만료가 아닌 일반 에러입니다.
// plainAxios와 동일하게 재발급/재시도 없이 에러 포맷팅 + 토스트만 수행합니다.
axiosInstance.interceptors.response.use(
  onResponseSuccess,
  onPlainResponseError,
);

// 인증이 필요한 API용 인터셉터
authAxios.interceptors.request.use((c) => onRequest(c, true));
authAxios.interceptors.response.use(
  onResponseSuccess,
  (err: AxiosError<ApiErrorResponse>) => onResponseError(err, authAxios),
);
