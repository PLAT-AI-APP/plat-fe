"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { isAuthExpiredError } from "@/api";
import { refreshAccessToken } from "@/api/auth/postRefresh";
import { useMyInfoQuery } from "@/api/user/getMyInfo";
import { useWalletBalanceQuery } from "@/api/wallet/getWalletBalance";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * 화면 렌더링 없이 인증 세션의 생명주기만 담당
 * 인증 상태 변경에 따른 앱 셸과 페이지의 리렌더링 방지를 위해 별도 섬으로 분리
 */
const AuthSessionRuntime = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);
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
    let isMounted = true;

    const checkAuth = async () => {
      if (!hasHydrated) return;

      if (!isLoggedIn || accessToken) {
        if (isMounted) setAuthReady(true);
        return;
      }

      // 로그인 상태는 남아 있지만 메모리의 액세스 토큰이 없는 경우 리프레시 토큰으로 세션 복구
      try {
        const refreshedAccessToken = await refreshAccessToken();
        if (!isMounted) return;

        if (refreshedAccessToken) {
          setAccessToken(refreshedAccessToken);
          setLoggedIn(true);
        } else {
          logout();
        }
      } catch (error) {
        if (isMounted && isAuthExpiredError(error)) logout();
      } finally {
        if (isMounted) setAuthReady(true);
      }
    };

    setAuthReady(false);
    void checkAuth();

    return () => {
      isMounted = false;
    };
  }, [
    accessToken,
    hasHydrated,
    isLoggedIn,
    logout,
    setAccessToken,
    setAuthReady,
    setLoggedIn,
  ]);

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
