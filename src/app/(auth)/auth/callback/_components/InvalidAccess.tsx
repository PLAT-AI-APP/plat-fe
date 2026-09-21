"use client";

import { useTranslations } from "next-intl";

/** 콜백 페이지는 서버 컴포넌트라 번역할 수 없어, code 가 없을 때의 안내만 클라이언트로 분리한다. */
const InvalidAccess = () => {
  const t = useTranslations("auth.callback");

  return <div>{t("invalidAccess")}</div>;
};

export default InvalidAccess;
