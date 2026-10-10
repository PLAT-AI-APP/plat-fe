"use client";

import { useIsMutating } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { WITHDRAW_MUTATION_KEY } from "@/api/user/postWithdrawal";
import type { WithdrawalConfirmDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const WithdrawalConfirmDialog = ({
  onClose,
  onConfirm,
  keepCount = 0,
  deleteCount = 0,
}: WithdrawalConfirmDialogProps) => {
  const t = useTranslations();
  // Dialog는 열릴 때 props가 고정되므로 진행 상태는 뮤테이션에서 직접 구독합니다.
  const isPending =
    useIsMutating({ mutationKey: WITHDRAW_MUTATION_KEY }) > 0;
  const lines = `${t("dialog.withdrawalConfirm.descriptionLine1")}\n${t("dialog.withdrawalConfirm.descriptionLine2")}`;

  return (
    <Dialog
      onClose={onClose}
      cancelFn={onClose}
      cancelText="dialog.withdrawalConfirm.cancel"
      confirmText={
        isPending
          ? t("dialog.withdrawalConfirm.confirmPending")
          : t("dialog.withdrawalConfirm.confirm")
      }
      label="dialog.withdrawalConfirm.title"
      description={
        keepCount + deleteCount > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <p className="body-5 w-full whitespace-pre-line text-font-2">{lines}</p>
            {/* 마지막 확인. 무엇이 남고 무엇이 지워지는지 숫자로 다시 보인다. */}
            <ul className="body-6 flex w-full flex-col gap-2 rounded-2xl bg-darkest px-4 py-3">
              {keepCount > 0 && (
                <li className="flex items-center justify-between gap-3">
                  <span className="break-keep text-font-2">{t("dialog.withdrawalConfirm.keepSummary")}</span>
                  <span className="title-6 shrink-0 text-font-1 tabular-nums">
                    {t("dialog.withdrawalConfirm.countUnit", { count: keepCount })}
                  </span>
                </li>
              )}
              {deleteCount > 0 && (
                <li className="flex items-center justify-between gap-3">
                  <span className="break-keep text-font-2">{t("dialog.withdrawalConfirm.deleteSummary")}</span>
                  <span className="title-6 shrink-0 text-font-1 tabular-nums">
                    {t("dialog.withdrawalConfirm.countUnit", { count: deleteCount })}
                  </span>
                </li>
              )}
            </ul>
          </div>
        ) : (
          lines
        )
      }
      confirmFn={onConfirm}
      isConfirmPending={isPending}
    />
  );
};

export default WithdrawalConfirmDialog;
