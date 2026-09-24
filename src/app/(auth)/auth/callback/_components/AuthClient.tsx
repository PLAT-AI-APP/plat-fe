"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useSocialTokenMutation } from "@/api/auth/PostSocialToken";
import {
  PENDING_WELCOME_CREDIT_DIALOG_KEY,
  SOCIAL_LOGIN_PROVIDER_KEY,
} from "@/constants/auth";
import AuthProcessing, { type SocialProvider } from "./AuthProcessing";

const PROVIDERS: SocialProvider[] = ["kakao", "google"];

/**
 * 로그인 버튼을 누를 때 남긴 수단. 모르거나 형식이 다르면 null — 수단 없이 안내한다.
 * 지우지 않는다: 지우면 이동 직전 다시 그릴 때 문구가 바뀌어 깜빡이고, 다음 로그인 때 덮어쓴다.
 */
const readProvider = (): SocialProvider | null => {
  try {
    const saved = sessionStorage.getItem(SOCIAL_LOGIN_PROVIDER_KEY);
    return PROVIDERS.find((provider) => provider === saved) ?? null;
  } catch {
    return null;
  }
};

// 이 화면에 머무는 동안 값이 바뀌지 않으므로 구독할 것이 없다.
const subscribeNothing = () => () => {};

interface AuthClientProps {
  code: string;
}

const AuthClient = ({ code }: AuthClientProps) => {
  const router = useRouter();
  // 서버 렌더에는 sessionStorage 가 없어 null 로 그리고, 브라우저에서 곧바로 저장된 수단으로 바꾼다.
  const provider = useSyncExternalStore(
    subscribeNothing,
    readProvider,
    () => null,
  );
  const { mutate } = useSocialTokenMutation();
  const isRequested = useRef(false); // StrictMode에서 API가 두 번 중복 호출되는 것을 방어합니다.

  useEffect(() => {
    if (isRequested.current) return;
    isRequested.current = true;

    mutate(code, {
      onSuccess: (data) => {
        const prevPath = localStorage.getItem("prevPath") || "/";

        localStorage.removeItem("prevPath");

        // 최초 로그인이어도 웰컴 크레딧 정책이 꺼져 있으면 지급이 없으므로 안내하지 않는다.
        if (data?.welcomeCredit != null) {
          // 첫 로그인 시 홈에서 웰컴 다이얼로그를 띄울 수 있도록 대기 상태로 저장합니다.
          sessionStorage.setItem(PENDING_WELCOME_CREDIT_DIALOG_KEY, "true");
          router.replace("/");
          return;
        }

        router.replace(prevPath);
      },
      onError: () => {
        // 실패 토스트는 axios 인터셉터 → MutationCache의 전역 에러 처리에서 이미 띄우므로 여기서 중복으로 띄우지 않습니다.
        const prevPath = localStorage.getItem("prevPath") || "/";
        localStorage.removeItem("prevPath");
        router.replace(prevPath);
      },
    });
  }, [code, mutate, router]);

  return (
    // AuthLayout 이 가운데 정렬이라 폭을 직접 채우지 않으면 내용 폭으로 줄어든다.
    <div className="flex w-full self-stretch">
      <AuthProcessing provider={provider} />
    </div>
  );
};

export default AuthClient;
