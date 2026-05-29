import { Metadata } from "next";
import AuthClient from "./_components/AuthClient";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
  title: "인증 중...",
};

const AuthPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const code = params.code as string;

  if (!code) {
    return <div>유효하지 않은 접근입니다.</div>;
  }

  return <AuthClient code={code} />;
};

export default AuthPage;
