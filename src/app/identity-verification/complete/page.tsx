import type { Metadata } from "next";
import { Suspense } from "react";
import IdentityVerificationCompleteContents from "./_components/IdentityVerificationCompleteContents";

export const metadata: Metadata = {
  title: "본인인증",
  robots: { index: false, follow: false },
};

/** 모바일에서 포트원 본인인증을 마치고 돌아오는 페이지. 여기서 확정까지 마치고 원래 화면으로 돌려보낸다. */
export default function IdentityVerificationCompletePage() {
  return (
    <Suspense fallback={null}>
      <IdentityVerificationCompleteContents />
    </Suspense>
  );
}
