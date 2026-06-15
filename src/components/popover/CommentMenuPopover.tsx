"use client";

import React from "react";
import { Edit, Flag, Trash } from "@/icons";
import { useTranslations } from "next-intl";
import { PopoverLayout } from "./layout";

interface CommentMenuPopoverProps {
  /** 댓글 작성자 본인 여부 (본인이면 수정/삭제, 아니면 신고 노출) */
  isMine?: boolean;
  /** 각 액션 발생 시 실행될 콜백 함수들 */
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
  /** 팝업 닫기 및 위치 참조 */
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}
const CommentMenuPopover = ({
  isMine,
  onEdit,
  onDelete,
  onReport,
  onClose,
  triggerRef,
}: CommentMenuPopoverProps) => {
  const t = useTranslations("popover");

  // 버튼 클릭 공통 핸들러 (동작 실행 후 팝업 닫기)
  const handleAction = (action?: () => void) => {
    action?.();
    onClose();
  };

  return (
    <PopoverLayout onClose={onClose} triggerRef={triggerRef}>
      <menu className="flex flex-col gap-1 min-w-32">
        {/* 본인이 아닐 때만 '신고' 노출 */}
        {!isMine && (
          <button
            onClick={() => handleAction(onReport)}
            className="whitespace-nowrap flex items-center gap-2 p-1.5 body-4 hover:bg-btn-hover rounded-lg transition-colors"
          >
            <Flag className="w-5 h-5 text-font-2" />
            {t("report")}
          </button>
        )}

        {/* 본인일 때만 '수정', '삭제' 노출 */}
        {isMine && (
          <>
            <button
              onClick={() => handleAction(onEdit)}
              className="whitespace-nowrap flex items-center gap-2 p-1.5 body-4 font-medium hover:bg-btn-hover rounded-lg transition-colors"
            >
              <Edit className="w-5 h-5 text-font-2" />
              {t("edit")}
            </button>
            <button
              onClick={() => handleAction(onDelete)}
              className="whitespace-nowrap flex items-center gap-2 p-1.5 body-4 font-medium hover:bg-btn-hover rounded-lg transition-colors text-font-accents"
            >
              <Trash className="w-5 h-5" />
              {t("delete")}
            </button>
          </>
        )}
      </menu>
    </PopoverLayout>
  );
};

export default CommentMenuPopover;
