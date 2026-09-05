"use client";

import New from "@/icons/New";
import { useTranslations } from "next-intl";
import React from "react";
import CharacterShowcase from "@/components/character/CharacterShowcase";
import CharacterExperience from "./_components/character-experience";
import CharacterCreateBanner from "../CharacterCreateBanner";
import { useTodayPickQuery } from "@/api/home/getTodayPick";
import { useAllCharactersQuery } from "@/api/home/getAllCharacters";
import { useAssetPreviewQuery } from "@/api/home/getAssetPreview";
import { usePopularTagQuery } from "@/api/home/getPopularTag";
import { useNewWorkQuery } from "@/api/home/getNewWork";

const HomeTabContents = () => {
  // 홈 탭 언어는 설정 변경 직후 바로 반영되어야 하므로 클라이언트 번역 컨텍스트를 사용합니다.
  const t = useTranslations("home");

  // 로딩·실패 여부는 데이터를 가져오는 이곳만 정확히 알 수 있으므로 CharacterShowcase 에 그대로 내려 준다.
  // isError 를 함께 넘기지 않으면 실패한 섹션이 "결과 없음"으로 조용히 사라진다.
  // 로딩은 isPending 이 아니라 isLoading 을 본다 — 로그인 여부가 정해질 때까지 비활성인
  // 쿼리(전체 모음)가 isPending 상태로 머물러, 스켈레톤이 영구히 떠 있게 된다.
  // 화면에 몇 장을 두는지가 곧 몇 장을 받아 와야 하는지다. limit 만 올리고 size 를
  // 그대로 두면 서버가 준 10장이 상한이 되어 12장이 채워지지 않는다.
  const todayPick = useTodayPickQuery({ size: 12 });
  const allCharacters = useAllCharactersQuery({ size: 24 });
  const assetPreview = useAssetPreviewQuery({ size: 3 });
  const popularTag = usePopularTagQuery();
  const newWork = useNewWorkQuery();

  const todayPickCharArray = (todayPick.data ?? []).map((item) => ({
    id: item.universeId,
    name: item.title,
    chatCount: item.chatCount,
    dec: item.description,
    img: item.images,
    creatorName: item.creator.nickname,
    isNew: item.isNew,
    isOfficial: item.isOfficial,
  }));

  const allCharacterArray = (allCharacters.data?.content ?? []).map((item) => ({
    id: item.universeId,
    name: item.title,
    chatCount: item.chatCount,
    dec: item.description,
    img: item.images,
    creatorName: item.creator?.nickname,
    isNew: item.isNew,
    isOfficial: item.isOfficial,
  }));

  const assetPreviewCharArray = (assetPreview.data ?? []).map((item) => ({
    id: item.universeId,
    name: item.title,
    chatCount: item.chatCount,
    dec: item.description,
    img: item.images,
    isNew: item.isNew,
    isOfficial: item.isOfficial,
  }));

  const popularTagCharArray = (popularTag.data ?? []).map((item) => ({
    id: item.universeId,
    name: item.title,
    chatCount: item.chatCount,
    dec: item.description,
    img: item.images,
    creatorName: item.creator.nickname,
    isNew: item.isNew,
    isOfficial: item.isOfficial,
  }));

  const newWorkCharArray = (newWork.data ?? []).map((item) => ({
    id: item.universeId,
    name: item.title,
    chatCount: item.chatCount,
    dec: item.description,
    img: item.images,
    creatorName: item.creator.nickname,
    isNew: true,
  }));

  return (
    <article className="mt-6 flex flex-col gap-12">
      {/* 오늘의 PICK — 홈의 주력 섹션이라 제목 한 단계를 올려 강조한다.
          12장을 줄바꿈 없이 한 줄에 두고 좌우 버튼으로 밀어서 본다. */}
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
        layout="carousel"
        limit={12}
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
      />

      {/* 상황 에셋이 많은 캐릭터 미리보기 — 큰 카드 3장을 항상 한 줄에 둔다.
          격자로 두면 폭이 좁아질 때 2+1 로 접혀 세 번째 카드만 아래로 떨어졌다. */}
      <CharacterShowcase
        charArray={assetPreviewCharArray}
        isLoading={assetPreview.isLoading}
        isError={assetPreview.isError}
        error={assetPreview.error}
        onRetry={assetPreview.refetch}
        title={t("popularCharacterPreview")}
        cardSize="L"
        layout="carousel"
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
      />

      {/* 전체 캐릭터 모음 — 조건 없이 누적 대화량 순. 로그인하지 않아도 보인다. */}
      <CharacterShowcase
        charArray={allCharacterArray}
        isLoading={allCharacters.isLoading}
        isError={allCharacters.isError}
        error={allCharacters.error}
        onRetry={allCharacters.refetch}
        title={t("allCharacters")}
        cardSize="S"
        columns={6}
        limit={24}
      />

      <CharacterCreateBanner />
    </article>
  );
};

export default HomeTabContents;
