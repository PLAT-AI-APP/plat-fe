"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ModalLayout } from "@/components/ModalLayout";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { Close } from "@/icons";
import StatusSuccess from "@/icons/StatusSuccess";
import StatusWarning from "@/icons/StatusWarning";
import {
  useConfirmIdentityVerificationMutation,
  useStartIdentityVerificationMutation,
} from "@/api/verification/identityVerification";
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
import dayjs from "@/lib/dayjs";
import {
  PortOneIdentityNotReadyError,
  requestPortOneIdentityVerification,
} from "@/lib/portOneIdentity";
import { IdentityVerificationModalProps } from "@/type/modal";

type Step =
  | { kind: "intro" }
  | { kind: "waiting"; verificationId: string; notice?: string }
  | { kind: "confirming" }
  | { kind: "result"; result: ConfirmIdentityVerificationResponse }
  | { kind: "error"; message: string };

const POPUP_FEATURES = "popup=yes,width=480,height=760";

const formatDate = (value: string | null | undefined) =>
  value ? dayjs(value).format("YYYY.MM.DD") : "";

/**
 * 본인인증 모달. 본인인증 한 번으로 생년월일이 만 19세 이상이면 성인인증까지 기록된다(둘 다 1년).
 *
 * 흐름: 안내 → 인증 건 열기 → 인증 창(MOCK: dev 가짜 인증 팝업, PORTONE: 포트원 SDK) → 창이 끝났다고 알리면
 * 확정 → 새 토큰으로 교체 → 결과. 팝업이 막히면 같은 탭에서 인증 페이지로 넘어가고, 그 페이지가 확정까지 마친다.
 */
const IdentityVerificationModal = ({ onClose }: IdentityVerificationModalProps) => {
  const t = useTranslations("adultVerification.modal");
  const commonT = useTranslations("modalUi.common");
  const [step, setStep] = useState<Step>({ kind: "intro" });
  const popupRef = useRef<Window | null>(null);
  const { mutate: startVerification, isPending: isStarting } =
    useStartIdentityVerificationMutation();
  const { mutate: confirmVerification } = useConfirmIdentityVerificationMutation();

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
            setStep({
              kind: "waiting",
              verificationId,
              notice: t("errorIncomplete"),
            });
            return;
          }
          setStep({
            kind: "error",
            message:
              error.code === IDENTITY_VERIFICATION_NOT_FOUND
                ? t("errorExpired")
                : t("errorDefault"),
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

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="w-screen max-w-[calc(100vw-40px)] rounded-3xl p-5 sm:max-w-100"
    >
      <header className="flex items-center justify-between">
        <h2 className="title-1">{t("title")}</h2>
        <IconButton size="xs" onClick={onClose} aria-label={commonT("close")}>
          <Close className="size-3.5" />
        </IconButton>
      </header>

      {step.kind === "intro" && (
        <section className="mt-6 flex flex-col gap-6">
          <ul className="body-5 flex list-disc flex-col gap-2 pl-5 text-font-2">
            <li>{t("description")}</li>
            <li>{t("validity")}</li>
            <li>{t("birthNotice")}</li>
          </ul>
          <Button
            size="lg"
            fullWidth
            onClick={handleStart}
            disabled={isStarting}
            isPending={isStarting}
          >
            {t("start")}
          </Button>
        </section>
      )}

      {step.kind === "waiting" && (
        <section className="mt-6 flex flex-col gap-4" aria-live="polite">
          <p className="body-4 text-font-1">{t("waiting")}</p>
          {step.notice && (
            <p className="body-6 rounded-xl bg-darkest px-4 py-3 text-font-2">
              {step.notice}
            </p>
          )}
          <div className="flex gap-2">
            <Button variant="secondary" size="lg" fullWidth onClick={handleReopen}>
              {t("reopen")}
            </Button>
            <Button
              size="lg"
              fullWidth
              onClick={() => confirm(step.verificationId)}
            >
              {t("checkResult")}
            </Button>
          </div>
        </section>
      )}

      {step.kind === "confirming" && (
        <section className="mt-6 flex flex-col items-center gap-3 py-6" aria-live="polite">
          <div className="skeleton size-10 rounded-full" aria-hidden="true" />
          <p className="body-4 text-font-2">{t("confirming")}</p>
        </section>
      )}

      {step.kind === "result" && (
        <section className="mt-6 flex flex-col gap-6" aria-live="polite">
          <div className="flex flex-col items-center gap-3 text-center">
            {step.result.adult ? (
              <StatusSuccess className="size-12 text-brand" />
            ) : (
              <StatusWarning className="size-12 text-font-2" />
            )}
            <h3 className="title-3 text-font-1">
              {step.result.adult ? t("adultDoneTitle") : t("identityOnlyTitle")}
            </h3>
            <p className="body-5 text-font-2">
              {step.result.adult
                ? t("adultDoneDescription", {
                    date: formatDate(step.result.adultVerifiedUntil),
                  })
                : t("identityOnlyDescription")}
            </p>
            <p className="body-7 text-font-disabled">
              {t("identityUntil", {
                date: formatDate(step.result.identityVerifiedUntil),
              })}
            </p>
          </div>
          <Button size="lg" fullWidth onClick={onClose}>
            {t("done")}
          </Button>
        </section>
      )}

      {step.kind === "error" && (
        <section className="mt-6 flex flex-col gap-6" aria-live="assertive">
          <p className="body-4 text-font-error">{step.message}</p>
          <Button size="lg" fullWidth onClick={() => setStep({ kind: "intro" })}>
            {t("retry")}
          </Button>
        </section>
      )}
    </ModalLayout>
  );
};

export default IdentityVerificationModal;
