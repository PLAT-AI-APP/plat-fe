"use client";

import { useCallback, useEffect, useState } from "react";
import {
  SOCIAL_LOGIN_PROVIDER_KEY,
  SOCIAL_LOGIN_RETURN_PATH_KEY,
} from "@/constants/auth";

export type SocialLoginProvider = "kakao" | "google";

/** 로그인 뒤 돌아올 곳. 콜백 화면이 toSafeReturnPath 로 검사한 뒤 쓴다. 없으면 null. */
export const readSocialLoginReturnPath = (): string | null => {
  try {
    return sessionStorage.getItem(SOCIAL_LOGIN_RETURN_PATH_KEY);
  } catch {
    return null;
  }
};

export const clearSocialLoginReturnPath = () => {
  try {
    sessionStorage.removeItem(SOCIAL_LOGIN_RETURN_PATH_KEY);
  } catch {
    // 지우지 못해도 다음 로그인 시작 때 덮어쓴다.
  }
};

/**
 * 소셜 로그인 시작. 로그인 창과 프로필 팝오버가 같은 규칙으로 인증 페이지로 보낸다.
 *
 * - 누른 수단(콜백 화면 문구용)과 지금 화면(pathname+search, 로그인 뒤 복귀용)을 이 탭의 sessionStorage 에 남긴다.
 * - 인증 페이지가 뜰 때까지 버튼을 대기 상태로 둔다. 인증 페이지에서 뒤로 와 bfcache 로 되살아나면 푼다.
 */
export const useSocialLogin = ({
  beforeRedirect,
}: { beforeRedirect?: () => void } = {}) => {
  const [redirectingProvider, setRedirectingProvider] =
    useState<SocialLoginProvider | null>(null);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setRedirectingProvider(null);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const startSocialLogin = useCallback(
    (
      provider: SocialLoginProvider,
      /** 콜백 화면에서 다시 시도할 때처럼, 처음 남긴 복귀 경로를 그대로 둘 때 true. */
      { keepReturnPath = false }: { keepReturnPath?: boolean } = {},
    ) => {
      if (redirectingProvider) return;
      setRedirectingProvider(provider);
      beforeRedirect?.();

      try {
        sessionStorage.setItem(SOCIAL_LOGIN_PROVIDER_KEY, provider);
        if (!keepReturnPath) {
          sessionStorage.setItem(
            SOCIAL_LOGIN_RETURN_PATH_KEY,
            window.location.pathname + window.location.search,
          );
        }
      } catch {
        // 저장할 수 없어도 로그인은 그대로 진행한다. 콜백 화면이 수단 없이 안내하고 홈으로 돌아갈 뿐이다.
      }

      window.location.href = `${process.env.NEXT_PUBLIC_BASE_URI}/oauth2/authorization/${provider}`;
    },
    [redirectingProvider, beforeRedirect],
  );

  return { redirectingProvider, startSocialLogin };
};
