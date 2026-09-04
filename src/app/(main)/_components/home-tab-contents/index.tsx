"use client";

import New from "@/icons/New";
import { useTranslations } from "next-intl";
import React from "react";
import CharacterShowcase from "@/components/character/CharacterShowcase";
import CharacterExperience from "./_components/character-experience";
import CharacterCreateBanner from "../CharacterCreateBanner";
import { useTodayPickQuery } from "@/api/home/getTodayPick";
import { useUserRecommendQuery } from "@/api/home/getUserRecommend";
import { useAssetPreviewQuery } from "@/api/home/getAssetPreview";
import { usePopularTagQuery } from "@/api/home/getPopularTag";
import { useNewWorkQuery } from "@/api/home/getNewWork";
import { useAuthStore } from "@/store/useAuthStore";

const HomeTabContents = () => {
  // 홈 탭 언어는 설정 변경 직후 바로 반영되어야 하므로 클라이언트 번역 컨텍스트를 사용합니다.
  const t = useTranslations("home");
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  // 로딩 여부는 데이터를 가져오는 이곳만 정확히 알 수 있으므로
  // CharacterShowcase 에 그대로 내려 준다.
  const { data: todayPickList, isPending: isTodayPickPending } =
    useTodayPickQuery();
  const { data: userRecommendList, isLoading: isUserRecommendPending } =
    useUserRecommendQuery();
  const { data: assetPreviewList, isPending: isAssetPreviewPending } =
    useAssetPreviewQuery();
  const { data: popularTagList, isPending: isPopularTagPending } =
    usePopularTagQuery();
  const { data: newWorkList, isPending: isNewWorkPending } =
    useNewWorkQuery();

  const todayPickCharArray = (todayPickList ?? []).map((item) => ({
    name: item.title,
    chatCount: item.chatCount,
    dec: item.description,
    img: item.images,
    creatorName: item.creator.nickname,
    isNew: item.isNew,
    isOfficial: item.isOfficial,
  }));

  const userRecommendCharArray = (userRecommendList ?? []).map((item) => ({
    name: item.title,
    chatCount: item.chatCount,
    dec: item.description,
    img: item.images,
    creatorName: item.creator?.nickname,
    isNew: item.isNew,
    isOfficial: item.isOfficial,
  }));

  const assetPreviewCharArray = (assetPreviewList ?? []).map((item) => ({
    name: item.title,
    chatCount: item.chatCount,
    dec: item.description,
    img: item.images,
    isNew: item.isNew,
    isOfficial: item.isOfficial,
  }));

  const popularTagCharArray = (popularTagList ?? []).map((item) => ({
    name: item.title,
    chatCount: item.chatCount,
    dec: item.description,
    img: item.images,
    creatorName: item.creator.nickname,
    isNew: item.isNew,
    isOfficial: item.isOfficial,
  }));

  const newWorkCharArray = (newWorkList ?? []).map((item) => ({
    name: item.title,
    chatCount: item.chatCount,
    dec: item.description,
    img: item.images,
    creatorName: item.creator.nickname,
  }));

  return (
    <article className="flex flex-col gap-12 mt-6">
      {/* 오늘의 PICK 섹션 */}
      <CharacterShowcase
        charArray={todayPickCharArray}
        isLoading={isTodayPickPending}
        title={t("todayPick")}
        allViewLink=""
        cardSize="S"
        columnGap={16}
        layout="carousel"
      />

      {/* 플랫의 공식 캐릭터 맛보기 섹션 */}
      <CharacterExperience />

      {/* 인기 태그 캐릭터 모음 섹션 */}
      <CharacterShowcase
        charArray={popularTagCharArray}
        isLoading={isPopularTagPending}
        title={t("popularTagCollection")}
        cardSize="S"
        limit={12}
        columnGap={16}
        rowGap={28}
      />

      {/* 상황 에셋이 많은 캐릭터 미리보기 섹션. 카드가 한 줄→여러 줄로 바뀌는 폭
          기준(CARD_MIN_WIDTH.L)을 이 섹션만 1/3 줄여(2/3만 남김), 더 좁은 폭에서도
          3장이 한 줄에 유지되도록 합니다. */}
      <CharacterShowcase
        charArray={assetPreviewCharArray}
        isLoading={isAssetPreviewPending}
        title={t("popularCharacterPreview")}
        cardSize="L"
        limit={3}
        className="[--card-min-width:259.113px]"
      />

      {/* 최근 소문나기 시작한 신작 섹션 */}
      <CharacterShowcase
        charArray={newWorkCharArray}
        isLoading={isNewWorkPending}
        title={t("recentNewCharacters")}
        allViewLink="new"
        cardSize="M"
        limit={10}
        TitleLogo={<New className="w-4.5 h-4.5" />}
        columnGap={16}
        rowGap={28}
      />

      {/* (유저이름)님을 위한 추천 섹션. 로그인 필수 API라 비로그인 상태에선 렌더링하지 않는다. */}
      {isLoggedIn && (
        <CharacterShowcase
          charArray={userRecommendCharArray}
          isLoading={isUserRecommendPending}
          title={t("recommendationForYou")}
          allViewLink="asf"
          cardSize="S"
          limit={24}
          columnGap={16}
          rowGap={28}
        />
      )}

      <CharacterCreateBanner />
    </article>
  );
};

export default HomeTabContents;
