import type { TermsDocumentType } from "@/api/legal/getTerms";

/**
 * 약관·정책 문서 페이지. 원문은 관리자 콘솔 > 법적 고지에서 버전으로 관리하고 서버가 내려 준다(src/app/legal).
 * 예전에는 Notion 공개 페이지로 연결했다.
 */
export const LEGAL_SLUG_TYPE = {
  terms: "TERMS_OF_SERVICE",
  privacy: "PRIVACY_POLICY",
  youth: "YOUTH_PROTECTION",
} as const satisfies Record<string, TermsDocumentType>;

export type LegalSlug = keyof typeof LEGAL_SLUG_TYPE;

export const LEGAL_LINKS = {
  terms: "/legal/terms",
  privacy: "/legal/privacy",
  // 가입의 "만 14세 이상" 항목은 청소년 보호 정책으로 잇는다.
  ageOver14: "/legal/youth",
  youth: "/legal/youth",
} as const;

// 사업자 정보 중 번역이 필요 없는 값. 빈 문자열이면 푸터에 표시하지 않는다.
export const BUSINESS_INFO = {
  registrationNumber: "227-40-01411",
  phone: "",
  mailOrderNumber: "",
} as const;
