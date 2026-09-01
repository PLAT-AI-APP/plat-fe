"use client";

import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ChatCountBadge from "./ChatCountBadge";
import { LAST_SWIPE_THRESHOLD, SIZE_CONFIG } from "./constants";
import LastImageActionOverlay from "./LastImageActionOverlay";
import SlideIndicators from "./SlideIndicators";
import TagList from "./TagList";
import TitleLine from "./TitleLine";
import TitleStatusIcon from "./TitleStatusIcon";
import type { CharacterCardProps } from "./types";
import {
  normalizeImages,
  normalizeSelectedTags,
  orderTagsBySelection,
} from "./utils";

export { SIZE_CONFIG };

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
  selectedTags,
  rank,
}: CharacterCardProps) => {
  const t = useTranslations("characterCard");
  const config = SIZE_CONFIG[size];
  const imageList = useMemo(() => normalizeImages(images), [images]);

  // 상위에서 단일 태그/태그 배열 어느 형태로 내려와도 카드 내부에서는 배열로만 다룹니다.
  const selectedTagList = useMemo(
    () => normalizeSelectedTags(selectedTags),
    [selectedTags],
  );
  const selectedTagSet = useMemo(
    () => new Set(selectedTagList),
    [selectedTagList],
  );

  // 선택된 태그가 카드 태그 목록 안에 있으면 앞쪽으로 끌어올려 먼저 보이게 합니다.
  const orderedTagList = useMemo(
    () => orderTagsBySelection(tagList, selectedTagSet),
    [selectedTagSet, tagList],
  );
  const titleIcon = (
    <TitleStatusIcon isOfficial={isOfficial} isNew={isNew} />
  );

  const lastImageIndex = imageList.length - 1;
  const hasIndicator = imageList.length > 1;
  const hasChatCount = typeof chatCount === "number";
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [pointerStartX, setPointerStartX] = useState<number | null>(null);
  const [isLastActionVisible, setIsLastActionVisible] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const isLastImageSlideActive = currentImgIndex === lastImageIndex;

  const handleIndicatorClick = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    event.stopPropagation();

    if (size === "L") {
      setIsLastActionVisible(false);
      emblaApi?.scrollTo(index);
      return;
    }

    setCurrentImgIndex(index);
  };

  const handleActionIndicatorClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
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

  const handlePointerDown = (event: React.PointerEvent) => {
    if (size !== "L") return;
    setPointerStartX(event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (size !== "L" || pointerStartX === null) return;

    const swipeDistance = pointerStartX - event.clientX;

    // L 카드 마지막 이미지에서 한 번 더 오른쪽으로 밀면 프로필 CTA 오버레이를 보여줍니다.
    if (isLastImageSlideActive && swipeDistance > LAST_SWIPE_THRESHOLD) {
      setIsLastActionVisible(true);
    }

    setPointerStartX(null);
  };

  if (size === "L") {
    return (
      <article
        className="relative inline-flex h-[378.72px] w-[388.67px] cursor-pointer flex-col items-center justify-end overflow-hidden rounded-2xl bg-scrim active:cursor-grab"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {hasChatCount && (
          <ChatCountBadge
            chatCount={chatCount}
            variant="floating"
            textClassName="body-4"
          />
        )}

        {/* Embla viewport: 소수점 너비 카드에서 다음 슬라이드가 1px 보이는 현상을 clip-path로 보정합니다. */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl bg-scrim [clip-path:inset(0_1px_0_0_round_16px)]"
          ref={emblaRef}
        >
          <div className="flex h-full w-full">
            {imageList.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative h-full w-full min-w-0 flex-[0_0_100%] overflow-hidden bg-scrim"
              >
                <Image
                  className="object-cover"
                  src={image}
                  alt={t("imageAlt", { title, index: index + 1 })}
                  fill
                  sizes="384px"
                />
              </div>
            ))}
          </div>
        </div>

        <LastImageActionOverlay isVisible={isLastActionVisible} />

        <div className="relative z-10 flex h-36 self-stretch flex-col items-start justify-end gap-1 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_20%,rgba(0,0,0,0.8)_100%)] px-4 pb-5 pt-6">
          <div className="flex self-stretch flex-col items-start justify-start gap-1">
            <TitleLine
              title={title}
              titleClassName="title-2"
              icon={titleIcon}
            />
            <p className="body-3 text-font-1 line-clamp-1">{description}</p>
          </div>

          <SlideIndicators
            imageCount={imageList.length}
            currentIndex={currentImgIndex}
            variant="large"
            forceImageInactive={isLastActionVisible}
            onImageSelect={handleIndicatorClick}
            onActionSelect={handleActionIndicatorClick}
            isActionActive={isLastActionVisible}
          />
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group inline-flex cursor-pointer flex-col items-start justify-start",
        config.wrapper,
      )}
    >
      <div
        className={cn("relative overflow-hidden bg-scrim", config.imageArea)}
      >
        <Image
          className="object-cover transition-transform group-hover:scale-110"
          src={imageList[currentImgIndex]}
          alt={t("imageAlt", { title, index: currentImgIndex + 1 })}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {typeof rank === "number" && (
          <span className="pointer-events-none absolute bottom-3 left-3 text-[40px] leading-none font-extrabold text-font-0 [text-shadow:0px_4px_6.7px_rgba(0,0,0,0.4)]">
            {rank}
          </span>
        )}

        {hasIndicator && (
          <SlideIndicators
            imageCount={imageList.length}
            currentIndex={currentImgIndex}
            variant="standard"
            onImageSelect={handleIndicatorClick}
          />
        )}
      </div>

      <div
        className={cn(
          "flex w-full flex-col items-start justify-start self-stretch",
          config.infoArea,
          tagList && "gap-0.5",
        )}
      >
        <TitleLine
          title={title}
          titleClassName={config.title}
          icon={titleIcon}
        />

        <p className={cn("self-stretch text-font-1 line-clamp-1", config.desc)}>
          {description}
        </p>

        {tagList && (
          <TagList
            tags={orderedTagList}
            selectedTagSet={selectedTagSet}
            currentTag={currentTag}
          />
        )}

        <div className="inline-flex items-start justify-start gap-0.5">
          <span className={cn("text-font-2 line-clamp-1", config.creatorName)}>
            @ {creatorName}
          </span>
        </div>

        {hasChatCount && (
          <ChatCountBadge
            chatCount={chatCount}
            variant="inline"
            textClassName={config.chatCount}
            iconClassName={config.chatCountIcon}
          />
        )}
      </div>
    </article>
  );
};

export default CharacterCard;
