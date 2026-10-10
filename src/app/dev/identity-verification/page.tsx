import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { isDevToolsEnabled } from "@/constants/identityVerification";
import DevIdentityVerificationContents from "./_components/DevIdentityVerificationContents";

export const metadata: Metadata = {
  title: "개발용 본인인증",
  robots: { index: false, follow: false },
};

/**
 * dev 가짜 본인인증 페이지. 본인인증 모달이 provider=MOCK 일 때 띄운다.
 * 운영 빌드에서는 없는 페이지다(proxy 도 /dev/** 를 404 로 막는다).
 */
export default function DevIdentityVerificationPage() {
  if (!isDevToolsEnabled(process.env.NEXT_PUBLIC_APP_ENV)) notFound();

  return (
    <Suspense fallback={null}>
      <DevIdentityVerificationContents />
    </Suspense>
  );
}
