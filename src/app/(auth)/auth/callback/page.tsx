import { Metadata } from "next";
import AuthClient from "./_components/AuthClient";
import InvalidAccess from "./_components/InvalidAccess";

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
    return <InvalidAccess />;
  }

  return <AuthClient code={code} />;
};

export default AuthPage;
