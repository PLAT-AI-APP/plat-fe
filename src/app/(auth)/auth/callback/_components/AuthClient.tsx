"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSocialTokenMutation } from "@/api/auth/PostSocialToken";
import { PENDING_WELCOME_CREDIT_DIALOG_KEY } from "@/constants/auth";

interface AuthClientProps {
  code: string;
}

const AuthClient = ({ code }: AuthClientProps) => {
  const router = useRouter();
  const { mutate } = useSocialTokenMutation();
  const isRequested = useRef(false); // StrictMode에서 API가 두 번 중복 호출되는 것을 방어합니다.

  useEffect(() => {
    if (isRequested.current) return;
    isRequested.current = true;

    mutate(code, {
      onSuccess: (data) => {
        const prevPath = localStorage.getItem("prevPath") || "/";

        localStorage.removeItem("prevPath");

        if (data?.isNew) {
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark">
      <h1 className="title-1 animate-pulse text-font-1">
        인증을 처리하고 있습니다.
      </h1>
    </div>
  );
};

export default AuthClient;
