import type { Metadata } from "next";
import type { ReactNode } from "react";

// 가입 화면(page)은 클라이언트 컴포넌트라 메타데이터를 여기서 정한다.
export const metadata: Metadata = {
  title: "회원가입",
};

const SignupLayout = ({ children }: { children: ReactNode }) => children;

export default SignupLayout;
