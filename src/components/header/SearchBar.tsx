import { Search } from "@/icons";

export const SearchBar = () => (
  <div className="relative flex items-center group">
    <input
      className="peer border cursor-pointer border-border-main w-[260px] h-10 px-4 pl-10 rounded-xl focus:outline-none focus:pl-4 transition-all placeholder:text-font2 focus:cursor-text"
      placeholder="검색어를 입력하세요"
    />
    <div className="absolute left-4 pointer-events-none peer-focus:hidden">
      <Search className="text-font2" />
    </div>
  </div>
);
