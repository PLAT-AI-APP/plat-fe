"use client";
import { useCharacterScenarioListQuery } from "@/api/character/getCharacterScenarioList";
import ActiveButton from "@/components/ActiveButton";
import ChattingStartModal from "@/components/modal/ChattingStartModal";
import useToggle from "@/hooks/useToggle";
import { Heart } from "@/icons";
import { formatStatCount } from "@/lib/utils";
import { CharacterScenario } from "@/type/character";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CharacterProfileProps {
  imageSrc: string;
  creatorImage: string;
  creatorName: string;
  followerCount: number;
  characterId: string;
}

const CharacterProfile = ({
  imageSrc,
  creatorImage,
  creatorName,
  followerCount,
  characterId,
}: CharacterProfileProps) => {
  // useSuspenseQuery 대신 일반 useQuery를 사용하더라도 HydrationBoundary가 있으면
  // 초기 렌더링 시 데이터를 즉시 사용
  const { data: scenarios } = useCharacterScenarioListQuery(characterId);

  // 초기 상태를 scenarios?[0]으로 설정 (옵셔널 체이닝 활용)
  // 타입은 CharacterScenario | undefined 가 됩니다.
  const [currentScenario, setCurrentScenario] = useState<
    CharacterScenario | undefined
  >(scenarios?.[0]);

  // 만약 scenarios가 처음에 undefined였다가 들어왔을 때를 대비한 동기화
  // (Hydration 시에는 즉시 들어오지만, 클라이언트에서 업데이트 시 필요할 수 있음)
  if (!currentScenario && scenarios && scenarios.length > 0) {
    setCurrentScenario(scenarios[0]);
  }

  const { isOpen, toggle } = useToggle();

  // 데이터가 아예 없을 때의 방어 로직
  if (!scenarios || scenarios.length === 0) {
    return <div>등록된 시나리오가 없습니다.</div>;
  }

  return (
    <section className="flex flex-col gap-4 max-w-100">
      <Image
        src={imageSrc}
        alt="메인 캐릭터 이미지"
        width={500}
        height={500}
        className="object-cover aspect-square rounded-2xl"
      />

      {/* 대화하기 좋아요 button */}
      <div className="flex gap-3">
        <ActiveButton
          text="대화하기"
          isActive
          className="rounded-xl font-normal"
          onClick={toggle}
        />
        <button className="flex rounded-xl justify-center items-center bg-card hover:bg-card-hover cursor-pointer w-11.5 aspect-square">
          <Heart className="text-font-2" />
        </button>
      </div>

      {/* 제작자 정보, 팔로우 button */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <Image
            src={creatorImage}
            alt="캐릭터 제작자 이미지"
            width={40}
            height={40}
            className="object-cover aspect-square rounded-full"
          />
          <div className="flex flex-col gap-0.5">
            <Link href={"/"} className="text-font-1 hover:underline">
              {creatorName}
            </Link>
            <span className="text-font-2 text-[12px]">
              팔로워 {formatStatCount(followerCount)}
            </span>
          </div>
        </div>
        <button className="px-2.5 py-1 rounded-[10px] text-bg-dark bg-font-1 text-sm font-medium">
          팔로우
        </button>
      </div>

      {isOpen && (
        <ChattingStartModal
          onClose={toggle}
          scenarioList={scenarios}
          currentScenario={currentScenario}
          setCurrentScenario={setCurrentScenario}
        />
      )}
    </section>
  );
};

export default CharacterProfile;
