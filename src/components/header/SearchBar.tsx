import { Search } from "@/icons";

export const SearchBar = () => (
  <form
    id="search-bar-form"
    role="search"
    className="relative flex items-center group w-full"
    onSubmit={(e) => e.preventDefault()} // 엔터 시 페이지 새로고침 방지
  >
    <input
      id="search-input"
      type="text"
      className="text-sm border cursor-pointer border-border-main w-full h-10 px-4 pl-10 rounded-xl focus:outline-none transition-all placeholder:text-font-disabled focus:cursor-text focus:border-font-1"
      placeholder="검색어를 입력하세요"
    />

    {/* 아이콘 영역을 label로 감싸 클릭 시 input에 포커스가 가도록 개선 */}
    <label
      id="search-icon-wrapper"
      htmlFor="search-input"
      className="absolute left-4 cursor-pointer pointer-events-none"
    >
      <Search
        id="icon-search-glass"
        className="text-font-disabled w-4.5 h-4.5 "
      />
    </label>
  </form>
);
