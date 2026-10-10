"use client";

import { useTranslations } from "next-intl";
import AdultEmblem from "@/components/adult/AdultEmblem";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";

interface AdultGateProps {
  /** 제목·설명을 바꿔 쓰는 자리(채팅방 잠금 등). 없으면 성인 콘텐츠 일반 안내. */
  title?: string;
  description?: string;
  /** 보조 버튼이 데려갈 곳. 기본은 홈. 채팅방에서는 내 채팅 목록. */
  backHref?: string;
  backLabel?: string;
  className?: string;
}

/**
 * 성인 콘텐츠 접근이 막혔을 때(403 ADULT_CONTENT_RESTRICTED) 내용 대신 그리는 화면.
 * 서버는 내용 없이 거절하므로 여기서도 제목·이미지 같은 것을 그리지 않는다.
 *
 * 비로그인이면 로그인을, 로그인했으면 본인(성인)인증을 권한다. 인증을 마치면 상세·방 조회 키가 바뀌거나
 * 무효화되어 다시 받으므로 이 화면은 저절로 내용으로 바뀐다.
 */
const AdultGate = ({ title, description, backHref = "/", backLabel, className }: AdultGateProps) => {
  const t = useTranslations("adultVerification.gate");
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn) && isAuthReady;
  const openModal = useModalStore((state) => state.openModal);

  return (
    <section
      className={cn(
        "flex w-full flex-col items-center justify-center px-5 py-16 text-center",
        className,
      )}
    >
      <AdultEmblem size="md" badge="locked" />
      <h2 className="heading-3 mt-4 text-font-0">{title ?? t("title")}</h2>
      <p className="body-5 mt-2 max-w-90 text-font-2 break-keep">
        {description ?? (isLoggedIn ? t("verifyDescription") : t("loginDescription"))}
      </p>
      <div className="mt-8 flex w-full max-w-72 flex-col gap-2.5">
        {isLoggedIn ? (
          <Button size="lg" fullWidth onClick={() => openModal("IDENTITY_VERIFICATION")}>
            {t("verify")}
          </Button>
        ) : (
          <Button
            size="lg"
            fullWidth
            disabled={!isAuthReady}
            onClick={() => openModal("LOGIN", { triggerRef: undefined })}
          >
            {t("login")}
          </Button>
        )}
        <ButtonLink href={backHref} variant="secondary" size="lg" fullWidth>
          {backLabel ?? t("home")}
        </ButtonLink>
      </div>
    </section>
  );
};

export default AdultGate;
