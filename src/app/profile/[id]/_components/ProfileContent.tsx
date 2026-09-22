"use client";

import React, { useMemo, useState, useSyncExternalStore } from "react";
import { m } from "framer-motion";
import { useTranslations } from "next-intl";
import { useLikedUniversesInfiniteQuery } from "@/api/user/getLikedUniverses";
import { useUserProfileQuery } from "@/api/user/getUserProfile";
import { useUserUniversesInfiniteQuery } from "@/api/user/getUserUniverses";
import CharacterShowcase from "@/components/character/CharacterShowcase";
import SortFilter from "@/components/character/SortFilter";
import { CharacterSortOption } from "@/components/popover/CharacterSortPopover";
import { ErrorState } from "@/components/state";
import { useInfiniteList } from "@/hooks/data/useInfiniteList";
import { useTabUnderline } from "@/hooks/dom/useTabUnderline";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import CreatedEmptyState from "./CreatedEmptyState";
import Header from "./Header";
import WishlistEmptyState from "./WishlistEmptyState";
import { SPRING_SNAPPY } from "@/constants/motion";

type ProfileTab = "character" | "wish";

const CHARACTER_TAB = {
  key: "character" as const,
  labelKey: "profile.characterTab",
};

/** 남의 찜 목록을 주는 API 가 없어서 찜 탭은 내 프로필에서만 띄웁니다. */
const WISH_TAB = { key: "wish" as const, labelKey: "profile.wishTab" };

/**
 * 탭 자리표시자. 폭은 실제 라벨(캐릭터 · 찜)의 글자 수에, 높이(h-6)는 활성 탭의
 * 글자 높이(title-3, 24px)에 맞춥니다 — 자리표시자가 더 낮으면 탭이 그려지는 순간 줄이 튑니다.
 */
const TAB_SKELETON_WIDTHS = ["w-12", "w-6"];

