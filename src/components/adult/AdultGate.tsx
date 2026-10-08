"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { LockLine } from "@/icons";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";

interface AdultGateProps {
  /** 제목·설명을 바꿔 쓰는 자리(채팅방 잠금 등). 없으면 성인 콘텐츠 일반 안내. */
  title?: string;
  description?: string;
  className?: string;
}

/**
 * 성인 콘텐츠 접근이 막혔을 때(403 ADULT_CONTENT_RESTRICTED) 내용 대신 그리는 화면.
 * 서버는 내용 없이 거절하므로 여기서도 제목·이미지 같은 것을 그리지 않는다.
 *
 * 비로그인이면 로그인을, 로그인했으면 본인(성인)인증을 권한다. 인증을 마치면 상세·방 조회 키가 바뀌거나
 * 무효화되어 다시 받으므로 이 화면은 저절로 내용으로 바뀐다.
 */
const AdultGate = ({ title, description, className }: AdultGateProps) => {
  const t = useTranslations("adultVerification.gate");
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn) && isAuthReady;
  const openModal = useModalStore((state) => state.openModal);

  return (
    <section
      className={cn(
        "flex w-full flex-col items-center justify-center gap-4 px-5 py-16 text-center",
        className,
      )}
    >
      <span className="flex size-16 items-center justify-center rounded-full bg-darkest text-font-2">
        <LockLine className="size-8" />
      </span>
      <div className="flex flex-col gap-2">
        <h2 className="title-2 text-font-1">{title ?? t("title")}</h2>
        <p className="body-5 max-w-90 text-font-2">
          {description ??
            (isLoggedIn ? t("verifyDescription") : t("loginDescription"))}
        </p>
      </div>
      {isLoggedIn ? (
        <Button size="lg" onClick={() => openModal("IDENTITY_VERIFICATION")}>
          {t("verify")}
        </Button>
      ) : (
        <Button
          size="lg"
          disabled={!isAuthReady}
          onClick={() => openModal("LOGIN", { triggerRef: undefined })}
        >
          {t("login")}
        </Button>
      )}
    </section>
  );
};

export default AdultGate;
