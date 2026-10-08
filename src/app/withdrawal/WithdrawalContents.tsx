"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import ActiveButton from "@/components/ActiveButton";
import { Coin } from "@/icons";
import useToggle from "@/hooks/common/useToggle";
import { cn } from "@/lib/utils";
import { useWithdrawalPreviewQuery } from "@/api/user/getWithdrawalPreview";
import {
  WITHDRAWAL_PREVIEW_STALE_CODES,
  useWithdrawMutation,
} from "@/api/user/postWithdrawal";
import { useEarningSummaryQuery } from "@/api/earning/getEarningSummary";
import { useWalletBalanceQuery } from "@/api/wallet/getWalletBalance";
import { useAuthStore } from "@/store/useAuthStore";
import { useDialogStore } from "@/store/useDialogStore";
import { useUserStore } from "@/store/useUserStore";
import { useWalletStore } from "@/store/useWalletStore";
import { SKIP_AUTH_ALERT_ONCE_KEY } from "@/constants/auth";
import type { WithdrawalChoice, WithdrawalResult } from "@/type/withdrawal";
import CharacterHandoverSection from "./_components/CharacterHandoverSection";
import CheckboxRow from "./_components/CheckboxRow";

const WithdrawalContents = () => {
  const t = useTranslations();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const clearBalance = useWalletStore((state) => state.clearBalance);
  const logout = useAuthStore((state) => state.logout);
  const { mutate: withdraw, isPending } = useWithdrawMutation();
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

  // 만든 캐릭터마다 남기기·삭제를 고른다. 기본값은 두지 않는다(미리 고른 것으로 치면 안 된다).
  const {
    data: preview,
    isPending: isPreviewPending,
    error: previewError,
    refetch: refetchPreview,
  } = useWithdrawalPreviewQuery();
  const [decisions, setDecisions] = useState<Record<string, WithdrawalChoice>>({});
  // 동의는 동의서 버전에 묶는다. 다시 받은 미리보기의 버전이 바뀌면 저절로 풀린다.
  const [agreedConsentId, setAgreedConsentId] = useState<string | null>(null);
  const [isAdultAttested, setIsAdultAttested] = useState(false);

  const candidates = preview?.candidates ?? [];
  const consent = preview?.consent ?? null;
  const canKeep = Boolean(preview?.keepAllowed && consent);
  // 남길 수 없게 바뀌었으면 예전에 고른 남기기는 고르지 않은 것으로 본다.
  const getChoice = (universeId: string): WithdrawalChoice | undefined => {
    const choice = decisions[universeId];
    return choice === "KEEP" && !canKeep ? undefined : choice;
  };
  const isAllDecided = candidates.every((candidate) => getChoice(candidate.universeId));
  const hasKeep = candidates.some((candidate) => getChoice(candidate.universeId) === "KEEP");
  const isConsentAgreed = Boolean(consent) && agreedConsentId === consent?.documentId;
  const needsAdult = hasKeep && Boolean(preview?.ageAttestationRequired);
  const isKeepReady = !hasKeep || (isConsentAgreed && (!needsAdult || isAdultAttested));

  const handleChoiceChange = (universeId: string, choice: WithdrawalChoice) =>
    setDecisions((prev) => ({ ...prev, [universeId]: choice }));
  const handleToggleConsent = () =>
    setAgreedConsentId((prev) =>
      consent && prev !== consent.documentId ? consent.documentId : null,
    );

  const nickname = user?.nickname || t("withdrawalPage.defaultMember");
  const canSubmit =
    Boolean(preview) && isAllDecided && isKeepReady && isConfirmed && !isPending;

  const handleDeleteConfirm = () => {
    if (isPending || !preview) return;

    withdraw(
      {
        decisions: candidates.map((candidate) => ({
          universeId: candidate.universeId,
          choice: getChoice(candidate.universeId) ?? "DELETE",
        })),
        consentDocumentId: hasKeep && consent ? consent.documentId : null,
        adultAttested: needsAdult && isAdultAttested,
      },
      {
        onSuccess: openCompleteDialog,
        // 실패 사유는 전역 토스트가 서버 문구로 안내하므로 확인 다이얼로그만 닫습니다.
        // 그사이 후보·동의서가 바뀐 실패는 미리보기를 다시 받아 화면을 맞춘다.
        onError: (error) => {
          closeDialog();
          if (WITHDRAWAL_PREVIEW_STALE_CODES.includes(error.code)) {
            void refetchPreview();
          }
        },
      },
    );
  };

  const openCompleteDialog = (result: WithdrawalResult) => {
    // 접수증에 썸네일을 보이도록 미리보기에서 받아 둔 이미지를 붙인다(탈퇴 뒤에는 다시 받을 수 없다).
    const imageByUniverse = new Map(
      candidates.map((candidate) => [candidate.universeId, candidate.profileImageUrl]),
    );
    openDialog("WITHDRAWAL_COMPLETE", {
      handovers: result.handovers.map((handover) => ({
        ...handover,
        profileImageUrl: imageByUniverse.get(handover.universeId) ?? null,
      })),
      copyMailRequested: result.copyMailRequested,
      consent: result.consent,
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

            <div className="flex w-full flex-col gap-2">
              <div className="rounded-3xl border border-main bg-darkest px-5 py-5">
                <ul className="body-5 flex flex-col gap-2.5 text-font-2">
                  {[
                    ...notices,
                    `${t("withdrawalPage.notices.creationsDeleted")}\n${t("withdrawalPage.notices.chatsReadOnly")}`,
                  ].map((notice) => (
                    <li key={notice} className="flex gap-2.5 break-keep">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-font-disabled"
                      />
                      <span className="whitespace-pre-line">{notice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 사라질 잔액은 숫자로 따로 보인다. 경고색은 아이콘에만 쓴다. */}
              {hasRemaining && (
                <p
                  role="note"
                  className="body-5 flex items-start gap-3 rounded-2xl border border-main bg-darkest px-4 py-3.5 text-font-1"
                >
                  <Coin size={18} className="mt-px shrink-0 text-warning" aria-hidden="true" />
                  <span className="break-keep">
                    {t("withdrawalPage.remainingBalance", {
                      credits: remainingCredits.toLocaleString(),
                      points: remainingPoints.toLocaleString(),
                    })}
                  </span>
                </p>
              )}

              <p className="body-8 break-keep px-1 text-font-disabled">
                {t("withdrawalPage.legalNotice")}
              </p>
            </div>
          </div>

          <CharacterHandoverSection
            preview={preview}
            isPending={isPreviewPending && !previewError}
            error={previewError}
            onRetry={() => void refetchPreview()}
            canKeep={canKeep}
            getChoice={getChoice}
            onChange={handleChoiceChange}
            hasKeep={hasKeep}
            isConsentAgreed={isConsentAgreed}
            onToggleConsent={handleToggleConsent}
            isAdultAttested={isAdultAttested}
            onToggleAdult={() => setIsAdultAttested((prev) => !prev)}
          />

          <CheckboxRow
            checked={isConfirmed}
            onToggle={toggleConfirmed}
            label={t("withdrawalPage.agreement")}
          />
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
