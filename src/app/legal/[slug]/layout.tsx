import type { Metadata } from "next";
import type { ReactNode } from "react";

/** 문서 종류별 탭 제목. 화면(page)은 클라이언트 컴포넌트라 메타데이터를 여기서 정한다. */
const LEGAL_TITLE: Record<string, string> = {
  terms: "이용약관",
  privacy: "개인정보처리방침",
  youth: "청소년 보호정책",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = LEGAL_TITLE[slug];
  return title ? { title } : {};
}

const LegalLayout = ({ children }: { children: ReactNode }) => children;

export default LegalLayout;
