"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import ActiveButton from "@/components/ActiveButton";
import Checkbox from "@/icons/Checkbox";
import CheckboxEmpty from "@/icons/CheckboxEmpty";
import { cn } from "@/lib/utils";
import { useDeleteUserMutation } from "@/api/user/deleteUser";
import { useAuthStore } from "@/store/useAuthStore";
import { useDialogStore } from "@/store/useDialogStore";
import { useUserStore } from "@/store/useUserStore";
import { useWalletStore } from "@/store/useWalletStore";
import { SKIP_AUTH_ALERT_ONCE_KEY } from "@/constants/auth";

const WithdrawalContents = () => {
  const t = useTranslations();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const clearBalance = useWalletStore((state) => state.clearBalance);
  const logout = useAuthStore((state) => state.logout);
  const { mutate: deleteUser, isPending } = useDeleteUserMutation();
  const openDialog = useDialogStore((state) => state.openDialog);
  const closeDialog = useDialogStore((state) => state.closeDialog);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const notices = [
    t("withdrawalPage.notices.dataDeleted"),
    t("withdrawalPage.notices.recordsRetained"),
    t("withdrawalPage.notices.creditsRemoved"),
    t("withdrawalPage.notices.rejoinRestricted"),
  ];

  const nickname = user?.nickname || t("withdrawalPage.defaultMember");
  const canSubmit = isConfirmed && !isPending;

  const handleDeleteConfirm = () => {
    if (isPending) return;

    deleteUser(undefined, {
      onSuccess: openCompleteDialog,
      // 실패 사유는 응답 인터셉터가 토스트로 안내하므로 확인 다이얼로그만 닫습니다.
      onError: closeDialog,
    });
  };

  const openCompleteDialog = () => {
    openDialog("WITHDRAWAL_COMPLETE", {
      onConfirm: handleCompleteConfirm,
    });
  };

  const openConfirmDialog = () => {
    openDialog("WITHDRAWAL_CONFIRM", {
      onConfirm: handleDeleteConfirm,
    });
  };

  const handleCompleteConfirm = () => {
    sessionStorage.setItem(SKIP_AUTH_ALERT_ONCE_KEY, "true");
    logout();
    clearUser();
    clearBalance();
    window.location.replace("/");
  };

  return (
    <section className="flex min-h-full w-full items-center justify-center bg-dark px-5 py-16">
      <div className="flex w-full max-w-148 flex-col gap-12">
        <h1 className="heading-2 text-font-1">{t("withdrawalPage.title")}</h1>

        <div className="flex flex-col items-center gap-6">
          <div className="flex w-full flex-col gap-4">
            <header className="flex w-full flex-col gap-2">
              <h2 className="heading-3R text-font-1">
                {t("withdrawalPage.heading", { nickname })}
              </h2>
              <p className="body-2 text-font-2">
                {t("withdrawalPage.description")}
              </p>
            </header>

            <div className="flex w-full flex-col gap-1">
              <div className="rounded-2xl bg-darkest px-4 py-6">
                <ul className="body-4 list-disc space-y-0 pl-5 text-font-disabled">
                  {notices.map((notice) => (
                    <li key={notice}>{notice}</li>
                  ))}
                  <li>
                    {t("withdrawalPage.notices.creationsDeleted")}
                    <br />
                    {t("withdrawalPage.notices.chatsReadOnly")}
                  </li>
                </ul>
              </div>

              <p className="caption-3 text-font-disabled">
                {t("withdrawalPage.legalNotice")}
              </p>
            </div>
          </div>

          <button
            type="button"
            role="checkbox"
            aria-checked={isConfirmed}
            className="body-4 flex items-end gap-1.5 text-font-2 hover:text-font-1"
            onClick={() => setIsConfirmed((prev) => !prev)}
          >
            {isConfirmed ? (
              <Checkbox className="size-5 shrink-0 text-font-1" />
            ) : (
              <CheckboxEmpty className="size-5 shrink-0 text-font-2" />
            )}
            <span>{t("withdrawalPage.agreement")}</span>
          </button>
        </div>

        <div className="flex w-full gap-4">
          <button
            type="button"
            className="title-3 flex h-13 flex-1 items-center justify-center rounded-xl bg-card text-font-1 transition-colors hover:bg-card-hover"
            onClick={() => router.back()}
          >
            {t("withdrawalPage.back")}
          </button>

          <ActiveButton
            type="button"
            isActive={canSubmit}
            text={
              isPending
                ? t("withdrawalPage.submitPending")
                : t("withdrawalPage.submit")
            }
            onClick={openConfirmDialog}
            className={cn(
              "h-13 flex-1 rounded-xl",
              !canSubmit && "text-font-disabled",
            )}
          />
        </div>
      </div>
    </section>
  );
};

export default WithdrawalContents;
