"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface PopoverMenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  danger?: boolean;
  hidden?: boolean;
}

interface PopoverMenuListProps {
  items: PopoverMenuItem[];
  onClose: () => void;
  /** 팝오버마다 다른 패딩·너비 등, 항목 버튼에만 적용할 클래스 */
  itemClassName?: string;
  menuClassName?: string;
}

/**
 * 아이콘 + 라벨 액션 목록을 렌더링하는 팝오버 메뉴.
 * 액션 실행 후 팝오버를 닫는 동작을 한 곳에서 관리합니다.
 */
const PopoverMenuList = ({
  items,
  onClose,
  itemClassName,
  menuClassName,
}: PopoverMenuListProps) => {
  const handleAction = (action?: () => void) => {
    action?.();
    onClose();
  };

  return (
    <menu className={cn("flex flex-col gap-1", menuClassName)}>
      {items
        .filter((item) => !item.hidden)
        .map(({ key, icon, label, onClick, danger }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleAction(onClick)}
            className={cn(
              "flex items-center gap-2 text-left body-5 transition-colors hover:bg-btn-hover",
              danger && "text-danger",
              itemClassName,
            )}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
    </menu>
  );
};

export default PopoverMenuList;
