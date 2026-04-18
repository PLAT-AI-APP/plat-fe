import React from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import SignupDetailsForm from "./_components/SignupDetailsForm";
import { Metadata } from "next";

// 메타데이터 정의
export const metadata: Metadata = {
  title: "회원 정보 입력 | Plat",
  description:
    "Plat에서 사용할 프로필 정보를 설정하고 나만의 AI 페르소나를 만나보세요.",
};

interface Props {
  searchParams: Promise<{ token?: string }>;
}

const SignupDetailsPage = async ({ searchParams }: Props) => {
  const { token } = await searchParams;
  return (
    <AuthLayout>
      <SignupDetailsForm signupToekn={token ?? ""} />
    </AuthLayout>
  );
};

export default SignupDetailsPage;
