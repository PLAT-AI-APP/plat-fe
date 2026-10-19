"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useSocialTokenMutation } from "@/api/auth/PostSocialToken";
import { resolveErrorMessage } from "@/lib/apiError";
import { PENDING_WELCOME_CREDIT_DIALOG_KEY } from "@/constants/auth";
import AuthProcessing, { MIN_PROCESSING_MS } from "./AuthProcessing";
import { readProvider, subscribeNothing, takeReturnPath } from "./callbackSession";
import SocialLoginFailed from "./SocialLoginFailed";

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
  const { mutateAsync } = useSocialTokenMutation();
  const isRequested = useRef(false); // StrictMode에서 API가 두 번 중복 호출되는 것을 방어합니다.
  const [failureReason, setFailureReason] = useState<string | null>(null);

  useEffect(() => {
    if (isRequested.current) return;
    isRequested.current = true;

    // 응답이 빨라도 연결 연출을 최소 시간만큼은 보여 준 뒤 넘어간다.
    const startedAt = Date.now();
    const afterMinimum = (next: () => void) => {
      window.setTimeout(
        next,
        Math.max(0, MIN_PROCESSING_MS - (Date.now() - startedAt)),
      );
    };

    // mutate 의 호출별 콜백(onSuccess)은 쓰지 않는다. 개발 모드(StrictMode)는 effect 를 정리했다 다시 붙이는데,
    // 그 사이 useMutation 의 구독이 끊겨 호출별 콜백이 사라진다 — 토큰은 받았는데 이 화면에 멈춰 있었다.
    // 프로미스는 구독과 상관없이 끝나므로 결과를 여기서 받는다.
    mutateAsync(code).then(
      (data) =>
        afterMinimum(() => {
          const prevPath = takeReturnPath();

          // 최초 로그인이어도 웰컴 크레딧 정책이 꺼져 있으면 지급이 없으므로 안내하지 않는다.
          if (data?.welcomeCredit != null) {
            // 첫 로그인 시 홈에서 웰컴 다이얼로그를 띄울 수 있도록 대기 상태로 저장합니다.
            sessionStorage.setItem(PENDING_WELCOME_CREDIT_DIALOG_KEY, "true");
            router.replace("/");
            return;
          }

          router.replace(prevPath);
        }),
      // 코드가 만료됐거나 이미 쓰인 경우 등. 다른 화면으로 튕기지 않고 이 자리에서 연결이 끊기며 사유를 보여 준다.
      (error: unknown) =>
        afterMinimum(() => setFailureReason(resolveErrorMessage(error))),
    );
  }, [code, mutateAsync, router]);

  if (failureReason !== null) {
    return <SocialLoginFailed reason={failureReason} skipIntro />;
  }

  return (
    // AuthLayout 이 가운데 정렬이라 폭을 직접 채우지 않으면 내용 폭으로 줄어든다.
    <div className="flex w-full self-stretch">
      <AuthProcessing provider={provider} />
    </div>
  );
};

export default AuthClient;
