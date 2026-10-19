import type { ReactNode } from "react";
import Footer from "@/components/Footer";

/**
 * 본문 아래에 사업자 정보 푸터를 붙인다. 결제·고객센터·약관 화면은 통신판매업 표시 대상이라
 * 홈과 같이 푸터를 둔다. 홈처럼 본문이 짧아도 푸터가 화면 아래에 오도록 본문이 남는 높이를 채운다.
 */
const PageWithFooter = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-[calc(100dvh-var(--header-height))] w-full flex-col">
    <div className="flex grow flex-col">{children}</div>
    <div className="w-full shrink-0">
      <Footer />
    </div>
  </div>
);

export default PageWithFooter;
