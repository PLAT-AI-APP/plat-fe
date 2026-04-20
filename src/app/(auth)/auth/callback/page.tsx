import { Metadata } from "next";

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

  // const data = await verifyCode(code);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold">인증을 처리하고 있습니다.</h1>
    </div>
  );
};

export default AuthPage;
