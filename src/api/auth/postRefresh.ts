import { useMutation } from "@tanstack/react-query";
import { plainAxios } from "..";
import { useAuthStore } from "@/store/useAuthStore";

type RefreshResponse = {
  accessToken?: string;
};

let refreshPromise: Promise<string | null> | null = null;

export const postRefresh = async () => {
  const response = await plainAxios.post<RefreshResponse>(
    "/auth/refresh", // 이 경로가 핸들러에 등록된 경로와 토씨 하나 안 틀리고 같아야 합니다.
    {},
    {
      withCredentials: true,
    },
  );
  return response.data;
};

/** 탭끼리 재발급을 한 줄로 세우는 Web Locks 이름 */
const REFRESH_LOCK_NAME = "plat-refresh";

/** 다른 탭이 방금 리프레시 토큰을 바꿔(회전) 우리 요청이 옛 쿠키로 나갔을 때, 새 쿠키로 다시 해 보기까지의 간격 */
const REFRESH_RETRY_MIN_DELAY_MS = 300;
const REFRESH_RETRY_JITTER_MS = 200;

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const isUnauthorized = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "status" in error &&
  (error as { status?: number }).status === 401;

/**
 * 재발급 한 번. 401 이면 잠깐 뒤 한 번만 다시 해 본다.
 *
 * 리프레시 토큰은 쓸 때마다 바뀐다. 두 탭이 거의 동시에 재발급하면 늦은 쪽은 이미 바뀐 옛 쿠키를 보내 401 을
 * 받는데, 그 사이 브라우저에는 새 쿠키가 들어와 있다. 곧바로 로그아웃시키지 않고 새 쿠키로 한 번 더 확인한다.
 */
const refreshOnce = async () => {
  try {
    return (await postRefresh()).accessToken ?? null;
  } catch (error) {
    if (!isUnauthorized(error)) throw error;
    await wait(REFRESH_RETRY_MIN_DELAY_MS + Math.random() * REFRESH_RETRY_JITTER_MS);
    return (await postRefresh()).accessToken ?? null;
  }
};

/**
 * 같은 브라우저의 모든 탭에서 재발급을 한 번에 하나씩만 하게 한다. 먼저 끝난 탭이 쿠키를 바꿔 두면
 * 다음 탭은 새 쿠키로 요청하므로 서로의 토큰을 무효로 만들지 않는다. Web Locks 가 없는 브라우저는
 * 탭 안에서만 합치고, 위의 401 재시도로 경합을 흡수한다.
 */
const refreshAcrossTabs = (): Promise<string | null> => {
  if (typeof navigator !== "undefined" && navigator.locks?.request) {
    // 콜백이 돌려준 Promise 는 런타임에 풀리지만 타입은 겹쳐 있어 then 으로 한 겹 벗긴다.
    return navigator.locks
      .request(REFRESH_LOCK_NAME, refreshOnce)
      .then((token) => token);
  }
  return refreshOnce();
};

export const refreshAccessToken = async () => {
  // 한 탭 안의 동시 요청은 재발급 하나를 함께 기다린다.
  if (!refreshPromise) {
    refreshPromise = refreshAcrossTabs().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

/** refreshToken 갱신 */
export const useRefrshMutation = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

  return useMutation({
    mutationFn: refreshAccessToken,
    onSuccess: (accessToken) => {
      if (!accessToken) return;
      setAccessToken(accessToken);
      setLoggedIn(true);
    },
  });
};
