"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSocialTokenMutation } from "@/api/auth/PostSocialToken";

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
      onSuccess: () => {
        const prevPath = localStorage.getItem("prevPath") || "/";

        localStorage.removeItem("prevPath");

        router.replace(prevPath);
      },
      onError: () => {
        alert("인증에 실패했습니다. 다시 시도해주세요.");
        const prevPath = localStorage.getItem("prevPath") || "/";
        localStorage.removeItem("prevPath");
        router.replace(prevPath);
      },
    });
  }, [code, mutate, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark">
      <h1 className="text-xl font-bold text-font-1 animate-pulse">
        인증을 처리하고 있습니다.
      </h1>
    </div>
  );
};

export default AuthClient;
