"use client";

import { ChatFill } from "@/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";

// 사이즈별 타입을 명시적으로 지정
type CardSize = "S" | "M" | "L" | "XL";

interface CharacterCardProps {
  title: string;
  description: string;
  creatorName: string;
  chatCount?: number;
  images: string[] | string;
  size?: CardSize;

  tagList?: string[];
  currentTag?: string;
}

// 사이즈별 스타일 설정 객체
export const SIZE_CONFIG: Record<
  CardSize,
  {
    wrapper: string;
    imageArea: string;
    infoArea: string;
    title: string;
    desc: string;
    isIntegrated: boolean;
    creatorName: string;
    chatCount: string;
  }
> = {
  // ~~님을 위한 추천 card size
  S: {
    wrapper: "w-[185.83px] gap-2",
    imageArea: "w-full h-60 rounded-2xl",
    infoArea: "pl-2 gap-0.5",
    title: "title-3 ",
    desc: "body-4 ",
    isIntegrated: false,
    creatorName: "body-6",
    chatCount: "body-6",
  },
  // 오늘의 PICK, 최근 소문나기 시작한 신작 card size
  M: {
    wrapper: "w-[227px] gap-2",
    imageArea: "w-full h-72 rounded-2xl",
    infoArea: "px-2 gap-0.5",
    title: "title-3",
    desc: "body-4",
    isIntegrated: false,
    creatorName: "body-6",
    chatCount: "body-6",
  },
  // ~한 캐릭터 모음 card size
  L: {
    wrapper: "w-[288px]",
    imageArea: "w-full h-96 rounded-t-2xl",
    infoArea: "px-4 py-6 bg-bg-darkest rounded-b-2xl gap-1",
    title: "title-3",
    desc: "body-4",
    creatorName: "body-5",
    isIntegrated: true,
    chatCount: "text-font-disabled body-5",
  },
  // 인기 캐릭터 이미지 미리보기 card size
  XL: {
    wrapper: "w-96.5 justify-between",
    imageArea: "w-full h-96 rounded-t-2xl",
    infoArea: "px-5 py-6 bg-bg-darkest rounded-b-2xl gap-2",
    title: "title-1 ",
    desc: "body-2 ",
    isIntegrated: true,
    creatorName: "body-4",
    chatCount: "text-font-disabled body-4",
  },
};

const CharacterCard = ({
  title,
  description,
  creatorName,
  chatCount,
  images,
  size = "M",
  currentTag = "학교생활",
  tagList,
}: CharacterCardProps) => {
  const config = SIZE_CONFIG[size];

  const imageList = Array.isArray(images) ? images : [images];
  const hasIndicator = imageList.length > 1;

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const handleIndicatorClick = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex(idx);
  };

  return (
    <article
      className={`inline-flex flex-col justify-start items-start ${config.wrapper}`}
    >
      {/* 이미지 영역 */}
      <div
        className={`relative overflow-hidden bg-zinc-800 ${config.imageArea}`}
      >
        <Image
          className="object-cover transition-opacity duration-300"
          src={imageList[currentImgIndex]}
          alt={`${title} 프로필 ${currentImgIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* 하단 캐러셀 인디케이터 (이미지가 2장 이상일 때 노출) */}
        {hasIndicator && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-between gap-1 z-10">
            {imageList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleIndicatorClick(e, idx)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all cursor-pointer",
                  idx === currentImgIndex
                    ? "bg-brand scale-110"
                    : "bg-[#11141F]",
                )}
                aria-label={`${idx + 1}번째 이미지 보기`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 정보 텍스트 영역 */}
      <div
        className={cn(
          `self-stretch flex flex-col justify-start items-start w-full ${config.infoArea}`,
          tagList && "gap-0.5",
        )}
      >
        <div className="inline-flex justify-center items-center gap-1">
          <h2 className={`text-font-0 line-clamp-1 ${config.title}`}>
            {title}
          </h2>
        </div>

        <p className={`self-stretch text-font-1 line-clamp-1 ${config.desc}`}>
          {description}
        </p>

        {tagList && (
          <ul className="py-1 flex flex-wrap justify-start items-center gap-1.5 overflow-hidden h-5.5">
            {Array.from({ length: 5 }).map((_, index) => {
              return (
                <li
                  key={index}
                  className={cn(
                    "shrink-0 pl-1 pr-0.75 py-px bg-card rounded-md flex justify-center items-center",
                    currentTag === _ && "text-brand bg-brand-opacity",
                  )}
                >
                  <div className="flex justify-start items-center gap-0.5">
                    <div className="text-font-2 text-xs"># 태그</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="inline-flex justify-start items-start gap-0.5 mt-0.5">
          <span className={cn("text-font-2 line-clamp-1", config.creatorName)}>
            @ {creatorName}
          </span>
        </div>

        {chatCount && (
          <div className="inline-flex justify-center items-center gap-1">
            <div
              data-icon="chat-fill"
              className="w-4 h-4 relative flex items-center justify-center"
            >
              <ChatFill
                className={cn(`w-4 h-4 text-font-2`, config.chatCount)}
              />
            </div>
            <span className={cn(`text-font-2`, config.chatCount)}>
              {chatCount}
            </span>
          </div>
        )}
      </div>
    </article>
  );
};

export default CharacterCard;
