"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { ComponentType } from "react";
import ResourceImage from "@/components/ResourceImage";
import { ErrorState } from "@/components/state";
import useToggle from "@/hooks/common/useToggle";
import { ArrowDown, BookOpen, Chat, Info, LockLine, Trash, User } from "@/icons";
import type { IconProps } from "@/icons";
import CheckCircle from "@/icons/CheckCircle";
import StatusWarning from "@/icons/StatusWarning";
import { toImageVariantUrl } from "@/lib/file";
import { cn, formatWithCommas } from "@/lib/utils";
import type { AppError } from "@/type/api";
import {
  WITHDRAWAL_DELETION_REASONS,
  type WithdrawalCandidate,
  type WithdrawalChoice,
  type WithdrawalPreview,
} from "@/type/withdrawal";
import CheckboxRow from "./CheckboxRow";

// 동의서 전문은 펼칠 때만 그린다. 약관 화면과 같은 렌더러를 쓴다.
// loading 이 없으면 dynamic 이 자체 Suspense 경계를 두지 않아, 처음 펼칠 때 페이지 전체가 잠깐 교체되며
// 스크롤이 맨 위로 튄다. 대기 자리를 이 상자 안에 둔다.
const MarkdownDocument = dynamic(
  () => import("@/components/markdown/MarkdownDocument"),
  {
    loading: () => (
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-4 w-full rounded" />
        ))}
      </div>
    ),
  },
);

/** 동의서 요약. 약관 명시·설명의무 대상이라 굵게 보인다. 마지막 줄(되돌릴 수 없음)은 경고색이다. */
const SUMMARY_ITEMS: {
  key: "copyright" | "anonymous" | "review" | "irreversible";
  icon: ComponentType<IconProps>;
}[] = [
  { key: "copyright", icon: LockLine },
  { key: "anonymous", icon: User },
  { key: "review", icon: CheckCircle },
  { key: "irreversible", icon: StatusWarning },
];

interface ChoiceSegmentProps {
  title: string;
  choice?: WithdrawalChoice;
  canKeep: boolean;
  onSelect: (choice: WithdrawalChoice) => void;
}

