"use client";

import { useTranslations } from "next-intl";
import type { ComponentType } from "react";
import ResourceImage from "@/components/ResourceImage";
import { Check, ChatFill, Trash } from "@/icons";
import type { IconProps } from "@/icons";
import { toImageVariantUrl } from "@/lib/file";
import { cn, formatWithCommas } from "@/lib/utils";
import type { WithdrawalCandidate, WithdrawalChoice } from "@/type/withdrawal";

interface ChoiceTileProps {
  value: WithdrawalChoice;
  icon: ComponentType<IconProps>;
  title: string;
  caption: string;
  isSelected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

/** 남기기·삭제 한 칸. 아이콘·제목·결과 한 줄로, 고르기 전에 무엇이 일어나는지 보이게 한다. */
const ChoiceTile = ({
  value,
  icon: Icon,
  title,
  caption,
  isSelected,
  disabled,
  onSelect,
}: ChoiceTileProps) => {
  const isKeep = value === "KEEP";

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-label={`${title} · ${caption}`}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "group flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        isSelected
          ? isKeep
            ? "border-brand bg-linear-to-br from-brand-opacity-2 to-brand-opacity-3 shadow-[0_10px_30px_-14px_var(--color-brand)]"
            : "border-font-2/50 bg-card"
          : "border-main bg-dark enabled:hover:border-font-disabled enabled:hover:bg-card",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
          isSelected
            ? isKeep
              ? "bg-brand text-on-brand"
              : "bg-btn-selected text-font-1"
            : "bg-card text-font-2 group-enabled:group-hover:text-font-1",
        )}
      >
        <Icon size={18} aria-hidden="true" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="title-5 text-font-1">{title}</span>
        <span className="body-7 break-keep text-font-2">{caption}</span>
      </span>

      {/* 라디오 표시. 고르면 채워지고 체크가 들어간다. */}
      <span
        aria-hidden="true"
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          isSelected
            ? isKeep
              ? "border-brand bg-brand text-on-brand"
              : "border-font-1 bg-font-1 text-dark"
            : "border-font-disabled",
        )}
      >
        {isSelected && <Check size={12} />}
      </span>
    </button>
  );
};

interface HandoverCandidateCardProps {
  candidate: WithdrawalCandidate;
  choice?: WithdrawalChoice;
  canKeep: boolean;
  onChange: (universeId: string, choice: WithdrawalChoice) => void;
}

/**
 * 대화 중인 다른 유저가 있는 캐릭터 한 편. 지금도 대화가 이어지고 있다는 것을 먼저 보이고,
 * 남기기·삭제를 같은 무게의 두 칸으로 고르게 한다(어느 쪽도 미리 고르지 않는다).
 */
const HandoverCandidateCard = ({
  candidate,
  choice,
  canKeep,
  onChange,
}: HandoverCandidateCardProps) => {
  const t = useTranslations("withdrawalPage.characters");

  return (
    <li
      className={cn(
        "flex flex-col gap-4 rounded-3xl border bg-darkest p-4 transition-colors duration-200 sm:p-5",
        choice === "KEEP" ? "border-brand/60" : "border-main",
      )}
    >
      <div className="flex items-center gap-4">
        {candidate.profileImageUrl ? (
          <ResourceImage
            src={toImageVariantUrl(candidate.profileImageUrl, "sq140")}
            alt=""
            width={72}
            height={72}
            unoptimized
            className="size-18 shrink-0 rounded-2xl object-cover ring-1 ring-main"
          />
        ) : (
          <span aria-hidden="true" className="size-18 shrink-0 rounded-2xl bg-card" />
        )}

        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="title-3 truncate text-font-1">{candidate.title}</p>
          <p className="body-6 flex items-center gap-2 text-brand">
            {/* 지금도 이어지는 대화. 남길지 정하는 이유가 여기 있다. */}
            <span aria-hidden="true" className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-brand" />
            </span>
            {t("talking", { count: formatWithCommas(candidate.otherRoomCount) })}
          </p>
        </div>
      </div>

      <div role="radiogroup" aria-label={candidate.title} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <ChoiceTile
          value="KEEP"
          icon={ChatFill}
          title={t("keep")}
          caption={canKeep ? t("keepCaption") : t("keepUnavailableShort")}
          isSelected={choice === "KEEP"}
          disabled={!canKeep}
          onSelect={() => onChange(candidate.universeId, "KEEP")}
        />
        <ChoiceTile
          value="DELETE"
          icon={Trash}
          title={t("delete")}
          caption={t("deleteCaption")}
          isSelected={choice === "DELETE"}
          onSelect={() => onChange(candidate.universeId, "DELETE")}
        />
      </div>
    </li>
  );
};

export default HandoverCandidateCard;
