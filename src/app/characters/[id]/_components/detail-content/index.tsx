"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useCharacterDetailQuery } from "@/api/character/getCharacterDetail";
import { useModalStore } from "@/store/useModalStore";
import CommentsPanel from "./_components/CommentsPanel";
import DetailTabs, { CharacterDetailTab } from "./_components/DetailTabs";
import ScenarioPanel from "./_components/ScenarioPanel";
import SettingsPanel from "./_components/SettingsPanel";
import SidebarSummary from "./_components/SidebarSummary";

interface CharacterDetailContentProps {
  characterId: string;
}

const CharacterDetailContent = ({
  characterId,
}: CharacterDetailContentProps) => {
  const {
    data: character,
    isLoading,
    isError,
  } = useCharacterDetailQuery(characterId);
  const t = useTranslations("characterDetail");
  const openModal = useModalStore((state) => state.openModal);
  const [currentTab, setCurrentTab] = useState<CharacterDetailTab>("settings");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const settingsRef = useRef<HTMLElement>(null);
  const scenarioRef = useRef<HTMLElement>(null);
  const commentsRef = useRef<HTMLElement>(null);
  const isProgrammaticScrollRef = useRef(false);
  const programmaticScrollTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const sectionRefs = useMemo(
    () => ({
      settings: settingsRef,
      scenario: scenarioRef,
      comments: commentsRef,
    }),
    [],
  );
  const currentScenario = useMemo(
    () => character?.scenarios[0],
    [character?.scenarios],
  );
  const getScrollContainer = useCallback(
    () => document.getElementById("page-content"),
    [],
  );
  const handleTabChange = useCallback(
    (tab: CharacterDetailTab, targetId: string) => {
      const scrollContainer = getScrollContainer();
      const targetSection = document.getElementById(targetId);

      if (!scrollContainer || !targetSection) return;

      if (programmaticScrollTimeoutRef.current) {
        clearTimeout(programmaticScrollTimeoutRef.current);
      }

      // hash 기본 이동은 navigation guard와 충돌할 수 있어, 실제 스크롤 컨테이너를 직접 이동시킵니다.
      const targetTop =
        targetSection.getBoundingClientRect().top -
        scrollContainer.getBoundingClientRect().top +
        scrollContainer.scrollTop -
        72;

      isProgrammaticScrollRef.current = true;
      setCurrentTab(tab);
      scrollContainer.scrollTo({ top: targetTop, behavior: "smooth" });
      programmaticScrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 700);
    },
    [getScrollContainer],
  );

  useEffect(() => {
    const scrollContainer = getScrollContainer();

    if (!scrollContainer) return;

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;

      const isScrolledToBottom =
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - 2;

      if (isScrolledToBottom) {
        setCurrentTab("comments");
        return;
      }

      const containerTop = scrollContainer.getBoundingClientRect().top;
      const entries = Object.entries(sectionRefs) as [
        CharacterDetailTab,
        typeof settingsRef,
      ][];
      const activeSection = entries
        .map(([tab, ref]) => ({
          tab,
          top:
            (ref.current?.getBoundingClientRect().top ??
              Number.POSITIVE_INFINITY) - containerTop,
        }))
        .filter(({ top }) => top <= 120)
        .sort((a, b) => b.top - a.top)[0];

      if (activeSection) {
        setCurrentTab(activeSection.tab);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [getScrollContainer, sectionRefs]);

  useEffect(() => {
    return () => {
      if (programmaticScrollTimeoutRef.current) {
        clearTimeout(programmaticScrollTimeoutRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <article className="flex w-full justify-center px-5 pb-25 pt-5">
        <div className="h-[720px] w-full max-w-[1200px] animate-pulse rounded-2xl bg-card" />
      </article>
    );
  }

  if (isError || !character) {
    return (
      <article className="flex w-full justify-center px-5 pb-25 pt-5">
        <p className="body-2 text-font-2">{t("loadFailed")}</p>
      </article>
    );
  }

  const openChatStartModal = () => {
    openModal("CHATTING_START", {
      scenarioList: character.scenarios,
      currentScenario,
      setCurrentScenario: () => undefined,
    });
  };

  // 이미지 선택은 왼쪽 썸네일과 중앙 슬라이드 버튼이 같은 상태를 공유하도록 상위에서 관리합니다.
  const selectedImage =
    selectedImageIndex < character.images.length
      ? character.images[selectedImageIndex]
      : undefined;
  const shouldShowImageCta = selectedImageIndex >= character.images.length;
  const moveSelectedImage = (direction: "previous" | "next") => {
    setSelectedImageIndex((prevIndex) => {
      const imageCount = character.images.length;

      if (imageCount === 0) return 0;

      return direction === "previous"
        ? Math.max(prevIndex - 1, 0)
        : Math.min(prevIndex + 1, imageCount);
    });
  };

  return (
    <article className="flex w-full justify-center px-5 pb-25 pt-5">
      <div className="grid w-full max-w-[1200px] grid-cols-[389px_minmax(0,782px)] gap-[27px]">
        <SidebarSummary
          character={character}
          onSelectImage={setSelectedImageIndex}
          onStartChat={openChatStartModal}
        />

        <main className="flex min-w-0 flex-col">
          <div className="sticky top-0 z-[1] bg-dark">
            <DetailTabs
              commentsCount={character.comments.length}
              currentTab={currentTab}
              onChange={handleTabChange}
            />
          </div>

          <div className="mt-6 flex flex-col gap-16">
            <section
              ref={settingsRef}
              id="character-detail-settings"
              className="scroll-mt-18"
            >
              <SettingsPanel
                character={character}
                isImageCtaVisible={shouldShowImageCta}
                onNextImage={() => moveSelectedImage("next")}
                onPreviousImage={() => moveSelectedImage("previous")}
                onStartChat={openChatStartModal}
                selectedImage={selectedImage}
              />
            </section>
            <section
              ref={scenarioRef}
              id="character-detail-scenario"
              className="scroll-mt-18"
            >
              <ScenarioPanel character={character} />
            </section>
            <section
              ref={commentsRef}
              id="character-detail-comments"
              className="scroll-mt-18"
            >
              <CommentsPanel character={character} />
            </section>
          </div>
        </main>
      </div>
    </article>
  );
};

export default CharacterDetailContent;
