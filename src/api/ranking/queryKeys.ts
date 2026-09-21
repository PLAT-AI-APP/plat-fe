/**
 * 랭킹 관련 캐시 키의 단일 출처.
 *
 * 세계관을 찜하거나 취소하면 찜 수가 실린 랭킹도 다시 받아야 한다. 무효화하는 쪽이 접두사를
 * 문자열로 따로 적으면 조회 쪽 키가 바뀔 때 조용히 어긋나므로, 둘 다 같은 루트에서 파생시킨다.
 */
const rankingRootKey = ["get-ranking"] as const;

interface RankingKeyParams {
  locale: string;
  tendency: string;
  period?: string;
  sort?: string;
  scope?: string;
  page?: number;
  size?: number;
}

export const rankingQueryKeys = {
  /** 모든 랭킹(언어·성향·기간과 무관). 찜 수가 바뀐 뒤 통째로 무효화할 때 씁니다. */
  all: () => rankingRootKey,
  list: ({ locale, tendency, period, sort, scope, page, size }: RankingKeyParams) =>
    [...rankingRootKey, locale, tendency, period, sort, scope, page, size] as const,
};
