import { ChatFill } from "@/icons";
import Image from "next/image";
import React from "react";

// 사이즈별 타입을 명시적으로 지정
type CardSize = "S" | "M" | "L" | "XL";

interface CharacterCardProps {
  title: string;
  description: string;
  creatorName: string;
  chatCount: number;
  images: string[] | string; // 다중 이미지 배열 (XL 등의 캐러셀용)
  size?: CardSize;
}

// 사이즈별 스타일 설정 객체 (Style Configuration Map)
const SIZE_CONFIG: Record<
  CardSize,
  {
    wrapper: string;
    imageArea: string;
    infoArea: string;
    title: string;
    desc: string;
    isIntegrated: boolean;
    creatorName?: string; // L, XL에만 존재하므로 선택적(?) 속성으로 지정
    chatCount?: string; // XL에만 존재하므로 선택적(?) 속성으로 지정
  }
> = {
  // ~~님을 위한 추천 card size
  S: {
    wrapper: "w-[186px] gap-2", // S 사이즈 너비 추정치
    imageArea: "w-full h-60 rounded-2xl",
    infoArea: "pl-2 gap-0.5",
    title: "title-3 leading-6",
    desc: "body-4 leading-5",
    isIntegrated: false, // 텍스트 영역 배경 유무
  },
  // 오늘의 PICK, 최근 소문나기 시작한 신작 card size
  M: {
    wrapper: "w-56.75 gap-2",
    imageArea: "w-full h-72 rounded-2xl",
    infoArea: "pl-2 gap-0.5",
    title: "title-3 leading-6",
    desc: "body-4 leading-5",
    isIntegrated: false,
  },
  // ~한 캐릭터 모음 card size
  L: {
    wrapper: "w-[288px]", // L 사이즈 너비 추정치
    imageArea: "w-full h-96 rounded-t-2xl",
    infoArea: "px-4 py-6 bg-bg-darkest rounded-b-2xl gap-1",
    title: "title-3 leading-6",
    desc: "body-4 leading-5",
    creatorName: "body-5",
    isIntegrated: true,
  },
  // 인기 캐릭터 이미지 미리보기 card size
  XL: {
    wrapper: "w-96.5 justify-between",
    imageArea: "w-full h-96 rounded-t-2xl",
    infoArea: "px-5 py-8 bg-bg-darkest rounded-b-2xl gap-2",
    title: "title-1 leading-7",
    desc: "body-2 leading-6",
    isIntegrated: true,
    creatorName: "body-5",
    chatCount: "body-5",
  },
};

const CharacterCard = ({
  title,
  description,
  creatorName,
  chatCount,
  images,
  size = "M",
}: CharacterCardProps) => {
  const config = SIZE_CONFIG[size];

  const imageList = Array.isArray(images) ? images : [images];
  const hasIndicator = imageList.length > 1;

  return (
    <article
      className={`inline-flex flex-col justify-start items-start ${config.wrapper}`}
    >
      {/* 이미지 영역 */}
      <div
        className={`relative overflow-hidden bg-zinc-800 ${config.imageArea}`}
      >
        <Image
          className="object-cover"
          src={images[0]}
          alt={`${title} 프로필`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* 하단 캐러셀 인디케이터 (이미지가 2장 이상일 때 노출) */}
        {hasIndicator && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-between gap-1 z-10">
            {imageList.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === 0 ? "bg-brand" : "bg-gray-900"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 정보 텍스트 영역 */}
      <div
        className={`self-stretch flex flex-col justify-start items-start w-full ${config.infoArea}`}
      >
        <div className="inline-flex justify-center items-center gap-1">
          <h2 className={`text-font-0 line-clamp-1 ${config.title}`}>
            {title}
          </h2>
        </div>

        <p className={`self-stretch text-font-1 line-clamp-1 ${config.desc}`}>
          {description}
        </p>

        <div className="inline-flex justify-start items-start gap-0.5 mt-0.5">
          <span className="text-font-2 text-xs font-normal font-['Pretendard'] leading-5">
            @
          </span>
          <span
            className={`text-font-2 body-6 leading-5 line-clamp-1 ${config.creatorName}`}
          >
            {creatorName}
          </span>
        </div>

        <div className="inline-flex justify-center items-center gap-1">
          <div
            data-icon="chat-fill"
            className="w-4 h-4 relative flex items-center justify-center"
          >
            {/* L 사이즈에서는 아이콘 색상이 font-3-disabled 였던 점을 고려하여 분기 가능 */}
            {/* <div
              className={`w-3 h-2.5 rounded-xs ${config.isIntegrated ? "bg-font-3-disabled" : "bg-font-2"}`}
            /> */}
            <ChatFill
              className={`w-4 h-4 ${config.isIntegrated ? "text-font-3-disabled" : "text-font-2"}`}
            />
          </div>
          <span
            className={`body-6 leading-5 ${config.isIntegrated ? "text-font-3-disabled" : "text-font-2"} ${config.chatCount}`}
          >
            {chatCount}
          </span>
        </div>
      </div>
    </article>
  );
};

export default CharacterCard;
