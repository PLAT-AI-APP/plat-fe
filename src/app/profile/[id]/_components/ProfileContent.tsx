"use client";

import React, { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useLikedUniversesInfiniteQuery } from "@/api/user/getLikedUniverses";
import CharacterShowcase from "@/components/character/CharacterShowcase";
import CharacterSortPopover, {
  CharacterSortOption,
} from "@/components/popover/CharacterSortPopover";
import useToggle from "@/hooks/useToggle";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useTabUnderline } from "@/hooks/useTabUnderline";
import { Sort } from "@/icons";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import Header from "./Header";
import { SPRING_SNAPPY } from "@/constants/motion";

type ProfileTab = "character" | "wish";

const CharArray = [
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "매일 학교에서 일어나는 소소한 일상을 함께 이야기해요.",
    tag: ["학교", "일상", "친구"],
    img: "https://picsum.photos/200/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "장난스럽지만 속은 다정한 캐릭터와 대화를 나눠보세요.",
    tag: ["학교", "일상", "친구", "로맨스"],
    img: "https://picsum.photos/201/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "무심한 듯 챙겨주는 친구와 이어지는 이야기입니다.",
    tag: ["학교", "일상", "친구", "청춘"],
    img: "https://picsum.photos/202/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상"],
    img: "https://picsum.photos/203/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "가볍게 대화하기 좋은 캐릭터입니다.",
    tag: ["학교", "일상", "친구"],
    img: "https://picsum.photos/204/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "친구처럼 편하게 말을 걸어주는 캐릭터입니다.",
    tag: ["학교", "일상", "친구"],
    img: "https://picsum.photos/205/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "짧은 대화에도 자연스럽게 이어지는 캐릭터입니다.",
    tag: ["학교", "일상", "친구"],
    img: "https://picsum.photos/206/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "학교생활의 여러 순간을 함께 나누는 캐릭터입니다.",
    tag: ["학교", "일상"],
    img: "https://picsum.photos/207/300",
  },
];

const CHARACTER_TAB = {
  key: "character" as const,
  labelKey: "profile.characterTab",
};

/** 남의 찜 목록을 주는 API 가 없어서 찜 탭은 내 프로필에서만 띄웁니다. */
const WISH_TAB = { key: "wish" as const, labelKey: "profile.wishTab" };

/**
 * 탭 자리표시자. 폭은 실제 라벨(캐릭터 · 구분자 · 찜)의 글자 수에, 높이(h-6)는 활성 탭의
 * 글자 높이(title-3, 24px)에 맞춥니다 — 자리표시자가 더 낮으면 탭이 그려지는 순간 줄이 튑니다.
 */
const TAB_SKELETON_WIDTHS = ["w-12", "w-2", "w-6"];

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

  const isOwnProfile = Boolean(myUserId && myUserId === id);
  const [activeTab, setActiveTab] = useState<ProfileTab>("character");
  const [sort, setSort] = useState<CharacterSortOption>("latest");
  const { isOpen, toggle } = useToggle();
  const triggerRef = useRef<HTMLButtonElement>(null);

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

  const likedCards = useMemo(
    () =>
      (likedData?.pages.flatMap((page) => page.content) ?? []).map((card) => ({
        name: card.title,
        chatCount: card.chatCount,
        dec: card.description,
        img: card.images,
        creatorName: card.creator.nickname,
        isNew: card.isNew,
        isOfficial: card.isOfficial,
      })),
    [likedData],
  );

  const { targetRef } = useIntersectionObserver({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    enabled: isWishTab,
  });

  const displayArray = isWishTab ? likedCards : CharArray;
  // 찜은 서버가 전체 개수를 세어 주므로 지금 받아 둔 페이지 수가 아니라 그 값을 씁니다.
  const displayCount = isWishTab
    ? (likedData?.pages[0]?.page.totalElements ?? 0)
    : displayArray.length;

  return (
    <article className="@container mx-auto flex w-[1200px] max-w-full flex-col gap-10 pt-6 pb-10">
      <Header userId={id} />

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
                  <React.Fragment key={key}>
                    <button
                      type="button"
                      ref={(el) => setTabRef(key, el)}
                      onClick={() => setActiveTab(key)}
                      className={cn(
                        "flex w-fit items-center justify-center px-5 py-2.5 text-center",
                        currentTab === key
                          ? "title-3 text-font-1"
                          : "body-2 text-font-disabled",
                      )}
                    >
                      {t(labelKey)}
                    </button>
                    {key === "character" && (
                      <button
                        type="button"
                        disabled
                        className="body-2 flex w-fit cursor-default items-center justify-center px-5 py-2.5 text-center text-font-disabled"
                      >
                        -
                      </button>
                    )}
                  </React.Fragment>
                ))}

            {/* 활성 표시(motion.span)와 같은 bottom-0/h-0.5 박스를 써서, 서로 다른 두께의
                border가 겹쳐 어긋나 보이지 않게 기준선도 같은 방식으로 그립니다. */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-card-hover" />

            {/* 탭이 아직 없으면 밑줄이 0 폭에서 미끄러져 들어옵니다. 잴 대상이 생긴 뒤에 그립니다. */}
            {hasHydrated && (
              <motion.span
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
            <div
              id="sort-filter-container"
              className={cn("relative", isWishTab && "hidden")}
            >
              <button
                ref={triggerRef}
                type="button"
                onClick={toggle}
                className="title-5 flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-font-2 transition-colors duration-200 hover:bg-btn-hover hover:text-font-1"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
              >
                <Sort className="size-4" />
                {t(`profile.sort.${sort}`)}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <CharacterSortPopover
                    onChange={setSort}
                    onClose={toggle}
                    triggerRef={
                      triggerRef as React.RefObject<HTMLButtonElement>
                    }
                    value={sort}
                  />
                )}
              </AnimatePresence>
            </div>
          </header>
        </div>

        <section
          id="character-list-section"
          className="flex h-auto w-full flex-col justify-center gap-4"
        >
          <CharacterShowcase
            charArray={displayArray}
            cardSize="S"
            rowGap={28}
            columnGap={16}
            gridFillMode="auto-fill"
            isLoading={isWishTab && isLikedLoading}
            isError={isWishTab && isLikedError}
            error={likedError}
            onRetry={refetchLiked}
          />

          {isWishTab && hasNextPage && (
            <div ref={targetRef} aria-hidden="true" className="h-px" />
          )}
        </section>
      </section>
    </article>
  );
}
