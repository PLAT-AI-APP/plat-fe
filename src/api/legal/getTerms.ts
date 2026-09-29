import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import type { AppError } from "@/type/api";

export type TermsDocumentType =
  | "TERMS_OF_SERVICE"
  | "PRIVACY_POLICY"
  | "YOUTH_PROTECTION";

export interface TermsHistoryItem {
  documentId: string;
  documentType: TermsDocumentType;
  version: string;
  effectiveAt: string;
}

/** 서버의 언어 코드(대문자). 앱 로케일을 대문자로 바꾼 값과 같다. */
export type TermsLanguage = "KO" | "EN" | "JA" | "ZH" | "TH" | "VI";

/** 약관 한 편(마크다운)과 같은 종류로 이미 시행된 버전 목록(시행일 늦은 순). */
export interface PublicTerms {
  documentId: string;
  documentType: TermsDocumentType;
  version: string;
  effectiveAt: string;
  /** content 의 언어. 요청한 언어의 번역본이 없으면 원문 언어(KO)다. */
  language: TermsLanguage;
  content: string;
  /** 이 버전을 볼 수 있는 언어. 원문 KO 가 먼저 온다. */
  availableLanguages: TermsLanguage[];
  history: TermsHistoryItem[];
}

const getTerms = async (
  type: TermsDocumentType,
  documentId: string | undefined,
  lang: string,
) => {
  const response = await axiosInstance.get<PublicTerms>(
    documentId ? `/terms/documents/${documentId}` : `/terms/${type}`,
    { params: { lang } },
  );

  return response.data;
};

/**
 * 약관 원문. 문서 id 를 주면 그 버전(이미 시행된 것만)을, 없으면 지금 시행 중인 버전을 읽는다.
 * lang(ko·en…) 번역본이 없으면 서버가 한국어 원문을 준다. 로그인 없이 부르고, 자주 바뀌지 않아 한 번 받으면 오래 쓴다.
 */
export const useTermsQuery = (
  type: TermsDocumentType,
  documentId: string | undefined,
  lang: string,
) =>
  useQuery<PublicTerms, AppError>({
    queryKey: ["terms", type, documentId ?? "current", lang],
    queryFn: () => getTerms(type, documentId, lang),
    staleTime: 10 * 60_000,
  });
