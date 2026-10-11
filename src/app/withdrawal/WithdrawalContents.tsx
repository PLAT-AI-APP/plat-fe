"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import ActiveButton from "@/components/ActiveButton";
import useToggle from "@/hooks/common/useToggle";
import { cn } from "@/lib/utils";
import { useWithdrawalChecksQuery } from "@/api/user/getWithdrawalChecks";
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
import WithdrawalChecklist from "./_components/WithdrawalChecklist";

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
  const notices = [
    t("withdrawalPage.notices.dataDeleted"),
    t("withdrawalPage.notices.recordsRetained"),
    t("withdrawalPage.notices.rejoinRestricted"),
  ];

  // 탈퇴 전 확인. 환불·상품권 교환이 처리 중이면 서버가 탈퇴를 막고, 답변 대기 문의는 알리기만 한다.
  // 사라질 노트·수익 포인트는 숫자로 보이고 직접 확인을 받는다. 못 받은 잔액은 0 으로 보고 막지 않는다.
  const {
    data: checks,
    isError: isChecksError,
    refetch: refetchChecks,
  } = useWithdrawalChecksQuery();
  const { data: wallet, isError: isWalletError } = useWalletBalanceQuery();
  const { data: earning, isError: isEarningError } = useEarningSummaryQuery();
  const credits = wallet ? wallet.balance : isWalletError ? 0 : undefined;
  const points = earning ? earning.available : isEarningError ? 0 : undefined;
  const [isCreditsAcknowledged, setIsCreditsAcknowledged] = useState(false);
  const [isPointsAcknowledged, setIsPointsAcknowledged] = useState(false);
  const isChecksBlocked = Boolean(checks?.refundPending || checks?.redemptionPending);
  const isChecksReady = (Boolean(checks) || isChecksError) && credits !== undefined && points !== undefined;
  const isBalanceAcknowledged =
    (credits === 0 || isCreditsAcknowledged) && (points === 0 || isPointsAcknowledged);
  // 남은 할 일은 꺼진 탈퇴 버튼을 눌렀을 때부터 알린다. 아무것도 안 했는데 안내부터 뜨면 재촉으로 읽힌다.
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

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
  // 남길 수 없으면(만 19세 미만 등) 고를 것이 삭제 하나뿐이라 묻지 않고 삭제로 둔다.
  const getChoice = (universeId: string): WithdrawalChoice | undefined =>
    canKeep ? decisions[universeId] : "DELETE";
  const isAllDecided = candidates.every((candidate) => getChoice(candidate.universeId));
  const hasKeep = candidates.some((candidate) => getChoice(candidate.universeId) === "KEEP");
  const isConsentAgreed = Boolean(consent) && agreedConsentId === consent?.documentId;
  const needsAdult = hasKeep && Boolean(preview?.ageAttestationRequired);
  const isKeepReady = !hasKeep || (isConsentAgreed && (!needsAdult || isAdultAttested));

  const handleChoiceChange = (universeId: string, choice: WithdrawalChoice) =>
    setDecisions((prev) => ({ ...prev, [universeId]: choice }));
  // 일괄 선택. 사용자가 직접 누른 선택이라 "미리 고른 것"과 다르다.
  const handleChoiceChangeMany = (universeIds: string[], choice: WithdrawalChoice) =>
    setDecisions((prev) => ({
      ...prev,
      ...Object.fromEntries(universeIds.map((universeId) => [universeId, choice])),
    }));
  const undecidedCount = candidates.filter((candidate) => !getChoice(candidate.universeId)).length;
  const keepCount = candidates.filter((candidate) => getChoice(candidate.universeId) === "KEEP").length;
  const handleToggleConsent = () =>
    setAgreedConsentId((prev) =>
      consent && prev !== consent.documentId ? consent.documentId : null,
    );

  const nickname = user?.nickname || t("withdrawalPage.defaultMember");
  // 남은 할 일 하나와, 안내가 가리킬 자리. 위에서부터 순서대로 하나만 알린다.
  // isError: 할 일이 남은 게 아니라 탈퇴 자체가 막힌 이유라 빨강으로 보인다.
  const blocker: { message: string | null; targetId: string; isError?: boolean } | null = isChecksBlocked
    ? { message: t("withdrawalPage.blockers.pending"), targetId: "withdrawal-checks", isError: true }
    : !isChecksReady
      ? { message: t("withdrawalPage.blockers.checking"), targetId: "withdrawal-checks" }
      : !isBalanceAcknowledged
        ? { message: t("withdrawalPage.blockers.balance"), targetId: "withdrawal-checks" }
        : undecidedCount > 0
          ? {
              message: t("withdrawalPage.characters.undecidedLeft", { count: undecidedCount }),
              targetId: "withdrawal-characters",
            }
          : hasKeep && !isConsentAgreed
            ? { message: t("withdrawalPage.blockers.consent"), targetId: "handover-consent" }
            : needsAdult && !isAdultAttested
              ? { message: t("withdrawalPage.blockers.adult"), targetId: "handover-consent" }
              : !isConfirmed
                ? // 확인 체크는 버튼 바로 위라 문구 없이 그 자리로만 옮긴다.
                  { message: null, targetId: "withdrawal-confirm" }
                : null;
  const nextStep = hasTriedSubmit ? (blocker?.message ?? null) : null;
  const canSubmit =
    Boolean(preview) &&
    isAllDecided &&
    isKeepReady &&
    isConfirmed &&
    isChecksReady &&
    !isChecksBlocked &&
    isBalanceAcknowledged &&
    !isPending;

  const handleBlockedSubmit = () => {
    if (!blocker) return;
    setHasTriedSubmit(true);
    const target = document.getElementById(blocker.targetId);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (blocker.targetId === "withdrawal-confirm") target?.focus({ preventScroll: true });
  };

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
      // 마지막으로 무엇이 남고 무엇이 지워지는지 숫자로 보인다.
      keepCount,
      deleteCount: candidates.length - keepCount + (preview?.deletions.length ?? 0),
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

              <WithdrawalChecklist
                checks={checks}
                checksFailed={isChecksError}
                onRetry={refetchChecks}
                credits={credits}
                points={points}
                creditsAcknowledged={isCreditsAcknowledged}
                pointsAcknowledged={isPointsAcknowledged}
                onAcknowledgeCredits={() => setIsCreditsAcknowledged(true)}
                onAcknowledgePoints={() => setIsPointsAcknowledged(true)}
              />

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
            onChangeMany={handleChoiceChangeMany}
            hasKeep={hasKeep}
            isConsentAgreed={isConsentAgreed}
            onToggleConsent={handleToggleConsent}
            isAdultAttested={isAdultAttested}
            onToggleAdult={() => setIsAdultAttested((prev) => !prev)}
          />

          <CheckboxRow
            id="withdrawal-confirm"
            checked={isConfirmed}
            onToggle={toggleConfirmed}
            label={t("withdrawalPage.agreement")}
          />
        </div>

        {/* 캐릭터를 정해야 하는 탈퇴라면, 탈퇴 버튼이 왜 꺼져 있는지 남은 할 일을 하나씩 알린다. */}
        {nextStep && (
          <p
            role="status"
            className={cn(
              "body-6 -mb-8 flex items-center justify-center gap-1.5 text-center",
              blocker?.isError ? "text-danger" : "text-font-2",
            )}
          >
            <span
              aria-hidden="true"
              className={cn("size-1.5 shrink-0 rounded-full", blocker?.isError ? "bg-danger" : "bg-brand")}
            />
            {nextStep}
          </p>
        )}

        <div className="flex w-full gap-4">
          <button
            type="button"
            className="title-3 flex h-13 flex-1 items-center justify-center rounded-xl bg-card text-font-1 transition-colors hover:bg-card-hover"
            onClick={() => router.back()}
          >
            {t("withdrawalPage.back")}
          </button>

          {/* 꺼진 버튼은 눌리지 않으므로 감싼 칸이 누름을 받아 남은 할 일로 안내한다. */}
          <div
            className="flex flex-1"
            onClick={!canSubmit && !isPending ? handleBlockedSubmit : undefined}
          >
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
      </div>
    </section>
  );
};

export default WithdrawalContents;
