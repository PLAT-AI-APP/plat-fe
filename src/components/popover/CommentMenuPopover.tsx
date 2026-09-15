"use client";

import React from "react";
import { Edit, Flag, Trash } from "@/icons";
import { useTranslations } from "next-intl";
import { PopoverLayout } from "./layout";
import PopoverMenuList from "./PopoverMenuList";

interface CommentMenuPopoverProps {
  /** 댓글 작성자 본인 여부 (본인이면 수정/삭제 노출) */
  isMine?: boolean;
  /** 세계관 제작자 본인 여부. 본인 댓글이 아니어도 제작자는 자기 상세페이지의 댓글을 삭제할 수 있다. */
  isCreatorViewer?: boolean;
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
  isCreatorViewer,
  onEdit,
  onDelete,
  onReport,
  onClose,
  triggerRef,
}: CommentMenuPopoverProps) => {
  const t = useTranslations("popover");

  const deleteItem = {
    key: "delete",
    icon: <Trash className="w-5 h-5" />,
    label: t("delete"),
    onClick: onDelete,
    danger: true,
  };
  const reportItem = {
    key: "report",
    icon: <Flag className="w-5 h-5 text-font-2" />,
    label: t("report"),
    onClick: onReport,
  };

  const items = isMine
    ? [
        {
          key: "edit",
          icon: <Edit className="w-5 h-5 text-font-2" />,
          label: t("edit"),
          onClick: onEdit,
        },
        deleteItem,
      ]
    : isCreatorViewer
      ? [deleteItem, reportItem]
      : [reportItem];

  return (
    <PopoverLayout onClose={onClose} triggerRef={triggerRef}>
      <PopoverMenuList
        onClose={onClose}
        menuClassName="min-w-32"
        itemClassName="whitespace-nowrap rounded-lg p-1.5"
        items={items}
      />
    </PopoverLayout>
  );
};

export default CommentMenuPopover;
