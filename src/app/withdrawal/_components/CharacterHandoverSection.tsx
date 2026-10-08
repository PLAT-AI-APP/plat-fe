"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ErrorState } from "@/components/state";
import { EASE_OUT } from "@/constants/motion";
import { ArrowDown, Info, Trash } from "@/icons";
import { cn, formatWithCommas } from "@/lib/utils";
import type { AppError } from "@/type/api";
import {
  WITHDRAWAL_DELETION_REASONS,
  type WithdrawalChoice,
  type WithdrawalPreview,
} from "@/type/withdrawal";
import HandoverCandidateList from "./HandoverCandidateList";
import HandoverConsentCard from "./HandoverConsentCard";

/** 삭제될 캐릭터가 이보다 많으면 처음엔 접어 둔다. */
const DELETIONS_OPEN_LIMIT = 5;

interface CharacterHandoverSectionProps {
  preview?: WithdrawalPreview;
  isPending: boolean;
  error: AppError | null;
  onRetry: () => void;
  canKeep: boolean;
  getChoice: (universeId: string) => WithdrawalChoice | undefined;
  onChange: (universeId: string, choice: WithdrawalChoice) => void;
  onChangeMany: (universeIds: string[], choice: WithdrawalChoice) => void;
  hasKeep: boolean;
  isConsentAgreed: boolean;
  onToggleConsent: () => void;
  isAdultAttested: boolean;
  onToggleAdult: () => void;
}

/**
 * 탈퇴 전 만든 캐릭터 처리.
 * 대화 중인 다른 유저가 있는 캐릭터는 남기기·삭제를 직접 고르고(기본값 없음), 나머지는 삭제 목록으로 보여 준다.
 * 남기기를 하나라도 고르면 이용허락 동의 카드가 아래에 열린다.
 */
const CharacterHandoverSection = ({
  preview,
  isPending,
  error,
  onRetry,
  canKeep,
  getChoice,
  onChange,
  onChangeMany,
  hasKeep,
  isConsentAgreed,
  onToggleConsent,
  isAdultAttested,
  onToggleAdult,
}: CharacterHandoverSectionProps) => {
  const t = useTranslations("withdrawalPage.characters");
  const reduceMotion = useReducedMotion();
  const [isDeletionsOpen, setIsDeletionsOpen] = useState<boolean | null>(null);

  if (isPending) {
    return (
      <div aria-hidden="true" className="flex w-full flex-col gap-3">
        <div className="skeleton h-6 w-36 rounded-full" />
        <div className="skeleton h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (error || !preview) {
    return <ErrorState error={error} onRetry={onRetry} variant="inline" className="w-full" />;
  }

  const { candidates, deletions, consent } = preview;
  if (candidates.length === 0 && deletions.length === 0) return null;

  // 모르는 이유가 오면 라벨 없이 제목만 둔다(번역 키가 없어 깨지지 않게).
  const isKnownReason = (reason: string) =>
    (WITHDRAWAL_DELETION_REASONS as readonly string[]).includes(reason);
  // 사용자가 직접 열고 닫기 전까지는 개수로 정한다.
  const deletionsOpen = isDeletionsOpen ?? deletions.length <= DELETIONS_OPEN_LIMIT;

  return (
    <section className="flex w-full flex-col gap-4">
      <header className="flex flex-col gap-1.5">
        <h3 className="title-2 text-font-1">{t("title")}</h3>
        {candidates.length > 0 && canKeep && (
          <p className="body-5 break-keep text-font-2">{t("choiceGuide")}</p>
        )}
      </header>

      {/* 남기기가 왜 꺼져 있는지 먼저 알린다. 이유 없이 버튼만 꺼져 있으면 고장으로 읽힌다. */}
      {candidates.length > 0 && !canKeep && (
        <div role="note" className="flex items-start gap-3 rounded-2xl border border-main bg-darkest px-4 py-3.5">
          <Info size={18} className="mt-px shrink-0 text-font-2" aria-hidden="true" />
          <p className="body-5 break-keep text-font-1">
            {preview.keepBlockedReason === "MINOR" ? t("keepBlocked.minor") : t("keepBlocked.unavailable")}
          </p>
        </div>
      )}

      {candidates.length > 0 && (
        <HandoverCandidateList
          candidates={candidates}
          canKeep={canKeep}
          getChoice={getChoice}
          onChange={onChange}
          onChangeMany={onChangeMany}
        />
      )}

      <AnimatePresence initial={false}>
        {hasKeep && consent && (
          <m.div
            key="handover-consent"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            <HandoverConsentCard
              consent={consent}
              ageAttestationRequired={preview.ageAttestationRequired}
              isConsentAgreed={isConsentAgreed}
              onToggleConsent={onToggleConsent}
              isAdultAttested={isAdultAttested}
              onToggleAdult={onToggleAdult}
            />
          </m.div>
        )}
      </AnimatePresence>

      {deletions.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-main bg-darkest">
          <button
            type="button"
            aria-expanded={deletionsOpen}
            onClick={() => setIsDeletionsOpen(!deletionsOpen)}
            className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-card/40"
          >
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="title-5 flex items-center gap-2 text-font-1">
                <Trash size={16} className="shrink-0 text-font-2" aria-hidden="true" />
                {t("deletionsTitle")}
                <span className="body-8 rounded-full bg-card px-2 py-0.5 text-font-2 tabular-nums">
                  {formatWithCommas(deletions.length)}
                </span>
              </span>
              <span className="body-7 break-keep text-font-disabled">{t("deletionsCaption")}</span>
            </span>
            <ArrowDown
              size={16}
              aria-hidden="true"
              className={cn("shrink-0 text-font-2 transition-transform duration-200", deletionsOpen && "rotate-180")}
            />
          </button>

          {deletionsOpen && (
            <ul className="max-h-80 divide-y divide-main overflow-y-auto border-t border-main px-5">
              {deletions.map((deletion) => (
                <li
                  key={deletion.universeId}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <span className="body-5 truncate text-font-1">{deletion.title}</span>
                  {isKnownReason(deletion.reason) && (
                    <span className="body-8 shrink-0 rounded-full border border-main px-2.5 py-1 text-font-2">
                      {t(`reasons.${deletion.reason}`)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
};

export default CharacterHandoverSection;