export default function ProfileContent({ id }: { id: string }) {
  const t = useTranslations();
  const myUserId = useUserStore((state) => state.user?.id);

  /*
   * 로그인 정보는 persist 스토어라 첫 렌더에는 아직 비어 있습니다. 그때 내 프로필인지 단정하면
   * 찜 탭이 한 박자 늦게 끼어듭니다. 하이드레이션은 React 밖에서 일어나는 일이라
   * 스토어를 외부 소스로 구독합니다 — 서버 스냅샷을 false 로 줘서 첫 렌더도 어긋나지 않습니다.
   */
  const hasHydrated = useSyncExternalStore(
    useUserStore.persist.onFinishHydration,
    () => useUserStore.persist.hasHydrated(),
    () => false,
  );

  const {
    data: profile,
    isError: isProfileError,
    error: profileError,
    refetch: refetchProfile,
  } = useUserProfileQuery(id);

  const isOwnProfile = Boolean(myUserId && myUserId === id);
  const [activeTab, setActiveTab] = useState<ProfileTab>("character");
  const [sort, setSort] = useState<CharacterSortOption>("latest");

  const tabItems = isOwnProfile ? [CHARACTER_TAB, WISH_TAB] : [CHARACTER_TAB];
  // 남의 프로필을 보다가 찜 탭이 사라지면 아무 탭도 선택되지 않은 채로 남습니다.
  const currentTab: ProfileTab =
    activeTab === "wish" && !isOwnProfile ? "character" : activeTab;
  const isWishTab = currentTab === "wish";

  const {
    containerRef: tabNavRef,
    setTabRef,
    rect: underlineRect,
  } = useTabUnderline(currentTab);

  const {
    data: likedData,
    isLoading: isLikedLoading,
    isError: isLikedError,
    error: likedError,
    refetch: refetchLiked,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLikedUniversesInfiniteQuery(isWishTab && isOwnProfile);

  const {
    items: likedItems,
    totalCount: likedTotalCount,
    sentinelRef: likedSentinelRef,
  } = useInfiniteList(
    { data: likedData, hasNextPage, isFetchingNextPage, fetchNextPage },
    { enabled: isWishTab },
  );

  const likedCards = useMemo(
    () =>
      likedItems.map((card) => ({
        id: card.universeId,
        name: card.title,
        chatCount: card.chatCount,
        dec: card.description,
        img: card.images,
        creatorName: card.creator.nickname,
        isNew: card.isNew,
        isOfficial: card.isOfficial,
      })),
    [likedItems],
  );

  const {
    data: createdData,
    isLoading: isCreatedLoading,
    isError: isCreatedError,
    error: createdError,
    refetch: refetchCreated,
    fetchNextPage: fetchNextCreatedPage,
    hasNextPage: hasNextCreatedPage,
    isFetchingNextPage: isFetchingNextCreatedPage,
  } = useUserUniversesInfiniteQuery(id, !isWishTab && !isProfileError);

  const {
    items: createdItems,
    totalCount: createdTotalCount,
    sentinelRef: createdSentinelRef,
  } = useInfiniteList(
    {
      data: createdData,
      hasNextPage: hasNextCreatedPage,
      isFetchingNextPage: isFetchingNextCreatedPage,
      fetchNextPage: fetchNextCreatedPage,
    },
    { enabled: !isWishTab },
  );

  const createdCards = useMemo(
    () =>
      createdItems.map((card) => ({
        id: card.universeId,
        name: card.title,
        chatCount: card.chatCount,
        dec: card.description,
        img: card.images,
        creatorName: card.creator.nickname,
        isNew: card.isNew,
        isOfficial: card.isOfficial,
      })),
    [createdItems],
  );

  const displayArray = isWishTab ? likedCards : createdCards;
  // 둘 다 서버가 전체 개수를 세어 주므로 지금 받아 둔 페이지 수가 아니라 그 값을 씁니다.
  const displayCount = isWishTab ? (likedTotalCount ?? 0) : (createdTotalCount ?? 0);
  const isLoading = isWishTab ? isLikedLoading : isCreatedLoading;
  const isError = isWishTab ? isLikedError : isCreatedError;
  const error = isWishTab ? likedError : createdError;
  const onRetry = isWishTab ? refetchLiked : refetchCreated;
  const sentinelRef = isWishTab ? likedSentinelRef : createdSentinelRef;
  const hasNextPageForTab = isWishTab ? hasNextPage : hasNextCreatedPage;
  // 불러오지 못한 것과 진짜로 찜한 게 없는 것은 다르다 — 실패는 CharacterShowcase의
  // 에러 표시에 맡기고, 정말 0개일 때만 태그 탐색을 안내한다.
  const isWishEmpty =
    isWishTab && !isLikedLoading && !isLikedError && likedCards.length === 0;
  // 캐릭터 탭도 마찬가지로 정말 0개일 때만. CharacterShowcase 는 빈 목록이면 아무것도 그리지 않아
  // 작품이 없는 프로필이 제목과 개수(0)만 남은 채 비어 보였다.
  const isCreatedEmpty =
    !isWishTab &&
    !isCreatedLoading &&
    !isCreatedError &&
    createdCards.length === 0;

  // 없는 유저(404)의 프로필에 빈 작품 목록만 덩그러니 그리면 "작품이 없는 유저"로 오해한다.
  // 헤더 자리만이 아니라 페이지 전체를 실패 표시로 바꾼다.
  if (isProfileError) {
    return (
      <article className="mx-auto flex w-full max-w-(--content-max-width) flex-col pt-6 pb-10">
        <ErrorState error={profileError} onRetry={refetchProfile} />
      </article>
    );
  }

  return (
    <article className="mx-auto flex w-full max-w-(--content-max-width) flex-col gap-10 pt-6 pb-10">
      <Header userId={id} profile={profile} />

      <section
        id="profile-content"
        className="flex min-w-0 flex-1 flex-col gap-3.5"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <nav
            ref={tabNavRef as React.RefObject<HTMLElement>}
            className="relative flex w-full items-end"
          >
            {!hasHydrated
              ? TAB_SKELETON_WIDTHS.map((width, index) => (
                  <div
                    key={index}
                    className="flex w-fit items-center justify-center px-5 py-2.5"
                  >
                    <div className={cn("skeleton h-6 rounded-full", width)} />
                  </div>
                ))
              : tabItems.map(({ key, labelKey }) => (
                  <button
                    key={key}
                    type="button"
                    ref={(el) => setTabRef(key, el)}
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      "flex w-fit items-center justify-center px-5 py-2.5 text-center",
                      currentTab === key
                        ? "title-3 text-font-1"
                        : "body-3 text-font-disabled",
                    )}
                  >
                    {t(labelKey)}
                  </button>
                ))}

            {/* 활성 표시(motion.span)와 같은 bottom-0/h-0.5 박스를 써서, 서로 다른 두께의
                border가 겹쳐 어긋나 보이지 않게 기준선도 같은 방식으로 그립니다. */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-card-hover" />

            {/* 탭이 아직 없으면 밑줄이 0 폭에서 미끄러져 들어옵니다. 잴 대상이 생긴 뒤에 그립니다. */}
            {hasHydrated && (
              <m.span
                className="absolute bottom-0 h-0.5 bg-brand"
                initial={false}
                animate={{ x: underlineRect.left, width: underlineRect.width }}
                transition={SPRING_SNAPPY}
              />
            )}
          </nav>

          <header className="flex w-full items-center justify-between">
            <div className="title-5 flex items-center gap-1 text-font-2">
              <span>{t("profile.worksList")}</span>
              <span>{displayCount}</span>
            </div>

            {/* 찜 목록은 서버가 찜한 시각 역순 하나만 지원합니다. 고를 수 없는 정렬을
                띄워 두면 눌러도 아무 일이 없어 고장으로 보입니다. */}
            <div className={cn(isWishTab && "hidden")}>
              <SortFilter currentSort={sort} onChange={setSort} />
            </div>
          </header>
        </div>

        <section
          id="character-list-section"
          className="flex h-auto w-full flex-col justify-center gap-4"
        >
          {isWishEmpty ? (
            <WishlistEmptyState />
          ) : isCreatedEmpty ? (
            // 본인인지는 persist 스토어가 복원된 뒤에야 알 수 있다. 그 전에 그리면
            // 본인 프로필에 "남의 프로필" 안내가 잠깐 보였다가 바뀐다.
            hasHydrated && <CreatedEmptyState isOwnProfile={isOwnProfile} />
          ) : (
            <CharacterShowcase
              charArray={displayArray}
              cardSize="S"
              isLoading={isLoading}
              isError={isError}
              error={error}
              onRetry={onRetry}
              // 찜 목록은 남의 캐릭터일 수도 있어 수정 배지를 내 캐릭터 탭에만 띄운다.
              isEditable={isOwnProfile && !isWishTab}
            />
          )}

          {hasNextPageForTab && (
            <div ref={sentinelRef} aria-hidden="true" className="h-px" />
          )}
        </section>
      </section>
    </article>
  );
}
