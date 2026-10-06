"use client";

import { useTranslations } from "next-intl";
import type { WithdrawalCompleteDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const WithdrawalCompleteDialog = ({
  onClose,
  onConfirm,
  handovers = [],
  copyMailRequested = false,
}: WithdrawalCompleteDialogProps) => {
  const t = useTranslations();

  const handleConfirm = () => {
    onClose();
    onConfirm();
  };

  const farewell = `${t("dialog.withdrawalComplete.descriptionLine1")}\n${t("dialog.withdrawalComplete.descriptionLine2")}`;
  const hasHandover = handovers.length > 0;

  return (
    <Dialog
      onClose={handleConfirm}
      label="dialog.withdrawalComplete.title"
      description={
        hasHandover || copyMailRequested ? (
          <div className="flex w-full flex-col gap-3">
            <p className="body-5 w-full whitespace-pre-line text-font-2">
              {farewell}
            </p>

            {/* 남긴 캐릭터는 운영 심사 결과가 나올 때까지 이 번호로 문의할 수 있다. */}
            {hasHandover && (
              <div className="flex flex-col gap-2 rounded-xl bg-darkest px-4 py-3">
                <p className="title-6 text-font-1">
                  {t("dialog.withdrawalComplete.handoverTitle")}
                </p>
                <ul className="flex flex-col gap-2">
                  {handovers.map((handover) => (
                    <li key={handover.handoverId} className="flex flex-col">
                      <span className="body-6 truncate text-font-1">
                        {handover.title}
                      </span>
                      <span className="body-7 break-all text-font-2">
                        {t("dialog.withdrawalComplete.handoverNumber", {
                          id: handover.handoverId,
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {copyMailRequested && (
              <p className="body-6 text-font-2">
                {t("dialog.withdrawalComplete.copyMailSent")}
              </p>
            )}
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
