"use client";

import { useTranslations } from "next-intl";
import ResourceImage from "@/components/ResourceImage";
import Checkbox from "@/icons/Checkbox";
import CheckboxEmpty from "@/icons/CheckboxEmpty";
import { toImageVariantUrl } from "@/lib/file";
import { cn } from "@/lib/utils";
import type {
  HandoverChoice,
  KeepBlockedReason,
  WithdrawalPreview,
} from "@/type/withdrawal";

interface HandoverSectionProps {
  preview: WithdrawalPreview;
  /** 후보마다 고른 값. 남길 수 없으면 선택지가 막히고 모두 삭제로 본다. */
  decisions: Record<string, HandoverChoice | undefined>;
  onChoose: (universeId: string, choice: HandoverChoice) => void;
  /** 남기기를 하나라도 골랐는지. 동의서·나이 진술은 이때만 보인다. */
  hasKeep: boolean;
  isConsentChecked: boolean;
  onConsentChange: () => void;
  isAgeAttested: boolean;
  onAgeAttestChange: () => void;
}

interface CheckRowProps {
  checked: boolean;
  label: string;
  onToggle: () => void;
}

const KEEP_BLOCKED_KEYS = {
  MINOR: "keepBlockedMinor",
  CONSENT_UNAVAILABLE: "keepBlockedConsent",
} as const satisfies Record<KeepBlockedReason, string>;

const CheckRow = ({ checked, label, onToggle }: CheckRowProps) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    onClick={onToggle}
    className="body-5 flex items-center gap-1.5 text-left text-font-2 hover:text-font-1"
  >
    {checked ? (
      <Checkbox className="size-5 shrink-0 text-font-1" />
    ) : (
      <CheckboxEmpty className="size-5 shrink-0 text-font-2" />
    )}
    <span>{label}</span>
  </button>
);

/**
 * 탈퇴할 때 남길 수 있는 캐릭터(세계관)를 골라 남기거나 지우는 구역.
 * 남기기를 고를 수 없으면(만 19세 미만·동의서 없음) 왜 막혔는지 알리고, 후보는 모두 삭제로 처리된다.
 */
const HandoverSection = ({
  preview,
  decisions,
  onChoose,
  hasKeep,
  isConsentChecked,
  onConsentChange,
  isAgeAttested,
  onAgeAttestChange,
}: HandoverSectionProps) => {
  const t = useTranslations("withdrawalPage.handover");
  const { candidates, deletions, keepAllowed, keepBlockedReason, consent } =
    preview;

  if (candidates.length === 0 && deletions.length === 0) return null;

  return (
    <section className="flex w-full flex-col gap-4">
      {candidates.length > 0 && (
        <div className="flex flex-col gap-3">
          <header className="flex flex-col gap-1">
            <h2 className="heading-3R text-font-1">{t("title")}</h2>
            <p className="body-5 text-font-2">{t("description")}</p>
          </header>

          {!keepAllowed && keepBlockedReason && (
            <p
              role="note"
              className="body-5 rounded-xl border border-main px-4 py-3 text-font-1"
            >
              {t(KEEP_BLOCKED_KEYS[keepBlockedReason])}
            </p>
          )}

          <ul className="flex flex-col gap-2">
            {candidates.map((candidate) => {
              const choice = keepAllowed
                ? decisions[candidate.universeId]
                : "DELETE";

              return (
                <li
                  key={candidate.universeId}
                  className="flex items-center gap-3 rounded-2xl bg-darkest p-3"
                >
                  {candidate.profileImageUrl ? (
                    <ResourceImage
                      src={toImageVariantUrl(candidate.profileImageUrl, "sq140")}
                      alt=""
                      width={44}
                      height={44}
                      unoptimized
                      className="size-11 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="size-11 shrink-0 rounded-xl bg-card"
                    />
                  )}

                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="title-5 truncate text-font-1">
                      {candidate.title}
                    </span>
                    <span className="body-7 text-font-disabled">
                      {t("otherRooms", { count: candidate.otherRoomCount })}
                    </span>
                  </div>

                  <div className="flex shrink-0 gap-1" role="group">
                    {(["KEEP", "DELETE"] as const).map((option) => {
                      const isSelected = choice === option;
                      const isDisabled = option === "KEEP" && !keepAllowed;

                      return (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={isSelected}
                          disabled={isDisabled}
                          onClick={() => onChoose(candidate.universeId, option)}
                          className={cn(
                            "body-6 rounded-lg px-3 py-1.5 transition-colors",
                            isSelected
                              ? "bg-brand-opacity-2 text-brand"
                              : "bg-card text-font-2 hover:bg-card-hover",
                            isDisabled && "cursor-not-allowed opacity-40",
                          )}
                        >
                          {option === "KEEP" ? t("keep") : t("delete")}
                        </button>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>

          {keepAllowed &&
            candidates.some((candidate) => !decisions[candidate.universeId]) && (
              <p role="status" className="body-7 text-font-disabled">
                {t("chooseAll")}
              </p>
            )}
        </div>
      )}

      {hasKeep && consent && (
        <div className="flex flex-col gap-2">
          <h3 className="title-5 text-font-1">{t("consentTitle")}</h3>
          <div
            tabIndex={0}
            className="body-7 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-xl bg-darkest p-3 text-font-2"
          >
            {consent.content}
          </div>
          <CheckRow
            checked={isConsentChecked}
            label={t("consentAgree")}
            onToggle={onConsentChange}
          />
        </div>
      )}

      {hasKeep && preview.ageAttestationRequired && (
        <CheckRow
          checked={isAgeAttested}
          label={t("ageAttest")}
          onToggle={onAgeAttestChange}
        />
      )}

      {deletions.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="title-5 text-font-1">{t("deletionsTitle")}</h3>
          <ul className="flex flex-col gap-1">
            {deletions.map((deletion) => (
              <li
                key={deletion.universeId}
                className="body-6 flex items-baseline justify-between gap-3 rounded-xl bg-darkest px-3 py-2"
              >
                <span className="min-w-0 truncate text-font-1">
                  {deletion.title}
                </span>
                <span className="shrink-0 text-font-disabled">
                  {t(`reason${deletion.reason}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default HandoverSection;
