"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import ActiveButton from "@/components/ActiveButton";
import Checkbox from "@/icons/Checkbox";
import CheckboxEmpty from "@/icons/CheckboxEmpty";
import useToggle from "@/hooks/common/useToggle";
import { cn } from "@/lib/utils";
import { useDeleteUserMutation } from "@/api/user/deleteUser";
import { useWithdrawalPreviewQuery } from "@/api/user/getWithdrawalPreview";
import { usePostWithdrawalMutation } from "@/api/user/postWithdrawal";
import { useEarningSummaryQuery } from "@/api/earning/getEarningSummary";
import { useWalletBalanceQuery } from "@/api/wallet/getWalletBalance";
import { useAuthStore } from "@/store/useAuthStore";
import { useDialogStore } from "@/store/useDialogStore";
import { useUserStore } from "@/store/useUserStore";
import { useWalletStore } from "@/store/useWalletStore";
import { SKIP_AUTH_ALERT_ONCE_KEY } from "@/constants/auth";
import type { HandoverChoice } from "@/type/withdrawal";
import HandoverSection from "./_components/HandoverSection";

const WithdrawalContents = () => {
  const t = useTranslations();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const clearBalance = useWalletStore((state) => state.clearBalance);
  const logout = useAuthStore((state) => state.logout);
  const { mutate: deleteUser, isPending: isDeletePending } =
    useDeleteUserMutation();
  const { mutate: postWithdrawal, isPending: isPostPending } =
    usePostWithdrawalMutation();
  const isPending = isDeletePending || isPostPending;
  // 남기기/삭제를 고를 캐릭터와 남길 수 없는 이유. 받지 못하면 예전처럼 바로 탈퇴를 시도한다(서버가 막으면 안내).
  const {
    data: preview,
    isPending: isPreviewPending,
    isError: isPreviewError,
  } = useWithdrawalPreviewQuery();
  const [decisions, setDecisions] = useState<
    Record<string, HandoverChoice | undefined>
  >({});
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  const [isAgeAttested, setIsAgeAttested] = useState(false);
  const openDialog = useDialogStore((state) => state.openDialog);
  const closeDialog = useDialogStore((state) => state.closeDialog);
  const { isOpen: isConfirmed, toggle: toggleConfirmed } = useToggle();
  // 사라질 잔액을 숫자로 먼저 보여 준다. "크레딧이 지워진다"는 문장만으로는 얼마를 잃는지 알 수 없다.
  const { data: wallet } = useWalletBalanceQuery();
  const { data: earning } = useEarningSummaryQuery();
  const remainingCredits = wallet?.balance ?? 0;
  const remainingPoints = earning?.available ?? 0;
  const hasRemaining = remainingCredits > 0 || remainingPoints > 0;

  const notices = [
    t("withdrawalPage.notices.dataDeleted"),
    t("withdrawalPage.notices.recordsRetained"),
    t("withdrawalPage.notices.creditsRemoved"),
    t("withdrawalPage.notices.rejoinRestricted"),
  ];

  const nickname = user?.nickname || t("withdrawalPage.defaultMember");

  const candidates = preview?.candidates ?? [];
  const keepAllowed = preview?.keepAllowed ?? false;
  // 남길 수 없으면 후보는 모두 삭제로 처리한다.
  const getChoice = (universeId: string): HandoverChoice | undefined =>
    keepAllowed ? decisions[universeId] : "DELETE";
  const isAllChosen = candidates.every((candidate) =>
    getChoice(candidate.universeId),
  );
  const hasKeep = candidates.some(
    (candidate) => getChoice(candidate.universeId) === "KEEP",
  );
  const needsConsent = hasKeep && Boolean(preview?.consent);
  const needsAgeAttest = hasKeep && Boolean(preview?.ageAttestationRequired);

  const canSubmit =
    isConfirmed &&
    !isPending &&
    !isPreviewPending &&
    isAllChosen &&
    (!needsConsent || isConsentChecked) &&
    (!needsAgeAttest || isAgeAttested);

  const handleChoose = (universeId: string, choice: HandoverChoice) => {
    setDecisions((previous) => ({ ...previous, [universeId]: choice }));
  };

  const handleDeleteConfirm = () => {
    if (isPending) return;

    const handlers = {
      onSuccess: openCompleteDialog,
      // 실패 사유는 응답 인터셉터가 토스트로 안내하므로 확인 다이얼로그만 닫습니다.
      onError: closeDialog,
    };

    // 고를 캐릭터가 있으면 선택을 담아 보낸다. 빠진 후보가 있으면 서버가 409 로 거절한다.
    if (candidates.length > 0) {
      postWithdrawal(
        {
          decisions: candidates.map((candidate) => ({
            universeId: candidate.universeId,
            choice: getChoice(candidate.universeId) ?? "DELETE",
          })),
          consentDocumentId: hasKeep
            ? (preview?.consent?.documentId ?? null)
            : null,
          adultAttested: hasKeep && isAgeAttested,
        },
        handlers,
      );
      return;
    }

    deleteUser(undefined, handlers);
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
    <section className="flex min-h-full w-full items-center justify-center bg-dark py-16">
      <div className="flex w-full max-w-148 flex-col gap-12">
        <h1 className="heading-2 text-font-1">{t("withdrawalPage.title")}</h1>

        <div className="flex flex-col items-center gap-6">
          <div className="flex w-full flex-col gap-4">
            <header className="flex w-full flex-col gap-2">
              <h2 className="heading-3R text-font-1">
                {t("withdrawalPage.heading", { nickname })}
              </h2>
              <p className="body-3 text-font-2">
                {t("withdrawalPage.description")}
              </p>
            </header>

            <div className="flex w-full flex-col gap-1">
              <div className="rounded-2xl bg-darkest px-4 py-6">
                <ul className="body-5 list-disc space-y-0 pl-5 text-font-disabled">
                  {notices.map((notice) => (
                    <li key={notice}>{notice}</li>
                  ))}
                  <li>
                    {/* 남길 캐릭터를 고를 수 있으면 "모두 지워진다"는 안내가 맞지 않아 뺀다. */}
                    {candidates.length === 0 && (
                      <>
                        {t("withdrawalPage.notices.creationsDeleted")}
                        <br />
                      </>
                    )}
                    {t("withdrawalPage.notices.chatsReadOnly")}
                  </li>
                </ul>
              </div>

              {hasRemaining && (
                <p
                  role="note"
                  className="body-5 rounded-xl border border-main px-4 py-3 text-font-1"
                >
                  {t("withdrawalPage.remainingBalance", {
                    credits: remainingCredits.toLocaleString(),
                    points: remainingPoints.toLocaleString(),
                  })}
                </p>
              )}

              <p className="body-8 text-font-disabled">
                {t("withdrawalPage.legalNotice")}
              </p>
            </div>
          </div>

          {preview && (
            <HandoverSection
              preview={preview}
              decisions={decisions}
              onChoose={handleChoose}
              hasKeep={hasKeep}
              isConsentChecked={isConsentChecked}
              onConsentChange={() => setIsConsentChecked((value) => !value)}
              isAgeAttested={isAgeAttested}
              onAgeAttestChange={() => setIsAgeAttested((value) => !value)}
            />
          )}

          {isPreviewError && (
            <p
              role="note"
              className="body-5 w-full rounded-xl border border-main px-4 py-3 text-font-1"
            >
              {t("withdrawalPage.handover.previewFailed")}
            </p>
          )}

          <button
            type="button"
            role="checkbox"
            aria-checked={isConfirmed}
            className="body-5 flex items-end gap-1.5 text-font-2 hover:text-font-1"
            onClick={toggleConfirmed}
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
