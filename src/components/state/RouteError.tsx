"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface RouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  className?: string;
}

/**
 * 라우트 세그먼트의 error.tsx 가 공유하는 본문.
 *
 * 예전에는 error.tsx 가 앱 루트에만 있었다. 그래서 어느 화면에서 렌더가
 * 터지든 사이드바와 헤더까지 통째로 사라지고, 사용자는 앱 밖으로 튕겨 나온
 * 것처럼 느꼈다. 세그먼트마다 경계를 두면 껍데기는 살아 있고 터진 영역만
 * 이 화면으로 바뀐다.
 *
 * RouteLoading 이 loading.tsx 들의 공통 본문인 것과 같은 구조다.
 */
const RouteError = ({ error, reset, className }: RouteErrorProps) => {
  const t = useTranslations("errorPage");

  useEffect(() => {
    // 렌더 트리가 백지화되는 대신 원인을 남겨 추적할 수 있게 합니다.
    console.error(error);
  }, [error]);

  return (
    <section
      role="alert"
      className={cn(
        "flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-6 py-20 text-center",
        className,
      )}
    >
      <h2 className="heading-2 text-font-1">{t("title")}</h2>
      <p className="body-4 text-font-2">{t("description")}</p>

      {/* digest 는 서버가 이 렌더 실패에 붙인 식별자다. 문의가 들어왔을 때
          로그와 대조할 유일한 실마리라 화면에 남긴다. */}
      {error.digest && (
        <code className="body-7 text-font-disabled">{error.digest}</code>
      )}

      <Button size="lg" onClick={reset} className="mt-4">
        {t("retry")}
      </Button>
    </section>
  );
};

export default RouteError;
