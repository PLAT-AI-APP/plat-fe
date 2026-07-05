"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowDown, ArrowLeft, ArrowRight } from "@/icons";
import { CharacterDetail, CharacterImageItem } from "@/type/character";
import { cn } from "@/lib/utils";

interface SettingsPanelProps {
  character: CharacterDetail;
  onNextImage: () => void;
  onPreviousImage: () => void;
  onStartChat: () => void;
  selectedImage?: CharacterImageItem;
}

const ExpandableText = ({
  children,
  maxHeight,
}: {
  children: string;
  maxHeight: number;
}) => {
  const t = useTranslations("characterDetail");
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowMoreButton, setShouldShowMoreButton] = useState(false);

  useEffect(() => {
    if (!contentRef.current) return;

    const contentElement = contentRef.current;

    // 섹션별 기준 높이에 도달한 텍스트만 접기/펼치기 버튼을 노출합니다.
    const updateTextOverflowState = () => {
      setShouldShowMoreButton(contentElement.scrollHeight >= maxHeight);
    };

    updateTextOverflowState();

    const resizeObserver = new ResizeObserver(updateTextOverflowState);
    resizeObserver.observe(contentElement);

    return () => resizeObserver.disconnect();
  }, [children, maxHeight]);

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={contentRef}
        style={!isExpanded ? { maxHeight } : undefined}
        className={cn(
          "relative overflow-hidden whitespace-pre-wrap body-4 leading-relaxed text-font-2",
          shouldShowMoreButton &&
            !isExpanded &&
            "after:absolute after:inset-x-0 after:bottom-0 after:h-12 after:bg-linear-to-t after:from-bg-dark after:to-transparent",
        )}
      >
        {children}
      </div>
      {shouldShowMoreButton && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="body-4 flex h-11 w-full items-center justify-center gap-1 rounded-xl border border-border-main text-font-2 hover:bg-card"
        >
          {isExpanded ? t("collapse") : t("expand")}
          <ArrowDown className={cn("size-4", isExpanded && "rotate-180")} />
        </button>
      )}
    </div>
  );
};

const SettingsPanel = ({
  character,
  onNextImage,
  onPreviousImage,
  onStartChat,
  selectedImage,
}: SettingsPanelProps) => {
  const t = useTranslations("characterDetail");
  // 선택된 미리보기 이미지가 없다면 기존 대표 이미지를 기본 렌더링 대상으로 사용합니다.
  const currentImageUrl = selectedImage?.url ?? character.mainImage;
  const currentImageKey = selectedImage?.id ?? character.mainImage;
  const isPrivateImage = selectedImage?.visibility === "PRIVATE";

  return (
    <section className="flex flex-col gap-8 pb-16">
      <div className="relative h-[332px] overflow-hidden rounded-2xl bg-bg-darkest">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageKey}
            // framer-motion으로 이미지 교체 시 흐릿한 상태에서 선명해지는 전환을 만듭니다.
            initial={{ opacity: 0, filter: "blur(18px)", scale: 1.02 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, filter: "blur(14px)", scale: 0.98 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={currentImageUrl}
              alt={character.title}
              fill
              className="scale-125 object-cover opacity-35 blur-2xl"
            />
            <Image
              src={currentImageUrl}
              alt={character.title}
              width={333}
              height={332}
              className={cn(
                "absolute left-1/2 top-0 h-full w-[333px] -translate-x-1/2 rounded-none object-contain",
                isPrivateImage && "opacity-70",
              )}
            />
            {isPrivateImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg-darkest/80">
                <p className="title-2 text-center text-font-1">
                  {t("privateImagePrompt")}
                </p>
                <button
                  type="button"
                  onClick={onStartChat}
                  className="title-3 rounded-xl border border-brand-dark bg-bg-darkest/40 px-4 py-2 text-brand backdrop-blur-md"
                >
                  {t("chatStart")}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <button
          type="button"
          onClick={onPreviousImage}
          className="absolute left-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-font-2 opacity-30 transition-opacity hover:opacity-100"
          aria-label={t("previousImage")}
        >
          <ArrowLeft className="size-6" />
        </button>
        <button
          type="button"
          onClick={onNextImage}
          className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-font-2 opacity-30 transition-opacity hover:opacity-100"
          aria-label={t("nextImage")}
        >
          <ArrowRight className="size-6" />
        </button>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="title-3 text-font-1">{t("prologue")}</h2>
        <ExpandableText maxHeight={400}>{character.prologue}</ExpandableText>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="title-3 text-font-1">
          {t("characterIntroduction")}
        </h2>
        <div className="flex items-center gap-2">
          <Image
            src={character.profileImage}
            alt={t("profileAlt", { name: character.title })}
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
          />
          <span className="body-2 text-font-1">이윤아</span>
        </div>
        <ExpandableText maxHeight={100}>
          {character.characterDescription}
        </ExpandableText>
      </section>
    </section>
  );
};

export default SettingsPanel;
