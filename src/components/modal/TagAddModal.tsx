import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import { CharacterCreateFormValues } from "@/type/character";
import { ModalLayout } from "../ModalLayout";
import Tag from "@/icons/Tag";
import { ArrowRight, Close, Megaphone, Search } from "@/icons";
import ActiveButton from "../ActiveButton";
import TagSuggestionsModal from "./TagSuggestionsModal";
import { useHashtagListQuery } from "@/api/hashtag/getHashtagList";
import useToggle from "@/hooks/useToggle";

interface TagAddModalProps {
  onClose: () => void;
}

const TagAddModal = ({ onClose }: TagAddModalProps) => {
  const { control, setValue } = useFormContext<CharacterCreateFormValues>();

  const currentTagsWatch = useWatch({ control, name: "tagList" });
  // 1. 모달 내부 임시 상태 (문자열 배열)
  const [localSelectedNames, setLocalSelectedNames] = useState<string[]>(() => {
    const currentTags = currentTagsWatch || [];
    return currentTags.map((t) => t.name);
  });

  const [searchKeyword, setSearchKeyword] = useState("");

  // 2. API 데이터 가져오기 (string[])
  const { data: hashtagListData } = useHashtagListQuery();
  const hashtagList = hashtagListData?.tags || [];

  // 3. 필터링 및 정렬 로직
  const filteredTags = hashtagList
    .filter((name) => name.toLowerCase().includes(searchKeyword.toLowerCase()))
    .sort((a, b) => {
      const aSelected = localSelectedNames.includes(a);
      const bSelected = localSelectedNames.includes(b);

      // 선택된 태그를 맨 앞으로 (-1이 우선순위 높음)
      if (aSelected !== bSelected) {
        return aSelected ? -1 : 1;
      }
      // 동일 그룹 내에서는 가나다순
      return a.localeCompare(b, "ko");
    });

  // 4. 태그 토글 핸들러
  const handleTagToggle = (name: string) => {
    const isAlreadySelected = localSelectedNames.includes(name);

    // 1. 이미 선택된 태그라면? (개수 상관없이 무조건 해제)
    if (isAlreadySelected) {
      setLocalSelectedNames((prev) => prev.filter((n) => n !== name));
      return;
    }

    // 2. 새로 선택하는데 이미 5개라면? (차단)
    if (localSelectedNames.length >= 5) {
      alert("태그는 최대 5개까지만 선택할 수 있습니다.");
      return;
    }

    // 3. 그 외의 경우 (새로운 태그 추가)
    setLocalSelectedNames((prev) => [name, ...prev]);
  };

  // 5. 완료 시 저장
  const handleComplete = () => {
    const finalTags = localSelectedNames.map((name) => ({ name }));
    setValue("tagList", finalTags, { shouldDirty: true, shouldValidate: true });
    onClose();
  };

  // const [isModal, setIsModal] = useState(false);
  // const toggleIsModal = () => setIsModal((prev) => !prev);
  const tagSuggestionsModal = useToggle();

  return (
    <ModalLayout onClose={onClose} hasBackground className="p-5 w-112.5">
      <div id="tag-manager-root" className="flex flex-col">
        <header className="flex items-center justify-between pb-6">
          <div className="flex gap-3 items-center">
            <Tag aria-hidden="true" />
            <h2 className="text-[20px] font-semibold">태그</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 flex items-center justify-center w-5.5 h-5.5 rounded-lg hover:bg-btn-hover"
          >
            <Close className="w-3.5 h-3.5" />
          </button>
        </header>

        <div className="relative flex items-center group w-full pb-3">
          <input
            id="search-input"
            type="text"
            value={searchKeyword}
            className="bg-bg-darker text-sm border border-border-main w-full h-10 px-4 pl-10 rounded-xl focus:outline-none transition-all placeholder:text-font-disabled focus:border-font-1"
            placeholder="검색어를 입력하세요"
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <label
            htmlFor="search-input"
            className="absolute left-4 pointer-events-none"
          >
            <Search className="text-font-disabled w-4.5 h-4.5" />
          </label>
        </div>

        <nav id="tag-list-wrapper">
          <ul className="bg-bg-darker rounded-xl flex gap-y-2 gap-x-2.5 p-2.5 flex-wrap max-h-85 min-h-85 overflow-auto">
            {filteredTags.map((name) => {
              const isSelected = localSelectedNames.includes(name);
              return (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => handleTagToggle(name)}
                    className={cn(
                      "px-1.5 py-0.75 rounded-md bg-card text-xs cursor-pointer hover:bg-card-hover transition-colors border border-transparent",
                      isSelected && "bg-brand-opacity text-brand",
                    )}
                  >
                    #{name}
                  </button>
                </li>
              );
            })}
            {filteredTags.length === 0 && (
              <p className="text-font-disabled text-xs w-full text-center py-10">
                검색 결과가 없습니다.
              </p>
            )}
          </ul>
        </nav>

        <footer className="flex gap-3 mt-4 h-10.25">
          <button
            type="button"
            onClick={tagSuggestionsModal.toggle}
            className="p-3 flex flex-1 items-center justify-between bg-card rounded-xl text-font-2 text-xs hover:bg-card-hover transition-colors"
          >
            <div className="flex gap-2 items-center">
              <Megaphone className="w-4 h-4" />
              <span>원하는 해시태그가 없나요?</span>
            </div>
            <ArrowRight className="w-3 h-3" />
          </button>

          <ActiveButton
            onClick={handleComplete}
            text="완료"
            isActive
            className="h-full px-5 py-2.25 w-fit rounded-xl text-sm"
          />
        </footer>
      </div>
      {tagSuggestionsModal.isOpen && (
        <TagSuggestionsModal onClose={tagSuggestionsModal.toggle} />
      )}
    </ModalLayout>
  );
};

export default TagAddModal;
