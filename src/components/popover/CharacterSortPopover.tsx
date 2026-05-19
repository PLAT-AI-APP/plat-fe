import React from "react";
import { cn } from "@/lib/utils";
import Check from "@/icons/Check";
import { PopoverLayout } from "./layout";

const SORT_OPTIONS = ["최신순", "채팅순"] as const;

interface CharacterSortPopoverProps {
  /** 현재 선택된 정렬 기준 값 */
  value: (typeof SORT_OPTIONS)[number];
  /** 정렬 기준이 변경되었을 때 호출될 콜백 함수 */
  onChange: (newSort: (typeof SORT_OPTIONS)[number]) => void;
  /** Popover를 닫기 위한 함수 */
  onClose: () => void;
  /** 부모의 버튼 위치를 참조하기 위한 Ref */
  triggerRef: React.RefObject<HTMLButtonElement>;
}
const CharacterSortPopover = ({
  value,
  onChange,
  onClose,
  triggerRef,
}: CharacterSortPopoverProps) => {
  const handleSort = (option: (typeof SORT_OPTIONS)[number]) => {
    onChange(option); // 부모에게 변경 알림 (여기서 API 재호출 트리거 발생)
    onClose(); // 선택 후 닫기
  };

  return (
    <PopoverLayout onClose={onClose} triggerRef={triggerRef}>
      <nav>
        <ul className="flex flex-col gap-1 text-nowrap" role="listbox">
          {SORT_OPTIONS.map((option) => {
            const isSelected = value === option; // prop으로 받은 value 사용
            return (
              <li
                key={option}
                role="option"
                aria-selected={isSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort(option);
                }}
                className={cn(
                  "hover:bg-btn-hover w-33.5 body-4 flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer",
                  isSelected && "title-5 text-brand",
                )}
              >
                {option}
                {isSelected && <Check className="w-4 h-4 text-brand" />}
              </li>
            );
          })}
        </ul>
      </nav>
    </PopoverLayout>
  );
};

export default CharacterSortPopover;
