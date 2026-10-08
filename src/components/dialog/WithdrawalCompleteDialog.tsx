"use client";

import { m, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import ResourceImage from "@/components/ResourceImage";
import EmptyMascot from "@/components/state/EmptyMascot";
import { EASE_OUT } from "@/constants/motion";
import { Check, Email } from "@/icons";
import CheckCircle from "@/icons/CheckCircle";
import Copy from "@/icons/Copy";
import dayjs from "@/lib/dayjs";
import { toImageVariantUrl } from "@/lib/file";
import { showAppToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { WithdrawalCompleteDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

/** 클립보드는 https·권한이 있어야 쓸 수 있다. 못 쓰면 false. */
const copyText = async (text: string) => {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/** 18자리 인수 번호를 넷씩 끊어 읽기 쉽게 한다. 복사는 원래 번호 그대로 한다. */
const groupDigits = (value: string) => value.replace(/(\d{4})(?=\d)/g, "$1 ");

type StepState = "done" | "current" | "next";

/** 접수 → 운영 심사 → 대화 이어짐. 지금 어디쯤인지 한눈에 보이게 한다. */
const ProgressStep = ({
  state,
  label,
  caption,
}: {
  state: StepState;
  label: string;
  caption?: string;
}) => (
  <li className="relative flex flex-col items-center gap-1.5 text-center">
    <span
      className={cn(
        "relative z-10 flex size-6 items-center justify-center rounded-full",
        state === "done" && "bg-brand text-on-brand",
        state === "current" && "border-2 border-brand bg-dark",
        state === "next" && "border-2 border-main bg-dark",
      )}
    >
      {state === "done" && <Check size={13} />}
      {state === "current" && (
        <span className="size-2 rounded-full bg-brand" />
      )}
    </span>
    <span
      className={cn(
        "title-7 break-keep",
        state === "next" ? "text-font-disabled" : "text-font-1",
      )}
    >
      {label}
    </span>
    {caption && <span className="body-8 text-font-2 tabular-nums">{caption}</span>}
  </li>
);

const WithdrawalCompleteDialog = ({
  onClose,
  onConfirm,
  handovers = [],
  copyMailRequested = false,
  consent = null,
}: WithdrawalCompleteDialogProps) => {
  const t = useTranslations();
  const reduceMotion = useReducedMotion();

  const handleConfirm = () => {
    onClose();
    onConfirm();
  };

  // 인수 번호는 게시 중단 요청 같은 문의에서 본인 확인에 쓴다. 받아 적기 어려운 길이라 복사를 둔다.
  const handleCopy = async (handoverId: string) => {
    const isCopied = await copyText(handoverId);
    showAppToast(
      isCopied ? "success" : "error",
      t(
        isCopied
          ? "dialog.withdrawalComplete.numberCopied"
          : "dialog.withdrawalComplete.copyFailed",
      ),
    );
  };

  // "이름 인수번호" 를 한 줄씩. 남긴 캐릭터가 많아도 한 번에 옮겨 둘 수 있게 한다.
  const handleCopyAll = async () => {
    const text = handovers
      .map((handover) => `${handover.title} ${handover.handoverId}`)
      .join("\n");
    const isCopied = await copyText(text);
    showAppToast(
      isCopied ? "success" : "error",
      isCopied
        ? t("dialog.withdrawalComplete.allCopied", { count: handovers.length })
        : t("dialog.withdrawalComplete.copyFailed"),
    );
  };

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.45, ease: EASE_OUT },
        };

  const hasHandover = handovers.length > 0;
  const deadlineAt = handovers[0]?.deadlineAt;

  return (
    <Dialog
      onClose={handleConfirm}
      label={
        <div className="relative flex w-full flex-col items-center gap-2 text-center">
          {/* 작별 인사. 어두운 창에 묻히지 않게 뒤에 옅은 빛을 깔고, 바닥은 창 배경으로 스며들게 자른다. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-2 left-1/2 h-20 w-44 -translate-x-1/2 rounded-full bg-brand/15 blur-2xl"
          />
          <EmptyMascot
            mood="wave"
            className="relative -mt-2 w-40 [mask-image:linear-gradient(to_bottom,#000_72%,transparent)]"
          />
          <h2 className="title-2 text-font-1">
            {t("dialog.withdrawalComplete.title")}
          </h2>
        </div>
      }
      description={
        <div className="flex w-full flex-col gap-4">
          <p className="body-5 w-full whitespace-pre-line text-center text-font-2">
            {`${t("dialog.withdrawalComplete.descriptionLine1")}\n${t("dialog.withdrawalComplete.descriptionLine2")}`}
          </p>

          {hasHandover && (
            <m.div {...rise(0.15)} className="relative w-full rounded-3xl border border-main bg-darkest">
              {/* 남긴 캐릭터와 인수 번호 */}
              <div className="flex flex-col gap-1 px-4 pt-4 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="body-7 flex items-center gap-1.5 text-font-2">
                    {t("dialog.withdrawalComplete.handoverTitle")}
                    <span className="body-8 text-font-disabled tabular-nums">{handovers.length}</span>
                  </p>
                  {/* 이름과 인수 번호를 한 줄씩 묶어 한 번에 복사한다. 메모장 등에 붙여 두면 문의할 때 찾기 쉽다. */}
                  <button
                    type="button"
                    onClick={() => void handleCopyAll()}
                    className="body-7 flex h-7 items-center gap-1 rounded-full border border-main px-2.5 text-font-2 transition-colors hover:border-font-disabled hover:text-font-1"
                  >
                    <Copy size={12} aria-hidden="true" />
                    {t("dialog.withdrawalComplete.copyAll")}
                  </button>
                </div>
                <ul className="flex max-h-60 flex-col gap-3 overflow-y-auto pt-1 pr-1">
                  {handovers.map((handover) => (
                    <li key={handover.handoverId} className="flex items-center gap-3">
                      {handover.profileImageUrl ? (
                        <ResourceImage
                          src={toImageVariantUrl(handover.profileImageUrl, "sq80")}
                          alt=""
                          width={40}
                          height={40}
                          unoptimized
                          className="size-10 shrink-0 rounded-xl object-cover ring-1 ring-main"
                        />
                      ) : (
                        <span aria-hidden="true" className="size-10 shrink-0 rounded-xl bg-card" />
                      )}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="title-5 truncate text-font-1">{handover.title}</span>
                        {/* 인수 번호. 문의할 때 본인 확인에 쓰여서 줄이지 않는다. */}
                        <span className="body-8 whitespace-nowrap font-mono text-font-2 tabular-nums">
                          <span className="sr-only">
                            {t("dialog.withdrawalComplete.handoverNumberLabel")}{" "}
                          </span>
                          {groupDigits(handover.handoverId)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleCopy(handover.handoverId)}
                        aria-label={t("dialog.withdrawalComplete.copyNumber")}
                        title={t("dialog.withdrawalComplete.copyNumber")}
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-font-2 transition-colors hover:bg-btn-hover hover:text-font-1"
                      >
                        <Copy size={15} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 접수증 절취선 */}
              <div aria-hidden="true" className="relative h-5">
                <span className="absolute top-1/2 -left-2.5 size-5 -translate-y-1/2 rounded-full border-r border-main bg-dark" />
                <span className="absolute top-1/2 -right-2.5 size-5 -translate-y-1/2 rounded-full border-l border-main bg-dark" />
                <span className="absolute inset-x-4 top-1/2 border-t border-dashed border-main" />
              </div>

              {/* 진행 단계 */}
              <div className="px-4 pt-2 pb-4">
                <ol className="relative grid grid-cols-3">
                  <span
                    aria-hidden="true"
                    className="absolute top-3 right-[16.66%] left-[16.66%] h-0.5 bg-linear-to-r from-brand via-brand/50 to-main"
                  />
                  <ProgressStep
                    state="done"
                    label={t("dialog.withdrawalComplete.stepReceived")}
                    caption={consent ? dayjs(consent.consentedAt).format("MM.DD") : undefined}
                  />
                  <ProgressStep
                    state="current"
                    label={t("dialog.withdrawalComplete.stepReview")}
                    caption={
                      deadlineAt
                        ? t("dialog.withdrawalComplete.stepReviewUntil", {
                            date: dayjs(deadlineAt).format("MM.DD"),
                          })
                        : undefined
                    }
                  />
                  <ProgressStep
                    state="next"
                    label={t("dialog.withdrawalComplete.stepContinue")}
                  />
                </ol>
              </div>
            </m.div>
          )}

          {hasHandover && (consent || copyMailRequested) && (
            <m.ul {...rise(0.3)} className="body-7 flex flex-col gap-1.5 text-font-2">
              {consent && (
                <li className="flex items-start gap-1.5 break-keep">
                  <CheckCircle size={14} className="mt-px shrink-0" aria-hidden="true" />
                  {t("dialog.withdrawalComplete.consentSummary", {
                    version: consent.version,
                    date: dayjs(consent.consentedAt).format("YYYY.MM.DD HH:mm"),
                  })}
                </li>
              )}
              {copyMailRequested && (
                <li className="flex items-start gap-1.5 break-keep">
                  <Email size={14} className="mt-px shrink-0" aria-hidden="true" />
                  {t("dialog.withdrawalComplete.copyMailSent")}
                </li>
              )}
              <li className="body-8 break-keep pl-5 text-font-disabled">
                {t("dialog.withdrawalComplete.inquiryHint")}
              </li>
            </m.ul>
          )}
        </div>
      }
      confirmText="dialog.withdrawalComplete.confirm"
      confirmFn={handleConfirm}
    />
  );
};

export default WithdrawalCompleteDialog;
