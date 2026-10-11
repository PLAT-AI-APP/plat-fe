import { Metadata } from "next";
import AuthClient from "./_components/AuthClient";
import InvalidAccess from "./_components/InvalidAccess";
import SocialSignupClient from "./_components/SocialSignupClient";
import SocialLoginFailed from "./_components/SocialLoginFailed";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
  title: "인증 중...",
};

const AuthPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const code = typeof params.code === "string" ? params.code : "";
  const error = typeof params.error === "string" ? params.error : undefined;
  const signupToken = typeof params.signup === "string" ? params.signup : "";

  // 소셜 로그인이 실패하면 서버가 사유를 error 로 실어 보낸다. 코드가 없다고 "잘못된 접근"으로 뭉개지 않는다.
  if (error !== undefined) {
    return <SocialLoginFailed reason={error} />;
  }

  // 처음 온 소셜 사용자. 아직 계정·토큰이 없다 — 이 자리에서 약관 동의를 받아야 가입이 끝난다.
  if (signupToken) {
    return <SocialSignupClient signupToken={signupToken} />;
  }

  if (!code) {
    return <InvalidAccess />;
  }

  return <AuthClient code={code} />;
};

export default AuthPage;
