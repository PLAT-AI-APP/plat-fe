"use client";

import { ChatFill } from "@/icons";
import Logo from "@/icons/Logo";
import New from "@/icons/New";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

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
  isNew?: boolean;
  isOfficial?: boolean;
}

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
    chatCountIcon?: string;
  }
> = {
  S: {
    wrapper: "w-[186.67px] gap-2",
    imageArea: "w-full h-[245px] rounded-[16px]",
    infoArea: "gap-0.5",
    title: "title-3 text-font-0",
    desc: "body-4 text-font-2",
    isIntegrated: false,
    creatorName: "body-6 text-font-2",
    chatCount: "body-6 text-font-2",
    chatCountIcon: "text-font-disabled",
  },
  M: {
    wrapper: "w-[227.2px]",
    imageArea: "w-full h-[227.2px] rounded-tl-2xl rounded-tr-2xl",
    infoArea: "px-4 py-5 gap-0.5 bg-bg-darkest rounded-bl-2xl rounded-br-2xl",
    title: "title-3 text-font-0",
    desc: "body-4 text-font-2",
    isIntegrated: false,
    creatorName: "body-6 text-font-2",
    chatCount: "body-6 text-font-2",
    chatCountIcon: "text-font-disabled",
  },
  L: {
    wrapper: "size-96 rounded-2xl overflow-hidden",
    imageArea: "w-full h-full rounded-2xl",
    infoArea:
      "h-36 px-4 pt-6 pb-5 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_20%,rgba(0,0,0,0.8)_100%)] rounded-b-2xl gap-1",
    title: "title-2 text-font-0",
    desc: "body-2 text-font-1",
    creatorName: "body-5",
    isIntegrated: true,
    chatCount: "text-font-2 body-6",
    chatCountIcon: "text-font-disabled",
  },
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

const LAST_SWIPE_THRESHOLD = 40;

const CharacterCard = ({
  title,
  description,
  creatorName,
  chatCount,
  images,
  size = "M",
  currentTag = "학교생활",
  tagList,
  isNew = false,
  isOfficial = false,
}: CharacterCardProps) => {
  const config = SIZE_CONFIG[size];
  const imageList = Array.isArray(images) ? images : [images];
  const lastImageIndex = imageList.length - 1;
  const hasIndicator = imageList.length > 1;
  const hasChatCount = typeof chatCount === "number";
  const titleIcon = isOfficial ? (
    <Logo className="size-[18px] shrink-0" />
  ) : isNew ? (
    <New className="size-[18px] shrink-0 text-font-0" />
  ) : null;

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [pointerStartX, setPointerStartX] = useState<number | null>(null);
  const [isLastActionVisible, setIsLastActionVisible] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const isLastImageSlideActive = currentImgIndex === lastImageIndex;

  const handleIndicatorClick = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (size === "L") {
      setIsLastActionVisible(false);
      emblaApi?.scrollTo(idx);
      return;
    }

    setCurrentImgIndex(idx);
  };

  const handleActionIndicatorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLastActionVisible(true);
  };

  const syncSelectedSlide = useCallback(() => {
    if (!emblaApi) return;
    setCurrentImgIndex(emblaApi.selectedScrollSnap());
    setIsLastActionVisible(false);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || size !== "L") return;

    emblaApi.on("select", syncSelectedSlide);
    emblaApi.on("reInit", syncSelectedSlide);

    return () => {
      emblaApi.off("select", syncSelectedSlide);
      emblaApi.off("reInit", syncSelectedSlide);
    };
  }, [emblaApi, size, syncSelectedSlide]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (size !== "L") return;
    setPointerStartX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (size !== "L" || pointerStartX === null) return;

    const diff = pointerStartX - e.clientX;

    if (isLastImageSlideActive && diff > LAST_SWIPE_THRESHOLD) {
      setIsLastActionVisible(true);
    }

    setPointerStartX(null);
  };

  if (size === "L") {
    return (
      <article
        className="cursor-pointer active:cursor-grab relative w-[388.67px] h-[378.72px] inline-flex flex-col justify-end items-center overflow-hidden rounded-2xl bg-zinc-800"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {hasChatCount && (
          <div className="absolute w-13.5 z-20 top-4.25 right-[13.7px] inline-flex justify-center items-center gap-1 px-1 py-0.5 bg-card rounded-lg">
            <div
              data-icon="chat-fill"
              className="size-4 relative flex items-center justify-center overflow-hidden"
            >
              <ChatFill className="size-4 text-font-2" />
            </div>
            <span className="text-font-2 body-4">{chatCount}</span>
          </div>
        )}

        <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {imageList.map((image, idx) => (
              <div
                key={`${image}-${idx}`}
                className="relative min-w-0 flex-[0_0_100%]"
              >
                <Image
                  className="object-cover"
                  src={image}
                  alt={`${title} image ${idx + 1}`}
                  fill
                  sizes="384px"
                />
              </div>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-10 bg-[#0D0E11]/80 transition-opacity duration-300",
            isLastActionVisible ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          className={cn(
            "pointer-events-none absolute left-1/2 top-27.25 z-10 flex -translate-x-1/2 flex-col items-center gap-3 transition-all duration-500 ease-out",
            isLastActionVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-5 opacity-0",
          )}
        >
          <p className="title-3 text-white text-nowrap">
            캐릭터의 다른 모습을 보고 싶다면?
          </p>

          <button
            type="button"
            className="hover:bg-brand/20 pointer-events-auto rounded-xl border border-brand-dark bg-[#0D0E11]/40 px-4 py-2 title-4 text-brand"
          >
            프로필 보기
          </button>
        </div>

        <div className="relative z-10 self-stretch h-36 px-4 pt-6 pb-5 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_20%,rgba(0,0,0,0.8)_100%)] rounded-b-2xl flex flex-col justify-end items-start gap-1">
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="flex w-full items-center gap-1">
              <h2 className="min-w-0 truncate text-font-0 title-2">{title}</h2>
              {titleIcon}
            </div>
            <p className="body-3 text-font-1 line-clamp-1">{description}</p>
          </div>

          <div className="self-stretch inline-flex justify-center items-center gap-2">
            {imageList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleIndicatorClick(e, idx)}
                className={cn(
                  "size-2 rounded-full transition-colors cursor-pointer",
                  idx === currentImgIndex ? "bg-brand" : "bg-font-1",
                  isLastActionVisible && "bg-font-1",
                )}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
            <button
              type="button"
              onClick={handleActionIndicatorClick}
              className={cn(
                "size-2 rounded-full transition-colors cursor-pointer",
                isLastActionVisible ? "bg-brand" : "bg-font-1",
              )}
            />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`cursor-pointer group inline-flex flex-col justify-start items-start ${config.wrapper}`}
    >
      <div
        className={`relative overflow-hidden bg-zinc-800 ${config.imageArea}`}
      >
        <Image
          className="group-hover:scale-110 object-cover transition-all duration-300"
          src={imageList[currentImgIndex]}
          alt={`${title} image ${currentImgIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {hasIndicator && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center justify-between gap-1">
            {imageList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleIndicatorClick(e, idx)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all cursor-pointer",
                  idx === currentImgIndex
                    ? "bg-brand scale-110"
                    : "bg-[#11141F]",
                )}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div
        className={cn(
          `self-stretch flex flex-col justify-start items-start w-full ${config.infoArea}`,
          tagList && "gap-0.5",
        )}
      >
        <div className="flex w-full items-center gap-1">
          <h2 className={`min-w-0 truncate text-font-0 ${config.title}`}>
            {title}
          </h2>
          {titleIcon}
        </div>

        <p className={`self-stretch text-font-1 line-clamp-1 ${config.desc}`}>
          {description}
        </p>

        {tagList && (
          <ul className="py-1 flex flex-wrap justify-start items-center gap-1.5 overflow-hidden h-5.5">
            {tagList.slice(0, 5).map((tag) => {
              return (
                <li
                  key={tag}
                  className={cn(
                    "shrink-0 pl-1 pr-0.75 py-px bg-card rounded-md flex justify-center items-center",
                    currentTag === tag && "text-brand bg-brand-opacity",
                  )}
                >
                  <div className="flex justify-start items-center gap-0.5">
                    <div className="text-font-2 text-xs"># {tag}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="inline-flex justify-start items-start gap-0.5">
          <span className={cn("text-font-2 line-clamp-1", config.creatorName)}>
            @ {creatorName}
          </span>
        </div>

        {hasChatCount && (
          <div className="inline-flex justify-center items-center gap-1">
            <div
              data-icon="chat-fill"
              className="w-4 h-4 relative flex items-center justify-center"
            >
              <ChatFill
                className={cn("w-4 h-4", config.chatCountIcon || "text-font-2")}
              />
            </div>
            <span className={cn("text-font-2", config.chatCount)}>
              {chatCount}
            </span>
          </div>
        )}
      </div>
    </article>
  );
};

export default CharacterCard;
