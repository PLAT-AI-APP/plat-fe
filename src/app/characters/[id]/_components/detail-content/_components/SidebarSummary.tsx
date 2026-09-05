"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  useDeleteUniverseLikeMutation,
  usePostUniverseLikeMutation,
} from "@/api/universe/postUniverseLike";
import ActiveButton from "@/components/ActiveButton";
import { ChatFill, Gear, Heart, HeartFill } from "@/icons";
import { cn, formatStatCount } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { useUserStore } from "@/store/useUserStore";
import { CharacterDetail } from "@/type/character";
import { useFollowToggle } from "@/features/follow/useFollowToggle";

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
  const userId = useUserStore((state) => state.user?.id);
  const creatorId = character.creator.id;
  const canUseCreatorActions = Boolean(creatorId);
  // TODO: 상세 조회 응답에 creatorId 또는 editable 필드가 추가되면 수정 버튼 노출 조건을 연결합니다.
  const isCreator = Boolean(userId && creatorId && userId === creatorId);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const openModal = useModalStore((state) => state.openModal);
  const { mutate: likeUniverse, isPending: isLikeMutating } =
    usePostUniverseLikeMutation();
  const { mutate: unlikeUniverse, isPending: isUnlikeMutating } =
    useDeleteUniverseLikeMutation();
  const isLikePending = isLikeMutating || isUnlikeMutating;

  /* 찜은 로그인이 있어야 합니다. 조용히 무시하면 눌러도 아무 일이 없어 보이므로 로그인 창을 바로 엽니다. */
  const handleToggleLike = () => {
    if (isLikePending) return;

    if (!isLoggedIn) {
      openModal("LOGIN", { triggerRef: undefined });
      return;
    }

    const variables = { universeId: character.characterId };
    if (character.liked) unlikeUniverse(variables);
    else likeUniverse(variables);
  };

  const {
    isFollowing: isFollowingCreator,
    isPending: isFollowPending,
    toggle: handleCreatorFollowToggle,
  } = useFollowToggle({
    userId: creatorId ?? "",
    isFollowing: character.creator.isFollowing,
    // 상세 응답에 creator.isFollowing 이 함께 실려 오므로 같이 다시 받는다.
    extraInvalidateKeys: [["get-universe-detail", character.characterId]],
  });

  return (
    <aside className="flex w-full shrink-0 flex-col gap-5 self-start min-[900px]:sticky min-[900px]:top-0 min-[900px]:w-[389px]">
      <section className="flex flex-col gap-4">
        {isCreator && (
          <button
            type="button"
            onClick={() =>
              router.push(
                `/character-creat?universeId=${character.characterId}`,
              )
            }
            className="body-5 flex w-fit items-center gap-1 rounded-xl border border-btn-selected bg-darker px-3 py-2 text-font-2 transition-colors hover:bg-card"
          >
            <Gear className="size-5 shrink-0" aria-hidden="true" />
            {t("editCharacter")}
          </button>
        )}

        {!isCreator && character.isOfficial && (
          <span className="body-7 w-fit rounded-xl bg-brand/10 px-3 py-2 text-brand-dark">
            {t("officialCharacter")}
          </span>
        )}

        {/* lg 미만에서는 이 열이 한 줄을 통째로 쓴다. 상한이 없으면 정사각형이 콘텐츠 폭을
            그대로 따라가 940px 화면에서 812×812 로 그려졌다. 데스크탑 열 폭이 곧 상한이다. */}
        <div className="relative aspect-square w-full max-w-[389px] overflow-hidden rounded-2xl bg-card">
          <Image
            src={character.mainImage}
            alt={t("profileAlt", { name: character.title })}
            fill
            sizes="(max-width: 420px) 100vw, 389px"
            className="object-contain"
            priority
          />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="heading-2 text-font-1">{character.title}</h1>
          <p className="body-2 text-font-1">{character.introduce}</p>
          <div className="flex flex-col gap-0.5">
            <div className="body-4 flex flex-wrap gap-x-2 gap-y-1 text-font-2">
              {character.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
            <div className="body-5 flex items-center gap-3 text-font-2">
              <span className="flex items-center gap-1">
                <ChatFill className="size-4" aria-hidden="true" />
                {formatStatCount(character.chatCount)}
              </span>
              <span className="flex items-center gap-1">
                <HeartFill className="size-4" aria-hidden="true" />
                {formatStatCount(character.likeCount)}
              </span>
            </div>
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

      <div className="flex items-stretch gap-2">
        <ActiveButton
          text={t("chatStart")}
          isActive
          type="button"
          onClick={onStartChat}
          className="h-[52px] flex-1 rounded-2xl bg-brand/20 text-brand-dark hover:bg-brand/25"
        />
        <button
          type="button"
          onClick={handleToggleLike}
          disabled={isLikePending}
          aria-pressed={character.liked}
          aria-label={character.liked ? t("unlike") : t("like")}
          title={character.liked ? t("unlike") : t("like")}
          className="flex size-[52px] shrink-0 items-center justify-center rounded-2xl bg-card text-font-2 transition-colors hover:bg-card-hover disabled:opacity-60"
        >
          {character.liked ? (
            <HeartFill className="size-5 text-brand" aria-hidden="true" />
          ) : (
            <Heart className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

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
                <p className="body-6 text-font-2">
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

          <div className="body-6 flex gap-4 text-font-2">
            <span>{t("createdAt", { date: character.createdAt })}</span>
            <span>{t("updatedAt", { date: character.updatedAt })}</span>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default SidebarSummary;
