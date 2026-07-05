"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import CommentMenuPopover from "@/components/popover/CommentMenuPopover";
import { Dots } from "@/icons";

interface CommentMenuButtonProps {
  isMine?: boolean;
}

const CommentMenuButton = ({ isMine }: CommentMenuButtonProps) => {
  const t = useTranslations("characterDetail");
  // 각 댓글의 Dots 버튼을 팝오버 위치 기준으로 사용하기 위해 버튼 ref를 따로 보관합니다.
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const closePopover = () => setIsOpen(false);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex size-6 items-center justify-center text-font-2"
        aria-label={t("commentMenu")}
      >
        <Dots className="size-5" />
      </button>

      {isOpen && (
        <CommentMenuPopover
          isMine={isMine}
          onClose={closePopover}
          triggerRef={triggerRef}
          onDelete={() => null}
          onEdit={() => null}
          onReport={() => null}
        />
      )}
    </div>
  );
};

export default CommentMenuButton;
