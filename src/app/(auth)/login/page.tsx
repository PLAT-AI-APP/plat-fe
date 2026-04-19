import React from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "./_components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description:
    "지금 로그인하고 당신만을 위한 AI 페르소나와 대화를 시작하세요. Plat은 당신의 상상을 현실로 만드는 AI 공간입니다.",
};

const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
