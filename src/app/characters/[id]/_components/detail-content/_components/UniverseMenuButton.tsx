"use client";

import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import UniverseMenuPopover from "@/components/popover/UniverseMenuPopover";
import { DotsVertical } from "@/icons";
import { useModalStore } from "@/store/useModalStore";

interface UniverseMenuButtonProps {
  universeId: string;
}

/** 찜 버튼 옆 더보기(⋯). 지금은 신고 하나뿐이지만 공유 등 세계관 단위 동작이 여기에 붙는다. */
const UniverseMenuButton = ({ universeId }: UniverseMenuButtonProps) => {
  const t = useTranslations("characterDetail");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useModalStore((state) => state.openModal);

  const closePopover = () => setIsOpen(false);

  // 비로그인이면 모달 스토어가 신고 대신 로그인 창을 연다.
  const handleReport = () => {
    openModal("REPORT", { targetType: "UNIVERSE", targetId: universeId });
  };

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t("universeMenu")}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        title={t("universeMenu")}
        className="flex size-[52px] items-center justify-center rounded-2xl bg-card text-font-2 transition-colors hover:bg-card-hover"
      >
        <DotsVertical className="size-5" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <UniverseMenuPopover
            onClose={closePopover}
            triggerRef={triggerRef}
            onReport={handleReport}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UniverseMenuButton;
