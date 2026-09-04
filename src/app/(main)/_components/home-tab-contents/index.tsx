"use client";

import New from "@/icons/New";
import { useTranslations } from "next-intl";
import React from "react";
import CharacterShowcase from "../CharacterShowcase";
import CharacterExperience from "./_components/character-experience";
import CharacterCreateBanner from "../CharacterCreateBanner";
import { useTodayPickQuery } from "@/api/home/getTodayPick";
import { useUserRecommendQuery } from "@/api/home/getUserRecommend";
import { useAssetPreviewQuery } from "@/api/home/getAssetPreview";
import { usePopularTagQuery } from "@/api/home/getPopularTag";
import { useNewWorkQuery } from "@/api/home/getNewWork";

const HomeTabContents = () => {
  // 홈 탭 언어는 설정 변경 직후 바로 반영되어야 하므로 클라이언트 번역 컨텍스트를 사용합니다.
  const t = useTranslations("home");

  // 로딩·실패 여부는 데이터를 가져오는 이곳만 정확히 알 수 있으므로 CharacterShowcase 에 그대로 내려 준다.
  // isError 를 함께 넘기지 않으면 실패한 섹션이 "결과 없음"으로 조용히 사라진다.
  // 로딩은 isPending 이 아니라 isLoading 을 본다 — 로그인 전에는 비활성인 쿼리(추천)가
  // isPending 상태로 머물러, 스켈레톤이 영구히 떠 있게 된다.
  const todayPick = useTodayPickQuery();
  const userRecommend = useUserRecommendQuery();
  const assetPreview = useAssetPreviewQuery();
  const popularTag = usePopularTagQuery();
  const newWork = useNewWorkQuery();

  const todayPickCharArray = (todayPick.data ?? []).map((item) => ({
    name: item.title,
    chatCount: item.chatCount,
    dec: item.description,
    img: item.images,
    creatorName: item.creator.nickname,
    isNew: item.isNew,
    isOfficial: item.isOfficial,
  }));

  const userRecommendCharArray = (userRecommend.data ?? []).map((item) => ({
    name: item.title,
    chatCount: item.chatCount,
    dec: item.description,
    img: item.images,
    creatorName: item.creator?.nickname,
    isNew: item.isNew,
    isOfficial: item.isOfficial,
  }));

  const assetPreviewCharArray = (assetPreview.data ?? []).map((item) => ({
    name: item.title,
    chatCount: item.chatCount,
    dec: item.description,
    img: item.images,
    isNew: item.isNew,
    isOfficial: item.isOfficial,
  }));

  const popularTagCharArray = (popularTag.data ?? []).map((item) => ({
    name: item.title,
    chatCount: item.chatCount,
    dec: item.description,
    img: item.images,
    creatorName: item.creator.nickname,
    isNew: item.isNew,
    isOfficial: item.isOfficial,
  }));

  const newWorkCharArray = (newWork.data ?? []).map((item) => ({
    name: item.title,
    chatCount: item.chatCount,
    dec: item.description,
    img: item.images,
    creatorName: item.creator.nickname,
    isNew: true,
  }));

  return (
    <article className="mt-6 flex flex-col gap-12">
      {/* 오늘의 PICK — 홈의 주력 섹션이라 제목 한 단계를 올려 강조한다. 한 줄 6개. */}
      <CharacterShowcase
        charArray={todayPickCharArray}
        isLoading={todayPick.isLoading}
        isError={todayPick.isError}
        error={todayPick.error}
        onRetry={todayPick.refetch}
        title={t("todayPick")}
        emphasis="primary"
        allViewLink=""
        cardSize="S"
        columns={6}
        limit={6}
      />

      {/* 플랫의 공식 캐릭터 맛보기 섹션 */}
      <CharacterExperience />

      {/* 인기 태그 캐릭터 모음 — 한 줄 6개 × 2줄 */}
      <CharacterShowcase
        charArray={popularTagCharArray}
        isLoading={popularTag.isLoading}
        isError={popularTag.isError}
        error={popularTag.error}
        onRetry={popularTag.refetch}
        title={t("popularTagCollection")}
        cardSize="S"
        columns={6}
        limit={12}
        rowGap={28}
      />

      {/* 상황 에셋이 많은 캐릭터 미리보기 — 카드가 커서 한 줄 3개 */}
      <CharacterShowcase
        charArray={assetPreviewCharArray}
        isLoading={assetPreview.isLoading}
        isError={assetPreview.isError}
        error={assetPreview.error}
        onRetry={assetPreview.refetch}
        title={t("popularCharacterPreview")}
        cardSize="L"
        columns={3}
        limit={3}
      />

      {/* 최근 소문나기 시작한 신작 — 한 줄 5개 × 2줄 */}
      <CharacterShowcase
        charArray={newWorkCharArray}
        isLoading={newWork.isLoading}
        isError={newWork.isError}
        error={newWork.error}
        onRetry={newWork.refetch}
        title={t("recentNewCharacters")}
        allViewLink="new"
        cardSize="M"
        columns={5}
        limit={10}
        TitleLogo={<New className="h-4.5 w-4.5" />}
        rowGap={28}
      />

      {/* (유저이름)님을 위한 추천 — 한 줄 6개 */}
      <CharacterShowcase
        charArray={userRecommendCharArray}
        isLoading={userRecommend.isLoading}
        isError={userRecommend.isError}
        error={userRecommend.error}
        onRetry={userRecommend.refetch}
        title={t("recommendationForYou")}
        cardSize="S"
        columns={6}
        limit={12}
        rowGap={28}
      />

      <CharacterCreateBanner />
    </article>
  );
};

export default HomeTabContents;
