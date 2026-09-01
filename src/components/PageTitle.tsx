"use client";

import { useTranslations } from "next-intl";

interface PageTitleProps {
  /** next-intl 메시지 키 (예: "pageTitles.home") */
  messageKey: string;
}

/**
 * 화면에 보이지 않는 페이지 제목.
 *
 * 시각적 제목이 따로 없는 화면(홈·검색·사용내역처럼 콘텐츠가 곧 화면인 곳)에도
 * 문서에는 최상위 제목이 하나 있어야 한다. 스크린리더 사용자가 현재 화면이
 * 무엇인지 알 수 있고, 제목 단계가 h2 부터 시작하는 문서가 생기지 않는다.
 *
 * 페이지 자체는 서버 컴포넌트인데 이 앱의 로케일은 클라이언트 스토어에 있어
 * 서버에서 번역할 수 없다. 그래서 제목만 클라이언트 컴포넌트로 분리한다.
 */
const PageTitle = ({ messageKey }: PageTitleProps) => {
  const t = useTranslations();

  return <h1 className="sr-only">{t(messageKey)}</h1>;
};

export default PageTitle;
