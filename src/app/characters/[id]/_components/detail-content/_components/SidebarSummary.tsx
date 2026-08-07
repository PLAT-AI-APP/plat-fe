"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import ActiveButton from "@/components/ActiveButton";
import { ChatFill, Gear } from "@/icons";
import { formatStatCount } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import { CharacterDetail } from "@/type/character";

interface SidebarSummaryProps {
  character: CharacterDetail;
  onSelectImage: (index: number) => void;
  onStartChat: () => void;
}

const SidebarSummary = ({
  character,
  onSelectImage,
  onStartChat,
}: SidebarSummaryProps) => {
  const t = useTranslations("characterDetail");
  const userId = useUserStore((state) => state.user?.id);
  const isCreator = userId === character.creator.id;

  return (
    <aside className="sticky top-0 flex w-[389px] shrink-0 flex-col gap-5 self-start">
      <section className="flex flex-col gap-4">
        {isCreator && (
          <button
            type="button"
            className="body-4 flex w-fit items-center gap-1 rounded-xl border border-btn-selected bg-bg-darker px-3 py-2 text-font-2 transition-colors hover:bg-card"
          >
            <Gear className="size-5 shrink-0" aria-hidden="true" />
            {t("editCharacter")}
          </button>
        )}

        {!isCreator && character.isOfficial && (
          <span className="body-6 w-fit rounded-xl bg-brand/10 px-3 py-2 text-brand-dark">
            {t("officialCharacter")}
          </span>
        )}

        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-card">
          <Image
            src={character.mainImage}
            alt={t("profileAlt", { name: character.title })}
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="heading-1 text-font-1">{character.title}</h1>
          <p className="body-1 text-font-1">{character.introduce}</p>
          <div className="flex flex-col gap-0.5">
            <div className="body-3 flex flex-wrap gap-x-2 gap-y-1 text-font-2">
              {character.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
            <span className="body-4 flex items-center gap-1 text-font-2">
              <ChatFill className="size-4" />
              {formatStatCount(character.chatCount)}
            </span>
          </div>
        </div>
      </section>

      <div className="flex gap-[7px] overflow-hidden">
        {character.images.slice(0, 5).map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => onSelectImage(index)}
            className="relative size-[73px] shrink-0 overflow-hidden rounded-lg"
            aria-label={t("previewImageLabel", {
              title: character.title,
              index: index + 1,
            })}
          >
            <Image
              src={image.url}
              alt={t("previewImageLabel", {
                title: character.title,
                index: index + 1,
              })}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <ActiveButton
        text={t("chatStart")}
        isActive
        type="button"
        onClick={onStartChat}
        className="h-[52px] rounded-2xl bg-brand/20 text-brand-dark hover:bg-brand/25"
      />

      <section className="rounded-2xl bg-btn-hover px-5 py-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Image
                src={character.creator.profileImage}
                alt={t("creatorProfileAlt", {
                  nickname: character.creator.nickname,
                })}
                width={48}
                height={48}
                className="size-12 rounded-full object-cover"
              />
              <div className="flex min-w-0 flex-col gap-1">
                <p className="title-4 truncate text-font-1">
                  {character.creator.nickname}
                </p>
                <p className="body-5 text-font-2">
                  {t("followingCount", {
                    count: character.creator.followingCount,
                  })}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="title-6 rounded-full bg-border-main px-3 py-1 text-font-1"
            >
              {character.creator.isFollowing ? t("following") : t("follow")}
            </button>
          </div>

          <div className="body-5 flex gap-4 text-font-2">
            <span>{t("createdAt", { date: character.createdAt })}</span>
            <span>{t("updatedAt", { date: character.updatedAt })}</span>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default SidebarSummary;
