/**
 * 가이드 문서(/docs) 문구. 앱 번역(next-intl, 클라이언트 언어 store)과 달리 문서는 주소의 locale 로
 * 서버에서 언어를 정하므로 따로 둔다. 키 집합은 en.ts 와 같아야 한다(DocsMessages 타입이 맞춘다).
 */
const ko = {
  siteName: "PLAT 가이드",
  serviceLabel: "가이드",
  metaDescription: "PLAT 이용 방법과 자주 묻는 질문을 안내합니다.",
  searchPlaceholder: "아티클 제목, 내용",
  searchOpen: "검색 열기",
  searchClose: "검색 닫기",
  searchEmpty: "검색 결과가 없습니다.",
  searchLoading: "검색 중…",
  searchError: "검색하지 못했습니다. 잠시 후 다시 시도해 주세요.",
  searchSeeAll: "검색 결과 모두 보기",
  searchTitle: "검색",
  searchResultHeading: "'{query}' 검색 결과",
  searchResultCount: { one: "{count}개의 아티클", other: "{count}개의 아티클" },
  searchPrompt: "찾고 싶은 내용을 입력해 주세요.",
  allCategories: "전체 카테고리",
  categoryLabel: "카테고리",
  articleCount: { one: "{count}개의 아티클", other: "{count}개의 아티클" },
  emptyHome: "아직 공개된 문서가 없습니다.",
  emptyCategory: "이 카테고리에는 아직 아티클이 없습니다.",
  tableOfContents: "이 페이지의 내용",
  updatedAt: "{date} 업데이트",
  language: "언어",
  menuOpen: "메뉴 열기",
  menuClose: "메뉴 닫기",
  expand: "펼치기",
  collapse: "접기",
  poweredBy: "Powered by PLAT",
  backToApp: "PLAT 바로가기",
  themeToLight: "라이트 모드로 보기",
  themeToDark: "다크 모드로 보기",
};

export default ko;
