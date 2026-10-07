"use client";

import dayjs from "@/lib/dayjs";
import { useTranslations } from "next-intl";
import { Email } from "@/icons";
import CheckCircle from "@/icons/CheckCircle";
import Copy from "@/icons/Copy";
import { showAppToast } from "@/lib/toast";
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

const WithdrawalCompleteDialog = ({
  onClose,
  onConfirm,
  handovers = [],
  copyMailRequested = false,
  consent = null,
}: WithdrawalCompleteDialogProps) => {
  const t = useTranslations();

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

  const farewell = `${t("dialog.withdrawalComplete.descriptionLine1")}\n${t("dialog.withdrawalComplete.descriptionLine2")}`;
  const hasHandover = handovers.length > 0;

  return (
    <Dialog
      onClose={handleConfirm}
      label="dialog.withdrawalComplete.title"
      description={
        hasHandover ? (
          <div className="flex w-full flex-col gap-4">
            <p className="body-5 w-full whitespace-pre-line text-font-2">
              {farewell}
            </p>

            <div className="flex w-full flex-col overflow-hidden rounded-2xl bg-darkest">
              <p className="title-6 px-4 pt-3 text-font-2">
                {t("dialog.withdrawalComplete.handoverTitle")}
              </p>

              <ul className="flex flex-col divide-y divide-main px-4">
                {handovers.map((handover) => (
                  <li key={handover.handoverId} className="flex flex-col gap-1.5 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="title-5 min-w-0 truncate text-font-1">
                        {handover.title}
                      </span>
                      <span className="body-8 shrink-0 rounded-full bg-brand-opacity px-2 py-0.5 text-brand">
                        {t("dialog.withdrawalComplete.reviewing")}
                      </span>
                    </div>

                    <div className="body-7 flex items-center gap-1 text-font-2">
                      <span className="shrink-0">
                        {t("dialog.withdrawalComplete.handoverNumberLabel")}
                      </span>
                      <span className="min-w-0 truncate tabular-nums text-font-1">
                        {handover.handoverId}
                      </span>
                      <button
                        type="button"
                        onClick={() => void handleCopy(handover.handoverId)}
                        aria-label={t("dialog.withdrawalComplete.copyNumber")}
                        className="flex size-6 shrink-0 items-center justify-center rounded-md text-font-2 transition-colors hover:bg-btn-hover hover:text-font-1"
                      >
                        <Copy size={14} aria-hidden="true" />
                      </button>
                    </div>

                    {handover.deadlineAt && (
                      <span className="body-8 text-font-disabled">
                        {t("dialog.withdrawalComplete.reviewUntil", {
                          date: dayjs(handover.deadlineAt).format("YYYY.MM.DD"),
                        })}
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              {/* 무엇에 언제 동의했는지 남긴다. 사본 메일이 없는 계정은 이 화면이 유일한 확인이다. */}
              {(consent || copyMailRequested) && (
                <div className="body-7 flex flex-col gap-1.5 border-t border-main px-4 py-3 text-font-2">
                  {consent && (
                    <p className="flex items-start gap-1.5 break-keep">
                      <CheckCircle size={14} className="mt-px shrink-0 text-brand" aria-hidden="true" />
                      {t("dialog.withdrawalComplete.consentSummary", {
                        version: consent.version,
                        date: dayjs(consent.consentedAt).format("YYYY.MM.DD HH:mm"),
                      })}
                    </p>
                  )}
                  {copyMailRequested && (
                    <p className="flex items-start gap-1.5 break-keep">
                      <Email size={14} className="mt-px shrink-0" aria-hidden="true" />
                      {t("dialog.withdrawalComplete.copyMailSent")}
                    </p>
                  )}
                </div>
              )}
            </div>

            <p className="body-8 break-keep text-font-disabled">
              {t("dialog.withdrawalComplete.inquiryHint")}
            </p>
          </div>
        ) : (
          farewell
        )
      }
      confirmText="dialog.withdrawalComplete.confirm"
      confirmFn={handleConfirm}
    />
  );
};

export default WithdrawalCompleteDialog;
