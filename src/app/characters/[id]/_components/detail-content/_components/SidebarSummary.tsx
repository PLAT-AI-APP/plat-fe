"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useUnFollowMutation } from "@/api/follow/deleteFollow";
import { useFollowMutation } from "@/api/follow/postFollow";
import ActiveButton from "@/components/ActiveButton";
import { ChatFill, Gear } from "@/icons";
import { cn, formatStatCount } from "@/lib/utils";
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = useUserStore((state) => state.user?.id);
  const creatorId = character.creator.id;
  const canUseCreatorActions = Boolean(creatorId);
  // TODO: 상세 조회 응답에 creatorId 또는 editable 필드가 추가되면 수정 버튼 노출 조건을 연결합니다.
  const isCreator = Boolean(userId && creatorId && userId === creatorId);
  const [optimisticIsFollowingCreator, setOptimisticIsFollowingCreator] =
    useState<boolean | null>(null);
  const { mutate: follow, isPending: isFollowMutating } = useFollowMutation();
  const { mutate: unFollow, isPending: isUnFollowMutating } =
    useUnFollowMutation();
  const isFollowPending = isFollowMutating || isUnFollowMutating;
  const isFollowingCreator =
    optimisticIsFollowingCreator ?? character.creator.isFollowing;

  const invalidateFollowQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["get-universe-detail", character.characterId],
    });
    if (creatorId) {
      queryClient.invalidateQueries({
        queryKey: ["get-follow-count", creatorId],
      });
    }
    queryClient.invalidateQueries({ queryKey: ["get-following-list"] });
    queryClient.invalidateQueries({ queryKey: ["get-follower-list"] });
  };

  const handleCreatorFollowToggle = () => {
    if (isFollowPending || !creatorId) return;

    if (isFollowingCreator) {
      setOptimisticIsFollowingCreator(false);
      unFollow(
        { userId: creatorId },
        {
          onSuccess: invalidateFollowQueries,
          onError: () => setOptimisticIsFollowingCreator(true),
        },
      );
      return;
    }

    setOptimisticIsFollowingCreator(true);
    follow(
      { userId: creatorId },
      {
        onSuccess: invalidateFollowQueries,
        onError: () => setOptimisticIsFollowingCreator(false),
      },
    );
  };

  return (
    <aside className="flex w-full shrink-0 flex-col gap-5 self-start lg:sticky lg:top-0 lg:w-[389px]">
      <section className="flex flex-col gap-4">
        {isCreator && (
          <button
            type="button"
            onClick={() =>
              router.push(
                `/character-creat?universeId=${character.characterId}`,
              )
            }
            className="body-4 flex w-fit items-center gap-1 rounded-xl border border-btn-selected bg-darker px-3 py-2 text-font-2 transition-colors hover:bg-card"
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
            sizes="(max-width: 1023px) 100vw, 320px"
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

      <div className="flex gap-2 overflow-hidden">
        {character.images.slice(0, 5).map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => onSelectImage(index)}
            className="relative size-[73px] shrink-0 overflow-hidden rounded-lg transition-opacity hover:opacity-80"
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
              sizes="64px"
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
                className="avatar-img size-12"
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
            {!isCreator && canUseCreatorActions && (
              <button
                type="button"
                onClick={handleCreatorFollowToggle}
                disabled={isFollowPending}
                className={cn(
                  "title-6 rounded-full px-3 py-1 transition-colors",
                  isFollowingCreator
                    ? "bg-main text-font-1"
                    : "bg-font-1 text-dark",
                  isFollowPending && "pending-state",
                )}
              >
                {isFollowingCreator ? t("following") : t("follow")}
              </button>
            )}
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
