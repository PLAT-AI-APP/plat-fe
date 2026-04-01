"use client";
import React, { useRef, useState } from "react";
import { ModalLayout } from "@/components/ModalLayout";
import { Dots, Edit, Pin, Trash } from "@/icons";

const ChattingItemMenu = () => {
  const [isMenu, setIsMenu] = useState(false);
  const localTriggerRef = useRef<HTMLButtonElement>(null);

  const toggleIsMenu = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsMenu((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenu(false);
  };

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeMenu();
  };

  return (
    <nav className="relative h-6">
      <button
        ref={localTriggerRef}
        onClick={toggleIsMenu}
        className="hover:text-font-1 transition-colors"
        aria-label="채팅 아이템 메뉴 열기"
      >
        <Dots className="w-6 h-6" />
      </button>

      {isMenu && (
        <ModalLayout
          onClose={closeMenu}
          triggerRef={localTriggerRef}
          className="min-w-32"
        >
          <menu
            id="chat-item-popover"
            className="flex flex-col gap-1 text-font-1 whitespace-nowrap"
            onClick={(e) => e.stopPropagation()}
          >
            <li>
              <button
                onClick={handleAction}
                className="w-full hover:bg-btn-hover rounded-lg p-1.5 flex gap-2 font-medium text-sm"
              >
                <Pin className="w-5 h-5" /> 고정
              </button>
            </li>
            <li>
              <button
                onClick={handleAction}
                className="w-full hover:bg-btn-hover rounded-lg p-1.5 flex gap-2 font-medium text-sm"
              >
                <Edit className="w-5 h-5" /> 이름 변경
              </button>
            </li>
            <li>
              <button
                onClick={handleAction}
                className="w-full hover:bg-btn-hover rounded-lg p-1.5 flex gap-2 font-medium text-sm text-font-accents"
              >
                <Trash className="w-5 h-5" /> 삭제
              </button>
            </li>
          </menu>
        </ModalLayout>
      )}
    </nav>
  );
};

export default ChattingItemMenu;
