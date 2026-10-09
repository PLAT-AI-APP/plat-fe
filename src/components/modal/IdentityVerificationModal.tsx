"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ModalLayout } from "@/components/ModalLayout";
import AdultEmblem from "@/components/adult/AdultEmblem";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Switch from "@/components/ui/Switch";
import { ConfettiBurst } from "@/app/payments/[provider]/[result]/_components/PaymentSuccess";
import { Clock, Close, LockLine } from "@/icons";
import StatusSuccess from "@/icons/StatusSuccess";
import {
  useConfirmIdentityVerificationMutation,
  useStartIdentityVerificationMutation,
} from "@/api/verification/identityVerification";
import { useAdultContentMutation } from "@/api/verification/patchAdultContent";
import {
  IDENTITY_VERIFICATION_INCOMPLETE,
  IDENTITY_VERIFICATION_NOT_FOUND,
  isIdentityVerificationMessage,
  type ConfirmIdentityVerificationResponse,
} from "@/api/verification/types";
import {
  DEV_IDENTITY_VERIFICATION_PATH,
  IDENTITY_VERIFICATION_WINDOW_NAME,
} from "@/constants/identityVerification";
import { EASE_OUT } from "@/constants/motion";
import dayjs from "@/lib/dayjs";
import {
  PortOneIdentityNotReadyError,
  requestPortOneIdentityVerification,
} from "@/lib/portOneIdentity";
import { showAppToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import { IdentityVerificationModalProps } from "@/type/modal";

type Step =
  | { kind: "intro" }
  | { kind: "waiting"; verificationId: string; notice?: string }
  | { kind: "confirming" }
  | { kind: "result"; result: ConfirmIdentityVerificationResponse }
  | { kind: "error"; message: string };

const POPUP_FEATURES = "popup=yes,width=480,height=760";

/** 통합인증(KG이니시스)이 여는 간편인증 수단. 화면에 이름만 보여 준다. */
const METHODS = ["PASS", "kakao", "naver", "toss", "bank"] as const;

const formatDate = (value: string | null | undefined) =>
  value ? dayjs(value).format("YYYY.MM.DD") : "";

/** 단계 표시줄의 위치. 기다림·확인은 둘 다 "인증" 단계다. */
const stepIndex = (step: Step) => {
  if (step.kind === "intro") return 0;
  if (step.kind === "result") return 2;
  return 1;
};

const Stepper = ({ step }: { step: Step }) => {
  const t = useTranslations("adultVerification.modal.steps");
  const current = stepIndex(step);
  const labels = [t("intro"), t("verify"), t("done")];

  return (
    <ol className="flex items-center gap-2" aria-label={t("ariaLabel")}>
      {labels.map((label, index) => {
        const reached = index <= current;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              aria-current={index === current ? "step" : undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-slow",
                index === current
                  ? "bg-brand-opacity-2 text-brand"
                  : reached
                    ? "text-font-1"
                    : "text-font-disabled",
              )}
            >
              <span
                className={cn(
                  "flex size-4 items-center justify-center rounded-full text-[10px] leading-none",
                  reached ? "bg-brand text-on-brand" : "bg-card text-font-disabled",
                )}
              >
                {index + 1}
              </span>
              {label}
            </span>
            {index < labels.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "h-px w-4 transition-colors duration-slow",
                  index < current ? "bg-brand" : "bg-main",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};

/** 제목 뒤에서 차례로 튀는 점 세 개(노트 결제 대기와 같은 신호) */
const BouncingDots = () => (
  <span aria-hidden className="ml-1 inline-flex gap-1 align-middle">
    {[0, 1, 2].map((index) => (
      <m.span
        key={index}
        className="size-1.5 rounded-full bg-brand"
        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: index * 0.15, ease: "easeInOut" }}
      />
    ))}
  </span>
);

const ProgressBar = () => {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <div aria-hidden className="relative h-1 w-40 overflow-hidden rounded-full bg-card">
      <m.span
        className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-brand to-transparent"
        animate={reduceMotion ? { x: "100%" } : { x: ["-100%", "300%"] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

/** 결과 화면의 "언제까지 유효한가" 한 줄 */
const ValidityRow = ({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) => (
  <div className="flex items-center justify-between gap-3 py-2.5">
    <span className="flex items-center gap-2 body-5 text-font-2">
      <span
        className={cn(
          "flex size-5 items-center justify-center rounded-full",
          active ? "bg-brand text-on-brand" : "bg-card text-font-disabled",
        )}
      >
        <StatusSuccess className="size-3" />
      </span>
      {label}
    </span>
    <span className={cn("body-5 font-semibold", active ? "text-font-1" : "text-font-disabled")}>
      {value}
    </span>
  </div>
);

/**
 * 본인인증 모달. 본인인증 한 번으로 생년월일이 만 19세 이상이면 성인인증까지 기록된다(둘 다 1년).
 *
 * 흐름: 안내 → 인증 건 열기 → 인증 창(MOCK: dev 가짜 인증 창, PORTONE: 포트원 SDK) → 창이 끝났다고 알리면
 * 확정 → 새 토큰으로 교체 → 결과(성인이면 그 자리에서 19 콘텐츠 표시를 켤 수 있다). 팝업이 막히면 같은 탭에서
 * 인증 페이지로 넘어가고, 그 페이지가 확정까지 마친다.
 */
const IdentityVerificationModal = ({ onClose }: IdentityVerificationModalProps) => {
  const t = useTranslations("adultVerification.modal");
  const toggleT = useTranslations("adultVerification.toggle");
  const commonT = useTranslations("modalUi.common");
  const reduceMotion = useReducedMotion() ?? false;
  const [step, setStep] = useState<Step>({ kind: "intro" });
  const popupRef = useRef<Window | null>(null);
  const { mutate: startVerification, isPending: isStarting } =
    useStartIdentityVerificationMutation();
  const { mutate: confirmVerification } = useConfirmIdentityVerificationMutation();
  const { mutate: changeAdultContent, isPending: isToggling } = useAdultContentMutation();
  const adultContentEnabled = useUserStore((state) => state.user?.adultContentEnabled ?? false);

  const confirm = useCallback(
    (verificationId: string) => {
      setStep({ kind: "confirming" });
      confirmVerification(verificationId, {
        onSuccess: (result) => {
          popupRef.current?.close();
          setStep({ kind: "result", result });
        },
        onError: (error) => {
          if (error.code === IDENTITY_VERIFICATION_INCOMPLETE) {
            // 창에서 아직 끝내지 않았다. 기다리는 화면으로 돌아가 마저 하게 한다.
            setStep({ kind: "waiting", verificationId, notice: t("errorIncomplete") });
            return;
          }
          setStep({
            kind: "error",
            message:
              error.code === IDENTITY_VERIFICATION_NOT_FOUND ? t("errorExpired") : t("errorDefault"),
          });
        },
      });
    },
    [confirmVerification, t],
  );

  const openMockWindow = (verificationId: string) => {
    // 돌아올 화면은 팝업에도 싣는다. 환경에 따라 팝업이 같은 탭으로 열리면(opener 없음) 인증 페이지가 이 값으로 돌려보낸다.
    const returnTo = `${window.location.pathname}${window.location.search}`;
    const url = `${DEV_IDENTITY_VERIFICATION_PATH}?vid=${encodeURIComponent(verificationId)}&returnTo=${encodeURIComponent(returnTo)}`;
    const popup = window.open(url, IDENTITY_VERIFICATION_WINDOW_NAME, POPUP_FEATURES);

    if (!popup) {
      // 팝업이 막혔다. 같은 탭에서 인증 페이지로 가고, 그 페이지가 확정까지 마친 뒤 이 화면으로 돌려보낸다.
      setStep({ kind: "waiting", verificationId, notice: t("popupBlocked") });
      window.location.assign(`${url}&mode=redirect`);
      return;
    }

    popupRef.current = popup;
    setStep({ kind: "waiting", verificationId });
  };

  const handleStart = () => {
    startVerification(undefined, {
      onSuccess: ({ verificationId, provider }) => {
        if (provider === "PORTONE") {
          setStep({ kind: "waiting", verificationId });
          requestPortOneIdentityVerification(verificationId)
            .then(() => confirm(verificationId))
            .catch((error: unknown) =>
              setStep({
                kind: "error",
                message:
                  error instanceof PortOneIdentityNotReadyError
                    ? t("errorPortOneNotReady")
                    : t("errorDefault"),
              }),
            );
          return;
        }

        openMockWindow(verificationId);
      },
      onError: () => setStep({ kind: "error", message: t("errorDefault") }),
    });
  };

  // 인증 창이 끝났다고 알려 오면 확정한다. 같은 사이트에서 온, 지금 기다리는 건의 메시지만 받는다.
  const waitingId = step.kind === "waiting" ? step.verificationId : null;
  useEffect(() => {
    if (!waitingId) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (popupRef.current && event.source !== popupRef.current) return;
      if (!isIdentityVerificationMessage(event.data)) return;
      if (event.data.verificationId !== waitingId) return;

      confirm(waitingId);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [confirm, waitingId]);

  const handleReopen = () => {
    if (step.kind !== "waiting") return;
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.focus();
      return;
    }
    openMockWindow(step.verificationId);
  };

  const handleToggle = (next: boolean) => {
    changeAdultContent(next, {
      onSuccess: (result) =>
        showAppToast("success", result.adultContentEnabled ? toggleT("enabled") : toggleT("disabled")),
      onError: () => showAppToast("error", toggleT("failed")),
    });
  };

  const isAdultResult = step.kind === "result" && step.result.adult;

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="w-screen max-w-[calc(100vw-32px)] overflow-hidden rounded-3xl p-0 sm:max-w-110"
    >
      <div className="relative px-6 pt-5 pb-6">
        <header className="flex items-center justify-between">
          <Stepper step={step} />
          <IconButton size="xs" onClick={onClose} aria-label={commonT("close")}>
            <Close className="size-3.5" />
          </IconButton>
        </header>

        {isAdultResult && !reduceMotion && <ConfettiBurst />}

        <AnimatePresence mode="wait" initial={false}>
          <m.section
            key={step.kind}
            className="flex flex-col items-center text-center"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            aria-live="polite"
          >
            {step.kind === "intro" && (
              <>
                <AdultEmblem className="mt-4" />
                <h2 className="heading-3 mt-2 whitespace-pre-line text-font-0 break-keep">
                  {t("headline")}
                </h2>
                <p className="body-5 mt-2 text-font-2 break-keep">{t("subtitle")}</p>

                <ul className="mt-6 flex w-full flex-col gap-3 rounded-2xl bg-darkest p-4 text-left">
                  {[
                    { icon: <Clock className="size-4" />, text: t("benefitTime") },
                    { icon: <LockLine className="size-4" />, text: t("benefitPrivacy") },
                    { icon: <StatusSuccess className="size-4" />, text: t("benefitToggle") },
                  ].map(({ icon, text }) => (
                    <li key={text} className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-opacity text-brand">
                        {icon}
                      </span>
                      <span className="body-5 pt-1 text-font-1 break-keep">{text}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex w-full flex-col items-center gap-2">
                  <span className="body-7 text-font-disabled">{t("methodsLabel")}</span>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {METHODS.map((method) => (
                      <span
                        key={method}
                        className="rounded-full border border-main px-2.5 py-1 text-[11px] font-semibold text-font-2"
                      >
                        {t(`methods.${method}`)}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  size="lg"
                  fullWidth
                  className="mt-6"
                  onClick={handleStart}
                  disabled={isStarting}
                  isPending={isStarting}
                >
                  {t("start")}
                </Button>
                <p className="body-7 mt-3 text-font-disabled break-keep">{t("minorNote")}</p>
              </>
            )}

            {(step.kind === "waiting" || step.kind === "confirming") && (
              <>
                <AdultEmblem className="mt-6" working />
                <h2 className="heading-3 mt-2 text-font-0">
                  {step.kind === "waiting" ? t("waitingTitle") : t("confirmingTitle")}
                  <BouncingDots />
                </h2>
                <p className="body-5 mt-2 max-w-80 text-font-2 break-keep">
                  {step.kind === "waiting" ? t("waitingHint") : t("confirmingHint")}
                </p>
                {step.kind === "waiting" && step.notice && (
                  <p className="body-6 mt-4 w-full rounded-xl bg-warning-bg px-4 py-3 text-warning break-keep">
                    {step.notice}
                  </p>
                )}
                <div className="mt-6">
                  <ProgressBar />
                </div>
                {step.kind === "waiting" && (
                  <div className="mt-8 flex w-full flex-col gap-2.5">
                    <Button size="lg" fullWidth onClick={() => confirm(step.verificationId)}>
                      {t("checkResult")}
                    </Button>
                    <Button variant="secondary" size="lg" fullWidth onClick={handleReopen}>
                      {t("reopen")}
                    </Button>
                  </div>
                )}
              </>
            )}

            {step.kind === "result" && (
              <>
                <AdultEmblem className="mt-6" badge={step.result.adult ? "done" : "warn"} />
                <h2 className="heading-3 mt-2 text-font-0">
                  {step.result.adult ? t("adultDoneTitle") : t("identityOnlyTitle")}
                </h2>
                <p className="body-5 mt-2 text-font-2 break-keep">
                  {step.result.adult ? t("adultDoneDescription") : t("identityOnlyDescription")}
                </p>

                <div className="mt-6 w-full divide-y divide-main rounded-2xl bg-darkest px-4 py-1 text-left">
                  <ValidityRow
                    label={t("identityLabel")}
                    value={t("until", { date: formatDate(step.result.identityVerifiedUntil) })}
                    active
                  />
                  <ValidityRow
                    label={t("adultLabel")}
                    value={
                      step.result.adult
                        ? t("until", { date: formatDate(step.result.adultVerifiedUntil) })
                        : t("adultUnavailable")
                    }
                    active={step.result.adult}
                  />
                </div>

                {step.result.adult && (
                  <div className="mt-3 flex w-full items-center justify-between gap-4 rounded-2xl border border-main px-4 py-3.5 text-left">
                    <div className="flex flex-col gap-0.5">
                      <span className="body-4 font-semibold text-font-1">{t("toggleTitle")}</span>
                      <span className="body-7 text-font-2 break-keep">{t("toggleHint")}</span>
                    </div>
                    <Switch
                      size="label"
                      tone="danger"
                      checked={adultContentEnabled}
                      label={toggleT("ariaLabel")}
                      onChange={handleToggle}
                      themeIcon={false}
                      disabled={isToggling}
                      thumbContent={
                        <span aria-hidden="true" className="text-[11px] font-extrabold leading-none tracking-[-0.04em]">
                          {toggleT("label")}
                        </span>
                      }
                    />
                  </div>
                )}

                <Button size="lg" fullWidth className="mt-6" onClick={onClose}>
                  {t("done")}
                </Button>
              </>
            )}

            {step.kind === "error" && (
              <>
                <AdultEmblem className="mt-6" badge="warn" />
                <h2 className="heading-3 mt-2 text-font-0">{t("errorTitle")}</h2>
                <p className="body-5 mt-2 max-w-80 text-font-2 break-keep">{step.message}</p>
                <div className="mt-8 flex w-full flex-col gap-2.5">
                  <Button size="lg" fullWidth onClick={() => setStep({ kind: "intro" })}>
                    {t("retry")}
                  </Button>
                  <Button variant="secondary" size="lg" fullWidth onClick={onClose}>
                    {t("close")}
                  </Button>
                </div>
              </>
            )}
          </m.section>
        </AnimatePresence>
      </div>
    </ModalLayout>
  );
};

export default IdentityVerificationModal;
