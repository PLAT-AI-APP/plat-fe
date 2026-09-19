"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { isAuthExpiredError } from "@/api";
import { refreshAccessToken } from "@/api/auth/postRefresh";
import { useMyInfoQuery } from "@/api/user/getMyInfo";
import { useWalletBalanceQuery } from "@/api/wallet/getWalletBalance";
import { useAuthStore } from "@/store/useAuthStore";

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

  // Query state belongs to this headless island, not the visible app shell.
  useMyInfoQuery();
  useWalletBalanceQuery();

  useEffect(() => {
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
    if (!wasLoggedInRef.current && isLoggedIn) {
      void queryClient.invalidateQueries();
    }
    wasLoggedInRef.current = isLoggedIn;
  }, [isLoggedIn, queryClient]);

  return null;
};

export default AuthSessionRuntime;
