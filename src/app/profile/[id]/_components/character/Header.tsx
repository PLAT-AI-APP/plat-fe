import React, { useRef, useState } from "react";
import { ModalLayout } from "@/components/ModalLayout";
import { Sort } from "@/icons";
import Check from "@/icons/Check";
import { cn } from "@/lib/utils";

// 정렬 옵션을 상수로 분리 (확장성 고려)
const SORT_OPTIONS = ["최신순", "채팅순"] as const;

interface HeaderProps {
  listCount: number;
}

const Header = ({ listCount }: HeaderProps) => {
  // 상태 및 참조 변수
  const [sort, setSort] = useState<string>("최신순");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // 정렬 선택 처리 함수 (선택 후 모달 닫기 추가)
  const handleSort = (text: string) => {
    setSort(text);
    setIsSortOpen(false);
  };

  return (
    <header className="px-2.5 py-1.5 flex justify-between items-center">
      <h2 className="text-font-2 text-sm">작품목록 {listCount}</h2>

      <div id="sort-menu-container" className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          aria-haspopup="listbox"
          aria-expanded={isSortOpen}
        >
          <Sort className="w-3.5 h-3.5" />
          {sort}
        </button>

        {isSortOpen && (
          <ModalLayout
            onClose={() => setIsSortOpen(false)}
            triggerRef={triggerRef}
          >
            <nav>
              <ul className="flex flex-col gap-1 text-nowrap" role="listbox">
                {/* map을 통한 중복 코드 제거 */}
                {SORT_OPTIONS.map((option) => {
                  const isSelected = sort === option;
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
                        "w-33.5 text-sm flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer",
                        isSelected ? "font-medium" : "hover:bg-btn-hover",
                      )}
                    >
                      {option}
                      {isSelected && <Check className="w-4 h-4 text-brand" />}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </ModalLayout>
        )}
      </div>
    </header>
  );
};

export default Header;
