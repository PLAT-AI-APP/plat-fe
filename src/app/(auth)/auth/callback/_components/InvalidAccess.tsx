"use client";

import { useTranslations } from "next-intl";
import ButtonLink from "@/components/ui/ButtonLink";
import StateScene from "@/components/state/StateScene";

/** 콜백 페이지는 서버 컴포넌트라 번역할 수 없어, code 가 없을 때의 안내만 클라이언트로 분리한다. */
const InvalidAccess = () => {
  const t = useTranslations("auth.callback");

  return (
    <div className="flex w-full items-center self-stretch">
      <StateScene
        mood="lost"
        title={t("invalidTitle")}
        description={t("invalidHint")}
        actions={
          <ButtonLink href="/" size="lg" fullWidth replace>
            {t("goHome")}
          </ButtonLink>
        }
      />
    </div>
  );
};

export default InvalidAccess;