/** 남기기·삭제 둘 중 하나. 처음에는 아무것도 골라져 있지 않다(미리 고른 것으로 치면 안 된다). */
const ChoiceSegment = ({ title, choice, canKeep, onSelect }: ChoiceSegmentProps) => {
  const t = useTranslations("withdrawalPage.characters");
  const options: { value: WithdrawalChoice; label: string; disabled: boolean }[] = [
    { value: "KEEP", label: t("keep"), disabled: !canKeep },
    { value: "DELETE", label: t("delete"), disabled: false },
  ];

  return (
    <div
      role="radiogroup"
      aria-label={title}
      className="grid w-full grid-cols-2 gap-1 rounded-xl bg-card p-1 sm:w-44 sm:shrink-0"
    >
      {options.map((option) => {
        const isSelected = choice === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={option.disabled}
            onClick={() => onSelect(option.value)}
            className={cn(
              "title-6 h-9 rounded-lg transition-colors",
              isSelected
                ? option.value === "KEEP"
                  ? "bg-brand text-on-brand"
                  : "bg-btn-selected text-font-1"
                : "text-font-2 enabled:hover:bg-btn-hover enabled:hover:text-font-1",
              option.disabled && "cursor-not-allowed text-font-disabled",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

interface CandidateCardProps {
  candidate: WithdrawalCandidate;
  choice?: WithdrawalChoice;
  canKeep: boolean;
  onChange: (universeId: string, choice: WithdrawalChoice) => void;
}

const CandidateCard = ({ candidate, choice, canKeep, onChange }: CandidateCardProps) => {
  const t = useTranslations("withdrawalPage.characters");

  return (
    <li
      className={cn(
        "flex flex-col gap-3 rounded-2xl border bg-darkest p-4 transition-colors",
        choice === "KEEP" ? "border-brand" : "border-transparent",
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {candidate.profileImageUrl ? (
            <ResourceImage
              src={toImageVariantUrl(candidate.profileImageUrl, "sq140")}
              alt=""
              width={56}
              height={56}
              unoptimized
              className="size-14 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <span aria-hidden="true" className="size-14 shrink-0 rounded-xl bg-card" />
          )}

          <div className="flex min-w-0 flex-col gap-1">
            <p className="title-5 truncate text-font-1">{candidate.title}</p>
            <p className="body-7 flex items-center gap-1 text-font-2">
              <Chat size={14} className="shrink-0" aria-hidden="true" />
              {t("talking", { count: formatWithCommas(candidate.otherRoomCount) })}
            </p>
          </div>
        </div>

        <ChoiceSegment
          title={candidate.title}
          choice={choice}
          canKeep={canKeep}
          onSelect={(next) => onChange(candidate.universeId, next)}
        />
      </div>

      {/* 고른 뒤 무엇이 일어나는지 한 줄로 알린다. 고르기 전에는 어느 쪽도 권하지 않는다. */}
      {choice && (
        <p
          className={cn(
            "body-7 flex items-start gap-1.5 break-keep rounded-lg px-3 py-2",
            choice === "KEEP" ? "bg-brand-opacity text-font-1" : "bg-card text-font-2",
          )}
        >
          <Info size={14} className="mt-px shrink-0" aria-hidden="true" />
          {t(`hints.${choice}`)}
        </p>
      )}
    </li>
  );
};

interface CharacterHandoverSectionProps {
  preview?: WithdrawalPreview;
  isPending: boolean;
  error: AppError | null;
  onRetry: () => void;
  canKeep: boolean;
  getChoice: (universeId: string) => WithdrawalChoice | undefined;
  onChange: (universeId: string, choice: WithdrawalChoice) => void;
  hasKeep: boolean;
  isConsentAgreed: boolean;
  onToggleConsent: () => void;
  isAdultAttested: boolean;
  onToggleAdult: () => void;
}

/**
 * 탈퇴 전 만든 캐릭터 처리.
 * 대화 중인 다른 유저가 있는 캐릭터는 남기기·삭제를 직접 고르고(기본값 없음), 나머지는 삭제 목록으로 보여 준다.
 */
const CharacterHandoverSection = ({
  preview,
  isPending,
  error,
  onRetry,
  canKeep,
  getChoice,
  onChange,
  hasKeep,
  isConsentAgreed,
  onToggleConsent,
  isAdultAttested,
  onToggleAdult,
}: CharacterHandoverSectionProps) => {
  const t = useTranslations("withdrawalPage.characters");
  const consentToggle = useToggle();

  if (isPending) {
    return (
      <div aria-hidden="true" className="flex w-full flex-col gap-3">
        <div className="skeleton h-5 w-32 rounded-full" />
        <div className="skeleton h-24 w-full rounded-2xl" />
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

  return (
    <section className="flex w-full flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h3 className="title-3 text-font-1">{t("title")}</h3>
        {candidates.length > 0 && (
          <p className="body-6 text-font-2">
            {canKeep ? t("description") : t("keepUnavailable")}
          </p>
        )}
      </header>

      {candidates.length > 0 && (
        <ul className="flex flex-col gap-2">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.universeId}
              candidate={candidate}
              choice={getChoice(candidate.universeId)}
              canKeep={canKeep}
              onChange={onChange}
            />
          ))}
        </ul>
      )}

      {deletions.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="title-6 flex items-center gap-1.5 text-font-2">
            <Trash size={15} className="shrink-0" aria-hidden="true" />
            {t("deletionsTitle")}
            <span className="text-font-disabled">{formatWithCommas(deletions.length)}</span>
          </p>
          <ul className="flex flex-col divide-y divide-main rounded-2xl bg-darkest px-4">
            {deletions.map((deletion) => (
              <li
                key={deletion.universeId}
                className="body-6 flex items-center justify-between gap-3 py-3"
              >
                <span className="truncate text-font-1">{deletion.title}</span>
                {isKnownReason(deletion.reason) && (
                  <span className="body-8 shrink-0 rounded-full bg-card px-2 py-0.5 text-font-2">
                    {t(`reasons.${deletion.reason}`)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasKeep && consent && (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-main">
          <div className="flex items-start gap-3 bg-brand-opacity px-4 py-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-opacity-2 text-brand">
              <BookOpen size={18} aria-hidden="true" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="title-5 flex items-center gap-2 text-font-1">
                {t("consentTitle")}
                <span className="body-8 rounded-full bg-card px-2 py-0.5 text-font-2">
                  v{consent.version}
                </span>
              </p>
              <p className="body-7 break-keep text-font-2">{t("consentSubtitle")}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-4 py-4">
            <ul className="flex flex-col gap-2.5">
              {SUMMARY_ITEMS.map(({ key, icon: Icon }) => (
                <li
                  key={key}
                  className={cn(
                    "title-6 flex items-start gap-2 break-keep",
                    key === "irreversible" ? "text-warning" : "text-font-1",
                  )}
                >
                  <Icon
                    size={16}
                    aria-hidden="true"
                    className={cn(
                      "mt-px shrink-0",
                      key === "irreversible" ? "text-warning" : "text-font-2",
                    )}
                  />
                  {t(`summary.${key}`)}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                aria-expanded={consentToggle.isOpen}
                onClick={consentToggle.toggle}
                className="body-6 flex h-10 items-center justify-between rounded-xl bg-darkest px-4 text-font-1 transition-colors hover:bg-btn-hover"
              >
                {consentToggle.isOpen ? t("hideConsent") : t("viewConsent")}
                <ArrowDown
                  size={16}
                  aria-hidden="true"
                  className={cn(
                    "shrink-0 text-font-2 transition-transform",
                    consentToggle.isOpen && "rotate-180",
                  )}
                />
              </button>

              {consentToggle.isOpen && (
                <div className="body-5 flex max-h-80 flex-col gap-3 overflow-y-auto rounded-xl bg-darkest p-4 text-font-1">
                  <MarkdownDocument content={consent.content} />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2.5 border-t border-main pt-4">
              <CheckboxRow
                checked={isConsentAgreed}
                onToggle={onToggleConsent}
                label={t("consentAgree", { version: consent.version })}
              />
              {preview.ageAttestationRequired && (
                <CheckboxRow
                  checked={isAdultAttested}
                  onToggle={onToggleAdult}
                  label={t("adultAttest")}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CharacterHandoverSection;
