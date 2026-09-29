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

/** 약관 한 편(마크다운)과 같은 종류로 이미 시행된 버전 목록(시행일 늦은 순). */
export interface PublicTerms {
  documentId: string;
  documentType: TermsDocumentType;
  version: string;
  effectiveAt: string;
  content: string;
  history: TermsHistoryItem[];
}

const getTerms = async (type: TermsDocumentType, documentId?: string) => {
  const response = await axiosInstance.get<PublicTerms>(
    documentId ? `/terms/documents/${documentId}` : `/terms/${type}`,
  );

  return response.data;
};

/**
 * 약관 원문. 문서 id 를 주면 그 버전(이미 시행된 것만)을, 없으면 지금 시행 중인 버전을 읽는다.
 * 로그인 없이 부른다. 약관은 자주 바뀌지 않아 한 번 받으면 오래 쓴다.
 */
export const useTermsQuery = (type: TermsDocumentType, documentId?: string) =>
  useQuery<PublicTerms, AppError>({
    queryKey: ["terms", type, documentId ?? "current"],
    queryFn: () => getTerms(type, documentId),
    staleTime: 10 * 60_000,
  });
