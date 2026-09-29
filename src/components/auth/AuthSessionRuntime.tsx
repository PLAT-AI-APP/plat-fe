"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { isAuthExpiredError } from "@/api";
import { refreshAccessToken } from "@/api/auth/postRefresh";
import { useMyInfoQuery } from "@/api/user/getMyInfo";
import { useWalletBalanceQuery } from "@/api/wallet/getWalletBalance";
import { PAYMENT_WINDOW_NAME } from "@/lib/paymentWindow";
import { clearSession } from "@/lib/session";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

const AUTH_STORAGE_KEY = "auth-storage";
const USER_STORAGE_KEY = "user-storage";

/**
 * PC 결제창(팝업)인지. 결제창은 결과를 원래 창에 넘기고 곧 스스로 닫힌다. 여기서 세션을 복구하면
 * 리프레시 토큰이 회전되는 도중 창이 닫혀 새 쿠키를 잃을 수 있고, 그러면 원래 창의 세션이 끊긴다.
 */
const isPaymentPopup = () =>
  typeof window !== "undefined" &&
  (window.name === PAYMENT_WINDOW_NAME ||
    window.location.pathname.startsWith("/payments/"));

/** 다른 탭이 바꾼 auth-storage 값에서 로그인 여부만 읽는다. 읽을 수 없으면 null. */
const readPersistedLoggedIn = (value: string | null): boolean | null => {
  if (value === null) return false;
  try {
    const parsed = JSON.parse(value) as { state?: { isLoggedIn?: unknown } };
    return typeof parsed.state?.isLoggedIn === "boolean"
      ? parsed.state.isLoggedIn
      : null;
  } catch {
    return null;
  }
};

/**
 * 화면 렌더링 없이 인증 세션의 생명주기만 담당
 * 인증 상태 변경에 따른 앱 셸과 페이지의 리렌더링 방지를 위해 별도 섬으로 분리
 */
const AuthSessionRuntime = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setAuthReady = useAuthStore((state) => state.setAuthReady);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const [hasHydrated, setHasHydrated] = useState(false);
  const wasLoggedInRef = useRef(isLoggedIn);

  // 사용자·지갑 쿼리 상태를 이 컴포넌트에 격리해 앱 셸의 불필요한 리렌더링 방지
  useMyInfoQuery();
  useWalletBalanceQuery();

  useEffect(() => {
    // 저장소 복원 전 인증 판정으로 기존 로그인 세션을 로그아웃으로 오인하는 상황 방지
    setHasHydrated(useAuthStore.persist.hasHydrated());

    return useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    // 비로그인이거나 이미 토큰이 있으면 복구할 것이 없다. 이때 인증 준비를 false 로 내렸다 올리면
    // 토큰이 바뀔 때마다 인증을 기다리는 조회가 한 번씩 꺼졌다 켜진다.
    if (!isLoggedIn || accessToken || isPaymentPopup()) {
      setAuthReady(true);
      return;
    }

    let isMounted = true;

    // 로그인 상태는 남아 있지만 메모리의 액세스 토큰이 없는 경우 리프레시 토큰으로 세션 복구
    const recoverSession = async () => {
      try {
        const refreshedAccessToken = await refreshAccessToken();
        if (!isMounted) return;

        if (refreshedAccessToken) {
          setAccessToken(refreshedAccessToken);
          setLoggedIn(true);
        } else {
          clearSession({ reason: "expired" });
        }
      } catch (error) {
        if (isMounted && isAuthExpiredError(error)) {
          clearSession({ reason: "expired" });
        }
      } finally {
        if (isMounted) setAuthReady(true);
      }
    };

    setAuthReady(false);
    void recoverSession();

    return () => {
      isMounted = false;
    };
  }, [
    accessToken,
    hasHydrated,
    isLoggedIn,
    setAccessToken,
    setAuthReady,
    setLoggedIn,
  ]);

  // 다른 탭에서 로그인·로그아웃하면 이 탭도 따라간다. 토큰은 탭마다 메모리에 있어, 로그인 여부만 맞추고
  // 토큰은 위의 복구 흐름이 리프레시로 새로 받는다.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === USER_STORAGE_KEY) {
        void useUserStore.persist.rehydrate();
        return;
      }
      if (event.key !== AUTH_STORAGE_KEY) return;

      const persistedLoggedIn = readPersistedLoggedIn(event.newValue);
      if (persistedLoggedIn === null) return;

      const { isLoggedIn: currentLoggedIn } = useAuthStore.getState();
      if (!persistedLoggedIn && currentLoggedIn) {
        clearSession({ reason: "logout" });
      } else if (persistedLoggedIn && !currentLoggedIn) {
        void useAuthStore.persist.rehydrate();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    // 비로그인 상태에서 실행되지 않았거나 비어 있던 사용자 데이터를 로그인 직후 재요청
    if (!wasLoggedInRef.current && isLoggedIn) {
      void queryClient.invalidateQueries();
    }
    wasLoggedInRef.current = isLoggedIn;
  }, [isLoggedIn, queryClient]);

  return null;
};

export default AuthSessionRuntime;
