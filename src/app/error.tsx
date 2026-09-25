"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import StateScene from "@/components/state/StateScene";

interface SegmentErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 페이지 한 곳이 렌더 중에 깨졌을 때의 경계. 헤더·사이드바는 그대로 두고 본문만 안내로 바꾼다.
 * 이게 없으면 global-error 까지 올라가 화면 전체가 오류 화면으로 바뀌어, 다른 곳으로 갈 길이 사라진다.
 */
const SegmentError = ({ error, reset }: SegmentErrorProps) => {
  const t = useTranslations("errorPage");

  useEffect(() => {
    console.error("[segment-error]", error);
  }, [error]);

  return (
    <section className="flex flex-1 flex-col items-center justify-center py-16">
      <StateScene
        mood="dizzy"
        title={t("title")}
        description={t("description")}
        actions={
          <>
            <Button size="lg" fullWidth onClick={reset}>
              {t("retry")}
            </Button>
            <ButtonLink href="/" size="lg" variant="secondary" fullWidth>
              {t("backHome")}
            </ButtonLink>
          </>
        }
      />
    </section>
  );
};

export default SegmentError;
