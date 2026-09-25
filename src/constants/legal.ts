// 약관·정책 문서 링크 (자체 페이지가 생기기 전까지 Notion 공개 페이지를 쓴다)
export const LEGAL_LINKS = {
  terms:
    "https://bloom-shawl-3f7.notion.site/PLAT-36f1c900ce3e8073805de6e7e8e6cfbf?source=copy_link",
  privacy:
    "https://bloom-shawl-3f7.notion.site/PLAT-3721c900ce3e800bac34c38d68e1a682?source=copy_link",
  ageOver14:
    "https://bloom-shawl-3f7.notion.site/PLAT-3721c900ce3e80c3bb36c3e32a0f08b1?source=copy_link",
} as const;

// 사업자 정보 중 번역이 필요 없는 값. 빈 문자열이면 푸터에 표시하지 않는다.
export const BUSINESS_INFO = {
  registrationNumber: "227-40-01411",
  phone: "",
  mailOrderNumber: "",
} as const;
