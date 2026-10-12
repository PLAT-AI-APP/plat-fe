"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "@/icons";

/** 검수를 통과하지 못했거나 운영에서 내린 캐릭터는 상세가 열리지 않아 편집 화면으로 보낸다. */
const EDIT_ONLY_REASONS = new Set(["INACTIVE", "NOT_APPROVED", "UNDER_REVIEW"]);

interface CharacterShortcutProps {
  universeId: string;
  title: string;
  reason?: string;
}

/** 탈퇴 목록의 캐릭터 바로가기. 고르던 내용이 날아가지 않게 새 탭으로 연다. */
const CharacterShortcut = ({ universeId, title, reason }: CharacterShortcutProps) => {
  const t = useTranslations("withdrawalPage.characters");
  const href =
    reason && EDIT_ONLY_REASONS.has(reason)
      ? `/character-creat?universeId=${universeId}`
      : `/characters/${universeId}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={t("openCharacter", { title })}
      className="body-8 flex h-7 shrink-0 items-center gap-0.5 rounded-full border border-main pr-2 pl-2.5 text-font-2 transition-colors hover:bg-card hover:text-font-1"
    >
      {t("open")}
      <ArrowRight size={12} aria-hidden="true" />
    </Link>
  );
};

export default CharacterShortcut;
