import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { CharacterCreateFormValues } from "@/type/character";
import { ModalLayout } from "../ModalLayout";
import Tag from "@/icons/Tag";
import { ArrowRight, Close, Megaphone, Search } from "@/icons";
import ActiveButton from "../ActiveButton";
import TagSuggestionsModal from "./TagSuggestionsModal";

interface TagAddModalProps {
  onClose: () => void;
}

const TagAddModal = ({ onClose }: TagAddModalProps) => {
  const { watch, setValue } = useFormContext<CharacterCreateFormValues>();

  // 초기 상태 설정 (선택된 태그는 맨 앞으로, 나머지는 사전순 정렬)
  const [tagList, setTagList] = useState(() => {
    const currentTags = watch("tagList") || [];
    const baseTags = TAG_LIST_MOCK.map((tag) => ({
      ...tag,
      isSelected: currentTags.some((t) => t.name === tag.name),
    }));

    const selected = baseTags.filter((t) => t.isSelected);
    const unselected = baseTags
      .filter((t) => !t.isSelected)
      .sort((a, b) => a.name.localeCompare(b.name, "ko"));

    return [...selected, ...unselected];
  });

  const [searchKeyword, setSearchKeyword] = useState("");

  // 파생 데이터: 검색 필터링
  const filteredTags = tagList.filter((tag) =>
    tag.name.includes(searchKeyword),
  );

  // 폼 동기화 (isSelected가 true인 아이템만 객체 형태로 setValue)
  useEffect(() => {
    const selectedTagNames = tagList
      .filter((tag) => tag.isSelected)
      .map((tag) => ({ name: tag.name }));

    setValue("tagList", selectedTagNames);
  }, [tagList, setValue]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  // 태그 토글 핸들러 (최대 5개 제한 및 정렬 로직 포함)
  const handleTagToggle = (name: string) => {
    setTagList((prev) => {
      const targetTag = prev.find((v) => v.name === name);
      if (!targetTag) return prev;

      const selectedCount = prev.filter((t) => t.isSelected).length;

      // 최대 5개 제한 체크 (현재 미선택 상태에서 선택하려고 할 때만 체크)
      if (!targetTag.isSelected && selectedCount >= 5) {
        alert("태그는 최대 5개까지만 선택할 수 있습니다.");
        return prev;
      }

      // 전체 리스트에서 해당 태그의 isSelected 상태 반전
      const updatedList = prev.map((tag) =>
        tag.name === name ? { ...tag, isSelected: !tag.isSelected } : tag,
      );

      // 선택된 태그와 선택되지 않은 태그 분리
      const selected = updatedList.filter((t) => t.isSelected);
      const unselected = updatedList
        .filter((t) => !t.isSelected)
        .sort((a, b) => a.name.localeCompare(b.name, "ko")); // 나머지 태그만 사전순 정렬

      // 선택된 태그를 맨 앞으로 배치하여 반환
      return [...selected, ...unselected];
    });
  };

  const [isModal, setIsModal] = useState(false);
  const toggleIsModal = () => {
    setIsModal((prev) => !prev);
  };
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
            aria-label="모달 닫기"
            className="p-1 flex items-center justify-center w-5.5 h-5.5 rounded-lg hover:bg-btn-hover"
          >
            <Close className="w-3.5 h-3.5" />
          </button>
        </header>

        <div
          id="tag-search-form"
          role="search"
          className="relative flex items-center group w-full pb-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            id="search-input"
            type="text"
            value={searchKeyword}
            className="bg-bg-darker text-sm border cursor-pointer border-border-main w-full h-10 px-4 pl-10 rounded-xl focus:outline-none transition-all placeholder:text-font-disabled focus:cursor-text focus:border-font-1"
            placeholder="검색어를 입력하세요"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <label
            htmlFor="search-input"
            className="absolute left-4 cursor-pointer pointer-events-none"
          >
            <Search className="text-font-disabled w-4.5 h-4.5" />
          </label>
        </div>

        <nav id="tag-list-wrapper">
          <ul className="bg-bg-darker rounded-xl flex gap-y-2 gap-x-2.5 p-2.5 flex-wrap max-h-85 min-h-85 overflow-auto">
            {filteredTags.map(({ id, isSelected, name }) => (
              <li key={id}>
                <button
                  type="button"
                  className={cn(
                    "px-0.75 py-1.5 rounded-md bg-card text-xs cursor-pointer hover:bg-card-hover transition-colors",
                    isSelected && "bg-brand-opacity text-brand font-medium",
                  )}
                  onClick={() => handleTagToggle(name)}
                >
                  #{name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <footer className="flex gap-3 mt-4 h-10.25">
          <button
            type="button"
            onClick={toggleIsModal}
            className="p-3 flex flex-1 items-center justify-between bg-card rounded-xl text-font-2 text-xs hover:bg-card-hover transition-colors"
          >
            <div className="flex gap-2 items-center">
              <Megaphone className="w-4 h-4" />
              <span>원하는 해시태그가 없나요?</span>
            </div>
            <ArrowRight className="w-3 h-3" />
          </button>

          <ActiveButton
            onClick={onClose}
            text="완료"
            isActive
            className="h-full px-5 py-2.25 w-fit rounded-xl text-sm"
          />
        </footer>
      </div>
      {isModal && <TagSuggestionsModal onClose={toggleIsModal} />}
    </ModalLayout>
  );
};

export default TagAddModal;

export const TAG_LIST_MOCK = [
  { id: "tag-1", name: "취미", isSelected: false },
  { id: "tag-2", name: "여행", isSelected: false },
  { id: "tag-3", name: "요리", isSelected: false },
  { id: "tag-4", name: "운동", isSelected: false },
  { id: "tag-5", name: "공부", isSelected: false },
  { id: "tag-6", name: "친구", isSelected: false },
  { id: "tag-7", name: "학교생활", isSelected: false },
  { id: "tag-8", name: "아침루틴", isSelected: false },
  { id: "tag-9", name: "카페", isSelected: false },
  { id: "tag-10", name: "독서", isSelected: false },
  { id: "tag-11", name: "반려동물", isSelected: false },
  { id: "tag-12", name: "쇼핑", isSelected: false },
  { id: "tag-13", name: "맛집탐방", isSelected: false },
  { id: "tag-14", name: "데이트", isSelected: false },
  { id: "tag-15", name: "운동회", isSelected: false },
  { id: "tag-16", name: "주말", isSelected: false },
  { id: "tag-17", name: "사진", isSelected: false },
  { id: "tag-18", name: "영화감상", isSelected: false },
  { id: "tag-19", name: "음악", isSelected: false },
  { id: "tag-20", name: "드라마", isSelected: false },
  { id: "tag-21", name: "휴가", isSelected: false },
  { id: "tag-22", name: "취업준비", isSelected: false },
  { id: "tag-23", name: "캠핑", isSelected: false },
  { id: "tag-24", name: "산책", isSelected: false },
  { id: "tag-25", name: "자전거", isSelected: false },
  { id: "tag-26", name: "요가", isSelected: false },
  { id: "tag-27", name: "축제", isSelected: false },
  { id: "tag-28", name: "미술관", isSelected: false },
  { id: "tag-29", name: "공원", isSelected: false },
  { id: "tag-30", name: "책읽기", isSelected: false },
  { id: "tag-31", name: "꽃구경", isSelected: false },
  { id: "tag-32", name: "영화관", isSelected: false },
  { id: "tag-33", name: "카페투어", isSelected: false },
  { id: "tag-34", name: "운동복", isSelected: false },
  { id: "tag-35", name: "아침식사", isSelected: false },
  { id: "tag-36", name: "저녁일상", isSelected: false },
  { id: "tag-37", name: "반려식물", isSelected: false },
  { id: "tag-38", name: "퀴즈", isSelected: false },
  { id: "tag-39", name: "친목모임", isSelected: false },
  { id: "tag-40", name: "웹툰", isSelected: false },
  { id: "tag-41", name: "취미생활", isSelected: false },
  { id: "tag-42", name: "베이킹", isSelected: false },
  { id: "tag-43", name: "인스타그램", isSelected: false },
  { id: "tag-44", name: "플랜테리어", isSelected: false },
  { id: "tag-45", name: "홈카페", isSelected: false },
  { id: "tag-46", name: "산책로", isSelected: false },
  { id: "tag-47", name: "명상", isSelected: false },
  { id: "tag-48", name: "방꾸미기", isSelected: false },
  { id: "tag-49", name: "영화추천", isSelected: false },
  { id: "tag-50", name: "음악감상", isSelected: false },
  { id: "tag-51", name: "드로잉", isSelected: false },
  { id: "tag-52", name: "퍼즐", isSelected: false },
  { id: "tag-53", name: "일기쓰기", isSelected: false },
  { id: "tag-54", name: "재테크", isSelected: false },
  { id: "tag-55", name: "꽃사진", isSelected: false },
  { id: "tag-56", name: "패션", isSelected: false },
  { id: "tag-57", name: "뷰티", isSelected: false },
  { id: "tag-58", name: "운동후기", isSelected: false },
  { id: "tag-59", name: "요리레시피", isSelected: false },
  { id: "tag-60", name: "친구만남", isSelected: false },
  { id: "tag-61", name: "새벽감성", isSelected: false },
  { id: "tag-62", name: "명화감상", isSelected: false },
  { id: "tag-63", name: "요가수련", isSelected: false },
  { id: "tag-64", name: "바다산책", isSelected: false },
  { id: "tag-65", name: "도서관", isSelected: false },
  { id: "tag-66", name: "커피", isSelected: false },
  { id: "tag-67", name: "산속여행", isSelected: false },
  { id: "tag-68", name: "미니멀라이프", isSelected: false },
  { id: "tag-69", name: "공연", isSelected: false },
  { id: "tag-70", name: "아날로그", isSelected: false },
  { id: "tag-71", name: "DIY", isSelected: false },
  { id: "tag-72", name: "마이노트", isSelected: false },
];
