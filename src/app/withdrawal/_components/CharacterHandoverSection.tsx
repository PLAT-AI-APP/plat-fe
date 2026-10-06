"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import ResourceImage from "@/components/ResourceImage";
import { ErrorState } from "@/components/state";
import useToggle from "@/hooks/common/useToggle";
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
const MarkdownDocument = dynamic(
  () => import("@/components/markdown/MarkdownDocument"),
);

const SUMMARY_KEYS = ["copyright", "anonymous", "review", "irreversible"] as const;

interface ChoiceButtonProps {
  label: string;
  isSelected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

const ChoiceButton = ({ label, isSelected, disabled, onSelect }: ChoiceButtonProps) => (
  <button
    type="button"
    role="radio"
    aria-checked={isSelected}
    disabled={disabled}
    onClick={onSelect}
    className={cn(
      "title-6 h-8 rounded-lg border px-3 transition-colors",
      isSelected
        ? "border-brand bg-brand-opacity text-brand"
        : "border-main text-font-2 enabled:hover:bg-btn-hover enabled:hover:text-font-1",
      disabled && "cursor-not-allowed text-font-disabled",
    )}
  >
    {label}
  </button>
);

interface CandidateRowProps {
  candidate: WithdrawalCandidate;
  choice?: WithdrawalChoice;
  canKeep: boolean;
  onChange: (universeId: string, choice: WithdrawalChoice) => void;
}

const CandidateRow = ({ candidate, choice, canKeep, onChange }: CandidateRowProps) => {
  const t = useTranslations("withdrawalPage.characters");

  return (
    <li className="flex items-center gap-3 rounded-xl bg-darkest px-4 py-3">
      {candidate.profileImageUrl ? (
        <ResourceImage
          src={toImageVariantUrl(candidate.profileImageUrl, "sq80")}
          alt=""
          width={40}
          height={40}
          unoptimized
          className="size-10 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <span aria-hidden="true" className="size-10 shrink-0 rounded-lg bg-card" />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <p className="title-6 truncate text-font-1">{candidate.title}</p>
        <p className="body-7 text-font-2">
          {t("talking", { count: formatWithCommas(candidate.otherRoomCount) })}
        </p>
      </div>

      <div role="radiogroup" aria-label={candidate.title} className="flex shrink-0 gap-1.5">
        <ChoiceButton
          label={t("keep")}
          isSelected={choice === "KEEP"}
          disabled={!canKeep}
          onSelect={() => onChange(candidate.universeId, "KEEP")}
        />
        <ChoiceButton
          label={t("delete")}
          isSelected={choice === "DELETE"}
          onSelect={() => onChange(candidate.universeId, "DELETE")}
        />
      </div>
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
      <div aria-hidden="true" className="flex w-full flex-col gap-2">
        <div className="skeleton h-5 w-32 rounded-full" />
        <div className="skeleton h-16 w-full rounded-xl" />
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
    <section className="flex w-full flex-col gap-3">
      <header className="flex flex-col gap-1">
        <h3 className="title-4 text-font-1">{t("title")}</h3>
        {candidates.length > 0 && (
          <p className="body-6 text-font-2">
            {canKeep ? t("description") : t("keepUnavailable")}
          </p>
        )}
      </header>

      {candidates.length > 0 && (
        <ul className="flex flex-col gap-2">
          {candidates.map((candidate) => (
            <CandidateRow
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
          <p className="body-6 text-font-2">{t("deletionsTitle")}</p>
          <ul className="flex flex-col gap-1.5 rounded-xl bg-darkest px-4 py-3">
            {deletions.map((deletion) => (
              <li
                key={deletion.universeId}
                className="body-6 flex items-center justify-between gap-3"
              >
                <span className="truncate text-font-1">{deletion.title}</span>
                {isKnownReason(deletion.reason) && (
                  <span className="shrink-0 text-font-disabled">
                    {t(`reasons.${deletion.reason}`)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasKeep && consent && (
        <div className="flex flex-col gap-3 rounded-xl border border-main px-4 py-4">
          <ul className="title-6 list-disc space-y-1 pl-5 text-font-1">
            {SUMMARY_KEYS.map((key) => (
              <li key={key}>{t(`summary.${key}`)}</li>
            ))}
          </ul>

          <button
            type="button"
            aria-expanded={consentToggle.isOpen}
            onClick={consentToggle.toggle}
            className="body-6 self-start text-font-2 underline underline-offset-2 hover:text-font-1"
          >
            {consentToggle.isOpen ? t("hideConsent") : t("viewConsent")}
          </button>

          {consentToggle.isOpen && (
            <div className="body-5 flex max-h-80 flex-col gap-3 overflow-y-auto rounded-lg bg-darkest p-4 text-font-1">
              <MarkdownDocument content={consent.content} />
            </div>
          )}

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
      )}
    </section>
  );
};

export default CharacterHandoverSection;
